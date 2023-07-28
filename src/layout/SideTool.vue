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
    <!-- <li>
      <div class="grounp">
        <el-icon :size="24">
          <img :src="wxIcon" />
        </el-icon>
        <span>放大看</span>
      </div>
    </li> -->
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
    padding: 4px;
    color: var(--vp-c-green);
    cursor: pointer;

    &:hover {
      background-color: var(--el-fill-color-light);
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
