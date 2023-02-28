<template>
  <div ref="latexContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { KLatexTemplate } from "@tomiaa/latex-template"
import { ElMessage } from "element-plus"

const latexContainer = ref()

onMounted(() => {
  new KLatexTemplate(latexContainer.value).onInput = latex => {
    ElMessage.success(`公式代码为：${latex}`)
  }
})
</script>

<style scoped lang="scss">
:deep(svg) {
  display: inline;
}
:deep(p) {
  margin: 0;
}
</style>
