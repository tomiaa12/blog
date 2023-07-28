<template>
  <ul class="site-tool">
    <li>
      <el-popover
        placement="left"
        title="交流群"
        :width="250"
        trigger="hover"
        popper-class="qun-contianer"
      >
        <template #reference>
          <div
            class="grounp"
            @click="toGrounp"
          >
            <el-icon :size="24">
              <img :src="wxIcon" />
            </el-icon>
            <span>交流群</span>
          </div>
        </template>
        <CommunicationGroup />
      </el-popover>
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

  span {
    font-size: 12px;
  }

  li {
    transition: 0.3s;
    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }
}
.grounp {
  border-radius: 4px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--vp-c-green);
  cursor: pointer;
}
</style>

<style lang="scss">
.qun-contianer {
  max-height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
