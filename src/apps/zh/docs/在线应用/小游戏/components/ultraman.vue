<template>
  <guessit :api="getGuessit" type="ultraman" name="看图猜奥特曼" />
</template>

<script setup lang="ts">
import guessit from './guessit.vue'
import { getGuessit } from "@/api"

</script>