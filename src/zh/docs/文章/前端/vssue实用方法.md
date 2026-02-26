# vssue实用方法

## 浏览器

### 使用屏幕断点

```ts
import { useBreakpoints } from "@vueuse/core";
/**
 * 浏览器屏幕断点
 */
export const handleBreakpoints = () => {
  const breakpoints = useBreakpoints({
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1920,
    xxl: 2560,
  });
  const xs = breakpoints.between("xs", "sm");
  const sm = breakpoints.between("sm", "md");
  const md = breakpoints.between("md", "lg");
  const lg = breakpoints.between("lg", "xl");
  const xl = breakpoints.between("xl", "xxl");

  return { xs, sm, md, lg, xl };
};
```

### 复制文字

```ts
import { useClipboard } from "@vueuse/core";
/**
 * 复制文字
 * @param text 要复制的内容
 */
export const handleClipboard = (text: string) => useClipboard().copy(text);
```

### 事件监听

```ts
import { useEventListener } from '@vueuse/core'

const el = ref<HTMLElement | null>(null) // dom 元素
useEventListener(el,'click',() => {}) // 会在 dom 存在时自动注册事件，dom 被删除时会自动取消监听
```

### 取色器

```ts
import { useEyeDropper } from '@vueuse/core'
const { 
  isSupported, // 是否支持
  open, // 打开取色
  sRGBHex // 16 进制色值
} = useEyeDropper()
```

### 网站图标

```ts
import { useFavicon } from '@vueuse/core'
const icon = useFavicon()
icon.value = 'dark.png' // 修改当前网站的图标
```


### 全屏元素

```ts
import { useFullscreen } from '@vueuse/core'
const el = ref<HTMLElement | null>(null)
const { 
  isFullscreen, // 是否全屏
  enter, // 进入全屏
  exit, // 退出全屏
  toggle // 切换
} = useFullscreen(el) // 传如 dom 元素
```

### 异步加载图片

```vue
<script setup>
import { useImage } from '@vueuse/core'

const avatarUrl = 'https://place.dog/300/200'
const { isLoading } = useImage({ src: avatarUrl })
</script>

<template>
  <span v-if="isLoading">Loading</span>
  <img v-else :src="avatarUrl">
</template>
```

### 加载 script 标签

```ts
import { useScriptTag } from '@vueuse/core'
useScriptTag('https://player.twitch.tv/js/embed/v1.js',(el: HTMLScriptElement) => {

})

// 或手动控制加载
const { scriptTag, load, unload } = useScriptTag('https://player.twitch.tv/js/embed/v1.js',() => {

},{ manual: true },)

await load()
await unload()
```

### 加载 css 字符串

- 输入
```ts
import { useStyleTag } from '@vueuse/core'

const {
  id,
  css,
  load,
  unload,
  isLoaded,
} = useStyleTag('.home { margin-top: 32px; }')

css.value = '.home { margin-top: 64px; }'
```

- 输出

```html
<style type="text/css" id="vueuse_styletag_1">
.foo { margin-top: 64px; }
</style>
```

### 网站标题

```ts
import { useTitle } from '@vueuse/core'

const title = useTitle('初始标题') // 可传入 computed 属性
// const title = useTitle('新标题', { titleTemplate: '%s | 默认值' }) // 新标题将会替换 %s
console.log(title.value) // 输出当前标题
title.value = 'Hello' // 修改标题
```

### url 查询参数

- history

```ts
// 当前 url：localhost/?foo=fao
const params = useUrlSearchParams('history')
console.log(params.foo) // fao
params.foo = 'bar'
params.vueuse = 'some'
// 当前 url：localhost/?foo=bar&vueuse=awesome
```

- hash

```ts
const params = useUrlSearchParams('hash')
params.foo = 'bar'
params.vueuse = 'some'
// 当前 url：localhost/#/?foo=bar&vueuse=some
```

### 系统通知

```ts
import { useWebNotification } from '@vueuse/core'
const {
  isSupported, // 是否支持
  notification, // 原数据
  show,
  close,
  onClick,
  onShow,
  onError,
  onClose,
} = useWebNotification({
  title: '标题',
  body: '正文',
  dir: 'rtl', // 文本方向 "auto" | "ltr" | "rtl"
  lang: 'en', // 通知语言
  tag: 'test', // 通知 id
  icon: '', // 通知图标
  renotify: true, // 是否在新的通知替换旧的通知
  requireInteraction: false, // 是否保持活跃，直到用户点击关闭才消失
  silent: false, // 是否静音，关闭震动
  vibrate: [], // 指定具有震动的硬件发出震动
})

isSupported && show()

onClick.on(() => {
  console.log('click');
})
```

## 传感器

### 键盘事件
```ts
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('ArrowDown', (e) => {
  console.log('按了↓');
})

// 监听多个键
onKeyStroke(['s', 'S', 'ArrowDown'], (e) => {
  console.log('按了' + e.key);
})

// 指定目标元素
onKeyStroke('A', (e) => {
  console.log('A')
}, { target:  document})
```

### 长按

```ts
import { onLongPress } from '@vueuse/core'
const el = ref()
onLongPress(el, () => {
  console.log('长按500ms');
})

onLongPress(el, () => {
  console.log('长按1000ms');
},{delay: 1000})
```

- 使用指令

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { vOnLongPress } from '@vueuse/components'
</script>
<template>
  <button v-on-long-press="onLongPress"></button>
</template>
```

### 设备列表

```ts
import { useDevicesList } from '@vueuse/core'
const {
  devices, // 设备列表
  videoInputs, // 摄像头列表
  audioInputs, // 麦克风列表
  audioOutputs, // 扬声器列表
} = useDevicesList()
```

### 屏幕共享

```ts
import { useDisplayMedia } from "@vueuse/core";
const { isSupported, stream, enabled, start, stop } = useDisplayMedia({
  enabled: false, // 是否自动调用屏幕共享，false 为手动调用 start 方法
  video: true, // 屏幕共享
  audio: true, // 系统音频共享
});

start()

const video = ref();
watchEffect(() => {
  video.srcObject = stream.value
})
```

### 鼠标悬停

```ts
import { useElementHover } from '@vueuse/core'
const el = ref();
const isHovered = useElementHover(el)
```

- 指令

```ts
import { vElementHover } from '@vueuse/components'
// <button v-element-hover="onHover">
//   {{ isHovered }}
// </button>
```

### 焦点

```ts
import { useFocus } from '@vueuse/core'

const el = ref()
const { focused } = useFocus(el, { 
  initialValue: true, // 是否聚焦后出发元素上的focus事件
})
// 设置 focused 会触发聚焦与失焦
```

### 地理位置

```ts
import { useGeolocation } from '@vueuse/core'
const { 
  coords, // 经纬度
  locatedAt, // 时间
  error
} = useGeolocation()
```

### 跟踪用户空闲

```ts
import { useIdle } from '@vueuse/core'
const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min
console.log(idle.value) // true or false  5 分钟后用户没有做任何操作则为 true
```

### 无限滚动

```ts
import { useInfiniteScroll } from '@vueuse/core'
const el = ref();
const data = ref([1,2,3,4,5,6])

useInfiniteScroll(el,() => {
  data.value.push(12)
},{ 
  direction: "bottom", // 监听方向 "top" | "bottom"
  distance: 10 // 距离边缘最小距离，默认 0
})
```

- 指令

```ts
import { vInfiniteScroll } from '@vueuse/components'
// <div v-infinite-scroll="onLoadMore">
//   <div v-for="item in data" :key="item">
//     {{ item }}
//   </div>
// </div>

// <!-- with options -->
// <div v-infinite-scroll="[onLoadMore, { 'distance' : 10 }]">
//   <div v-for="item in data" :key="item">
//     {{ item }}
//   </div>
// </div>
```

### 鼠标位置

```ts
import { useMouse } from '@vueuse/core'
const { x, y, sourceType } = useMouse()
```

### 网络状态

```ts
import { useNetwork } from '@vueuse/core'
const { 
  isSupported, // 是否支持
  isOnline, // 是否在线
  offlineAt, // 上次连接以来的时间
  downlink, // 下载速度
  downlinkMax, // 最大可达到的下载速度
  effectiveType, // 检测到的有效速度类型
  rtt, // 延迟
  saveData, // 用户是否激活了数据保护模式
  type // 网络类型
} = useNetwork()
console.log(isOnline.value)
```

### 网络在线

```ts
import { useOnline } from '@vueuse/core'
const online = useOnline() // 网络是否在线
```

### 页面离开

```ts
import { usePageLeave } from '@vueuse/core'
const isLeft = usePageLeave() // 鼠标是否离开页面
```

### 文本选中

```ts
import { useTextSelection } from '@vueuse/core'
const state = useTextSelection() // state.text
```