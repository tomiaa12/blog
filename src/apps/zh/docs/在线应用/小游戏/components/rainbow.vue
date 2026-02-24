<template>
  <Text :api="rainbow" justifyContent="center" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { rainbow } from "@/api"
</script>
