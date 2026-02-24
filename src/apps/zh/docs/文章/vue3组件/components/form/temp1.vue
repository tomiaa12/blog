<template>
  <KForm
    :options="options"
    @submit="submit"
    @submit-check-fail="submitCheckFail"
  />
</template>
<script setup lang="ts">
import { ref } from "vue"
import type { FormProps } from "@tomiaa/vue3-components"
import { KForm } from "@tomiaa/vue3-components"

// 活动标签列表，模拟异步数据
const tag = ref("")
const selectTagData = ref<FormProps["options"]>([])
setTimeout(() => {
  selectTagData.value = [
    {
      el: "el-option",
      label: "标签一",
      value: "one",
    },
    {
      el: "el-option",
      label: "标签二",
      value: "two",
    },
  ]
  tag.value = selectTagData.value[0].value
}, 5000)

// 表单配置，FormProps["options"] 声明以获取更好的 TS 类型提示
const options = ref<FormProps["options"]>([
  {
    el: "el-input",
    label: "活动名称",
    prop: "name",
    modelValue: "这是双向绑定的值，也是默认值", // 存在 modelValue 时 prop 字段必填，否者值不会同步
  },
  {
    el: "el-select",
    label: "活动地点",
    prop: "zone",
    children: [
      {
        el: "el-option",
        label: "上海",
        value: "shanghai",
      },
      {
        el: "el-option",
        label: "北京",
        value: "beijing",
      },
    ],
    rules: [
      {
        required: true,
        message: "必填",
      },
    ],
  },
  {
    el: "el-select",
    label: "活动标签",
    prop: "tag",
    // 可以是 ref 对象
    modelValue: tag,
    children: selectTagData,
  },
  {
    el: "el-date-picker",
    prop: "startDate",
    label: "开始时间",
    span: 12,
  },
  {
    el: "el-date-picker",
    prop: "endDate",
    label: "结束时间",
    span: 12,
  },
  {
    el: "el-switch",
    prop: "instantDelivery",
    label: "状态",
    span: 4,
  },
  {
    el: "el-checkbox-group",
    prop: "type",
    label: "活动类型",
    span: 10,
    children: [
      {
        el: "el-checkbox",
        label: "online",
        children: "在线",
      },
      {
        el: "el-checkbox",
        label: "offline",
        children: "离线",
      },
    ],
    rules: {
      required: true,
      message: "必填",
    },
  },
  {
    el: "el-radio-group",
    label: "资源",
    prop: "resources",
    span: 10,
    children: [
      {
        el: "el-radio",
        label: "sponsor",
        children: "赞助",
      },
      {
        el: "el-radio",
        label: "venue",
        children: "场地",
      },
    ],
    rules: {
      required: true,
      message: "必填",
    },
  },
  {
    el: "el-upload",
    label: "活动文件",
    autoUpload: false,
    prop: "files",
    listType: "picture-card",
    fileList: [
      {
        name: "food.jpeg",
        url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
      },
    ],
    children: [
      {
        el: "span", // 可以是 dom 标签
        style: {
          color: "var(--c-brand)",
        },
        children: "点击选择文件",
      },
    ],
  },
  {
    el: "el-input",
    type: "textarea",
    label: "活动描述",
    prop: "desc",
    rules: { required: true, message: "必填" },
  },
  {
    el: "editor",
    prop: "editor",
    label: "活动计划",
    modelValue:
      '<p><span style="color: rgb(212, 56, 13); font-size: 29px;">这是富文本😄</span></p>',
  },
])

const submit = ({ /* validate, */ rawFormModel }: any) => {
  // validate 为校验方法，传入 autoValidateOnSubmit=false 会关闭组件的自动校验
  console.log("校验通过:", rawFormModel)
}

const submitCheckFail = () => {
  console.log("校验失败")
}
</script>
