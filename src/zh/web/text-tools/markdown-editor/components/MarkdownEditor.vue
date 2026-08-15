<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { renderMarkdown } from "./loadMarkdown"
import { ensureHtml2Canvas, ensureHtml2Pdf } from "./loadExport"

const { t } = useI18n()

type ViewMode = "split" | "edit" | "preview"

const SAMPLE = `# Markdown

在左侧编辑，右侧实时预览。可导出 **HTML**、**PDF** 和图片。

## 列表

- 待办事项
- [x] 已完成

## 代码

\`\`\`js
console.log("hello markdown")
\`\`\`

## 表格

列 A | 列 B
--- | ---
HTML | 独立网页
PDF | A4 文档
PNG | 长图

> 数据只在浏览器本地处理，不会上传。
`

const EXPORT_CSS = `
.md-export{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,"Noto Sans SC",sans-serif;font-size:16px;line-height:1.7;color:#24292f;background:#fff;padding:32px;max-width:800px;box-sizing:border-box}
.md-export h1,.md-export h2,.md-export h3{margin:1.2em 0 .6em;line-height:1.3;border-bottom:1px solid #d0d7de;padding-bottom:.3em}
.md-export h1{font-size:2em}.md-export h2{font-size:1.5em}.md-export h3{font-size:1.25em}
.md-export p,.md-export ul,.md-export ol,.md-export blockquote,.md-export pre,.md-export table{margin:0 0 1em}
.md-export a{color:#0969da}
.md-export img{max-width:100%}
.md-export blockquote{border-left:4px solid #d0d7de;padding:0 1em;color:#656d76}
.md-export pre{background:#f6f8fa;padding:16px;overflow:auto;border-radius:6px}
.md-export code{background:#f6f8fa;padding:.2em .4em;border-radius:4px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.9em}
.md-export pre code{background:transparent;padding:0}
.md-export table{border-collapse:collapse;width:100%}
.md-export th,.md-export td{border:1px solid #d0d7de;padding:6px 13px}
.md-export th{background:#f6f8fa}
.md-export hr{border:0;border-top:1px solid #d0d7de;margin:1.5em 0}
`

const input = ref(SAMPLE)
const html = ref("")
const view = ref<ViewMode>("split")
const loading = ref(true)
const exporting = ref(false)
const areaRef = ref<{ textarea?: HTMLTextAreaElement } | null>(null)
const previewRef = ref<HTMLElement | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)

let renderTimer = 0
let themeObs: MutationObserver | null = null

const stats = computed(() => {
  const text = input.value
  const lines = text ? text.split("\n").length : 0
  return { lines, chars: text.length }
})

function textareaEl() {
  return areaRef.value?.textarea ?? null
}

async function refresh() {
  try {
    html.value = await renderMarkdown(input.value)
  } catch {
    if (loading.value) ElMessage({ message: t("msgLib"), type: "error" })
  } finally {
    loading.value = false
  }
}

function scheduleRender() {
  window.clearTimeout(renderTimer)
  renderTimer = window.setTimeout(() => void refresh(), 160)
}

function insert(before: string, after = "", placeholder = "") {
  const el = textareaEl()
  const src = input.value
  if (!el) {
    input.value = `${src}${before}${placeholder}${after}`
    scheduleRender()
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = src.slice(start, end) || placeholder
  input.value = `${src.slice(0, start)}${before}${selected}${after}${src.slice(end)}`
  void nextTick(() => {
    el.focus()
    const from = start + before.length
    el.setSelectionRange(from, from + selected.length)
  })
  scheduleRender()
}

function wrapLine(prefix: string) {
  const el = textareaEl()
  const src = input.value
  if (!el) {
    input.value = `${prefix}${src}`
    scheduleRender()
    return
  }
  const start = src.lastIndexOf("\n", el.selectionStart - 1) + 1
  input.value = `${src.slice(0, start)}${prefix}${src.slice(start)}`
  void nextTick(() => {
    el.focus()
    el.setSelectionRange(el.selectionStart + prefix.length, el.selectionEnd + prefix.length)
  })
  scheduleRender()
}

async function copyMd() {
  if (!input.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  await copyToClipboard(input.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function saveBlob(text: string, name: string, mime: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([text], { type: mime }))
  a.download = name
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

function downloadMd() {
  if (!input.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  saveBlob(input.value, "document.md", "text/markdown;charset=utf-8")
}

function openFile() {
  fileRef.value?.click()
}

async function onFile(ev: Event) {
  const el = ev.target as HTMLInputElement
  const file = el.files?.[0]
  el.value = ""
  if (!file) return
  input.value = await file.text()
  await refresh()
}

function useSample() {
  input.value = SAMPLE
  void refresh()
}

function clearAll() {
  input.value = ""
  html.value = ""
}

function waitImages(root: HTMLElement) {
  return Promise.all(
    [...root.querySelectorAll("img")].map(
      img =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>(resolve => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
    )
  )
}

function mountExportNode() {
  const wrap = document.createElement("div")
  wrap.className = "md-export-host"
  wrap.style.cssText = "position:fixed;left:-99999px;top:0;z-index:-1;"
  const style = document.createElement("style")
  style.textContent = EXPORT_CSS
  const article = document.createElement("div")
  article.className = "md-export"
  article.innerHTML = html.value || "<p></p>"
  wrap.append(style, article)
  document.body.appendChild(wrap)
  return { wrap, article }
}

async function prepareExport() {
  if (!input.value.trim()) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return null
  }
  await refresh()
  const node = mountExportNode()
  await nextTick()
  await waitImages(node.article)
  return node
}

async function exportHtml() {
  if (!input.value.trim()) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  exporting.value = true
  try {
    await refresh()
    const doc = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Markdown</title>
<style>${EXPORT_CSS}</style>
</head>
<body>
<div class="md-export">${html.value}</div>
</body>
</html>`
    saveBlob(doc, "document.html", "text/html;charset=utf-8")
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    exporting.value = false
  }
}

async function exportPdf() {
  exporting.value = true
  let node: ReturnType<typeof mountExportNode> | null = null
  try {
    node = await prepareExport()
    if (!node) return
    const html2pdf = await ensureHtml2Pdf()
    await html2pdf()
      .set({
        margin: [12, 12, 12, 12],
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(node.article)
      .save()
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    ElMessage({
      message: msg.includes("html2pdf") || msg.includes("资源") ? t("msgLib") : t("msgFail"),
      type: "error",
    })
  } finally {
    node?.wrap.remove()
    exporting.value = false
  }
}

async function exportPng() {
  exporting.value = true
  let node: ReturnType<typeof mountExportNode> | null = null
  try {
    node = await prepareExport()
    if (!node) return
    const html2canvas = await ensureHtml2Canvas()
    const canvas = await html2canvas(node.article, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"))
    if (!blob) throw new Error("png")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "document.png"
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    ElMessage({
      message: msg.includes("html2canvas") || msg.includes("资源") ? t("msgLib") : t("msgFail"),
      type: "error",
    })
  } finally {
    node?.wrap.remove()
    exporting.value = false
  }
}

watch(input, scheduleRender)

onMounted(() => {
  themeObs = new MutationObserver(() => void refresh())
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  void refresh()
})

onBeforeUnmount(() => {
  window.clearTimeout(renderTimer)
  themeObs?.disconnect()
})
</script>

<template>
  <div class="md-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-radio-group v-model="view">
        <el-radio-button value="edit">{{ t("edit") }}</el-radio-button>
        <el-radio-button value="split">{{ t("split") }}</el-radio-button>
        <el-radio-button value="preview">{{ t("preview") }}</el-radio-button>
      </el-radio-group>
      <span class="status">{{ t("stats", { n: stats.lines, c: stats.chars }) }}</span>
    </div>

    <div class="md-bar">
      <el-button
        size="small"
        @click="wrapLine('# ')"
      >
        H1
      </el-button>
      <el-button
        size="small"
        @click="wrapLine('## ')"
      >
        H2
      </el-button>
      <el-button
        size="small"
        @click="insert('**', '**', t('phBold'))"
      >
        {{ t("bold") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('*', '*', t('phItalic'))"
      >
        {{ t("italic") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('~~', '~~', t('phStrike'))"
      >
        {{ t("strike") }}
      </el-button>
      <el-button
        size="small"
        @click="wrapLine('> ')"
      >
        {{ t("quote") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('`', '`', 'code')"
      >
        {{ t("code") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('\n```\n', '\n```\n', 'code')"
      >
        {{ t("codeBlock") }}
      </el-button>
      <el-button
        size="small"
        @click="wrapLine('- ')"
      >
        {{ t("ul") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('[', '](https://)', t('phLink'))"
      >
        {{ t("link") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('![', '](https://)', t('phImage'))"
      >
        {{ t("image") }}
      </el-button>
      <el-button
        size="small"
        @click="insert('\n列 A | 列 B\n--- | ---\nA | B\n')"
      >
        {{ t("table") }}
      </el-button>
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="exporting"
        :disabled="loading"
        @click="exportHtml"
      >
        {{ t("exportHtml") }}
      </el-button>
      <el-button
        :loading="exporting"
        :disabled="loading"
        @click="exportPdf"
      >
        {{ t("exportPdf") }}
      </el-button>
      <el-button
        :loading="exporting"
        :disabled="loading"
        @click="exportPng"
      >
        {{ t("exportPng") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="copyMd"
      >
        {{ t("copy") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="downloadMd"
      >
        {{ t("downloadMd") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="openFile"
      >
        {{ t("open") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="useSample"
      >
        {{ t("sample") }}
      </el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <input
      ref="fileRef"
      type="file"
      accept=".md,.markdown,.txt,text/markdown,text/plain"
      class="file-input"
      @change="onFile"
    >

    <div
      class="panes"
      :class="`mode-${view}`"
    >
      <div
        v-show="view !== 'preview'"
        class="pane"
      >
        <div class="pane-label">{{ t("inputLabel") }}</div>
        <el-input
          ref="areaRef"
          v-model="input"
          type="textarea"
          :rows="22"
          :placeholder="t('placeholder')"
          resize="vertical"
          class="code-area"
        />
      </div>
      <div
        v-show="view !== 'edit'"
        class="pane"
      >
        <div class="pane-label">{{ t("outputLabel") }}</div>
        <div
          ref="previewRef"
          class="preview markdown-body"
          v-html="html"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.md-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.page-desc {
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.toolbar,
.md-bar,
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.status {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.file-input {
  display: none;
}

.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  &.mode-edit,
  &.mode-preview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .panes {
    grid-template-columns: 1fr;
  }
}

.pane-label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.code-area {
  :deep(textarea) {
    font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
    font-size: 0.88rem;
    line-height: 1.55;
    min-height: 520px;
  }
}

.preview {
  min-height: 520px;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  overflow: auto;
  line-height: 1.7;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 1.1em 0 0.5em;
    line-height: 1.3;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 0.25em;
  }

  :deep(h1) {
    font-size: 1.7rem;
  }

  :deep(h2) {
    font-size: 1.35rem;
  }

  :deep(p),
  :deep(ul),
  :deep(ol),
  :deep(blockquote),
  :deep(pre),
  :deep(table) {
    margin: 0 0 0.9em;
  }

  :deep(a) {
    color: var(--vp-c-brand-1);
  }

  :deep(img) {
    max-width: 100%;
  }

  :deep(blockquote) {
    margin-left: 0;
    padding: 0 1em;
    border-left: 4px solid var(--vp-c-divider);
    color: var(--vp-c-text-2);
  }

  :deep(pre) {
    padding: 14px;
    overflow: auto;
    border-radius: 6px;
    background: var(--vp-c-bg);
  }

  :deep(code) {
    font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
    font-size: 0.88em;
    padding: 0.15em 0.35em;
    border-radius: 4px;
    background: var(--vp-c-bg);
  }

  :deep(pre code) {
    padding: 0;
    background: transparent;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid var(--vp-c-divider);
    padding: 6px 10px;
  }

  :deep(th) {
    background: var(--vp-c-bg);
  }

  :deep(hr) {
    border: 0;
    border-top: 1px solid var(--vp-c-divider);
    margin: 1.4em 0;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "Markdown 在线编辑",
    "desc": "在浏览器里编辑 Markdown 并实时预览，可导出 HTML、PDF 和长图。渲染与导出库从 CDN 加载，数据不会上传。",
    "edit": "编辑",
    "split": "分栏",
    "preview": "预览",
    "inputLabel": "Markdown",
    "outputLabel": "预览",
    "placeholder": "输入 Markdown…",
    "bold": "粗体",
    "italic": "斜体",
    "strike": "删除线",
    "quote": "引用",
    "code": "代码",
    "codeBlock": "代码块",
    "ul": "列表",
    "link": "链接",
    "image": "图片",
    "table": "表格",
    "phBold": "粗体",
    "phItalic": "斜体",
    "phStrike": "删除线",
    "phLink": "链接文字",
    "phImage": "图片说明",
    "exportHtml": "导出 HTML",
    "exportPdf": "导出 PDF",
    "exportPng": "导出图片",
    "copy": "复制 Markdown",
    "downloadMd": "下载 .md",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "copied": "已复制",
    "stats": "{n} 行 · {c} 字符",
    "msgEmpty": "请先输入 Markdown。",
    "msgLib": "无法从 CDN 加载所需库，请检查网络后重试。",
    "msgFail": "导出失败。"
  },
  "zh-CN": {
    "title_page": "Markdown 在线编辑",
    "desc": "在浏览器里编辑 Markdown 并实时预览，可导出 HTML、PDF 和长图。渲染与导出库从 CDN 加载，数据不会上传。",
    "edit": "编辑",
    "split": "分栏",
    "preview": "预览",
    "inputLabel": "Markdown",
    "outputLabel": "预览",
    "placeholder": "输入 Markdown…",
    "bold": "粗体",
    "italic": "斜体",
    "strike": "删除线",
    "quote": "引用",
    "code": "代码",
    "codeBlock": "代码块",
    "ul": "列表",
    "link": "链接",
    "image": "图片",
    "table": "表格",
    "phBold": "粗体",
    "phItalic": "斜体",
    "phStrike": "删除线",
    "phLink": "链接文字",
    "phImage": "图片说明",
    "exportHtml": "导出 HTML",
    "exportPdf": "导出 PDF",
    "exportPng": "导出图片",
    "copy": "复制 Markdown",
    "downloadMd": "下载 .md",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "copied": "已复制",
    "stats": "{n} 行 · {c} 字符",
    "msgEmpty": "请先输入 Markdown。",
    "msgLib": "无法从 CDN 加载所需库，请检查网络后重试。",
    "msgFail": "导出失败。"
  },
  "en": {
    "title_page": "Markdown Editor",
    "desc": "Edit Markdown with a live preview and export HTML, PDF, or a long image. Libraries load from a CDN. Nothing is uploaded.",
    "edit": "Edit",
    "split": "Split",
    "preview": "Preview",
    "inputLabel": "Markdown",
    "outputLabel": "Preview",
    "placeholder": "Write Markdown…",
    "bold": "Bold",
    "italic": "Italic",
    "strike": "Strike",
    "quote": "Quote",
    "code": "Code",
    "codeBlock": "Code block",
    "ul": "List",
    "link": "Link",
    "image": "Image",
    "table": "Table",
    "phBold": "bold",
    "phItalic": "italic",
    "phStrike": "strike",
    "phLink": "link text",
    "phImage": "alt text",
    "exportHtml": "Export HTML",
    "exportPdf": "Export PDF",
    "exportPng": "Export image",
    "copy": "Copy Markdown",
    "downloadMd": "Download .md",
    "open": "Open file",
    "sample": "Sample",
    "clear": "Clear",
    "copied": "Copied",
    "stats": "{n} lines · {c} chars",
    "msgEmpty": "Enter some Markdown first.",
    "msgLib": "Could not load libraries from the CDN. Check your network and retry.",
    "msgFail": "Export failed."
  },
  "ja": {
    "title_page": "Markdown オンライン編集",
    "desc": "Markdown を編集してリアルタイムプレビュー。HTML・PDF・画像に書き出せます。CDN から読み込み、データはアップロードしません。",
    "edit": "編集",
    "split": "分割",
    "preview": "プレビュー",
    "inputLabel": "Markdown",
    "outputLabel": "プレビュー",
    "placeholder": "Markdown を入力…",
    "bold": "太字",
    "italic": "斜体",
    "strike": "打ち消し",
    "quote": "引用",
    "code": "コード",
    "codeBlock": "コードブロック",
    "ul": "リスト",
    "link": "リンク",
    "image": "画像",
    "table": "表",
    "phBold": "太字",
    "phItalic": "斜体",
    "phStrike": "打ち消し",
    "phLink": "リンク文字",
    "phImage": "代替テキスト",
    "exportHtml": "HTML 書き出し",
    "exportPdf": "PDF 書き出し",
    "exportPng": "画像書き出し",
    "copy": "Markdown をコピー",
    "downloadMd": ".md を保存",
    "open": "ファイルを開く",
    "sample": "サンプル",
    "clear": "クリア",
    "copied": "コピーしました",
    "stats": "{n} 行 · {c} 文字",
    "msgEmpty": "先に Markdown を入力してください。",
    "msgLib": "CDN からライブラリを読み込めません。通信を確認して再試行してください。",
    "msgFail": "書き出しに失敗しました。"
  },
  "ko": {
    "title_page": "Markdown 온라인 편집",
    "desc": "Markdown을 편집하고 실시간으로 미리 본 뒤 HTML, PDF, 긴 이미지로보냅니다. CDN에서 불러오며 업로드하지 않습니다.",
    "edit": "편집",
    "split": "분할",
    "preview": "미리보기",
    "inputLabel": "Markdown",
    "outputLabel": "미리보기",
    "placeholder": "Markdown 입력…",
    "bold": "굵게",
    "italic": "기울임",
    "strike": "취소선",
    "quote": "인용",
    "code": "코드",
    "codeBlock": "코드 블록",
    "ul": "목록",
    "link": "링크",
    "image": "이미지",
    "table": "표",
    "phBold": "굵게",
    "phItalic": "기울임",
    "phStrike": "취소선",
    "phLink": "링크 텍스트",
    "phImage": "대체 텍스트",
    "exportHtml": "HTML보내기",
    "exportPdf": "PDF보내기",
    "exportPng": "이미지보내기",
    "copy": "Markdown 복사",
    "downloadMd": ".md 저장",
    "open": "파일 열기",
    "sample": "예제",
    "clear": "지우기",
    "copied": "복사됨",
    "stats": "{n}줄 · {c}자",
    "msgEmpty": "먼저 Markdown을 입력하세요.",
    "msgLib": "CDN에서 라이브러리를 불러오지 못했습니다. 네트워크를 확인하세요.",
    "msgFail": "보내기에 실패했습니다."
  },
  "fr": {
    "title_page": "Éditeur Markdown",
    "desc": "Éditez du Markdown avec aperçu en direct, puis exportez en HTML, PDF ou image. Bibliothèques via CDN, rien n’est envoyé.",
    "edit": "Éditer",
    "split": "Scinder",
    "preview": "Aperçu",
    "inputLabel": "Markdown",
    "outputLabel": "Aperçu",
    "placeholder": "Écrire du Markdown…",
    "bold": "Gras",
    "italic": "Italique",
    "strike": "Barré",
    "quote": "Citation",
    "code": "Code",
    "codeBlock": "Bloc de code",
    "ul": "Liste",
    "link": "Lien",
    "image": "Image",
    "table": "Tableau",
    "phBold": "gras",
    "phItalic": "italique",
    "phStrike": "barré",
    "phLink": "texte du lien",
    "phImage": "texte alternatif",
    "exportHtml": "Exporter HTML",
    "exportPdf": "Exporter PDF",
    "exportPng": "Exporter image",
    "copy": "Copier Markdown",
    "downloadMd": "Télécharger .md",
    "open": "Ouvrir",
    "sample": "Exemple",
    "clear": "Effacer",
    "copied": "Copié",
    "stats": "{n} lignes · {c} car.",
    "msgEmpty": "Saisissez d’abord du Markdown.",
    "msgLib": "Impossible de charger les bibliothèques CDN. Vérifiez le réseau.",
    "msgFail": "Échec de l’export."
  },
  "de": {
    "title_page": "Markdown-Editor",
    "desc": "Markdown mit Live-Vorschau bearbeiten und als HTML, PDF oder Bild exportieren. Bibliotheken per CDN, nichts wird hochgeladen.",
    "edit": "Bearbeiten",
    "split": "Geteilt",
    "preview": "Vorschau",
    "inputLabel": "Markdown",
    "outputLabel": "Vorschau",
    "placeholder": "Markdown schreiben…",
    "bold": "Fett",
    "italic": "Kursiv",
    "strike": "Durchgestrichen",
    "quote": "Zitat",
    "code": "Code",
    "codeBlock": "Codeblock",
    "ul": "Liste",
    "link": "Link",
    "image": "Bild",
    "table": "Tabelle",
    "phBold": "fett",
    "phItalic": "kursiv",
    "phStrike": "durchgestrichen",
    "phLink": "Linktext",
    "phImage": "Alt-Text",
    "exportHtml": "HTML exportieren",
    "exportPdf": "PDF exportieren",
    "exportPng": "Bild exportieren",
    "copy": "Markdown kopieren",
    "downloadMd": ".md herunterladen",
    "open": "Öffnen",
    "sample": "Beispiel",
    "clear": "Leeren",
    "copied": "Kopiert",
    "stats": "{n} Zeilen · {c} Zeichen",
    "msgEmpty": "Bitte zuerst Markdown eingeben.",
    "msgLib": "CDN-Bibliotheken konnten nicht geladen werden. Netz prüfen.",
    "msgFail": "Export fehlgeschlagen."
  },
  "es": {
    "title_page": "Editor Markdown",
    "desc": "Edita Markdown con vista previa y exporta HTML, PDF o imagen. Las librerías llegan por CDN y no se sube nada.",
    "edit": "Editar",
    "split": "Dividir",
    "preview": "Vista previa",
    "inputLabel": "Markdown",
    "outputLabel": "Vista previa",
    "placeholder": "Escribe Markdown…",
    "bold": "Negrita",
    "italic": "Cursiva",
    "strike": "Tachado",
    "quote": "Cita",
    "code": "Código",
    "codeBlock": "Bloque de código",
    "ul": "Lista",
    "link": "Enlace",
    "image": "Imagen",
    "table": "Tabla",
    "phBold": "negrita",
    "phItalic": "cursiva",
    "phStrike": "tachado",
    "phLink": "texto del enlace",
    "phImage": "texto alternativo",
    "exportHtml": "Exportar HTML",
    "exportPdf": "Exportar PDF",
    "exportPng": "Exportar imagen",
    "copy": "Copiar Markdown",
    "downloadMd": "Descargar .md",
    "open": "Abrir",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "copied": "Copiado",
    "stats": "{n} líneas · {c} car.",
    "msgEmpty": "Escribe Markdown primero.",
    "msgLib": "No se pudieron cargar las librerías del CDN. Revisa la red.",
    "msgFail": "Error al exportar."
  },
  "pt": {
    "title_page": "Editor Markdown",
    "desc": "Edite Markdown com pré-visualização e exporte HTML, PDF ou imagem. Bibliotecas via CDN, nada é enviado.",
    "edit": "Editar",
    "split": "Dividir",
    "preview": "Pré-visualizar",
    "inputLabel": "Markdown",
    "outputLabel": "Pré-visualização",
    "placeholder": "Escreva Markdown…",
    "bold": "Negrito",
    "italic": "Itálico",
    "strike": "Riscado",
    "quote": "Citação",
    "code": "Código",
    "codeBlock": "Bloco de código",
    "ul": "Lista",
    "link": "Link",
    "image": "Imagem",
    "table": "Tabela",
    "phBold": "negrito",
    "phItalic": "itálico",
    "phStrike": "riscado",
    "phLink": "texto do link",
    "phImage": "texto alternativo",
    "exportHtml": "Exportar HTML",
    "exportPdf": "Exportar PDF",
    "exportPng": "Exportar imagem",
    "copy": "Copiar Markdown",
    "downloadMd": "Baixar .md",
    "open": "Abrir",
    "sample": "Exemplo",
    "clear": "Limpar",
    "copied": "Copiado",
    "stats": "{n} linhas · {c} car.",
    "msgEmpty": "Digite Markdown primeiro.",
    "msgLib": "Não foi possível carregar as bibliotecas do CDN. Verifique a rede.",
    "msgFail": "Falha ao exportar."
  },
  "ru": {
    "title_page": "Редактор Markdown",
    "desc": "Редактируйте Markdown с предпросмотром и экспортируйте HTML, PDF или изображение. Библиотеки с CDN, ничего не загружается на сервер.",
    "edit": "Правка",
    "split": "Разделить",
    "preview": "Просмотр",
    "inputLabel": "Markdown",
    "outputLabel": "Просмотр",
    "placeholder": "Пишите Markdown…",
    "bold": "Жирный",
    "italic": "Курсив",
    "strike": "Зачёркнутый",
    "quote": "Цитата",
    "code": "Код",
    "codeBlock": "Блок кода",
    "ul": "Список",
    "link": "Ссылка",
    "image": "Картинка",
    "table": "Таблица",
    "phBold": "жирный",
    "phItalic": "курсив",
    "phStrike": "зачёркнутый",
    "phLink": "текст ссылки",
    "phImage": "альтернативный текст",
    "exportHtml": "Экспорт HTML",
    "exportPdf": "Экспорт PDF",
    "exportPng": "Экспорт изображения",
    "copy": "Копировать Markdown",
    "downloadMd": "Скачать .md",
    "open": "Открыть",
    "sample": "Пример",
    "clear": "Очистить",
    "copied": "Скопировано",
    "stats": "{n} строк · {c} симв.",
    "msgEmpty": "Сначала введите Markdown.",
    "msgLib": "Не удалось загрузить библиотеки с CDN. Проверьте сеть.",
    "msgFail": "Ошибка экспорта."
  },
  "ar": {
    "title_page": "محرر Markdown",
    "desc": "حرّر Markdown مع معاينة مباشرة وصدر HTML أو PDF أو صورة. المكتبات من CDN ولا يُرفع شيء.",
    "edit": "تحرير",
    "split": "تقسيم",
    "preview": "معاينة",
    "inputLabel": "Markdown",
    "outputLabel": "معاينة",
    "placeholder": "اكتب Markdown…",
    "bold": "عريض",
    "italic": "مائل",
    "strike": "يتوسطه خط",
    "quote": "اقتباس",
    "code": "رمز",
    "codeBlock": "كتلة رمز",
    "ul": "قائمة",
    "link": "رابط",
    "image": "صورة",
    "table": "جدول",
    "phBold": "عريض",
    "phItalic": "مائل",
    "phStrike": "يتوسطه خط",
    "phLink": "نص الرابط",
    "phImage": "نص بديل",
    "exportHtml": "تصدير HTML",
    "exportPdf": "تصدير PDF",
    "exportPng": "تصدير صورة",
    "copy": "نسخ Markdown",
    "downloadMd": "تنزيل .md",
    "open": "فتح",
    "sample": "مثال",
    "clear": "مسح",
    "copied": "تم النسخ",
    "stats": "{n} أسطر · {c} حرفاً",
    "msgEmpty": "أدخل Markdown أولاً.",
    "msgLib": "تعذر تحميل المكتبات من CDN. تحقق من الشبكة.",
    "msgFail": "فشل التصدير."
  },
  "hi": {
    "title_page": "Markdown संपादक",
    "desc": "लाइव पूर्वावलोकन के साथ Markdown लिखें और HTML, PDF या चित्र निर्यात करें। लाइब्रेरी CDN से आती हैं, कुछ अपलोड नहीं होता।",
    "edit": "संपादन",
    "split": "विभाजित",
    "preview": "पूर्वावलोकन",
    "inputLabel": "Markdown",
    "outputLabel": "पूर्वावलोकन",
    "placeholder": "Markdown लिखें…",
    "bold": "मोटा",
    "italic": "तिरछा",
    "strike": "काटा",
    "quote": "उद्धरण",
    "code": "कोड",
    "codeBlock": "कोड ब्लॉक",
    "ul": "सूची",
    "link": "लिंक",
    "image": "चित्र",
    "table": "तालिका",
    "phBold": "मोटा",
    "phItalic": "तिरछा",
    "phStrike": "काटा",
    "phLink": "लिंक पाठ",
    "phImage": "वैकल्पिक पाठ",
    "exportHtml": "HTML निर्यात",
    "exportPdf": "PDF निर्यात",
    "exportPng": "चित्र निर्यात",
    "copy": "Markdown कॉपी",
    "downloadMd": ".md डाउनलोड",
    "open": "खोलें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "copied": "कॉपी हो गया",
    "stats": "{n} पंक्तियाँ · {c} अक्षर",
    "msgEmpty": "पहले Markdown लिखें।",
    "msgLib": "CDN से लाइब्रेरी नहीं मिली। नेटवर्क जाँचें।",
    "msgFail": "निर्यात असफल।"
  },
  "it": {
    "title_page": "Editor Markdown",
    "desc": "Modifica Markdown con anteprima e esporta HTML, PDF o immagine. Librerie da CDN, nulla viene caricato.",
    "edit": "Modifica",
    "split": "Dividi",
    "preview": "Anteprima",
    "inputLabel": "Markdown",
    "outputLabel": "Anteprima",
    "placeholder": "Scrivi Markdown…",
    "bold": "Grassetto",
    "italic": "Corsivo",
    "strike": "Barrato",
    "quote": "Citazione",
    "code": "Codice",
    "codeBlock": "Blocco codice",
    "ul": "Elenco",
    "link": "Link",
    "image": "Immagine",
    "table": "Tabella",
    "phBold": "grassetto",
    "phItalic": "corsivo",
    "phStrike": "barrato",
    "phLink": "testo del link",
    "phImage": "testo alternativo",
    "exportHtml": "Esporta HTML",
    "exportPdf": "Esporta PDF",
    "exportPng": "Esporta immagine",
    "copy": "Copia Markdown",
    "downloadMd": "Scarica .md",
    "open": "Apri",
    "sample": "Esempio",
    "clear": "Svuota",
    "copied": "Copiato",
    "stats": "{n} righe · {c} car.",
    "msgEmpty": "Inserisci prima del Markdown.",
    "msgLib": "Impossibile caricare le librerie CDN. Controlla la rete.",
    "msgFail": "Esportazione non riuscita."
  },
  "nl": {
    "title_page": "Markdown-editor",
    "desc": "Bewerk Markdown met live voorbeeld en exporteer HTML, PDF of een afbeelding. Bibliotheken via CDN, niets wordt geüpload.",
    "edit": "Bewerken",
    "split": "Splitsen",
    "preview": "Voorbeeld",
    "inputLabel": "Markdown",
    "outputLabel": "Voorbeeld",
    "placeholder": "Schrijf Markdown…",
    "bold": "Vet",
    "italic": "Cursief",
    "strike": "Doorhalen",
    "quote": "Citaat",
    "code": "Code",
    "codeBlock": "Codeblok",
    "ul": "Lijst",
    "link": "Link",
    "image": "Afbeelding",
    "table": "Tabel",
    "phBold": "vet",
    "phItalic": "cursief",
    "phStrike": "doorhalen",
    "phLink": "linktekst",
    "phImage": "alt-tekst",
    "exportHtml": "HTML exporteren",
    "exportPdf": "PDF exporteren",
    "exportPng": "Afbeelding exporteren",
    "copy": "Markdown kopiëren",
    "downloadMd": ".md downloaden",
    "open": "Openen",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "copied": "Gekopieerd",
    "stats": "{n} regels · {c} tekens",
    "msgEmpty": "Voer eerst Markdown in.",
    "msgLib": "CDN-bibliotheken konden niet worden geladen. Controleer het netwerk.",
    "msgFail": "Export mislukt."
  },
  "tr": {
    "title_page": "Markdown düzenleyici",
    "desc": "Canlı önizlemeli Markdown yazın; HTML, PDF veya görüntü dışa aktarın. Kitaplıklar CDN’den gelir, hiçbir şey yüklenmez.",
    "edit": "Düzenle",
    "split": "Böl",
    "preview": "Önizleme",
    "inputLabel": "Markdown",
    "outputLabel": "Önizleme",
    "placeholder": "Markdown yazın…",
    "bold": "Kalın",
    "italic": "İtalik",
    "strike": "Üstü çizili",
    "quote": "Alıntı",
    "code": "Kod",
    "codeBlock": "Kod bloğu",
    "ul": "Liste",
    "link": "Bağlantı",
    "image": "Görüntü",
    "table": "Tablo",
    "phBold": "kalın",
    "phItalic": "italik",
    "phStrike": "üstü çizili",
    "phLink": "bağlantı metni",
    "phImage": "alt metin",
    "exportHtml": "HTML dışa aktar",
    "exportPdf": "PDF dışa aktar",
    "exportPng": "Görüntü dışa aktar",
    "copy": "Markdown kopyala",
    "downloadMd": ".md indir",
    "open": "Aç",
    "sample": "Örnek",
    "clear": "Temizle",
    "copied": "Kopyalandı",
    "stats": "{n} satır · {c} karakter",
    "msgEmpty": "Önce Markdown girin.",
    "msgLib": "CDN kitaplıkları yüklenemedi. Ağı kontrol edin.",
    "msgFail": "Dışa aktarma başarısız."
  },
  "vi": {
    "title_page": "Soạn thảo Markdown",
    "desc": "Soạn Markdown với xem trước trực tiếp, xuất HTML, PDF hoặc ảnh dài. Thư viện từ CDN, không tải lên máy chủ.",
    "edit": "Soạn",
    "split": "Chia cột",
    "preview": "Xem trước",
    "inputLabel": "Markdown",
    "outputLabel": "Xem trước",
    "placeholder": "Nhập Markdown…",
    "bold": "Đậm",
    "italic": "Nghiêng",
    "strike": "Gạch ngang",
    "quote": "Trích dẫn",
    "code": "Mã",
    "codeBlock": "Khối mã",
    "ul": "Danh sách",
    "link": "Liên kết",
    "image": "Ảnh",
    "table": "Bảng",
    "phBold": "đậm",
    "phItalic": "nghiêng",
    "phStrike": "gạch ngang",
    "phLink": "chữ liên kết",
    "phImage": "mô tả ảnh",
    "exportHtml": "Xuất HTML",
    "exportPdf": "Xuất PDF",
    "exportPng": "Xuất ảnh",
    "copy": "Sao chép Markdown",
    "downloadMd": "Tải .md",
    "open": "Mở tệp",
    "sample": "Mẫu",
    "clear": "Xóa",
    "copied": "Đã sao chép",
    "stats": "{n} dòng · {c} ký tự",
    "msgEmpty": "Hãy nhập Markdown trước.",
    "msgLib": "Không tải được thư viện CDN. Kiểm tra mạng rồi thử lại.",
    "msgFail": "Xuất thất bại."
  },
  "th": {
    "title_page": "แก้ไข Markdown ออนไลน์",
    "desc": "เขียน Markdown พร้อมดูตัวอย่างสด ส่งออก HTML, PDF หรือรูปยาว ไลบรารีจาก CDN ไม่ได้อัปโหลดข้อมูล",
    "edit": "แก้ไข",
    "split": "แบ่งจอ",
    "preview": "ตัวอย่าง",
    "inputLabel": "Markdown",
    "outputLabel": "ตัวอย่าง",
    "placeholder": "พิมพ์ Markdown…",
    "bold": "ตัวหนา",
    "italic": "ตัวเอียง",
    "strike": "ขีดฆ่า",
    "quote": "อ้างอิง",
    "code": "โค้ด",
    "codeBlock": "บล็อกโค้ด",
    "ul": "รายการ",
    "link": "ลิงก์",
    "image": "รูป",
    "table": "ตาราง",
    "phBold": "ตัวหนา",
    "phItalic": "ตัวเอียง",
    "phStrike": "ขีดฆ่า",
    "phLink": "ข้อความลิงก์",
    "phImage": "ข้อความแทน",
    "exportHtml": "ส่งออก HTML",
    "exportPdf": "ส่งออก PDF",
    "exportPng": "ส่งออกรูป",
    "copy": "คัดลอก Markdown",
    "downloadMd": "ดาวน์โหลด .md",
    "open": "เปิดไฟล์",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "copied": "คัดลอกแล้ว",
    "stats": "{n} บรรทัด · {c} ตัวอักษร",
    "msgEmpty": "กรอก Markdown ก่อน",
    "msgLib": "โหลดไลบรารีจาก CDN ไม่ได้ ตรวจเครือข่ายแล้วลองใหม่",
    "msgFail": "ส่งออกไม่สำเร็จ"
  },
  "id": {
    "title_page": "Editor Markdown",
    "desc": "Tulis Markdown dengan pratinjau langsung, ekspor HTML, PDF, atau gambar. Pustaka dari CDN, tidak ada yang diunggah.",
    "edit": "Edit",
    "split": "Bagi",
    "preview": "Pratinjau",
    "inputLabel": "Markdown",
    "outputLabel": "Pratinjau",
    "placeholder": "Tulis Markdown…",
    "bold": "Tebal",
    "italic": "Miring",
    "strike": "Coret",
    "quote": "Kutipan",
    "code": "Kode",
    "codeBlock": "Blok kode",
    "ul": "Daftar",
    "link": "Tautan",
    "image": "Gambar",
    "table": "Tabel",
    "phBold": "tebal",
    "phItalic": "miring",
    "phStrike": "coret",
    "phLink": "teks tautan",
    "phImage": "teks alt",
    "exportHtml": "Ekspor HTML",
    "exportPdf": "Ekspor PDF",
    "exportPng": "Ekspor gambar",
    "copy": "Salin Markdown",
    "downloadMd": "Unduh .md",
    "open": "Buka",
    "sample": "Contoh",
    "clear": "Hapus",
    "copied": "Disalin",
    "stats": "{n} baris · {c} karakter",
    "msgEmpty": "Masukkan Markdown dulu.",
    "msgLib": "Gagal memuat pustaka CDN. Periksa jaringan.",
    "msgFail": "Ekspor gagal."
  },
  "ms": {
    "title_page": "Editor Markdown",
    "desc": "Tulis Markdown dengan pratonton langsung, eksport HTML, PDF atau imej. Pustaka dari CDN, tiada yang dimuat naik.",
    "edit": "Edit",
    "split": "Pisah",
    "preview": "Pratonton",
    "inputLabel": "Markdown",
    "outputLabel": "Pratonton",
    "placeholder": "Tulis Markdown…",
    "bold": "Tebal",
    "italic": "Condong",
    "strike": "Coret",
    "quote": "Petikan",
    "code": "Kod",
    "codeBlock": "Blok kod",
    "ul": "Senarai",
    "link": "Pautan",
    "image": "Imej",
    "table": "Jadual",
    "phBold": "tebal",
    "phItalic": "condong",
    "phStrike": "coret",
    "phLink": "teks pautan",
    "phImage": "teks alt",
    "exportHtml": "Eksport HTML",
    "exportPdf": "Eksport PDF",
    "exportPng": "Eksport imej",
    "copy": "Salin Markdown",
    "downloadMd": "Muat turun .md",
    "open": "Buka",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "copied": "Disalin",
    "stats": "{n} baris · {c} aksara",
    "msgEmpty": "Masukkan Markdown dahulu.",
    "msgLib": "Tidak dapat memuatkan pustaka CDN. Semak rangkaian.",
    "msgFail": "Eksport gagal."
  },
  "pl": {
    "title_page": "Edytor Markdown",
    "desc": "Edytuj Markdown z podglądem i eksportuj HTML, PDF lub obraz. Biblioteki z CDN, nic nie jest wysyłane.",
    "edit": "Edycja",
    "split": "Podział",
    "preview": "Podgląd",
    "inputLabel": "Markdown",
    "outputLabel": "Podgląd",
    "placeholder": "Pisz Markdown…",
    "bold": "Pogrubienie",
    "italic": "Kursywa",
    "strike": "Przekreślenie",
    "quote": "Cytat",
    "code": "Kod",
    "codeBlock": "Blok kodu",
    "ul": "Lista",
    "link": "Link",
    "image": "Obraz",
    "table": "Tabela",
    "phBold": "pogrubienie",
    "phItalic": "kursywa",
    "phStrike": "przekreślenie",
    "phLink": "tekst linku",
    "phImage": "tekst alternatywny",
    "exportHtml": "Eksportuj HTML",
    "exportPdf": "Eksportuj PDF",
    "exportPng": "Eksportuj obraz",
    "copy": "Kopiuj Markdown",
    "downloadMd": "Pobierz .md",
    "open": "Otwórz",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "copied": "Skopiowano",
    "stats": "{n} wierszy · {c} znaków",
    "msgEmpty": "Najpierw wpisz Markdown.",
    "msgLib": "Nie udało się wczytać bibliotek CDN. Sprawdź sieć.",
    "msgFail": "Eksport nie powiódł się."
  },
  "uk": {
    "title_page": "Редактор Markdown",
    "desc": "Редагуйте Markdown з переглядом і експортуйте HTML, PDF або зображення. Бібліотеки з CDN, нічого не надсилається.",
    "edit": "Редагування",
    "split": "Поділ",
    "preview": "Перегляд",
    "inputLabel": "Markdown",
    "outputLabel": "Перегляд",
    "placeholder": "Пишіть Markdown…",
    "bold": "Жирний",
    "italic": "Курсив",
    "strike": "Закреслений",
    "quote": "Цитата",
    "code": "Код",
    "codeBlock": "Блок коду",
    "ul": "Список",
    "link": "Посилання",
    "image": "Зображення",
    "table": "Таблиця",
    "phBold": "жирний",
    "phItalic": "курсив",
    "phStrike": " закреслений",
    "phLink": "текст посилання",
    "phImage": "альтернативний текст",
    "exportHtml": "Експорт HTML",
    "exportPdf": "Експорт PDF",
    "exportPng": "Експорт зображення",
    "copy": "Копіювати Markdown",
    "downloadMd": "Завантажити .md",
    "open": "Відкрити",
    "sample": "Приклад",
    "clear": "Очистити",
    "copied": "Скопійовано",
    "stats": "{n} рядків · {c} символів",
    "msgEmpty": "Спочатку введіть Markdown.",
    "msgLib": "Не вдалося завантажити бібліотеки з CDN. Перевірте мережу.",
    "msgFail": "Помилка експорту."
  },
  "sv": {
    "title_page": "Markdown-redigerare",
    "desc": "Redigera Markdown med liveförhandsvisning och exportera HTML, PDF eller bild. Bibliotek via CDN, inget laddas upp.",
    "edit": "Redigera",
    "split": "Dela",
    "preview": "Förhandsvisa",
    "inputLabel": "Markdown",
    "outputLabel": "Förhandsvisning",
    "placeholder": "Skriv Markdown…",
    "bold": "Fet",
    "italic": "Kursiv",
    "strike": "Genomstruken",
    "quote": "Citat",
    "code": "Kod",
    "codeBlock": "Kodblock",
    "ul": "Lista",
    "link": "Länk",
    "image": "Bild",
    "table": "Tabell",
    "phBold": "fet",
    "phItalic": "kursiv",
    "phStrike": "genomstruken",
    "phLink": "länktext",
    "phImage": "alt-text",
    "exportHtml": "Exportera HTML",
    "exportPdf": "Exportera PDF",
    "exportPng": "Exportera bild",
    "copy": "Kopiera Markdown",
    "downloadMd": "Ladda ner .md",
    "open": "Öppna",
    "sample": "Exempel",
    "clear": "Rensa",
    "copied": "Kopierat",
    "stats": "{n} rader · {c} tecken",
    "msgEmpty": "Skriv Markdown först.",
    "msgLib": "Kunde inte ladda CDN-bibliotek. Kontrollera nätverket.",
    "msgFail": "Exporten misslyckades."
  },
  "zh-TW": {
    "title_page": "Markdown 線上編輯",
    "desc": "在瀏覽器編輯 Markdown 並即時預覽，可匯出 HTML、PDF 與長圖。渲染與匯出庫從 CDN 載入，資料不會上傳。",
    "edit": "編輯",
    "split": "分欄",
    "preview": "預覽",
    "inputLabel": "Markdown",
    "outputLabel": "預覽",
    "placeholder": "輸入 Markdown…",
    "bold": "粗體",
    "italic": "斜體",
    "strike": "刪除線",
    "quote": "引用",
    "code": "程式碼",
    "codeBlock": "程式碼區塊",
    "ul": "清單",
    "link": "連結",
    "image": "圖片",
    "table": "表格",
    "phBold": "粗體",
    "phItalic": "斜體",
    "phStrike": "刪除線",
    "phLink": "連結文字",
    "phImage": "圖片說明",
    "exportHtml": "匯出 HTML",
    "exportPdf": "匯出 PDF",
    "exportPng": "匯出圖片",
    "copy": "複製 Markdown",
    "downloadMd": "下載 .md",
    "open": "開啟檔案",
    "sample": "範例",
    "clear": "清空",
    "copied": "已複製",
    "stats": "{n} 行 · {c} 字元",
    "msgEmpty": "請先輸入 Markdown。",
    "msgLib": "無法從 CDN 載入所需庫，請檢查網路後重試。",
    "msgFail": "匯出失敗。"
  }
}
</i18n>
