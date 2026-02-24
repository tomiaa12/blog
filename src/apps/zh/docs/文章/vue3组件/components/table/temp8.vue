<template>
  <KTable
    show-pagination
    :current-page="pagination.currentPage"
    :total="pagination.total"
    :data="tableData"
    :options="options"
    layout="total, prev, pager, next"
    background
    @update:current-page="handleCurrentChange"
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
]

const pagination = ref({
  total: 300,
  currentPage: 2,
})

const handleCurrentChange = (num: number) => {
  pagination.value.currentPage = num
  console.log(num, "temp8")
}
</script>
