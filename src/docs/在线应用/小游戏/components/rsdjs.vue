<template>
  <Text
    :api="rsdjs"
    :format="format"
    :showBtn="false"
    justifyContent="center"
  />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { rsdjs } from "@/api"

const format = (data: {
  day: string
  month: string
  time: string
  week: string
}) => [data.time, data.day, data.week, data.month]
</script>
