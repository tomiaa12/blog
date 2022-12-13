<template>
  <el-space
    :class="bem.b()"
    v-bind="$attrs"
  >
    <el-time-select
      :model-value="startTime"
      :max-time="endTime"
      :placeholder="startTimePlaceholder"
      :start="startTimeStart"
      :end="startTimeEnd"
      :step="startTimeStep"
      v-bind="startTimeAttrs"
      @update:model-value="startChange"
    />
    <el-time-select
      :model-value="endTime"
      :min-time="startTime"
      :placeholder="endTimePlaceholder"
      :start="endTimeStart"
      :end="endTimeEnd"
      :step="endTimeStep"
      :disabled="enTimeDisabled && !startTime"
      v-bind="endTimeAttrs"
      @update:model-value="$emit('update:endTime', $event)"
    />
  </el-space>
</template>

<script setup lang="ts">
import { createNamespacs } from "@tomiaa/utils"
import { selectTimeProps } from "./selectTime"

defineOptions({
  name: "KSelectTime",
})

const bem = createNamespacs("selectTime")

const props = defineProps(selectTimeProps)

const emits = defineEmits(["update:startTime", "update:endTime"])

const startChange = (val: string) => {
  emits("update:startTime", val)
  props.enTimeDisabled && !val && emits("update:endTime", "")
}
</script>
