<script setup>
import BubbleChart from './components/BubbleChart.vue'
import bob from './img/vue气泡组件/bub.png'
const data = [
  {
    name: "Vue",
    value: 1289
  },
  {
    name: "JavaScript",
    value: 1224
  },
  {
    name: "HTML",
    value: 580
  },
  {
    name: "CSS",
    value: 129
  },
  {
    name: "React",
    value: 229
  }
]
</script>

# vue 气泡组件

## Demo

<BubbleChart :data="data" style="height: 300px; background-color: #333;" :background-image="bob"/>

## 使用

```vue
<script setup>
import BubbleChart from "./components/BubbleChart.vue"
import bob from "./img/vue气泡组件/bub.png"
const data = [
  {
    name: "Vue",
    value: 1289,
  },
  {
    name: "JavaScript",
    value: 1224,
  },
  {
    name: "HTML",
    value: 580,
  },
  {
    name: "CSS",
    value: 129,
  },
  {
    name: "React",
    value: 229,
  },
]
</script>

<BubbleChart :data="data" style="height: 300px; background-color: #333;" :background-image="bob"/>
```

## 源码

<<< ./components/BubbleChart.vue
