<template>
  <el-config-provider :locale="locale" v-if="isVSCode">
    <VPContent :class="getCurClass">
    </VPContent>
  </el-config-provider>
  <template v-else>
    <ClientOnly>
      <FirstLoading />
    </ClientOnly>
    <el-config-provider :locale="locale">
      <defaultLayout :class="getCurClass">
        <template #aside-outline-after>
          <ins class="adsbygoogle" style="display: block; height: 230px" data-ad-client="ca-pub-6209757986574246"
            data-ad-slot="6047648655" data-ad-format="auto" data-full-width-responsive="true">
          </ins>
        </template>
        <template #doc-before v-if="!isMobile">
          <ins class="adsbygoogle" style="display: block; margin: 1em auto" data-ad-client="ca-pub-6209757986574246"
            data-ad-slot="9323844417" data-ad-format="auto" data-full-width-responsive="true">
          </ins>
          <div class="page_pv">
            本文总阅读量
            <span id="busuanzi_value_page_pv">
              <el-icon-loading class="loading-icon" />
            </span>
            次
          </div>
        </template>
        <template #doc-after>
          <!-- <Comment v-if="!showGlobalComment" /> -->
          <!-- <div
            v-show="!showGlobalComment"
            class="giscus"
          ></div> -->
        </template>
      </defaultLayout>
    </el-config-provider>

    <ClientOnly v-if="!isMobile">
      <SideTool />
    </ClientOnly>
    <!-- <Comment
      v-if="showGlobalComment"
      class="home-comment"
    /> -->

    <Live2D v-if="!isMobile && !isTablet" />

    <el-backtop v-if="!isMobile" :right="300" />
  </template>
</template>

<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn"
import defaultLayout from "vitepress/dist/client/theme-default/Layout.vue"
import VPContent from "vitepress/dist/client/theme-default/components/VPContent.vue"
import { useRoute, useRouter, useData, inBrowser } from "vitepress"
import { computed, onMounted, watch, nextTick } from "vue"
import Comment from "./Comment.vue"
import Live2D from "./Live2d.vue"
import SideTool from "./SideTool.vue"
import { isMobile, isTablet, isVSCode } from "@/utils"
import FirstLoading from "./FirstLoading.vue"

const route = useRoute()
const router = useRouter()
const data = useData()

// VSCode 环境下默认使用深色模式
if (isVSCode.value && data.isDark) {
  data.isDark.value = true
}

const getCurClass = computed(() => data.frontmatter.value.class)

const showGlobalComment = computed(() => data.frontmatter.value.layout)

const locale = zhCn

let script: any
onMounted(async () => {
  // VSCode 环境下强制使用深色模式
  if (isVSCode.value && data.isDark) {
    data.isDark.value = true
  }

  // eslint-disable-next-line no-import-assign
  script = await import("busuanzi.pure.js")
  script?.fetch()

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
  },
  {
    immediate: true,
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
</style>
