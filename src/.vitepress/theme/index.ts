import { Theme, inBrowser, useRoute, useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import Layout from "../../layout/index.vue"
import useElIcon from "@element-plus/icons-vue/global"
import ElementPlus from "element-plus"
import "../../style/index.scss"
import NProgress from "nprogress"
import giscusTalk from "vitepress-plugin-comment-with-giscus"

import mediumZoom from "medium-zoom"
import { nextTick, watch, toRefs, type App } from "vue"

import { createI18n } from "vue-i18n"
const i18n = createI18n({
  locale: "zh-CN",
  legacy: false,
})
// i18n.global.locale.value = "zh-CN"

export default {
  extends: DefaultTheme,
  Layout,
  // NotFound: () => "custom 404",
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.use(i18n as any)

    // 全局注册 Element-plus
    useElIcon(ctx.app as any)
    ctx.app.use(ElementPlus as any)

    if (inBrowser) {
      ctx.router.onBeforeRouteChange = () => {
        NProgress.start()
      }

      ctx.router.onAfterRouteChange = () => {
        NProgress.done()
      }
    }
  },
  setup() {
    const route = useRoute()
    const { lang } = useData()

    watch(
      lang,
      (newLang) => {
        i18n.global.locale.value = newLang
      },
      { immediate: true }
    )

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

    // Get frontmatter and route
    const { frontmatter } = toRefs(useData())
    // Obtain configuration from: https://giscus.app/
    giscusTalk(
      {
        repo: "tomiaa12/blogComments",
        repoId: "R_kgDONlUJAw",
        category: "BlogComments", // default: `General`
        categoryId: "DIC_kwDONlUJA84ClsSx",
        mapping: "pathname", // default: `pathname`
        inputPosition: "top", // default: `top`
        // lang: 'en', // default: `zh-CN`
        // i18n setting (Note: This configuration will override the default language set by lang)
        // Configured as an object with key-value pairs inside:
        // [your i18n configuration name]: [corresponds to the language pack name in Giscus]
        // locales: {
        //     'zh-Hans': 'zh-CN',
        //     'en-US': 'en'
        // },
        homePageShowComment: true, // Whether to display the comment area on the homepage, the default is false
        // lightTheme: 'light', // default: `light`
        // darkTheme: 'transparent_dark', // default: `transparent_dark`
      },
      {
        frontmatter,
        route,
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true
    )
  },
} satisfies Theme
