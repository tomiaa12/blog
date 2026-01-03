---
class: gtavc
layout: page
footer: false
---

<iframe
  src="https://gtavc.kuangyx.cn"
  allowfullscreen
  allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write; encrypted-media; picture-in-picture"
  style="width: 100%; border: 0;"
></iframe>


<script setup>
import { onMounted, onUnmounted } from "vue"
import { useData } from "vitepress"

const { isDark } = useData()
let prevIsDark = false

onMounted(() => {
  prevIsDark = !!isDark.value
  // 进入该页面时强制暗色模式
  isDark.value = true
})

onUnmounted(() => {
  // 离开该页面时恢复进入前的模式
  isDark.value = prevIsDark
})
</script>

<style>
.gtavc h1 {
  display: none;
  color: var(--vp-c-text-1);
}
.gtavc iframe {
  height: calc(100vh - var(--vp-nav-height));
}
.gtavc {
  --vp-nav-bg-color: #100a36;
}
</style>
