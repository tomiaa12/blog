<template>
  <div ref="live2dContentRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Live2d } from "@tomiaa/live2d"

import { getPropertyValue } from "@/utils"


const live2dContentRef = ref()

onMounted(() => {
  new Live2d({
    el: live2dContentRef.value,
    showLoading: false,
    maxWidth: 300,
    jsBaseURL: "https://live2d.kuangyx.cn/public",
    hitokotoOptions: {
      interval: 60000,
      movingBorderColor: !import.meta.env.SSR ? getPropertyValue('--el-color-primary') : "#409ba5"
    }
  })
})
</script>
