import { ref } from "vue"
import { inBrowser } from "vitepress"

export const isMobile = ref(false)
export const isTablet = ref(false)

const checkDevice = () => {
  const width = document.documentElement.clientWidth
  isMobile.value = width < 768
  
  // 检测平板设备：通过 User Agent 和屏幕尺寸
  const ua = navigator.userAgent.toLowerCase()
  const isIPad = /ipad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroidTablet = /android/.test(ua) && !/mobile/.test(ua)
  const isTabletBySize = width >= 768 && width <= 1024 && 'ontouchstart' in window
  
  isTablet.value = isIPad || isAndroidTablet || isTabletBySize
}

if (inBrowser) {
  window.addEventListener("resize", checkDevice)
  checkDevice()
}
