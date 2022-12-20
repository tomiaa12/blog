# 基于 gitee Issue 评论 JS 插件库

预览效果查看当前网站底部评论区

## 安装

```sh
npm i @tomiaa/comment
```

## 使用

```ts
import { Comment } from "@tomiaa/comment"
new Comment({
  client_id: "客户端id",
  client_secret: "客户端session",
  owner: "用户名 组织名",
  repo: "仓库地址",
  prefix: "前缀",
}).mount("#div")
```

## vitepress Demo

```vue
<template>
  <div class="vp-doc">
    <h2
      id="评论"
      tabindex="-1"
    >
      评论
      <a
        class="header-anchor"
        href="#评论"
        aria-hidden="true"
      >
        #
      </a>
    </h2>
    <div ref="commentRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue"
import { Comment } from "@tomiaa/comment"
import { useRoute } from "vitepress"

const route = useRoute()
const commentRef = ref()

const client_id = "xxx"
const client_secret = `xxx`
let inst: any

watch(
  () => route.path,
  async () => {
    await nextTick()
    inst?.getList()
  },
  {
    deep: true,
  }
)
onMounted(() => {
  inst = new Comment({
    client_id,
    client_secret,
    owner: "tomiaa",
    repo: "xxx",
    prefix: "[xxx]",
  })
  inst.mount(commentRef.value)
})
</script>
```
