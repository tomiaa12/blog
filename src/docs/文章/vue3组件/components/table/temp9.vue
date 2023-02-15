<template>
  <KTable
    :options="options"
    get-url="/getList"
    :get-config="{
      method: 'post',
    }"
    with-page-path="pages"
    :with-query="{
      name: '这是携带的查询参数',
    }"
    with-query-path="query"
    data-path="data.result"
    total-path="data.pagination.total"
    show-pagination
    :total="300"
  >
  </KTable>
</template>

<script setup lang="ts">
import type { TableProps } from "@tomiaa/vue3-components"
import { KTable } from "@tomiaa/vue3-components"

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
</script>
