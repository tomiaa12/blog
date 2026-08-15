import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js",
  "https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.js",
]

export type CompressOptions = {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  libURL?: string
  fileType?: string
  initialQuality?: number
  alwaysKeepResolution?: boolean
  preserveExif?: boolean
  onProgress?: (progress: number) => void
}

export type CompressFn = (file: File, options: CompressOptions) => Promise<File>

type Loaded = { fn: CompressFn; url: string }

let cached: Loaded | null = null
let ready: Promise<Loaded> | null = null

export async function getImageCompression(): Promise<Loaded> {
  if (cached) return cached
  if (ready) return ready

  ready = loadFirstAvailable(CDN_LIST, async url => {
    const win = await loadScript(url)
    const fn = (win as any).imageCompression as CompressFn | undefined
    if (typeof fn !== "function") throw new Error("imageCompression")
    return { fn, url }
  }).catch(err => {
    ready = null
    cached = null
    throw err
  })

  cached = await ready
  return cached
}
