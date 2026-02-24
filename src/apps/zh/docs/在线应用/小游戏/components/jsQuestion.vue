<template>
  <guessit
    :api="getGuessit"
    type="jsQuestion"
    name="JavaScript进阶问题测验"
    :is-prompt="false"
  />
</template>

<script setup lang="ts">
import guessit from "./guessit.vue"
import { getGuessit } from "@/api"
</script>
