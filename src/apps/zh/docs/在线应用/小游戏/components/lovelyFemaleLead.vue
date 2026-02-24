<template>
  <Image
    :src="`${baseUrl}/lovely?t=${i}`"
    :zoom="false"
  ></Image>
  <el-button
    type="primary"
    size="large"
    @click="i++"
    round
  >
    换一个
  </el-button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Image from "@/components/Image.vue"

import { baseUrl } from "@/utils"

const i = ref(0)
</script>

<style lang="scss" scoped>
.el-button {
  margin: auto;
  display: block;
}
</style>
