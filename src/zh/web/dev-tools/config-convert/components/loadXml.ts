import { loadFirstAvailable } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/fast-xml-parser@4.5.3/+esm",
  "https://unpkg.com/fast-xml-parser@4.5.3?module",
]

type XmlParserCtor = new (options?: Record<string, unknown>) => {
  parse: (text: string) => unknown
}

type XmlBuilderCtor = new (options?: Record<string, unknown>) => {
  build: (value: unknown) => string
}

export type XmlLib = {
  XMLParser: XmlParserCtor
  XMLBuilder: XmlBuilderCtor
}

let lib: XmlLib | null = null
let ready: Promise<XmlLib> | null = null

async function importEsm(url: string): Promise<XmlLib> {
  const mod = (await import(/* @vite-ignore */ url)) as XmlLib
  if (typeof mod.XMLParser !== "function" || typeof mod.XMLBuilder !== "function") {
    throw new Error("fast-xml-parser")
  }
  return mod
}

export async function ensureXml(): Promise<XmlLib> {
  if (lib) return lib
  if (ready) return ready
  ready = loadFirstAvailable(CDN_LIST, importEsm)
    .then(mod => {
      lib = mod
      return mod
    })
    .catch(err => {
      ready = null
      lib = null
      throw err
    })
  return ready
}
