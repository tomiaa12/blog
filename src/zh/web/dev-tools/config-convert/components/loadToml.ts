import { loadFirstAvailable } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/smol-toml@1.4.2/+esm",
  "https://unpkg.com/smol-toml@1.4.2/dist/index.js",
]

export type TomlLib = {
  parse: (text: string) => unknown
  stringify: (value: unknown) => string
}

let lib: TomlLib | null = null
let ready: Promise<TomlLib> | null = null

async function importEsm(url: string): Promise<TomlLib> {
  const mod = (await import(/* @vite-ignore */ url)) as TomlLib
  if (typeof mod.parse !== "function" || typeof mod.stringify !== "function") {
    throw new Error("smol-toml")
  }
  return mod
}

export async function ensureToml(): Promise<TomlLib> {
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
