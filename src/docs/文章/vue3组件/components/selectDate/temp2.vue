<template>
  <KSelectDate
    v-model:startDate="startDate"
    v-model:endDate="endDate"
    start-date-placeholder="开始时间"
    end-date-placeholder="结束时间"
    en-time-disabled
    value-format="YYYY-MM-DD HH:mm:ss"
    format="YYYY/MM/DD HH:mm:ss"
    type="datetime"
    :start-date-attrs="{
      clearable: true,
      size: 'large',
    }"
  />
</template>
<script setup lang="ts">
import { ref } from "vue"
import { KSelectDate } from "@tomiaa/vue3-components"

const startDate = ref("")
const endDate = ref("")
</script>
