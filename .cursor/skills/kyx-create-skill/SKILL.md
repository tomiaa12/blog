---
name: kyx-create-skill
description: 为 kyx 博客项目创建新的 Cursor Skill。所有 skill 必须以 kyx- 开头。当用户说"新建 skill"、"创建 skill"、"写一个 skill"、"添加 skill"时使用此技能。
---

# 创建 kyx 项目 Skill

## 命名规范

- **目录名**：`kyx-<功能名>`，全小写，连字符分隔
- **SKILL.md 中的 name 字段**：与目录名相同，即 `kyx-<功能名>`
- **存放位置**：`.cursor/skills/kyx-<功能名>/SKILL.md`

示例：`kyx-create-skill`、`kyx-i18n-translation`、`kyx-translate-code-i18n`

## 已有 Skill 一览

| Skill 名称 | 功能 |
|------------|------|
| `kyx-i18n-translation` | 更新 config.ts 中所有语言的 description/keywords |
| `kyx-translate-code-i18n` | 将代码中的中文翻译为 19 种语言的多版本代码块 |
| `kyx-create-skill` | 创建新的项目 Skill（本文件） |

## 创建流程

1. 明确 skill 的**用途**（一句话描述）
2. 确定**触发场景**（用户说什么话时会用到）
3. 用 `kyx-<功能名>` 命名
4. 创建目录和 SKILL.md 文件

## SKILL.md 模板

```markdown
---
name: kyx-<功能名>
description: <第三人称描述功能和触发场景，包含关键触发词>
---

# <Skill 标题>

## 任务

<清晰描述 AI 需要做什么>

## 规则

- 规则 1
- 规则 2

## 输出格式

<描述期望的输出样式>

## 示例

**输入：**
...

**输出：**
...
```

## 质量要求

- `description` 字段用**第三人称**，包含触发关键词
- SKILL.md 控制在 **500 行以内**
- 内容简洁，只写 AI 不会自己推断的信息
- 不写显而易见的内容（AI 已有通用知识）
