<template>
  <KSelectTime
    v-model:startTime="startTime"
    v-model:endTime="endTime"
  />
</template>
<script setup lang="ts">
import { ref } from "vue"
import { KSelectTime } from "@tomiaa/vue3-components"

const startTime = ref("")
const endTime = ref("")
</script>
