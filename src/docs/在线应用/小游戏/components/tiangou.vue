<template>
  <Text :api="tiangou" :format="format" btnText="舔她" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { tiangou } from "@/api"

const format = (txt: string) => txt.split("\n")
</script>
