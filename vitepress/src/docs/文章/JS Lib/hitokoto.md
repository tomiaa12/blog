<script setup lang="ts">
import hitokoto from "./components/hitokoto.vue"
</script>

# hitokoto 一言

## Demo

<hitokoto />

:::details 查看代码

<<< @/docs/文章/JS Lib/components/hitokoto.vue

:::

## 属性

| 属性              | 说明                                                         | 类型              | 默认值   |
| ----------------- | ------------------------------------------------------------ | ----------------- | -------- |
| el                | 容器 querySelector 选择器或 dom                              | string \| DOM元素 |          |
| movingBorderColor | 流动边框颜色，默认会在`el`元素设置`css`变量`--moving-border-color` | string            | \#42b883 |
| interval          | 刷新间隔毫秒 0 不自动刷新                                    | number            | 10000    |
