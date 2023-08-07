import { ref } from "vue"
import { inBrowser } from "vitepress"

export const isMobile = ref(false)

const onResize = () => {
  isMobile.value = document.documentElement.clientWidth < 768
  console.log(isMobile.value)
}
window.addEventListener("resize", onResize)
inBrowser && onResize()
