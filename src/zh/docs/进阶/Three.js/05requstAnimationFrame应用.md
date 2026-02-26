<script setup>
import temp from './components/temp05.vue'
</script>

# three.js `requstAnimationFrame`应用

使用`three.js``requstAnimationFrame`应用

需要解决的问题

1. 假设屏幕的刷新率为每秒 60 帧，那么每一帧所需时间就是`1000 / 60 ≈ 16`毫秒。
2. 屏幕或电脑的性能不能保证每秒都是固定的 60 帧，可能是 59，也可能是 58 时，`render`方法每一帧增加`0.01`的位移将不再试用

解决帧同步

1. `requstAnimationFrame`的回调方法传入第一个参数`time`为开始请求动画帧时累计的毫秒数
2. 在已知 长度 = 速度 \* 时间（ L = V \* T），将传入的时间`time`换行成秒 * 速度即等于要这一帧的时间在总时间要走的步长
3. 回调方法传入的`time`是一直累计的，1,2,3...n，所以利用求余数来在最大值间重复运动

## 示例

<ClientOnly>
  <temp/>
</ClientOnly>

## 示例代码

::: code-group

<<< ./components/temp05.vue#snippet{js}[示例]

<<< ./components/temp05.vue{77-90 vue:line-numbers}[此页源码]

:::
