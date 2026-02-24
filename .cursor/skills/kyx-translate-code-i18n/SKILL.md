---
name: kyx-translate-code-i18n
description: 将选中代码（JS/TS/HTML/JSON/Vue/CSS 等）中的中文字符串翻译成多语言版本，每种语言输出一个独立代码块。当用户说"翻译代码"、"翻译选中内容"、"给出多语言版本"、"i18n 代码翻译"时使用此技能。
---

# 代码多语言翻译

## 任务

将用户提供的代码中所有**中文字符串内容**翻译成多种语言，输出每种语言对应的完整代码块。

## 规则

1. **只翻译字符串值**，不改变：

   - 变量名、函数名、类名
   - JSON/对象的 key
   - 代码逻辑、注释（除非用户明确要求翻译注释）
   - HTML 标签名、属性名
   - 链接、路径、URL

2. **保持原始格式**：缩进、换行、引号风格（单引号/双引号）完全不变

3. **识别语言类型**：根据代码自动判断语言（js/ts/html/json/vue/css 等），代码块标注对应语言

## 输出格式

每种语言输出一个代码块，格式：

````
**语言名称（lang code）**
```[原始语言类型]
// 翻译后的代码
```
````

## 目标语言列表（按此顺序输出）

| 语言名称   | lang code | 备注             |
| ---------- | --------- | ---------------- |
| 繁體中文   | zh-TW     | 简体 → 繁体转换  |
| English    | en        |                  |
| 日本語     | ja        |                  |
| 한국어     | ko        |                  |
| Français   | fr        |                  |
| Deutsch    | de        |                  |
| Español    | es        |                  |
| Português  | pt        |                  |
| Русский    | ru        |                  |
| العربية    | ar        | 注意文字方向 RTL |
| हिन्दी     | hi        |                  |
| Italiano   | it        |                  |
| Nederlands | nl        |                  |
| Türkçe     | tr        |                  |
| Tiếng Việt | vi        |                  |
| ภาษาไทย    | th        |                  |
| Indonesia  | id        |                  |
| Polski     | pl        |                  |
| Svenska    | sv        |                  |

## 翻译质量要求

- 使用地道表达，避免直译腔
- 专业术语保持一致（参考 `src/.vitepress/config.ts` 中已有翻译）
- 如果某个中文词在 config.ts 中已有对应翻译，优先使用已有版本

## 示例

**输入（JSON）：**

```json
{
  "title": "图片压缩",
  "description": "在线免费压缩图片",
  "button": "开始压缩"
}
```

**输出示例（仅展示 2 种）：**

**繁體中文（zh-TW）**

```json
{
  "title": "圖片壓縮",
  "description": "線上免費壓縮圖片",
  "button": "開始壓縮"
}
```

**English（en）**

```json
{
  "title": "Image Compression",
  "description": "Free online image compression",
  "button": "Start Compression"
}
```

...以此类推，输出全部 19 种语言。
