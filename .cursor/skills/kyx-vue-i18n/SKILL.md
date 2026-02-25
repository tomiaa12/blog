---
name: kyx-vue-i18n
description: 对 Vue SFC 文件做国际化改造：提取模板中的中文硬编码字符串，替换为 t('key')，在 script setup 中添加 useI18n，并生成包含全部 20 种语言的 <i18n lang="json"> 块。当用户说"国际化"、"i18n"、"做翻译"、"提取中文"、"替换 t()"、"写 i18n 块"时使用此技能。
---

# Vue SFC 国际化改造

## 任务

对指定 Vue 文件（或选中代码）执行完整的 i18n 改造，分三步完成：

1. **提取**：找出 `<template>` 中所有硬编码中文字符串（含 HTML 属性值，如 `title="..."`）
2. **替换**：用 `t('key')` 替换，属性绑定改为 `:attr="t('key')"`
3. **生成**：在文件末尾写入 `<i18n lang="json">` 块，包含全部 20 种语言的翻译

## 规则

- `<script setup>` 中若无 `useI18n`，须添加：

  ```ts
  import { useI18n } from "vue-i18n"
  const { t } = useI18n({ useScope: "local" })
  ```

- key 命名：驼峰，简短语义化（`exitFullscreen` 而非 `button1`）
- **不处理** `v-if="isZhCN"` 包裹的纯中文专属内容（那些本就只给中文用户看）
- **不处理** `<script>` 中的注释、变量名、路径
- 若文件已有 `<i18n>` 块，合并而非覆盖，新 key 追加到现有结构中

## 语言列表（固定顺序，共 20 种）

| lang code | 语言       | 备注             |
|-----------|-----------|-----------------|
| zh-CN     | 简体中文   | 原始中文，第一位 |
| en        | English    |                  |
| zh-TW     | 繁體中文   | 简体 → 繁体转换  |
| ja        | 日本語     |                  |
| ko        | 한국어     |                  |
| fr        | Français   |                  |
| de        | Deutsch    |                  |
| es        | Español    |                  |
| pt        | Português  |                  |
| ru        | Русский    |                  |
| ar        | العربية    | RTL              |
| hi        | हिन्दी     |                  |
| it        | Italiano   |                  |
| nl        | Nederlands |                  |
| tr        | Türkçe     |                  |
| vi        | Tiếng Việt |                  |
| th        | ภาษาไทย    |                  |
| id        | Indonesia  |                  |
| pl        | Polski     |                  |
| sv        | Svenska    |                  |

## 输出格式

直接修改文件，不输出多余说明。改动包含：

1. `<template>` 中替换后的代码
2. `<script setup>` 中新增的 import 和 `const { t }`
3. 文件末尾的 `<i18n lang="json">` 块（单行紧凑 JSON，每种语言一行）：

```
<i18n lang="json">{
  "zh-CN": { "key1": "中文1", "key2": "中文2" },
  "en":    { "key1": "English1", "key2": "English2" },
  ...
}</i18n>
```

## 翻译质量要求

- 使用地道表达，避免直译腔
- 专业 UI 词汇参考 `src/.vitepress/config.ts` 中已有翻译
- 专有名词（Live2D、QR 等）保持不变
