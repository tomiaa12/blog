<template>
  <Text :api="poison" justifyContent="center" />
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { poison } from "@/api"
</script>
