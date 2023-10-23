<template>
  <Text :api="sentence" text-align="center" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { sentence } from "@/api"
</script>
