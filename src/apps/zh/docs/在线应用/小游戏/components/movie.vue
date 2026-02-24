<template>
  <guessit :api="getGuessit" type="movie" name="看图猜电影" />
</template>

<script setup lang="ts">
import guessit from './guessit.vue'
import { getGuessit } from "@/api"

</script>