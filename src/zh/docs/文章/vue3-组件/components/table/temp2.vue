<template>
  <KTable
    :data="tableData"
    :options="options"
    @edit="edit"
    @delete="delRow"
  />
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
    label: "控制",
    action: true,
  },
]
// 点击编辑按钮
const edit = (scope: any) => {
  console.log(scope)
}
// 点击删除按钮
const delRow = (scope: any) => {
  console.log(scope)
}
</script>
