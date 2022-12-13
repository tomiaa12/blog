<template>
  <div>
    <KProgress :percentage="50" />
    <KProgress
      :percentage="50"
      :duration="10000"
    />

    <!-- element el-progress 属性-->
    <KProgress
      type="circle"
      :percentage="50"
    />

    <KProgress
      type="circle"
      :percentage="100"
      status="success"
    />

    <KProgress
      :text-inside="true"
      :stroke-width="26"
      :percentage="70"
    />
  </div>
</template>

<script setup lang="ts">
import { KProgress } from "@tomiaa/vue3-components"
</script>

<style scoped lang="scss">
:deep(svg) {
  width: unset;
  height: unset;
}
</style>
