---
name: kyx-cdn-first-load
description: 在 kyx 博客 Vue 组件中，使用 loadFirstAvailable + loadScript / toBlobURL 实现"CDN 优先加载第三方库或二进制资源、CDN 全部失败时回退到本地 node_modules 或 public 静态文件"的模式。当用户说"CDN 加载"、"CDN 优先"、"CDN 失败回退"、"cdn fallback"、"先从 cdn 加载"、"wasm cdn"时使用此技能。
---

# CDN 优先加载第三方库

## 背景

项目中封装了两个工具函数，位于 `src/utils/src/loadFirstAvailable.ts`，并从 `@/utils` 导出：

- **`loadFirstAvailable<T>(candidates, loader, fallback?)`**  
  并发尝试所有 CDN，谁先成功返回谁；全部失败后走 `fallback`。  
  `fallback` 有两种形式：

  - 字符串 URL → 继续走 `loader`（适合 public 静态资源兜底）
  - `() => Promise<T>` → 直接调用（适合 `import()` 本地 npm 包兜底）

- **`loadScript(url)`**  
  动态注入 `<script>` 标签，已存在相同 src 时跳过，加载完成后返回 `window`。  
  适用于 **UMD 格式**的 CDN 脚本（加载后挂载到 `window.xxx`）。

- **`toBlobURL(url, mimeType)`** 来自 `@ffmpeg/util`  
  把远程 URL 的内容下载为 Blob URL，适用于 **需要同源限制**的资源（如 WASM、Worker JS）。  
  与 `loadFirstAvailable` 配合时作为 `loader` 传入。

## 任务

当用户要在 Vue 组件或 TS 模块中加载某个第三方库或二进制资源时，判断属于哪种情形并套用对应模板。

## 规则

- `loadFirstAvailable` / `loadScript` 导入路径固定为 `import { loadFirstAvailable, loadScript } from '@/utils'`
- CDN 地址优先用 **jsdelivr**，备用 **unpkg**，锁定具体版本号
- `loadScript` 返回 `window`，需通过 `(win as any).全局变量名` 取值
- `toBlobURL` 回退到 public 静态文件时，fallback 传字符串路径（如 `'/ffmpeg/ffmpeg-core.js'`），走同一个 loader
- 如果有本地 npm fallback，`() => import('库名')` 中的库名必须已通过 `pnpm add` 安装
- 如果不安装 npm 包，则省略第三个参数（纯 CDN，失败时抛错）
- 加载逻辑封装在独立函数中（如 `ensureLib()` / `getFFmpeg()`），用模块级变量缓存，避免重复加载
- 加载失败需清空缓存变量，保证下次可以重试

## 代码模板

### 情形 A：UMD 脚本 CDN 优先 + 本地 npm 包 fallback

```ts
import { loadFirstAvailable, loadScript } from "@/utils"
import type { 类型 } from "库名" // 仅类型导入，不增加 bundle

let libInstance: 类型 | null = null

async function ensureLib() {
  if (libInstance) return
  const mod = await loadFirstAvailable(
    [
      "https://cdn.jsdelivr.net/npm/库名@版本/dist/index.js",
      "https://unpkg.com/库名@版本/dist/index.js",
    ],
    async url => {
      const win = await loadScript(url)
      return (win as any).window全局变量名 // UMD 挂载的全局对象
    },
    () => import("库名") // CDN 全部失败时回退，需已安装 npm 包
  )
  libInstance = mod
}
```

### 情形 B：纯 CDN，不安装 npm 包

```ts
import { loadFirstAvailable, loadScript } from "@/utils"

let libInstance: any = null

async function ensureLib() {
  if (libInstance) return
  libInstance = await loadFirstAvailable(
    [
      "https://cdn.jsdelivr.net/npm/库名@版本/dist/index.js",
      "https://unpkg.com/库名@版本/dist/index.js",
    ],
    async url => {
      const win = await loadScript(url)
      return (win as any).window全局变量名
    }
  )
}
```

### 情形 C：toBlobURL + public 静态文件 fallback（适合 WASM / Worker JS）

> 适用场景：资源需要以 Blob URL 形式加载（如 WASM、SharedArrayBuffer Worker），  
> CDN 失败时回退到 `src/public/` 下预置的本地文件。  
> `fallback` 传字符串路径，走同一个 `toBlobURL` loader。

```ts
import { loadFirstAvailable } from "@/utils"
import { toBlobURL } from "@ffmpeg/util"

const JS_CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/库名@版本/dist/esm/库名-core.js",
  "https://unpkg.com/库名@版本/dist/esm/库名-core.js",
]
const WASM_CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/库名@版本/dist/esm/库名-core.wasm",
  "https://unpkg.com/库名@版本/dist/esm/库名-core.wasm",
]

// WASM 文件需提前放到 src/public/库名/ 目录下
const coreURL = await loadFirstAvailable(
  JS_CDN_LIST,
  url => toBlobURL(url, "text/javascript"),
  "/库名/库名-core.js" // fallback 路径，走同一个 toBlobURL loader
)
const wasmURL = await loadFirstAvailable(
  WASM_CDN_LIST,
  url => toBlobURL(url, "application/wasm"),
  "/库名/库名-core.wasm"
)
```

真实项目示例（`src/zh/web/convert/audio/Convert/hooks/index.ts`）：

```ts
import { loadFirstAvailable } from "@/utils"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"

let _ffmpeg: FFmpeg | null = null
let _ffmpegReady: Promise<FFmpeg> | null = null

const FFMPEG_CORE_JS_CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
  "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
]
const FFMPEG_CORE_WASM_CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm",
  "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm",
]

async function getFFmpeg(): Promise<FFmpeg> {
  if (_ffmpegReady) return _ffmpegReady

  const ffmpeg = new FFmpeg()
  _ffmpeg = ffmpeg

  _ffmpegReady = (async () => {
    const coreURL = await loadFirstAvailable(
      FFMPEG_CORE_JS_CDN_LIST,
      url => toBlobURL(url, "text/javascript"),
      "/ffmpeg/ffmpeg-core.js" // src/public/ffmpeg/ffmpeg-core.js
    )
    const wasmURL = await loadFirstAvailable(
      FFMPEG_CORE_WASM_CDN_LIST,
      url => toBlobURL(url, "application/wasm"),
      "/ffmpeg/ffmpeg-core.wasm" // src/public/ffmpeg/ffmpeg-core.wasm
    )
    await ffmpeg.load({ coreURL, wasmURL })
    return ffmpeg
  })().catch(err => {
    _ffmpeg = null // 失败时清空缓存，保证可以重试
    _ffmpegReady = null
    throw err
  })

  return _ffmpegReady
}
```

## 已知库的 CDN 信息

### UMD 脚本（配合 loadScript 使用）

| 库名                     | jsdelivr UMD                                                    | unpkg UMD                                            | window 全局变量    |
| ------------------------ | --------------------------------------------------------------- | ---------------------------------------------------- | ------------------ |
| `pinyin-pro`             | `https://cdn.jsdelivr.net/npm/pinyin-pro@3.28.0/dist/index.js`  | `https://unpkg.com/pinyin-pro@3.28.0/dist/index.js`  | `window.pinyinPro` |
| `opencc-js`（完整）      | `https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js` | `https://unpkg.com/opencc-js@1.0.5/dist/umd/full.js` | `window.OpenCC`    |
| `opencc-js`（仅简 → 繁） | `https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/cn2t.js` | —                                                    | `window.OpenCC`    |
| `opencc-js`（仅繁 → 简） | `https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js` | —                                                    | `window.OpenCC`    |

### ESM / WASM（配合 toBlobURL 使用，需 public 静态兜底）

| 库名           | 资源类型 | jsdelivr ESM                                                                  | public 兜底路径            | mimeType           |
| -------------- | -------- | ----------------------------------------------------------------------------- | -------------------------- | ------------------ |
| `@ffmpeg/core` | JS       | `https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js`   | `/ffmpeg/ffmpeg-core.js`   | `text/javascript`  |
| `@ffmpeg/core` | WASM     | `https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm` | `/ffmpeg/ffmpeg-core.wasm` | `application/wasm` |

## 示例：拼音转换组件中加载 pinyin-pro

**输入：** 在拼音转换 Vue 组件中加载 pinyin-pro，CDN 优先，失败回退 node_modules

**输出：**

```ts
import { loadFirstAvailable, loadScript } from "@/utils"
import type { PinyinOptions } from "pinyin-pro"

let pinyinPro: typeof import("pinyin-pro") | null = null

async function ensurePinyinPro() {
  if (pinyinPro) return
  pinyinPro = await loadFirstAvailable(
    [
      "https://cdn.jsdelivr.net/npm/pinyin-pro@3.28.0/dist/index.js",
      "https://unpkg.com/pinyin-pro@3.28.0/dist/index.js",
    ],
    async url => {
      const win = await loadScript(url)
      return (win as any).pinyinPro as typeof import("pinyin-pro")
    },
    () => import("pinyin-pro")
  )
}

// 使用时：
async function convert(text: string) {
  await ensurePinyinPro()
  return pinyinPro!.pinyin(text, { toneType: "symbol" })
}
```

## 示例：简繁转换组件中加载 opencc-js（纯 CDN）

**输入：** 在简繁转换 Vue 组件中加载 opencc-js，仅需 CDN，不安装 npm 包

**输出：**

```ts
import { loadFirstAvailable, loadScript } from "@/utils"

let OpenCC: typeof import("opencc-js") | null = null

async function ensureOpenCC() {
  if (OpenCC) return
  OpenCC = await loadFirstAvailable(
    [
      "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js",
      "https://unpkg.com/opencc-js@1.0.5/dist/umd/full.js",
    ],
    async url => {
      const win = await loadScript(url)
      return (win as any).OpenCC
    }
  )
}

// 使用时：
async function toTraditional(text: string) {
  await ensureOpenCC()
  const converter = OpenCC!.Converter({ from: "cn", to: "tw" })
  return converter(text)
}
```
