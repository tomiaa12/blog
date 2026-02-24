<template>
  <KForm
    :options="options"
    :actions-config="actionsConfig"
  >
  </KForm>
</template>
<script setup lang="ts">
import { ref } from "vue"
import type { FormProps } from "@tomiaa/vue3-components/src"
import { KForm } from "@tomiaa/vue3-components"

const actionsConfig: FormProps["actionsConfig"] = {
  showCancel: true, // 默认值
  showSubmit: true, // 默认值
  showReset: true, // 默认值
  submitText: "提交", // 默认值
  resetText: "重置", // 默认值
  cancelText: "取消", // 默认值
  custom(list) {
    // 修改按钮列表
    list[0].icon = "el-icon-menu"
    // 以返回的列表渲染
    return list
  },
}

const options = ref<FormProps["options"]>([
  {
    el: "span",
    children: "姓名",
    required: true,
    span: 8,
  },
  {
    el: "el-divider",
    children: "分隔线",
  },
])
</script>
