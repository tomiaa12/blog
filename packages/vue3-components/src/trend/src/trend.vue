<template>
  <span :class="[bem.b()]">
    <span
      :style="{
        color: type === 'up' ? upTextColor : downTextColor,
      }"
    >
      <slot>
        <span>{{ text }}</span>
      </slot>
    </span>
    <el-icon
      v-if="type === 'up'"
      :color="!reverseColor ? upIconColor : downIconColor"
    >
      <slot name="upIcon">
        <component :is="upIcon" />
      </slot>
    </el-icon>
    <el-icon
      v-else
      :color="!reverseColor ? downIconColor : upIconColor"
    >
      <slot name="downIcon">
        <component :is="downIcon" />
      </slot>
    </el-icon>
  </span>
</template>

<script setup lang="ts">
import { trendProps } from "./trend"
import { createNamespacs } from "@tomiaa/utils"

defineOptions({
  name: "KTrend",
})

defineProps(trendProps)

const bem = createNamespacs("trend")
</script>
