# ElementUi-Dialog 弹窗动画 origin 设置

以下操作可以模仿`Ant Design`弹窗弹出动画，弹窗缩放的起点为点击的位置。可以参考`Ant Design`的[modal](https://www.antdv.com/components/modal-cn)组件的弹出动画。

:::tip 注意
下列代码示例以`Vue 2.7+`的`setup`语法为例。
:::

## 新建`useTransformOrigin.ts`监听事件获取点击的`x y`值

```ts
import { ref } from "vue"

export const x = ref()
export const y = ref()

// dialog transform origin 获取
window.addEventListener("mousedown", e => {
  x.value = e.clientX
  y.value = e.clientY
})
```

## 新建`ComDialog.vue`对`Dialog`二次封装

1. `@mousedown.stop.native`阻止事件冒泡，防止`x y`值在弹窗内被赋值。
2. 监听`x y`值计算`transformOrigin`的缩放点
3. 对`.dialog-fade`样式动画进行修改

::: warning 已知问题
使用组件时第一次加载或在组件上使用了`v-if`不会触发动画。
:::

```vue{10,40}
<!-- ComDialog.vue -->
<template>
  <el-dialog
    ref="dialogRef"
    :top="top"
    :width="width"
    :style="{
      transformOrigin,
    }"
    @mousedown.stop.native
    v-bind="$attrs"
    v-on="$listeners"
  >
    ...
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from "vue"
import { x, y } from "./useTransformOrigin"

const props = defineProps({
  width: {
    type: String as PropType<string>,
    default: "700px",
  },
  top: {
    type: String as PropType<string>,
    default: "15vh",
  },
})

const dialogRef = ref()

const transformOrigin = ref("")

watch([x, y], () => {
  const dialog = dialogRef.value?.$el.querySelector(".el-dialog")
  if (!dialog) return "center"
  transformOrigin.value = `calc(${x.value}px - ${props.width}) calc(${y.value}px - ${props.top})`
})
</script>


<style lang="scss" scoped>
.el-dialog__wrapper {
  transition-duration: 0.3s;
}
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  animation: none !important;
}

.dialog-fade-enter-active {
  ::v-deep .el-dialog {
    animation: anim-open 0.3s;
    transform-origin: inherit;
  }
}

.dialog-fade-leave-active {
  ::v-deep .el-dialog {
    animation: anim-close 0.4s;
    transform-origin: inherit;
  }
}
</style>
```
