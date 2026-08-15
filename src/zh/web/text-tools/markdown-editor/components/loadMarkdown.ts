import { loadFirstAvailable, loadScript } from "@/utils"

const MARKED_CDN = [
  "https://cdn.jsdelivr.net/npm/marked@15.0.7/lib/marked.umd.js",
  "https://unpkg.com/marked@15.0.7/lib/marked.umd.js",
]

const PURIFY_CDN = [
  "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js",
  "https://unpkg.com/dompurify@3.2.4/dist/purify.min.js",
]

const HLJS_CDN = [
  "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.11.1/highlight.min.js",
  "https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js",
]

const HLJS_CSS = {
  light: [
    "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.11.1/styles/github.min.css",
    "https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/github.min.css",
  ],
  dark: [
    "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.11.1/styles/github-dark.min.css",
    "https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/github-dark.min.css",
  ],
}

type MarkedApi = {
  parse: (src: string, opts?: { gfm?: boolean; breaks?: boolean }) => string
}

type PurifyApi = {
  sanitize: (html: string) => string
}

type HljsApi = {
  highlightElement: (el: HTMLElement) => void
}

type MarkdownLibs = {
  marked: MarkedApi
  purify: PurifyApi
  hljs: HljsApi
}

let libs: MarkdownLibs | null = null
let ready: Promise<MarkdownLibs> | null = null

function ensureCss(href: string, id: string) {
  let link = document.getElementById(id) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }
  if (link.href !== href) link.href = href
}

async function loadUmd<T>(urls: string[], pick: (win: Window) => T | undefined, label: string) {
  return loadFirstAvailable(urls, async url => {
    const win = await loadScript(url)
    const mod = pick(win)
    if (!mod) throw new Error(label)
    return mod
  })
}

async function loadHljsCss() {
  const dark = document.documentElement.classList.contains("dark")
  const href = await loadFirstAvailable(dark ? HLJS_CSS.dark : HLJS_CSS.light, async url => {
    const res = await fetch(url, { mode: "cors" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return url
  })
  ensureCss(href, "kyx-hljs-theme")
}

async function loadMarkdown() {
  const [marked, purify, hljs] = await Promise.all([
    loadUmd<MarkedApi>(
      MARKED_CDN,
      win => (win as Window & { marked?: MarkedApi }).marked,
      "marked"
    ),
    loadUmd<PurifyApi>(
      PURIFY_CDN,
      win => (win as Window & { DOMPurify?: PurifyApi }).DOMPurify,
      "DOMPurify"
    ),
    loadUmd<HljsApi>(
      HLJS_CDN,
      win => (win as Window & { hljs?: HljsApi }).hljs,
      "hljs"
    ),
  ])
  await loadHljsCss()
  return { marked, purify, hljs }
}

export async function ensureMarkdown() {
  if (libs) return libs
  if (ready) return ready
  ready = loadMarkdown()
    .then(mod => {
      libs = mod
      return mod
    })
    .catch(err => {
      ready = null
      libs = null
      throw err
    })
  return ready
}

export async function renderMarkdown(src: string) {
  const { marked, purify, hljs } = await ensureMarkdown()
  await loadHljsCss()
  const raw = marked.parse(src, { gfm: true, breaks: true })
  const html = purify.sanitize(typeof raw === "string" ? raw : String(raw))
  const box = document.createElement("div")
  box.innerHTML = html
  box.querySelectorAll("pre code").forEach(el => {
    try {
      hljs.highlightElement(el as HTMLElement)
    } catch {
      /* ignore unknown languages */
    }
  })
  return box.innerHTML
}
