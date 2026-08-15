import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/js-yaml@4.1.1/dist/js-yaml.min.js",
  "https://unpkg.com/js-yaml@4.1.1/dist/js-yaml.min.js",
]

export type YamlLib = {
  load: (text: string) => unknown
  dump: (value: unknown, options?: Record<string, unknown>) => string
}

let lib: YamlLib | null = null

export async function ensureYaml(): Promise<YamlLib> {
  if (lib) return lib
  try {
    lib = await loadFirstAvailable(CDN_LIST, async url => {
      const win = await loadScript(url)
      const mod = (win as any).jsyaml as YamlLib | undefined
      if (!mod || typeof mod.load !== "function" || typeof mod.dump !== "function") {
        throw new Error("jsyaml")
      }
      return mod
    })
    return lib
  } catch (err) {
    lib = null
    throw err
  }
}
