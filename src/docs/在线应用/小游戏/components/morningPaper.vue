<template>
  <Text
    :api="morningPaper"
    :format="format"
    :position="false"
    size="18px"
    :show-btn="false"
  />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { morningPaper } from "@/api"

const format = (txt: string) => txt.split("\n").map(i => `<p>${i}</p>`).join("")
</script>
