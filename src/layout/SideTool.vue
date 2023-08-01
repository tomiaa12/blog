<template>
  <ul class="site-tool">
    <li @click="to('/docs/关于/交流群.html')">
      <el-popover
        placement="left"
        title="交流群"
        :width="250"
        trigger="hover"
        popper-class="qun-contianer"
      >
        <template #reference>
          <div class="grounp">
            <el-icon :size="24">
              <wechat />
            </el-icon>
            <span>交流群</span>
          </div>
        </template>
        <CommunicationGroup />
      </el-popover>
    </li>
    <li @click="to('/docs/关于/支持我.html')">
      <el-popover
        placement="left"
        title="支持我"
        :width="250"
        trigger="hover"
        popper-class="qun-contianer"
      >
        <template #reference>
          <div class="grounp">
            <el-icon :size="24">
              <love />
            </el-icon>
            <span>支持我</span>
          </div>
        </template>
        <SupportMe />
      </el-popover>
    </li>
    <li>
      <div class="grounp">
        <el-icon :size="24">
          <fullScreen />
        </el-icon>
        <span>放大看</span>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { ref } from "vue"
import { useRouter } from "vitepress"

import CommunicationGroup from "./CommunicationGroup/index.vue"
import SupportMe from "./SupportMe/index.vue"

import wechat from "@/assets/svg/wechat.svg"
import fullScreen from "@/assets/svg/fullScreen.svg"
import love from "@/assets/svg/love.svg"

// const props = defineProps({})
const emits = defineEmits([])

const router = useRouter()

const to = path => router.go(path)
</script>
<style lang="scss" scoped>
.site-tool {
  position: fixed;
  top: calc(var(--vp-nav-height) + 0.5em);
  right: 0;
  z-index: 2000;
  box-shadow: var(--el-box-shadow-light);

  li {
    transition: 0.3s;
    font-size: 12px;
    color: var(--el-color-info-light);
    padding: 8px;
    cursor: pointer;

    &:hover {
      background-color: var(--el-fill-color-light);
      color: var(--vp-c-green);
    }

    & + li {
      border-top: 1px solid var(--el-border-color-light);
    }
  }
}
.grounp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
.qun-contianer {
  max-height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
