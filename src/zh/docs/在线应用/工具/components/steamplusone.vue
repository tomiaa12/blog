<template>
  <KTable
    v-loading="loading"
    :data="info"
    :options="options"
    @edit="edit"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { steamplusone } from "@/api"
import type { TableProps } from "@tomiaa/vue3-components"
import { KTable } from "@tomiaa/vue3-components"

const info = ref()
const loading = ref(true)
onMounted(async () => {
  try {
    const { data } = await steamplusone()
    info.value = data
  } finally {
    loading.value = false
  }
})

const options: TableProps["options"] = [
  {
    label: "名称",
    prop: "name",
  },
  {
    label: "类型",
    prop: "type",
  },
  {
    label: "入库期限",
    prop: "perpetual",
  },
  {
    label: "平台",
    prop: "source",
  },
  {
    label: "开始时间",
    prop: "starttime",
  },
  {
    label: "结束时间",
    prop: "endtime",
  },
  {
    action: true,
    actionConfig: {
      editText: "立即获取",
      showDelete: false,
      custom(list, scope) {
        list[0].type = "primary"
        return list
      },
    },
  },
]

const edit = ({ row }) => {
  window.open(row.url)
}
</script>
<style lang="scss" scoped>
.el-descriptions {
  margin-top: 1em;
}

.el-input {
  max-width: 450px;
}
</style>
