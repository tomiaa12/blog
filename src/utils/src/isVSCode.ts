import { ref } from "vue"

/**
 * 检测当前页面是否在 VSCode 扩展中打开
 * @returns {boolean} 如果在 VSCode 中打开返回 true，否则返回 false
 */
export function isVSCode(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  // 方法1: 检测 URL 参数（主要方法）
  const urlParams = new URLSearchParams(window.location.search)
  const hasVSCodeParam = urlParams.get("vscode") === "true"

  // 方法2: 检测 User-Agent（辅助方法）
  const hasVSCodeUA = /vscode/i.test(navigator.userAgent)

  // 方法3: 检测是否在 iframe 中
  const isInIframe = window.self !== window.top

  // 组合判断：有 vscode 参数，或者（在 iframe 中且 UA 包含 vscode）
  return hasVSCodeParam || (hasVSCodeUA && isInIframe)
}

/**
 * 响应式的 VSCode 环境检测
 * 用于 Vue 组件中
 */
export function useVSCode() {
  const isVSCodeEnv = ref(false)

  if (typeof window !== "undefined") {
    isVSCodeEnv.value = isVSCode()

    // 如果在 VSCode 环境中，添加全局样式类和深色模式类
    if (isVSCodeEnv.value) {
      document.documentElement.classList.add("vscode-embedded")
      // 添加深色模式类
      document.documentElement.classList.add("dark")
    }
  }

  return {
    isVSCode: isVSCodeEnv,
  }
}

