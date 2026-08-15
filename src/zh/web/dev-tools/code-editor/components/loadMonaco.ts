import { loadFirstAvailable, loadScript } from "@/utils"

const VERSION = "0.52.2"

const LOADER_CDN = [
  `https://cdn.jsdelivr.net/npm/monaco-editor@${VERSION}/min/vs/loader.js`,
  `https://unpkg.com/monaco-editor@${VERSION}/min/vs/loader.js`,
]

export type MonacoEditor = {
  getValue: () => string
  setValue: (value: string) => void
  updateOptions: (options: Record<string, unknown>) => void
  getAction: (id: string) => { run: () => void | Promise<void> } | null
  getModel: () => { getLineCount: () => number } | null
  onDidChangeModelContent: (cb: () => void) => { dispose: () => void }
  dispose: () => void
}

export type MonacoApi = {
  editor: {
    create: (el: HTMLElement, options: Record<string, unknown>) => MonacoEditor
    setTheme: (theme: string) => void
    setModelLanguage: (model: unknown, language: string) => void
  }
}

type AmdRequire = {
  config: (opts: { paths: Record<string, string> }) => void
  (deps: string[], cb: () => void): void
}

let monacoNs: MonacoApi | null = null
let ready: Promise<MonacoApi> | null = null

function vsDirFromLoader(url: string) {
  return url.replace(/\/loader\.js$/i, "")
}

function ensureCss(href: string) {
  if (document.querySelector(`link[data-monaco-css="${href}"]`)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  link.dataset.monacoCss = href
  document.head.appendChild(link)
}

function setupWorkers(vs: string) {
  const minBase = vs.replace(/\/vs$/i, "/")
  const worker = `${vs}/base/worker/workerMain.js`
  ;(window as Window & { MonacoEnvironment?: { getWorkerUrl: () => string } }).MonacoEnvironment = {
    getWorkerUrl() {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(
        `self.MonacoEnvironment={baseUrl:${JSON.stringify(minBase)}};importScripts(${JSON.stringify(worker)});`
      )}`
    },
  }
}

function loadAmdMain(vs: string) {
  return new Promise<MonacoApi>((resolve, reject) => {
    const req = (window as Window & { require?: AmdRequire }).require
    if (typeof req !== "function") {
      reject(new Error("monaco loader"))
      return
    }
    req.config({ paths: { vs } })
    setupWorkers(vs)
    ensureCss(`${vs}/editor/editor.main.css`)
    const timer = window.setTimeout(() => reject(new Error("monaco timeout")), 30000)
    req(["vs/editor/editor.main"], () => {
      window.clearTimeout(timer)
      const api = (window as Window & { monaco?: MonacoApi }).monaco
      if (!api?.editor?.create) {
        reject(new Error("monaco"))
        return
      }
      resolve(api)
    })
  })
}

async function loadMonaco() {
  const existing = (window as Window & { monaco?: MonacoApi }).monaco
  if (existing?.editor?.create) return existing

  const loaderUrl = await loadFirstAvailable(LOADER_CDN, async url => {
    const res = await fetch(url, { mode: "cors" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return url
  })
  await loadScript(loaderUrl)
  return loadAmdMain(vsDirFromLoader(loaderUrl))
}

export async function ensureMonaco() {
  if (monacoNs) return monacoNs
  if (ready) return ready
  ready = loadMonaco()
    .then(api => {
      monacoNs = api
      return api
    })
    .catch(err => {
      ready = null
      monacoNs = null
      throw err
    })
  return ready
}
