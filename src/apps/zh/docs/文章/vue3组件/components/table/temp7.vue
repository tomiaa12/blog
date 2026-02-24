<template>
  <KTable
    :data="tableData"
    :options="options"
  >
    <!-- 编辑时按钮插槽 -->
    <template #editControlIcon="scope">
      <el-button
        style="margin-left: 0.2em"
        size="small"
        @click="enter(scope)"
        >确认</el-button
      >
    </template>

    <!-- 未编辑时按钮插槽 -->
    <template #editIcon="scope">
      <el-button
        style="margin-left: 0.2em"
        size="small"
        @click="editCell(scope)"
        >编辑</el-button
      >
    </template>
  </KTable>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { TableProps } from "@tomiaa/vue3-components"
import { KTable } from "@tomiaa/vue3-components"
const tableData = ref<any>([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
])
const options: TableProps["options"] = [
  {
    label: "名称",
    prop: "name",
  },
  {
    label: "时间",
    prop: "date",
  },
  {
    label: "可编辑",
    prop: "address",
    width: 300,
    editable: true, // 可编辑
  },
]

// 编辑
const editCell = ({ isEdit, row }: any) => {
  console.log(row, "dasdas")
  isEdit.value = true
}
// 确定编辑
const enter = ({ isEdit, row }: any) => {
  console.log(row)
  isEdit.value = false // 取消编辑状态
}
</script>
