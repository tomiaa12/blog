<template>
  <div>
    <KTrend
      text="下降"
      type="down"
    />
    <KTrend
      text="增加"
      up-icon-color="blue"
      up-text-color="blue"
    />
    <KTrend
      text="减少"
      type="down"
      down-icon-color="pink"
      down-text-color="pink"
    />
  </div>
</template>
<script setup lang="ts">
import { KTrend } from "@tomiaa/vue3-components"
</script>
