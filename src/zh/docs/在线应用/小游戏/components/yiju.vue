<template>
  <Text :api="sentence" justifyContent="center" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { sentence } from "@/api"
</script>
