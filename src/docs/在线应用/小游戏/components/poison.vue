<template>
  <Text :api="poison" text-align="center" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { poison } from "@/api"
</script>
