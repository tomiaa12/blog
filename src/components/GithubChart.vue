<template>
  <div class="github-chart">
    <el-image
      class="github-chart__image"
      :src="`https://ghchart.rshah.org/${color}/tomiaa12`"
      fit="contain"
      :lazy="true"
      alt="tomiaa12 的 Github 贡献图表"
    >
      <template #placeholder>
        <emptyChat class="github-chart__placeholder" />
      </template>
    </el-image>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import emptyChat from "@/assets/svg/emptyChat.svg"
import { getPropertyValue } from "@/utils"

const color = ref(
  !import.meta.env.SSR
    ? getPropertyValue("--el-color-primary").slice(1)
    : "409ba5"
)
</script>
<style lang="scss" scoped>
.github-chart {
  width: 100%;
  margin: 10px 0 0 0;
  padding: 0;
  max-width: 1125px;
}

.github-chart__image {
  width: 100%;
  display: block;
  aspect-ratio: 1125 / 180;
}

.github-chart__placeholder {
  width: 100%;
  height: 100%;
  display: block;
}

.github-chart__image :deep(.el-image__inner),
.github-chart__image :deep(.el-image__wrapper),
.github-chart__image :deep(.el-image__placeholder) {
  width: 100%;
  height: 100%;
  display: block;
}

@media (min-width: 960px) {
  .github-chart {
    padding: 0 64px;
  }
}

@media (min-width: 640px) {
  .github-chart {
    padding: 0 48px;
  }
}
@media (min-width: 1200px) {
  .github-chart {
    padding: 0;
  }
}
@media (max-width: 640px) {
  .github-chart {
    padding: 0 24px;
  }
}
</style>
