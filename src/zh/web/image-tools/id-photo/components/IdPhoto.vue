<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import ImageCropper from "@/components/ImageCropper.vue"

const { t } = useI18n()

type SizeKey =
  | "1in"
  | "1inS"
  | "1inL"
  | "2in"
  | "2inS"
  | "2inL"
  | "idcard"
  | "passport"
  | "visa"
  | "drive"
  | "custom"

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

const SIZES: { key: SizeKey; mmW: number; mmH: number }[] = [
  { key: "1in", mmW: 25, mmH: 35 },
  { key: "1inS", mmW: 22, mmH: 32 },
  { key: "1inL", mmW: 33, mmH: 48 },
  { key: "2in", mmW: 35, mmH: 49 },
  { key: "2inS", mmW: 35, mmH: 45 },
  { key: "2inL", mmW: 35, mmH: 53 },
  { key: "idcard", mmW: 26, mmH: 32 },
  { key: "passport", mmW: 33, mmH: 48 },
  { key: "visa", mmW: 35, mmH: 45 },
  { key: "drive", mmW: 22, mmH: 32 },
]

const DPI = 300
const SHEET = { w: 6 * DPI, h: 4 * DPI }

const objectUrl = ref("")
const fileName = ref("id-photo")
const naturalSize = ref("")
const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)
const previewUrl = ref("")
const sizeKey = ref<SizeKey>("1in")
const customW = ref(25)
const customH = ref(35)
const format = ref<ExportFmt>("jpeg")
const quality = ref(0.92)
const needQuality = computed(() => format.value !== "png")

let previewTimer: ReturnType<typeof setTimeout> | null = null

const currentMm = computed(() => {
  if (sizeKey.value === "custom") {
    return { w: Math.max(10, customW.value), h: Math.max(10, customH.value) }
  }
  const item = SIZES.find(s => s.key === sizeKey.value)!
  return { w: item.mmW, h: item.mmH }
})

const outPx = computed(() => ({
  w: Math.max(1, Math.round((currentMm.value.w / 25.4) * DPI)),
  h: Math.max(1, Math.round((currentMm.value.h / 25.4) * DPI)),
}))

const aspect = computed(() => outPx.value.w / outPx.value.h)

const sheetInfo = computed(() => {
  const { w: pw, h: ph } = outPx.value
  const gap = 16
  const margin = 28
  const fit = (sw: number, sh: number) => {
    const cols = Math.max(0, Math.floor((sw - margin * 2 + gap) / (pw + gap)))
    const rows = Math.max(0, Math.floor((sh - margin * 2 + gap) / (ph + gap)))
    return { cols, rows, n: cols * rows, sw, sh }
  }
  const a = fit(SHEET.w, SHEET.h)
  const b = fit(SHEET.h, SHEET.w)
  return a.n >= b.n ? a : b
})

function revoke(url: string) {
  if (url) URL.revokeObjectURL(url)
}

function pickImage(files: File[]) {
  const file = files.find(f => f.type.startsWith("image/"))
  if (!file) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  revoke(objectUrl.value)
  revoke(previewUrl.value)
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name.replace(/\.[^.]+$/, "") || "id-photo"
  previewUrl.value = ""
}

function onImgLoad(size: { width: number; height: number }) {
  naturalSize.value = `${size.width} × ${size.height}`
  nextTick(refreshPreview)
}

function onCropChange() {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(() => void refreshPreview(), 80)
}

async function refreshPreview() {
  const canvas = cropperRef.value?.getCroppedCanvas(outPx.value.w)
  if (!canvas) return
  const blob = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(b => resolve(b), "image/jpeg", 0.88)
  })
  if (!blob) return
  revoke(previewUrl.value)
  previewUrl.value = URL.createObjectURL(blob)
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

function getPhotoCanvas() {
  return cropperRef.value?.getCroppedCanvas(outPx.value.w) ?? null
}

async function downloadOne() {
  const canvas = getPhotoCanvas()
  if (!canvas) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `${fileName.value}-${sizeKey.value}-${outPx.value.w}x${outPx.value.h}.${EXT[format.value]}`)
}

async function downloadSheet() {
  const photo = getPhotoCanvas()
  if (!photo) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const { cols, rows, n, sw, sh } = sheetInfo.value
  if (!n) {
    ElMessage({ message: t("msgNoFit"), type: "warning" })
    return
  }
  const canvas = document.createElement("canvas")
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, sw, sh)
  const { w: pw, h: ph } = outPx.value
  const gap = 16
  const usedW = cols * pw + (cols - 1) * gap
  const usedH = rows * ph + (rows - 1) * gap
  const ox = (sw - usedW) / 2
  const oy = (sh - usedH) / 2
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.drawImage(photo, ox + c * (pw + gap), oy + r * (ph + gap), pw, ph)
    }
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `${fileName.value}-${sizeKey.value}-6in-${n}.${EXT[format.value]}`)
}

function reset() {
  revoke(objectUrl.value)
  revoke(previewUrl.value)
  objectUrl.value = ""
  previewUrl.value = ""
  naturalSize.value = ""
}

watch([sizeKey, customW, customH], () => {
  nextTick(refreshPreview)
})

onUnmounted(() => {
  if (previewTimer) clearTimeout(previewTimer)
  reset()
})
</script>

<template>
  <div class="id-page">
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
          @click="downloadOne"
        >
          {{ t("downloadOne") }}
        </el-button>
        <el-button @click="downloadSheet">{{ t("downloadSheet") }}</el-button>
        <span
          v-if="naturalSize"
          class="meta"
        >{{ t("sourceSize") }} {{ naturalSize }}</span>
      </div>

      <div class="work">
        <div class="stage-wrap">
          <div class="crop-host">
            <ImageCropper
              :key="`${objectUrl}-${aspect}`"
              ref="cropperRef"
              :src="objectUrl"
              :aspect-ratio="aspect"
              @change="onCropChange"
              @load="onImgLoad"
            />
          </div>
          <p class="crop-tip">{{ t("cropTip") }}</p>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("sizeTitle") }}</h2>
          <div class="chips">
            <el-button
              v-for="s in SIZES"
              :key="s.key"
              size="small"
              :type="sizeKey === s.key ? 'primary' : 'default'"
              @click="sizeKey = s.key"
            >
              {{ t(`size_${s.key}`) }}
            </el-button>
            <el-button
              size="small"
              :type="sizeKey === 'custom' ? 'primary' : 'default'"
              @click="sizeKey = 'custom'"
            >
              {{ t("custom") }}
            </el-button>
          </div>
          <div
            v-if="sizeKey === 'custom'"
            class="custom-row"
          >
            <el-input-number
              v-model="customW"
              :min="10"
              :max="80"
              :step="1"
              controls-position="right"
            />
            <span>×</span>
            <el-input-number
              v-model="customH"
              :min="10"
              :max="80"
              :step="1"
              controls-position="right"
            />
            <span>mm</span>
          </div>
          <p class="hint">
            {{ currentMm.w }} × {{ currentMm.h }} mm · {{ outPx.w }} × {{ outPx.h }} px (300 DPI)
          </p>

          <h2 class="sub">{{ t("previewTitle") }}</h2>
          <div class="preview-box">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              :width="Math.min(outPx.w, 180)"
              :alt="t('previewTitle')"
            />
          </div>
          <p class="hint">{{ t("sheetHint", { n: sheetInfo.n }) }}</p>

          <h2 class="sub">{{ t("formatTitle") }}</h2>
          <el-radio-group
            v-model="format"
            class="fmt-group"
          >
            <el-radio-button value="jpeg">JPG</el-radio-button>
            <el-radio-button value="png">PNG</el-radio-button>
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
.id-page {
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

.crop-host {
  flex: 1;
  min-height: 0;
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
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.hint {
  margin: 0 0 8px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.preview-box {
  display: flex;
  justify-content: center;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.preview-box img {
  display: block;
  height: auto;
}

.fmt-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

:deep(.el-input-number) {
  width: 88px;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "证件照",
    "desc": "按一寸、二寸、身份证、护照等标准尺寸裁切证件照，可下载单张，或排版到 6 寸相纸一次冲印多张。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "downloadOne": "下载单张",
    "downloadSheet": "下载 6 寸排版",
    "sourceSize": "原图",
    "sizeTitle": "规格",
    "size_1in": "一寸",
    "size_1inS": "小一寸",
    "size_1inL": "大一寸",
    "size_2in": "二寸",
    "size_2inS": "小二寸",
    "size_2inL": "大二寸",
    "size_idcard": "身份证",
    "size_passport": "护照",
    "size_visa": "签证",
    "size_drive": "驾驶证",
    "custom": "自定义",
    "previewTitle": "效果预览",
    "sheetHint": "6 寸相纸大约可排 {n} 张。",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "cropTip": "按证件照比例裁切。滚轮缩放背景；按住中键或空格拖动。本工具不更换背景色。",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。",
    "msgNoFit": "当前尺寸无法排进 6 寸相纸。"
  },
  "zh-CN": {
    "title_page": "证件照",
    "desc": "按一寸、二寸、身份证、护照等标准尺寸裁切证件照，可下载单张，或排版到 6 寸相纸一次冲印多张。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "downloadOne": "下载单张",
    "downloadSheet": "下载 6 寸排版",
    "sourceSize": "原图",
    "sizeTitle": "规格",
    "size_1in": "一寸",
    "size_1inS": "小一寸",
    "size_1inL": "大一寸",
    "size_2in": "二寸",
    "size_2inS": "小二寸",
    "size_2inL": "大二寸",
    "size_idcard": "身份证",
    "size_passport": "护照",
    "size_visa": "签证",
    "size_drive": "驾驶证",
    "custom": "自定义",
    "previewTitle": "效果预览",
    "sheetHint": "6 寸相纸大约可排 {n} 张。",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "cropTip": "按证件照比例裁切。滚轮缩放背景；按住中键或空格拖动。本工具不更换背景色。",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。",
    "msgNoFit": "当前尺寸无法排进 6 寸相纸。"
  },
  "en": {
    "title_page": "ID photo",
    "desc": "Crop to 1-inch, 2-inch, passport, and other standard ID sizes. Download one copy or a 4×6 print sheet. Everything stays in your browser.",
    "reselect": "Choose another",
    "downloadOne": "Download one",
    "downloadSheet": "Download 4×6 sheet",
    "sourceSize": "Source",
    "sizeTitle": "Size",
    "size_1in": "1 inch",
    "size_1inS": "Small 1 inch",
    "size_1inL": "Large 1 inch",
    "size_2in": "2 inch",
    "size_2inS": "Small 2 inch",
    "size_2inL": "Large 2 inch",
    "size_idcard": "ID card",
    "size_passport": "Passport",
    "size_visa": "Visa",
    "size_drive": "Driver license",
    "custom": "Custom",
    "previewTitle": "Preview",
    "sheetHint": "About {n} copies fit on a 4×6 sheet.",
    "formatTitle": "Export format",
    "qualityTitle": "Quality",
    "cropTip": "Crop to the ID ratio. Scroll to zoom; hold middle mouse or Space to pan. Background color is not changed.",
    "msgNotImage": "Please choose an image file.",
    "msgFail": "Could not process the image.",
    "msgNoFit": "This size does not fit a 4×6 sheet."
  },
  "ja": {
    "title_page": "証明写真",
    "desc": "一寸・二寸・パスポートなど標準サイズに切り抜き、1枚または 6 インチ台紙に並べて保存します。処理はブラウザ内です。",
    "reselect": "別の画像",
    "downloadOne": "1枚を保存",
    "downloadSheet": "6インチ台紙",
    "sourceSize": "元画像",
    "sizeTitle": "サイズ",
    "size_1in": "一寸",
    "size_1inS": "小一寸",
    "size_1inL": "大一寸",
    "size_2in": "二寸",
    "size_2inS": "小二寸",
    "size_2inL": "大二寸",
    "size_idcard": "身分証",
    "size_passport": "パスポート",
    "size_visa": "ビザ",
    "size_drive": "免許証",
    "custom": "カスタム",
    "previewTitle": "プレビュー",
    "sheetHint": "6インチ台紙に約 {n} 枚並べられます。",
    "formatTitle": "書き出し形式",
    "qualityTitle": "画質",
    "cropTip": "証明写真の比率で切り抜き。ホイールでズーム、中ボタンまたは Space で移動。背景色は変えません。",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "処理できませんでした。",
    "msgNoFit": "このサイズは 6 インチ台紙に入りません。"
  },
  "ko": {
    "title_page": "증명사진",
    "desc": "1촌, 2촌, 여권 등 표준 크기로 자른 뒤 한 장 또는 4×6 인화지에 배치합니다. 모두 브라우저에서 처리됩니다.",
    "reselect": "다른 이미지",
    "downloadOne": "한 장 받기",
    "downloadSheet": "4×6 배치 받기",
    "sourceSize": "원본",
    "sizeTitle": "규격",
    "size_1in": "1촌",
    "size_1inS": "소1촌",
    "size_1inL": "대1촌",
    "size_2in": "2촌",
    "size_2inS": "소2촌",
    "size_2inL": "대2촌",
    "size_idcard": "신분증",
    "size_passport": "여권",
    "size_visa": "비자",
    "size_drive": "운전면허",
    "custom": "사용자 지정",
    "previewTitle": "미리보기",
    "sheetHint": "4×6 용지에 약 {n}장 들어갑니다.",
    "formatTitle": "내보내기 형식",
    "qualityTitle": "화질",
    "cropTip": "증명사진 비율로 자릅니다. 휠 확대, 가운데 버튼이나 Space로 이동. 배경색은 바꾸지 않습니다.",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "처리하지 못했습니다.",
    "msgNoFit": "이 크기는 4×6에 들어가지 않습니다."
  },
  "fr": {
    "title_page": "Photo d’identité",
    "desc": "Recadrez aux formats 1 pouce, 2 pouces, passeport, etc. Téléchargez une copie ou une planche 10×15. Tout reste dans le navigateur.",
    "reselect": "Autre image",
    "downloadOne": "Télécharger une photo",
    "downloadSheet": "Planche 10×15",
    "sourceSize": "Source",
    "sizeTitle": "Format",
    "size_1in": "1 pouce",
    "size_1inS": "Petit 1 pouce",
    "size_1inL": "Grand 1 pouce",
    "size_2in": "2 pouces",
    "size_2inS": "Petit 2 pouces",
    "size_2inL": "Grand 2 pouces",
    "size_idcard": "Carte d’identité",
    "size_passport": "Passeport",
    "size_visa": "Visa",
    "size_drive": "Permis",
    "custom": "Perso",
    "previewTitle": "Aperçu",
    "sheetHint": "Environ {n} photos sur une planche 10×15.",
    "formatTitle": "Format d’export",
    "qualityTitle": "Qualité",
    "cropTip": "Recadrez au ratio officiel. Molette pour zoomer ; clic milieu ou Espace pour déplacer. Le fond n’est pas changé.",
    "msgNotImage": "Choisissez un fichier image.",
    "msgFail": "Échec du traitement.",
    "msgNoFit": "Ce format ne tient pas sur 10×15."
  },
  "de": {
    "title_page": "Passbild",
    "desc": "Auf 1-Zoll-, 2-Zoll-, Pass- und andere Standardmaße zuschneiden. Ein Bild oder ein 10×15-Bogen. Alles im Browser.",
    "reselect": "Anderes Bild",
    "downloadOne": "Einzelbild",
    "downloadSheet": "10×15-Bogen",
    "sourceSize": "Quelle",
    "sizeTitle": "Format",
    "size_1in": "1 Zoll",
    "size_1inS": "Klein 1 Zoll",
    "size_1inL": "Groß 1 Zoll",
    "size_2in": "2 Zoll",
    "size_2inS": "Klein 2 Zoll",
    "size_2inL": "Groß 2 Zoll",
    "size_idcard": "Ausweis",
    "size_passport": "Reisepass",
    "size_visa": "Visum",
    "size_drive": "Führerschein",
    "custom": "Eigene",
    "previewTitle": "Vorschau",
    "sheetHint": "Etwa {n} Bilder auf einem 10×15-Bogen.",
    "formatTitle": "Exportformat",
    "qualityTitle": "Qualität",
    "cropTip": "Auf Passbild-Verhältnis zuschneiden. Rad zoomen; mittlere Taste oder Leertaste verschieben. Hintergrund bleibt.",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgFail": "Verarbeitung fehlgeschlagen.",
    "msgNoFit": "Dieses Maß passt nicht auf 10×15."
  },
  "es": {
    "title_page": "Foto de carnet",
    "desc": "Recorta a 1 pulgada, 2 pulgadas, pasaporte y más. Descarga una copia o una hoja 10×15. Todo en el navegador.",
    "reselect": "Otra imagen",
    "downloadOne": "Descargar una",
    "downloadSheet": "Hoja 10×15",
    "sourceSize": "Origen",
    "sizeTitle": "Tamaño",
    "size_1in": "1 pulgada",
    "size_1inS": "1 pulgada pequeña",
    "size_1inL": "1 pulgada grande",
    "size_2in": "2 pulgadas",
    "size_2inS": "2 pulgadas pequeña",
    "size_2inL": "2 pulgadas grande",
    "size_idcard": "DNI",
    "size_passport": "Pasaporte",
    "size_visa": "Visado",
    "size_drive": "Carnet de conducir",
    "custom": "Personalizado",
    "previewTitle": "Vista previa",
    "sheetHint": "Cabén unas {n} fotos en una hoja 10×15.",
    "formatTitle": "Formato de exportación",
    "qualityTitle": "Calidad",
    "cropTip": "Recorta al ratio oficial. Rueda para zoom; botón medio o Espacio para mover. No cambia el fondo.",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgFail": "Error al procesar.",
    "msgNoFit": "Este tamaño no cabe en 10×15."
  },
  "pt": {
    "title_page": "Foto de identificação",
    "desc": "Recorte para 1 polegada, 2 polegadas, passaporte e outros. Descarregue uma cópia ou uma folha 10×15. Tudo no navegador.",
    "reselect": "Outra imagem",
    "downloadOne": "Descarregar uma",
    "downloadSheet": "Folha 10×15",
    "sourceSize": "Origem",
    "sizeTitle": "Tamanho",
    "size_1in": "1 polegada",
    "size_1inS": "1 polegada pequena",
    "size_1inL": "1 polegada grande",
    "size_2in": "2 polegadas",
    "size_2inS": "2 polegadas pequena",
    "size_2inL": "2 polegadas grande",
    "size_idcard": "Cartão de ID",
    "size_passport": "Passaporte",
    "size_visa": "Visto",
    "size_drive": "Carta de condução",
    "custom": "Personalizado",
    "previewTitle": "Pré-visualização",
    "sheetHint": "Cabem cerca de {n} fotos numa folha 10×15.",
    "formatTitle": "Formato de exportação",
    "qualityTitle": "Qualidade",
    "cropTip": "Recorte no rácio oficial. Scroll para zoom; botão do meio ou Espaço para mover. O fundo não muda.",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgFail": "Falha ao processar.",
    "msgNoFit": "Este tamanho não cabe em 10×15."
  },
  "ru": {
    "title_page": "Фото на документы",
    "desc": "Обрежьте до 1 дюйма, 2 дюймов, паспорта и других стандартов. Одна копия или лист 10×15. Всё в браузере.",
    "reselect": "Другое фото",
    "downloadOne": "Скачать одно",
    "downloadSheet": "Лист 10×15",
    "sourceSize": "Исходник",
    "sizeTitle": "Размер",
    "size_1in": "1 дюйм",
    "size_1inS": "Малый 1 дюйм",
    "size_1inL": "Большой 1 дюйм",
    "size_2in": "2 дюйма",
    "size_2inS": "Малый 2 дюйма",
    "size_2inL": "Большой 2 дюйма",
    "size_idcard": "Удостоверение",
    "size_passport": "Паспорт",
    "size_visa": "Виза",
    "size_drive": "Права",
    "custom": "Своё",
    "previewTitle": "Предпросмотр",
    "sheetHint": "На лист 10×15 помещается около {n} фото.",
    "formatTitle": "Формат экспорта",
    "qualityTitle": "Качество",
    "cropTip": "Обрезка под стандарт. Колесо — масштаб; средняя кнопка или пробел — сдвиг. Фон не меняется.",
    "msgNotImage": "Выберите файл изображения.",
    "msgFail": "Не удалось обработать.",
    "msgNoFit": "Этот размер не помещается на 10×15."
  },
  "ar": {
    "title_page": "صورة هوية",
    "desc": "قص إلى مقاس بوصة أو بوصتين أو جواز السفر. نزّل صورة واحدة أو ورقة 10×15. كل شيء في المتصفح.",
    "reselect": "صورة أخرى",
    "downloadOne": "تنزيل واحدة",
    "downloadSheet": "ورقة 10×15",
    "sourceSize": "المصدر",
    "sizeTitle": "المقاس",
    "size_1in": "بوصة",
    "size_1inS": "بوصة صغيرة",
    "size_1inL": "بوصة كبيرة",
    "size_2in": "بوصتان",
    "size_2inS": "بوصتان صغيرتان",
    "size_2inL": "بوصتان كبيرتان",
    "size_idcard": "بطاقة هوية",
    "size_passport": "جواز سفر",
    "size_visa": "تأشيرة",
    "size_drive": "رخصة قيادة",
    "custom": "مخصص",
    "previewTitle": "معاينة",
    "sheetHint": "حوالي {n} صور على ورقة 10×15.",
    "formatTitle": "صيغة التصدير",
    "qualityTitle": "الجودة",
    "cropTip": "قص بنسبة الهوية. العجلة للتكبير؛ الزر الأوسط أو المسافة للتحريك. الخلفية لا تتغير.",
    "msgNotImage": "اختر ملف صورة.",
    "msgFail": "تعذر المعالجة.",
    "msgNoFit": "هذا المقاس لا يناسب ورقة 10×15."
  },
  "hi": {
    "title_page": "आईडी फ़ोटो",
    "desc": "1 इंच, 2 इंच, पासपोर्ट आदि मानक साइज़ में काटें। एक कॉपी या 4×6 शीट डाउनलोड करें। सब ब्राउज़र में रहता है।",
    "reselect": "दूसरी इमेज",
    "downloadOne": "एक डाउनलोड",
    "downloadSheet": "4×6 शीट",
    "sourceSize": "स्रोत",
    "sizeTitle": "साइज़",
    "size_1in": "1 इंच",
    "size_1inS": "छोटा 1 इंच",
    "size_1inL": "बड़ा 1 इंच",
    "size_2in": "2 इंच",
    "size_2inS": "छोटा 2 इंच",
    "size_2inL": "बड़ा 2 इंच",
    "size_idcard": "आईडी कार्ड",
    "size_passport": "पासपोर्ट",
    "size_visa": "वीज़ा",
    "size_drive": "ड्राइविंग लाइसेंस",
    "custom": "कस्टम",
    "previewTitle": "पूर्वावलोकन",
    "sheetHint": "4×6 शीट पर लगभग {n} फ़ोटो।",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "qualityTitle": "क्वालिटी",
    "cropTip": "आईडी अनुपात में काटें। स्क्रॉल से ज़ूम; मध्य बटन या स्पेस से पैन। बैकग्राउंड नहीं बदलता।",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgFail": "प्रोसेस असफल।",
    "msgNoFit": "यह साइज़ 4×6 पर नहीं समाता।"
  },
  "it": {
    "title_page": "Foto tessera",
    "desc": "Ritaglia a 1 pollice, 2 pollici, passaporto e altri formati. Scarica una copia o un foglio 10×15. Tutto nel browser.",
    "reselect": "Altra immagine",
    "downloadOne": "Scarica una",
    "downloadSheet": "Foglio 10×15",
    "sourceSize": "Sorgente",
    "sizeTitle": "Formato",
    "size_1in": "1 pollice",
    "size_1inS": "1 pollice piccolo",
    "size_1inL": "1 pollice grande",
    "size_2in": "2 pollici",
    "size_2inS": "2 pollici piccolo",
    "size_2inL": "2 pollici grande",
    "size_idcard": "Carta d’identità",
    "size_passport": "Passaporto",
    "size_visa": "Visto",
    "size_drive": "Patente",
    "custom": "Personalizzato",
    "previewTitle": "Anteprima",
    "sheetHint": "Circa {n} foto su un foglio 10×15.",
    "formatTitle": "Formato di esportazione",
    "qualityTitle": "Qualità",
    "cropTip": "Ritaglia al rapporto ufficiale. Rotella per zoom; tasto centrale o Spazio per spostare. Lo sfondo non cambia.",
    "msgNotImage": "Scegli un file immagine.",
    "msgFail": "Elaborazione non riuscita.",
    "msgNoFit": "Questo formato non entra in 10×15."
  },
  "nl": {
    "title_page": "Pasfoto",
    "desc": "Snijd bij tot 1 inch, 2 inch, paspoort en meer. Download één foto of een 10×15-vel. Alles in de browser.",
    "reselect": "Andere afbeelding",
    "downloadOne": "Eén downloaden",
    "downloadSheet": "10×15-vel",
    "sourceSize": "Bron",
    "sizeTitle": "Formaat",
    "size_1in": "1 inch",
    "size_1inS": "Klein 1 inch",
    "size_1inL": "Groot 1 inch",
    "size_2in": "2 inch",
    "size_2inS": "Klein 2 inch",
    "size_2inL": "Groot 2 inch",
    "size_idcard": "ID-kaart",
    "size_passport": "Paspoort",
    "size_visa": "Visum",
    "size_drive": "Rijbewijs",
    "custom": "Aangepast",
    "previewTitle": "Voorbeeld",
    "sheetHint": "Ongeveer {n} foto’s op een 10×15-vel.",
    "formatTitle": "Exportformaat",
    "qualityTitle": "Kwaliteit",
    "cropTip": "Snijd bij tot de officiële verhouding. Scroll om te zoomen; middelste knop of spatiebalk om te pan. Achtergrond blijft.",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgFail": "Verwerken mislukt.",
    "msgNoFit": "Dit formaat past niet op 10×15."
  },
  "tr": {
    "title_page": "Kimlik fotoğrafı",
    "desc": "1 inç, 2 inç, pasaport ve diğer standartlara kırpın. Tek kopya veya 10×15 tabaka indirin. Hepsi tarayıcıda.",
    "reselect": "Başka görüntü",
    "downloadOne": "Birini indir",
    "downloadSheet": "10×15 tabaka",
    "sourceSize": "Kaynak",
    "sizeTitle": "Boyut",
    "size_1in": "1 inç",
    "size_1inS": "Küçük 1 inç",
    "size_1inL": "Büyük 1 inç",
    "size_2in": "2 inç",
    "size_2inS": "Küçük 2 inç",
    "size_2inL": "Büyük 2 inç",
    "size_idcard": "Kimlik",
    "size_passport": "Pasaport",
    "size_visa": "Vize",
    "size_drive": "Ehliyet",
    "custom": "Özel",
    "previewTitle": "Önizleme",
    "sheetHint": "10×15 tabakaya yaklaşık {n} fotoğraf sığar.",
    "formatTitle": "Dışa aktarma biçimi",
    "qualityTitle": "Kalite",
    "cropTip": "Resmi orana kırpın. Tekerlek yakınlaştırır; orta tuş veya Boşluk kaydırır. Arka plan değişmez.",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgFail": "İşlem başarısız.",
    "msgNoFit": "Bu boyut 10×15’e sığmaz."
  },
  "vi": {
    "title_page": "Ảnh thẻ",
    "desc": "Cắt theo 1 inch, 2 inch, hộ chiếu và các cỡ chuẩn. Tải một ảnh hoặc tờ 10×15. Tất cả trong trình duyệt.",
    "reselect": "Ảnh khác",
    "downloadOne": "Tải một ảnh",
    "downloadSheet": "Tờ 10×15",
    "sourceSize": "Gốc",
    "sizeTitle": "Kích thước",
    "size_1in": "1 inch",
    "size_1inS": "1 inch nhỏ",
    "size_1inL": "1 inch lớn",
    "size_2in": "2 inch",
    "size_2inS": "2 inch nhỏ",
    "size_2inL": "2 inch lớn",
    "size_idcard": "CCCD",
    "size_passport": "Hộ chiếu",
    "size_visa": "Visa",
    "size_drive": "Bằng lái",
    "custom": "Tùy chỉnh",
    "previewTitle": "Xem trước",
    "sheetHint": "Khoảng {n} ảnh trên tờ 10×15.",
    "formatTitle": "Định dạng xuất",
    "qualityTitle": "Chất lượng",
    "cropTip": "Cắt theo tỉ lệ ảnh thẻ. Lăn chuột zoom; nút giữa hoặc Space để pan. Không đổi nền.",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Xử lý thất bại.",
    "msgNoFit": "Cỡ này không vừa tờ 10×15."
  },
  "th": {
    "title_page": "รูปติดบัตร",
    "desc": "ครอปเป็น 1 นิ้ว 2 นิ้ว หนังสือเดินทาง ดาวน์โหลดทีละรูปหรือแผ่น 4×6 ทำในเบราว์เซอร์",
    "reselect": "เลือกรูปใหม่",
    "downloadOne": "ดาวน์โหลดหนึ่งรูป",
    "downloadSheet": "แผ่น 4×6",
    "sourceSize": "ต้นฉบับ",
    "sizeTitle": "ขนาด",
    "size_1in": "1 นิ้ว",
    "size_1inS": "1 นิ้วเล็ก",
    "size_1inL": "1 นิ้วใหญ่",
    "size_2in": "2 นิ้ว",
    "size_2inS": "2 นิ้วเล็ก",
    "size_2inL": "2 นิ้วใหญ่",
    "size_idcard": "บัตรประชาชน",
    "size_passport": "พาสปอร์ต",
    "size_visa": "วีซ่า",
    "size_drive": "ใบขับขี่",
    "custom": "กำหนดเอง",
    "previewTitle": "พรีวิว",
    "sheetHint": "แผ่น 4×6 วางได้ประมาณ {n} รูป",
    "formatTitle": "รูปแบบส่งออก",
    "qualityTitle": "คุณภาพ",
    "cropTip": "ครอปตามสัดส่วนรูปติดบัตร ลูกกลิ้งซูม ปุ่มกลางหรือ Space เลื่อน ไม่เปลี่ยนพื้นหลัง",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgFail": "ประมวลผลไม่สำเร็จ",
    "msgNoFit": "ขนาดนี้ไม่พอแผ่น 4×6"
  },
  "id": {
    "title_page": "Foto identitas",
    "desc": "Potong ke 1 inci, 2 inci, paspor, dan ukuran standar lain. Unduh satu atau lembar 10×15. Semua di browser.",
    "reselect": "Gambar lain",
    "downloadOne": "Unduh satu",
    "downloadSheet": "Lembar 10×15",
    "sourceSize": "Sumber",
    "sizeTitle": "Ukuran",
    "size_1in": "1 inci",
    "size_1inS": "1 inci kecil",
    "size_1inL": "1 inci besar",
    "size_2in": "2 inci",
    "size_2inS": "2 inci kecil",
    "size_2inL": "2 inci besar",
    "size_idcard": "KTP",
    "size_passport": "Paspor",
    "size_visa": "Visa",
    "size_drive": "SIM",
    "custom": "Kustom",
    "previewTitle": "Pratinjau",
    "sheetHint": "Sekitar {n} foto muat di lembar 10×15.",
    "formatTitle": "Format ekspor",
    "qualityTitle": "Kualitas",
    "cropTip": "Potong sesuai rasio resmi. Gulir untuk zoom; tombol tengah atau Spasi untuk geser. Latar tidak diubah.",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Gagal memproses.",
    "msgNoFit": "Ukuran ini tidak muat di 10×15."
  },
  "ms": {
    "title_page": "Foto pengenalan",
    "desc": "Potong kepada 1 inci, 2 inci, pasport dan saiz standard lain. Muat turun satu atau helaian 10×15. Semua dalam pelayar.",
    "reselect": "Imej lain",
    "downloadOne": "Muat turun satu",
    "downloadSheet": "Helaian 10×15",
    "sourceSize": "Sumber",
    "sizeTitle": "Saiz",
    "size_1in": "1 inci",
    "size_1inS": "1 inci kecil",
    "size_1inL": "1 inci besar",
    "size_2in": "2 inci",
    "size_2inS": "2 inci kecil",
    "size_2inL": "2 inci besar",
    "size_idcard": "Kad pengenalan",
    "size_passport": "Pasport",
    "size_visa": "Visa",
    "size_drive": "Lesen memandu",
    "custom": "Tersuai",
    "previewTitle": "Pratonton",
    "sheetHint": "Kira-kira {n} foto muat pada helaian 10×15.",
    "formatTitle": "Format eksport",
    "qualityTitle": "Kualiti",
    "cropTip": "Potong mengikut nisbah rasmi. Tatal untuk zum; butang tengah atau Space untuk alih. Latar tidak diubah.",
    "msgNotImage": "Pilih fail imej.",
    "msgFail": "Gagal memproses.",
    "msgNoFit": "Saiz ini tidak muat pada 10×15."
  },
  "pl": {
    "title_page": "Zdjęcie do dokumentów",
    "desc": "Przytnij do 1 cala, 2 cali, paszportu i innych formatów. Pobierz jedno zdjęcie lub arkusz 10×15. Wszystko w przeglądarce.",
    "reselect": "Inny obraz",
    "downloadOne": "Pobierz jedno",
    "downloadSheet": "Arkusz 10×15",
    "sourceSize": "Źródło",
    "sizeTitle": "Rozmiar",
    "size_1in": "1 cal",
    "size_1inS": "Mały 1 cal",
    "size_1inL": "Duży 1 cal",
    "size_2in": "2 cale",
    "size_2inS": "Małe 2 cale",
    "size_2inL": "Duże 2 cale",
    "size_idcard": "Dowód",
    "size_passport": "Paszport",
    "size_visa": "Wiza",
    "size_drive": "Prawo jazdy",
    "custom": "Własne",
    "previewTitle": "Podgląd",
    "sheetHint": "Na arkusz 10×15 wchodzi ok. {n} zdjęć.",
    "formatTitle": "Format eksportu",
    "qualityTitle": "Jakość",
    "cropTip": "Przytnij do oficjalnych proporcji. Kółko zoomuje; środkowy przycisk lub spacja przesuwa. Tło bez zmian.",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgFail": "Przetwarzanie nie powiodło się.",
    "msgNoFit": "Ten rozmiar nie mieści się na 10×15."
  },
  "uk": {
    "title_page": "Фото на документи",
    "desc": "Обріжте до 1 дюйма, 2 дюймів, паспорта та інших стандартів. Одна копія або аркуш 10×15. Усе в браузері.",
    "reselect": "Інше фото",
    "downloadOne": "Завантажити одне",
    "downloadSheet": "Аркуш 10×15",
    "sourceSize": "Джерело",
    "sizeTitle": "Розмір",
    "size_1in": "1 дюйм",
    "size_1inS": "Малий 1 дюйм",
    "size_1inL": "Великий 1 дюйм",
    "size_2in": "2 дюйми",
    "size_2inS": "Малі 2 дюйми",
    "size_2inL": "Великі 2 дюйми",
    "size_idcard": "Посвідчення",
    "size_passport": "Паспорт",
    "size_visa": "Віза",
    "size_drive": "Посвідчення водія",
    "custom": "Своє",
    "previewTitle": "Перегляд",
    "sheetHint": "На аркуш 10×15 вміщається близько {n} фото.",
    "formatTitle": "Формат експорту",
    "qualityTitle": "Якість",
    "cropTip": "Обрізка під стандарт. Колесо — масштаб; середня кнопка або пробіл — зсув. Тло не змінюється.",
    "msgNotImage": "Виберіть файл зображення.",
    "msgFail": "Не вдалося обробити.",
    "msgNoFit": "Цей розмір не вміщається на 10×15."
  },
  "sv": {
    "title_page": "Passfoto",
    "desc": "Beskär till 1 tum, 2 tum, pass och andra standardmått. Ladda ner en kopia eller ett 10×15-ark. Allt i webbläsaren.",
    "reselect": "Annan bild",
    "downloadOne": "Ladda ner en",
    "downloadSheet": "10×15-ark",
    "sourceSize": "Källa",
    "sizeTitle": "Storlek",
    "size_1in": "1 tum",
    "size_1inS": "Liten 1 tum",
    "size_1inL": "Stor 1 tum",
    "size_2in": "2 tum",
    "size_2inS": "Liten 2 tum",
    "size_2inL": "Stor 2 tum",
    "size_idcard": "ID-kort",
    "size_passport": "Pass",
    "size_visa": "Visum",
    "size_drive": "Körkort",
    "custom": "Anpassad",
    "previewTitle": "Förhandsvisning",
    "sheetHint": "Cirka {n} foton på ett 10×15-ark.",
    "formatTitle": "Exportformat",
    "qualityTitle": "Kvalitet",
    "cropTip": "Beskär till officiellt förhållande. Scrolla för zoom; mittenknapp eller blanksteg för att pan. Bakgrunden ändras inte.",
    "msgNotImage": "Välj en bildfil.",
    "msgFail": "Bearbetningen misslyckades.",
    "msgNoFit": "Denna storlek ryms inte på 10×15."
  },
  "zh-TW": {
    "title_page": "證件照",
    "desc": "依一寸、二寸、身分證、護照等標準尺寸裁切證件照，可下載單張，或排版到 6 寸相紙一次沖印多張。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "downloadOne": "下載單張",
    "downloadSheet": "下載 6 寸排版",
    "sourceSize": "原圖",
    "sizeTitle": "規格",
    "size_1in": "一寸",
    "size_1inS": "小一寸",
    "size_1inL": "大一寸",
    "size_2in": "二寸",
    "size_2inS": "小二寸",
    "size_2inL": "大二寸",
    "size_idcard": "身分證",
    "size_passport": "護照",
    "size_visa": "簽證",
    "size_drive": "駕照",
    "custom": "自訂",
    "previewTitle": "效果預覽",
    "sheetHint": "6 寸相紙大約可排 {n} 張。",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "cropTip": "按證件照比例裁切。滾輪縮放背景；按住中鍵或空白鍵拖動。本工具不更換背景色。",
    "msgNotImage": "請選擇圖片檔。",
    "msgFail": "處理失敗。",
    "msgNoFit": "目前尺寸無法排進 6 寸相紙。"
  }
}
</i18n>
