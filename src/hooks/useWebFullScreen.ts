import { ref } from "vue"

// 模块级单例：任意组件调用都共享同一个状态（不做任何持久化）
const enabled = ref(false)

export function useWebFullScreen() {
  const enterWebFullScreen = () => (enabled.value = true)
  const exitWebFullScreen = () => (enabled.value = false)
  const toggleWebFullScreen = () => (enabled.value = !enabled.value)

  return {
    isWebFullScreen: enabled,
    enterWebFullScreen,
    exitWebFullScreen,
    toggleWebFullScreen,
  }
}
