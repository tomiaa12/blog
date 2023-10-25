<template>
  <Title title="图片中的奥特曼是？" style="margin-top: 0;" ></Title>
  <guessit :api="getGuessit" type="ultraman" name="看图猜奥特曼" />
</template>

<script setup lang="ts">
import guessit from './guessit.vue'
import { getGuessit } from "@/api"
import Title from "@/components/Title.vue"

</script>