<template>
  <guessit
    :api="getGuessit"
    type="twoDimension"
    name="二次元浓度测试"
    :is-prompt="false"
  />
</template>

<script setup lang="ts">
import guessit from "./guessit.vue"
import { getGuessit } from "@/api"
</script>
