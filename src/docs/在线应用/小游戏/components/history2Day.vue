<template>
  <Text :api="history2Day" :showBtn="false"/>
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { history2Day } from "@/api"
</script>
