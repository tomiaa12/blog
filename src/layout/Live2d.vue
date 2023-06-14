<template>
  <div ref="live2dContentRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Live2d } from "@tomiaa/live2d"

const live2dContentRef = ref()

onMounted(() => {
  new Live2d({
    el: live2dContentRef.value,
    showLoading: false,
    maxWidth: 350,
  })
})
</script>
