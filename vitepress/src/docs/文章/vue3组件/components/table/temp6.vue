<template>
  <KTable
    :data="tableData"
    :options="options"
    @confirm-edit-cell="confirmEditCell"
    @cancel-edit-cell="cancelEditCell"
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
    label: "可编辑",
    prop: "address",
    editable: true, // 可编辑
    editableConfig: {
      // 单元格内编辑配置
      showClose: true, // 显示编辑时取消按钮
      showEnter: true, // 显示编辑时确认按钮
      custom(list, scope, isEdit) {
        list.push({
          el: "el-button",
          size: "small",
          icon: "ElIconCheck",
          onClick() {
            console.log(scope)
            isEdit.value = false // 关闭编辑状态
          },
        })
        return list
      },
    },
  },
]

// 确定编辑
const confirmEditCell = (scope: any) => {
  console.log(scope)
}
// 取消编辑
const cancelEditCell = (scope: any) => {
  console.log(scope)
}
</script>
