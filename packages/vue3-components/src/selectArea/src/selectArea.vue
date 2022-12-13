<template>
  <el-space
    wrap
    :class="bem.b()"
  >
    <el-select
      v-model="province"
      placeholder="请选择省份"
      clearable
      filterable
      v-bind="provinceAttrs"
    >
      <el-option
        v-for="item in allAreas"
        :label="item.name"
        :value="item.code"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="city"
      placeholder="请选择城市"
      clearable
      filterable
      :disabled="!province"
      v-bind="cityAttrs"
    >
      <el-option
        v-for="item in selectCity"
        :label="item.name"
        :value="item.code"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="area"
      placeholder="请选择区域"
      clearable
      filterable
      :disabled="!province || !city"
      v-bind="areaAttrs"
    >
      <el-option
        v-for="item in selectArea"
        :label="item.name"
        :value="item.code"
      >
      </el-option>
    </el-select>
  </el-space>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"

import { SelectAreaItem, selectAreaProps } from "./selectArea"
import { createNamespacs } from "@tomiaa/utils"

// 省市区三级联动数据 https://github.com/modood/Administrative-divisions-of-China
import allAreas from "./lib/pac-code.json"

defineOptions({
  name: "KSelectArea",
})
const bem = createNamespacs("progress")

defineProps(selectAreaProps)

const emits = defineEmits(["change"])

// 省
const province = ref()
// 市
const city = ref()
// 区
const area = ref()

// 市下拉数据
const selectCity = computed<SelectAreaItem[]>(
  () => allAreas.find(item => item.code === province.value)?.children || []
)
// 区下拉数据
const selectArea = computed<SelectAreaItem[]>(
  () => selectCity.value?.find(item => item.code === city.value)?.children || []
)

// 省改变时清除市、区
watch(province, () => {
  city.value = ""
})

// 市改变时清除区
watch(city, () => {
  area.value = ""
})

// 区选择完成时分发 change 事件
watch(area, () => {
  if (!area.value) return
  const provinceData = {
    code: province.value,
    name: allAreas.find((item: SelectAreaItem) => item.code === province.value)!
      .name,
  }
  const cityData = {
    code: city.value,
    name: selectCity.value.find(
      (item: SelectAreaItem) => item.code === city.value
    )!.name,
  }
  const areaData = {
    code: area.value,
    name: selectArea.value.find(
      (item: SelectAreaItem) => item.code === area.value
    )!.name,
  }
  emits("change", { provinceData, cityData, areaData })
})
</script>
