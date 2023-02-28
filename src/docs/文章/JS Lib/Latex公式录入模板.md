<script setup lang="ts">
import latexTemplate from "./components/latexTemplate.vue"
</script>

# Latex 公式录入模板

## 安装

```sh
npm i @tomiaa/latex-template
```

## 简单使用

```ts
import { KLatexTemplate } from "@tomiaa/latex-template"

new KLatexTemplate("#latex", {
  // 当点击了公式后触发
  onInput(latex, detail) {
    // latex 公式字符串
    // detail 当前点击项的详细信息
    console.log(latex, detail)
  },
})

// or 或者
const ins = new KLatexTemplate(document.getElementById("latex"))

ins.onInput = (latex, detail) => {
  console.log(latex, detail)
}
```

## demo

<latexTemplate />

:::details 查看代码

<<< @/docs/文章/JS Lib/components/latexTemplate.vue

:::
