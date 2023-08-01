<template>
  <ul class="site-tool">
    <li @click="toGrounp">
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
              <img :src="wxIcon" />
            </el-icon>
            <span>交流群</span>
          </div>
        </template>
        <CommunicationGroup />
      </el-popover>
    </li>
    <li>
      <div class="grounp">
        <el-icon :size="24"
          ><svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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
import wxIcon from "./CommunicationGroup/img/wx.svg"

// const props = defineProps({})
const emits = defineEmits([])

const router = useRouter()

const toGrounp = () => {
  router.go("/docs/关于/交流群.html")
}
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
