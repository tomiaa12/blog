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

const formModel = ref({ list: [] as any[] })

const inputList = computed<FormProps["options"]>(() =>
  formModel.value.list.map((modelValue: string, i: number) => [
    {
      el: "el-input",
      modelValue,
      prop: `list.${i}.name`,
      span: 8,
      rules: {
        required: true,
        message: `第${i + 1}行姓名必填`,
      },
    },
    {
      el: "el-input",
      modelValue,
      prop: `list.${i}.age`,
      span: 8,
      rules: {
        required: true,
        message: `第${i + 1}行年龄必填`,
      },
    },
    {
      el: "el-button",
      children: "删除",
      type: "danger",
      span: 8,
      onClick() {
        formModel.value.list.splice(i, 1)
      },
    },
  ])
)

const actionsConfig: FormProps["actionsConfig"] = {
  showCancel: false,
  showReset: false,
  submitText: "校验表单",
}

const options = ref<FormProps["options"]>([
  {
    el: "span",
    children: "姓名",
    required: true,
    span: 8,
  },
  {
    el: "span",
    children: "年龄",
    required: true,
    span: 8,
  },
  {
    el: "el-button",
    type: "primary",
    children: "新增",
    span: 8,
    onClick: () => {
      formModel.value.list.push({})
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
