# nuxt.js 3 layout 通用布局

## 默认布局

利用`NuxtLayout`传入插槽来设置整体通用布局

1. 创建`layouts\default.vue`文件

```vue
<template>
  <div>
    通用布局页，default.vue:
    <slot />
  </div>
</template>
```

2. 修改`app.vue`

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## 自定义布局

1. 创建`layouts\custem.vue`

```vue
<template>
  <div>
    自定义布局页，custom.vue:
    <slot />
  </div>
</template>
```

2. `pages\某个页面.vue`

```vue
<template>
  <NuxtLayout name="custom">
    <div>测试页面</div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: false, // 禁用 default 布局
});
</script>
```

以上都是利用插槽传入，在定义布局容器时可以传入命名插槽。
