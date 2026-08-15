import { loadFirstAvailable } from "@/utils"

const TRANSFORMERS_CDN = [
  "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/transformers.web.js",
  "https://unpkg.com/@huggingface/transformers@3.5.1/dist/transformers.web.js",
]

const WASM_PATHS = [
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/",
  "https://unpkg.com/onnxruntime-web@1.21.0/dist/",
]

type ProgressCb = (info: { status: string; progress?: number; file?: string }) => void

type TransformersMod = {
  pipeline: (...args: any[]) => Promise<any>
  env: {
    allowLocalModels: boolean
    allowRemoteModels: boolean
    useBrowserCache: boolean
    backends?: { onnx?: { wasm?: { wasmPaths?: string } } }
  }
}

let transformers: TransformersMod | null = null
let segmenter: ((input: unknown) => Promise<unknown>) | null = null
let ready: Promise<typeof segmenter> | null = null

async function importEsm(url: string): Promise<TransformersMod> {
  const mod = (await import(/* @vite-ignore */ url)) as TransformersMod
  if (typeof mod.pipeline !== "function") throw new Error("transformers 无效")
  return mod
}

export async function ensureTransformers() {
  if (transformers) return transformers
  transformers = await loadFirstAvailable(TRANSFORMERS_CDN, importEsm)
  transformers.env.allowLocalModels = false
  transformers.env.allowRemoteModels = true
  transformers.env.useBrowserCache = true
  const wasm = transformers.env.backends?.onnx?.wasm
  if (wasm) wasm.wasmPaths = WASM_PATHS[0]
  return transformers
}

export async function getSegmenter(onProgress?: ProgressCb) {
  if (segmenter) return segmenter
  if (ready) return ready

  ready = (async () => {
    const { pipeline } = await ensureTransformers()
    const device =
      typeof navigator !== "undefined" && "gpu" in navigator ? "webgpu" : "wasm"
    const opts = {
      device,
      dtype: device === "webgpu" ? "fp32" : "q8",
      progress_callback: (p: {
        status?: string
        progress?: number
        file?: string
      }) => {
        onProgress?.({
          status: p.status ?? "",
          progress: p.progress,
          file: p.file,
        })
      },
    }
    try {
      segmenter = await pipeline("background-removal", "Xenova/modnet", opts)
    } catch {
      segmenter = await pipeline("image-segmentation", "Xenova/modnet", {
        ...opts,
        device: "wasm",
        dtype: "q8",
      })
    }
    return segmenter
  })().catch(err => {
    ready = null
    segmenter = null
    throw err
  })

  return ready
}

function toCanvasFromRaw(raw: any): HTMLCanvasElement | null {
  if (!raw) return null
  if (typeof raw.toCanvas === "function") return raw.toCanvas() as HTMLCanvasElement
  if (raw.canvas instanceof HTMLCanvasElement) return raw.canvas
  return null
}

function applyMask(
  src: HTMLImageElement,
  mask: { data: ArrayLike<number>; width: number; height: number }
) {
  const w = src.naturalWidth
  const h = src.naturalHeight
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas
  ctx.drawImage(src, 0, 0, w, h)
  const img = ctx.getImageData(0, 0, w, h)
  const mw = mask.width
  const mh = mask.height
  const md = mask.data
  const max = md.length ? Number(md[0]) > 1.5 || Number(md[md.length - 1]) > 1.5 : true
  for (let y = 0; y < h; y++) {
    const my = Math.min(mh - 1, Math.round((y / h) * mh))
    for (let x = 0; x < w; x++) {
      const mx = Math.min(mw - 1, Math.round((x / w) * mw))
      const m = Number(md[my * mw + mx] ?? 0)
      const a = max ? m : m * 255
      img.data[(y * w + x) * 4 + 3] = Math.max(0, Math.min(255, a))
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

export async function removeBackground(
  src: HTMLImageElement,
  onProgress?: ProgressCb
): Promise<HTMLCanvasElement> {
  const seg = await getSegmenter(onProgress)
  if (!seg) throw new Error("model")
  let out: unknown
  try {
    out = await seg(src)
  } catch {
    out = await seg(src.src)
  }
  const first = Array.isArray(out) ? out[0] : out
  const direct = toCanvasFromRaw(first)
  if (direct) return direct
  if (first?.mask) {
    const maskCanvas = toCanvasFromRaw(first.mask)
    if (maskCanvas) {
      const ctx = maskCanvas.getContext("2d")
      if (ctx) {
        const data = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
        const alpha = new Uint8Array(maskCanvas.width * maskCanvas.height)
        for (let i = 0; i < alpha.length; i++) alpha[i] = data.data[i * 4]!
        return applyMask(src, {
          data: alpha,
          width: maskCanvas.width,
          height: maskCanvas.height,
        })
      }
    }
    if (first.mask.data) {
      return applyMask(src, first.mask)
    }
  }
  throw new Error("output")
}
