import { loadFirstAvailable, loadScript } from "@/utils"

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

export type HljsApi = {
  highlight: (
    code: string,
    opts: { language: string; ignoreIllegals?: boolean }
  ) => { value: string }
  getLanguage?: (name: string) => unknown
}

const EXTRA_LANGS = new Set(["toml"])
const loadedExtra = new Set<string>()

let hljs: HljsApi | null = null
let ready: Promise<HljsApi> | null = null

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

export async function loadHljsTheme(dark: boolean) {
  const href = await loadFirstAvailable(dark ? HLJS_CSS.dark : HLJS_CSS.light, async url => {
    const res = await fetch(url, { mode: "cors" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return url
  })
  ensureCss(href, "kyx-hljs-theme")
}

export async function ensureHljs() {
  if (hljs) return hljs
  if (ready) return ready
  ready = loadFirstAvailable(HLJS_CDN, async url => {
    const win = await loadScript(url)
    const mod = (win as Window & { hljs?: HljsApi }).hljs
    if (!mod || typeof mod.highlight !== "function") throw new Error("hljs")
    return mod
  })
    .then(mod => {
      hljs = mod
      return mod
    })
    .catch(err => {
      ready = null
      hljs = null
      throw err
    })
  return ready
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

async function ensureLanguage(name: string) {
  if (!EXTRA_LANGS.has(name) || loadedExtra.has(name)) return
  const lib = await ensureHljs()
  if (lib.getLanguage?.(name)) {
    loadedExtra.add(name)
    return
  }
  await loadFirstAvailable(
    [
      `https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.11.1/languages/${name}.min.js`,
      `https://unpkg.com/@highlightjs/cdn-assets@11.11.1/languages/${name}.min.js`,
    ],
    async url => {
      await loadScript(url)
      if (!lib.getLanguage?.(name)) throw new Error(`hljs-${name}`)
      return true
    }
  )
  loadedExtra.add(name)
}

export async function highlightCode(code: string, language: string, dark: boolean) {
  if (!code) return ""
  const lib = await ensureHljs()
  try {
    await ensureLanguage(language)
  } catch {
    // extra language is optional; fall through to highlight / escape
  }
  await loadHljsTheme(dark)
  try {
    return lib.highlight(code, { language, ignoreIllegals: true }).value
  } catch {
    return escapeHtml(code)
  }
}

export function highlightSql(code: string, dark: boolean) {
  return highlightCode(code, "sql", dark)
}
