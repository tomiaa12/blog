<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import { copyToClipboard } from "@/utils"
import { getSvgo } from "./loadSvgo"

const { t } = useI18n()

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <!-- sample icon -->
  <title>Sample</title>
  <rect width="240" height="240" rx="40" fill="#438edb"/>
  <circle cx="120" cy="96" r="36" fill="#ffffff"/>
  <path d="M56 188c12-36 40-52 64-52s52 16 64 52" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
</svg>
`

const originalSvg = ref("")
const svgCode = ref("")
const pasteText = ref("")
const fileName = ref("image")
const previewUrl = ref("")
const running = ref(false)
const loaded = computed(() => !!originalSvg.value)

const multipass = ref(true)
const pretty = ref(false)
const removeComments = ref(true)
const removeMetadata = ref(true)
const removeHidden = ref(true)
const cleanupIds = ref(true)
const convertColors = ref(true)
const collapseGroups = ref(true)
const keepViewBox = ref(true)
const precision = ref(3)

const editW = ref("")
const editH = ref("")
const editViewBox = ref("")
const fillFrom = ref("#438edb")
const fillTo = ref("#111111")
const pngEdge = ref(512)

const origBytes = computed(() => byteLen(originalSvg.value))
const curBytes = computed(() => byteLen(svgCode.value))
const savedPct = computed(() => {
  if (!origBytes.value) return 0
  return Math.round((1 - curBytes.value / origBytes.value) * 1000) / 10
})

function byteLen(text: string) {
  return new TextEncoder().encode(text).length
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  return `${(n / 1024).toFixed(2)} KB`
}

function revoke(url: string) {
  if (url) URL.revokeObjectURL(url)
}

function parseSvg(text: string) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml")
  if (doc.querySelector("parsererror")) return null
  if (doc.documentElement.nodeName.toLowerCase() !== "svg") return null
  return doc
}

function serializeSvg(doc: Document) {
  return new XMLSerializer().serializeToString(doc)
}

function isSvgFile(file: File) {
  const name = file.name.toLowerCase()
  return file.type === "image/svg+xml" || name.endsWith(".svg")
}

function applySource(text: string, name = "image") {
  const trimmed = text.trim()
  if (!trimmed) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return false
  }
  if (!parseSvg(trimmed)) {
    ElMessage({ message: t("msgNotSvg"), type: "warning" })
    return false
  }
  originalSvg.value = trimmed
  svgCode.value = trimmed
  fileName.value = name.replace(/\.[^.]+$/, "") || "image"
  syncEditFields(trimmed)
  return true
}

function syncEditFields(text: string) {
  const doc = parseSvg(text)
  if (!doc) return
  const root = doc.documentElement
  editW.value = root.getAttribute("width") || ""
  editH.value = root.getAttribute("height") || ""
  editViewBox.value = root.getAttribute("viewBox") || ""
}

function svgSize(text: string) {
  const doc = parseSvg(text)
  if (!doc) return { w: 512, h: 512 }
  const root = doc.documentElement
  const w = parseFloat(root.getAttribute("width") || "")
  const h = parseFloat(root.getAttribute("height") || "")
  if (w > 0 && h > 0) return { w, h }
  const vb = (root.getAttribute("viewBox") || "").trim().split(/[\s,]+/)
  if (vb.length === 4) {
    const vw = parseFloat(vb[2] || "")
    const vh = parseFloat(vb[3] || "")
    if (vw > 0 && vh > 0) return { w: vw, h: vh }
  }
  return { w: 512, h: 512 }
}

async function pickFile(files: File[]) {
  const file = files.find(isSvgFile)
  if (!file) {
    ElMessage({ message: t("msgNotSvg"), type: "warning" })
    return
  }
  try {
    applySource(await file.text(), file.name)
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

function loadPaste() {
  applySource(pasteText.value, "pasted")
}

function loadSample() {
  applySource(SAMPLE, "sample")
}

function reset() {
  originalSvg.value = ""
  svgCode.value = ""
  pasteText.value = ""
  fileName.value = "image"
  revoke(previewUrl.value)
  previewUrl.value = ""
}

function pluginOrOff(on: boolean) {
  return on ? {} : false
}

async function runOptimize(formatOnly = false) {
  if (!svgCode.value.trim()) return
  running.value = true
  try {
    const { optimize } = await getSvgo()
    const result = formatOnly
      ? optimize(svgCode.value, {
          plugins: [],
          js2svg: { pretty: true, indent: 2 },
        })
      : optimize(svgCode.value, {
          multipass: multipass.value,
          js2svg: pretty.value
            ? { pretty: true, indent: 2 }
            : { pretty: false },
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: !keepViewBox.value,
                  removeComments: pluginOrOff(removeComments.value),
                  removeMetadata: pluginOrOff(removeMetadata.value),
                  removeHiddenElems: pluginOrOff(removeHidden.value),
                  cleanupIds: pluginOrOff(cleanupIds.value),
                  convertColors: pluginOrOff(convertColors.value),
                  collapseGroups: pluginOrOff(collapseGroups.value),
                  convertPathData: { floatPrecision: precision.value },
                  cleanupNumericValues: { floatPrecision: precision.value },
                },
              },
            },
          ],
        })
    if (!result?.data || !parseSvg(result.data)) throw new Error("svgo")
    svgCode.value = result.data
    syncEditFields(result.data)
    ElMessage({
      message: formatOnly ? t("msgFormatted") : t("msgOptimized"),
      type: "success",
    })
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

function restore() {
  svgCode.value = originalSvg.value
  syncEditFields(originalSvg.value)
  ElMessage({ message: t("msgRestored"), type: "success" })
}

function mutateRoot(fn: (root: SVGSVGElement) => void) {
  const doc = parseSvg(svgCode.value)
  if (!doc) {
    ElMessage({ message: t("msgNotSvg"), type: "warning" })
    return
  }
  fn(doc.documentElement as unknown as SVGSVGElement)
  svgCode.value = serializeSvg(doc)
  syncEditFields(svgCode.value)
  ElMessage({ message: t("msgApplied"), type: "success" })
}

function applySize() {
  mutateRoot(root => {
    if (editW.value.trim()) root.setAttribute("width", editW.value.trim())
    else root.removeAttribute("width")
    if (editH.value.trim()) root.setAttribute("height", editH.value.trim())
    else root.removeAttribute("height")
    if (editViewBox.value.trim())
      root.setAttribute("viewBox", editViewBox.value.trim())
    else root.removeAttribute("viewBox")
  })
}

function normColor(c: string) {
  return c.trim().toLowerCase()
}

function replaceFills(all: boolean) {
  const to = fillTo.value.trim()
  if (!to) return
  const from = normColor(fillFrom.value)
  mutateRoot(root => {
    const nodes = root.querySelectorAll("[fill], [stroke], [style]")
    const list = [root, ...Array.from(nodes)]
    for (const node of list) {
      const el = node as Element
      for (const attr of ["fill", "stroke"] as const) {
        const cur = el.getAttribute(attr)
        if (!cur || cur === "none") continue
        if (all || normColor(cur) === from) el.setAttribute(attr, to)
      }
      const style = el.getAttribute("style")
      if (!style) continue
      el.setAttribute(
        "style",
        style.replace(
          /(fill|stroke)\s*:\s*([^;]+)/gi,
          (full, prop: string, val: string) => {
            const v = val.trim()
            if (v === "none") return full
            if (all || normColor(v) === from) return `${prop}:${to}`
            return full
          }
        )
      )
    }
  })
}

function downloadSvg() {
  const blob = new Blob([svgCode.value], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${fileName.value}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

async function copySvg() {
  await copyToClipboard(svgCode.value)
  ElMessage({ message: t("msgCopied"), type: "success" })
}

function downloadPng() {
  const img = new Image()
  img.onload = () => {
    const { w, h } = svgSize(svgCode.value)
    const scale = pngEdge.value / Math.max(w, h)
    const cw = Math.max(1, Math.round(w * scale))
    const ch = Math.max(1, Math.round(h * scale))
    const canvas = document.createElement("canvas")
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(img, 0, 0, cw, ch)
    canvas.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName.value}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, "image/png")
  }
  img.onerror = () => ElMessage({ message: t("msgFail"), type: "error" })
  img.src = previewUrl.value
}

watch(svgCode, code => {
  revoke(previewUrl.value)
  if (!code.trim()) {
    previewUrl.value = ""
    return
  }
  previewUrl.value = URL.createObjectURL(
    new Blob([code], { type: "image/svg+xml" })
  )
})

onUnmounted(() => revoke(previewUrl.value))
</script>

<template>
  <div class="svg-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <template v-if="!loaded">
      <FileUpload
        :multiple="false"
        :folder="false"
        accept="image/svg+xml,.svg"
        @files-added="pickFile"
      />
      <div class="paste-box">
        <h2 class="sub">{{ t("pasteTitle") }}</h2>
        <el-input
          v-model="pasteText"
          type="textarea"
          :rows="8"
          :placeholder="t('pastePlaceholder')"
        />
        <div class="paste-actions">
          <el-button
            type="primary"
            @click="loadPaste"
          >
            {{ t("loadPaste") }}
          </el-button>
          <el-button @click="loadSample">{{ t("useSample") }}</el-button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="toolbar">
        <el-button @click="reset">{{ t("reselect") }}</el-button>
        <el-button
          type="primary"
          :loading="running"
          @click="runOptimize(false)"
        >
          {{ t("optimize") }}
        </el-button>
        <el-button
          :loading="running"
          @click="runOptimize(true)"
        >
          {{ t("format") }}
        </el-button>
        <el-button @click="restore">{{ t("restore") }}</el-button>
        <el-button @click="copySvg">{{ t("copy") }}</el-button>
        <el-button @click="downloadSvg">{{ t("download") }}</el-button>
        <el-button @click="downloadPng">{{ t("downloadPng") }}</el-button>
        <span class="meta">
          {{ t("original") }} {{ formatBytes(origBytes) }}
          → {{ t("current") }} {{ formatBytes(curBytes) }}
          <template v-if="savedPct > 0">（{{ t("saved") }} {{ savedPct }}%）</template>
        </span>
      </div>

      <div class="work">
        <div class="preview-wrap">
          <div class="preview-host">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt=""
            >
          </div>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("optTitle") }}</h2>
          <el-checkbox v-model="multipass">{{ t("multipass") }}</el-checkbox>
          <el-checkbox v-model="pretty">{{ t("pretty") }}</el-checkbox>
          <el-checkbox v-model="removeComments">{{ t("removeComments") }}</el-checkbox>
          <el-checkbox v-model="removeMetadata">{{ t("removeMetadata") }}</el-checkbox>
          <el-checkbox v-model="removeHidden">{{ t("removeHidden") }}</el-checkbox>
          <el-checkbox v-model="cleanupIds">{{ t("cleanupIds") }}</el-checkbox>
          <el-checkbox v-model="convertColors">{{ t("convertColors") }}</el-checkbox>
          <el-checkbox v-model="collapseGroups">{{ t("collapseGroups") }}</el-checkbox>
          <el-checkbox v-model="keepViewBox">{{ t("keepViewBox") }}</el-checkbox>
          <div class="row">
            <span class="label">{{ t("precision") }}</span>
            <el-input-number
              v-model="precision"
              :min="1"
              :max="8"
              :step="1"
              controls-position="right"
            />
          </div>
          <p class="hint">{{ t("hint") }}</p>

          <h2 class="sub">{{ t("editTitle") }}</h2>
          <div class="row">
            <span class="label">{{ t("width") }}</span>
            <el-input
              v-model="editW"
              size="small"
            />
          </div>
          <div class="row">
            <span class="label">{{ t("height") }}</span>
            <el-input
              v-model="editH"
              size="small"
            />
          </div>
          <div class="row">
            <span class="label">{{ t("viewBox") }}</span>
            <el-input
              v-model="editViewBox"
              size="small"
            />
          </div>
          <el-button
            size="small"
            @click="applySize"
          >
            {{ t("applySize") }}
          </el-button>

          <div class="color-row">
            <el-color-picker v-model="fillFrom" />
            <span class="arrow">→</span>
            <el-color-picker v-model="fillTo" />
          </div>
          <div class="chips">
            <el-button
              size="small"
              @click="replaceFills(false)"
            >
              {{ t("replaceFill") }}
            </el-button>
            <el-button
              size="small"
              @click="replaceFills(true)"
            >
              {{ t("allFills") }}
            </el-button>
          </div>

          <h2 class="sub">{{ t("pngSize") }}</h2>
          <div class="chips">
            <el-button
              v-for="n in [256, 512, 1024, 2048]"
              :key="n"
              size="small"
              :type="pngEdge === n ? 'primary' : 'default'"
              @click="pngEdge = n"
            >
              {{ n }}px
            </el-button>
          </div>
        </div>
      </div>

      <h2 class="sub code-title">{{ t("codeTitle") }}</h2>
      <el-input
        v-model="svgCode"
        type="textarea"
        :rows="14"
        class="code-input"
        @change="syncEditFields(svgCode)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.svg-page {
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

.paste-box {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.paste-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.work {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 800px) {
  .work {
    grid-template-columns: 1fr;
  }
}

.preview-wrap {
  min-height: 360px;
  height: min(62vh, 520px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.preview-host {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(45deg, var(--vp-c-bg) 25%, transparent 25%) 0 0 / 16px 16px,
    linear-gradient(-45deg, var(--vp-c-bg) 25%, transparent 25%) 0 8px / 16px 16px;
  background-color: var(--vp-c-bg-soft);
}

.preview-host img {
  display: block;
  max-width: 92%;
  max-height: 92%;
  object-fit: contain;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub {
  margin: 8px 0 4px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.code-title {
  margin-top: 20px;
}

.hint {
  margin: 4px 0 8px;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--vp-c-text-3);
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  flex: 0 0 72px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.arrow {
  color: var(--vp-c-text-3);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.code-input {
  :deep(textarea) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "SVG 编辑优化",
    "desc": "上传或粘贴 SVG，用 SVGO 压缩体积，调整宽高、颜色和 viewBox，再下载 SVG 或 PNG。处理都在浏览器本地完成。",
    "pasteTitle": "粘贴 SVG 代码",
    "pastePlaceholder": "把 SVG 源码粘贴到这里…",
    "loadPaste": "载入代码",
    "useSample": "使用示例",
    "reselect": "换一个",
    "optimize": "优化压缩",
    "format": "美化格式",
    "restore": "恢复原文",
    "copy": "复制代码",
    "download": "下载 SVG",
    "downloadPng": "下载 PNG",
    "original": "原始",
    "current": "当前",
    "saved": "节省",
    "optTitle": "优化选项",
    "editTitle": "尺寸与颜色",
    "codeTitle": "SVG 源码",
    "multipass": "多轮优化",
    "pretty": "保留缩进",
    "removeComments": "删除注释",
    "removeMetadata": "删除元数据",
    "removeHidden": "删除隐藏元素",
    "cleanupIds": "清理 ID",
    "convertColors": "压缩颜色",
    "collapseGroups": "合并分组",
    "keepViewBox": "保留 viewBox",
    "precision": "小数精度",
    "width": "宽度",
    "height": "高度",
    "viewBox": "viewBox",
    "applySize": "应用尺寸",
    "replaceFill": "替换所选色",
    "allFills": "替换全部填色",
    "pngSize": "PNG 长边",
    "hint": "首次优化会从 CDN 加载 SVGO，之后可反复压缩。建议先备份原文。",
    "msgNotSvg": "请选择或粘贴有效的 SVG。",
    "msgEmpty": "请先粘贴 SVG 代码。",
    "msgFail": "处理失败，请检查 SVG 或稍后重试。",
    "msgCopied": "已复制到剪贴板。",
    "msgOptimized": "优化完成。",
    "msgFormatted": "已美化格式。",
    "msgRestored": "已恢复原文。",
    "msgApplied": "已应用到源码。"
  },
  "zh-CN": {
    "title_page": "SVG 编辑优化",
    "desc": "上传或粘贴 SVG，用 SVGO 压缩体积，调整宽高、颜色和 viewBox，再下载 SVG 或 PNG。处理都在浏览器本地完成。",
    "pasteTitle": "粘贴 SVG 代码",
    "pastePlaceholder": "把 SVG 源码粘贴到这里…",
    "loadPaste": "载入代码",
    "useSample": "使用示例",
    "reselect": "换一个",
    "optimize": "优化压缩",
    "format": "美化格式",
    "restore": "恢复原文",
    "copy": "复制代码",
    "download": "下载 SVG",
    "downloadPng": "下载 PNG",
    "original": "原始",
    "current": "当前",
    "saved": "节省",
    "optTitle": "优化选项",
    "editTitle": "尺寸与颜色",
    "codeTitle": "SVG 源码",
    "multipass": "多轮优化",
    "pretty": "保留缩进",
    "removeComments": "删除注释",
    "removeMetadata": "删除元数据",
    "removeHidden": "删除隐藏元素",
    "cleanupIds": "清理 ID",
    "convertColors": "压缩颜色",
    "collapseGroups": "合并分组",
    "keepViewBox": "保留 viewBox",
    "precision": "小数精度",
    "width": "宽度",
    "height": "高度",
    "viewBox": "viewBox",
    "applySize": "应用尺寸",
    "replaceFill": "替换所选色",
    "allFills": "替换全部填色",
    "pngSize": "PNG 长边",
    "hint": "首次优化会从 CDN 加载 SVGO，之后可反复压缩。建议先备份原文。",
    "msgNotSvg": "请选择或粘贴有效的 SVG。",
    "msgEmpty": "请先粘贴 SVG 代码。",
    "msgFail": "处理失败，请检查 SVG 或稍后重试。",
    "msgCopied": "已复制到剪贴板。",
    "msgOptimized": "优化完成。",
    "msgFormatted": "已美化格式。",
    "msgRestored": "已恢复原文。",
    "msgApplied": "已应用到源码。"
  },
  "en": {
    "title_page": "SVG editor & optimizer",
    "desc": "Upload or paste SVG, compress it with SVGO, tweak size, colors, and viewBox, then download SVG or PNG. Everything stays in your browser.",
    "pasteTitle": "Paste SVG code",
    "pastePlaceholder": "Paste SVG source here…",
    "loadPaste": "Load code",
    "useSample": "Use sample",
    "reselect": "Choose another",
    "optimize": "Optimize",
    "format": "Pretty print",
    "restore": "Restore original",
    "copy": "Copy code",
    "download": "Download SVG",
    "downloadPng": "Download PNG",
    "original": "Original",
    "current": "Current",
    "saved": "Saved",
    "optTitle": "Optimize options",
    "editTitle": "Size & color",
    "codeTitle": "SVG source",
    "multipass": "Multipass",
    "pretty": "Keep indentation",
    "removeComments": "Remove comments",
    "removeMetadata": "Remove metadata",
    "removeHidden": "Remove hidden elements",
    "cleanupIds": "Clean up IDs",
    "convertColors": "Minify colors",
    "collapseGroups": "Collapse groups",
    "keepViewBox": "Keep viewBox",
    "precision": "Decimals",
    "width": "Width",
    "height": "Height",
    "viewBox": "viewBox",
    "applySize": "Apply size",
    "replaceFill": "Replace selected color",
    "allFills": "Replace all fills",
    "pngSize": "PNG long edge",
    "hint": "SVGO is loaded from a CDN on first optimize. Keep a copy of the original if you need it.",
    "msgNotSvg": "Please choose or paste a valid SVG.",
    "msgEmpty": "Paste SVG code first.",
    "msgFail": "Something went wrong. Check the SVG and try again.",
    "msgCopied": "Copied to clipboard.",
    "msgOptimized": "Optimization complete.",
    "msgFormatted": "Formatted.",
    "msgRestored": "Original restored.",
    "msgApplied": "Applied to source."
  },
  "ja": {
    "title_page": "SVG 編集・最適化",
    "desc": "SVG をアップロードまたは貼り付け、SVGO で圧縮し、サイズ・色・viewBox を調整して SVG または PNG で保存します。処理はブラウザ内で完結します。",
    "pasteTitle": "SVG コードを貼り付け",
    "pastePlaceholder": "SVG ソースをここに貼り付け…",
    "loadPaste": "コードを読み込む",
    "useSample": "サンプルを使う",
    "reselect": "別のファイル",
    "optimize": "最適化",
    "format": "整形",
    "restore": "元に戻す",
    "copy": "コードをコピー",
    "download": "SVG をダウンロード",
    "downloadPng": "PNG をダウンロード",
    "original": "元",
    "current": "現在",
    "saved": "削減",
    "optTitle": "最適化オプション",
    "editTitle": "サイズと色",
    "codeTitle": "SVG ソース",
    "multipass": "複数パス",
    "pretty": "インデントを残す",
    "removeComments": "コメントを削除",
    "removeMetadata": "メタデータを削除",
    "removeHidden": "非表示要素を削除",
    "cleanupIds": "ID を整理",
    "convertColors": "色を圧縮",
    "collapseGroups": "グループを統合",
    "keepViewBox": "viewBox を保持",
    "precision": "小数桁",
    "width": "幅",
    "height": "高さ",
    "viewBox": "viewBox",
    "applySize": "サイズを適用",
    "replaceFill": "選択色を置換",
    "allFills": "塗りをすべて置換",
    "pngSize": "PNG 長辺",
    "hint": "初回の最適化で CDN から SVGO を読み込みます。必要なら元データを残してください。",
    "msgNotSvg": "有効な SVG を選択または貼り付けてください。",
    "msgEmpty": "先に SVG コードを貼り付けてください。",
    "msgFail": "処理に失敗しました。SVG を確認して再試行してください。",
    "msgCopied": "クリップボードにコピーしました。",
    "msgOptimized": "最適化が完了しました。",
    "msgFormatted": "整形しました。",
    "msgRestored": "元の内容に戻しました。",
    "msgApplied": "ソースに適用しました。"
  },
  "ko": {
    "title_page": "SVG 편집·최적화",
    "desc": "SVG를 올리거나 붙여넣고 SVGO로 압축한 뒤 크기, 색, viewBox를 조정해 SVG 또는 PNG로 받습니다. 모든 처리는 브라우저에서 이루어집니다.",
    "pasteTitle": "SVG 코드 붙여넣기",
    "pastePlaceholder": "SVG 소스를 여기에 붙여넣으세요…",
    "loadPaste": "코드 불러오기",
    "useSample": "샘플 사용",
    "reselect": "다른 파일",
    "optimize": "최적화",
    "format": "예쁘게 정렬",
    "restore": "원본 복원",
    "copy": "코드 복사",
    "download": "SVG 다운로드",
    "downloadPng": "PNG 다운로드",
    "original": "원본",
    "current": "현재",
    "saved": "절감",
    "optTitle": "최적화 옵션",
    "editTitle": "크기와 색",
    "codeTitle": "SVG 소스",
    "multipass": "다중 패스",
    "pretty": "들여쓰기 유지",
    "removeComments": "주석 제거",
    "removeMetadata": "메타데이터 제거",
    "removeHidden": "숨겨진 요소 제거",
    "cleanupIds": "ID 정리",
    "convertColors": "색 압축",
    "collapseGroups": "그룹 병합",
    "keepViewBox": "viewBox 유지",
    "precision": "소수 자릿수",
    "width": "너비",
    "height": "높이",
    "viewBox": "viewBox",
    "applySize": "크기 적용",
    "replaceFill": "선택한 색 바꾸기",
    "allFills": "모든 채우기 바꾸기",
    "pngSize": "PNG 긴 변",
    "hint": "처음 최적화할 때 CDN에서 SVGO를 불러옵니다. 필요하면 원본을 보관하세요.",
    "msgNotSvg": "유효한 SVG를 선택하거나 붙여넣으세요.",
    "msgEmpty": "먼저 SVG 코드를 붙여넣으세요.",
    "msgFail": "처리에 실패했습니다. SVG를 확인하고 다시 시도하세요.",
    "msgCopied": "클립보드에 복사했습니다.",
    "msgOptimized": "최적화가 완료되었습니다.",
    "msgFormatted": "정렬했습니다.",
    "msgRestored": "원본을 복원했습니다.",
    "msgApplied": "소스에 적용했습니다."
  },
  "fr": {
    "title_page": "Éditeur et optimiseur SVG",
    "desc": "Importez ou collez un SVG, compressez-le avec SVGO, ajustez taille, couleurs et viewBox, puis téléchargez en SVG ou PNG. Tout reste dans le navigateur.",
    "pasteTitle": "Coller le code SVG",
    "pastePlaceholder": "Collez le source SVG ici…",
    "loadPaste": "Charger le code",
    "useSample": "Utiliser l’exemple",
    "reselect": "Choisir un autre",
    "optimize": "Optimiser",
    "format": "Indentation",
    "restore": "Restaurer l’original",
    "copy": "Copier le code",
    "download": "Télécharger SVG",
    "downloadPng": "Télécharger PNG",
    "original": "Original",
    "current": "Actuel",
    "saved": "Économisé",
    "optTitle": "Options d’optimisation",
    "editTitle": "Taille et couleur",
    "codeTitle": "Source SVG",
    "multipass": "Plusieurs passes",
    "pretty": "Garder l’indentation",
    "removeComments": "Supprimer les commentaires",
    "removeMetadata": "Supprimer les métadonnées",
    "removeHidden": "Supprimer les éléments cachés",
    "cleanupIds": "Nettoyer les ID",
    "convertColors": "Minifier les couleurs",
    "collapseGroups": "Fusionner les groupes",
    "keepViewBox": "Conserver viewBox",
    "precision": "Décimales",
    "width": "Largeur",
    "height": "Hauteur",
    "viewBox": "viewBox",
    "applySize": "Appliquer la taille",
    "replaceFill": "Remplacer la couleur",
    "allFills": "Remplacer tous les fonds",
    "pngSize": "Grand côté PNG",
    "hint": "SVGO est chargé depuis un CDN à la première optimisation. Conservez l’original si besoin.",
    "msgNotSvg": "Choisissez ou collez un SVG valide.",
    "msgEmpty": "Collez d’abord le code SVG.",
    "msgFail": "Échec du traitement. Vérifiez le SVG et réessayez.",
    "msgCopied": "Copié dans le presse-papiers.",
    "msgOptimized": "Optimisation terminée.",
    "msgFormatted": "Formaté.",
    "msgRestored": "Original restauré.",
    "msgApplied": "Appliqué à la source."
  },
  "de": {
    "title_page": "SVG bearbeiten und optimieren",
    "desc": "SVG hochladen oder einfügen, mit SVGO komprimieren, Größe, Farben und viewBox anpassen, dann als SVG oder PNG speichern. Alles bleibt im Browser.",
    "pasteTitle": "SVG-Code einfügen",
    "pastePlaceholder": "SVG-Quelle hier einfügen…",
    "loadPaste": "Code laden",
    "useSample": "Beispiel verwenden",
    "reselect": "Andere Datei",
    "optimize": "Optimieren",
    "format": "Einrücken",
    "restore": "Original wiederherstellen",
    "copy": "Code kopieren",
    "download": "SVG herunterladen",
    "downloadPng": "PNG herunterladen",
    "original": "Original",
    "current": "Aktuell",
    "saved": "Gespart",
    "optTitle": "Optimierungsoptionen",
    "editTitle": "Größe und Farbe",
    "codeTitle": "SVG-Quelle",
    "multipass": "Mehrere Durchläufe",
    "pretty": "Einrückung behalten",
    "removeComments": "Kommentare entfernen",
    "removeMetadata": "Metadaten entfernen",
    "removeHidden": "Versteckte Elemente entfernen",
    "cleanupIds": "IDs bereinigen",
    "convertColors": "Farben kürzen",
    "collapseGroups": "Gruppen zusammenfassen",
    "keepViewBox": "viewBox behalten",
    "precision": "Dezimalstellen",
    "width": "Breite",
    "height": "Höhe",
    "viewBox": "viewBox",
    "applySize": "Größe anwenden",
    "replaceFill": "Gewählte Farbe ersetzen",
    "allFills": "Alle Füllungen ersetzen",
    "pngSize": "PNG-Längsseite",
    "hint": "SVGO wird beim ersten Optimieren per CDN geladen. Bewahren Sie das Original bei Bedarf auf.",
    "msgNotSvg": "Bitte eine gültige SVG wählen oder einfügen.",
    "msgEmpty": "Bitte zuerst SVG-Code einfügen.",
    "msgFail": "Verarbeitung fehlgeschlagen. SVG prüfen und erneut versuchen.",
    "msgCopied": "In die Zwischenablage kopiert.",
    "msgOptimized": "Optimierung abgeschlossen.",
    "msgFormatted": "Formatiert.",
    "msgRestored": "Original wiederhergestellt.",
    "msgApplied": "Auf die Quelle angewendet."
  },
  "es": {
    "title_page": "Editor y optimizador SVG",
    "desc": "Sube o pega un SVG, comprímelo con SVGO, ajusta tamaño, colores y viewBox, y descarga SVG o PNG. Todo ocurre en el navegador.",
    "pasteTitle": "Pegar código SVG",
    "pastePlaceholder": "Pega el origen SVG aquí…",
    "loadPaste": "Cargar código",
    "useSample": "Usar ejemplo",
    "reselect": "Elegir otro",
    "optimize": "Optimizar",
    "format": "Indentar",
    "restore": "Restaurar original",
    "copy": "Copiar código",
    "download": "Descargar SVG",
    "downloadPng": "Descargar PNG",
    "original": "Original",
    "current": "Actual",
    "saved": "Ahorrado",
    "optTitle": "Opciones de optimización",
    "editTitle": "Tamaño y color",
    "codeTitle": "Origen SVG",
    "multipass": "Varias pasadas",
    "pretty": "Conservar sangría",
    "removeComments": "Quitar comentarios",
    "removeMetadata": "Quitar metadatos",
    "removeHidden": "Quitar elementos ocultos",
    "cleanupIds": "Limpiar ID",
    "convertColors": "Minificar colores",
    "collapseGroups": "Fusionar grupos",
    "keepViewBox": "Conservar viewBox",
    "precision": "Decimales",
    "width": "Ancho",
    "height": "Alto",
    "viewBox": "viewBox",
    "applySize": "Aplicar tamaño",
    "replaceFill": "Reemplazar color",
    "allFills": "Reemplazar todos los rellenos",
    "pngSize": "Lado largo PNG",
    "hint": "SVGO se carga desde un CDN en la primera optimización. Conserva el original si lo necesitas.",
    "msgNotSvg": "Elige o pega un SVG válido.",
    "msgEmpty": "Pega primero el código SVG.",
    "msgFail": "Error al procesar. Revisa el SVG e inténtalo de nuevo.",
    "msgCopied": "Copiado al portapapeles.",
    "msgOptimized": "Optimización completada.",
    "msgFormatted": "Formateado.",
    "msgRestored": "Original restaurado.",
    "msgApplied": "Aplicado al origen."
  },
  "pt": {
    "title_page": "Editor e otimizador SVG",
    "desc": "Envie ou cole um SVG, comprima com SVGO, ajuste tamanho, cores e viewBox e baixe SVG ou PNG. Tudo fica no navegador.",
    "pasteTitle": "Colar código SVG",
    "pastePlaceholder": "Cole o código SVG aqui…",
    "loadPaste": "Carregar código",
    "useSample": "Usar exemplo",
    "reselect": "Escolher outro",
    "optimize": "Otimizar",
    "format": "Indentação",
    "restore": "Restaurar original",
    "copy": "Copiar código",
    "download": "Baixar SVG",
    "downloadPng": "Baixar PNG",
    "original": "Original",
    "current": "Atual",
    "saved": "Economizado",
    "optTitle": "Opções de otimização",
    "editTitle": "Tamanho e cor",
    "codeTitle": "Código SVG",
    "multipass": "Várias passagens",
    "pretty": "Manter indentação",
    "removeComments": "Remover comentários",
    "removeMetadata": "Remover metadados",
    "removeHidden": "Remover elementos ocultos",
    "cleanupIds": "Limpar IDs",
    "convertColors": "Minificar cores",
    "collapseGroups": "Unir grupos",
    "keepViewBox": "Manter viewBox",
    "precision": "Decimais",
    "width": "Largura",
    "height": "Altura",
    "viewBox": "viewBox",
    "applySize": "Aplicar tamanho",
    "replaceFill": "Substituir cor",
    "allFills": "Substituir todos os preenchimentos",
    "pngSize": "Lado maior PNG",
    "hint": "O SVGO é carregado de um CDN na primeira otimização. Guarde o original se precisar.",
    "msgNotSvg": "Escolha ou cole um SVG válido.",
    "msgEmpty": "Cole o código SVG primeiro.",
    "msgFail": "Falha ao processar. Verifique o SVG e tente de novo.",
    "msgCopied": "Copiado para a área de transferência.",
    "msgOptimized": "Otimização concluída.",
    "msgFormatted": "Formatado.",
    "msgRestored": "Original restaurado.",
    "msgApplied": "Aplicado ao código."
  },
  "ru": {
    "title_page": "Редактор и оптимизатор SVG",
    "desc": "Загрузите или вставьте SVG, сожмите через SVGO, измените размер, цвета и viewBox, затем скачайте SVG или PNG. Всё выполняется в браузере.",
    "pasteTitle": "Вставить код SVG",
    "pastePlaceholder": "Вставьте исходный SVG сюда…",
    "loadPaste": "Загрузить код",
    "useSample": "Пример",
    "reselect": "Выбрать другой",
    "optimize": "Оптимизировать",
    "format": "Форматировать",
    "restore": "Вернуть оригинал",
    "copy": "Копировать код",
    "download": "Скачать SVG",
    "downloadPng": "Скачать PNG",
    "original": "Исходный",
    "current": "Текущий",
    "saved": "Сэкономлено",
    "optTitle": "Параметры оптимизации",
    "editTitle": "Размер и цвет",
    "codeTitle": "Исходный SVG",
    "multipass": "Несколько проходов",
    "pretty": "Сохранить отступы",
    "removeComments": "Удалить комментарии",
    "removeMetadata": "Удалить метаданные",
    "removeHidden": "Удалить скрытые элементы",
    "cleanupIds": "Очистить ID",
    "convertColors": "Сжать цвета",
    "collapseGroups": "Объединить группы",
    "keepViewBox": "Сохранить viewBox",
    "precision": "Знаки после запятой",
    "width": "Ширина",
    "height": "Высота",
    "viewBox": "viewBox",
    "applySize": "Применить размер",
    "replaceFill": "Заменить выбранный цвет",
    "allFills": "Заменить все заливки",
    "pngSize": "Длинная сторона PNG",
    "hint": "SVGO загружается с CDN при первой оптимизации. Сохраните оригинал при необходимости.",
    "msgNotSvg": "Выберите или вставьте корректный SVG.",
    "msgEmpty": "Сначала вставьте код SVG.",
    "msgFail": "Ошибка обработки. Проверьте SVG и повторите.",
    "msgCopied": "Скопировано в буфер обмена.",
    "msgOptimized": "Оптимизация завершена.",
    "msgFormatted": "Отформатировано.",
    "msgRestored": "Оригинал восстановлен.",
    "msgApplied": "Применено к исходнику."
  },
  "ar": {
    "title_page": "تحرير وتحسين SVG",
    "desc": "ارفع أو الصق SVG، اضغطه بـ SVGO، عدّل الحجم والألوان وviewBox، ثم نزّل SVG أو PNG. كل المعالجة تتم في المتصفح.",
    "pasteTitle": "لصق كود SVG",
    "pastePlaceholder": "الصق مصدر SVG هنا…",
    "loadPaste": "تحميل الكود",
    "useSample": "استخدام مثال",
    "reselect": "اختيار آخر",
    "optimize": "تحسين",
    "format": "تنسيق",
    "restore": "استعادة الأصل",
    "copy": "نسخ الكود",
    "download": "تنزيل SVG",
    "downloadPng": "تنزيل PNG",
    "original": "الأصل",
    "current": "الحالي",
    "saved": "تم التوفير",
    "optTitle": "خيارات التحسين",
    "editTitle": "الحجم واللون",
    "codeTitle": "مصدر SVG",
    "multipass": "عدة تمريرات",
    "pretty": "الإبقاء على المسافات",
    "removeComments": "حذف التعليقات",
    "removeMetadata": "حذف البيانات الوصفية",
    "removeHidden": "حذف العناصر المخفية",
    "cleanupIds": "تنظيف المعرّفات",
    "convertColors": "ضغط الألوان",
    "collapseGroups": "دمج المجموعات",
    "keepViewBox": "الإبقاء على viewBox",
    "precision": "الخانات العشرية",
    "width": "العرض",
    "height": "الارتفاع",
    "viewBox": "viewBox",
    "applySize": "تطبيق الحجم",
    "replaceFill": "استبدال اللون المحدد",
    "allFills": "استبدال كل التعبئات",
    "pngSize": "الضلع الأطول لـ PNG",
    "hint": "يُحمَّل SVGO من CDN عند أول تحسين. احتفظ بالأصل إن لزم.",
    "msgNotSvg": "اختر أو الصق SVG صالحًا.",
    "msgEmpty": "الصق كود SVG أولًا.",
    "msgFail": "فشلت المعالجة. تحقق من SVG وحاول مجددًا.",
    "msgCopied": "تم النسخ إلى الحافظة.",
    "msgOptimized": "اكتمل التحسين.",
    "msgFormatted": "تم التنسيق.",
    "msgRestored": "تمت استعادة الأصل.",
    "msgApplied": "طُبّق على المصدر."
  },
  "hi": {
    "title_page": "SVG संपादन और अनुकूलन",
    "desc": "SVG अपलोड या पेस्ट करें, SVGO से संपीड़ित करें, आकार, रंग और viewBox बदलें, फिर SVG या PNG डाउनलोड करें। सब कुछ ब्राउज़र में रहता है।",
    "pasteTitle": "SVG कोड पेस्ट करें",
    "pastePlaceholder": "SVG स्रोत यहाँ पेस्ट करें…",
    "loadPaste": "कोड लोड करें",
    "useSample": "नमूना उपयोग करें",
    "reselect": "दूसरा चुनें",
    "optimize": "अनुकूलित करें",
    "format": "सुंदर प्रारूप",
    "restore": "मूल वापस लाएँ",
    "copy": "कोड कॉपी करें",
    "download": "SVG डाउनलोड",
    "downloadPng": "PNG डाउनलोड",
    "original": "मूल",
    "current": "वर्तमान",
    "saved": "बचाया",
    "optTitle": "अनुकूलन विकल्प",
    "editTitle": "आकार और रंग",
    "codeTitle": "SVG स्रोत",
    "multipass": "बहु-पास",
    "pretty": "इंडेंट रखें",
    "removeComments": "टिप्पणियाँ हटाएँ",
    "removeMetadata": "मेटाडेटा हटाएँ",
    "removeHidden": "छिपे तत्व हटाएँ",
    "cleanupIds": "ID साफ़ करें",
    "convertColors": "रंग छोटा करें",
    "collapseGroups": "समूह मिलाएँ",
    "keepViewBox": "viewBox रखें",
    "precision": "दशमलव",
    "width": "चौड़ाई",
    "height": "ऊँचाई",
    "viewBox": "viewBox",
    "applySize": "आकार लागू करें",
    "replaceFill": "चयनित रंग बदलें",
    "allFills": "सभी भराव बदलें",
    "pngSize": "PNG लंबा किनारा",
    "hint": "पहली बार अनुकूलन पर SVGO CDN से लोड होता है। ज़रूरत हो तो मूल रखें।",
    "msgNotSvg": "मान्य SVG चुनें या पेस्ट करें।",
    "msgEmpty": "पहले SVG कोड पेस्ट करें।",
    "msgFail": "प्रसंस्करण विफल। SVG जाँचें और फिर कोशिश करें।",
    "msgCopied": "क्लिपबोर्ड पर कॉपी हो गया।",
    "msgOptimized": "अनुकूलन पूरा।",
    "msgFormatted": "प्रारूपित।",
    "msgRestored": "मूल बहाल।",
    "msgApplied": "स्रोत पर लागू।"
  },
  "it": {
    "title_page": "Editor e ottimizzatore SVG",
    "desc": "Carica o incolla un SVG, comprimilo con SVGO, regola dimensioni, colori e viewBox, poi scarica SVG o PNG. Tutto resta nel browser.",
    "pasteTitle": "Incolla codice SVG",
    "pastePlaceholder": "Incolla qui il sorgente SVG…",
    "loadPaste": "Carica codice",
    "useSample": "Usa esempio",
    "reselect": "Scegli un altro",
    "optimize": "Ottimizza",
    "format": "Indentazione",
    "restore": "Ripristina originale",
    "copy": "Copia codice",
    "download": "Scarica SVG",
    "downloadPng": "Scarica PNG",
    "original": "Originale",
    "current": "Attuale",
    "saved": "Risparmiato",
    "optTitle": "Opzioni di ottimizzazione",
    "editTitle": "Dimensione e colore",
    "codeTitle": "Sorgente SVG",
    "multipass": "Più passaggi",
    "pretty": "Mantieni indentazione",
    "removeComments": "Rimuovi commenti",
    "removeMetadata": "Rimuovi metadati",
    "removeHidden": "Rimuovi elementi nascosti",
    "cleanupIds": "Pulisci ID",
    "convertColors": "Riduci colori",
    "collapseGroups": "Unisci gruppi",
    "keepViewBox": "Mantieni viewBox",
    "precision": "Decimali",
    "width": "Larghezza",
    "height": "Altezza",
    "viewBox": "viewBox",
    "applySize": "Applica dimensione",
    "replaceFill": "Sostituisci colore",
    "allFills": "Sostituisci tutti i riempimenti",
    "pngSize": "Lato lungo PNG",
    "hint": "SVGO viene caricato da CDN alla prima ottimizzazione. Conserva l’originale se serve.",
    "msgNotSvg": "Scegli o incolla un SVG valido.",
    "msgEmpty": "Incolla prima il codice SVG.",
    "msgFail": "Elaborazione non riuscita. Controlla l’SVG e riprova.",
    "msgCopied": "Copiato negli appunti.",
    "msgOptimized": "Ottimizzazione completata.",
    "msgFormatted": "Formattato.",
    "msgRestored": "Originale ripristinato.",
    "msgApplied": "Applicato al sorgente."
  },
  "nl": {
    "title_page": "SVG bewerken en optimaliseren",
    "desc": "Upload of plak een SVG, comprimeer met SVGO, pas formaat, kleuren en viewBox aan en download SVG of PNG. Alles blijft in de browser.",
    "pasteTitle": "SVG-code plakken",
    "pastePlaceholder": "Plak hier de SVG-bron…",
    "loadPaste": "Code laden",
    "useSample": "Voorbeeld gebruiken",
    "reselect": "Andere kiezen",
    "optimize": "Optimaliseren",
    "format": "Inspringen",
    "restore": "Origineel herstellen",
    "copy": "Code kopiëren",
    "download": "SVG downloaden",
    "downloadPng": "PNG downloaden",
    "original": "Origineel",
    "current": "Huidig",
    "saved": "Bespaard",
    "optTitle": "Optimalisatie-opties",
    "editTitle": "Formaat en kleur",
    "codeTitle": "SVG-bron",
    "multipass": "Meerdere passes",
    "pretty": "Inspringing behouden",
    "removeComments": "Opmerkingen verwijderen",
    "removeMetadata": "Metadata verwijderen",
    "removeHidden": "Verborgen elementen verwijderen",
    "cleanupIds": "ID’s opschonen",
    "convertColors": "Kleuren inkorten",
    "collapseGroups": "Groepen samenvoegen",
    "keepViewBox": "viewBox behouden",
    "precision": "Decimalen",
    "width": "Breedte",
    "height": "Hoogte",
    "viewBox": "viewBox",
    "applySize": "Formaat toepassen",
    "replaceFill": "Geselecteerde kleur vervangen",
    "allFills": "Alle vullingen vervangen",
    "pngSize": "PNG lange zijde",
    "hint": "SVGO wordt bij de eerste optimalisatie via CDN geladen. Bewaar het origineel indien nodig.",
    "msgNotSvg": "Kies of plak een geldige SVG.",
    "msgEmpty": "Plak eerst SVG-code.",
    "msgFail": "Verwerking mislukt. Controleer de SVG en probeer opnieuw.",
    "msgCopied": "Gekopieerd naar het klembord.",
    "msgOptimized": "Optimalisatie voltooid.",
    "msgFormatted": "Opgemaakt.",
    "msgRestored": "Origineel hersteld.",
    "msgApplied": "Toegepast op de bron."
  },
  "tr": {
    "title_page": "SVG düzenleme ve eniyileme",
    "desc": "SVG yükleyin veya yapıştırın, SVGO ile sıkıştırın, boyut, renk ve viewBox ayarlayın, SVG veya PNG indirin. Her şey tarayıcıda kalır.",
    "pasteTitle": "SVG kodunu yapıştır",
    "pastePlaceholder": "SVG kaynağını buraya yapıştırın…",
    "loadPaste": "Kodu yükle",
    "useSample": "Örnek kullan",
    "reselect": "Başka seç",
    "optimize": "Eniyile",
    "format": "Biçimlendir",
    "restore": "Orijinale dön",
    "copy": "Kodu kopyala",
    "download": "SVG indir",
    "downloadPng": "PNG indir",
    "original": "Orijinal",
    "current": "Şu an",
    "saved": "Kazanç",
    "optTitle": "Eniyileme seçenekleri",
    "editTitle": "Boyut ve renk",
    "codeTitle": "SVG kaynağı",
    "multipass": "Çok geçiş",
    "pretty": "Girintiyi koru",
    "removeComments": "Yorumları sil",
    "removeMetadata": "Üst veriyi sil",
    "removeHidden": "Gizli öğeleri sil",
    "cleanupIds": "ID’leri temizle",
    "convertColors": "Renkleri kısalt",
    "collapseGroups": "Grupları birleştir",
    "keepViewBox": "viewBox’ı koru",
    "precision": "Ondalık",
    "width": "Genişlik",
    "height": "Yükseklik",
    "viewBox": "viewBox",
    "applySize": "Boyutu uygula",
    "replaceFill": "Seçili rengi değiştir",
    "allFills": "Tüm dolguları değiştir",
    "pngSize": "PNG uzun kenar",
    "hint": "SVGO ilk eniyilemede CDN’den yüklenir. Gerekirse orijinali saklayın.",
    "msgNotSvg": "Geçerli bir SVG seçin veya yapıştırın.",
    "msgEmpty": "Önce SVG kodunu yapıştırın.",
    "msgFail": "İşlem başarısız. SVG’yi kontrol edip tekrar deneyin.",
    "msgCopied": "Panoya kopyalandı.",
    "msgOptimized": "Eniyileme tamamlandı.",
    "msgFormatted": "Biçimlendirildi.",
    "msgRestored": "Orijinal geri yüklendi.",
    "msgApplied": "Kaynağa uygulandı."
  },
  "vi": {
    "title_page": "Chỉnh sửa và tối ưu SVG",
    "desc": "Tải lên hoặc dán SVG, nén bằng SVGO, chỉnh kích thước, màu và viewBox, rồi tải SVG hoặc PNG. Mọi xử lý diễn ra trong trình duyệt.",
    "pasteTitle": "Dán mã SVG",
    "pastePlaceholder": "Dán mã nguồn SVG vào đây…",
    "loadPaste": "Tải mã",
    "useSample": "Dùng mẫu",
    "reselect": "Chọn file khác",
    "optimize": "Tối ưu",
    "format": "Định dạng",
    "restore": "Khôi phục bản gốc",
    "copy": "Sao chép mã",
    "download": "Tải SVG",
    "downloadPng": "Tải PNG",
    "original": "Gốc",
    "current": "Hiện tại",
    "saved": "Tiết kiệm",
    "optTitle": "Tùy chọn tối ưu",
    "editTitle": "Kích thước và màu",
    "codeTitle": "Mã nguồn SVG",
    "multipass": "Nhiều lượt",
    "pretty": "Giữ thụt dòng",
    "removeComments": "Xóa chú thích",
    "removeMetadata": "Xóa siêu dữ liệu",
    "removeHidden": "Xóa phần tử ẩn",
    "cleanupIds": "Dọn ID",
    "convertColors": "Rút gọn màu",
    "collapseGroups": "Gộp nhóm",
    "keepViewBox": "Giữ viewBox",
    "precision": "Số thập phân",
    "width": "Rộng",
    "height": "Cao",
    "viewBox": "viewBox",
    "applySize": "Áp dụng kích thước",
    "replaceFill": "Đổi màu đã chọn",
    "allFills": "Đổi mọi màu tô",
    "pngSize": "Cạnh dài PNG",
    "hint": "SVGO được tải từ CDN lần tối ưu đầu. Hãy giữ bản gốc nếu cần.",
    "msgNotSvg": "Hãy chọn hoặc dán SVG hợp lệ.",
    "msgEmpty": "Hãy dán mã SVG trước.",
    "msgFail": "Xử lý thất bại. Kiểm tra SVG và thử lại.",
    "msgCopied": "Đã sao chép vào clipboard.",
    "msgOptimized": "Đã tối ưu xong.",
    "msgFormatted": "Đã định dạng.",
    "msgRestored": "Đã khôi phục bản gốc.",
    "msgApplied": "Đã áp dụng vào mã nguồn."
  },
  "th": {
    "title_page": "แก้ไขและปรับแต่ง SVG",
    "desc": "อัปโหลดหรือวาง SVG บีบอัดด้วย SVGO ปรับขนาด สี และ viewBox แล้วดาวน์โหลดเป็น SVG หรือ PNG ทุกอย่างทำในเบราว์เซอร์",
    "pasteTitle": "วางโค้ด SVG",
    "pastePlaceholder": "วางซอร์ส SVG ที่นี่…",
    "loadPaste": "โหลดโค้ด",
    "useSample": "ใช้ตัวอย่าง",
    "reselect": "เลือกไฟล์อื่น",
    "optimize": "ปรับแต่ง",
    "format": "จัดรูปแบบ",
    "restore": "คืนค่าต้นฉบับ",
    "copy": "คัดลอกโค้ด",
    "download": "ดาวน์โหลด SVG",
    "downloadPng": "ดาวน์โหลด PNG",
    "original": "ต้นฉบับ",
    "current": "ปัจจุบัน",
    "saved": "ประหยัด",
    "optTitle": "ตัวเลือกการปรับแต่ง",
    "editTitle": "ขนาดและสี",
    "codeTitle": "ซอร์ส SVG",
    "multipass": "หลายรอบ",
    "pretty": "คงการเยื้อง",
    "removeComments": "ลบความคิดเห็น",
    "removeMetadata": "ลบเมทาดาทา",
    "removeHidden": "ลบองค์ประกอบที่ซ่อน",
    "cleanupIds": "จัดระเบียบ ID",
    "convertColors": "ย่อสี",
    "collapseGroups": "รวมกลุ่ม",
    "keepViewBox": "คง viewBox",
    "precision": "ทศนิยม",
    "width": "ความกว้าง",
    "height": "ความสูง",
    "viewBox": "viewBox",
    "applySize": "ใช้ขนาด",
    "replaceFill": "แทนที่สีที่เลือก",
    "allFills": "แทนที่สีเติมทั้งหมด",
    "pngSize": "ด้านยาว PNG",
    "hint": "SVGO จะโหลดจาก CDN ครั้งแรกที่ปรับแต่ง เก็บต้นฉบับไว้หากต้องการ",
    "msgNotSvg": "โปรดเลือกหรือวาง SVG ที่ถูกต้อง",
    "msgEmpty": "โปรดวางโค้ด SVG ก่อน",
    "msgFail": "ประมวลผลไม่สำเร็จ ตรวจ SVG แล้วลองใหม่",
    "msgCopied": "คัดลอกไปยังคลิปบอร์ดแล้ว",
    "msgOptimized": "ปรับแต่งเสร็จแล้ว",
    "msgFormatted": "จัดรูปแบบแล้ว",
    "msgRestored": "คืนค่าต้นฉบับแล้ว",
    "msgApplied": "นำไปใช้กับซอร์สแล้ว"
  },
  "id": {
    "title_page": "Editor dan pengoptimal SVG",
    "desc": "Unggah atau tempel SVG, kompres dengan SVGO, sesuaikan ukuran, warna, dan viewBox, lalu unduh SVG atau PNG. Semua diproses di browser.",
    "pasteTitle": "Tempel kode SVG",
    "pastePlaceholder": "Tempel sumber SVG di sini…",
    "loadPaste": "Muat kode",
    "useSample": "Gunakan contoh",
    "reselect": "Pilih yang lain",
    "optimize": "Optimalkan",
    "format": "Rapikan",
    "restore": "Kembalikan asli",
    "copy": "Salin kode",
    "download": "Unduh SVG",
    "downloadPng": "Unduh PNG",
    "original": "Asli",
    "current": "Saat ini",
    "saved": "Dihemat",
    "optTitle": "Opsi optimasi",
    "editTitle": "Ukuran dan warna",
    "codeTitle": "Sumber SVG",
    "multipass": "Beberapa lintasan",
    "pretty": "Pertahankan indentasi",
    "removeComments": "Hapus komentar",
    "removeMetadata": "Hapus metadata",
    "removeHidden": "Hapus elemen tersembunyi",
    "cleanupIds": "Bersihkan ID",
    "convertColors": "Persingkat warna",
    "collapseGroups": "Gabungkan grup",
    "keepViewBox": "Pertahankan viewBox",
    "precision": "Desimal",
    "width": "Lebar",
    "height": "Tinggi",
    "viewBox": "viewBox",
    "applySize": "Terapkan ukuran",
    "replaceFill": "Ganti warna terpilih",
    "allFills": "Ganti semua isian",
    "pngSize": "Sisi panjang PNG",
    "hint": "SVGO dimuat dari CDN pada optimasi pertama. Simpan aslinya jika perlu.",
    "msgNotSvg": "Pilih atau tempel SVG yang valid.",
    "msgEmpty": "Tempel kode SVG terlebih dahulu.",
    "msgFail": "Pemrosesan gagal. Periksa SVG dan coba lagi.",
    "msgCopied": "Disalin ke papan klip.",
    "msgOptimized": "Optimasi selesai.",
    "msgFormatted": "Diformat.",
    "msgRestored": "Asli dipulihkan.",
    "msgApplied": "Diterapkan ke sumber."
  },
  "ms": {
    "title_page": "Editor dan pengoptimum SVG",
    "desc": "Muat naik atau tampal SVG, mampatkan dengan SVGO, laras saiz, warna dan viewBox, kemudian muat turun SVG atau PNG. Semua diproses dalam pelayar.",
    "pasteTitle": "Tampal kod SVG",
    "pastePlaceholder": "Tampal sumber SVG di sini…",
    "loadPaste": "Muat kod",
    "useSample": "Guna contoh",
    "reselect": "Pilih yang lain",
    "optimize": "Optimumkan",
    "format": "Cantikkan",
    "restore": "Pulihkan asal",
    "copy": "Salin kod",
    "download": "Muat turun SVG",
    "downloadPng": "Muat turun PNG",
    "original": "Asal",
    "current": "Semasa",
    "saved": "Dijimatkan",
    "optTitle": "Pilihan pengoptimuman",
    "editTitle": "Saiz dan warna",
    "codeTitle": "Sumber SVG",
    "multipass": "Beberapa laluan",
    "pretty": "Kekalkan inden",
    "removeComments": "Buang komen",
    "removeMetadata": "Buang metadata",
    "removeHidden": "Buang elemen tersembunyi",
    "cleanupIds": "Bersihkan ID",
    "convertColors": "Ringkaskan warna",
    "collapseGroups": "Gabungkan kumpulan",
    "keepViewBox": "Kekalkan viewBox",
    "precision": "Perpuluhan",
    "width": "Lebar",
    "height": "Tinggi",
    "viewBox": "viewBox",
    "applySize": "Guna saiz",
    "replaceFill": "Ganti warna dipilih",
    "allFills": "Ganti semua isian",
    "pngSize": "Sisi panjang PNG",
    "hint": "SVGO dimuat dari CDN pada pengoptimuman pertama. Simpan asal jika perlu.",
    "msgNotSvg": "Pilih atau tampal SVG yang sah.",
    "msgEmpty": "Tampal kod SVG dahulu.",
    "msgFail": "Pemprosesan gagal. Semak SVG dan cuba lagi.",
    "msgCopied": "Disalin ke papan keratan.",
    "msgOptimized": "Pengoptimuman selesai.",
    "msgFormatted": "Difomat.",
    "msgRestored": "Asal dipulihkan.",
    "msgApplied": "Digunakan pada sumber."
  },
  "pl": {
    "title_page": "Edytor i optymalizator SVG",
    "desc": "Wgraj lub wklej SVG, skompresuj SVGO, zmień rozmiar, kolory i viewBox, potem pobierz SVG lub PNG. Wszystko w przeglądarce.",
    "pasteTitle": "Wklej kod SVG",
    "pastePlaceholder": "Wklej źródło SVG tutaj…",
    "loadPaste": "Wczytaj kod",
    "useSample": "Użyj przykładu",
    "reselect": "Wybierz inny",
    "optimize": "Optymalizuj",
    "format": "Sformatuj",
    "restore": "Przywróć oryginał",
    "copy": "Kopiuj kod",
    "download": "Pobierz SVG",
    "downloadPng": "Pobierz PNG",
    "original": "Oryginał",
    "current": "Bieżący",
    "saved": "Oszczędzono",
    "optTitle": "Opcje optymalizacji",
    "editTitle": "Rozmiar i kolor",
    "codeTitle": "Źródło SVG",
    "multipass": "Wiele przebiegów",
    "pretty": "Zachowaj wcięcia",
    "removeComments": "Usuń komentarze",
    "removeMetadata": "Usuń metadane",
    "removeHidden": "Usuń ukryte elementy",
    "cleanupIds": "Wyczyść ID",
    "convertColors": "Skróć kolory",
    "collapseGroups": "Scal grupy",
    "keepViewBox": "Zachowaj viewBox",
    "precision": "Miejsca dziesiętne",
    "width": "Szerokość",
    "height": "Wysokość",
    "viewBox": "viewBox",
    "applySize": "Zastosuj rozmiar",
    "replaceFill": "Zamień wybrany kolor",
    "allFills": "Zamień wszystkie wypełnienia",
    "pngSize": "Dłuższy bok PNG",
    "hint": "SVGO ładuje się z CDN przy pierwszej optymalizacji. Zachowaj oryginał, jeśli go potrzebujesz.",
    "msgNotSvg": "Wybierz lub wklej poprawny SVG.",
    "msgEmpty": "Najpierw wklej kod SVG.",
    "msgFail": "Przetwarzanie nie powiodło się. Sprawdź SVG i spróbuj ponownie.",
    "msgCopied": "Skopiowano do schowka.",
    "msgOptimized": "Optymalizacja zakończona.",
    "msgFormatted": "Sformatowano.",
    "msgRestored": "Przywrócono oryginał.",
    "msgApplied": "Zastosowano do źródła."
  },
  "uk": {
    "title_page": "Редактор і оптимізатор SVG",
    "desc": "Завантажте або вставте SVG, стисніть через SVGO, змініть розмір, кольори та viewBox, потім завантажте SVG або PNG. Усе в браузері.",
    "pasteTitle": "Вставити код SVG",
    "pastePlaceholder": "Вставте вихідний SVG сюди…",
    "loadPaste": "Завантажити код",
    "useSample": "Використати приклад",
    "reselect": "Обрати інший",
    "optimize": "Оптимізувати",
    "format": "Форматувати",
    "restore": "Повернути оригінал",
    "copy": "Копіювати код",
    "download": "Завантажити SVG",
    "downloadPng": "Завантажити PNG",
    "original": "Оригінал",
    "current": "Поточний",
    "saved": "Заощаджено",
    "optTitle": "Параметри оптимізації",
    "editTitle": "Розмір і колір",
    "codeTitle": "Вихідний SVG",
    "multipass": "Кілька проходів",
    "pretty": "Зберегти відступи",
    "removeComments": "Видалити коментарі",
    "removeMetadata": "Видалити метадані",
    "removeHidden": "Видалити приховані елементи",
    "cleanupIds": "Очистити ID",
    "convertColors": "Стиснути кольори",
    "collapseGroups": "Об’єднати групи",
    "keepViewBox": "Зберегти viewBox",
    "precision": "Знаки після коми",
    "width": "Ширина",
    "height": "Висота",
    "viewBox": "viewBox",
    "applySize": "Застосувати розмір",
    "replaceFill": "Замінити вибраний колір",
    "allFills": "Замінити всі заливки",
    "pngSize": "Довгий бік PNG",
    "hint": "SVGO завантажується з CDN під час першої оптимізації. Збережіть оригінал за потреби.",
    "msgNotSvg": "Оберіть або вставте коректний SVG.",
    "msgEmpty": "Спочатку вставте код SVG.",
    "msgFail": "Помилка обробки. Перевірте SVG і спробуйте ще раз.",
    "msgCopied": "Скопійовано в буфер обміну.",
    "msgOptimized": "Оптимізацію завершено.",
    "msgFormatted": "Відформатовано.",
    "msgRestored": "Оригінал відновлено.",
    "msgApplied": "Застосовано до джерела."
  },
  "sv": {
    "title_page": "SVG-redigerare och optimerare",
    "desc": "Ladda upp eller klistra in SVG, komprimera med SVGO, justera storlek, färger och viewBox, ladda sedan ner SVG eller PNG. Allt stannar i webbläsaren.",
    "pasteTitle": "Klistra in SVG-kod",
    "pastePlaceholder": "Klistra in SVG-källan här…",
    "loadPaste": "Ladda kod",
    "useSample": "Använd exempel",
    "reselect": "Välj en annan",
    "optimize": "Optimera",
    "format": "Formatera",
    "restore": "Återställ original",
    "copy": "Kopiera kod",
    "download": "Ladda ner SVG",
    "downloadPng": "Ladda ner PNG",
    "original": "Original",
    "current": "Nuvarande",
    "saved": "Sparat",
    "optTitle": "Optimeringsalternativ",
    "editTitle": "Storlek och färg",
    "codeTitle": "SVG-källa",
    "multipass": "Flera pass",
    "pretty": "Behåll indrag",
    "removeComments": "Ta bort kommentarer",
    "removeMetadata": "Ta bort metadata",
    "removeHidden": "Ta bort dolda element",
    "cleanupIds": "Rensa ID",
    "convertColors": "Korta färger",
    "collapseGroups": "Slå ihop grupper",
    "keepViewBox": "Behåll viewBox",
    "precision": "Decimaler",
    "width": "Bredd",
    "height": "Höjd",
    "viewBox": "viewBox",
    "applySize": "Tillämpa storlek",
    "replaceFill": "Ersätt vald färg",
    "allFills": "Ersätt alla fyllningar",
    "pngSize": "PNG långsida",
    "hint": "SVGO laddas från CDN vid första optimeringen. Spara originalet om du behöver det.",
    "msgNotSvg": "Välj eller klistra in en giltig SVG.",
    "msgEmpty": "Klistra in SVG-kod först.",
    "msgFail": "Bearbetningen misslyckades. Kontrollera SVG och försök igen.",
    "msgCopied": "Kopierat till urklipp.",
    "msgOptimized": "Optimering klar.",
    "msgFormatted": "Formaterad.",
    "msgRestored": "Originalet återställt.",
    "msgApplied": "Tillämpat på källan."
  },
  "zh-TW": {
    "title_page": "SVG 編輯最佳化",
    "desc": "上傳或貼上 SVG，用 SVGO 壓縮體積，調整寬高、顏色與 viewBox，再下載 SVG 或 PNG。處理都在瀏覽器本機完成。",
    "pasteTitle": "貼上 SVG 程式碼",
    "pastePlaceholder": "把 SVG 原始碼貼到這裡…",
    "loadPaste": "載入程式碼",
    "useSample": "使用範例",
    "reselect": "換一個",
    "optimize": "最佳化壓縮",
    "format": "美化格式",
    "restore": "還原原文",
    "copy": "複製程式碼",
    "download": "下載 SVG",
    "downloadPng": "下載 PNG",
    "original": "原始",
    "current": "目前",
    "saved": "節省",
    "optTitle": "最佳化選項",
    "editTitle": "尺寸與顏色",
    "codeTitle": "SVG 原始碼",
    "multipass": "多輪最佳化",
    "pretty": "保留縮排",
    "removeComments": "刪除註解",
    "removeMetadata": "刪除中繼資料",
    "removeHidden": "刪除隱藏元素",
    "cleanupIds": "清理 ID",
    "convertColors": "壓縮顏色",
    "collapseGroups": "合併群組",
    "keepViewBox": "保留 viewBox",
    "precision": "小數精度",
    "width": "寬度",
    "height": "高度",
    "viewBox": "viewBox",
    "applySize": "套用尺寸",
    "replaceFill": "取代所選色",
    "allFills": "取代全部填色",
    "pngSize": "PNG 長邊",
    "hint": "首次最佳化會從 CDN 載入 SVGO，之後可反覆壓縮。建議先備份原文。",
    "msgNotSvg": "請選擇或貼上有效的 SVG。",
    "msgEmpty": "請先貼上 SVG 程式碼。",
    "msgFail": "處理失敗，請檢查 SVG 或稍後重試。",
    "msgCopied": "已複製到剪貼簿。",
    "msgOptimized": "最佳化完成。",
    "msgFormatted": "已美化格式。",
    "msgRestored": "已還原原文。",
    "msgApplied": "已套用到原始碼。"
  }
}
</i18n>
