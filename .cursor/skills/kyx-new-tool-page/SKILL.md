---
name: kyx-new-tool-page
description: 为 kyx 博客项目创建新的在线工具页面（zh 简体中文版本）：生成目录结构、index.md（SEO frontmatter）、Vue 组件（含 20 种语言 i18n）并在 src/config.ts 添加导航菜单。当用户说"实现这个功能"、"新建工具页"、"创建工具"、"添加页面"、"做这个工具"时使用此技能。
---

# 新建 kyx 工具页（zh 版本）

## 任务

在 `src/zh/web/<分类>/<工具名>/` 下创建一个完整的工具页，包含：

1. `index.md` — 页面入口 + SEO frontmatter
2. `components/<ComponentName>.vue` — 功能组件（含 20 种语言 i18n）
3. 在 `src/config.ts` 的对应分类菜单中添加导航项

## 目录结构规范

```
src/zh/web/<分类>/<工具名>/
├── index.md
└── components/
    └── <ComponentName>.vue
```

- 组件名使用大驼峰，如 `MultiLineMergeSplit.vue`
- 工具名目录使用小写连字符，如 `multi-line-merge-split`
- 分类目录参考现有：`encode-decode`、`text-tools`、`dev-tools`、`convert`

## index.md 格式

```markdown
---
title: <本地化 SEO 标题>
description: <本地化描述>
keywords: <关键词，逗号分隔>
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
import <ComponentName> from './components/<ComponentName>.vue'
</script>

<<ComponentName> />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
```

**注意**：`footer: false`、`editLink: false`、`aside: false`、`sidebar: false`、`pageClass: widescreen page-hero` 这五个字段是 kyx 工具页固定约定，不可省略。

## Vue 组件规范

- 使用 Element Plus 组件（`el-input`、`el-button`、`el-radio-group` 等）
- `<script setup lang="ts">` + `useI18n()`
- 样式用 `<style lang="scss" scoped>`，颜色变量使用 `var(--vp-c-*)` 系列
- i18n 语言列表固定 20 种（见下方）

### i18n 块格式

```html
<i18n lang="json"> { "zh": { ... }, "en": { ... }, ... } </i18n>
```

**关键规则**：i18n JSON 字符串中禁止出现裸露的 `|`，必须转义为 `{'|'}`，否则 vue-i18n 会把它识别为复数分隔符报错。

示例：`"竖线 {'|'}"`，而不是 `"竖线 |"`

### 20 种语言固定顺序

`zh` `en` `ja` `ko` `fr` `de` `es` `pt` `ru` `ar` `hi` `it` `nl` `tr` `vi` `th` `id` `ms` `pl` `uk`

注意：这与 `kyx-vue-i18n` skill 使用的语言列表略有不同，此处使用的是工具组件内部 i18n 的语言集合（对应 `src/{lang}/` 目录的 19 个语言 + zh，不含 sv/zh-TW，因为 sv 和 zh-TW 单独补充）。实际应涵盖所有存在 `src/{lang}/` 目录的语言：`en ar de es fr hi id it ja ko nl pl pt ru sv th tr vi zh-TW`，加上 `ms uk` 等额外语言。

## src/config.ts 菜单插入位置

文件位于 `src/config.ts`，zh 主导航配置在此处。

插入规则：找到对应的分类 `text` 块的 `items` 数组，追加新菜单项：

```ts
{ text: "工具名称", link: "/web/<分类>/<工具名>" },
```

例如"文本工具"分类：

```ts
{
  text: "文本工具",
  items: [
    { text: "多行合并拆分", link: "/web/text-tools/multi-line-merge-split" },
    // ← 新工具加在这里
  ],
},
```

若分类不存在，则在「加解密」之后、「开发工具」之前插入新分类块。

## 输出

直接创建文件，不输出额外说明。完成后列出已创建的文件路径。

## 示例

**用户说：**"实现多行合并拆分功能，放在文本工具分类"

**AI 执行：**

1. 创建 `src/zh/web/text-tools/multi-line-merge-split/index.md`
2. 创建 `src/zh/web/text-tools/multi-line-merge-split/components/MultiLineMergeSplit.vue`
3. 在 `src/config.ts` 的「文本工具」items 中追加菜单项
