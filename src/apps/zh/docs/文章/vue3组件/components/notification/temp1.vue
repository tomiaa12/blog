<template>
  <KNotification
    :value="34"
    :list="list"
    :actions="actions"
    @click-item="clickItem"
    @click-action="clickAction"
  />
</template>
<script setup lang="ts">
import type {
  NotificationProps,
  NotificationEmits,
} from "@tomiaa/vue3-components"
import { KNotification } from "@tomiaa/vue3-components"

const avatar =
  "//img2.baidu.com/it/u=2050797336,2181305862&fm=253&fmt=auto&app=138&f=JPEG?w=224&h=224"
const list: NotificationProps["list"] = [
  {
    title: "消息",
    content: [
      {
        avatar,
        title: "标题",
        desc: "描述",
        time: "2022-12-12",
        tag: "标签",
        tagType: "success",
      },
      {
        avatar,
        title: "标题1",
        desc: "描述1",
        time: "2022-12-12 08:00:00",
        tag: "标签",
        tagType: "info",
      },
      {
        avatar,
        title: "标题1",
        desc: "描述1",
        time: "2022-12-12 08:00:00",
        tag: "标签",
        tagType: "warning",
      },
      {
        avatar,
        title: "标题1",
        desc: "描述1",
        time: "2022-12-12 08:00:00",
        tag: "标签",
        tagType: "warning",
      },
    ],
  },
  {
    title: "通知",
    content: [
      {
        avatar,
        title: "标题1",
        desc: "描述1",
        time: "2022-12-12 08:00:00",
        tagType: "info",
      },
      {
        avatar,
        title: "标题1",
        desc: "描述1",
        time: "2022-12-12 08:00:00",
        tagType: "info",
      },
      {
        avatar,
        title: "标题1",
        desc: "描述1",
        time: "2022-12-12 08:00:00",
        tagType: "info",
      },
    ],
  },
  {
    title: "代办",
    content: [
      {
        title: "代办标题1",
        desc: "代办描述1",
        time: "2022-12-12 08:00:00",
        tag: "标签",
        tagType: "warning",
      },
    ],
  },
]

const actions: NotificationProps["actions"] = [
  {
    text: "清空",
    icon: "ElIconDelete",
  },
  {
    text: "查看更多",
    icon: "ElIconMore",
  },
]

const clickItem: NotificationEmits["clickItem"] = ({ item, index }) => {
  console.log(item, index, "点击某一项")
}
const clickAction: NotificationEmits["clickAction"] = ({ item, index }) => {
  console.log(item, index, "点击操作栏")
}
</script>
