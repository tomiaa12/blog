<template>
  <el-progress
    :class="bem.b()"
    :percentage="num"
    v-bind="$attrs"
  ></el-progress>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue"
import { createNamespacs } from "@tomiaa/utils"
import { progressProps } from "./progress"

const props = defineProps(progressProps)

defineOptions({
  name: "KProgress",
})

const bem = createNamespacs("progress")

const num = ref(0)
const duration = props.duration / props.percentage
let timer: number
onMounted(() => {
  timer = window.setInterval(() => {
    ++num.value == props.percentage && clearInterval(timer)
  }, duration)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
