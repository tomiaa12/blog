import { Theme, inBrowser, useRoute } from "vitepress"
import DefaultTheme from "vitepress/theme"
import Layout from "@/layout/index.vue"
import useElIcon from "@element-plus/icons-vue/global"
import elementPlus from "element-plus"
import "@/style/index.scss"

import mediumZoom from "medium-zoom"
import { nextTick, watch } from "vue"

import { createI18n } from "vue-i18n"
const i18n = createI18n({
  legacy: false,
})
i18n.global.locale.value = "zhCN"

const theme: Theme = {
  ...DefaultTheme,
  Layout,
  // NotFound: () => "custom 404",
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.use(i18n)

    // 全局注册 Element-plus
    useElIcon(ctx.app as any)
    ctx.app.use(elementPlus)
  },
  setup() {
    const route = useRoute()
    watch(
      () => route.path,
      () =>
        nextTick(() => {
          if (!inBrowser) return
          const zoom = mediumZoom("[data-zoomable]")
          zoom.update({ background: "var(--el-color-info-light-9)" })
        }),
      { immediate: true }
    )
  },
}

export default theme
