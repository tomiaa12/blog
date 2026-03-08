---
name: kyx-dynamic-route-paths
description: 为 kyx 博客项目生成或改造动态路由 `*.paths.ts` 文件，按 `src/zh/web/encode-decode/url/[type]-[operation]-url.paths.ts` 的模式维护全量语言定义与统一的路由参数生成函数。当用户说"动态路由"、"paths.ts"、"生成路由参数"、"补全 allLangCopy"、"按 url.paths.ts 模式写"时使用此技能。
---

# 动态路由 paths.ts 生成规范

## 任务

为工具页创建或改造动态路由 `*.paths.ts` 文件，统一输出：

1. 路由参数类型定义
2. 全量语言文案定义
3. 基于语言生成 `params` 列表的函数
4. 默认导出的中文路由入口

默认参考实现为：

- `src/zh/web/encode-decode/url/[type]-[operation]-url.paths.ts`

## 规则

- 所有语言文案默认集中定义在当前 `*.paths.ts` 文件内，不拆成每个语言各一份
- 语言集合必须覆盖 `src/types/i18n.ts` 中的全部 `LangCode`
- 当路由是“维度组合”场景（如 `type + operation`），优先使用：
  - `PageCopy`
  - `LocaleCopy`
  - `const allLangCopy: Record<LangCode, LocaleCopy>`
- `zh` 先作为基准文案写完整，其他语言必须与 `zh.pages` 保持完全同构，key 不允许缺失
- 其它语言不是各自单独生成路由逻辑，而是统一通过同一个 `getXxxRouteParams(lang)` 读取 `allLangCopy[lang]` 后组装
- 动态路由输出格式优先保持为：
  - `type ParamsItem = { params: XxxRouteParams }`
  - `getXxxRouteParams(lang)`
  - `getXxxPaths(lang)`
  - `export default getXxxPaths('zh')`
- 若文件本身已有同类结构，优先在原结构上扩展，不随意改成另一种数据模型
- 路由参数对象中用于 SEO 的字段（如 `h1`、`title`、`description`、`keywords`、`moreTools`）必须每种语言都完整提供
- 文案生成时，标题、描述、关键词要符合页面真实功能，不要机械直译
- 若动态路由依赖 `params.title`、`params.description`、`params.keywords` 做 SEO，必须同步检查 `src/.vitepress/config.ts` 中的 `transformPageData`
- 默认约定：动态页标题与描述由 `transformPageData(pageData)` 从 `pageData.params` 注入，而不是在 `.md` 里用 `# {{ ... }}` 或 frontmatter 模板表达式生成浏览器标题
- 推荐在 `transformPageData(pageData)` 中至少处理：
  - `pageData.title = p.title`
  - `pageData.description = p.description`
  - `pageData.frontmatter.head.push(...)` 注入 `description`、`keywords`、`og:title`、`og:description`
- 若页面需要统一标题后缀，优先设置 `pageData.titleTemplate`，不要改 `pageData.frontmatter.titleTemplate`

## 推荐结构

```ts
import type { LangCode } from '../../../../types/i18n'

export interface XxxRouteParams {
  // 路由维度
  title: string
  description: string
  keywords: string
  h1: string
  moreTools: string
}

type PageCopy = Omit<XxxRouteParams, '...'>

interface LocaleCopy {
  moreTools: string
  pages: {
    pageA: PageCopy
    pageB: PageCopy
  }
}

type ParamsItem = { params: XxxRouteParams }

const allLangCopy: Record<LangCode, LocaleCopy> = {
  zh: { ... },
  'zh-TW': { ... },
  en: { ... },
  // 其余语言 ...
}

export function getXxxRouteParams(lang: LangCode): XxxRouteParams[] {
  const { moreTools, pages } = allLangCopy[lang]

  return [
    { ..., moreTools, ...pages.pageA },
    { ..., moreTools, ...pages.pageB },
  ]
}

export function getXxxPaths(lang: LangCode): { paths: () => ParamsItem[] } {
  return {
    paths: () => getXxxRouteParams(lang).map(params => ({ params })),
  }
}

export default getXxxPaths('zh')
```

## 输出格式

直接创建或修改目标 `*.paths.ts` 文件，不输出额外教程式说明。

生成结果必须满足：

1. 类型定义完整
2. `allLangCopy` 或同级全量语言常量完整
3. 全部语言 key 齐全
4. `getXxxRouteParams(lang)` 能返回完整路由参数数组
5. `getXxxPaths(lang)` 返回 `{ paths: () => ... }`
6. 默认导出为 `getXxxPaths('zh')`
7. 若使用动态 SEO，`src/.vitepress/config.ts` 中存在对应的 `transformPageData` 处理

## VitePress SEO 约定

项目中动态路由页默认配合下面这类配置使用：

```ts
transformPageData(pageData) {
  const p = pageData.params
  if (p?.title) {
    pageData.title = p.title
    pageData.description = p.description
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ["meta", { name: "description", content: p.description }],
      ["meta", { name: "keywords", content: p.keywords }],
      ["meta", { property: "og:title", content: p.title }],
      ["meta", { property: "og:description", content: p.description }]
    )
  }
}
```

适用结论：

- 动态浏览器标题用 `pageData.title`
- 动态描述用 `pageData.description`
- 动态 meta / og 信息放到 `pageData.frontmatter.head`
- `.md` 正文中的 `# {{ ... }}` 只适合页面显示文案，不可靠地参与构建期标题推导

## 示例

**输入：**

“按 URL 那个 `paths.ts` 的模式，给新工具页生成动态路由”

**输出：**

创建一个新的 `*.paths.ts`：

- 在一个文件里维护全部语言文案
- 用 `Record<LangCode, LocaleCopy>` 承载各语言页面 SEO 文案
- 用统一函数按 `lang` 组装动态路由参数
- 默认导出中文版本的 `paths`
