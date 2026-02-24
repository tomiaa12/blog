<template>
  <KTable
    :data="tableData"
    :options="options"
    edit-row
    @confirm-edit-row="confirmEditRow"
    @cancel-edit-row="cancelEditRow"
  >
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
    label: "编辑行",
    action: true,
  },
]

const confirmEditRow = (scope: any) => {
  console.log(scope, "确定编辑行")
}
const cancelEditRow = (scope: any) => {
  console.log(scope, "取消编辑行")
}
</script>
