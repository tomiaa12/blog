<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"

const { t } = useI18n()

type WmMode = "text" | "image"
type Pos =
  | "tl"
  | "tc"
  | "tr"
  | "ml"
  | "mc"
  | "mr"
  | "bl"
  | "bc"
  | "br"
  | "tile"
type ExportFmt = "png" | "jpeg" | "webp"

const MIME: Record<ExportFmt, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
}
const EXT: Record<ExportFmt, string> = {
  png: "png",
  jpeg: "jpg",
  webp: "webp",
}

const POSITIONS: Pos[] = [
  "tl",
  "tc",
  "tr",
  "ml",
  "mc",
  "mr",
  "bl",
  "bc",
  "br",
]

const objectUrl = ref("")
const fileName = ref("image")
const naturalSize = ref("")
const srcImg = ref<HTMLImageElement | null>(null)
const previewRef = ref<HTMLCanvasElement | null>(null)
const previewHost = ref<HTMLElement | null>(null)

const mode = ref<WmMode>("text")
const text = ref("")
const fontSize = ref(6)
const color = ref("#ffffff")
const bold = ref(true)
const opacity = ref(0.42)
const rotate = ref(-22)
const position = ref<Pos>("br")
const margin = ref(4)
const tileGap = ref(18)
const wmScale = ref(18)

const wmUrl = ref("")
const wmImg = ref<HTMLImageElement | null>(null)
const wmInput = ref<HTMLInputElement | null>(null)

const format = ref<ExportFmt>("png")
const quality = ref(0.92)
const needQuality = computed(() => format.value !== "png")

let redrawTimer: ReturnType<typeof setTimeout> | null = null
let hostRo: ResizeObserver | null = null

function revoke(url: string) {
  if (url) URL.revokeObjectURL(url)
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("img"))
    img.src = url
  })
}

async function pickImage(files: File[]) {
  const file = files.find(f => f.type.startsWith("image/"))
  if (!file) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  revoke(objectUrl.value)
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name.replace(/\.[^.]+$/, "") || "image"
  try {
    srcImg.value = await loadImage(objectUrl.value)
    naturalSize.value = `${srcImg.value.naturalWidth} × ${srcImg.value.naturalHeight}`
    if (!text.value) text.value = t("textDefault")
    await nextTick()
    drawPreview()
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

async function pickWm(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file || !file.type.startsWith("image/")) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  revoke(wmUrl.value)
  wmUrl.value = URL.createObjectURL(file)
  try {
    wmImg.value = await loadImage(wmUrl.value)
    drawPreview()
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

function posPoint(w: number, h: number, pos: Pos) {
  const m = (Math.min(w, h) * margin.value) / 100
  const x =
    pos.includes("l") ? m : pos.includes("r") ? w - m : w / 2
  const y =
    pos.includes("t") ? m : pos.includes("b") ? h - m : h / 2
  const ax = pos.includes("l") ? "left" : pos.includes("r") ? "right" : "center"
  const ay = pos.includes("t") ? "top" : pos.includes("b") ? "bottom" : "middle"
  return { x, y, ax, ay }
}

function drawTextMark(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  const content = text.value.trim()
  if (!content) return
  const size = Math.max(10, (Math.min(w, h) * fontSize.value) / 100)
  ctx.font = `${bold.value ? "700" : "400"} ${size}px system-ui,sans-serif`
  ctx.fillStyle = color.value
  ctx.strokeStyle = "rgba(0,0,0,0.35)"
  ctx.lineWidth = Math.max(1, size * 0.06)
  ctx.shadowColor = "rgba(0,0,0,0.35)"
  ctx.shadowBlur = size * 0.12

  if (position.value === "tile") {
    const gap = (Math.min(w, h) * tileGap.value) / 100
    const tw = ctx.measureText(content).width
    const stepX = tw + gap
    const stepY = size + gap
    ctx.translate(w / 2, h / 2)
    ctx.rotate((rotate.value * Math.PI) / 180)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const span = Math.hypot(w, h)
    for (let y = -span; y < span; y += stepY) {
      for (let x = -span; x < span; x += stepX) {
        ctx.strokeText(content, x, y)
        ctx.fillText(content, x, y)
      }
    }
    return
  }

  const { x, y, ax, ay } = posPoint(w, h, position.value)
  ctx.textAlign = ax as CanvasTextAlign
  ctx.textBaseline = ay as CanvasTextBaseline
  ctx.translate(x, y)
  ctx.rotate((rotate.value * Math.PI) / 180)
  ctx.strokeText(content, 0, 0)
  ctx.fillText(content, 0, 0)
}

function drawImageMark(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mark: HTMLImageElement
) {
  const mw = mark.naturalWidth
  const mh = mark.naturalHeight
  if (!mw || !mh) return
  const target = (Math.min(w, h) * wmScale.value) / 100
  const s = target / Math.max(mw, mh)
  const dw = mw * s
  const dh = mh * s

  if (position.value === "tile") {
    const gap = (Math.min(w, h) * tileGap.value) / 100
    ctx.translate(w / 2, h / 2)
    ctx.rotate((rotate.value * Math.PI) / 180)
    const span = Math.hypot(w, h)
    for (let y = -span; y < span; y += dh + gap) {
      for (let x = -span; x < span; x += dw + gap) {
        ctx.drawImage(mark, x - dw / 2, y - dh / 2, dw, dh)
      }
    }
    return
  }

  const { x, y, ax, ay } = posPoint(w, h, position.value)
  const ox = ax === "left" ? 0 : ax === "right" ? -dw : -dw / 2
  const oy = ay === "top" ? 0 : ay === "bottom" ? -dh : -dh / 2
  ctx.translate(x, y)
  ctx.rotate((rotate.value * Math.PI) / 180)
  ctx.drawImage(mark, ox, oy, dw, dh)
}

function paint(canvas: HTMLCanvasElement, destW: number, destH: number) {
  const src = srcImg.value
  if (!src) return false
  canvas.width = destW
  canvas.height = destH
  const ctx = canvas.getContext("2d")
  if (!ctx) return false
  ctx.clearRect(0, 0, destW, destH)
  ctx.drawImage(src, 0, 0, destW, destH)
  ctx.save()
  ctx.globalAlpha = opacity.value
  if (mode.value === "text") drawTextMark(ctx, destW, destH)
  else if (wmImg.value) drawImageMark(ctx, destW, destH, wmImg.value)
  ctx.restore()
  return true
}

function drawPreview() {
  const canvas = previewRef.value
  const host = previewHost.value
  const src = srcImg.value
  if (!canvas || !host || !src) return
  const maxW = host.clientWidth || 640
  const maxH = host.clientHeight || 420
  const s = Math.min(maxW / src.naturalWidth, maxH / src.naturalHeight, 1)
  const w = Math.max(1, Math.round(src.naturalWidth * s))
  const h = Math.max(1, Math.round(src.naturalHeight * s))
  paint(canvas, w, h)
}

function scheduleDraw() {
  if (redrawTimer) clearTimeout(redrawTimer)
  redrawTimer = setTimeout(drawPreview, 40)
}

watch(
  [
    mode,
    text,
    fontSize,
    color,
    bold,
    opacity,
    rotate,
    position,
    margin,
    tileGap,
    wmScale,
    wmImg,
  ],
  scheduleDraw
)

watch(objectUrl, async url => {
  hostRo?.disconnect()
  hostRo = null
  if (!url) return
  await nextTick()
  if (previewHost.value && typeof ResizeObserver !== "undefined") {
    hostRo = new ResizeObserver(() => scheduleDraw())
    hostRo.observe(previewHost.value)
  }
})

function flattenJpeg(canvas: HTMLCanvasElement) {
  const c = document.createElement("canvas")
  c.width = canvas.width
  c.height = canvas.height
  const ctx = c.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.drawImage(canvas, 0, 0)
  return c
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>(resolve => {
    const source = format.value === "jpeg" ? flattenJpeg(canvas) : canvas
    if (!source) {
      resolve(null)
      return
    }
    source.toBlob(
      b => resolve(b),
      MIME[format.value],
      format.value === "png" ? undefined : quality.value
    )
  })
}

function saveBlob(blob: Blob, name: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

async function download() {
  const src = srcImg.value
  if (!src) return
  if (mode.value === "text" && !text.value.trim()) {
    ElMessage({ message: t("msgNoText"), type: "warning" })
    return
  }
  if (mode.value === "image" && !wmImg.value) {
    ElMessage({ message: t("msgNoWm"), type: "warning" })
    return
  }
  const canvas = document.createElement("canvas")
  if (!paint(canvas, src.naturalWidth, src.naturalHeight)) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `${fileName.value}-wm.${EXT[format.value]}`)
}

function reset() {
  revoke(objectUrl.value)
  objectUrl.value = ""
  srcImg.value = null
  naturalSize.value = ""
}

onUnmounted(() => {
  if (redrawTimer) clearTimeout(redrawTimer)
  hostRo?.disconnect()
  revoke(objectUrl.value)
  revoke(wmUrl.value)
})
</script>

<template>
  <div class="wm-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <FileUpload
      v-if="!objectUrl"
      :multiple="false"
      :folder="false"
      accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"
      @files-added="pickImage"
    />

    <template v-else>
      <div class="toolbar">
        <el-button @click="reset">{{ t("reselect") }}</el-button>
        <el-button
          type="primary"
          @click="download"
        >
          {{ t("download") }}
        </el-button>
        <span
          v-if="naturalSize"
          class="meta"
        >{{ t("sourceSize") }} {{ naturalSize }}</span>
      </div>

      <div class="work">
        <div class="preview-wrap">
          <div
            ref="previewHost"
            class="preview-host"
          >
            <canvas ref="previewRef" />
          </div>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("modeTitle") }}</h2>
          <el-radio-group
            v-model="mode"
            class="fmt-group"
          >
            <el-radio-button value="text">{{ t("modeText") }}</el-radio-button>
            <el-radio-button value="image">{{ t("modeImage") }}</el-radio-button>
          </el-radio-group>

          <template v-if="mode === 'text'">
            <h2 class="sub">{{ t("textLabel") }}</h2>
            <el-input
              v-model="text"
              :placeholder="t('textPlaceholder')"
              maxlength="80"
            />
            <div class="row">
              <span>{{ t("color") }}</span>
              <el-color-picker v-model="color" />
              <el-checkbox v-model="bold">{{ t("bold") }}</el-checkbox>
            </div>
            <h2 class="sub">{{ t("fontSize") }} {{ fontSize }}%</h2>
            <el-slider
              v-model="fontSize"
              :min="2"
              :max="24"
              :step="0.5"
              :show-tooltip="false"
            />
          </template>

          <template v-else>
            <h2 class="sub">{{ t("wmImage") }}</h2>
            <input
              ref="wmInput"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="pickWm"
            />
            <el-button @click="wmInput?.click()">{{ t("pickWm") }}</el-button>
            <img
              v-if="wmUrl"
              :src="wmUrl"
              class="wm-thumb"
              alt=""
            />
            <h2 class="sub">{{ t("scale") }} {{ wmScale }}%</h2>
            <el-slider
              v-model="wmScale"
              :min="4"
              :max="80"
              :step="1"
              :show-tooltip="false"
            />
          </template>

          <h2 class="sub">{{ t("positionTitle") }}</h2>
          <div class="pos-grid">
            <button
              v-for="p in POSITIONS"
              :key="p"
              type="button"
              class="pos-btn"
              :class="{ on: position === p }"
              @click="position = p"
            />
          </div>
          <el-checkbox
            :model-value="position === 'tile'"
            @change="(v: boolean) => (position = v ? 'tile' : 'br')"
          >
            {{ t("posTile") }}
          </el-checkbox>

          <h2 class="sub">{{ t("opacity") }} {{ Math.round(opacity * 100) }}%</h2>
          <el-slider
            v-model="opacity"
            :min="0.05"
            :max="1"
            :step="0.01"
            :show-tooltip="false"
          />
          <h2 class="sub">{{ t("rotate") }} {{ rotate }}°</h2>
          <el-slider
            v-model="rotate"
            :min="-180"
            :max="180"
            :step="1"
            :show-tooltip="false"
          />
          <h2 class="sub">{{ t("margin") }} {{ margin }}%</h2>
          <el-slider
            v-model="margin"
            :min="0"
            :max="20"
            :step="0.5"
            :show-tooltip="false"
            :disabled="position === 'tile'"
          />
          <template v-if="position === 'tile'">
            <h2 class="sub">{{ t("tileGap") }} {{ tileGap }}%</h2>
            <el-slider
              v-model="tileGap"
              :min="4"
              :max="40"
              :step="1"
              :show-tooltip="false"
            />
          </template>

          <h2 class="sub">{{ t("formatTitle") }}</h2>
          <el-radio-group
            v-model="format"
            class="fmt-group"
          >
            <el-radio-button value="png">PNG</el-radio-button>
            <el-radio-button value="jpeg">JPG</el-radio-button>
            <el-radio-button value="webp">WebP</el-radio-button>
          </el-radio-group>
          <template v-if="needQuality">
            <h2 class="sub">{{ t("qualityTitle") }} {{ Math.round(quality * 100) }}%</h2>
            <el-slider
              v-model="quality"
              :min="0.1"
              :max="1"
              :step="0.02"
              :show-tooltip="false"
            />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.wm-page {
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

.preview-host canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.side {
  padding: 12px 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.sub {
  margin: 12px 0 8px;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);

  &:first-child {
    margin-top: 0;
  }
}

.fmt-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.hidden-input {
  display: none;
}

.wm-thumb {
  display: block;
  max-width: 100%;
  max-height: 72px;
  margin-top: 8px;
  object-fit: contain;
}

.pos-grid {
  display: grid;
  grid-template-columns: repeat(3, 28px);
  gap: 6px;
  margin-bottom: 10px;
}

.pos-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  cursor: pointer;

  &.on {
    background: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片加水印",
    "desc": "拖入图片后添加文字或图片水印，可九宫格定位或斜向平铺，再导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载图片",
    "sourceSize": "原图",
    "modeTitle": "水印类型",
    "modeText": "文字",
    "modeImage": "图片",
    "textLabel": "水印文字",
    "textPlaceholder": "输入水印内容",
    "textDefault": "仅供预览",
    "color": "颜色",
    "bold": "加粗",
    "fontSize": "字号",
    "wmImage": "水印图片",
    "pickWm": "选择水印图",
    "scale": "水印大小",
    "positionTitle": "位置",
    "posTile": "斜向平铺铺满",
    "opacity": "透明度",
    "rotate": "旋转",
    "margin": "边距",
    "tileGap": "间距",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "msgNotImage": "请选择图片文件。",
    "msgNoText": "请先填写水印文字。",
    "msgNoWm": "请先选择水印图片。",
    "msgFail": "处理失败。"
  },
  "zh-CN": {
    "title_page": "图片加水印",
    "desc": "拖入图片后添加文字或图片水印，可九宫格定位或斜向平铺，再导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载图片",
    "sourceSize": "原图",
    "modeTitle": "水印类型",
    "modeText": "文字",
    "modeImage": "图片",
    "textLabel": "水印文字",
    "textPlaceholder": "输入水印内容",
    "textDefault": "仅供预览",
    "color": "颜色",
    "bold": "加粗",
    "fontSize": "字号",
    "wmImage": "水印图片",
    "pickWm": "选择水印图",
    "scale": "水印大小",
    "positionTitle": "位置",
    "posTile": "斜向平铺铺满",
    "opacity": "透明度",
    "rotate": "旋转",
    "margin": "边距",
    "tileGap": "间距",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "msgNotImage": "请选择图片文件。",
    "msgNoText": "请先填写水印文字。",
    "msgNoWm": "请先选择水印图片。",
    "msgFail": "处理失败。"
  },
  "en": {
    "title_page": "Image watermark",
    "desc": "Add a text or image watermark, place it on a 3×3 grid or tile it, then export PNG, JPG, or WebP. Everything stays in your browser.",
    "reselect": "Choose another",
    "download": "Download image",
    "sourceSize": "Source",
    "modeTitle": "Watermark type",
    "modeText": "Text",
    "modeImage": "Image",
    "textLabel": "Watermark text",
    "textPlaceholder": "Enter watermark text",
    "textDefault": "Preview only",
    "color": "Color",
    "bold": "Bold",
    "fontSize": "Size",
    "wmImage": "Watermark image",
    "pickWm": "Choose watermark",
    "scale": "Watermark size",
    "positionTitle": "Position",
    "posTile": "Tile across the image",
    "opacity": "Opacity",
    "rotate": "Rotate",
    "margin": "Margin",
    "tileGap": "Gap",
    "formatTitle": "Export format",
    "qualityTitle": "Quality",
    "msgNotImage": "Please choose an image file.",
    "msgNoText": "Enter watermark text first.",
    "msgNoWm": "Choose a watermark image first.",
    "msgFail": "Could not process the image."
  },
  "ja": {
    "title_page": "画像に透かし",
    "desc": "文字または画像の透かしを追加し、9箇所またはタイル配置して PNG / JPG / WebP で保存します。処理はブラウザ内です。",
    "reselect": "別の画像",
    "download": "画像を保存",
    "sourceSize": "元画像",
    "modeTitle": "透かしの種類",
    "modeText": "文字",
    "modeImage": "画像",
    "textLabel": "透かし文字",
    "textPlaceholder": "透かしを入力",
    "textDefault": "プレビュー用",
    "color": "色",
    "bold": "太字",
    "fontSize": "サイズ",
    "wmImage": "透かし画像",
    "pickWm": "透かしを選択",
    "scale": "透かしサイズ",
    "positionTitle": "位置",
    "posTile": "斜めに敷き詰める",
    "opacity": "不透明度",
    "rotate": "回転",
    "margin": "余白",
    "tileGap": "間隔",
    "formatTitle": "書き出し形式",
    "qualityTitle": "画質",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgNoText": "先に透かし文字を入力してください。",
    "msgNoWm": "先に透かし画像を選んでください。",
    "msgFail": "処理できませんでした。"
  },
  "ko": {
    "title_page": "이미지 워터마크",
    "desc": "텍스트 또는 이미지 워터마크를 넣고 9칸 위치나 타일로 배치한 뒤 PNG, JPG, WebP로 받습니다. 모두 브라우저에서 처리됩니다.",
    "reselect": "다른 이미지",
    "download": "이미지 다운로드",
    "sourceSize": "원본",
    "modeTitle": "워터마크 종류",
    "modeText": "텍스트",
    "modeImage": "이미지",
    "textLabel": "워터마크 텍스트",
    "textPlaceholder": "워터마크 입력",
    "textDefault": "미리보기용",
    "color": "색",
    "bold": "굵게",
    "fontSize": "크기",
    "wmImage": "워터마크 이미지",
    "pickWm": "워터마크 선택",
    "scale": "워터마크 크기",
    "positionTitle": "위치",
    "posTile": "비스듬히 타일",
    "opacity": "불투명도",
    "rotate": "회전",
    "margin": "여백",
    "tileGap": "간격",
    "formatTitle": "내보내기 형식",
    "qualityTitle": "화질",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgNoText": "먼저 워터마크 텍스트를 입력하세요.",
    "msgNoWm": "먼저 워터마크 이미지를 선택하세요.",
    "msgFail": "처리하지 못했습니다."
  },
  "fr": {
    "title_page": "Filigrane d’image",
    "desc": "Ajoutez un filigrane texte ou image, placez-le en grille 3×3 ou en mosaïque, puis exportez PNG, JPG ou WebP. Tout reste dans le navigateur.",
    "reselect": "Autre image",
    "download": "Télécharger l’image",
    "sourceSize": "Source",
    "modeTitle": "Type de filigrane",
    "modeText": "Texte",
    "modeImage": "Image",
    "textLabel": "Texte du filigrane",
    "textPlaceholder": "Saisir le texte",
    "textDefault": "Aperçu uniquement",
    "color": "Couleur",
    "bold": "Gras",
    "fontSize": "Taille",
    "wmImage": "Image du filigrane",
    "pickWm": "Choisir le filigrane",
    "scale": "Taille du filigrane",
    "positionTitle": "Position",
    "posTile": "Mosaïque en diagonale",
    "opacity": "Opacité",
    "rotate": "Rotation",
    "margin": "Marge",
    "tileGap": "Écart",
    "formatTitle": "Format d’export",
    "qualityTitle": "Qualité",
    "msgNotImage": "Choisissez un fichier image.",
    "msgNoText": "Saisissez d’abord le texte.",
    "msgNoWm": "Choisissez d’abord une image de filigrane.",
    "msgFail": "Échec du traitement."
  },
  "de": {
    "title_page": "Bildwasserzeichen",
    "desc": "Text- oder Bildwasserzeichen setzen, auf 3×3-Raster oder gekachelt, dann als PNG, JPG oder WebP speichern. Alles im Browser.",
    "reselect": "Anderes Bild",
    "download": "Bild herunterladen",
    "sourceSize": "Quelle",
    "modeTitle": "Wasserzeichen-Typ",
    "modeText": "Text",
    "modeImage": "Bild",
    "textLabel": "Wasserzeichentext",
    "textPlaceholder": "Text eingeben",
    "textDefault": "Nur Vorschau",
    "color": "Farbe",
    "bold": "Fett",
    "fontSize": "Größe",
    "wmImage": "Wasserzeichenbild",
    "pickWm": "Wasserzeichen wählen",
    "scale": "Wasserzeichengröße",
    "positionTitle": "Position",
    "posTile": "Schräg kacheln",
    "opacity": "Deckkraft",
    "rotate": "Drehen",
    "margin": "Rand",
    "tileGap": "Abstand",
    "formatTitle": "Exportformat",
    "qualityTitle": "Qualität",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgNoText": "Zuerst den Text eingeben.",
    "msgNoWm": "Zuerst ein Wasserzeichenbild wählen.",
    "msgFail": "Verarbeitung fehlgeschlagen."
  },
  "es": {
    "title_page": "Marca de agua",
    "desc": "Añade texto o imagen como marca de agua, colócala en una cuadrícula 3×3 o en mosaico y exporta PNG, JPG o WebP. Todo en el navegador.",
    "reselect": "Otra imagen",
    "download": "Descargar imagen",
    "sourceSize": "Origen",
    "modeTitle": "Tipo de marca",
    "modeText": "Texto",
    "modeImage": "Imagen",
    "textLabel": "Texto de la marca",
    "textPlaceholder": "Escribe el texto",
    "textDefault": "Solo vista previa",
    "color": "Color",
    "bold": "Negrita",
    "fontSize": "Tamaño",
    "wmImage": "Imagen de marca",
    "pickWm": "Elegir marca",
    "scale": "Tamaño de la marca",
    "positionTitle": "Posición",
    "posTile": "Mosaico en diagonal",
    "opacity": "Opacidad",
    "rotate": "Rotar",
    "margin": "Margen",
    "tileGap": "Hueco",
    "formatTitle": "Formato de exportación",
    "qualityTitle": "Calidad",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgNoText": "Escribe primero el texto.",
    "msgNoWm": "Elige primero una imagen de marca.",
    "msgFail": "Error al procesar."
  },
  "pt": {
    "title_page": "Marca d’água",
    "desc": "Adicione texto ou imagem, posicione numa grelha 3×3 ou em mosaico e exporte PNG, JPG ou WebP. Tudo no navegador.",
    "reselect": "Outra imagem",
    "download": "Descarregar imagem",
    "sourceSize": "Origem",
    "modeTitle": "Tipo de marca",
    "modeText": "Texto",
    "modeImage": "Imagem",
    "textLabel": "Texto da marca",
    "textPlaceholder": "Escreva o texto",
    "textDefault": "Só pré-visualização",
    "color": "Cor",
    "bold": "Negrito",
    "fontSize": "Tamanho",
    "wmImage": "Imagem da marca",
    "pickWm": "Escolher marca",
    "scale": "Tamanho da marca",
    "positionTitle": "Posição",
    "posTile": "Mosaico na diagonal",
    "opacity": "Opacidade",
    "rotate": "Rodar",
    "margin": "Margem",
    "tileGap": "Espaço",
    "formatTitle": "Formato de exportação",
    "qualityTitle": "Qualidade",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgNoText": "Escreva primeiro o texto.",
    "msgNoWm": "Escolha primeiro uma imagem de marca.",
    "msgFail": "Falha ao processar."
  },
  "ru": {
    "title_page": "Водяной знак",
    "desc": "Добавьте текст или картинку, поставьте на сетке 3×3 или плиткой и сохраните PNG, JPG или WebP. Всё в браузере.",
    "reselect": "Другое фото",
    "download": "Скачать изображение",
    "sourceSize": "Исходник",
    "modeTitle": "Тип знака",
    "modeText": "Текст",
    "modeImage": "Картинка",
    "textLabel": "Текст знака",
    "textPlaceholder": "Введите текст",
    "textDefault": "Только просмотр",
    "color": "Цвет",
    "bold": "Жирный",
    "fontSize": "Размер",
    "wmImage": "Картинка знака",
    "pickWm": "Выбрать знак",
    "scale": "Размер знака",
    "positionTitle": "Положение",
    "posTile": "Косая плитка",
    "opacity": "Прозрачность",
    "rotate": "Поворот",
    "margin": "Отступ",
    "tileGap": "Зазор",
    "formatTitle": "Формат экспорта",
    "qualityTitle": "Качество",
    "msgNotImage": "Выберите файл изображения.",
    "msgNoText": "Сначала введите текст.",
    "msgNoWm": "Сначала выберите картинку знака.",
    "msgFail": "Не удалось обработать."
  },
  "ar": {
    "title_page": "علامة مائية للصورة",
    "desc": "أضف علامة نصية أو صورة، ضعها في شبكة 3×3 أو كررها، ثم صدّر PNG أو JPG أو WebP. كل شيء في المتصفح.",
    "reselect": "صورة أخرى",
    "download": "تنزيل الصورة",
    "sourceSize": "المصدر",
    "modeTitle": "نوع العلامة",
    "modeText": "نص",
    "modeImage": "صورة",
    "textLabel": "نص العلامة",
    "textPlaceholder": "أدخل النص",
    "textDefault": "للمعاينة فقط",
    "color": "اللون",
    "bold": "عريض",
    "fontSize": "الحجم",
    "wmImage": "صورة العلامة",
    "pickWm": "اختر العلامة",
    "scale": "حجم العلامة",
    "positionTitle": "الموضع",
    "posTile": "تكرار مائل",
    "opacity": "الشفافية",
    "rotate": "تدوير",
    "margin": "الهامش",
    "tileGap": "الفراغ",
    "formatTitle": "صيغة التصدير",
    "qualityTitle": "الجودة",
    "msgNotImage": "اختر ملف صورة.",
    "msgNoText": "أدخل النص أولاً.",
    "msgNoWm": "اختر صورة العلامة أولاً.",
    "msgFail": "تعذر المعالجة."
  },
  "hi": {
    "title_page": "इमेज वॉटरमार्क",
    "desc": "टेक्स्ट या इमेज वॉटरमार्क जोड़ें, 3×3 ग्रिड या टाइल में रखें, फिर PNG, JPG या WebP निकालें। सब ब्राउज़र में रहता है।",
    "reselect": "दूसरी इमेज",
    "download": "इमेज डाउनलोड",
    "sourceSize": "स्रोत",
    "modeTitle": "वॉटरमार्क प्रकार",
    "modeText": "टेक्स्ट",
    "modeImage": "इमेज",
    "textLabel": "वॉटरमार्क टेक्स्ट",
    "textPlaceholder": "टेक्स्ट लिखें",
    "textDefault": "केवल पूर्वावलोकन",
    "color": "रंग",
    "bold": "बोल्ड",
    "fontSize": "आकार",
    "wmImage": "वॉटरमार्क इमेज",
    "pickWm": "वॉटरमार्क चुनें",
    "scale": "वॉटरमार्क आकार",
    "positionTitle": "स्थिति",
    "posTile": "तिरछी टाइल",
    "opacity": "पारदर्शिता",
    "rotate": "घुमाएँ",
    "margin": "मार्जिन",
    "tileGap": "अंतर",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "qualityTitle": "क्वालिटी",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgNoText": "पहले टेक्स्ट लिखें।",
    "msgNoWm": "पहले वॉटरमार्क इमेज चुनें।",
    "msgFail": "प्रोसेस असफल।"
  },
  "it": {
    "title_page": "Filigrana immagine",
    "desc": "Aggiungi testo o immagine, posiziona su griglia 3×3 o a piastrelle, poi esporta PNG, JPG o WebP. Tutto nel browser.",
    "reselect": "Altra immagine",
    "download": "Scarica immagine",
    "sourceSize": "Sorgente",
    "modeTitle": "Tipo di filigrana",
    "modeText": "Testo",
    "modeImage": "Immagine",
    "textLabel": "Testo della filigrana",
    "textPlaceholder": "Inserisci il testo",
    "textDefault": "Solo anteprima",
    "color": "Colore",
    "bold": "Grassetto",
    "fontSize": "Dimensione",
    "wmImage": "Immagine filigrana",
    "pickWm": "Scegli filigrana",
    "scale": "Dimensione filigrana",
    "positionTitle": "Posizione",
    "posTile": "Piastrelle in diagonale",
    "opacity": "Opacità",
    "rotate": "Ruota",
    "margin": "Margine",
    "tileGap": "Spazio",
    "formatTitle": "Formato di esportazione",
    "qualityTitle": "Qualità",
    "msgNotImage": "Scegli un file immagine.",
    "msgNoText": "Inserisci prima il testo.",
    "msgNoWm": "Scegli prima un’immagine filigrana.",
    "msgFail": "Elaborazione non riuscita."
  },
  "nl": {
    "title_page": "Afbeelding watermerk",
    "desc": "Voeg tekst of een afbeelding toe, plaats op een 3×3-raster of betegeld, en exporteer PNG, JPG of WebP. Alles in de browser.",
    "reselect": "Andere afbeelding",
    "download": "Afbeelding downloaden",
    "sourceSize": "Bron",
    "modeTitle": "Watermerktype",
    "modeText": "Tekst",
    "modeImage": "Afbeelding",
    "textLabel": "Watermerktekst",
    "textPlaceholder": "Tekst invoeren",
    "textDefault": "Alleen voorbeeld",
    "color": "Kleur",
    "bold": "Vet",
    "fontSize": "Grootte",
    "wmImage": "Watermerkafbeelding",
    "pickWm": "Watermerk kiezen",
    "scale": "Watermerkgrootte",
    "positionTitle": "Positie",
    "posTile": "Schuin betegelen",
    "opacity": "Dekking",
    "rotate": "Draaien",
    "margin": "Marge",
    "tileGap": "Tussenruimte",
    "formatTitle": "Exportformaat",
    "qualityTitle": "Kwaliteit",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgNoText": "Voer eerst tekst in.",
    "msgNoWm": "Kies eerst een watermerkafbeelding.",
    "msgFail": "Verwerken mislukt."
  },
  "tr": {
    "title_page": "Görüntü filigranı",
    "desc": "Metin veya görüntü filigranı ekleyin, 3×3 ızgara veya döşeme ile yerleştirin, PNG, JPG veya WebP alın. Hepsi tarayıcıda.",
    "reselect": "Başka görüntü",
    "download": "Görüntüyü indir",
    "sourceSize": "Kaynak",
    "modeTitle": "Filigran türü",
    "modeText": "Metin",
    "modeImage": "Görüntü",
    "textLabel": "Filigran metni",
    "textPlaceholder": "Metni yazın",
    "textDefault": "Yalnızca önizleme",
    "color": "Renk",
    "bold": "Kalın",
    "fontSize": "Boyut",
    "wmImage": "Filigran görüntüsü",
    "pickWm": "Filigran seç",
    "scale": "Filigran boyutu",
    "positionTitle": "Konum",
    "posTile": "Eğik döşeme",
    "opacity": "Opaklık",
    "rotate": "Döndür",
    "margin": "Kenar boşluğu",
    "tileGap": "Boşluk",
    "formatTitle": "Dışa aktarma biçimi",
    "qualityTitle": "Kalite",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgNoText": "Önce metni yazın.",
    "msgNoWm": "Önce bir filigran görüntüsü seçin.",
    "msgFail": "İşlem başarısız."
  },
  "vi": {
    "title_page": "Đóng dấu ảnh",
    "desc": "Thêm chữ hoặc ảnh làm watermark, đặt theo lưới 3×3 hoặc lát gạch, rồi xuất PNG, JPG hoặc WebP. Tất cả trong trình duyệt.",
    "reselect": "Ảnh khác",
    "download": "Tải ảnh",
    "sourceSize": "Gốc",
    "modeTitle": "Loại watermark",
    "modeText": "Chữ",
    "modeImage": "Ảnh",
    "textLabel": "Chữ watermark",
    "textPlaceholder": "Nhập chữ",
    "textDefault": "Chỉ xem trước",
    "color": "Màu",
    "bold": "Đậm",
    "fontSize": "Cỡ",
    "wmImage": "Ảnh watermark",
    "pickWm": "Chọn watermark",
    "scale": "Cỡ watermark",
    "positionTitle": "Vị trí",
    "posTile": "Lát chéo",
    "opacity": "Độ mờ",
    "rotate": "Xoay",
    "margin": "Lề",
    "tileGap": "Khoảng cách",
    "formatTitle": "Định dạng xuất",
    "qualityTitle": "Chất lượng",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgNoText": "Hãy nhập chữ trước.",
    "msgNoWm": "Hãy chọn ảnh watermark trước.",
    "msgFail": "Xử lý thất bại."
  },
  "th": {
    "title_page": "ใส่ลายน้ำรูป",
    "desc": "ใส่ลายน้ำข้อความหรือรูป วางแบบตาราง 3×3 หรือปูกระเบื้อง แล้วส่งออก PNG JPG หรือ WebP ทำในเบราว์เซอร์",
    "reselect": "เลือกรูปใหม่",
    "download": "ดาวน์โหลดรูป",
    "sourceSize": "ต้นฉบับ",
    "modeTitle": "ประเภทลายน้ำ",
    "modeText": "ข้อความ",
    "modeImage": "รูป",
    "textLabel": "ข้อความลายน้ำ",
    "textPlaceholder": "พิมพ์ข้อความ",
    "textDefault": "สำหรับพรีวิว",
    "color": "สี",
    "bold": "ตัวหนา",
    "fontSize": "ขนาด",
    "wmImage": "รูปลายน้ำ",
    "pickWm": "เลือกลายน้ำ",
    "scale": "ขนาดลายน้ำ",
    "positionTitle": "ตำแหน่ง",
    "posTile": "ปูเฉียง",
    "opacity": "ความทึบ",
    "rotate": "หมุน",
    "margin": "ขอบ",
    "tileGap": "ช่องว่าง",
    "formatTitle": "รูปแบบส่งออก",
    "qualityTitle": "คุณภาพ",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgNoText": "กรอกข้อความก่อน",
    "msgNoWm": "เลือกรูปลายน้ำก่อน",
    "msgFail": "ประมวลผลไม่สำเร็จ"
  },
  "id": {
    "title_page": "Tanda air gambar",
    "desc": "Tambah teks atau gambar, letakkan di kisi 3×3 atau ubin, lalu ekspor PNG, JPG, atau WebP. Semua di browser.",
    "reselect": "Gambar lain",
    "download": "Unduh gambar",
    "sourceSize": "Sumber",
    "modeTitle": "Jenis tanda air",
    "modeText": "Teks",
    "modeImage": "Gambar",
    "textLabel": "Teks tanda air",
    "textPlaceholder": "Tulis teks",
    "textDefault": "Hanya pratinjau",
    "color": "Warna",
    "bold": "Tebal",
    "fontSize": "Ukuran",
    "wmImage": "Gambar tanda air",
    "pickWm": "Pilih tanda air",
    "scale": "Ukuran tanda air",
    "positionTitle": "Posisi",
    "posTile": "Ubin miring",
    "opacity": "Opasitas",
    "rotate": "Putar",
    "margin": "Margin",
    "tileGap": "Jarak",
    "formatTitle": "Format ekspor",
    "qualityTitle": "Kualitas",
    "msgNotImage": "Pilih berkas gambar.",
    "msgNoText": "Tulis teks dulu.",
    "msgNoWm": "Pilih gambar tanda air dulu.",
    "msgFail": "Gagal memproses."
  },
  "ms": {
    "title_page": "Tera air imej",
    "desc": "Tambah teks atau imej, letak pada grid 3×3 atau jubin, kemudian eksport PNG, JPG atau WebP. Semua dalam pelayar.",
    "reselect": "Imej lain",
    "download": "Muat turun imej",
    "sourceSize": "Sumber",
    "modeTitle": "Jenis tera air",
    "modeText": "Teks",
    "modeImage": "Imej",
    "textLabel": "Teks tera air",
    "textPlaceholder": "Tulis teks",
    "textDefault": "Pratonton sahaja",
    "color": "Warna",
    "bold": "Tebal",
    "fontSize": "Saiz",
    "wmImage": "Imej tera air",
    "pickWm": "Pilih tera air",
    "scale": "Saiz tera air",
    "positionTitle": "Kedudukan",
    "posTile": "Jubin condong",
    "opacity": "Kelegapan",
    "rotate": "Putar",
    "margin": "Margin",
    "tileGap": "Jarak",
    "formatTitle": "Format eksport",
    "qualityTitle": "Kualiti",
    "msgNotImage": "Pilih fail imej.",
    "msgNoText": "Tulis teks dahulu.",
    "msgNoWm": "Pilih imej tera air dahulu.",
    "msgFail": "Gagal memproses."
  },
  "pl": {
    "title_page": "Znak wodny",
    "desc": "Dodaj tekst lub obraz, ustaw na siatce 3×3 albo kafelkami i eksportuj PNG, JPG lub WebP. Wszystko w przeglądarce.",
    "reselect": "Inny obraz",
    "download": "Pobierz obraz",
    "sourceSize": "Źródło",
    "modeTitle": "Typ znaku",
    "modeText": "Tekst",
    "modeImage": "Obraz",
    "textLabel": "Tekst znaku",
    "textPlaceholder": "Wpisz tekst",
    "textDefault": "Tylko podgląd",
    "color": "Kolor",
    "bold": "Pogrubienie",
    "fontSize": "Rozmiar",
    "wmImage": "Obraz znaku",
    "pickWm": "Wybierz znak",
    "scale": "Rozmiar znaku",
    "positionTitle": "Pozycja",
    "posTile": "Skośne kafelki",
    "opacity": "Krycie",
    "rotate": "Obrót",
    "margin": "Margines",
    "tileGap": "Odstęp",
    "formatTitle": "Format eksportu",
    "qualityTitle": "Jakość",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgNoText": "Najpierw wpisz tekst.",
    "msgNoWm": "Najpierw wybierz obraz znaku.",
    "msgFail": "Przetwarzanie nie powiodło się."
  },
  "uk": {
    "title_page": "Водяний знак",
    "desc": "Додайте текст або зображення, поставте на сітці 3×3 чи плиткою й експортуйте PNG, JPG або WebP. Усе в браузері.",
    "reselect": "Інше фото",
    "download": "Завантажити зображення",
    "sourceSize": "Джерело",
    "modeTitle": "Тип знака",
    "modeText": "Текст",
    "modeImage": "Зображення",
    "textLabel": "Текст знака",
    "textPlaceholder": "Введіть текст",
    "textDefault": "Лише перегляд",
    "color": "Колір",
    "bold": "Жирний",
    "fontSize": "Розмір",
    "wmImage": "Зображення знака",
    "pickWm": "Вибрати знак",
    "scale": "Розмір знака",
    "positionTitle": "Позиція",
    "posTile": "Коса плитка",
    "opacity": "Прозорість",
    "rotate": "Поворот",
    "margin": "Відступ",
    "tileGap": "Проміжок",
    "formatTitle": "Формат експорту",
    "qualityTitle": "Якість",
    "msgNotImage": "Виберіть файл зображення.",
    "msgNoText": "Спочатку введіть текст.",
    "msgNoWm": "Спочатку виберіть зображення знака.",
    "msgFail": "Не вдалося обробити."
  },
  "sv": {
    "title_page": "Bildvattenstämpel",
    "desc": "Lägg till text eller bild, placera på ett 3×3-rutnät eller som plattor och exportera PNG, JPG eller WebP. Allt i webbläsaren.",
    "reselect": "Annan bild",
    "download": "Ladda ner bild",
    "sourceSize": "Källa",
    "modeTitle": "Vattenstämpeltyp",
    "modeText": "Text",
    "modeImage": "Bild",
    "textLabel": "Vattenstämpeltext",
    "textPlaceholder": "Skriv texten",
    "textDefault": "Endast förhandsvisning",
    "color": "Färg",
    "bold": "Fet",
    "fontSize": "Storlek",
    "wmImage": "Vattenstämpelbild",
    "pickWm": "Välj vattenstämpel",
    "scale": "Vattenstämpelstorlek",
    "positionTitle": "Position",
    "posTile": "Sned kakel",
    "opacity": "Opacitet",
    "rotate": "Rotera",
    "margin": "Marginal",
    "tileGap": "Mellanrum",
    "formatTitle": "Exportformat",
    "qualityTitle": "Kvalitet",
    "msgNotImage": "Välj en bildfil.",
    "msgNoText": "Skriv texten först.",
    "msgNoWm": "Välj en vattenstämpelbild först.",
    "msgFail": "Bearbetningen misslyckades."
  },
  "zh-TW": {
    "title_page": "圖片加水印",
    "desc": "拖入圖片後加入文字或圖片浮水印，可九宮格定位或斜向平鋪，再匯出 PNG / JPG / WebP。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "download": "下載圖片",
    "sourceSize": "原圖",
    "modeTitle": "浮水印類型",
    "modeText": "文字",
    "modeImage": "圖片",
    "textLabel": "浮水印文字",
    "textPlaceholder": "輸入浮水印內容",
    "textDefault": "僅供預覽",
    "color": "顏色",
    "bold": "加粗",
    "fontSize": "字級",
    "wmImage": "浮水印圖片",
    "pickWm": "選擇浮水印圖",
    "scale": "浮水印大小",
    "positionTitle": "位置",
    "posTile": "斜向平鋪鋪滿",
    "opacity": "透明度",
    "rotate": "旋轉",
    "margin": "邊距",
    "tileGap": "間距",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "msgNotImage": "請選擇圖片檔。",
    "msgNoText": "請先填寫浮水印文字。",
    "msgNoWm": "請先選擇浮水印圖片。",
    "msgFail": "處理失敗。"
  }
}
</i18n>
