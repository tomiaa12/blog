<script setup lang="ts">
import canvasGraffiti from "./components/canvasGraffiti.vue"
</script>

# canvas 涂鸦画板，支持笔写、手写、鼠标绘图

支持的功能：

- 笔、手、鼠标绘画单独设置
- 支持禁用手写的情况下，手指拖动屏幕的同时笔可以绘画。例如：左手滑动屏幕的同时，右手拿笔画图
- 获取`base64`格式、`img`格式图片
- 橡皮擦功能、颜色、线条宽度
- 支持记号笔、直线、矩形、圆形绘制

## 安装

```sh
npm i @tomiaa/canvas-graffiti
```

## 使用

```ts
import { CanvasGraffiti } from "@tomiaa/canvas-graffiti"
new CanvasGraffiti({
  el: "#canvas",
})
```

## Vue Demo

<canvasGraffiti />

:::details 查看代码

<<< @/zh/docs/文章/JS Lib/components/canvasGraffiti.vue

:::

:::tip 注意
笔写需要移动端的触屏笔才能触发，基于[pointerType](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)判断，可能存在笔或系统被改过部分浏览器无法识别为笔，从而笔触发`pointerType`还是`touch`类型。
:::
