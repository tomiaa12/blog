export type JarEntry = {
  compression_method: 0 | 8
  compressed_data: Uint8Array
  uncompressed_len: number
}

export type JarRecord = {
  jarName: string
  jar: Record<string, JarEntry>
  jad: any
  installedAt: number
}

export type LocalJarInfo = {
  jarName: string
  displayName: string
  midletClassName?: string
  iconUrl?: string
  installedAt: number
}

// ===== IndexedDB：与 main.html 的 JARStore 兼容 =====
const DB_NAME = "JARStore"
const DB_VERSION = 2
const STORE_V2 = "files_v2"
const STORE_OLD = "files"

let dbPromise: Promise<IDBDatabase> | null = null

const textDecoder = new TextDecoder("utf-8")

function assertClient() {
  if (typeof window === "undefined") throw new Error("not_in_browser")
  if (typeof indexedDB === "undefined") throw new Error("indexeddb_unavailable")
}

function guessMimeFromName(name: string) {
  const lower = name.toLowerCase()
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg"
  if (lower.endsWith(".gif")) return "image/gif"
  if (lower.endsWith(".bmp")) return "image/bmp"
  return "application/octet-stream"
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

async function inflateRaw(data: Uint8Array, expectedLen?: number) {
  const DecompressionStreamCtor = (globalThis as any).DecompressionStream
  if (!DecompressionStreamCtor) return null
  try {
    const ds = new DecompressionStreamCtor("deflate-raw")
    const stream = new Blob([toArrayBuffer(data)]).stream().pipeThrough(ds)
    const ab = await new Response(stream).arrayBuffer()
    const out = new Uint8Array(ab)
    // 即使长度不完全匹配也返回，图标容错处理
    if (expectedLen && expectedLen !== out.length) {
      return out
    }
    return out
  } catch {
    return null
  }
}

async function loadFileFromLocalJar(jar: Record<string, JarEntry>, fileName: string) {
  const entry = jar[fileName]
  if (!entry) return null
  const bytes = new Uint8Array(entry.compressed_data as any)
  switch (entry.compression_method) {
    case 0:
      return bytes
    case 8:
      return await inflateRaw(bytes, entry.uncompressed_len)
    default:
      return null
  }
}

function parseManifest(manifestText: string) {
  const manifest: Record<string, string> = {}
  manifestText
    .replace(/\r\n|\r/g, "\n")
    .replace(/\n /g, "")
    .split("\n")
    .forEach((entry) => {
      if (!entry) return
      const keyEnd = entry.indexOf(":")
      if (keyEnd <= 0) return
      const key = entry.substring(0, keyEnd)
      const val = entry.substring(keyEnd + 1).trim()
      manifest[key] = val
    })
  return manifest
}

function pickIconName(manifest: Record<string, string>) {
  let iconName = manifest["MIDlet-Icon"]
  const midlet1 = manifest["MIDlet-1"]
  if (!iconName && midlet1) {
    const parts = midlet1.split(",")
    if (parts[1]) iconName = parts[1].trim()
  }
  if (iconName && iconName.startsWith("/")) {
    iconName = iconName.slice(1)
  }
  return iconName
}

async function buildIconUrl(jar: Record<string, JarEntry>, iconName: string | undefined) {
  if (!iconName) return undefined
  const iconBytes = await loadFileFromLocalJar(jar, iconName)
  if (!iconBytes) return undefined
  const mime = guessMimeFromName(iconName)
  return URL.createObjectURL(new Blob([toArrayBuffer(iconBytes)], { type: mime }))
}

async function buildLocalJarInfo(record: JarRecord): Promise<LocalJarInfo> {
  let displayName = record.jarName
  let midletClassName: string | undefined
  let iconUrl: string | undefined

  const mfBytes = await loadFileFromLocalJar(record.jar, "META-INF/MANIFEST.MF")
  if (mfBytes) {
    const manifest = parseManifest(textDecoder.decode(mfBytes))
    const midlet1 = manifest["MIDlet-1"]
    if (midlet1) {
      const parts = midlet1.split(",")
      if (parts[0]) displayName = parts[0].trim()
      if (parts[2]) midletClassName = parts[2].trim()
    }
    iconUrl = await buildIconUrl(record.jar, pickIconName(manifest))
  }

  return {
    jarName: record.jarName,
    displayName,
    midletClassName,
    iconUrl,
    installedAt: record.installedAt,
  }
}

export function buildOpenJarHref(params: {
  jarName: string
  midletClassName?: string
  isLocalJar: boolean
  canvasSize?: string
  gamepadSize?: string
  gamepad?: "0" | "1"
  gameresize?: string
}) {
  const { jarName, midletClassName, isLocalJar, canvasSize, gamepadSize, gamepad, gameresize } = params

  let href = ""
  if (isLocalJar) {
    href = `/java/main.html?localjar=${encodeURIComponent(jarName)}`
  } else {
    href =
      `/java/main.html?jars=${encodeURIComponent(`jar/${jarName}`)}` +
      `&jad=&midletClassName=${encodeURIComponent(midletClassName || "")}`
  }

  if (gamepadSize) {
    href += `&gamepadSize=${encodeURIComponent(gamepadSize)}`
    href += gamepad === "0" ? "&gamepad=0" : "&gamepad=1"
  }
  if (canvasSize) href += `&canvasSize=${encodeURIComponent(canvasSize)}`
  if (gameresize) href += `&gameresize=${encodeURIComponent(gameresize)}`

  return href
}

export async function openDB(): Promise<IDBDatabase> {
  assertClient()
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error?.name || "indexedDB_open_error")
    request.onupgradeneeded = () => {
      const db = request.result
      // 兼容旧版本：如果存在旧 store 就删掉
      if (db.objectStoreNames.contains(STORE_OLD)) db.deleteObjectStore(STORE_OLD)
      if (!db.objectStoreNames.contains(STORE_V2)) db.createObjectStore(STORE_V2, { keyPath: "jarName" })
    }
    request.onsuccess = () => resolve(request.result)
  })

  return dbPromise
}

export async function getAllLocalJars(): Promise<JarRecord[]> {
  const db = await openDB()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_V2, "readonly")
    const store = tx.objectStore(STORE_V2)
    const req = store.getAll()
    req.onerror = () => reject(req.error?.name || "indexedDB_getAll_error")
    tx.oncomplete = () => resolve((req.result || []) as JarRecord[])
  })
}

export async function listLocalJarNames(): Promise<string[]> {
  const files = await getAllLocalJars()
  return files.map((f) => f.jarName)
}

export async function listLocalJarInfos(): Promise<LocalJarInfo[]> {
  const files = await getAllLocalJars()
  const result: LocalJarInfo[] = []
  for (const f of files) {
    result.push(await buildLocalJarInfo(f))
  }
  return result
}

export async function deleteLocalJarFromDB(jarName: string) {
  const db = await openDB()
  return await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_V2, "readwrite")
    const store = tx.objectStore(STORE_V2)
    const req = store.delete(jarName)
    req.onerror = () => reject(req.error?.name || "indexedDB_delete_error")
    tx.oncomplete = () => resolve()
  })
}

export async function putLocalJarToDB(jarName: string, jarDirectory: Record<string, JarEntry>) {
  const db = await openDB()
  return await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_V2, "readwrite")
    const store = tx.objectStore(STORE_V2)
    const req = store.put({
      jarName,
      jar: jarDirectory,
      jad: null,
      installedAt: Date.now(),
    } satisfies JarRecord)
    req.onerror = () => reject(req.error?.name || "indexedDB_put_error")
    tx.oncomplete = () => resolve()
  })
}

export async function installJarCompat(jarName: string, jarData: ArrayBuffer) {
  assertClient()
  // 只在客户端加载，避免 VitePress SSR 出错
  const mod = await import("jszip")
  const JSZip = (mod as any).default || mod

  const zip = await JSZip.loadAsync(jarData)
  const directory: Record<string, JarEntry> = {}

  const entries = Object.values(zip.files) as any[]
  for (const f of entries) {
    if (f.dir) continue
    const bytes: Uint8Array = await f.async("uint8array")
    directory[f.name] = {
      compression_method: 0,
      compressed_data: bytes,
      uncompressed_len: bytes.length,
    }
  }

  await putLocalJarToDB(jarName, directory)
}

export async function installJarFile(file: File) {
  assertClient()
  const name = file.name
  if (!name.toLowerCase().endsWith(".jar")) throw new Error("only_jar_allowed")
  const buf = await file.arrayBuffer()
  await installJarCompat(name, buf)
  return name
}

export function inferJarNameFromUrl(jarUrl: string, fallback = "remote.jar") {
  try {
    const u = new URL(jarUrl)
    const last = u.pathname.split("/").filter(Boolean).pop()
    return last ? decodeURIComponent(last) : fallback
  } catch {
    return fallback
  }
}

export async function fetchArrayBuffer(url: string, onProgress?: (progress: number) => void) {
  assertClient()
  const resp = await fetch(url)
  if (!resp.ok) throw new Error("HTTP " + resp.status)
  
  const contentLength = resp.headers.get("Content-Length")
  const total = contentLength ? parseInt(contentLength, 10) : 0
  
  if (!total || !resp.body) {
    // 如果没有 Content-Length 或不支持流，直接返回
    return await resp.arrayBuffer()
  }
  
  // 使用 ReadableStream 读取并报告进度
  const reader = resp.body.getReader()
  const chunks: Uint8Array[] = []
  let loaded = 0
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    chunks.push(value)
    loaded += value.length
    
    if (onProgress) {
      const progress = Math.min(100, Math.round((loaded / total) * 100))
      onProgress(progress)
    }
  }
  
  // 合并所有 chunks
  const buffer = new Uint8Array(loaded)
  let position = 0
  for (const chunk of chunks) {
    buffer.set(chunk, position)
    position += chunk.length
  }
  
  return buffer.buffer
}

export async function downloadAndInstallJar(jarUrl: string, onProgress?: (progress: number) => void) {
  const jarName = inferJarNameFromUrl(jarUrl)
  const buf = await fetchArrayBuffer(jarUrl, onProgress)
  await installJarCompat(jarName, buf)
  return jarName
}

export async function getLocalJarByName(jarName: string): Promise<JarRecord | null> {
  const db = await openDB()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_V2, "readonly")
    const store = tx.objectStore(STORE_V2)
    const req = store.get(jarName)
    req.onerror = () => reject(req.error?.name || "indexedDB_get_error")
    tx.oncomplete = () => resolve((req.result || null) as JarRecord | null)
  })
}

