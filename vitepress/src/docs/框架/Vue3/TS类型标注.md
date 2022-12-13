# Vue3 TS typescipt 类型标注

## Prop 标注类型

### `defineProps`运行时定义

宏函数会在运行时会推导出类型。

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true }, // string
  bar: Number, // number | undefined
})
</script>
```

### 使用 ts 基于类型定义

- 泛型定义

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

- 接口定义

```vue
<!-- or -->
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}
const props = defineProps<Props>()
</script>
```

- 不支持外部文件

```js
// 不支持，（目前vue版本：v3.2.37），这个限制可能会在未来的版本中被解除。
import { Props } from './file'

defineProps<Props>()
```

- 泛型默认值 <Badge type="tip" text="测试" />

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}
// 默认值会被编译为等价的运行时选项
const { foo, bar = 100 } = defineProps<Props>()
</script>
```

默认值功能目前测试阶段，需要显式启用：

```js
// vite.config.js
export default {
  plugins: [
    vue({
      reactivityTransform: true,
    }),
  ],
}
```

## emit 标注类型

```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(["change", "update"])

// 基于类型
const emit = defineEmits<{
  (e: "change", id: number): void
  (e: "update", value: string): void
}>()
</script>
```

## ref 标注类型

### 运行时

```js
import { ref } from "vue"
const year = ref(2020) // 推导出的类型：Ref<number>
year.value = "2020" // => TS 错误
```

### Ref 定义

```js
import { ref } from "vue"
import type { Ref } from "vue"

const year: Ref<string | number> = ref("2020")

year.value = 2020 // 成功！
```

### 泛型定义

```js
const year = ref<string | number>('2020') // Ref<string | number>

year.value = 2020 // 成功！

const n = ref<number>() // 没有给初始值，推导得到的类型：Ref<number | undefined>
```

## reactive 标注类型

### 运行时

```js
import { reactive } from "vue"
const book = reactive({ title: "Vue" }) // 推导得到的类型：{ title: string }
```

### 接口定义

```js
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue' })
```

:::tip
不推荐使用 reactive() 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同。
:::

## computed 标注类型

### 运行时推导

```js
import { ref, computed } from "vue"
const count = ref(0)
const double = computed(() => count.value * 2) // 推导得到的类型：ComputedRef<number>
const result = double.value.split("") // TS 报错，number 不存在此方法
```

### 泛型定义

```js
const double =
  computed <
  number >
  (() => {
    // 若返回值不是 number 类型则会报错
  })
```

## 事件处理器标注类型

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` 隐式地标注为 `any` 类型
  console.log(event.target.value)
}

// or
function handleInputChange(event: Event) {
  // 如果标注了类型，可能需要断言 event 上的属性某些类型
  console.log((event.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    type="text"
    @change="handleChange"
  />
  <input
    type="text"
    @change="handleInputChange"
  />
</template>
```

## provide/inject 标注类型

### InjectionKey 注入 Symbol

祖孙传值一般会在不同的组件中运行，需要用到`Symbol`来处理类型定义。vue 提供

```js
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

### 字符串注入

```js
const foo = inject<string>('foo') // 类型：string | undefined

const foo = inject<string>('foo','bar') // 类型：string 提供了默认值 'bar' 则类型为 string
// or
const foo = inject<string>('foo') as string // 类型：string 断言它始终存在
```

## 模板 ref 标注类型

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue"

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus() // 严格的类型安全，需要用可选链，初始值和 v-if 都会是 null
})
</script>

<template>
  <input ref="el" />
</template>
```

## 组件模板 ref 标注类型

有些时候经常需要使用 ref 获取子组件的实例：

```vue
<!-- Son.vue -->
<script setup lang="ts">
import { ref } from "vue"

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open,
})
</script>
```

先需要通过 typeof 得到其类型，再使用 TypeScript 内置的 InstanceType 工具类型来获取其实例类型：

```vue
<!-- App.vue -->
<script setup lang="ts">
import MyModal from "./MyModal.vue"

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```
