import { loadFirstAvailable, loadScript } from "@/utils"

const TERSER_CDN = [
  "https://cdn.jsdelivr.net/npm/terser@5.37.0/dist/bundle.min.js",
  "https://unpkg.com/terser@5.37.0/dist/bundle.min.js",
]

const CSSO_CDN = [
  "https://cdn.jsdelivr.net/npm/csso@5.0.5/dist/csso.esm.min.js",
  "https://unpkg.com/csso@5.0.5/dist/csso.esm.min.js",
  "https://cdn.jsdelivr.net/npm/csso@5.0.5/dist/csso.esm.js",
  "https://unpkg.com/csso@5.0.5/dist/csso.esm.js",
]

const HTML_CDN = [
  "https://cdn.jsdelivr.net/npm/html-minifier-terser@7.2.0/dist/htmlminifier.umd.bundle.min.js",
  "https://unpkg.com/html-minifier-terser@7.2.0/dist/htmlminifier.umd.bundle.min.js",
]

export type TerserApi = {
  minify: (
    code: string,
    opts?: Record<string, unknown>
  ) => Promise<{ code?: string; error?: Error }>
}

export type CssoApi = {
  minify: (css: string, opts?: Record<string, unknown>) => { css: string }
}

export type HtmlMinify = (html: string, opts?: Record<string, unknown>) => string

let terser: TerserApi | null = null
let terserReady: Promise<TerserApi> | null = null
let csso: CssoApi | null = null
let cssoReady: Promise<CssoApi> | null = null
let htmlMin: HtmlMinify | null = null
let htmlReady: Promise<HtmlMinify> | null = null

export async function ensureTerser() {
  if (terser) return terser
  if (terserReady) return terserReady
  terserReady = loadFirstAvailable(TERSER_CDN, async url => {
    const win = await loadScript(url)
    const mod = (win as Window & { Terser?: TerserApi }).Terser
    if (!mod || typeof mod.minify !== "function") throw new Error("Terser")
    return mod
  })
    .then(mod => {
      terser = mod
      return mod
    })
    .catch(err => {
      terserReady = null
      terser = null
      throw err
    })
  return terserReady
}

export async function ensureCsso() {
  if (csso) return csso
  if (cssoReady) return cssoReady
  cssoReady = loadFirstAvailable(CSSO_CDN, async url => {
    const mod = (await import(/* @vite-ignore */ url)) as CssoApi & { default?: CssoApi }
    const api = typeof mod.minify === "function" ? mod : mod.default
    if (!api || typeof api.minify !== "function") throw new Error("csso")
    return api
  })
    .then(mod => {
      csso = mod
      return mod
    })
    .catch(err => {
      cssoReady = null
      csso = null
      throw err
    })
  return cssoReady
}

export async function ensureHtmlMinify() {
  if (htmlMin) return htmlMin
  if (htmlReady) return htmlReady
  htmlReady = loadFirstAvailable(HTML_CDN, async url => {
    const win = await loadScript(url)
    const g = win as Window & {
      HTMLMinifier?: { minify?: HtmlMinify }
      minify?: HtmlMinify
    }
    const fn = g.HTMLMinifier?.minify ?? g.minify
    if (typeof fn !== "function") throw new Error("HTMLMinifier")
    return fn
  })
    .then(fn => {
      htmlMin = fn
      return fn
    })
    .catch(err => {
      htmlReady = null
      htmlMin = null
      throw err
    })
  return htmlReady
}
