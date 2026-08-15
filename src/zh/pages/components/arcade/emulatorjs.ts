import { loadScript } from "@/utils"

export const EMULATORJS_VERSION = "stable"

const DATA_CANDIDATES = [
  `https://cdn.emulatorjs.org/${EMULATORJS_VERSION}/data/`,
  "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/",
]

export type EmulatorJSCtor = new (element: string | HTMLElement, config: Record<string, unknown>) => EmulatorJSInstance

export type LoadProgress = {
  text: string
  percent: number
}

export type EmulatorJSInstance = {
  started: boolean
  paused: boolean
  failedToStart?: boolean
  textElem?: HTMLElement | null
  play: (dontUpdate?: boolean) => void
  pause: (dontUpdate?: boolean) => void
  toggleFullscreen?: (force?: boolean) => void
  on: (event: string, cb: (...args: any[]) => void) => void
  callEvent: (event: string, data?: unknown) => void
  startGameError?: (message: string) => void
  defaultControllers?: Record<number, unknown>
  controls?: Record<number, unknown>
  setupKeys?: () => void
  gameManager?: {
    restart: () => void
    getState: () => Uint8Array | ArrayBuffer
    loadState: (state: Uint8Array) => void
    screenshot: () => Promise<Uint8Array>
    simulateInput: (player: number, index: number, value: number) => void
    toggleMainLoop: (playing: number) => void
  }
}

type Runtime = {
  EmulatorJS: EmulatorJSCtor
  dataPath: string
}

let runtime: Runtime | null = null
let ready: Promise<Runtime> | null = null

function loadCss(href: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`link[data-ejs-css="${href}"]`)) {
      resolve()
      return
    }
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.dataset.ejsCss = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`样式加载失败: ${href}`))
    document.head.appendChild(link)
  })
}

async function loadFrom(dataPath: string): Promise<Runtime> {
  const base = dataPath.endsWith("/") ? dataPath : `${dataPath}/`
  try {
    await loadCss(`${base}emulator.min.css`)
  } catch {
    await loadCss(`${base}emulator.css`)
  }
  const win = await loadScript(`${base}emulator.min.js`)
  const Ctor = (win as Window & { EmulatorJS?: EmulatorJSCtor }).EmulatorJS
  if (typeof Ctor !== "function") {
    throw new Error("EmulatorJS 无效")
  }
  return { EmulatorJS: Ctor, dataPath: base }
}

export async function ensureEmulatorJS() {
  if (runtime) return runtime
  if (ready) return ready

  ready = (async () => {
    const errors: string[] = []
    for (const base of DATA_CANDIDATES) {
      try {
        runtime = await loadFrom(base)
        return runtime
      } catch (err) {
        errors.push(err instanceof Error ? err.message : String(err))
      }
    }
    throw new Error(`模拟器运行环境加载失败：${errors.join(" | ")}`)
  })().catch(err => {
    runtime = null
    ready = null
    throw err
  })

  return ready
}

export async function loadEmulatorLang(dataPath: string) {
  try {
    const res = await fetch(`${dataPath}localization/zh-CN.json`)
    if (!res.ok) return {}
    return {
      language: "zh-CN",
      langJson: await res.json(),
    }
  } catch {
    return {}
  }
}

export function supportsEmulatorRuntime() {
  if (typeof WebAssembly === "undefined") {
    return "当前浏览器不支持 WebAssembly，无法运行街机游戏"
  }
  return ""
}
