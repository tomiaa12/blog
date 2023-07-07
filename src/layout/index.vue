<template>
  <defaultLayout :class="getCurClass">
    <template #home-features-after>
      <div
        v-loading
        class="site_pv"
      >
        本站总访问量
        <span id="busuanzi_value_site_pv">
          <el-icon-loading class="loading-icon" />
        </span>
        次，访客数
        <span id="busuanzi_value_site_uv">
          <el-icon-loading class="loading-icon" />
        </span>
        人次
      </div>
    </template>
    <template #doc-before>
      <div class="page_pv">
        本文总阅读量
        <span id="busuanzi_value_page_pv">
          <el-icon-loading class="loading-icon" />
        </span>
        次
      </div>
    </template>
    <template #doc-after>
      <Comment v-if="route.path !== '/'" />
    </template>
  </defaultLayout>
  <Comment
    v-if="route.path === '/'"
    class="home-comment"
  />
  <Live2D />

  <el-backtop :right="300" />

  <el-popover
    placement="left"
    title="交流群"
    :width="250"
    trigger="hover"
    popper-class="qun-contianer"
  >
    <template #reference>
      <div class="fixd">
        <el-icon :size="24">
          <img :src="wxIcon" />
        </el-icon>
        <span>交流群</span>
      </div>
    </template>
    <CommunicationGroup />
  </el-popover>
</template>

<script setup lang="ts">
import defaultLayout from "vitepress/dist/client/theme-default/Layout.vue"
import { useRoute, useData } from "vitepress"
import { computed, nextTick, onMounted, watch } from "vue"
import Comment from "./Comment.vue"
import Live2D from "./Live2d.vue"
import CommunicationGroup from "./CommunicationGroup.vue"
import wxIcon from "./CommunicationGroup/img/wx.svg"

const route = useRoute()

const data = useData()

const getCurClass = computed(() => data.frontmatter.value.class)

let script: any
onMounted(async () => {
  // eslint-disable-next-line no-import-assign
  script = await import("busuanzi.pure.js")
})
watch(
  () => route.path,
  () => {
    script?.fetch()
  },
  {
    immediate: true,
  }
)
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

.fixd {
  position: fixed;
  top: 30%;
  right: 1px;
  border-radius: 4px;
  padding: 4px;
  display: flex;
  z-index: 2000;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--el-border-color);
  color: var(--vp-c-green);
  cursor: pointer;
}

.page_pv {
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}
</style>

<style lang="scss">
.qun-contianer {
  max-height: 95vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.loading-icon {
  display: inline;
  vertical-align: middle;
  animation: loading-rotate 2s linear infinite;
}
</style>
