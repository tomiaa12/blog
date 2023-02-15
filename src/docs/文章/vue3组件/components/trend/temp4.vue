<template>
  <div>
    <KTrend>销售业绩</KTrend>
    <KTrend>
      图标插槽
      <template #upIcon>
        <ElIconCaretTop />
      </template>
    </KTrend>
    <KTrend type="down">
      图标插槽
      <template #downIcon>
        <ElIconCaretBottom />
      </template>
    </KTrend>
  </div>
</template>
<script setup lang="ts">
import { KTrend } from "@tomiaa/vue3-components"
</script>
