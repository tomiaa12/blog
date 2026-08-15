import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/colorthief@2.4.0/dist/color-thief.umd.js",
  "https://unpkg.com/colorthief@2.4.0/dist/color-thief.umd.js",
]

export type RGB = [number, number, number]

type ColorThiefInst = {
  getColor: (img: HTMLImageElement, quality?: number) => RGB
  getPalette: (img: HTMLImageElement, colorCount?: number, quality?: number) => RGB[]
}

type ColorThiefCtor = new () => ColorThiefInst

let inst: ColorThiefInst | null = null

export async function ensureColorThief() {
  if (inst) return inst
  try {
    inst = await loadFirstAvailable(CDN_LIST, async url => {
      const win = await loadScript(url)
      const Ctor = (win as any).ColorThief as ColorThiefCtor | undefined
      if (typeof Ctor !== "function") throw new Error("ColorThief")
      const created = new Ctor()
      if (typeof created.getPalette !== "function") throw new Error("ColorThief")
      return created
    })
    return inst
  } catch (err) {
    inst = null
    throw err
  }
}
