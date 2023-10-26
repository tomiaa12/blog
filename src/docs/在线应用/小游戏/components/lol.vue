<template>
  <guessit :api="getGuessit" type="lol" name="看图、听音猜LOL英雄" />
</template>

<script setup lang="ts">
import guessit from './guessit.vue'
import { getGuessit } from "@/api"

</script>