import {
  inferSystemFromLegacy,
  normalizeCoreId,
  type ArcadeCoreId,
  type ArcadeSystemId,
} from "./cores"
import { detectSystemBySetName } from "./detectRom"

export type ArcadeKind = "rom" | "bios"

export type ArcadeRecord = {
  id: string
  displayName: string
  core: ArcadeCoreId
  system: ArcadeSystemId
  kind: ArcadeKind
  extraIds: string[]
  data: ArrayBuffer
  size: number
  installedAt: number
}

export type ArcadeSaveSlot = {
  id: string
  romId: string
  index: number
  state: ArrayBuffer
  image: string
  date: string
}

export type CachedCore = {
  id: ArcadeCoreId
  version: string
  js: ArrayBuffer
  wasm: ArrayBuffer
  size: number
  installedAt: number
}

const DB_NAME = "ArcadeRomStore"
const DB_VERSION = 2
const STORE_ROMS = "roms"
const STORE_SAVES = "saves"
const STORE_CORES = "cores"

let dbPromise: Promise<IDBDatabase> | null = null

function assertClient() {
  if (typeof window === "undefined") throw new Error("not_in_browser")
  if (typeof indexedDB === "undefined") throw new Error("indexeddb_unavailable")
}

export function normalizeZipName(name: string) {
  return name.trim().split(/[/\\]/).pop()?.toLowerCase() || "game.zip"
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

async function openDB() {
  assertClient()
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error?.name || "indexedDB_open_error")
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_ROMS)) {
        const roms = db.createObjectStore(STORE_ROMS, { keyPath: "id" })
        roms.createIndex("kind", "kind", { unique: false })
        roms.createIndex("core", "core", { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_SAVES)) {
        const saves = db.createObjectStore(STORE_SAVES, { keyPath: "id" })
        saves.createIndex("romId", "romId", { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_CORES)) {
        db.createObjectStore(STORE_CORES, { keyPath: "id" })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })

  return dbPromise
}

function requestToPromise<T>(req: IDBRequest<T>, tx: IDBTransaction) {
  return new Promise<T>((resolve, reject) => {
    req.onerror = () => reject(req.error?.name || "indexedDB_error")
    tx.oncomplete = () => resolve(req.result)
  })
}

function normalizeRecord(record: ArcadeRecord): ArcadeRecord {
  const setName = record.id.replace(/\.zip$/i, "")
  return {
    ...record,
    core: normalizeCoreId(record.core),
    system:
      record.system ||
      detectSystemBySetName(setName) ||
      inferSystemFromLegacy(record.core, record.id),
  }
}

export async function listArcadeRecords() {
  const db = await openDB()
  const tx = db.transaction(STORE_ROMS, "readonly")
  const list = (await requestToPromise(
    tx.objectStore(STORE_ROMS).getAll(),
    tx
  )) as ArcadeRecord[]
  return list.map(normalizeRecord)
}

export async function getArcadeRecord(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORE_ROMS, "readonly")
  const record = (await requestToPromise(
    tx.objectStore(STORE_ROMS).get(id),
    tx
  )) as ArcadeRecord | undefined
  return record ? normalizeRecord(record) : undefined
}

export async function putArcadeRecord(record: ArcadeRecord) {
  const db = await openDB()
  const tx = db.transaction(STORE_ROMS, "readwrite")
  await requestToPromise(tx.objectStore(STORE_ROMS).put(record), tx)
}

export async function deleteArcadeRecord(id: string) {
  const db = await openDB()
  const romTx = db.transaction(STORE_ROMS, "readwrite")
  await requestToPromise(romTx.objectStore(STORE_ROMS).delete(id), romTx)

  const saves = await listSaveSlots(id)
  if (!saves.length) return
  const saveTx = db.transaction(STORE_SAVES, "readwrite")
  const store = saveTx.objectStore(STORE_SAVES)
  saves.forEach(slot => store.delete(slot.id))
  await new Promise<void>((resolve, reject) => {
    saveTx.oncomplete = () => resolve()
    saveTx.onerror = () => reject(saveTx.error)
  })
}

function zipBaseName(name: string) {
  return name.replace(/\\/g, "/").split("/").pop() || ""
}

async function flattenNestedZip(data: ArrayBuffer) {
  const mod = await import("jszip")
  const JSZip = (mod as any).default || mod
  const zip = await JSZip.loadAsync(data)
  const files = Object.values(zip.files) as {
    dir: boolean
    name: string
    async: (type: string) => Promise<ArrayBuffer | Uint8Array>
  }[]
  const entries = files.filter(f => !f.dir)
  if (!entries.length) return data

  const DOC_EXT = /\.(txt|md|nfo|url|html?|jpg|jpeg|png|gif|webp|pdf)$/i
  const useful = entries.filter(f => !DOC_EXT.test(zipBaseName(f.name)))
  const innerZips = useful.filter(f => zipBaseName(f.name).toLowerCase().endsWith(".zip"))
  if (innerZips.length === 1 && useful.length === 1) {
    return innerZips[0].async("arraybuffer") as Promise<ArrayBuffer>
  }

  const top = new Set(
    entries.map(f => f.name.replace(/\\/g, "/").split("/").filter(Boolean)[0])
  )
  const allNested = entries.every(f => f.name.replace(/\\/g, "/").includes("/"))
  if (!allNested || top.size !== 1) return data

  const out = new JSZip()
  for (const entry of entries) {
    const base = zipBaseName(entry.name)
    if (!base) continue
    out.file(base, await entry.async("uint8array"))
  }
  return out.generateAsync({ type: "arraybuffer" })
}

export async function installArcadeFile(options: {
  file: File
  id?: string
  core?: ArcadeCoreId
  system?: ArcadeSystemId
  kind: ArcadeKind
  displayName?: string
  extraIds?: string[]
}) {
  assertClient()
  const id = normalizeZipName(options.id || options.file.name)
  if (!id.endsWith(".zip")) throw new Error("only_zip_allowed")
  const data = await flattenNestedZip(await options.file.arrayBuffer())
  const core = normalizeCoreId(options.core)
  const system =
    options.system ||
    detectSystemBySetName(id.replace(/\.zip$/i, "")) ||
    inferSystemFromLegacy(core, id)
  const record: ArcadeRecord = {
    id,
    displayName: options.displayName?.trim() || options.file.name.replace(/\.zip$/i, ""),
    core,
    system,
    kind: options.kind,
    extraIds: options.extraIds || [],
    data,
    size: data.byteLength,
    installedAt: Date.now(),
  }
  await putArcadeRecord(record)
  return record
}

export async function listSaveSlots(romId: string) {
  const db = await openDB()
  const tx = db.transaction(STORE_SAVES, "readonly")
  const index = tx.objectStore(STORE_SAVES).index("romId")
  return requestToPromise(index.getAll(romId), tx) as Promise<ArcadeSaveSlot[]>
}

export async function putSaveSlot(slot: ArcadeSaveSlot) {
  const db = await openDB()
  const tx = db.transaction(STORE_SAVES, "readwrite")
  await requestToPromise(tx.objectStore(STORE_SAVES).put(slot), tx)
}

export async function deleteSaveSlot(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORE_SAVES, "readwrite")
  await requestToPromise(tx.objectStore(STORE_SAVES).delete(id), tx)
}

export async function blobToArrayBuffer(blob: Blob) {
  return blob.arrayBuffer()
}

export async function getCachedCore(id: ArcadeCoreId) {
  const db = await openDB()
  const tx = db.transaction(STORE_CORES, "readonly")
  return requestToPromise(tx.objectStore(STORE_CORES).get(id), tx) as Promise<
    CachedCore | undefined
  >
}

export async function listCachedCores() {
  const db = await openDB()
  const tx = db.transaction(STORE_CORES, "readonly")
  return requestToPromise(tx.objectStore(STORE_CORES).getAll(), tx) as Promise<
    CachedCore[]
  >
}

export async function putCachedCore(core: CachedCore) {
  const db = await openDB()
  const tx = db.transaction(STORE_CORES, "readwrite")
  await requestToPromise(tx.objectStore(STORE_CORES).put(core), tx)
}

export async function deleteCachedCore(id: ArcadeCoreId) {
  const db = await openDB()
  const tx = db.transaction(STORE_CORES, "readwrite")
  await requestToPromise(tx.objectStore(STORE_CORES).delete(id), tx)
}
