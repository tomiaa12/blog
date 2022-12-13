<template>
  <el-space :class="bem.b()">
    <el-date-picker
      :model-value="startDate"
      :placeholder="startDatePlaceholder"
      :disabled-date="disabledStartDate"
      :format="format"
      :type="type"
      :value-format="valueFormat"
      clearable
      v-bind="startDateAttrs"
      @update:model-value="startChange"
    />
    <el-date-picker
      :model-value="endDate"
      :placeholder="endDatePlaceholder"
      :disabled="enTimeDisabled && !startDate"
      :disabled-date="disabledEndDate"
      :format="format"
      :type="type"
      :value-format="valueFormat"
      clearable
      v-bind="endDateAttrs"
      @update:model-value="$emit('update:endDate', $event || '')"
    />
  </el-space>
</template>

<script setup lang="ts">
import { selectDateProps } from "./selectDate"
import { createNamespacs } from "@tomiaa/utils"
defineOptions({
  name: "KSelectDate",
})

const bem = createNamespacs("selectTime")

const props = defineProps(selectDateProps)

const emits = defineEmits([
  "update:startDate", // 更新v-model:startDate
  "update:endDate", // 更新v-model:endDate
])

const startChange = (val: string) => {
  emits("update:startDate", val || "")
  props.enTimeDisabled && !val && emits("update:endDate", "")
}

const disabledStartDate = (time: Date) =>
  props.endDate && +time > +new Date(props.endDate)
const disabledEndDate = (time: Date) =>
  props.startDate && +time < +new Date(props.startDate)
</script>
