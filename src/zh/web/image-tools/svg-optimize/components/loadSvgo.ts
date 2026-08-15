import { loadFirstAvailable } from "@/utils"

const SVGO_CDN = [
  "https://cdn.jsdelivr.net/npm/svgo@3.3.2/dist/svgo.browser.js",
  "https://unpkg.com/svgo@3.3.2/dist/svgo.browser.js",
]

export type SvgoOptimize = (
  svg: string,
  config?: Record<string, unknown>
) => { data: string }

type SvgoMod = {
  optimize: SvgoOptimize
}

let svgo: SvgoMod | null = null
let ready: Promise<SvgoMod> | null = null

async function importEsm(url: string): Promise<SvgoMod> {
  const mod = (await import(/* @vite-ignore */ url)) as SvgoMod
  if (typeof mod.optimize !== "function") throw new Error("svgo 无效")
  return mod
}

export async function getSvgo(): Promise<SvgoMod> {
  if (svgo) return svgo
  if (ready) return ready
  ready = loadFirstAvailable(SVGO_CDN, importEsm).then(mod => {
    svgo = mod
    return mod
  }).catch(err => {
    ready = null
    svgo = null
    throw err
  })
  return ready
}
