<script setup lang="ts">
import hitokoto from "./components/hitokoto.vue"
</script>

# hitokoto 一言

## 安装

```sh
npm i @tomiaa/hitokoto
```

## 使用

```ts
import { Hitokoto } from "@tomiaa/hitokoto"

new Hitokoto({
  el: "#hitokoto",
})
```

## Vue Demo

<hitokoto />

:::details 查看代码

<<< @/docs/文章/JS Lib/components/hitokoto.vue

:::

## 参数

| 属性              | 说明                                                               | 类型               | 默认值   |
| ----------------- | ------------------------------------------------------------------ | ------------------ | -------- |
| el                | 容器 querySelector 选择器或 dom                                    | string \| DOM 元素 |          |
| movingBorderColor | 流动边框颜色，默认会在`el`元素设置`css`变量`--moving-border-color` | string             | \#42b883 |
| interval          | 刷新间隔毫秒 0 不自动刷新                                          | number             | 10000    |

## 成员属性

| 属性    | 说明         | 类型            |
| ------- | ------------ | --------------- |
| data    | 一言接口数据 | any             |
| options | 构造器参数   | HitokotoOptions |
| el      | 根元素       | any             |
| word    | 内容         | HTMLDivElement  |
| author  | 出处         | HTMLDivElement  |
| elLike  | 喜欢         | HTMLDivElement  |
| timer   | 定时器       | number          |

## 成员方法

| 方法名     | 说明         |
| ---------- | ------------ |
| init       | 初始化       |
| autoGet    | 开启定时器   |
| getData    | 获取数据     |
| getLikeNum | 获取喜欢数量 |
| like       | 喜欢         |
