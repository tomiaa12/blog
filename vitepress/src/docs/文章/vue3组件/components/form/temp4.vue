<template>
  <KForm
    ref="dialogForm"
    :model="formModel"
    :gutter="15"
    :options="options"
    :actions-config="actionsConfig"
  >
  </KForm>
</template>
<script setup lang="ts">
import { computed, ref } from "vue"
import type { FormProps } from "@tomiaa/vue3-components/src"
import { KForm } from "@tomiaa/vue3-components"

const formModel = ref({ list: [] as string[] })

const inputList = computed<FormProps["options"]>(() =>
  formModel.value.list.map((modelValue: string, i: number) => ({
    el: "el-input",
    modelValue,
    prop: `list.${i}`,
    label: `第${i + 1}行`,
    rules: {
      required: true,
      message: `第${i + 1}行必填`,
    },
  }))
)

const actionsConfig: FormProps["actionsConfig"] = {
  showCancel: false,
  showReset: false,
  submitText: "校验表单",
}

const options = ref<FormProps["options"]>([
  {
    el: "el-button",
    type: "primary",
    children: "新增",
    span: 8,
    onClick: () => {
      formModel.value.list.push("")
    },
  },
  {
    el: "el-button",
    type: "primary",
    children: "设置第一行",
    span: 8,
    onClick: () => {
      formModel.value.list[0] = "设置第一行的内容" + Date.now()
    },
  },
  {
    el: "el-button",
    type: "danger",
    children: "删除第一行",
    span: 8,
    onClick: () => {
      formModel.value.list.shift()
    },
  },
  // 二维数组会递归当做平级处理（外层会添加 el-col，el-form-item）
  // 否则需要自己添加 { el: "el-form-item" }，相应的属性也会失效
  inputList,
  {
    el: "el-divider",
    children: "分隔线",
  },
])
</script>
