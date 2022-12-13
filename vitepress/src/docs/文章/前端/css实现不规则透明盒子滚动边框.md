<script setup lang="ts">
import scrollBorder from "./components/scrollBorder.vue"
</script>

# css 实现不规则透明盒子滚动边框

<scrollBorder/>

- 利用 `clip: rect(0,5px,5px,0)`也能实现滚动的边框，但是实现不了透明的盒子+滚动边框（并且转弯距离还要动态计算）。

- 不规则图像最好使用一张背景底图（不带边框）与一张只有边框的图片实现，当然头发多可以自己做出来。

- `clip-path:circle([半径] at [x] [y])`或`clip-path: inset(0 0 99% 0)`来实现透明盒子+边框

- `circle`圆角切割转弯处会变慢，`inset`则不会。

## 核心动画

### 圆形切割

```css
@keyframes clippath {
  0%,
  to {
    clip-path: circle(100px at 0 0);
  }
  25% {
    clip-path: circle(100px at 0 100%);
  }
  50% {
    clip-path: circle(100px at 100% 100%);
  }
  75% {
    clip-path: circle(100px at 100% 0);
  }
}
```

### 方形切割

```css
@keyframes clip {
  0%,
  to {
    clip-path: inset(0 0 99% 0);
  }
  25% {
    clip-path: inset(0 99% 0 0);
  }
  50% {
    clip-path: inset(99% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 99%);
  }
}
```

## 此页面代码

::: details 点击查看
<<< @/docs/文章/前端/components/scrollBorder.vue
:::
