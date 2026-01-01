import { ref } from "vue"

export const canvasSizeOptions = [
  { value: "size-240x320", label: "显示尺寸: 240x320" },
  { value: "size-320x240", label: "显示尺寸: 320x240" },
  { value: "size-360x640", label: "显示尺寸: 360x640" },
  { value: "size-640x360", label: "显示尺寸: 640x360" },
  { value: "size-no", label: "显示尺寸: 无限制" },
] as const

export const gamepadSizeOptions = [
  { value: "gamepad-0", label: "虚拟键盘-无" },
  { value: "gamepad-1", label: "虚拟键盘-小" },
  { value: "gamepad-2", label: "虚拟键盘-中" },
  { value: "gamepad-3", label: "虚拟键盘-大" },
  { value: "gamepad-4", label: "虚拟键盘-特大" },
] as const

export const gameresizeOptions = [
  { value: "resize-1", label: "无缩放" },
  { value: "resize-1x5", label: "缩放1.5倍" },
  { value: "resize-2", label: "缩放2倍" },
  { value: "resize-2x5", label: "缩放2.5倍" },
  { value: "resize-3", label: "缩放3倍" },
] as const

type SessionConfig = {
  canvasSize: number
  gamepadSize: number
  gameresize: number
  localJarIndex: number
}

const DEFAULTS: SessionConfig = {
  canvasSize: 0, // 默认 240x320
  gamepadSize: 3, // 默认虚拟键盘-大
  gameresize: 0,
  localJarIndex: -1,
}

const SETTINGS_KEY = "j2me_config"

// 单例 refs：方便任意组件/页面直接 import 使用
export const canvasSizeIndex = ref(DEFAULTS.canvasSize)
export const gamepadSizeIndex = ref(DEFAULTS.gamepadSize)
export const gameresizeIndex = ref(DEFAULTS.gameresize)
export const localJarIndex = ref(DEFAULTS.localJarIndex)

let loadedOnce = false

export function loadConfigFromSession() {
  if (loadedOnce) return
  loadedOnce = true
  if (typeof window === "undefined") return

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) {
      saveConfigToSession()
      return
    }
    const data = JSON.parse(raw) as Partial<SessionConfig>
    canvasSizeIndex.value = Number.isFinite(data.canvasSize) ? (data.canvasSize as number) : DEFAULTS.canvasSize
    gamepadSizeIndex.value = Number.isFinite(data.gamepadSize) ? (data.gamepadSize as number) : DEFAULTS.gamepadSize
    gameresizeIndex.value = Number.isFinite(data.gameresize) ? (data.gameresize as number) : DEFAULTS.gameresize
    localJarIndex.value = Number.isFinite(data.localJarIndex) ? (data.localJarIndex as number) : DEFAULTS.localJarIndex
  } catch {
    saveConfigToSession()
  }
}

export function saveConfigToSession() {
  if (typeof window === "undefined") return
  const payload: SessionConfig = {
    canvasSize: canvasSizeIndex.value,
    gamepadSize: gamepadSizeIndex.value,
    gameresize: gameresizeIndex.value,
    localJarIndex: localJarIndex.value,
  }
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
}

export function clampLocalJarIndex(length: number) {
  if (length <= 0) {
    localJarIndex.value = -1
    return
  }
  if (localJarIndex.value < 0) localJarIndex.value = 0
  if (localJarIndex.value >= length) localJarIndex.value = length - 1
}


