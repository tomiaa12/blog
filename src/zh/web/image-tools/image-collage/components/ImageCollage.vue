<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"

const { t } = useI18n()

type ExportFmt = "png" | "jpeg" | "webp"
type Layout = "row" | "col" | "g2" | "g3" | "g4"
type Fit = "cover" | "contain"
type CellRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16"

type Item = {
  id: number
  url: string
  name: string
  img: HTMLImageElement
}

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

const CELL_RATIOS: { key: CellRatio; value: number }[] = [
  { key: "1:1", value: 1 },
  { key: "4:3", value: 4 / 3 },
  { key: "3:4", value: 3 / 4 },
  { key: "16:9", value: 16 / 9 },
  { key: "9:16", value: 9 / 16 },
]

const items = ref<Item[]>([])
const layout = ref<Layout>("g2")
const fit = ref<Fit>("cover")
const cellRatio = ref<CellRatio>("1:1")
const gap = ref(12)
const pad = ref(12)
const bg = ref("#ffffff")
const outW = ref(1920)
const format = ref<ExportFmt>("png")
const quality = ref(0.92)
const needQuality = computed(() => format.value !== "png")

const previewRef = ref<HTMLCanvasElement | null>(null)
const previewHost = ref<HTMLElement | null>(null)

let idSeq = 1
let redrawTimer: ReturnType<typeof setTimeout> | null = null
let hostRo: ResizeObserver | null = null

const cellAspect = computed(
  () => CELL_RATIOS.find(r => r.key === cellRatio.value)?.value ?? 1
)

function gridOf(n: number, lay: Layout) {
  if (n < 1) return { cols: 1, rows: 1 }
  if (lay === "row") return { cols: n, rows: 1 }
  if (lay === "col") return { cols: 1, rows: n }
  const cols = lay === "g2" ? 2 : lay === "g3" ? 3 : 4
  return { cols, rows: Math.ceil(n / cols) }
}

function canvasSize(n: number, width: number) {
  const { cols, rows } = gridOf(n, layout.value)
  const inner = Math.max(1, width - pad.value * 2 - gap.value * (cols - 1))
  const cellW = inner / cols
  const cellH = cellW / cellAspect.value
  const height = pad.value * 2 + cellH * rows + gap.value * (rows - 1)
  return {
    w: Math.max(1, Math.round(width)),
    h: Math.max(1, Math.round(height)),
    cols,
    rows,
    cellW,
    cellH,
  }
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("img"))
    img.src = url
  })
}

async function addFiles(files: File[]) {
  const list = files.filter(f => f.type.startsWith("image/"))
  if (!list.length) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  for (const file of list) {
    const url = URL.createObjectURL(file)
    try {
      const img = await loadImage(url)
      items.value.push({
        id: idSeq++,
        url,
        name: file.name,
        img,
      })
    } catch {
      URL.revokeObjectURL(url)
    }
  }
  if (!items.value.length) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  await nextTick()
  scheduleDraw()
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

function reset() {
  for (const it of items.value) URL.revokeObjectURL(it.url)
  items.value = []
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

function paint(canvas: HTMLCanvasElement, width: number) {
  const n = items.value.length
  if (!n) return false
  const { w, h, cols, cellW, cellH } = canvasSize(n, width)
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return false
  ctx.fillStyle = bg.value
  ctx.fillRect(0, 0, w, h)
  items.value.forEach((it, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    const x = pad.value + c * (cellW + gap.value)
    const y = pad.value + r * (cellH + gap.value)
    if (fit.value === "cover") drawCover(ctx, it.img, x, y, cellW, cellH)
    else drawContain(ctx, it.img, x, y, cellW, cellH)
  })
  return true
}

function drawPreview() {
  const canvas = previewRef.value
  const host = previewHost.value
  if (!canvas || !host || !items.value.length) return
  const full = canvasSize(items.value.length, outW.value)
  const s = Math.min(
    (host.clientWidth || 640) / full.w,
    (host.clientHeight || 420) / full.h,
    1
  )
  paint(canvas, Math.max(1, Math.round(full.w * s)))
}

function scheduleDraw() {
  if (redrawTimer) clearTimeout(redrawTimer)
  redrawTimer = setTimeout(drawPreview, 40)
}

watch([layout, fit, cellRatio, gap, pad, bg, outW, items], scheduleDraw, {
  deep: true,
})

watch(
  () => items.value.length,
  async n => {
    hostRo?.disconnect()
    hostRo = null
    if (!n) return
    await nextTick()
    if (previewHost.value && typeof ResizeObserver !== "undefined") {
      hostRo = new ResizeObserver(() => scheduleDraw())
      hostRo.observe(previewHost.value)
    }
  }
)

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
  if (!items.value.length) {
    ElMessage({ message: t("msgNoImg"), type: "warning" })
    return
  }
  const canvas = document.createElement("canvas")
  if (!paint(canvas, outW.value)) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `collage-${items.value.length}.${EXT[format.value]}`)
}

onUnmounted(() => {
  if (redrawTimer) clearTimeout(redrawTimer)
  hostRo?.disconnect()
  reset()
})
</script>

<template>
  <div class="cg-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <FileUpload
      v-if="!items.length"
      :folder="false"
      accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"
      @files-added="addFiles"
    />

    <template v-else>
      <div class="toolbar">
        <FileUpload
          type="button"
          :folder="false"
          accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"
          @files-added="addFiles"
        />
        <el-button @click="reset">{{ t("clear") }}</el-button>
        <el-button
          type="primary"
          @click="download"
        >
          {{ t("download") }}
        </el-button>
        <span class="meta">{{ t("count", { n: items.length }) }}</span>
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
          <h2 class="sub">{{ t("layoutTitle") }}</h2>
          <el-radio-group
            v-model="layout"
            class="fmt-group"
          >
            <el-radio-button value="row">{{ t("layRow") }}</el-radio-button>
            <el-radio-button value="col">{{ t("layCol") }}</el-radio-button>
            <el-radio-button value="g2">2×</el-radio-button>
            <el-radio-button value="g3">3×</el-radio-button>
            <el-radio-button value="g4">4×</el-radio-button>
          </el-radio-group>

          <h2 class="sub">{{ t("cellTitle") }}</h2>
          <div class="chips">
            <el-button
              v-for="r in CELL_RATIOS"
              :key="r.key"
              size="small"
              :type="cellRatio === r.key ? 'primary' : 'default'"
              @click="cellRatio = r.key"
            >
              {{ r.key }}
            </el-button>
          </div>

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
            :max="64"
            :step="1"
            :show-tooltip="false"
          />
          <div class="row">
            <span>{{ t("bg") }}</span>
            <el-color-picker v-model="bg" />
          </div>

          <h2 class="sub">{{ t("outW") }}</h2>
          <el-input-number
            v-model="outW"
            :min="200"
            :max="8192"
            :step="10"
            controls-position="right"
          />

          <h2 class="sub">{{ t("thumbs") }}</h2>
          <div class="thumbs">
            <div
              v-for="(it, i) in items"
              :key="it.id"
              class="thumb"
            >
              <img
                :src="it.url"
                alt=""
              />
              <div class="thumb-bar">
                <el-button
                  link
                  size="small"
                  :disabled="i === 0"
                  @click="move(i, -1)"
                >
                  ↑
                </el-button>
                <el-button
                  link
                  size="small"
                  :disabled="i === items.length - 1"
                  @click="move(i, 1)"
                >
                  ↓
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="removeAt(i)"
                >
                  {{ t("remove") }}
                </el-button>
              </div>
            </div>
          </div>

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
.cg-page {
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
  height: min(62vh, 560px);
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

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.thumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow: auto;
  margin-bottom: 8px;
}

.thumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.thumb img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.thumb-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

:deep(.el-input-number) {
  width: 140px;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片拼图",
    "desc": "选多张图拼成横排、竖排长图或宫格。可调间距、底色和格子比例，导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "clear": "清空",
    "download": "下载拼图",
    "count": "已选 {n} 张",
    "layoutTitle": "排布",
    "layRow": "横排",
    "layCol": "竖排",
    "cellTitle": "格子比例",
    "fitTitle": "填充",
    "fitCover": "铺满裁切",
    "fitContain": "完整显示",
    "gap": "间距",
    "pad": "边距",
    "bg": "底色",
    "outW": "输出宽度",
    "thumbs": "图片顺序",
    "remove": "移除",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "msgNotImage": "请选择图片文件。",
    "msgNoImg": "请先添加图片。",
    "msgFail": "处理失败。"
  },
  "zh-CN": {
    "title_page": "图片拼图",
    "desc": "选多张图拼成横排、竖排长图或宫格。可调间距、底色和格子比例，导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "clear": "清空",
    "download": "下载拼图",
    "count": "已选 {n} 张",
    "layoutTitle": "排布",
    "layRow": "横排",
    "layCol": "竖排",
    "cellTitle": "格子比例",
    "fitTitle": "填充",
    "fitCover": "铺满裁切",
    "fitContain": "完整显示",
    "gap": "间距",
    "pad": "边距",
    "bg": "底色",
    "outW": "输出宽度",
    "thumbs": "图片顺序",
    "remove": "移除",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "msgNotImage": "请选择图片文件。",
    "msgNoImg": "请先添加图片。",
    "msgFail": "处理失败。"
  },
  "en": {
    "title_page": "Photo collage",
    "desc": "Combine photos into a row, column, or grid. Adjust gaps, background, and cell ratio, then export PNG, JPG, or WebP.",
    "clear": "Clear",
    "download": "Download collage",
    "count": "{n} selected",
    "layoutTitle": "Layout",
    "layRow": "Row",
    "layCol": "Column",
    "cellTitle": "Cell ratio",
    "fitTitle": "Fit",
    "fitCover": "Cover",
    "fitContain": "Contain",
    "gap": "Gap",
    "pad": "Padding",
    "bg": "Background",
    "outW": "Output width",
    "thumbs": "Order",
    "remove": "Remove",
    "formatTitle": "Export format",
    "qualityTitle": "Quality",
    "msgNotImage": "Please choose image files.",
    "msgNoImg": "Add photos first.",
    "msgFail": "Could not build the collage."
  },
  "ja": {
    "title_page": "画像コラージュ",
    "desc": "複数の画像を横並び、縦並び、グリッドにまとめます。間隔や背景を調整して PNG / JPG / WebP で保存します。",
    "clear": "クリア",
    "download": "コラージュを保存",
    "count": "{n} 枚選択",
    "layoutTitle": "レイアウト",
    "layRow": "横",
    "layCol": "縦",
    "cellTitle": "マスの比率",
    "fitTitle": "フィット",
    "fitCover": "塗りつぶし",
    "fitContain": "全体表示",
    "gap": "間隔",
    "pad": "余白",
    "bg": "背景",
    "outW": "出力幅",
    "thumbs": "順番",
    "remove": "削除",
    "formatTitle": "書き出し形式",
    "qualityTitle": "画質",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgNoImg": "先に画像を追加してください。",
    "msgFail": "作成できませんでした。"
  },
  "ko": {
    "title_page": "사진 콜라주",
    "desc": "여러 장을 가로, 세로 또는 격자로 붙입니다. 간격과 배경을 조절한 뒤 PNG, JPG, WebP로 받습니다.",
    "clear": "비우기",
    "download": "콜라주 다운로드",
    "count": "{n}장 선택",
    "layoutTitle": "배치",
    "layRow": "가로",
    "layCol": "세로",
    "cellTitle": "칸 비율",
    "fitTitle": "맞춤",
    "fitCover": "채우기",
    "fitContain": "전체 보기",
    "gap": "간격",
    "pad": "여백",
    "bg": "배경",
    "outW": "출력 너비",
    "thumbs": "순서",
    "remove": "제거",
    "formatTitle": "내보내기 형식",
    "qualityTitle": "화질",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgNoImg": "먼저 사진을 추가하세요.",
    "msgFail": "만들지 못했습니다."
  },
  "fr": {
    "title_page": "Collage photo",
    "desc": "Assemblez des photos en ligne, colonne ou grille. Réglez l’écart et le fond, puis exportez PNG, JPG ou WebP.",
    "clear": "Vider",
    "download": "Télécharger le collage",
    "count": "{n} sélectionnée(s)",
    "layoutTitle": "Disposition",
    "layRow": "Ligne",
    "layCol": "Colonne",
    "cellTitle": "Ratio des cases",
    "fitTitle": "Ajustement",
    "fitCover": "Remplir",
    "fitContain": "Contenir",
    "gap": "Écart",
    "pad": "Marge",
    "bg": "Fond",
    "outW": "Largeur de sortie",
    "thumbs": "Ordre",
    "remove": "Retirer",
    "formatTitle": "Format d’export",
    "qualityTitle": "Qualité",
    "msgNotImage": "Choisissez des fichiers image.",
    "msgNoImg": "Ajoutez d’abord des photos.",
    "msgFail": "Impossible de créer le collage."
  },
  "de": {
    "title_page": "Fotocollage",
    "desc": "Fotos in Reihe, Spalte oder Raster fügen. Abstand und Hintergrund anpassen, dann PNG, JPG oder WebP speichern.",
    "clear": "Leeren",
    "download": "Collage herunterladen",
    "count": "{n} gewählt",
    "layoutTitle": "Anordnung",
    "layRow": "Reihe",
    "layCol": "Spalte",
    "cellTitle": "Zellenverhältnis",
    "fitTitle": "Einpassung",
    "fitCover": "Füllen",
    "fitContain": "Einpassen",
    "gap": "Abstand",
    "pad": "Rand",
    "bg": "Hintergrund",
    "outW": "Ausgabebreite",
    "thumbs": "Reihenfolge",
    "remove": "Entfernen",
    "formatTitle": "Exportformat",
    "qualityTitle": "Qualität",
    "msgNotImage": "Bitte Bilddateien wählen.",
    "msgNoImg": "Zuerst Fotos hinzufügen.",
    "msgFail": "Collage konnte nicht erzeugt werden."
  },
  "es": {
    "title_page": "Collage de fotos",
    "desc": "Junta fotos en fila, columna o cuadrícula. Ajusta huecos y fondo y exporta PNG, JPG o WebP.",
    "clear": "Vaciar",
    "download": "Descargar collage",
    "count": "{n} seleccionadas",
    "layoutTitle": "Disposición",
    "layRow": "Fila",
    "layCol": "Columna",
    "cellTitle": "Proporción de celdas",
    "fitTitle": "Ajuste",
    "fitCover": "Cubrir",
    "fitContain": "Contener",
    "gap": "Hueco",
    "pad": "Margen",
    "bg": "Fondo",
    "outW": "Ancho de salida",
    "thumbs": "Orden",
    "remove": "Quitar",
    "formatTitle": "Formato de exportación",
    "qualityTitle": "Calidad",
    "msgNotImage": "Elige archivos de imagen.",
    "msgNoImg": "Añade fotos primero.",
    "msgFail": "No se pudo crear el collage."
  },
  "pt": {
    "title_page": "Colagem de fotos",
    "desc": "Junte fotos em linha, coluna ou grelha. Ajuste espaços e fundo e exporte PNG, JPG ou WebP.",
    "clear": "Limpar",
    "download": "Descarregar colagem",
    "count": "{n} selecionadas",
    "layoutTitle": "Disposição",
    "layRow": "Linha",
    "layCol": "Coluna",
    "cellTitle": "Proporção das células",
    "fitTitle": "Ajuste",
    "fitCover": "Cobrir",
    "fitContain": "Conter",
    "gap": "Espaço",
    "pad": "Margem",
    "bg": "Fundo",
    "outW": "Largura de saída",
    "thumbs": "Ordem",
    "remove": "Remover",
    "formatTitle": "Formato de exportação",
    "qualityTitle": "Qualidade",
    "msgNotImage": "Escolha ficheiros de imagem.",
    "msgNoImg": "Adicione fotos primeiro.",
    "msgFail": "Não foi possível criar a colagem."
  },
  "ru": {
    "title_page": "Фотоколлаж",
    "desc": "Соберите фото в ряд, столбец или сетку. Настройте зазоры и фон, сохраните PNG, JPG или WebP.",
    "clear": "Очистить",
    "download": "Скачать коллаж",
    "count": "Выбрано: {n}",
    "layoutTitle": "Раскладка",
    "layRow": "Ряд",
    "layCol": "Столбец",
    "cellTitle": "Пропорции ячеек",
    "fitTitle": "Вписывание",
    "fitCover": "Заполнить",
    "fitContain": "Вместить",
    "gap": "Зазор",
    "pad": "Поля",
    "bg": "Фон",
    "outW": "Ширина выхода",
    "thumbs": "Порядок",
    "remove": "Убрать",
    "formatTitle": "Формат экспорта",
    "qualityTitle": "Качество",
    "msgNotImage": "Выберите файлы изображений.",
    "msgNoImg": "Сначала добавьте фото.",
    "msgFail": "Не удалось собрать коллаж."
  },
  "ar": {
    "title_page": "كولاج صور",
    "desc": "اجمع صوراً في صف أو عمود أو شبكة. اضبط الفراغ والخلفية ثم صدّر PNG أو JPG أو WebP.",
    "clear": "مسح",
    "download": "تنزيل الكولاج",
    "count": "تم اختيار {n}",
    "layoutTitle": "التخطيط",
    "layRow": "صف",
    "layCol": "عمود",
    "cellTitle": "نسبة الخلايا",
    "fitTitle": "الملاءمة",
    "fitCover": "ملء",
    "fitContain": "احتواء",
    "gap": "الفراغ",
    "pad": "الهامش",
    "bg": "الخلفية",
    "outW": "عرض الإخراج",
    "thumbs": "الترتيب",
    "remove": "إزالة",
    "formatTitle": "صيغة التصدير",
    "qualityTitle": "الجودة",
    "msgNotImage": "اختر ملفات صور.",
    "msgNoImg": "أضف صوراً أولاً.",
    "msgFail": "تعذر إنشاء الكولاج."
  },
  "hi": {
    "title_page": "फ़ोटो कोलाज",
    "desc": "कई फ़ोटो को पंक्ति, स्तंभ या ग्रिड में जोड़ें। गैप और बैकग्राउंड सेट कर PNG, JPG या WebP निकालें।",
    "clear": "साफ़",
    "download": "कोलाज डाउनलोड",
    "count": "{n} चुनी गईं",
    "layoutTitle": "लेआउट",
    "layRow": "पंक्ति",
    "layCol": "स्तंभ",
    "cellTitle": "सेल अनुपात",
    "fitTitle": "फ़िट",
    "fitCover": "भरें",
    "fitContain": "समाएँ",
    "gap": "अंतर",
    "pad": "पैडिंग",
    "bg": "पृष्ठभूमि",
    "outW": "आउटपुट चौड़ाई",
    "thumbs": "क्रम",
    "remove": "हटाएँ",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "qualityTitle": "क्वालिटी",
    "msgNotImage": "इमेज फ़ाइलें चुनें।",
    "msgNoImg": "पहले फ़ोटो जोड़ें।",
    "msgFail": "कोलाज नहीं बन सका।"
  },
  "it": {
    "title_page": "Collage foto",
    "desc": "Unisci foto in riga, colonna o griglia. Regola spazi e sfondo, poi esporta PNG, JPG o WebP.",
    "clear": "Svuota",
    "download": "Scarica collage",
    "count": "{n} selezionate",
    "layoutTitle": "Disposizione",
    "layRow": "Riga",
    "layCol": "Colonna",
    "cellTitle": "Proporzione celle",
    "fitTitle": "Adatta",
    "fitCover": "Copri",
    "fitContain": "Contieni",
    "gap": "Spazio",
    "pad": "Margine",
    "bg": "Sfondo",
    "outW": "Larghezza di output",
    "thumbs": "Ordine",
    "remove": "Rimuovi",
    "formatTitle": "Formato di esportazione",
    "qualityTitle": "Qualità",
    "msgNotImage": "Scegli file immagine.",
    "msgNoImg": "Aggiungi prima le foto.",
    "msgFail": "Impossibile creare il collage."
  },
  "nl": {
    "title_page": "Fotocollage",
    "desc": "Voeg foto’s samen in een rij, kolom of raster. Pas tussenruimte en achtergrond aan en exporteer PNG, JPG of WebP.",
    "clear": "Leegmaken",
    "download": "Collage downloaden",
    "count": "{n} geselecteerd",
    "layoutTitle": "Indeling",
    "layRow": "Rij",
    "layCol": "Kolom",
    "cellTitle": "Celverhouding",
    "fitTitle": "Passend",
    "fitCover": "Vullen",
    "fitContain": "Passen",
    "gap": "Tussenruimte",
    "pad": "Marge",
    "bg": "Achtergrond",
    "outW": "Uitvoerbreedte",
    "thumbs": "Volgorde",
    "remove": "Verwijderen",
    "formatTitle": "Exportformaat",
    "qualityTitle": "Kwaliteit",
    "msgNotImage": "Kies afbeeldingsbestanden.",
    "msgNoImg": "Voeg eerst foto’s toe.",
    "msgFail": "Collage maken mislukt."
  },
  "tr": {
    "title_page": "Fotoğraf kolajı",
    "desc": "Fotoğrafları satır, sütun veya ızgarada birleştirin. Boşluk ve arka planı ayarlayıp PNG, JPG veya WebP alın.",
    "clear": "Temizle",
    "download": "Kolajı indir",
    "count": "{n} seçildi",
    "layoutTitle": "Düzen",
    "layRow": "Satır",
    "layCol": "Sütun",
    "cellTitle": "Hücre oranı",
    "fitTitle": "Sığdırma",
    "fitCover": "Kapla",
    "fitContain": "Sığdır",
    "gap": "Boşluk",
    "pad": "Kenar",
    "bg": "Arka plan",
    "outW": "Çıktı genişliği",
    "thumbs": "Sıra",
    "remove": "Kaldır",
    "formatTitle": "Dışa aktarma biçimi",
    "qualityTitle": "Kalite",
    "msgNotImage": "Görüntü dosyaları seçin.",
    "msgNoImg": "Önce fotoğraf ekleyin.",
    "msgFail": "Kolaj oluşturulamadı."
  },
  "vi": {
    "title_page": "Ghép ảnh",
    "desc": "Ghép nhiều ảnh thành hàng, cột hoặc lưới. Chỉnh khoảng cách, nền rồi xuất PNG, JPG hoặc WebP.",
    "clear": "Xóa hết",
    "download": "Tải ảnh ghép",
    "count": "Đã chọn {n}",
    "layoutTitle": "Bố cục",
    "layRow": "Hàng",
    "layCol": "Cột",
    "cellTitle": "Tỉ lệ ô",
    "fitTitle": "Vừa khung",
    "fitCover": "Phủ kín",
    "fitContain": "Hiện đủ",
    "gap": "Khoảng cách",
    "pad": "Lề",
    "bg": "Nền",
    "outW": "Chiều rộng xuất",
    "thumbs": "Thứ tự",
    "remove": "Xóa",
    "formatTitle": "Định dạng xuất",
    "qualityTitle": "Chất lượng",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgNoImg": "Hãy thêm ảnh trước.",
    "msgFail": "Không ghép được ảnh."
  },
  "th": {
    "title_page": "ต่อภาพ",
    "desc": "ต่อหลายรูปเป็นแถว คอลัมน์ หรือตาราง ปรับช่องว่างกับพื้นหลัง แล้วส่งออก PNG JPG หรือ WebP",
    "clear": "ล้าง",
    "download": "ดาวน์โหลดภาพต่อ",
    "count": "เลือก {n} รูป",
    "layoutTitle": "เลย์เอาต์",
    "layRow": "แถว",
    "layCol": "คอลัมน์",
    "cellTitle": "สัดส่วนช่อง",
    "fitTitle": "การจัด",
    "fitCover": "เต็มช่อง",
    "fitContain": "เห็นทั้งรูป",
    "gap": "ช่องว่าง",
    "pad": "ขอบ",
    "bg": "พื้นหลัง",
    "outW": "ความกว้างส่งออก",
    "thumbs": "ลำดับ",
    "remove": "ลบ",
    "formatTitle": "รูปแบบส่งออก",
    "qualityTitle": "คุณภาพ",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgNoImg": "เพิ่มรูปก่อน",
    "msgFail": "ต่อภาพไม่สำเร็จ"
  },
  "id": {
    "title_page": "Kolase foto",
    "desc": "Gabungkan foto jadi baris, kolom, atau kisi. Atur jarak dan latar, lalu ekspor PNG, JPG, atau WebP.",
    "clear": "Kosongkan",
    "download": "Unduh kolase",
    "count": "{n} dipilih",
    "layoutTitle": "Tata letak",
    "layRow": "Baris",
    "layCol": "Kolom",
    "cellTitle": "Rasio sel",
    "fitTitle": "Penyesuaian",
    "fitCover": "Isi",
    "fitContain": "Muat",
    "gap": "Jarak",
    "pad": "Padding",
    "bg": "Latar",
    "outW": "Lebar keluaran",
    "thumbs": "Urutan",
    "remove": "Hapus",
    "formatTitle": "Format ekspor",
    "qualityTitle": "Kualitas",
    "msgNotImage": "Pilih berkas gambar.",
    "msgNoImg": "Tambah foto dulu.",
    "msgFail": "Gagal membuat kolase."
  },
  "ms": {
    "title_page": "Kolaj foto",
    "desc": "Gabungkan foto jadi baris, lajur atau grid. Laras jurang dan latar, kemudian eksport PNG, JPG atau WebP.",
    "clear": "Kosongkan",
    "download": "Muat turun kolaj",
    "count": "{n} dipilih",
    "layoutTitle": "Susun atur",
    "layRow": "Baris",
    "layCol": "Lajur",
    "cellTitle": "Nisbah sel",
    "fitTitle": "Muat",
    "fitCover": "Isi",
    "fitContain": "Kandung",
    "gap": "Jarak",
    "pad": "Padding",
    "bg": "Latar",
    "outW": "Lebar output",
    "thumbs": "Susunan",
    "remove": "Buang",
    "formatTitle": "Format eksport",
    "qualityTitle": "Kualiti",
    "msgNotImage": "Pilih fail imej.",
    "msgNoImg": "Tambah foto dahulu.",
    "msgFail": "Gagal membuat kolaj."
  },
  "pl": {
    "title_page": "Kolaż zdjęć",
    "desc": "Połącz zdjęcia w wiersz, kolumnę lub siatkę. Ustaw odstępy i tło, potem eksportuj PNG, JPG lub WebP.",
    "clear": "Wyczyść",
    "download": "Pobierz kolaż",
    "count": "Wybrano {n}",
    "layoutTitle": "Układ",
    "layRow": "Wiersz",
    "layCol": "Kolumna",
    "cellTitle": "Proporcje komórek",
    "fitTitle": "Dopasowanie",
    "fitCover": "Wypełnij",
    "fitContain": "Zmieść",
    "gap": "Odstęp",
    "pad": "Margines",
    "bg": "Tło",
    "outW": "Szerokość wyjściowa",
    "thumbs": "Kolejność",
    "remove": "Usuń",
    "formatTitle": "Format eksportu",
    "qualityTitle": "Jakość",
    "msgNotImage": "Wybierz pliki obrazów.",
    "msgNoImg": "Najpierw dodaj zdjęcia.",
    "msgFail": "Nie udało się utworzyć kolażu."
  },
  "uk": {
    "title_page": "Фотоколаж",
    "desc": "Зберіть фото в ряд, стовпець або сітку. Налаштуйте проміжки й тло, експортуйте PNG, JPG або WebP.",
    "clear": "Очистити",
    "download": "Завантажити колаж",
    "count": "Вибрано {n}",
    "layoutTitle": "Розкладка",
    "layRow": "Ряд",
    "layCol": "Стовпець",
    "cellTitle": "Пропорції клітинок",
    "fitTitle": "Вписування",
    "fitCover": "Заповнити",
    "fitContain": "Вмістити",
    "gap": "Проміжок",
    "pad": "Поля",
    "bg": "Тло",
    "outW": "Ширина виходу",
    "thumbs": "Порядок",
    "remove": "Прибрати",
    "formatTitle": "Формат експорту",
    "qualityTitle": "Якість",
    "msgNotImage": "Виберіть файли зображень.",
    "msgNoImg": "Спочатку додайте фото.",
    "msgFail": "Не вдалося зібрати колаж."
  },
  "sv": {
    "title_page": "Fotocollage",
    "desc": "Sätt ihop foton i rad, kolumn eller rutnät. Justera luckor och bakgrund, exportera PNG, JPG eller WebP.",
    "clear": "Rensa",
    "download": "Ladda ner collage",
    "count": "{n} valda",
    "layoutTitle": "Layout",
    "layRow": "Rad",
    "layCol": "Kolumn",
    "cellTitle": "Cellförhållande",
    "fitTitle": "Anpassning",
    "fitCover": "Fyll",
    "fitContain": "Rym",
    "gap": "Mellanrum",
    "pad": "Marginal",
    "bg": "Bakgrund",
    "outW": "Utbredd",
    "thumbs": "Ordning",
    "remove": "Ta bort",
    "formatTitle": "Exportformat",
    "qualityTitle": "Kvalitet",
    "msgNotImage": "Välj bildfiler.",
    "msgNoImg": "Lägg till foton först.",
    "msgFail": "Kunde inte skapa collaget."
  },
  "zh-TW": {
    "title_page": "圖片拼圖",
    "desc": "選多張圖拼成橫排、直排長圖或宮格。可調間距、底色和格子比例，匯出 PNG / JPG / WebP。處理都在瀏覽器本機完成。",
    "clear": "清空",
    "download": "下載拼圖",
    "count": "已選 {n} 張",
    "layoutTitle": "排布",
    "layRow": "橫排",
    "layCol": "直排",
    "cellTitle": "格子比例",
    "fitTitle": "填充",
    "fitCover": "鋪滿裁切",
    "fitContain": "完整顯示",
    "gap": "間距",
    "pad": "邊距",
    "bg": "底色",
    "outW": "輸出寬度",
    "thumbs": "圖片順序",
    "remove": "移除",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "msgNotImage": "請選擇圖片檔。",
    "msgNoImg": "請先新增圖片。",
    "msgFail": "處理失敗。"
  }
}
</i18n>
