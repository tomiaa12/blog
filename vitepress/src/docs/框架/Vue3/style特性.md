# vue3 单文件 style 特性

## scope

只对当前组件的样式生效，这在 vue2 中经常使用。
```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

### 深度选择器

选择子组件的类名

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}

/* 或 */
.a /deep/ .b{

}

/* 或 */
.a >>> .b{

}
</style>
```

### 插槽选择器

子组件的插槽的内容属于父组件，子组件要选择需要用 :slotted 

父组件

```vue
<template>
  <HelloWorld>
    <div>122</div>
  </HelloWorld>
</template>
```

子组件
```vue
<template>
  <div class="children">
    <slot></slot>
  </div>
</template>
<style scoped>
.children :slotted(div){
  color: red;
}
</style>
```

### 全局选择器
选择全局的 .red class
```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

## moudle

module 属性会将css类放在 $style 对象上

```vue
<template>
  <p :class="$style.red"> 文本 </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

自定义名称

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

API 中获取 style module

```js
// 默认, 返回 <style module> 中的类
useCssModule()

// 命名, 返回 <style module="classes"> 中的类
useCssModule('classes')
```

## v-model 动态 css

v-bind(color) 绑定即可

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

`<script setup>`中一样
```vue
<script setup>
  const theme = {
    color: 'red'
  }
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```