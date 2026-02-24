<template>
  <KTable
    ref="kTable"
    :options="options"
    show-pagination
    :server="myAxios"
    get-url="/getData"
    :get-config="{
      method: 'post',
    }"
    with-page="data"
    with-page-path="pagination"
    :replace-fields="{
      currentPage: 'current',
      pageSize: 'size',
    }"
    :with-query="{
      name: '这里是查询参数',
    }"
    with-query-path="query"
    stringify
    data-path="data.result"
    total-path="data.total"
    show-load-in-get
    element-loading-text="正在加载中"
    :el-loading-text-timeout="3000"
    el-loading-text-timeout-text="加载较慢，请耐心等待"
    empty-tip="正在加载数据中..."
    :empty-tip-timeout="3000"
    empty-tip-timeout-text="数据加载较慢，马上就来..."
    @before-get-data="beforeGetData"
    @after-get-data="afterGetData"
    @fail-to-get-data="failToGetData"
  >
  </KTable>
</template>

<script setup lang="ts">
import type { TableProps } from "@tomiaa/vue3-components"
import { ref, onMounted } from "vue"
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

// 模拟 axios 请求
const myAxios: any = (req: any) =>
  new Promise(res => {
    console.log(req, "请求的参数")
    setTimeout(() => {
      res({
        code: 200,
        data: {
          result: [
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
          ],
          total: 390,
        },
        msg: "成功",
      })
    }, 10000)
  })

const beforeGetData = (getConfig: any) => {
  console.log("请求接口之前，axios的参数", getConfig)
}
const afterGetData = (response: any) => {
  console.log("接口请求成功", response)
}
const failToGetData = (error: any) => {
  console.log("接口请求失败", error)
}
const kTable = ref()
onMounted(() => {
  // 手动请求数据
  // kTable.value.getData()
})
</script>
