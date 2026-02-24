---
name: kyx-i18n-translation
description: 为博客 VitePress 多语言配置（src/.vitepress/config.ts）添加或更新翻译。当用户提到"添加新工具"、"更新关键词"、"翻译"、"多语言"、"i18n"、"新增功能描述"时使用此技能。负责同步更新所有 20 种语言的 description 和 keywords，以及必要时更新 zh-CN 的 UI 翻译文本。
---

# VitePress 多语言翻译

配置文件：`src/.vitepress/config.ts`

## 语言列表（共 20 种）

| key   | 语言       | 风格说明           |
|-------|------------|-------------------|
| zh-CN | 简体中文   | 主语言，逗号分隔  |
| zh-TW | 繁體中文   | 繁体字，逗号分隔  |
| en    | English    | 逗号分隔          |
| ja    | 日本語     | 读点（，）分隔    |
| ko    | 한국어     | 逗号+空格分隔     |
| fr    | Français   | 逗号分隔          |
| de    | Deutsch    | 逗号分隔          |
| es    | Español    | 逗号分隔          |
| pt    | Português  | 逗号分隔          |
| ru    | Русский    | 逗号分隔          |
| ar    | العربية    | 逗号+空格分隔     |
| hi    | हिन्दी     | 逗号分隔          |
| it    | Italiano   | 逗号分隔          |
| nl    | Nederlands | 逗号分隔          |
| tr    | Türkçe     | 逗号分隔          |
| vi    | Tiếng Việt | 逗号分隔          |
| th    | ภาษาไทย    | 逗号分隔          |
| id    | Indonesia  | 逗号分隔          |
| pl    | Polski     | 逗号分隔          |
| sv    | Svenska    | 逗号分隔          |

## 每个语言条目的结构

每个语言 key 对应对象结构如下：

```ts
'zh-CN': {
  lang: "zh-CN",
  label: "简体中文",
  description: "...",         // <meta name="description"> 的内容
  head: [
    ["meta", { name: "keywords", content: "..." }]  // <meta name="keywords">
  ],
  themeConfig: { ... }        // 仅 zh-CN 有完整 UI 翻译
}
```

> **注意**：`description` 和 `head[keywords].content` 内容**完全一致**，两处都要同步更新。

## 添加新工具/功能时的翻译流程

1. **确定 zh-CN 的新词条**（简体中文原文，如：`文字识别`）
2. **将新词条翻译成所有其他 19 种语言**
3. **在每个语言 key 中**，将翻译好的词追加到 `description` 和 `head[keywords].content` 末尾
4. **格式**：保持与现有内容一致的分隔符风格（见语言列表中的风格说明）

### 参考现有词条对照

| zh-CN     | zh-TW     | en                    | ja              | ko                   |
|-----------|-----------|-----------------------|-----------------|----------------------|
| 在线工具  | 線上工具  | Online tools          | オンラインツール | 온라인 도구          |
| 图片压缩  | 圖片壓縮  | image compression     | 画像圧縮        | 이미지 압축          |
| PDF转Word | PDF轉Word | PDF to Word           | PDF to Word     | PDF to Word          |
| 视频压缩  | 視頻壓縮  | video compression     | ビデオ圧縮      | 비디오 압축          |
| Base64编解码 | Base64編碼 | Base64 encoding    | Base64エンコーディング | Base64 인코딩  |

## 更新 UI 翻译（themeConfig）

仅 `zh-CN` 区块有 `themeConfig`，包含：
- 搜索框文案（`search.options.translations`）
- 页面标签（`outlineTitle`、`lastUpdatedText`、`docFooter`）
- 404 页面文案（`notFound`）

添加新的 UI 功能时，在 `zh-CN.themeConfig` 对应位置填写中文翻译。

## 快速检查清单

- [ ] zh-CN `description` 已更新
- [ ] zh-CN `head[keywords]` 已更新
- [ ] 其余 19 种语言的 `description` 已更新
- [ ] 其余 19 种语言的 `head[keywords]` 已更新
- [ ] 分隔符风格与原文一致
- [ ] 翻译准确（不使用机器翻译腔）
