import { loadFirstAvailable, loadScript } from "@/utils"

const CANVAS_CDN = [
  "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
  "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js",
]

const PDF_CDN = [
  "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.2/dist/html2pdf.bundle.min.js",
  "https://unpkg.com/html2pdf.js@0.10.2/dist/html2pdf.bundle.min.js",
]

export type Html2Canvas = (
  el: HTMLElement,
  opts?: Record<string, unknown>
) => Promise<HTMLCanvasElement>

export type Html2Pdf = {
  set: (opts: Record<string, unknown>) => Html2Pdf
  from: (el: HTMLElement) => Html2Pdf
  save: () => Promise<void>
}

let canvasFn: Html2Canvas | null = null
let canvasReady: Promise<Html2Canvas> | null = null
let pdfFn: (() => Html2Pdf) | null = null
let pdfReady: Promise<() => Html2Pdf> | null = null

export async function ensureHtml2Canvas() {
  if (canvasFn) return canvasFn
  if (canvasReady) return canvasReady
  canvasReady = loadFirstAvailable(CANVAS_CDN, async url => {
    const win = await loadScript(url)
    const fn = (win as Window & { html2canvas?: Html2Canvas }).html2canvas
    if (typeof fn !== "function") throw new Error("html2canvas")
    return fn
  })
    .then(fn => {
      canvasFn = fn
      return fn
    })
    .catch(err => {
      canvasReady = null
      canvasFn = null
      throw err
    })
  return canvasReady
}

export async function ensureHtml2Pdf() {
  if (pdfFn) return pdfFn
  if (pdfReady) return pdfReady
  pdfReady = loadFirstAvailable(PDF_CDN, async url => {
    const win = await loadScript(url)
    const fn = (win as Window & { html2pdf?: () => Html2Pdf }).html2pdf
    if (typeof fn !== "function") throw new Error("html2pdf")
    return fn
  })
    .then(fn => {
      pdfFn = fn
      return fn
    })
    .catch(err => {
      pdfReady = null
      pdfFn = null
      throw err
    })
  return pdfReady
}
