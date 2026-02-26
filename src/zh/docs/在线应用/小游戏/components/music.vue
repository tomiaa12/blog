<template>
  <guessit
    :api="getGuessit"
    type="music"
    name="猜音乐"
  />
</template>

<script setup lang="ts">
import guessit from "./guessit.vue"
import { getGuessit } from "@/api"
</script>
