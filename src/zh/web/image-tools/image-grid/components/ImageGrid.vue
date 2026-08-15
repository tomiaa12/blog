<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import JSZip from "jszip"
import FileUpload from "@/components/FileUpload.vue"

const { t } = useI18n()

type Mode = "split" | "join"
type GridKey = "2" | "3" | "4" | "custom"
type Fit = "cover" | "contain"
type ExportFmt = "png" | "jpeg" | "webp"

type Item = {
  id: number
  url: string
  name: string
  img: HTMLImageElement
}

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"

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

const mode = ref<Mode>("split")
const gridKey = ref<GridKey>("3")
const customRows = ref(3)
const customCols = ref(3)
const items = ref<Item[]>([])
const fit = ref<Fit>("cover")
const gap = ref(8)
const pad = ref(0)
const bg = ref("#ffffff")
const outW = ref(1080)
const format = ref<ExportFmt>("png")
const quality = ref(0.92)

const previewRef = ref<HTMLCanvasElement | null>(null)
const previewHost = ref<HTMLElement | null>(null)

let idSeq = 1
let redrawTimer: ReturnType<typeof setTimeout> | null = null
let hostRo: ResizeObserver | null = null

const rows = computed(() => {
  if (gridKey.value === "custom") return clampRC(customRows.value)
  return Number(gridKey.value)
})
const cols = computed(() => {
  if (gridKey.value === "custom") return clampRC(customCols.value)
  return Number(gridKey.value)
})
const cellCount = computed(() => rows.value * cols.value)
const src = computed(() => items.value[0] ?? null)
const joinItems = computed(() => items.value.slice(0, cellCount.value))
const needQuality = computed(() => format.value !== "png")
const hasWork = computed(() =>
  mode.value === "split" ? !!src.value : items.value.length > 0
)

function clampRC(n: number) {
  return Math.min(8, Math.max(1, Math.round(n) || 1))
}

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true
  return /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("img"))
    img.src = url
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

function sliceBox(total: number, count: number, i: number) {
  const base = Math.floor(total / count)
  const x = i * base
  const size = i === count - 1 ? total - x : base
  return { x, size: Math.max(1, size) }
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const ir = img.naturalWidth / img.naturalHeight
  const cr = w / h
  let sx = 0
  let sy = 0
  let sw = img.naturalWidth
  let sh = img.naturalHeight
  if (ir > cr) {
    sw = sh * cr
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = sw / cr
    sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const s = Math.min(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * s
  const dh = img.naturalHeight * s
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

function joinLayout(width: number) {
  const inner = Math.max(1, width - pad.value * 2 - gap.value * (cols.value - 1))
  const cell = inner / cols.value
  const height =
    pad.value * 2 + cell * rows.value + gap.value * (rows.value - 1)
  return {
    w: Math.max(1, Math.round(width)),
    h: Math.max(1, Math.round(height)),
    cell: Math.max(1, cell),
  }
}

function paintJoin(canvas: HTMLCanvasElement, width: number) {
  const { w, h, cell } = joinLayout(width)
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return false
  ctx.fillStyle = bg.value
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < cellCount.value; i++) {
    const c = i % cols.value
    const r = Math.floor(i / cols.value)
    const x = pad.value + c * (cell + gap.value)
    const y = pad.value + r * (cell + gap.value)
    const it = joinItems.value[i]
    if (!it) continue
    if (fit.value === "cover") drawCover(ctx, it.img, x, y, cell, cell)
    else drawContain(ctx, it.img, x, y, cell, cell)
  }
  return true
}

function paintSplitPreview(canvas: HTMLCanvasElement, hostW: number, hostH: number) {
  const img = src.value?.img
  if (!img) return false
  const s = Math.min(hostW / img.naturalWidth, hostH / img.naturalHeight, 1)
  const w = Math.max(1, Math.round(img.naturalWidth * s))
  const h = Math.max(1, Math.round(img.naturalHeight * s))
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return false
  ctx.drawImage(img, 0, 0, w, h)
  ctx.strokeStyle = "rgba(67, 142, 219, 0.9)"
  ctx.lineWidth = 1
  for (let c = 1; c < cols.value; c++) {
    const x = Math.round((w * c) / cols.value) + 0.5
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let r = 1; r < rows.value; r++) {
    const y = Math.round((h * r) / rows.value) + 0.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.fillStyle = "rgba(15, 17, 21, 0.45)"
  ctx.font = `${Math.max(12, Math.round(Math.min(w, h) / 18))}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  for (let i = 0; i < cellCount.value; i++) {
    const c = i % cols.value
    const r = Math.floor(i / cols.value)
    const x = ((c + 0.5) * w) / cols.value
    const y = ((r + 0.5) * h) / rows.value
    ctx.fillText(String(i + 1), x, y)
  }
  return true
}

function drawPreview() {
  const canvas = previewRef.value
  const host = previewHost.value
  if (!canvas || !host || !hasWork.value) return
  const hw = host.clientWidth || 640
  const hh = host.clientHeight || 420
  if (mode.value === "split") {
    paintSplitPreview(canvas, hw, hh)
    return
  }
  const full = joinLayout(outW.value)
  const s = Math.min(hw / full.w, hh / full.h, 1)
  paintJoin(canvas, Math.max(1, Math.round(full.w * s)))
}

function scheduleDraw() {
  if (redrawTimer) clearTimeout(redrawTimer)
  redrawTimer = setTimeout(drawPreview, 40)
}

async function addFiles(files: File[]) {
  const list = files.filter(isImageFile)
  if (!list.length) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  if (mode.value === "split") {
    resetItems()
    const file = list[0]!
    const url = URL.createObjectURL(file)
    try {
      const img = await loadImage(url)
      items.value = [{ id: idSeq++, url, name: file.name, img }]
    } catch {
      URL.revokeObjectURL(url)
      ElMessage({ message: t("msgFail"), type: "error" })
    }
    await nextTick()
    scheduleDraw()
    return
  }
  for (const file of list) {
    if (items.value.length >= cellCount.value) break
    const url = URL.createObjectURL(file)
    try {
      const img = await loadImage(url)
      items.value.push({ id: idSeq++, url, name: file.name, img })
    } catch {
      URL.revokeObjectURL(url)
    }
  }
  await nextTick()
  scheduleDraw()
}

function resetItems() {
  for (const it of items.value) URL.revokeObjectURL(it.url)
  items.value = []
}

function reset() {
  resetItems()
}

function removeAt(i: number) {
  const [gone] = items.value.splice(i, 1)
  if (gone) URL.revokeObjectURL(gone.url)
  scheduleDraw()
}

function move(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= items.value.length) return
  const list = items.value
  const tmp = list[i]!
  list[i] = list[j]!
  list[j] = tmp
  scheduleDraw()
}

function setMode(next: Mode) {
  if (mode.value === next) return
  mode.value = next
  resetItems()
}

function setGrid(key: GridKey) {
  gridKey.value = key
  if (key !== "custom") {
    customRows.value = Number(key)
    customCols.value = Number(key)
  }
}

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

async function downloadJoin() {
  if (!items.value.length) {
    ElMessage({ message: t("msgNeed"), type: "warning" })
    return
  }
  const canvas = document.createElement("canvas")
  if (!paintJoin(canvas, outW.value)) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `grid-${rows.value}x${cols.value}.${EXT[format.value]}`)
}

async function downloadSplit() {
  const img = src.value?.img
  if (!img) {
    ElMessage({ message: t("msgNeed"), type: "warning" })
    return
  }
  const zip = new JSZip()
  const ext = EXT[format.value]
  for (let i = 0; i < cellCount.value; i++) {
    const c = i % cols.value
    const r = Math.floor(i / cols.value)
    const xb = sliceBox(img.naturalWidth, cols.value, c)
    const yb = sliceBox(img.naturalHeight, rows.value, r)
    const canvas = document.createElement("canvas")
    canvas.width = xb.size
    canvas.height = yb.size
    const ctx = canvas.getContext("2d")
    if (!ctx) continue
    ctx.drawImage(img, xb.x, yb.x, xb.size, yb.size, 0, 0, xb.size, yb.size)
    const blob = await canvasToBlob(canvas)
    if (blob) zip.file(`grid-${String(i + 1).padStart(2, "0")}.${ext}`, blob)
  }
  const out = await zip.generateAsync({ type: "blob" })
  saveBlob(out, `grid-split-${rows.value}x${cols.value}.zip`)
}

function download() {
  if (mode.value === "split") void downloadSplit()
  else void downloadJoin()
}

watch([mode, rows, cols, fit, gap, pad, bg, outW, format], scheduleDraw)

watch(hasWork, async on => {
  hostRo?.disconnect()
  hostRo = null
  if (!on) return
  await nextTick()
  if (previewHost.value && typeof ResizeObserver !== "undefined") {
    hostRo = new ResizeObserver(() => scheduleDraw())
    hostRo.observe(previewHost.value)
  }
  scheduleDraw()
})

onUnmounted(() => {
  if (redrawTimer) clearTimeout(redrawTimer)
  hostRo?.disconnect()
  resetItems()
})
</script>

<template>
  <div class="gd-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="mode-bar">
      <el-radio-group
        :model-value="mode"
        @change="(v: string) => setMode(v as Mode)"
      >
        <el-radio-button value="split">{{ t("modeSplit") }}</el-radio-button>
        <el-radio-button value="join">{{ t("modeJoin") }}</el-radio-button>
      </el-radio-group>
    </div>

    <FileUpload
      v-if="!hasWork"
      :multiple="mode === 'join'"
      :folder="false"
      :accept="ACCEPT"
      @files-added="addFiles"
    />

    <template v-else>
      <div class="toolbar">
        <FileUpload
          v-if="mode === 'join'"
          type="button"
          :folder="false"
          :accept="ACCEPT"
          @files-added="addFiles"
        />
        <el-button @click="reset">{{ t("reselect") }}</el-button>
        <el-button
          type="primary"
          @click="download"
        >
          {{ mode === "split" ? t("downloadAll") : t("download") }}
        </el-button>
        <span class="meta">
          {{ rows }} × {{ cols }}
          <template v-if="mode === 'join'">
            · {{ t("count", { n: joinItems.length, m: cellCount }) }}
          </template>
        </span>
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
          <h2 class="sub">{{ t("gridTitle") }}</h2>
          <div class="chips">
            <el-button
              size="small"
              :type="gridKey === '2' ? 'primary' : 'default'"
              @click="setGrid('2')"
            >
              2 × 2
            </el-button>
            <el-button
              size="small"
              :type="gridKey === '3' ? 'primary' : 'default'"
              @click="setGrid('3')"
            >
              3 × 3
            </el-button>
            <el-button
              size="small"
              :type="gridKey === '4' ? 'primary' : 'default'"
              @click="setGrid('4')"
            >
              4 × 4
            </el-button>
            <el-button
              size="small"
              :type="gridKey === 'custom' ? 'primary' : 'default'"
              @click="setGrid('custom')"
            >
              {{ t("gridCustom") }}
            </el-button>
          </div>
          <div
            v-if="gridKey === 'custom'"
            class="custom-row"
          >
            <el-input-number
              v-model="customRows"
              :min="1"
              :max="8"
              :step="1"
              controls-position="right"
            />
            <span>×</span>
            <el-input-number
              v-model="customCols"
              :min="1"
              :max="8"
              :step="1"
              controls-position="right"
            />
          </div>
          <p class="hint">
            {{ mode === "split" ? t("hintSplit") : t("hintJoin") }}
          </p>

          <template v-if="mode === 'join'">
            <h2 class="sub">{{ t("fitTitle") }}</h2>
            <el-radio-group
              v-model="fit"
              class="fmt-group"
            >
              <el-radio-button value="cover">{{ t("fitCover") }}</el-radio-button>
              <el-radio-button value="contain">{{ t("fitContain") }}</el-radio-button>
            </el-radio-group>

            <h2 class="sub">{{ t("gap") }} {{ gap }}px</h2>
            <el-slider
              v-model="gap"
              :min="0"
              :max="48"
              :step="1"
              :show-tooltip="false"
            />

            <h2 class="sub">{{ t("pad") }} {{ pad }}px</h2>
            <el-slider
              v-model="pad"
              :min="0"
              :max="48"
              :step="1"
              :show-tooltip="false"
            />

            <h2 class="sub">{{ t("bg") }}</h2>
            <el-color-picker v-model="bg" />

            <h2 class="sub">{{ t("outW") }} {{ outW }}px</h2>
            <el-slider
              v-model="outW"
              :min="480"
              :max="4096"
              :step="8"
              :show-tooltip="false"
            />

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
          </template>

          <template v-else>
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
          </template>
        </div>
      </div>

      <div
        v-if="mode === 'join' && items.length"
        class="thumbs"
      >
        <div
          v-for="(it, i) in items"
          :key="it.id"
          class="thumb"
        >
          <img
            :src="it.url"
            alt=""
          />
          <span class="idx">{{ i + 1 }}</span>
          <div class="thumb-acts">
            <el-button
              size="small"
              :disabled="i === 0"
              @click="move(i, -1)"
            >
              ←
            </el-button>
            <el-button
              size="small"
              :disabled="i === items.length - 1"
              @click="move(i, 1)"
            >
              →
            </el-button>
            <el-button
              size="small"
              @click="removeAt(i)"
            >
              {{ t("remove") }}
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.gd-page {
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
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.mode-bar {
  margin-bottom: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sub {
  margin: 8px 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.custom-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fmt-group {
  display: flex;
  flex-wrap: wrap;
}

.hint {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.thumbs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.thumb {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);

  img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
}

.idx {
  position: absolute;
  top: 6px;
  left: 6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  background: rgba(15, 17, 21, 0.55);
}

.thumb-acts {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px;

  :deep(.el-button) {
    margin-left: 0;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片宫格",
    "desc": "把一张图切成四宫格、九宫格或自定义行列，也可以把多张图拼成宫格。适合朋友圈九宫格。处理都在浏览器本地完成。",
    "modeSplit": "切成宫格",
    "modeJoin": "拼成宫格",
    "gridTitle": "格子",
    "gridCustom": "自定义",
    "reselect": "清空重选",
    "download": "下载拼图",
    "downloadAll": "下载全部格子",
    "count": "{n} / {m} 格",
    "fitTitle": "填充",
    "fitCover": "铺满",
    "fitContain": "完整",
    "gap": "间距",
    "pad": "边距",
    "bg": "底色",
    "outW": "输出宽度",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "hintSplit": "按原图像素均分切割，余数给最后一行和最后一列，打包成 ZIP。",
    "hintJoin": "按从左到右、从上到下填入格子，格子默认正方形。",
    "remove": "移除",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。",
    "msgNeed": "请先添加图片。"
  },
  "zh-CN": {
    "title_page": "图片宫格",
    "desc": "把一张图切成四宫格、九宫格或自定义行列，也可以把多张图拼成宫格。适合朋友圈九宫格。处理都在浏览器本地完成。",
    "modeSplit": "切成宫格",
    "modeJoin": "拼成宫格",
    "gridTitle": "格子",
    "gridCustom": "自定义",
    "reselect": "清空重选",
    "download": "下载拼图",
    "downloadAll": "下载全部格子",
    "count": "{n} / {m} 格",
    "fitTitle": "填充",
    "fitCover": "铺满",
    "fitContain": "完整",
    "gap": "间距",
    "pad": "边距",
    "bg": "底色",
    "outW": "输出宽度",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "hintSplit": "按原图像素均分切割，余数给最后一行和最后一列，打包成 ZIP。",
    "hintJoin": "按从左到右、从上到下填入格子，格子默认正方形。",
    "remove": "移除",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。",
    "msgNeed": "请先添加图片。"
  },
  "en": {
    "title_page": "Image grid",
    "desc": "Split one photo into a 2×2, 3×3, or custom grid, or stitch several photos into a grid. Handy for social posts. Everything stays in your browser.",
    "modeSplit": "Split",
    "modeJoin": "Join",
    "gridTitle": "Grid",
    "gridCustom": "Custom",
    "reselect": "Clear all",
    "download": "Download grid",
    "downloadAll": "Download tiles",
    "count": "{n} / {m} cells",
    "fitTitle": "Fit",
    "fitCover": "Cover",
    "fitContain": "Contain",
    "gap": "Gap",
    "pad": "Padding",
    "bg": "Background",
    "outW": "Output width",
    "formatTitle": "Format",
    "qualityTitle": "Quality",
    "hintSplit": "Slices the original pixels evenly. Leftover pixels go to the last row and column, then zip.",
    "hintJoin": "Fills cells left to right, top to bottom. Cells are square.",
    "remove": "Remove",
    "msgNotImage": "Please choose image files.",
    "msgFail": "Could not process the image.",
    "msgNeed": "Add an image first."
  },
  "ja": {
    "title_page": "画像グリッド",
    "desc": "1枚を 2×2・3×3・任意の行列に分割、または複数枚をグリッドに合成。SNS の九宮格向け。処理はブラウザ内です。",
    "modeSplit": "分割",
    "modeJoin": "合成",
    "gridTitle": "グリッド",
    "gridCustom": "カスタム",
    "reselect": "クリア",
    "download": "合成を保存",
    "downloadAll": "タイルを保存",
    "count": "{n} / {m} マス",
    "fitTitle": "フィット",
    "fitCover": "覆う",
    "fitContain": "全体",
    "gap": "間隔",
    "pad": "余白",
    "bg": "背景",
    "outW": "出力幅",
    "formatTitle": "形式",
    "qualityTitle": "画質",
    "hintSplit": "元画像を均等に切り、余りは最終行・列へ。ZIP で保存します。",
    "hintJoin": "左上から順に正方形のマスへ入れます。",
    "remove": "削除",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "処理に失敗しました。",
    "msgNeed": "先に画像を追加してください。"
  },
  "ko": {
    "title_page": "이미지 격자",
    "desc": "한 장을 2×2, 3×3 또는 사용자 지정 격자로 자르거나, 여러 장을 격자로 붙입니다. 브라우저에서 처리됩니다.",
    "modeSplit": "자르기",
    "modeJoin": "붙이기",
    "gridTitle": "격자",
    "gridCustom": "사용자 지정",
    "reselect": "모두 지우기",
    "download": "격자 다운로드",
    "downloadAll": "조각 다운로드",
    "count": "{n} / {m}칸",
    "fitTitle": "맞춤",
    "fitCover": "채우기",
    "fitContain": "전체",
    "gap": "간격",
    "pad": "여백",
    "bg": "배경",
    "outW": "출력 너비",
    "formatTitle": "형식",
    "qualityTitle": "품질",
    "hintSplit": "원본 픽셀을 균등하게 자르고 나머지는 마지막 행/열에 넣은 뒤 ZIP으로 묶습니다.",
    "hintJoin": "왼쪽 위부터 정사각형 칸에 채웁니다.",
    "remove": "제거",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "처리에 실패했습니다.",
    "msgNeed": "먼저 이미지를 추가하세요."
  },
  "fr": {
    "title_page": "Grille d’images",
    "desc": "Découpez une photo en 2×2, 3×3 ou grille perso, ou assemblez plusieurs photos. Idéal pour les publications. Tout reste local.",
    "modeSplit": "Découper",
    "modeJoin": "Assembler",
    "gridTitle": "Grille",
    "gridCustom": "Perso",
    "reselect": "Tout effacer",
    "download": "Télécharger la grille",
    "downloadAll": "Télécharger les tuiles",
    "count": "{n} / {m} cases",
    "fitTitle": "Ajustement",
    "fitCover": "Couvrir",
    "fitContain": "Contenir",
    "gap": "Écart",
    "pad": "Marge",
    "bg": "Fond",
    "outW": "Largeur de sortie",
    "formatTitle": "Format",
    "qualityTitle": "Qualité",
    "hintSplit": "Coupe les pixels d’origine à parts égales. Le reste va à la dernière ligne et colonne, puis ZIP.",
    "hintJoin": "Remplit de gauche à droite, de haut en bas. Cases carrées.",
    "remove": "Retirer",
    "msgNotImage": "Choisissez des fichiers image.",
    "msgFail": "Échec du traitement.",
    "msgNeed": "Ajoutez d’abord une image."
  },
  "de": {
    "title_page": "Bildraster",
    "desc": "Ein Bild in 2×2, 3×3 oder ein eigenes Raster schneiden – oder mehrere Bilder zusammenfügen. Alles bleibt im Browser.",
    "modeSplit": "Teilen",
    "modeJoin": "Fügen",
    "gridTitle": "Raster",
    "gridCustom": "Eigene",
    "reselect": "Alles leeren",
    "download": "Raster laden",
    "downloadAll": "Kacheln laden",
    "count": "{n} / {m} Felder",
    "fitTitle": "Einpassen",
    "fitCover": "Füllen",
    "fitContain": "Ganz",
    "gap": "Abstand",
    "pad": "Rand",
    "bg": "Hintergrund",
    "outW": "Ausgabebreite",
    "formatTitle": "Format",
    "qualityTitle": "Qualität",
    "hintSplit": "Teilt die Originalpixel gleichmäßig. Rest geht in die letzte Zeile und Spalte, dann ZIP.",
    "hintJoin": "Füllt von links oben. Felder sind quadratisch.",
    "remove": "Entfernen",
    "msgNotImage": "Bitte Bilddateien wählen.",
    "msgFail": "Verarbeitung fehlgeschlagen.",
    "msgNeed": "Zuerst ein Bild hinzufügen."
  },
  "es": {
    "title_page": "Cuadrícula de imágenes",
    "desc": "Parte una foto en 2×2, 3×3 o una cuadrícula propia, o une varias fotos. Pensado para publicaciones. Todo es local.",
    "modeSplit": "Partir",
    "modeJoin": "Unir",
    "gridTitle": "Cuadrícula",
    "gridCustom": "Personal",
    "reselect": "Vaciar",
    "download": "Descargar unión",
    "downloadAll": "Descargar piezas",
    "count": "{n} / {m} celdas",
    "fitTitle": "Ajuste",
    "fitCover": "Cubrir",
    "fitContain": "Contener",
    "gap": "Hueco",
    "pad": "Margen",
    "bg": "Fondo",
    "outW": "Ancho de salida",
    "formatTitle": "Formato",
    "qualityTitle": "Calidad",
    "hintSplit": "Corta los píxeles originales por igual. El resto va a la última fila y columna, luego ZIP.",
    "hintJoin": "Rellena de izquierda a derecha y de arriba abajo. Celdas cuadradas.",
    "remove": "Quitar",
    "msgNotImage": "Elige archivos de imagen.",
    "msgFail": "Error al procesar.",
    "msgNeed": "Añade una imagen primero."
  },
  "pt": {
    "title_page": "Grade de imagens",
    "desc": "Corte uma foto em 2×2, 3×3 ou grade personalizada, ou una várias fotos. Ideal para posts. Tudo no navegador.",
    "modeSplit": "Cortar",
    "modeJoin": "Unir",
    "gridTitle": "Grade",
    "gridCustom": "Personalizar",
    "reselect": "Limpar tudo",
    "download": "Baixar grade",
    "downloadAll": "Baixar peças",
    "count": "{n} / {m} células",
    "fitTitle": "Encaixe",
    "fitCover": "Cobrir",
    "fitContain": "Conter",
    "gap": "Espaço",
    "pad": "Margem",
    "bg": "Fundo",
    "outW": "Largura de saída",
    "formatTitle": "Formato",
    "qualityTitle": "Qualidade",
    "hintSplit": "Divide os pixels originais por igual. O resto vai para a última linha e coluna, depois ZIP.",
    "hintJoin": "Preenche da esquerda para a direita, de cima para baixo. Células quadradas.",
    "remove": "Remover",
    "msgNotImage": "Escolha arquivos de imagem.",
    "msgFail": "Falha no processamento.",
    "msgNeed": "Adicione uma imagem primeiro."
  },
  "ru": {
    "title_page": "Сетка изображений",
    "desc": "Разрежьте фото на 2×2, 3×3 или свою сетку — или склейте несколько фото. Удобно для постов. Всё локально.",
    "modeSplit": "Разрезать",
    "modeJoin": "Склеить",
    "gridTitle": "Сетка",
    "gridCustom": "Своя",
    "reselect": "Очистить",
    "download": "Скачать сетку",
    "downloadAll": "Скачать плитки",
    "count": "{n} / {m} ячеек",
    "fitTitle": "Вписать",
    "fitCover": "Заполнить",
    "fitContain": "Целиком",
    "gap": "Зазор",
    "pad": "Поля",
    "bg": "Фон",
    "outW": "Ширина выхода",
    "formatTitle": "Формат",
    "qualityTitle": "Качество",
    "hintSplit": "Делит исходные пиксели поровну. Остаток — в последнюю строку и столбец, затем ZIP.",
    "hintJoin": "Заполняет слева направо, сверху вниз. Ячейки квадратные.",
    "remove": "Убрать",
    "msgNotImage": "Выберите файлы изображений.",
    "msgFail": "Ошибка обработки.",
    "msgNeed": "Сначала добавьте изображение."
  },
  "ar": {
    "title_page": "شبكة الصور",
    "desc": "قسّم صورة إلى 2×2 أو 3×3 أو شبكة مخصصة، أو اجمع عدة صور. مناسب للمنشورات. كل شيء محلي.",
    "modeSplit": "تقسيم",
    "modeJoin": "دمج",
    "gridTitle": "الشبكة",
    "gridCustom": "مخصص",
    "reselect": "مسح الكل",
    "download": "تنزيل الشبكة",
    "downloadAll": "تنزيل البلاطات",
    "count": "{n} / {m} خانة",
    "fitTitle": "الملاءمة",
    "fitCover": "ملء",
    "fitContain": "احتواء",
    "gap": "الفراغ",
    "pad": "الهامش",
    "bg": "الخلفية",
    "outW": "عرض الإخراج",
    "formatTitle": "الصيغة",
    "qualityTitle": "الجودة",
    "hintSplit": "يقسم بكسلات الأصل بالتساوي. الباقي للصف والعمود الأخيرين ثم ZIP.",
    "hintJoin": "يملأ من اليسار لليمين ومن الأعلى للأسفل. الخانات مربعة.",
    "remove": "إزالة",
    "msgNotImage": "اختر ملفات صور.",
    "msgFail": "فشل المعالجة.",
    "msgNeed": "أضف صورة أولاً."
  },
  "hi": {
    "title_page": "छवि ग्रिड",
    "desc": "एक फ़ोटो को 2×2, 3×3 या कस्टम ग्रिड में काटें, या कई फ़ोटो जोड़ें। पोस्ट के लिए सुविधाजनक। सब कुछ ब्राउज़र में रहता है।",
    "modeSplit": "काटें",
    "modeJoin": "जोड़ें",
    "gridTitle": "ग्रिड",
    "gridCustom": "कस्टम",
    "reselect": "सब साफ़ करें",
    "download": "ग्रिड डाउनलोड",
    "downloadAll": "टाइल डाउनलोड",
    "count": "{n} / {m} सेल",
    "fitTitle": "फिट",
    "fitCover": "ढकें",
    "fitContain": "पूरा",
    "gap": "अंतर",
    "pad": "पैडिंग",
    "bg": "पृष्ठभूमि",
    "outW": "आउटपुट चौड़ाई",
    "formatTitle": "प्रारूप",
    "qualityTitle": "गुणवत्ता",
    "hintSplit": "मूल पिक्सेल बराबर काटे जाते हैं। बचा हुआ अंतिम पंक्ति और स्तंभ में, फिर ZIP।",
    "hintJoin": "बाएँ से दाएँ, ऊपर से नीचे भरता है। सेल वर्ग होते हैं।",
    "remove": "हटाएँ",
    "msgNotImage": "कृपया छवि फ़ाइलें चुनें।",
    "msgFail": "प्रसंस्करण असफल।",
    "msgNeed": "पहले एक छवि जोड़ें।"
  },
  "it": {
    "title_page": "Griglia immagini",
    "desc": "Dividi una foto in 2×2, 3×3 o griglia personalizzata, oppure unisci più foto. Utile per i post. Tutto resta nel browser.",
    "modeSplit": "Dividi",
    "modeJoin": "Unisci",
    "gridTitle": "Griglia",
    "gridCustom": "Personalizza",
    "reselect": "Svuota",
    "download": "Scarica griglia",
    "downloadAll": "Scarica tessere",
    "count": "{n} / {m} celle",
    "fitTitle": "Adatta",
    "fitCover": "Copri",
    "fitContain": "Contieni",
    "gap": "Spazio",
    "pad": "Margine",
    "bg": "Sfondo",
    "outW": "Larghezza output",
    "formatTitle": "Formato",
    "qualityTitle": "Qualità",
    "hintSplit": "Taglia i pixel originali in parti uguali. Il resto va all’ultima riga e colonna, poi ZIP.",
    "hintJoin": "Riempie da sinistra a destra, dall’alto in basso. Celle quadrate.",
    "remove": "Rimuovi",
    "msgNotImage": "Scegli file immagine.",
    "msgFail": "Elaborazione non riuscita.",
    "msgNeed": "Aggiungi prima un’immagine."
  },
  "nl": {
    "title_page": "Afbeeldingsraster",
    "desc": "Knip een foto in 2×2, 3×3 of een eigen raster, of plak meerdere foto’s. Handig voor posts. Alles blijft lokaal.",
    "modeSplit": "Splitsen",
    "modeJoin": "Samenvoegen",
    "gridTitle": "Raster",
    "gridCustom": "Aangepast",
    "reselect": "Alles wissen",
    "download": "Raster downloaden",
    "downloadAll": "Tegels downloaden",
    "count": "{n} / {m} vakken",
    "fitTitle": "Passen",
    "fitCover": "Vullen",
    "fitContain": "Geheel",
    "gap": "Tussenruimte",
    "pad": "Marge",
    "bg": "Achtergrond",
    "outW": "Uitvoerbreedte",
    "formatTitle": "Formaat",
    "qualityTitle": "Kwaliteit",
    "hintSplit": "Deelt de originele pixels gelijk. Rest naar laatste rij en kolom, daarna ZIP.",
    "hintJoin": "Vult van links naar rechts, boven naar beneden. Vakken zijn vierkant.",
    "remove": "Verwijderen",
    "msgNotImage": "Kies afbeeldingsbestanden.",
    "msgFail": "Verwerken mislukt.",
    "msgNeed": "Voeg eerst een afbeelding toe."
  },
  "tr": {
    "title_page": "Görüntü ızgarası",
    "desc": "Bir fotoğrafı 2×2, 3×3 veya özel ızgaraya bölün ya da birkaç fotoğrafı birleştirin. Gönderiler için uygun. Hepsi yerelde kalır.",
    "modeSplit": "Böl",
    "modeJoin": "Birleştir",
    "gridTitle": "Izgara",
    "gridCustom": "Özel",
    "reselect": "Tümünü temizle",
    "download": "Izgara indir",
    "downloadAll": "Parçaları indir",
    "count": "{n} / {m} hücre",
    "fitTitle": "Sığdır",
    "fitCover": "Kapla",
    "fitContain": "Sığdır",
    "gap": "Boşluk",
    "pad": "Kenar",
    "bg": "Arka plan",
    "outW": "Çıktı genişliği",
    "formatTitle": "Biçim",
    "qualityTitle": "Kalite",
    "hintSplit": "Orijinal pikselleri eşit böler. Kalan son satır ve sütuna gider, sonra ZIP.",
    "hintJoin": "Soldan sağa, yukarıdan aşağı doldurur. Hücreler kare.",
    "remove": "Kaldır",
    "msgNotImage": "Lütfen görüntü dosyaları seçin.",
    "msgFail": "İşlem başarısız.",
    "msgNeed": "Önce bir görüntü ekleyin."
  },
  "vi": {
    "title_page": "Lưới ảnh",
    "desc": "Cắt một ảnh thành 2×2, 3×3 hoặc lưới tùy chỉnh, hoặc ghép nhiều ảnh. Phù hợp đăng bài. Xử lý ngay trên trình duyệt.",
    "modeSplit": "Cắt lưới",
    "modeJoin": "Ghép lưới",
    "gridTitle": "Lưới",
    "gridCustom": "Tùy chỉnh",
    "reselect": "Xóa hết",
    "download": "Tải lưới",
    "downloadAll": "Tải các ô",
    "count": "{n} / {m} ô",
    "fitTitle": "Vừa khít",
    "fitCover": "Phủ kín",
    "fitContain": "Nguyên ảnh",
    "gap": "Khoảng cách",
    "pad": "Lề",
    "bg": "Nền",
    "outW": "Chiều rộng xuất",
    "formatTitle": "Định dạng",
    "qualityTitle": "Chất lượng",
    "hintSplit": "Chia đều pixel gốc. Phần dư vào hàng và cột cuối, rồi ZIP.",
    "hintJoin": "Điền từ trái sang phải, trên xuống dưới. Ô hình vuông.",
    "remove": "Xóa",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Xử lý thất bại.",
    "msgNeed": "Hãy thêm ảnh trước."
  },
  "th": {
    "title_page": "ตารางรูปภาพ",
    "desc": "ตัดรูปเป็น 2×2 3×3 หรือตารางกำหนดเอง หรือต่อหลายรูปเป็นตาราง เหมาะกับโพสต์ ทำทั้งหมดในเบราว์เซอร์",
    "modeSplit": "ตัดตาราง",
    "modeJoin": "ต่อตาราง",
    "gridTitle": "ตาราง",
    "gridCustom": "กำหนดเอง",
    "reselect": "ล้างทั้งหมด",
    "download": "ดาวน์โหลดตาราง",
    "downloadAll": "ดาวน์โหลดช่อง",
    "count": "{n} / {m} ช่อง",
    "fitTitle": "การพอดี",
    "fitCover": "เต็มช่อง",
    "fitContain": "ทั้งรูป",
    "gap": "ช่องว่าง",
    "pad": "ขอบ",
    "bg": "พื้นหลัง",
    "outW": "ความกว้างส่งออก",
    "formatTitle": "รูปแบบ",
    "qualityTitle": "คุณภาพ",
    "hintSplit": "แบ่งพิกเซลต้นฉบับเท่า ๆ กัน ส่วนที่เหลือไปแถวและคอลัมน์สุดท้าย แล้ว ZIP",
    "hintJoin": "เติมซ้ายไปขวา บนลงล่าง ช่องเป็นสี่เหลี่ยมจัตุรัส",
    "remove": "ลบ",
    "msgNotImage": "โปรดเลือกไฟล์รูปภาพ",
    "msgFail": "ประมวลผลไม่สำเร็จ",
    "msgNeed": "เพิ่มรูปก่อน"
  },
  "id": {
    "title_page": "Kisi gambar",
    "desc": "Potong satu foto jadi 2×2, 3×3, atau kisi kustom, atau gabungkan beberapa foto. Cocok untuk unggahan. Semua di browser.",
    "modeSplit": "Potong",
    "modeJoin": "Gabung",
    "gridTitle": "Kisi",
    "gridCustom": "Kustom",
    "reselect": "Hapus semua",
    "download": "Unduh kisi",
    "downloadAll": "Unduh ubin",
    "count": "{n} / {m} sel",
    "fitTitle": "Paskan",
    "fitCover": "Isi",
    "fitContain": "Utuh",
    "gap": "Jarak",
    "pad": "Padding",
    "bg": "Latar",
    "outW": "Lebar keluaran",
    "formatTitle": "Format",
    "qualityTitle": "Kualitas",
    "hintSplit": "Membagi piksel asli merata. Sisa ke baris dan kolom terakhir, lalu ZIP.",
    "hintJoin": "Mengisi kiri ke kanan, atas ke bawah. Sel berbentuk persegi.",
    "remove": "Hapus",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Pemrosesan gagal.",
    "msgNeed": "Tambahkan gambar dulu."
  },
  "ms": {
    "title_page": "Grid imej",
    "desc": "Potong satu foto kepada 2×2, 3×3 atau grid tersuai, atau gabungkan beberapa foto. Sesuai untuk siaran. Semua kekal setempat.",
    "modeSplit": "Potong",
    "modeJoin": "Gabung",
    "gridTitle": "Grid",
    "gridCustom": "Tersuai",
    "reselect": "Kosongkan",
    "download": "Muat turun grid",
    "downloadAll": "Muat turun jubin",
    "count": "{n} / {m} sel",
    "fitTitle": "Muat",
    "fitCover": "Penuh",
    "fitContain": "Lengkap",
    "gap": "Jarak",
    "pad": "Padding",
    "bg": "Latar",
    "outW": "Lebar output",
    "formatTitle": "Format",
    "qualityTitle": "Kualiti",
    "hintSplit": "Membahagi piksel asal sama rata. Baki ke baris dan lajur terakhir, kemudian ZIP.",
    "hintJoin": "Mengisi kiri ke kanan, atas ke bawah. Sel berbentuk segi empat sama.",
    "remove": "Buang",
    "msgNotImage": "Sila pilih fail imej.",
    "msgFail": "Pemprosesan gagal.",
    "msgNeed": "Tambah imej dahulu."
  },
  "pl": {
    "title_page": "Siatka obrazów",
    "desc": "Podziel zdjęcie na 2×2, 3×3 lub własną siatkę albo sklej kilka zdjęć. Wygodne do postów. Wszystko lokalnie.",
    "modeSplit": "Podziel",
    "modeJoin": "Sklej",
    "gridTitle": "Siatka",
    "gridCustom": "Własna",
    "reselect": "Wyczyść",
    "download": "Pobierz siatkę",
    "downloadAll": "Pobierz kafelki",
    "count": "{n} / {m} pól",
    "fitTitle": "Dopasuj",
    "fitCover": "Wypełnij",
    "fitContain": "Całość",
    "gap": "Odstęp",
    "pad": "Margines",
    "bg": "Tło",
    "outW": "Szerokość wyjścia",
    "formatTitle": "Format",
    "qualityTitle": "Jakość",
    "hintSplit": "Dzieli oryginalne piksele równo. Reszta idzie do ostatniego wiersza i kolumny, potem ZIP.",
    "hintJoin": "Wypełnia od lewej do prawej, z góry na dół. Pola są kwadratowe.",
    "remove": "Usuń",
    "msgNotImage": "Wybierz pliki obrazów.",
    "msgFail": "Przetwarzanie nie powiodło się.",
    "msgNeed": "Najpierw dodaj obraz."
  },
  "uk": {
    "title_page": "Сітка зображень",
    "desc": "Розріжте фото на 2×2, 3×3 або власну сітку — або склейте кілька фото. Зручно для дописів. Усе локально.",
    "modeSplit": "Розрізати",
    "modeJoin": "Склеїти",
    "gridTitle": "Сітка",
    "gridCustom": "Своя",
    "reselect": "Очистити",
    "download": "Завантажити сітку",
    "downloadAll": "Завантажити плитки",
    "count": "{n} / {m} клітинок",
    "fitTitle": "Вписати",
    "fitCover": "Заповнити",
    "fitContain": "Цілком",
    "gap": "Проміжок",
    "pad": "Поля",
    "bg": "Тло",
    "outW": "Ширина виходу",
    "formatTitle": "Формат",
    "qualityTitle": "Якість",
    "hintSplit": "Ділить вихідні пікселі порівну. Залишок — в останній рядок і стовпець, потім ZIP.",
    "hintJoin": "Заповнює зліва направо, зверху вниз. Клітинки квадратні.",
    "remove": "Прибрати",
    "msgNotImage": "Оберіть файли зображень.",
    "msgFail": "Помилка обробки.",
    "msgNeed": "Спочатку додайте зображення."
  },
  "sv": {
    "title_page": "Bildrutnät",
    "desc": "Dela en bild i 2×2, 3×3 eller ett eget rutnät, eller sätt ihop flera bilder. Bra för inlägg. Allt stannar i webbläsaren.",
    "modeSplit": "Dela",
    "modeJoin": "Sätt ihop",
    "gridTitle": "Rutnät",
    "gridCustom": "Anpassat",
    "reselect": "Rensa allt",
    "download": "Ladda ner rutnät",
    "downloadAll": "Ladda ner rutor",
    "count": "{n} / {m} rutor",
    "fitTitle": "Anpassa",
    "fitCover": "Fyll",
    "fitContain": "Hel",
    "gap": "Mellanrum",
    "pad": "Marginal",
    "bg": "Bakgrund",
    "outW": "Utgångsbredd",
    "formatTitle": "Format",
    "qualityTitle": "Kvalitet",
    "hintSplit": "Delar originalpixlarna jämnt. Resten går till sista raden och kolumnen, sedan ZIP.",
    "hintJoin": "Fyller från vänster till höger, uppifrån och ner. Rutorna är kvadratiska.",
    "remove": "Ta bort",
    "msgNotImage": "Välj bildfiler.",
    "msgFail": "Bearbetningen misslyckades.",
    "msgNeed": "Lägg till en bild först."
  },
  "zh-TW": {
    "title_page": "圖片宮格",
    "desc": "把一張圖切成四宮格、九宮格或自訂行列，也可以把多張圖拼成宮格。適合社群九宮格。處理都在瀏覽器本機完成。",
    "modeSplit": "切成宮格",
    "modeJoin": "拼成宮格",
    "gridTitle": "格子",
    "gridCustom": "自訂",
    "reselect": "清空重選",
    "download": "下載拼圖",
    "downloadAll": "下載全部格子",
    "count": "{n} / {m} 格",
    "fitTitle": "填滿",
    "fitCover": "鋪滿",
    "fitContain": "完整",
    "gap": "間距",
    "pad": "邊距",
    "bg": "底色",
    "outW": "輸出寬度",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "hintSplit": "依原圖像素均分切割，餘數給最後一列與最後一行，再打包成 ZIP。",
    "hintJoin": "由左到右、由上到下填入格子，格子預設為正方形。",
    "remove": "移除",
    "msgNotImage": "請選擇圖片檔案。",
    "msgFail": "處理失敗。",
    "msgNeed": "請先新增圖片。"
  }
}
</i18n>
