---
name: kyx-i18n-tool-pages
description: 将 kyx 博客中已有的 zh 工具页扩展到其他 19 种语言：为每个语言的 config.ts 添加本地化导航菜单，并创建对应 index.md（本地化 SEO + 复用 zh 组件）。当用户说"其他语言也添加这个菜单"、"扩展到所有语言"、"为 19 个语言创建页面"、"多语言工具页"时使用此技能。
---

# 工具页多语言扩展

## 任务

以已有的 `src/zh/web/<分类>/<工具名>/` 为基础，将工具页扩展到其他 19 种语言：

1. 在各语言的 `src/{lang}/config.ts` 中添加本地化导航菜单
2. 创建各语言的 `src/{lang}/web/<分类>/<工具名>/index.md`
3. 在 Vue 组件 i18n 中补充 `sv` 和 `zh-TW`（若缺少）

## 19 个语言列表

| lang  | 语言       | config.ts 位置      |
| ----- | ---------- | ------------------- |
| en    | English    | src/en/config.ts    |
| ar    | العربية    | src/ar/config.ts    |
| de    | Deutsch    | src/de/config.ts    |
| es    | Español    | src/es/config.ts    |
| fr    | Français   | src/fr/config.ts    |
| hi    | हिन्दी     | src/hi/config.ts    |
| id    | Indonesia  | src/id/config.ts    |
| it    | Italiano   | src/it/config.ts    |
| ja    | 日本語     | src/ja/config.ts    |
| ko    | 한국어     | src/ko/config.ts    |
| nl    | Nederlands | src/nl/config.ts    |
| pl    | Polski     | src/pl/config.ts    |
| pt    | Português  | src/pt/config.ts    |
| ru    | Русский    | src/ru/config.ts    |
| sv    | Svenska    | src/sv/config.ts    |
| th    | ภาษาไทย    | src/th/config.ts    |
| tr    | Türkçe     | src/tr/config.ts    |
| vi    | Tiếng Việt | src/vi/config.ts    |
| zh-TW | 繁體中文   | src/zh-TW/config.ts |

## 步骤一：更新各语言 config.ts

### 插入位置

每个 `src/{lang}/config.ts` 的 `nav` 数组中，找到"加解密"分组的最后一项（URL encode/decode），在该分组结束后、"开发工具"分组开始前插入"文本工具"分组。

结构示意：

```ts
// 加解密分组（已有）
{
  text: "<加解密翻译>",
  items: [
    { text: "Base64 ...", link: "/web/encode-decode/base64" },
    { text: "URL ...", link: "/web/encode-decode/url" },  // ← 锚点
  ],
},
// ↓ 在此处插入文本工具分组
{
  text: "<文本工具翻译>",
  items: [
    { text: "<工具名翻译>", link: "/web/<分类>/<工具名>" },
  ],
},
// 开发工具分组（已有）
{
  text: "<开发工具翻译>",
  ...
},
```

### 各语言"文本工具"分组名称

| lang  | 分组名                |
| ----- | --------------------- |
| en    | Text Tools            |
| ar    | أدوات النص            |
| de    | Textwerkzeuge         |
| es    | Herramientas de texto |
| fr    | Outils texte          |
| hi    | पाठ उपकरण             |
| id    | Alat teks             |
| it    | Strumenti testo       |
| ja    | テキストツール        |
| ko    | 텍스트 도구           |
| nl    | Teksttools            |
| pl    | Narzędzia tekstowe    |
| pt    | Ferramentas de texto  |
| ru    | Текстовые инструменты |
| sv    | Textverktyg           |
| th    | เครื่องมือข้อความ     |
| tr    | Metin araçları        |
| vi    | Công cụ văn bản       |
| zh-TW | 文字工具              |

若已存在"文本工具"分组，直接在其 `items` 中追加新菜单项，不重复创建分组。

## 步骤二：创建各语言 index.md

### 文件路径

```
src/{lang}/web/<分类>/<工具名>/index.md
```

### 文件内容模板

```markdown
---
title: <该语言的 SEO 标题>
description: <该语言的描述>
keywords: <该语言的关键词>
head:
  - - meta
    - name: description
      content: <同 description>
  - - meta
    - name: keywords
      content: <同 keywords>
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import <ComponentName> from '@/zh/web/<分类>/<工具名>/components/<ComponentName>.vue'
</script>

<<ComponentName> />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
```

**关键规则**：

- 组件 import 路径必须用 `@/zh/web/...`（绝对别名），不能用相对路径 `../../../`
- SEO 内容（title/description/keywords）需翻译成对应语言，可参考组件 `<i18n>` 块中已有的 `title` 和 `desc` 字段作为翻译基础

## 步骤三：补充组件 i18n 中缺少的语言

检查 Vue 组件的 `<i18n lang="json">` 块，若缺少 `sv`（Svenska）或 `zh-TW`（繁體中文），需补充这两个语言的翻译。

`sv` 和 `zh-TW` 在 `src/{lang}/` 目录中存在对应 config，但在 Vue i18n 中容易被遗漏。

## 执行顺序

1. 先批量创建所有目录（`mkdir -p` 或 PowerShell `New-Item`）
2. 再并行更新 config.ts（19 个文件，用 StrReplace）
3. 再并行创建 index.md（19 个文件，用 Write）
4. 最后检查并补充组件 i18n 中的 sv / zh-TW

## 输出

直接创建/修改文件，完成后汇报修改文件数量。
