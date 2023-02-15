<template>
  <KSelectDate
    v-model:startDate="startDate"
    v-model:endDate="endDate"
  />
</template>
<script setup lang="ts">
import { ref } from "vue"
import { KSelectDate } from "@tomiaa/vue3-components"

const startDate = ref("")
const endDate = ref("")
</script>
