import { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import Layout from "@/layout/index.vue"

import useElIcon from "@element-plus/icons-vue/global"
import elementPlus from "element-plus"
import "@/style/index.scss"

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
}

export default theme
