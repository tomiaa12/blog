<template>
  <Text :api="rainbow" text-align="center" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { rainbow } from "@/api"
</script>
