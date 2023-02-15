# nuxt.js 3 全局引入element-plus

plugins 下的文件会被自动执行

## 注入插件
```ts
// plugins\element-plus.ts
import { defineNuxtPlugin } from '#app'
import * as icons from "@element-plus/icons-vue";

import ElementPlus from 'element-plus/dist/index.full'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(ElementPlus)

  // 全局注册 element 图标
  Object.keys(icons).forEach((key) => {
    nuxtApp.vueApp.component("ElIcon" + key, icons[key]);
  });
})
```