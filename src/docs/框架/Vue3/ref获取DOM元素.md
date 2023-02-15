# Vue+ts ref 获取 DOM 元素

# ref 获取多个 DOM 元素或组件实例

- template

```vue
<!-- 加冒号传入 divs 方法 -->
<div v-for="i of 3" :key="i" :ref="divs"></div>
```

- setup

```js
const arr = ref([]);
const divs = (el: HTMLElement) => {
 // 断言为 HTMLElement 类型的数组
 (arr.value as Array<HTMLElement>).push(el);

 // arr.value.push(el);
 // 这样写编译器会抛出错误 --> Argument of type 'HTMLElement' is not assignable to parameter of type 'never'.

};

onMounted(() => {
 // 打印多个 ref DOM
 console.log(arr);
});

```

# ref 获取单个 DOM 元素或组件实例

- template

```vue
<input type="text" ref="inputRef" />
```

- setup

```js
const inputRef = ref<HTMLElement | null>(null);


onMounted(() => {
 // 加载完成获取 input 焦点
 inputRef.value && inputRef.value.focus();
});

```
:::tip 注意
dom 标签上 :ref 传入的是方法名，如果 :ref='变量 + '字符串拼接''则不能获取指定的 dom 元素了。官网也没有说明如何获取，解决办法还是在 methods 方法中使用 vue2 语法 this.$refs['xxx'] 来获取
:::

# vue 3.2 新增 defineExpose 暴露组件方法

```ts
<script setup lang="ts">
import { ref } from 'vue';
const ruleFormRef = ref();

// 暴露此组件属性方法（不需要从 vue 中引入）
// 这样父组件使用 ref 获取该组件实例时才能访问暴露出去的方法
defineExpose({
  ruleFormRef,
});
</script>
```
