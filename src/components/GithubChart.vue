<template>
  <el-image
    :src="`https://ghchart.rshah.org/${color}/tomiaa12`"
    fit="fill"
    :lazy="true"
    alt="tomiaa12 的 Github 贡献图表"
  >
    <template #placeholder>
      <emptyChat style="width: 100%; height: auto" />
    </template>
  </el-image>
</template>

<script setup lang="ts">
import { ref } from "vue"
import emptyChat from "@/assets/svg/emptyChat.svg"
import { getPropertyValue } from "@/utils"

const color = ref(!import.meta.env.SSR ? getPropertyValue('--el-color-primary').slice(1) : "409ba5")

</script>
<style lang="scss" scoped>
.el-image {
  width: 100%;
  margin: 24px auto;
  max-width: 1125px;
  display: block;
}

@media (min-width: 960px) {
  .el-image {
    padding: 0 64px;
  }
}

@media (min-width: 640px) {
  .el-image {
    padding: 0 48px;
  }
}
@media (min-width: 1200px) {
  .el-image {
    padding: 0;
  }
}
@media (max-width: 640px) {
  .el-image {
    padding: 0 24px;
  }
}
</style>
