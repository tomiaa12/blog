<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import ImageCropper from "@/components/ImageCropper.vue"

const { t } = useI18n()

type Mode = "crop" | "pad" | "stretch"
type ExportFmt = "png" | "jpeg" | "webp"
type RatioKey = "1:1" | "4:3" | "3:2" | "16:9" | "9:16" | "3:4" | "2:3" | "21:9" | "custom"

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

const RATIOS: { key: RatioKey; w: number; h: number }[] = [
  { key: "1:1", w: 1, h: 1 },
  { key: "4:3", w: 4, h: 3 },
  { key: "3:2", w: 3, h: 2 },
  { key: "16:9", w: 16, h: 9 },
  { key: "9:16", w: 9, h: 16 },
  { key: "3:4", w: 3, h: 4 },
  { key: "2:3", w: 2, h: 3 },
  { key: "21:9", w: 21, h: 9 },
]

const objectUrl = ref("")
const fileName = ref("image")
const srcW = ref(0)
const srcH = ref(0)
const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)
const previewRef = ref<HTMLCanvasElement | null>(null)
const previewHost = ref<HTMLElement | null>(null)
const srcImg = ref<HTMLImageElement | null>(null)

const mode = ref<Mode>("crop")
const ratioKey = ref<RatioKey>("16:9")
const customW = ref(16)
const customH = ref(9)
const padColor = ref("#000000")
const padTransparent = ref(false)
const format = ref<ExportFmt>("png")
const quality = ref(0.92)
const needQuality = computed(() => format.value !== "png")

let redrawTimer: ReturnType<typeof setTimeout> | null = null
let hostRo: ResizeObserver | null = null

const aspect = computed(() => {
  if (ratioKey.value === "custom") {
    const w = Math.max(1, customW.value)
    const h = Math.max(1, customH.value)
    return w / h
  }
  const item = RATIOS.find(r => r.key === ratioKey.value)
  return item ? item.w / item.h : 16 / 9
})

const ratioLabel = computed(() => {
  if (ratioKey.value === "custom") return `${customW.value}:${customH.value}`
  return ratioKey.value
})

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
    srcW.value = srcImg.value.naturalWidth
    srcH.value = srcImg.value.naturalHeight
    await nextTick()
    scheduleDraw()
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

function onImgLoad(size: { width: number; height: number }) {
  srcW.value = size.width
  srcH.value = size.height
}

function padSize(imgW: number, imgH: number, ratio: number) {
  const imgRatio = imgW / imgH
  if (imgRatio > ratio) {
    return { w: imgW, h: Math.max(1, Math.round(imgW / ratio)) }
  }
  return { w: Math.max(1, Math.round(imgH * ratio)), h: imgH }
}

function stretchSize(imgW: number, imgH: number, ratio: number) {
  const area = imgW * imgH
  const w = Math.max(1, Math.round(Math.sqrt(area * ratio)))
  const h = Math.max(1, Math.round(w / ratio))
  return { w: Math.min(16384, w), h: Math.min(16384, h) }
}

function paintPadOrStretch(canvas: HTMLCanvasElement, destW: number, destH: number) {
  const src = srcImg.value
  if (!src) return false
  canvas.width = destW
  canvas.height = destH
  const ctx = canvas.getContext("2d")
  if (!ctx) return false
  ctx.clearRect(0, 0, destW, destH)
  if (mode.value === "pad") {
    if (!padTransparent.value) {
      ctx.fillStyle = padColor.value
      ctx.fillRect(0, 0, destW, destH)
    }
    const s = Math.min(destW / src.naturalWidth, destH / src.naturalHeight)
    const dw = src.naturalWidth * s
    const dh = src.naturalHeight * s
    ctx.drawImage(src, (destW - dw) / 2, (destH - dh) / 2, dw, dh)
  } else {
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(src, 0, 0, destW, destH)
  }
  return true
}

function drawPreview() {
  if (mode.value === "crop") return
  const canvas = previewRef.value
  const host = previewHost.value
  const src = srcImg.value
  if (!canvas || !host || !src) return
  const target =
    mode.value === "pad"
      ? padSize(src.naturalWidth, src.naturalHeight, aspect.value)
      : stretchSize(src.naturalWidth, src.naturalHeight, aspect.value)
  const maxW = host.clientWidth || 640
  const maxH = host.clientHeight || 420
  const s = Math.min(maxW / target.w, maxH / target.h, 1)
  paintPadOrStretch(
    canvas,
    Math.max(1, Math.round(target.w * s)),
    Math.max(1, Math.round(target.h * s))
  )
}

function scheduleDraw() {
  if (redrawTimer) clearTimeout(redrawTimer)
  redrawTimer = setTimeout(drawPreview, 40)
}

watch([mode, aspect, padColor, padTransparent], scheduleDraw)

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
  let canvas: HTMLCanvasElement | null = null
  if (mode.value === "crop") {
    canvas = cropperRef.value?.getCroppedCanvas() ?? null
  } else {
    const target =
      mode.value === "pad"
        ? padSize(src.naturalWidth, src.naturalHeight, aspect.value)
        : stretchSize(src.naturalWidth, src.naturalHeight, aspect.value)
    canvas = document.createElement("canvas")
    if (!paintPadOrStretch(canvas, target.w, target.h)) canvas = null
  }
  if (!canvas) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const tag = mode.value === "crop" ? "crop" : mode.value === "pad" ? "pad" : "stretch"
  saveBlob(blob, `${fileName.value}-${ratioLabel.value.replace(":", "x")}-${tag}.${EXT[format.value]}`)
}

function reset() {
  revoke(objectUrl.value)
  objectUrl.value = ""
  srcImg.value = null
  srcW.value = 0
  srcH.value = 0
}

onUnmounted(() => {
  if (redrawTimer) clearTimeout(redrawTimer)
  hostRo?.disconnect()
  revoke(objectUrl.value)
})
</script>

<template>
  <div class="ar-page">
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
          v-if="srcW"
          class="meta"
        >{{ t("sourceSize") }} {{ srcW }} × {{ srcH }}</span>
      </div>

      <div class="work">
        <div class="stage-wrap">
          <div
            v-if="mode === 'crop'"
            class="crop-host"
          >
            <ImageCropper
              :key="`${objectUrl}-${aspect}`"
              ref="cropperRef"
              :src="objectUrl"
              :aspect-ratio="aspect"
              @load="onImgLoad"
            />
          </div>
          <div
            v-else
            ref="previewHost"
            class="preview-host"
          >
            <canvas ref="previewRef" />
          </div>
          <p class="crop-tip">{{ mode === "crop" ? t("cropTip") : t("previewTip") }}</p>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("modeTitle") }}</h2>
          <el-radio-group
            v-model="mode"
            class="fmt-group"
          >
            <el-radio-button value="crop">{{ t("modeCrop") }}</el-radio-button>
            <el-radio-button value="pad">{{ t("modePad") }}</el-radio-button>
            <el-radio-button value="stretch">{{ t("modeStretch") }}</el-radio-button>
          </el-radio-group>
          <p class="hint">{{ t(`modeHint_${mode}`) }}</p>

          <h2 class="sub">{{ t("ratioTitle") }}</h2>
          <div class="chips">
            <el-button
              v-for="r in RATIOS"
              :key="r.key"
              size="small"
              :type="ratioKey === r.key ? 'primary' : 'default'"
              @click="ratioKey = r.key"
            >
              {{ r.key }}
            </el-button>
            <el-button
              size="small"
              :type="ratioKey === 'custom' ? 'primary' : 'default'"
              @click="ratioKey = 'custom'"
            >
              {{ t("custom") }}
            </el-button>
          </div>
          <div
            v-if="ratioKey === 'custom'"
            class="custom-row"
          >
            <el-input-number
              v-model="customW"
              :min="1"
              :max="99"
              :step="1"
              controls-position="right"
            />
            <span>:</span>
            <el-input-number
              v-model="customH"
              :min="1"
              :max="99"
              :step="1"
              controls-position="right"
            />
          </div>

          <template v-if="mode === 'pad'">
            <h2 class="sub">{{ t("padTitle") }}</h2>
            <div class="row">
              <el-color-picker
                v-model="padColor"
                :disabled="padTransparent"
              />
              <el-checkbox v-model="padTransparent">{{ t("padTransparent") }}</el-checkbox>
            </div>
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
.ar-page {
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

.stage-wrap {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  height: min(62vh, 520px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.crop-host,
.preview-host {
  flex: 1;
  min-height: 0;
}

.preview-host {
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

.crop-tip {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
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

.custom-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint {
  margin: 0 0 8px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

:deep(.el-input-number) {
  width: 96px;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片宽高比",
    "desc": "把图片改成 16:9、4:3、1:1、9:16 等比例。可裁切多余部分、留边补齐，或拉伸变形。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载图片",
    "sourceSize": "原图",
    "modeTitle": "处理方式",
    "modeCrop": "裁切",
    "modePad": "留边",
    "modeStretch": "拉伸",
    "modeHint_crop": "按比例裁掉多余区域，画面不变形。",
    "modeHint_pad": "完整保留原图，用底色或透明补齐到目标比例。",
    "modeHint_stretch": "整张图拉到目标比例，可能会变形。",
    "ratioTitle": "目标比例",
    "custom": "自定义",
    "padTitle": "留边颜色",
    "padTransparent": "透明底（PNG）",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "cropTip": "拖动选框移动，四角缩放。滚轮缩放背景；按住中键或空格拖动背景。",
    "previewTip": "左侧为按目标比例处理后的预览。",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。"
  },
  "zh-CN": {
    "title_page": "图片宽高比",
    "desc": "把图片改成 16:9、4:3、1:1、9:16 等比例。可裁切多余部分、留边补齐，或拉伸变形。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载图片",
    "sourceSize": "原图",
    "modeTitle": "处理方式",
    "modeCrop": "裁切",
    "modePad": "留边",
    "modeStretch": "拉伸",
    "modeHint_crop": "按比例裁掉多余区域，画面不变形。",
    "modeHint_pad": "完整保留原图，用底色或透明补齐到目标比例。",
    "modeHint_stretch": "整张图拉到目标比例，可能会变形。",
    "ratioTitle": "目标比例",
    "custom": "自定义",
    "padTitle": "留边颜色",
    "padTransparent": "透明底（PNG）",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "cropTip": "拖动选框移动，四角缩放。滚轮缩放背景；按住中键或空格拖动背景。",
    "previewTip": "左侧为按目标比例处理后的预览。",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。"
  },
  "en": {
    "title_page": "Image aspect ratio",
    "desc": "Change a photo to 16:9, 4:3, 1:1, 9:16, and more. Crop, letterbox, or stretch, then export PNG, JPG, or WebP.",
    "reselect": "Choose another",
    "download": "Download image",
    "sourceSize": "Source",
    "modeTitle": "Method",
    "modeCrop": "Crop",
    "modePad": "Pad",
    "modeStretch": "Stretch",
    "modeHint_crop": "Cut extra areas to match the ratio without distorting.",
    "modeHint_pad": "Keep the whole image and fill the rest with color or transparency.",
    "modeHint_stretch": "Force the image into the ratio; it may look stretched.",
    "ratioTitle": "Target ratio",
    "custom": "Custom",
    "padTitle": "Pad color",
    "padTransparent": "Transparent (PNG)",
    "formatTitle": "Export format",
    "qualityTitle": "Quality",
    "cropTip": "Drag the box; corners resize. Scroll to zoom; hold middle mouse or Space to pan.",
    "previewTip": "Preview of the image after applying the target ratio.",
    "msgNotImage": "Please choose an image file.",
    "msgFail": "Could not process the image."
  },
  "ja": {
    "title_page": "画像の縦横比",
    "desc": "16:9、4:3、1:1、9:16 などに変更。切り抜き、余白追加、引き伸ばしに対応。処理はブラウザ内です。",
    "reselect": "別の画像",
    "download": "画像を保存",
    "sourceSize": "元画像",
    "modeTitle": "方法",
    "modeCrop": "切り抜き",
    "modePad": "余白",
    "modeStretch": "伸縮",
    "modeHint_crop": "余分を切って比率に合わせます。変形しません。",
    "modeHint_pad": "画像はそのまま、余白で比率を合わせます。",
    "modeHint_stretch": "画像全体を比率に合わせます。歪むことがあります。",
    "ratioTitle": "目標比率",
    "custom": "カスタム",
    "padTitle": "余白の色",
    "padTransparent": "透明（PNG）",
    "formatTitle": "書き出し形式",
    "qualityTitle": "画質",
    "cropTip": "枠をドラッグ、四隅で拡大縮小。ホイールでズーム、中ボタンまたは Space で移動。",
    "previewTip": "目標比率を適用したプレビューです。",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "処理できませんでした。"
  },
  "ko": {
    "title_page": "이미지 화면비",
    "desc": "16:9, 4:3, 1:1, 9:16 등으로 바꿉니다. 자르기, 여백, 늘리기를 지원하며 PNG, JPG, WebP로 받습니다.",
    "reselect": "다른 이미지",
    "download": "이미지 다운로드",
    "sourceSize": "원본",
    "modeTitle": "방식",
    "modeCrop": "자르기",
    "modePad": "여백",
    "modeStretch": "늘리기",
    "modeHint_crop": "남는 부분을 잘라 비율에 맞춥니다. 왜곡 없습니다.",
    "modeHint_pad": "원본을 유지하고 빈 곳을 색 또는 투명으로 채웁니다.",
    "modeHint_stretch": "전체를 비율에 맞춥니다. 늘어날 수 있습니다.",
    "ratioTitle": "목표 비율",
    "custom": "사용자 지정",
    "padTitle": "여백 색",
    "padTransparent": "투명 (PNG)",
    "formatTitle": "내보내기 형식",
    "qualityTitle": "화질",
    "cropTip": "상자를 끌고 모서리로 조절. 휠로 확대, 가운데 버튼이나 Space로 이동.",
    "previewTip": "목표 비율을 적용한 미리보기입니다.",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "처리하지 못했습니다."
  },
  "fr": {
    "title_page": "Ratio d’image",
    "desc": "Passez en 16:9, 4:3, 1:1, 9:16… Recadrez, ajoutez des bandes ou étirez, puis exportez PNG, JPG ou WebP.",
    "reselect": "Autre image",
    "download": "Télécharger l’image",
    "sourceSize": "Source",
    "modeTitle": "Méthode",
    "modeCrop": "Recadrer",
    "modePad": "Bandes",
    "modeStretch": "Étirer",
    "modeHint_crop": "Coupe le surplus pour coller au ratio, sans déformer.",
    "modeHint_pad": "Garde toute l’image et remplit le reste.",
    "modeHint_stretch": "Force le ratio ; l’image peut se déformer.",
    "ratioTitle": "Ratio cible",
    "custom": "Perso",
    "padTitle": "Couleur des bandes",
    "padTransparent": "Transparent (PNG)",
    "formatTitle": "Format d’export",
    "qualityTitle": "Qualité",
    "cropTip": "Glissez le cadre ; molette pour zoomer ; clic milieu ou Espace pour déplacer.",
    "previewTip": "Aperçu après application du ratio.",
    "msgNotImage": "Choisissez un fichier image.",
    "msgFail": "Échec du traitement."
  },
  "de": {
    "title_page": "Bildseitenverhältnis",
    "desc": "Auf 16:9, 4:3, 1:1, 9:16 usw. bringen. Zuschneiden, Ränder oder Strecken, dann PNG, JPG oder WebP.",
    "reselect": "Anderes Bild",
    "download": "Bild herunterladen",
    "sourceSize": "Quelle",
    "modeTitle": "Methode",
    "modeCrop": "Zuschneiden",
    "modePad": "Ränder",
    "modeStretch": "Strecken",
    "modeHint_crop": "Überstand abschneiden, ohne zu verzerren.",
    "modeHint_pad": "Bild behalten und Rest füllen.",
    "modeHint_stretch": "Ins Verhältnis zwingen; kann verzerren.",
    "ratioTitle": "Zielverhältnis",
    "custom": "Eigene",
    "padTitle": "Randfarbe",
    "padTransparent": "Transparent (PNG)",
    "formatTitle": "Exportformat",
    "qualityTitle": "Qualität",
    "cropTip": "Rahmen ziehen; Rad zum Zoomen; mittlere Taste oder Leertaste zum Verschieben.",
    "previewTip": "Vorschau nach dem Zielverhältnis.",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgFail": "Verarbeitung fehlgeschlagen."
  },
  "es": {
    "title_page": "Relación de aspecto",
    "desc": "Pasa a 16:9, 4:3, 1:1, 9:16… Recorta, añade bandas o estira, y exporta PNG, JPG o WebP.",
    "reselect": "Otra imagen",
    "download": "Descargar imagen",
    "sourceSize": "Origen",
    "modeTitle": "Método",
    "modeCrop": "Recortar",
    "modePad": "Bandas",
    "modeStretch": "Estirar",
    "modeHint_crop": "Corta el sobrante para el ratio, sin deformar.",
    "modeHint_pad": "Conserva la imagen y rellena el resto.",
    "modeHint_stretch": "Fuerza el ratio; puede deformarse.",
    "ratioTitle": "Ratio objetivo",
    "custom": "Personalizado",
    "padTitle": "Color de bandas",
    "padTransparent": "Transparente (PNG)",
    "formatTitle": "Formato de exportación",
    "qualityTitle": "Calidad",
    "cropTip": "Arrastra el recuadro; rueda para zoom; botón medio o Espacio para mover.",
    "previewTip": "Vista previa con el ratio aplicado.",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgFail": "Error al procesar."
  },
  "pt": {
    "title_page": "Proporção da imagem",
    "desc": "Mude para 16:9, 4:3, 1:1, 9:16… Recorte, adicione faixas ou estique e exporte PNG, JPG ou WebP.",
    "reselect": "Outra imagem",
    "download": "Descarregar imagem",
    "sourceSize": "Origem",
    "modeTitle": "Método",
    "modeCrop": "Recortar",
    "modePad": "Faixas",
    "modeStretch": "Esticar",
    "modeHint_crop": "Corta o extra para o rácio, sem distorcer.",
    "modeHint_pad": "Mantém a imagem e preenche o resto.",
    "modeHint_stretch": "Força o rácio; pode distorcer.",
    "ratioTitle": "Rácio alvo",
    "custom": "Personalizado",
    "padTitle": "Cor das faixas",
    "padTransparent": "Transparente (PNG)",
    "formatTitle": "Formato de exportação",
    "qualityTitle": "Qualidade",
    "cropTip": "Arraste a caixa; scroll para zoom; botão do meio ou Espaço para mover.",
    "previewTip": "Pré-visualização com o rácio aplicado.",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgFail": "Falha ao processar."
  },
  "ru": {
    "title_page": "Соотношение сторон",
    "desc": "Сделайте 16:9, 4:3, 1:1, 9:16. Обрежьте, добавьте поля или растяните и сохраните PNG, JPG или WebP.",
    "reselect": "Другое фото",
    "download": "Скачать изображение",
    "sourceSize": "Исходник",
    "modeTitle": "Способ",
    "modeCrop": "Обрезать",
    "modePad": "Поля",
    "modeStretch": "Растянуть",
    "modeHint_crop": "Обрезает лишнее под соотношение, без искажения.",
    "modeHint_pad": "Картинка целиком, пустое место заливается.",
    "modeHint_stretch": "Подгоняет соотношение; может исказить.",
    "ratioTitle": "Целевое соотношение",
    "custom": "Своё",
    "padTitle": "Цвет полей",
    "padTransparent": "Прозрачный (PNG)",
    "formatTitle": "Формат экспорта",
    "qualityTitle": "Качество",
    "cropTip": "Тащите рамку; колесо — масштаб; средняя кнопка или пробел — сдвиг.",
    "previewTip": "Предпросмотр после применения соотношения.",
    "msgNotImage": "Выберите файл изображения.",
    "msgFail": "Не удалось обработать."
  },
  "ar": {
    "title_page": "نسبة أبعاد الصورة",
    "desc": "حوّل إلى 16:9 أو 4:3 أو 1:1 أو 9:16. قص أو هوامش أو تمديد، ثم صدّر PNG أو JPG أو WebP.",
    "reselect": "صورة أخرى",
    "download": "تنزيل الصورة",
    "sourceSize": "المصدر",
    "modeTitle": "الطريقة",
    "modeCrop": "قص",
    "modePad": "هوامش",
    "modeStretch": "تمديد",
    "modeHint_crop": "يقص الزائد ليناسب النسبة دون تشويه.",
    "modeHint_pad": "يبقي الصورة ويملأ الباقي.",
    "modeHint_stretch": "يفرض النسبة وقد يشوّه الصورة.",
    "ratioTitle": "النسبة المستهدفة",
    "custom": "مخصص",
    "padTitle": "لون الهوامش",
    "padTransparent": "شفاف (PNG)",
    "formatTitle": "صيغة التصدير",
    "qualityTitle": "الجودة",
    "cropTip": "اسحب الإطار؛ العجلة للتكبير؛ الزر الأوسط أو المسافة للتحريك.",
    "previewTip": "معاينة بعد تطبيق النسبة.",
    "msgNotImage": "اختر ملف صورة.",
    "msgFail": "تعذر المعالجة."
  },
  "hi": {
    "title_page": "इमेज आस्पेक्ट रेशियो",
    "desc": "16:9, 4:3, 1:1, 9:16 आदि पर लाएँ। क्रॉप, पैड या स्ट्रेच करके PNG, JPG या WebP निकालें।",
    "reselect": "दूसरी इमेज",
    "download": "इमेज डाउनलोड",
    "sourceSize": "स्रोत",
    "modeTitle": "तरीका",
    "modeCrop": "क्रॉप",
    "modePad": "पैड",
    "modeStretch": "स्ट्रेच",
    "modeHint_crop": "अतिरिक्त काटकर अनुपात मिलाएँ, बिना बिगाड़े।",
    "modeHint_pad": "पूरी इमेज रखें और बाकी भरें।",
    "modeHint_stretch": "अनुपात पर ज़बरदस्ती; खिंच सकती है।",
    "ratioTitle": "लक्ष्य अनुपात",
    "custom": "कस्टम",
    "padTitle": "पैड रंग",
    "padTransparent": "पारदर्शी (PNG)",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "qualityTitle": "क्वालिटी",
    "cropTip": "बॉक्स खींचें; स्क्रॉल से ज़ूम; मध्य बटन या स्पेस से पैन।",
    "previewTip": "लक्ष्य अनुपात लगाने के बाद का पूर्वावलोकन।",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgFail": "प्रोसेस असफल।"
  },
  "it": {
    "title_page": "Proporzioni immagine",
    "desc": "Passa a 16:9, 4:3, 1:1, 9:16… Ritaglia, aggiungi bande o stira, poi esporta PNG, JPG o WebP.",
    "reselect": "Altra immagine",
    "download": "Scarica immagine",
    "sourceSize": "Sorgente",
    "modeTitle": "Metodo",
    "modeCrop": "Ritaglia",
    "modePad": "Bande",
    "modeStretch": "Stira",
    "modeHint_crop": "Taglia il surplus per il rapporto, senza deformare.",
    "modeHint_pad": "Mantiene l’immagine e riempie il resto.",
    "modeHint_stretch": "Forza il rapporto; può deformarsi.",
    "ratioTitle": "Rapporto obiettivo",
    "custom": "Personalizzato",
    "padTitle": "Colore bande",
    "padTransparent": "Trasparente (PNG)",
    "formatTitle": "Formato di esportazione",
    "qualityTitle": "Qualità",
    "cropTip": "Trascina il riquadro; rotella per zoom; tasto centrale o Spazio per spostare.",
    "previewTip": "Anteprima con il rapporto applicato.",
    "msgNotImage": "Scegli un file immagine.",
    "msgFail": "Elaborazione non riuscita."
  },
  "nl": {
    "title_page": "Beeldverhouding",
    "desc": "Zet om naar 16:9, 4:3, 1:1, 9:16… Bijsnijden, randen of rekken, daarna PNG, JPG of WebP.",
    "reselect": "Andere afbeelding",
    "download": "Afbeelding downloaden",
    "sourceSize": "Bron",
    "modeTitle": "Methode",
    "modeCrop": "Bijsnijden",
    "modePad": "Randen",
    "modeStretch": "Rekken",
    "modeHint_crop": "Snijdt het extra weg zonder te vervormen.",
    "modeHint_pad": "Houdt de foto en vult de rest.",
    "modeHint_stretch": "Dwingt de verhouding; kan vervormen.",
    "ratioTitle": "Doelverhouding",
    "custom": "Aangepast",
    "padTitle": "Randkleur",
    "padTransparent": "Transparant (PNG)",
    "formatTitle": "Exportformaat",
    "qualityTitle": "Kwaliteit",
    "cropTip": "Sleep het kader; scroll om te zoomen; middelste knop of spatiebalk om te pan.",
    "previewTip": "Voorbeeld na toepassen van de verhouding.",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgFail": "Verwerken mislukt."
  },
  "tr": {
    "title_page": "Görüntü en-boy oranı",
    "desc": "16:9, 4:3, 1:1, 9:16 yapın. Kırpın, kenar ekleyin veya gerin, PNG, JPG veya WebP alın.",
    "reselect": "Başka görüntü",
    "download": "Görüntüyü indir",
    "sourceSize": "Kaynak",
    "modeTitle": "Yöntem",
    "modeCrop": "Kırp",
    "modePad": "Kenar",
    "modeStretch": "Ger",
    "modeHint_crop": "Fazlayı keser, bozmaz.",
    "modeHint_pad": "Görüntüyü korur, boşluğu doldurur.",
    "modeHint_stretch": "Oranı zorlar; bozulabilir.",
    "ratioTitle": "Hedef oran",
    "custom": "Özel",
    "padTitle": "Kenar rengi",
    "padTransparent": "Saydam (PNG)",
    "formatTitle": "Dışa aktarma biçimi",
    "qualityTitle": "Kalite",
    "cropTip": "Kutuyu sürükleyin; tekerlek yakınlaştırır; orta tuş veya Boşluk kaydırır.",
    "previewTip": "Hedef oran uygulandıktan sonraki önizleme.",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgFail": "İşlem başarısız."
  },
  "vi": {
    "title_page": "Tỉ lệ khung hình",
    "desc": "Đổi sang 16:9, 4:3, 1:1, 9:16… Cắt, thêm viền hoặc kéo giãn, rồi xuất PNG, JPG hoặc WebP.",
    "reselect": "Ảnh khác",
    "download": "Tải ảnh",
    "sourceSize": "Gốc",
    "modeTitle": "Cách làm",
    "modeCrop": "Cắt",
    "modePad": "Viền",
    "modeStretch": "Kéo",
    "modeHint_crop": "Cắt phần thừa cho đúng tỉ lệ, không méo.",
    "modeHint_pad": "Giữ nguyên ảnh, tô phần còn lại.",
    "modeHint_stretch": "Ép tỉ lệ; có thể bị méo.",
    "ratioTitle": "Tỉ lệ đích",
    "custom": "Tùy chỉnh",
    "padTitle": "Màu viền",
    "padTransparent": "Trong suốt (PNG)",
    "formatTitle": "Định dạng xuất",
    "qualityTitle": "Chất lượng",
    "cropTip": "Kéo khung; lăn chuột để zoom; nút giữa hoặc Space để pan.",
    "previewTip": "Xem trước sau khi áp tỉ lệ đích.",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Xử lý thất bại."
  },
  "th": {
    "title_page": "สัดส่วนภาพ",
    "desc": "เปลี่ยนเป็น 16:9, 4:3, 1:1, 9:16 ครอป เติมขอบ หรือยืด แล้วส่งออก PNG JPG หรือ WebP",
    "reselect": "เลือกรูปใหม่",
    "download": "ดาวน์โหลดรูป",
    "sourceSize": "ต้นฉบับ",
    "modeTitle": "วิธี",
    "modeCrop": "ครอป",
    "modePad": "เติมขอบ",
    "modeStretch": "ยืด",
    "modeHint_crop": "ตัดส่วนเกินให้ตรงสัดส่วน ไม่บิดเบี้ยว",
    "modeHint_pad": "คงรูปเดิม เติมพื้นที่ว่าง",
    "modeHint_stretch": "บังคับสัดส่วน อาจยืดผิดรูป",
    "ratioTitle": "สัดส่วนเป้าหมาย",
    "custom": "กำหนดเอง",
    "padTitle": "สีขอบ",
    "padTransparent": "โปร่งใส (PNG)",
    "formatTitle": "รูปแบบส่งออก",
    "qualityTitle": "คุณภาพ",
    "cropTip": "ลากกรอบ ลูกกลิ้งซูม ปุ่มกลางหรือ Space เลื่อนพื้นหลัง",
    "previewTip": "พรีวิวหลังใช้สัดส่วนเป้าหมาย",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgFail": "ประมวลผลไม่สำเร็จ"
  },
  "id": {
    "title_page": "Rasio aspek gambar",
    "desc": "Ubah ke 16:9, 4:3, 1:1, 9:16. Potong, beri pita, atau regangkan, lalu ekspor PNG, JPG, atau WebP.",
    "reselect": "Gambar lain",
    "download": "Unduh gambar",
    "sourceSize": "Sumber",
    "modeTitle": "Metode",
    "modeCrop": "Potong",
    "modePad": "Pita",
    "modeStretch": "Regang",
    "modeHint_crop": "Memotong kelebihan agar rasio pas, tanpa distorsi.",
    "modeHint_pad": "Menjaga gambar utuh dan mengisi sisanya.",
    "modeHint_stretch": "Memaksa rasio; bisa tampak meregang.",
    "ratioTitle": "Rasio target",
    "custom": "Kustom",
    "padTitle": "Warna pita",
    "padTransparent": "Transparan (PNG)",
    "formatTitle": "Format ekspor",
    "qualityTitle": "Kualitas",
    "cropTip": "Seret kotak; gulir untuk zoom; tombol tengah atau Spasi untuk geser.",
    "previewTip": "Pratinjau setelah rasio diterapkan.",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Gagal memproses."
  },
  "ms": {
    "title_page": "Nisbah aspek imej",
    "desc": "Tukar kepada 16:9, 4:3, 1:1, 9:16. Potong, tambah jalur atau regang, kemudian eksport PNG, JPG atau WebP.",
    "reselect": "Imej lain",
    "download": "Muat turun imej",
    "sourceSize": "Sumber",
    "modeTitle": "Kaedah",
    "modeCrop": "Potong",
    "modePad": "Jalur",
    "modeStretch": "Regang",
    "modeHint_crop": "Potong lebihan agar nisbah sesuai, tanpa herot.",
    "modeHint_pad": "Kekalkan imej dan isi bakinya.",
    "modeHint_stretch": "Paksa nisbah; mungkin kelihatan regang.",
    "ratioTitle": "Nisbah sasaran",
    "custom": "Tersuai",
    "padTitle": "Warna jalur",
    "padTransparent": "Lutsinar (PNG)",
    "formatTitle": "Format eksport",
    "qualityTitle": "Kualiti",
    "cropTip": "Seret kotak; tatal untuk zum; butang tengah atau Space untuk alih.",
    "previewTip": "Pratonton selepas nisbah digunakan.",
    "msgNotImage": "Pilih fail imej.",
    "msgFail": "Gagal memproses."
  },
  "pl": {
    "title_page": "Proporcje obrazu",
    "desc": "Zmień na 16:9, 4:3, 1:1, 9:16. Przytnij, dodaj pasy albo rozciągnij i eksportuj PNG, JPG lub WebP.",
    "reselect": "Inny obraz",
    "download": "Pobierz obraz",
    "sourceSize": "Źródło",
    "modeTitle": "Metoda",
    "modeCrop": "Przytnij",
    "modePad": "Pasy",
    "modeStretch": "Rozciągnij",
    "modeHint_crop": "Obcina nadmiar do proporcji, bez zniekształceń.",
    "modeHint_pad": "Zostawia cały obraz i wypełnia resztę.",
    "modeHint_stretch": "Wymusza proporcje; może zniekształcić.",
    "ratioTitle": "Docelowe proporcje",
    "custom": "Własne",
    "padTitle": "Kolor pasów",
    "padTransparent": "Przezroczyste (PNG)",
    "formatTitle": "Format eksportu",
    "qualityTitle": "Jakość",
    "cropTip": "Przeciągaj ramkę; kółko zoomuje; środkowy przycisk lub spacja przesuwa.",
    "previewTip": "Podgląd po zastosowaniu proporcji.",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgFail": "Przetwarzanie nie powiodło się."
  },
  "uk": {
    "title_page": "Співвідношення сторін",
    "desc": "Зробіть 16:9, 4:3, 1:1, 9:16. Обріжте, додайте поля або розтягніть і експортуйте PNG, JPG або WebP.",
    "reselect": "Інше фото",
    "download": "Завантажити зображення",
    "sourceSize": "Джерело",
    "modeTitle": "Спосіб",
    "modeCrop": "Обрізати",
    "modePad": "Поля",
    "modeStretch": "Розтягнути",
    "modeHint_crop": "Обрізає зайве під співвідношення, без спотворення.",
    "modeHint_pad": "Залишає все зображення і заповнює решту.",
    "modeHint_stretch": "Підганяє співвідношення; може спотворити.",
    "ratioTitle": "Цільове співвідношення",
    "custom": "Своє",
    "padTitle": "Колір полів",
    "padTransparent": "Прозорий (PNG)",
    "formatTitle": "Формат експорту",
    "qualityTitle": "Якість",
    "cropTip": "Тягніть рамку; колесо — масштаб; середня кнопка або пробіл — зсув.",
    "previewTip": "Перегляд після застосування співвідношення.",
    "msgNotImage": "Виберіть файл зображення.",
    "msgFail": "Не вдалося обробити."
  },
  "sv": {
    "title_page": "Bildens bildförhållande",
    "desc": "Ändra till 16:9, 4:3, 1:1, 9:16. Beskär, lägg till kanter eller stretcha och exportera PNG, JPG eller WebP.",
    "reselect": "Annan bild",
    "download": "Ladda ner bild",
    "sourceSize": "Källa",
    "modeTitle": "Metod",
    "modeCrop": "Beskär",
    "modePad": "Kanter",
    "modeStretch": "Stretcha",
    "modeHint_crop": "Skär bort överskott till förhållandet utan att förvränga.",
    "modeHint_pad": "Behåller hela bilden och fyller resten.",
    "modeHint_stretch": "Tvingar förhållandet; kan se utsträckt ut.",
    "ratioTitle": "Målförhållande",
    "custom": "Anpassad",
    "padTitle": "Kantfärg",
    "padTransparent": "Transparent (PNG)",
    "formatTitle": "Exportformat",
    "qualityTitle": "Kvalitet",
    "cropTip": "Dra rutan; scrolla för zoom; mittenknapp eller blanksteg för att pan.",
    "previewTip": "Förhandsvisning efter målförhållandet.",
    "msgNotImage": "Välj en bildfil.",
    "msgFail": "Bearbetningen misslyckades."
  },
  "zh-TW": {
    "title_page": "圖片寬高比",
    "desc": "把圖片改成 16:9、4:3、1:1、9:16 等比例。可裁切多餘部分、留邊補齊，或拉伸變形。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "download": "下載圖片",
    "sourceSize": "原圖",
    "modeTitle": "處理方式",
    "modeCrop": "裁切",
    "modePad": "留邊",
    "modeStretch": "拉伸",
    "modeHint_crop": "按比例裁掉多餘區域，畫面不變形。",
    "modeHint_pad": "完整保留原圖，用底色或透明補齊到目標比例。",
    "modeHint_stretch": "整張圖拉到目標比例，可能會變形。",
    "ratioTitle": "目標比例",
    "custom": "自訂",
    "padTitle": "留邊顏色",
    "padTransparent": "透明底（PNG）",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "cropTip": "拖動選框移動，四角縮放。滾輪縮放背景；按住中鍵或空白鍵拖動背景。",
    "previewTip": "左側為按目標比例處理後的預覽。",
    "msgNotImage": "請選擇圖片檔。",
    "msgFail": "處理失敗。"
  }
}
</i18n>
