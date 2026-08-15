import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/ulid@2.3.0/dist/index.umd.js",
  "https://unpkg.com/ulid@2.3.0/dist/index.umd.js",
]

type UlidLib = {
  ulid: (seedTime?: number) => string
  monotonicFactory: () => (seedTime?: number) => string
}

let lib: UlidLib | null = null

export async function ensureUlid() {
  if (lib) return lib
  try {
    lib = await loadFirstAvailable(CDN_LIST, async url => {
      const win = await loadScript(url)
      const mod = (win as any).ULID as UlidLib | undefined
      if (!mod || typeof mod.ulid !== "function") throw new Error("ULID")
      return mod
    })
    return lib
  } catch (err) {
    lib = null
    throw err
  }
}
