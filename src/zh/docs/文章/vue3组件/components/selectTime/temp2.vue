<template>
  <KSelectTime
    v-model:startTime="startTime"
    v-model:endTime="endTime"
    start-time-start="10:30"
    start-time-end="20:30"
    end-time-start="11:00"
    end-time-end="21:00"
    start-time-step="00:40"
    end-time-step="01:00"
    en-time-disabled
    :start-time-attrs="{ size: 'large' }"
    :end-time-attrs="{ size: 'small' }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { KSelectTime } from "@tomiaa/vue3-components"

const startTime = ref("")
const endTime = ref("")
</script>
