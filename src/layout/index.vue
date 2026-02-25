<template>
  <el-config-provider :locale="locale" v-if="isVSCode">
    <VPContent :class="getCurClass"> </VPContent>
  </el-config-provider>
  <template v-else>

    <el-config-provider :locale="locale">
      <defaultLayout :class="layoutClass">
        <template #aside-outline-after v-if="!isWebFullScreen">
          <ins class="adsbygoogle" style="display: block; height: 230px" data-ad-client="ca-pub-6209757986574246"
            data-ad-slot="6047648655" data-ad-format="auto" data-full-width-responsive="true">
          </ins>
        </template>
        <template #doc-before v-if="!isMobile && !isWebFullScreen">
          <div class="page_pv">
            {{ t('pageViewsLabel') }}
            <span id="busuanzi_value_page_pv">
              <el-icon-loading class="loading-icon" />
            </span>
            {{ t('pageViewsUnit') }}
          </div>
        </template>
      </defaultLayout>
    </el-config-provider>

    <ClientOnly v-if="!isMobile && !isWebFullScreen">
      <SideTool @toggle-live2d="toggleLive2d" />
    </ClientOnly>

    <Live2D v-if="!isMobile && !isTablet && !isWebFullScreen && showLive2d" />

    <!-- <el-backtop
      v-if="!isMobile && !isWebFullScreen"
      :right="300"
    /> -->

    <ClientOnly v-if="isWebFullScreen">
      <button class="webfullscreen-exit" type="button" @click="exitWebFullScreen">
        {{ t('exitWebFullscreen') }}
      </button>
    </ClientOnly>
  </template>
</template>

<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn"
import en from "element-plus/es/locale/lang/en"
import zhTw from "element-plus/es/locale/lang/zh-tw"
import ja from "element-plus/es/locale/lang/ja"
import ko from "element-plus/es/locale/lang/ko"
import fr from "element-plus/es/locale/lang/fr"
import de from "element-plus/es/locale/lang/de"
import es from "element-plus/es/locale/lang/es"
import pt from "element-plus/es/locale/lang/pt"
import ru from "element-plus/es/locale/lang/ru"
import ar from "element-plus/es/locale/lang/ar"
import hi from "element-plus/es/locale/lang/hi"
import it from "element-plus/es/locale/lang/it"
import nl from "element-plus/es/locale/lang/nl"
import tr from "element-plus/es/locale/lang/tr"
import vi from "element-plus/es/locale/lang/vi"
import th from "element-plus/es/locale/lang/th"
import id from "element-plus/es/locale/lang/id"
import pl from "element-plus/es/locale/lang/pl"
import sv from "element-plus/es/locale/lang/sv"
import defaultLayout from "vitepress/dist/client/theme-default/Layout.vue"
import VPContent from "vitepress/dist/client/theme-default/components/VPContent.vue"
import { useRoute, useRouter, useData, inBrowser } from "vitepress"
import { computed, onMounted, watch, nextTick, ref, provide } from "vue"
import Live2D from "./Live2d.vue"
import SideTool from "./SideTool.vue"
import { isMobile, isTablet, isVSCode } from "@/utils"
import { useWebFullScreen } from "@/hooks/useWebFullScreen"
import { useI18n } from "vue-i18n"

const { t } = useI18n({ useScope: "local" })
const route = useRoute()
const router = useRouter()
const data = useData()
const { isWebFullScreen, exitWebFullScreen } = useWebFullScreen()
const showLive2d = ref(false)

const enableAppearanceTransition = () =>
  inBrowser &&
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!data.isDark) return

  if (!enableAppearanceTransition()) {
    data.isDark.value = !data.isDark.value
    return
  }

  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${maxRadius}px at ${x}px ${y}px)`,
  ]

  await (document as any).startViewTransition(async () => {
    data.isDark.value = !data.isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: data.isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 320,
      easing: "ease-in",
      fill: "forwards",
      pseudoElement: `::view-transition-${data.isDark.value ? "old" : "new"
        }(root)`,
    }
  )
})

const toggleLive2d = () => {
  // Live2D 组件内部自带收起能力，这里只负责首次展示，避免重复挂载创建新实例
  if (!showLive2d.value) {
    showLive2d.value = true
  }
}

// VSCode 环境下默认使用深色模式
if (isVSCode.value && data.isDark) {
  data.isDark.value = true
}

const getCurClass = computed(() => data.frontmatter.value.class)

const layoutClass = computed(() => {
  const cls = getCurClass.value
  return [cls, isWebFullScreen.value && "vp-webfullscreen"].filter(Boolean)
})

const showGlobalComment = computed(() => data.frontmatter.value.layout)

const elLocaleMap: Record<string, any> = {
  "zh-CN": zhCn,
  "en": en,
  "zh-TW": zhTw,
  "ja": ja,
  "ko": ko,
  "fr": fr,
  "de": de,
  "es": es,
  "pt": pt,
  "ru": ru,
  "ar": ar,
  "hi": hi,
  "it": it,
  "nl": nl,
  "tr": tr,
  "vi": vi,
  "th": th,
  "id": id,
  "pl": pl,
  "sv": sv,
}

const locale = computed(() => elLocaleMap[data.lang.value] ?? zhCn)

let script: any
onMounted(async () => {
  // VSCode 环境下强制使用深色模式
  if (isVSCode.value && data.isDark) {
    data.isDark.value = true
  }

  script = await import("busuanzi.pure.js")

    // google 文章内嵌广告
    ; ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})

  if (import.meta.env.DEV) {
    const v = (await import("vconsole")) as any
    new v.default()
  }
})

watch(
  async () => route.path,
  async () => {
    await nextTick()
    // 访问量统计
    script?.fetch()
  }
)
if (inBrowser) {
  const resize = () => {
    let vh = window.innerHeight
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }
  window.addEventListener("resize", resize)
  resize()
}
</script>
<style lang="scss" scoped>
.home-comment {
  padding: 2em;
}

.el-backtop {
  z-index: 2001;
}

:deep(.VPNavBar) {
  .content {
    white-space: nowrap;
  }
}

:deep(.VPDoc.has-aside) {
  .content-container {
    max-width: 850px;
  }
}

:deep(.VPMenuGroup) {
  .title {
    white-space: nowrap;
  }
}

.page_pv {
  line-height: var(--page-pv-height);
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}
</style>

<style lang="scss">
.loading-icon {
  display: inline;
  vertical-align: middle;
  animation: loading-rotate 2s linear infinite;
}

.webfullscreen-exit {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 3000;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  color: var(--vp-c-text-1);
  box-shadow: var(--el-box-shadow-light);
  cursor: pointer;
}

.webfullscreen-exit:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

// 网页全屏：保留 defaultLayout，只隐藏外壳
.vp-webfullscreen {
  --vp-layout-max-width: 0;
  --vp-nav-height: 0;

  .VPNav,
  .VPNavBar,
  .VPNavScreen,
  .VPSidebar,
  .VPLocalNav,
  .VPDocAside {
    display: none !important;
  }

  // 去掉 nav 占位带来的顶部留白
  .VPContent {
    padding-top: 0 !important;
  }
}

// VSCode 环境下的样式优化
.vscode-embedded {

  // 隐藏导航栏和侧边栏，只保留内容
  .VPNav,
  .VPSidebar,
  .VPLocalNav {
    display: none !important;
  }

  // 优化内容区域，移除左右边距
  .VPContent {
    padding: 0 !important;
    margin: 0 !important;
  }

  // 减少边距，充分利用空间
  .VPDoc {
    padding: 16px !important;
    max-width: 100% !important;
  }

  // 移除容器的最大宽度限制
  .container,
  .content-container {
    max-width: 100% !important;
    padding: 5px !important;
  }
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPFooter .container {
  max-width: unset;
}
</style>

<i18n lang="json">{
  "zh-CN": { "pageViewsLabel": "本文总阅读量", "pageViewsUnit": "次", "exitWebFullscreen": "退出网页全屏" },
  "en":    { "pageViewsLabel": "Total views", "pageViewsUnit": "times", "exitWebFullscreen": "Exit Fullscreen" },
  "zh-TW": { "pageViewsLabel": "本文總閱讀量", "pageViewsUnit": "次", "exitWebFullscreen": "退出網頁全螢幕" },
  "ja":    { "pageViewsLabel": "本記事の総閲覧数", "pageViewsUnit": "回", "exitWebFullscreen": "全画面を終了" },
  "ko":    { "pageViewsLabel": "총 조회수", "pageViewsUnit": "회", "exitWebFullscreen": "전체화면 종료" },
  "fr":    { "pageViewsLabel": "Vues totales", "pageViewsUnit": "fois", "exitWebFullscreen": "Quitter le plein écran" },
  "de":    { "pageViewsLabel": "Gesamtaufrufe", "pageViewsUnit": "Mal", "exitWebFullscreen": "Vollbild beenden" },
  "es":    { "pageViewsLabel": "Vistas totales", "pageViewsUnit": "veces", "exitWebFullscreen": "Salir de pantalla completa" },
  "pt":    { "pageViewsLabel": "Visualizações totais", "pageViewsUnit": "vezes", "exitWebFullscreen": "Sair da tela cheia" },
  "ru":    { "pageViewsLabel": "Всего просмотров", "pageViewsUnit": "раз", "exitWebFullscreen": "Выйти из полноэкранного режима" },
  "ar":    { "pageViewsLabel": "إجمالي المشاهدات", "pageViewsUnit": "مرة", "exitWebFullscreen": "الخروج من وضع ملء الشاشة" },
  "hi":    { "pageViewsLabel": "कुल दृश्य", "pageViewsUnit": "बार", "exitWebFullscreen": "फ़ुलस्क्रीन से बाहर निकलें" },
  "it":    { "pageViewsLabel": "Visualizzazioni totali", "pageViewsUnit": "volte", "exitWebFullscreen": "Esci dalla schermata intera" },
  "nl":    { "pageViewsLabel": "Totale weergaven", "pageViewsUnit": "keer", "exitWebFullscreen": "Volledig scherm verlaten" },
  "tr":    { "pageViewsLabel": "Toplam görüntüleme", "pageViewsUnit": "kez", "exitWebFullscreen": "Tam ekrandan çık" },
  "vi":    { "pageViewsLabel": "Tổng lượt xem", "pageViewsUnit": "lần", "exitWebFullscreen": "Thoát toàn màn hình" },
  "th":    { "pageViewsLabel": "ยอดเข้าชมทั้งหมด", "pageViewsUnit": "ครั้ง", "exitWebFullscreen": "ออกจากโหมดเต็มหน้าจอ" },
  "id":    { "pageViewsLabel": "Total tampilan", "pageViewsUnit": "kali", "exitWebFullscreen": "Keluar layar penuh" },
  "pl":    { "pageViewsLabel": "Łączne wyświetlenia", "pageViewsUnit": "razy", "exitWebFullscreen": "Wyjdź z pełnego ekranu" },
  "sv":    { "pageViewsLabel": "Totala visningar", "pageViewsUnit": "gånger", "exitWebFullscreen": "Avsluta helskärm" }
}</i18n>

