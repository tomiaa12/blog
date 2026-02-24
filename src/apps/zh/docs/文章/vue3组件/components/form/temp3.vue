<template>
  <KForm
    :options="options"
    :show-actions="false"
  >
    <template #my-slot> 这是slot插槽 </template>
    <template #inputFix>这是input插槽</template>
    <template #my-file="scope">
      这是文件的插槽，文件名：{{ scope.file.name }}
    </template>
  </KForm>
</template>
<script setup lang="ts">
import { ref } from "vue"
import type { FormProps } from "@tomiaa/vue3-components"
import { KForm } from "@tomiaa/vue3-components"

const options = ref<FormProps["options"]>([
  {
    slot: "my-slot",
  },
  {
    el: "el-input",
    label: "活动名称",
    prop: "name",
    children: {
      slot: "inputFix", // 传给 KForm 的插槽
      deepSlot: "prefix", // KForm 传给更深层的插槽名
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
        name: "figure-2.png",
        url: "/images/figure-2.png",
      },
    ],
    children: [
      "点击选择文件", // 这里默认是 default 插槽
      {
        slot: "my-file", // 当前传递给 KForm 的插槽名
        deepSlot: "file", // KFrom 传递给 el-upload 的插槽名
      },
    ],
  },
])
</script>
