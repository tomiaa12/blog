<template>
  <div ref="live2dContentRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Live2d } from "@tomiaa/library/src"
import "@tomiaa/theme-chalk/lib/library/live2d.css"
import "@tomiaa/theme-chalk/lib/library/hitokoto.css"
const live2dContentRef = ref()

onMounted(() => {
  new Live2d({
    el: live2dContentRef.value,
  })
})
</script>
