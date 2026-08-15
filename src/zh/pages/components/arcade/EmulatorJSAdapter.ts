import { type ArcadeCoreId } from "./cores"
import { buildEjsControllers, type EjsControllers } from "./controls"
import {
  ensureEmulatorJS,
  loadEmulatorLang,
  type EmulatorJSInstance,
  type LoadProgress,
} from "./emulatorjs"

export type LaunchOptions = {
  player: string
  rom: File
  core: ArcadeCoreId
  bios?: File
  parent?: File
  extras?: File[]
  gameName: string
  gameId: number
  onProgress?: (info: LoadProgress) => void
  onRomsetUnknown?: () => void
  controllers?: EjsControllers
}

function friendlyLoadText(raw: string) {
  const text = raw.replace(/\s*[\d.]+\s*(%|MB)\s*$/i, "").trim()
  if (/BIOS|系统文件/i.test(text)) {
    return /Decompress|解压/i.test(text) ? "正在处理系统文件" : "正在准备系统文件"
  }
  if (/Core|核心|模拟器/i.test(text)) {
    return /Decompress|解压/i.test(text) ? "正在解压模拟器" : "正在下载模拟器"
  }
  if (/Parent|父/i.test(text)) return "正在加载附加文件"
  if (/Patch|补丁/i.test(text)) return "正在加载补丁"
  if (/Data|游戏数据/i.test(text)) return "正在加载游戏"
  if (/State|状态/i.test(text)) return "正在加载进度"
  if (/Loading|加载/i.test(text)) return "正在准备模拟器"
  return text || "正在准备模拟器"
}

function parseLoadProgress(raw: string): LoadProgress {
  const percent = Number(raw.match(/(\d+)\s*%/)?.[1] || 0)
  return {
    text: friendlyLoadText(raw),
    percent: Number.isFinite(percent) ? Math.min(100, percent) : 0,
  }
}

function toZipFile(file: File, name: string) {
  if (file.name.toLowerCase() === name.toLowerCase()) return file
  return new File([file], name, { type: "application/zip" })
}

function gameIdFromName(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (Math.imul(31, hash) + id.charCodeAt(i)) >>> 0
  }
  return hash || 1
}

export function arcadeGameId(romId: string) {
  return gameIdFromName(romId)
}

export class EmulatorJSAdapter {
  private emu: EmulatorJSInstance | null = null
  private destroyed = false
  private extraUrls: string[] = []
  private progressObserver: MutationObserver | null = null

  get instance() {
    return this.emu
  }

  async start(options: LaunchOptions) {
    this.destroyed = false
    const { EmulatorJS, dataPath } = await ensureEmulatorJS()
    if (this.destroyed) return

    options.onProgress?.({ text: "正在准备模拟器", percent: 4 })
    const lang = await loadEmulatorLang(dataPath)
    if (this.destroyed) return

    const externalFiles: Record<string, string> = {}
    this.extraUrls.forEach(url => URL.revokeObjectURL(url))
    this.extraUrls = []

    const addNamedFile = (file: File, name = file.name) => {
      const zip = toZipFile(file, name)
      const url = URL.createObjectURL(zip)
      this.extraUrls.push(url)
      externalFiles[`/${name}`] = url
    }

    const romName = options.rom.name.toLowerCase().endsWith(".zip")
      ? options.rom.name
      : options.gameName.toLowerCase().endsWith(".zip")
        ? options.gameName
        : `${options.gameName}.zip`
    const gameUrl = URL.createObjectURL(toZipFile(options.rom, romName))
    this.extraUrls.push(gameUrl)
    if (options.bios) addNamedFile(options.bios, options.bios.name || "neogeo.zip")
    if (options.parent) addNamedFile(options.parent, options.parent.name)
    for (const extra of options.extras || []) {
      addNamedFile(extra, extra.name)
    }

    const system = options.core === "mame2003_plus" ? "mame" : "arcade"
    const config: Record<string, unknown> = {
      gameUrl,
      dataPath,
      system,
      biosUrl: "",
      gameParentUrl: "",
      gameName: romName,
      gameId: options.gameId,
      color: "#e85d4c",
      volume: 1,
      startOnLoad: true,
      threads: typeof SharedArrayBuffer === "function",
      defaultControllers: options.controllers || buildEjsControllers(),
      externalFiles,
      disableAutoLang: true,
      ...lang,
      buttonOpts: {
        saveState: { visible: false },
        loadState: { visible: false },
        cheat: { visible: false },
        cacheManager: { visible: false },
        screenRecord: { visible: false },
        exitEmulation: { visible: false },
        saveSavFiles: { visible: false },
        loadSavFiles: { visible: false },
      },
    }

    if (!document.querySelector(options.player)) {
      throw new Error("播放器未就绪")
    }

    let emu: EmulatorJSInstance
    try {
      emu = new EmulatorJS(options.player, config)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(message.includes("undefined") ? "模拟器初始化失败，请刷新页面后重试" : message)
    }
    this.emu = emu
    ;(window as Window & { EJS_emulator?: EmulatorJSInstance }).EJS_emulator = emu
    this.attachProgress(emu, options.onProgress)
    this.watchRomsetUnknown(emu, options.onRomsetUnknown)

    const origError = emu.startGameError?.bind(emu)
    await new Promise<void>((resolve, reject) => {
      let settled = false
      const timer = window.setTimeout(() => {
        if (emu.failedToStart) {
          finish(new Error("模拟器加载失败"))
        } else if (emu.started) {
          finish()
        } else {
          finish(new Error("模拟器启动超时，请检查网络后重试"))
        }
      }, 120000)
      const finish = (err?: Error) => {
        if (settled) return
        settled = true
        window.clearTimeout(timer)
        if (err) reject(err)
        else resolve()
      }

      emu.on("start", () => finish())
      emu.on("exit", () => finish(new Error("模拟器已退出")))
      emu.startGameError = (message: string) => {
        origError?.(message)
        finish(new Error(message || "模拟器加载失败"))
      }
    })
    if (!this.destroyed) {
      this.applyControllers(options.controllers || buildEjsControllers())
    }
  }

  private watchRomsetUnknown(
    emu: EmulatorJSInstance,
    onUnknown?: () => void
  ) {
    if (!onUnknown) return
    let fired = false
    const emit = (msg: unknown) => {
      if (fired || this.destroyed) return
      if (!/romset is unknown/i.test(String(msg || ""))) return
      fired = true
      onUnknown()
    }
    const hook = () => {
      const mod = (emu as EmulatorJSInstance & {
        Module?: {
          print?: (msg: string) => void
          printErr?: (msg: string) => void
          __arcadeRomsetHooked?: boolean
        }
      }).Module
      if (!mod || mod.__arcadeRomsetHooked) return Boolean(mod)
      mod.__arcadeRomsetHooked = true
      const wrap = (orig?: (msg: string) => void) => (msg: string) => {
        orig?.(msg)
        emit(msg)
      }
      if (mod.print) mod.print = wrap(mod.print.bind(mod))
      if (mod.printErr) mod.printErr = wrap(mod.printErr.bind(mod))
      return true
    }
    if (hook()) return
    const timer = window.setInterval(() => {
      if (this.destroyed || hook()) window.clearInterval(timer)
    }, 80)
  }

  private attachProgress(
    emu: EmulatorJSInstance,
    onProgress?: (info: LoadProgress) => void
  ) {
    if (!onProgress) return
    if (emu.textElem) {
      this.watchProgress(emu, onProgress)
      return
    }
    let tries = 0
    const timer = window.setInterval(() => {
      tries += 1
      if (this.destroyed || emu.textElem || tries > 80) {
        window.clearInterval(timer)
        if (!this.destroyed && emu.textElem) this.watchProgress(emu, onProgress)
      }
    }, 50)
  }

  private watchProgress(
    emu: EmulatorJSInstance,
    onProgress?: (info: LoadProgress) => void
  ) {
    const el = emu.textElem
    if (!el || !onProgress) return

    const emit = (raw: string) => {
      if (this.destroyed) return
      onProgress(parseLoadProgress(raw))
    }

    emit(el.innerText || "")
    this.progressObserver?.disconnect()
    this.progressObserver = new MutationObserver(() => emit(el.innerText || ""))
    this.progressObserver.observe(el, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText")
    if (desc?.set && desc.get) {
      Object.defineProperty(el, "innerText", {
        configurable: true,
        get() {
          return desc.get!.call(this)
        },
        set(value: string) {
          desc.set!.call(this, value)
          emit(String(value || ""))
        },
      })
    }
  }

  applyControllers(controllers: EjsControllers) {
    const emu = this.emu
    if (!emu?.setupKeys) return
    const next = JSON.parse(JSON.stringify(controllers)) as EjsControllers
    emu.defaultControllers = next
    emu.controls = JSON.parse(JSON.stringify(next))
    emu.setupKeys()
  }

  pause() {
    this.emu?.pause()
  }

  resume() {
    this.emu?.play()
  }

  reset() {
    this.emu?.gameManager?.restart()
    this.emu?.play()
  }

  async saveState() {
    const state = this.emu?.gameManager?.getState()
    if (!state) throw new Error("当前无法保存状态")
    const bytes = state instanceof ArrayBuffer ? new Uint8Array(state) : state
    return new Blob([bytes])
  }

  async loadState(file: Blob) {
    const buf = new Uint8Array(await file.arrayBuffer())
    this.emu?.play()
    this.emu?.gameManager?.loadState(buf)
  }

  async screenshot() {
    const data = await this.emu?.gameManager?.screenshot()
    if (!data) throw new Error("截图失败")
    return new Blob([data], { type: "image/png" })
  }

  fullscreen() {
    const el = this.emu as EmulatorJSInstance & { elements?: { parent?: HTMLElement } }
    const node = el.elements?.parent
    if (node?.requestFullscreen) {
      void node.requestFullscreen()
      return
    }
    this.emu?.toggleFullscreen?.(true)
  }

  destroy() {
    this.destroyed = true
    this.progressObserver?.disconnect()
    this.progressObserver = null
    this.extraUrls.forEach(url => URL.revokeObjectURL(url))
    this.extraUrls = []
    const emu = this.emu
    this.emu = null
    if (!emu) return
    try {
      emu.callEvent("exit")
    } catch {
      // ignore
    }
  }
}
