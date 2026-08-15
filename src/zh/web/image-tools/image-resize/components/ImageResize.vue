<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"

const { t } = useI18n()

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

const PERCENT_PRESETS = [25, 50, 75, 100, 150, 200]
const EDGE_PRESETS = [640, 800, 1080, 1280, 1920]

const objectUrl = ref("")
const fileName = ref("image")
const srcImg = ref<HTMLImageElement | null>(null)
const srcW = ref(0)
const srcH = ref(0)
const outW = ref(1)
const outH = ref(1)
const percent = ref(100)
const lock = ref(true)
const smooth = ref(true)
const format = ref<ExportFmt>("png")
const quality = ref(0.92)
const needQuality = computed(() => format.value !== "png")

const previewRef = ref<HTMLCanvasElement | null>(null)
const previewHost = ref<HTMLElement | null>(null)

let redrawTimer: ReturnType<typeof setTimeout> | null = null
let hostRo: ResizeObserver | null = null

const ratio = computed(() => (srcW.value && srcH.value ? srcW.value / srcH.value : 1))

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

function clampSize(n: number) {
  return Math.min(16384, Math.max(1, Math.round(n) || 1))
}

function syncPercent() {
  if (!srcW.value) return
  percent.value = Math.round((outW.value / srcW.value) * 1000) / 10
}

function applyWidth(w: number) {
  outW.value = clampSize(w)
  if (lock.value) outH.value = clampSize(outW.value / ratio.value)
  syncPercent()
  scheduleDraw()
}

function applyHeight(h: number) {
  outH.value = clampSize(h)
  if (lock.value) outW.value = clampSize(outH.value * ratio.value)
  syncPercent()
  scheduleDraw()
}

function applyPercent(p: number) {
  percent.value = Math.min(800, Math.max(1, p))
  outW.value = clampSize((srcW.value * percent.value) / 100)
  outH.value = clampSize((srcH.value * percent.value) / 100)
  scheduleDraw()
}

function applyLongEdge(edge: number) {
  if (!srcW.value || !srcH.value) return
  if (srcW.value >= srcH.value) applyWidth(edge)
  else applyHeight(edge)
}

function resetSize() {
  applyPercent(100)
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
    const img = await loadImage(objectUrl.value)
    srcImg.value = img
    srcW.value = img.naturalWidth
    srcH.value = img.naturalHeight
    applyPercent(100)
    await nextTick()
    drawPreview()
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

function paint(canvas: HTMLCanvasElement, destW: number, destH: number) {
  const src = srcImg.value
  if (!src) return false
  canvas.width = destW
  canvas.height = destH
  const ctx = canvas.getContext("2d")
  if (!ctx) return false
  ctx.imageSmoothingEnabled = smooth.value
  ctx.imageSmoothingQuality = smooth.value ? "high" : "low"
  ctx.clearRect(0, 0, destW, destH)
  ctx.drawImage(src, 0, 0, destW, destH)
  return true
}

function drawPreview() {
  const canvas = previewRef.value
  const host = previewHost.value
  const src = srcImg.value
  if (!canvas || !host || !src) return
  const maxW = host.clientWidth || 640
  const maxH = host.clientHeight || 420
  const s = Math.min(maxW / outW.value, maxH / outH.value, 1)
  const w = Math.max(1, Math.round(outW.value * s))
  const h = Math.max(1, Math.round(outH.value * s))
  paint(canvas, w, h)
}

function scheduleDraw() {
  if (redrawTimer) clearTimeout(redrawTimer)
  redrawTimer = setTimeout(drawPreview, 40)
}

watch([smooth, format], scheduleDraw)

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
  const canvas = document.createElement("canvas")
  if (!paint(canvas, outW.value, outH.value)) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `${fileName.value}-${outW.value}x${outH.value}.${EXT[format.value]}`)
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
  <div class="rs-page">
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
        <el-button @click="resetSize">{{ t("resetSize") }}</el-button>
        <el-button
          type="primary"
          @click="download"
        >
          {{ t("download") }}
        </el-button>
        <span class="meta">
          {{ t("sourceSize") }} {{ srcW }} × {{ srcH }}
          → {{ outW }} × {{ outH }}
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
          <h2 class="sub">{{ t("sizeTitle") }}</h2>
          <div class="size-row">
            <el-input-number
              :model-value="outW"
              :min="1"
              :max="16384"
              :step="1"
              controls-position="right"
              @change="(v: number | undefined) => applyWidth(v ?? 1)"
            />
            <span class="times">×</span>
            <el-input-number
              :model-value="outH"
              :min="1"
              :max="16384"
              :step="1"
              controls-position="right"
              @change="(v: number | undefined) => applyHeight(v ?? 1)"
            />
          </div>
          <el-checkbox v-model="lock">{{ t("lock") }}</el-checkbox>

          <h2 class="sub">{{ t("percentTitle") }} {{ percent }}%</h2>
          <el-slider
            :model-value="percent"
            :min="1"
            :max="400"
            :step="0.5"
            :show-tooltip="false"
            @input="(v: number | number[]) => applyPercent(Number(v))"
          />
          <div class="chips">
            <el-button
              v-for="p in PERCENT_PRESETS"
              :key="p"
              size="small"
              :type="percent === p ? 'primary' : 'default'"
              @click="applyPercent(p)"
            >
              {{ p }}%
            </el-button>
          </div>

          <h2 class="sub">{{ t("edgeTitle") }}</h2>
          <div class="chips">
            <el-button
              v-for="e in EDGE_PRESETS"
              :key="e"
              size="small"
              @click="applyLongEdge(e)"
            >
              {{ e }}px
            </el-button>
          </div>
          <p class="hint">{{ t("edgeHint") }}</p>

          <el-checkbox v-model="smooth">{{ t("smooth") }}</el-checkbox>

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
.rs-page {
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

.size-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.times {
  color: var(--vp-c-text-3);
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

.hint {
  margin: 0 0 10px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.fmt-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

:deep(.el-input-number) {
  width: 110px;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片尺寸调整",
    "desc": "拖入图片后按像素或百分比缩放，可锁定宽高比，再导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "resetSize": "恢复原尺寸",
    "download": "下载图片",
    "sourceSize": "原图",
    "sizeTitle": "输出宽高",
    "lock": "锁定宽高比",
    "percentTitle": "缩放比例",
    "edgeTitle": "按长边",
    "edgeHint": "按原图较长的一边缩放到所选像素，短边按比例计算。",
    "smooth": "平滑缩放",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。"
  },
  "zh-CN": {
    "title_page": "图片尺寸调整",
    "desc": "拖入图片后按像素或百分比缩放，可锁定宽高比，再导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "resetSize": "恢复原尺寸",
    "download": "下载图片",
    "sourceSize": "原图",
    "sizeTitle": "输出宽高",
    "lock": "锁定宽高比",
    "percentTitle": "缩放比例",
    "edgeTitle": "按长边",
    "edgeHint": "按原图较长的一边缩放到所选像素，短边按比例计算。",
    "smooth": "平滑缩放",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。"
  },
  "en": {
    "title_page": "Resize image",
    "desc": "Scale by pixels or percent, lock aspect ratio, then export PNG, JPG, or WebP. Everything stays in your browser.",
    "reselect": "Choose another",
    "resetSize": "Original size",
    "download": "Download image",
    "sourceSize": "Source",
    "sizeTitle": "Output size",
    "lock": "Lock aspect ratio",
    "percentTitle": "Scale",
    "edgeTitle": "By long edge",
    "edgeHint": "Fit the longer side to the chosen pixels; the short side follows the ratio.",
    "smooth": "Smooth scaling",
    "formatTitle": "Export format",
    "qualityTitle": "Quality",
    "msgNotImage": "Please choose an image file.",
    "msgFail": "Could not process the image."
  },
  "ja": {
    "title_page": "画像サイズ変更",
    "desc": "ピクセルまたは割合で拡大縮小し、縦横比を固定して PNG / JPG / WebP で保存します。処理はブラウザ内です。",
    "reselect": "別の画像",
    "resetSize": "元のサイズ",
    "download": "画像を保存",
    "sourceSize": "元画像",
    "sizeTitle": "出力サイズ",
    "lock": "縦横比を固定",
    "percentTitle": "倍率",
    "edgeTitle": "長辺指定",
    "edgeHint": "長い辺を指定ピクセルに合わせ、短い辺は比率で決まります。",
    "smooth": "滑らかに拡大縮小",
    "formatTitle": "書き出し形式",
    "qualityTitle": "画質",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "処理できませんでした。"
  },
  "ko": {
    "title_page": "이미지 크기 조정",
    "desc": "픽셀 또는 비율로 조절하고 가로세로 비율을 잠근 뒤 PNG, JPG, WebP로 받습니다. 모두 브라우저에서 처리됩니다.",
    "reselect": "다른 이미지",
    "resetSize": "원본 크기",
    "download": "이미지 다운로드",
    "sourceSize": "원본",
    "sizeTitle": "출력 크기",
    "lock": "비율 잠금",
    "percentTitle": "배율",
    "edgeTitle": "긴 변 기준",
    "edgeHint": "긴 변을 선택한 픽셀에 맞추고 짧은 변은 비율로 계산합니다.",
    "smooth": "부드럽게 조절",
    "formatTitle": "내보내기 형식",
    "qualityTitle": "화질",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "처리하지 못했습니다."
  },
  "fr": {
    "title_page": "Redimensionner l’image",
    "desc": "Modifiez largeur et hauteur en pixels ou en pourcentage, verrouillez le ratio, puis exportez PNG, JPG ou WebP. Tout reste dans le navigateur.",
    "reselect": "Autre image",
    "resetSize": "Taille d’origine",
    "download": "Télécharger l’image",
    "sourceSize": "Source",
    "sizeTitle": "Taille de sortie",
    "lock": "Verrouiller le ratio",
    "percentTitle": "Échelle",
    "edgeTitle": "Par grand côté",
    "edgeHint": "Le côté le plus long prend la valeur choisie ; le petit côté suit le ratio.",
    "smooth": "Lissage",
    "formatTitle": "Format d’export",
    "qualityTitle": "Qualité",
    "msgNotImage": "Choisissez un fichier image.",
    "msgFail": "Échec du traitement."
  },
  "de": {
    "title_page": "Bildgröße ändern",
    "desc": "Nach Pixeln oder Prozent skalieren, Seitenverhältnis sperren, dann als PNG, JPG oder WebP speichern. Alles im Browser.",
    "reselect": "Anderes Bild",
    "resetSize": "Originalgröße",
    "download": "Bild herunterladen",
    "sourceSize": "Quelle",
    "sizeTitle": "Ausgabegröße",
    "lock": "Seitenverhältnis sperren",
    "percentTitle": "Skalierung",
    "edgeTitle": "Nach langer Kante",
    "edgeHint": "Die längere Seite wird auf den Wert gesetzt, die kurze folgt dem Verhältnis.",
    "smooth": "Weich skalieren",
    "formatTitle": "Exportformat",
    "qualityTitle": "Qualität",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgFail": "Verarbeitung fehlgeschlagen."
  },
  "es": {
    "title_page": "Redimensionar imagen",
    "desc": "Cambia el tamaño en píxeles o porcentaje, bloquea la proporción y exporta PNG, JPG o WebP. Todo en el navegador.",
    "reselect": "Otra imagen",
    "resetSize": "Tamaño original",
    "download": "Descargar imagen",
    "sourceSize": "Origen",
    "sizeTitle": "Tamaño de salida",
    "lock": "Bloquear proporción",
    "percentTitle": "Escala",
    "edgeTitle": "Por lado largo",
    "edgeHint": "El lado más largo toma el valor; el corto sigue la proporción.",
    "smooth": "Suavizar",
    "formatTitle": "Formato de exportación",
    "qualityTitle": "Calidad",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgFail": "Error al procesar."
  },
  "pt": {
    "title_page": "Redimensionar imagem",
    "desc": "Altere a largura e a altura em píxeis ou percentagem, bloqueie a proporção e exporte PNG, JPG ou WebP. Tudo no navegador.",
    "reselect": "Outra imagem",
    "resetSize": "Tamanho original",
    "download": "Descarregar imagem",
    "sourceSize": "Origem",
    "sizeTitle": "Tamanho de saída",
    "lock": "Bloquear proporção",
    "percentTitle": "Escala",
    "edgeTitle": "Pelo lado maior",
    "edgeHint": "O lado mais longo fica no valor escolhido; o curto segue a proporção.",
    "smooth": "Suavizar",
    "formatTitle": "Formato de exportação",
    "qualityTitle": "Qualidade",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgFail": "Falha ao processar."
  },
  "ru": {
    "title_page": "Изменить размер картинки",
    "desc": "Масштабируйте в пикселях или процентах, зафиксируйте пропорции и сохраните PNG, JPG или WebP. Всё в браузере.",
    "reselect": "Другое фото",
    "resetSize": "Исходный размер",
    "download": "Скачать изображение",
    "sourceSize": "Исходник",
    "sizeTitle": "Размер выхода",
    "lock": "Сохранять пропорции",
    "percentTitle": "Масштаб",
    "edgeTitle": "По длинной стороне",
    "edgeHint": "Длинная сторона станет выбранным значением, короткая посчитается по пропорции.",
    "smooth": "Сглаживать",
    "formatTitle": "Формат экспорта",
    "qualityTitle": "Качество",
    "msgNotImage": "Выберите файл изображения.",
    "msgFail": "Не удалось обработать."
  },
  "ar": {
    "title_page": "تغيير حجم الصورة",
    "desc": "غيّر العرض والارتفاع بالبكسل أو النسبة، اقفل النسبة، ثم صدّر PNG أو JPG أو WebP. كل شيء في المتصفح.",
    "reselect": "صورة أخرى",
    "resetSize": "الحجم الأصلي",
    "download": "تنزيل الصورة",
    "sourceSize": "المصدر",
    "sizeTitle": "حجم الإخراج",
    "lock": "قفل النسبة",
    "percentTitle": "المقياس",
    "edgeTitle": "حسب الضلع الأطول",
    "edgeHint": "الضلع الأطول يأخذ القيمة المختارة، والأقصر يتبع النسبة.",
    "smooth": "تحجيم ناعم",
    "formatTitle": "صيغة التصدير",
    "qualityTitle": "الجودة",
    "msgNotImage": "اختر ملف صورة.",
    "msgFail": "تعذر المعالجة."
  },
  "hi": {
    "title_page": "इमेज साइज़ बदलें",
    "desc": "पिक्सेल या प्रतिशत से स्केल करें, अनुपात लॉक करें, फिर PNG, JPG या WebP निकालें। सब ब्राउज़र में रहता है।",
    "reselect": "दूसरी इमेज",
    "resetSize": "मूल साइज़",
    "download": "इमेज डाउनलोड",
    "sourceSize": "स्रोत",
    "sizeTitle": "आउटपुट साइज़",
    "lock": "अनुपात लॉक",
    "percentTitle": "स्केल",
    "edgeTitle": "लंबी भुजा से",
    "edgeHint": "लंबी भुजा चुने गए पिक्सेल पर बैठेगी, छोटी अनुपात से निकलेगी।",
    "smooth": "स्मूथ स्केल",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "qualityTitle": "क्वालिटी",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgFail": "प्रोसेस असफल।"
  },
  "it": {
    "title_page": "Ridimensiona immagine",
    "desc": "Scala in pixel o percentuale, blocca le proporzioni ed esporta PNG, JPG o WebP. Tutto nel browser.",
    "reselect": "Altra immagine",
    "resetSize": "Dimensione originale",
    "download": "Scarica immagine",
    "sourceSize": "Sorgente",
    "sizeTitle": "Dimensione di output",
    "lock": "Blocca proporzioni",
    "percentTitle": "Scala",
    "edgeTitle": "Per lato lungo",
    "edgeHint": "Il lato più lungo assume il valore scelto; il corto segue il rapporto.",
    "smooth": "Ridimensionamento morbido",
    "formatTitle": "Formato di esportazione",
    "qualityTitle": "Qualità",
    "msgNotImage": "Scegli un file immagine.",
    "msgFail": "Elaborazione non riuscita."
  },
  "nl": {
    "title_page": "Afbeelding schalen",
    "desc": "Schaal in pixels of procent, vergrendel de verhouding en exporteer PNG, JPG of WebP. Alles in de browser.",
    "reselect": "Andere afbeelding",
    "resetSize": "Oorspronkelijke grootte",
    "download": "Afbeelding downloaden",
    "sourceSize": "Bron",
    "sizeTitle": "Uitvoergrootte",
    "lock": "Verhouding vergrendelen",
    "percentTitle": "Schaal",
    "edgeTitle": "Op lange zijde",
    "edgeHint": "De langste zijde krijgt de gekozen pixels; de korte volgt de verhouding.",
    "smooth": "Vloeiend schalen",
    "formatTitle": "Exportformaat",
    "qualityTitle": "Kwaliteit",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgFail": "Verwerken mislukt."
  },
  "tr": {
    "title_page": "Görüntü boyutunu değiştir",
    "desc": "Piksel veya yüzde ile ölçekleyin, oranı kilitleyin, PNG, JPG veya WebP alın. Hepsi tarayıcıda.",
    "reselect": "Başka görüntü",
    "resetSize": "Orijinal boyut",
    "download": "Görüntüyü indir",
    "sourceSize": "Kaynak",
    "sizeTitle": "Çıktı boyutu",
    "lock": "Oranı kilitle",
    "percentTitle": "Ölçek",
    "edgeTitle": "Uzun kenara göre",
    "edgeHint": "Uzun kenar seçilen piksele oturur, kısa kenar orana göre hesaplanır.",
    "smooth": "Yumuşak ölçekleme",
    "formatTitle": "Dışa aktarma biçimi",
    "qualityTitle": "Kalite",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgFail": "İşlem başarısız."
  },
  "vi": {
    "title_page": "Đổi kích thước ảnh",
    "desc": "Thu phóng theo pixel hoặc phần trăm, khóa tỉ lệ, rồi xuất PNG, JPG hoặc WebP. Tất cả trong trình duyệt.",
    "reselect": "Ảnh khác",
    "resetSize": "Kích thước gốc",
    "download": "Tải ảnh",
    "sourceSize": "Gốc",
    "sizeTitle": "Kích thước xuất",
    "lock": "Khóa tỉ lệ",
    "percentTitle": "Tỉ lệ",
    "edgeTitle": "Theo cạnh dài",
    "edgeHint": "Cạnh dài bằng số pixel đã chọn; cạnh ngắn theo tỉ lệ.",
    "smooth": "Thu phóng mượt",
    "formatTitle": "Định dạng xuất",
    "qualityTitle": "Chất lượng",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Xử lý thất bại."
  },
  "th": {
    "title_page": "ปรับขนาดรูป",
    "desc": "ย่อขยายเป็นพิกเซลหรือเปอร์เซ็นต์ ล็อกสัดส่วน แล้วส่งออก PNG JPG หรือ WebP ทำในเบราว์เซอร์",
    "reselect": "เลือกรูปใหม่",
    "resetSize": "ขนาดเดิม",
    "download": "ดาวน์โหลดรูป",
    "sourceSize": "ต้นฉบับ",
    "sizeTitle": "ขนาดส่งออก",
    "lock": "ล็อกสัดส่วน",
    "percentTitle": "สเกล",
    "edgeTitle": "ตามด้านยาว",
    "edgeHint": "ด้านยาวเท่าพิกเซลที่เลือก ด้านสั้นคิดตามสัดส่วน",
    "smooth": "ย่อขยายเนียน",
    "formatTitle": "รูปแบบส่งออก",
    "qualityTitle": "คุณภาพ",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgFail": "ประมวลผลไม่สำเร็จ"
  },
  "id": {
    "title_page": "Ubah ukuran gambar",
    "desc": "Skala dengan piksel atau persen, kunci rasio, lalu ekspor PNG, JPG, atau WebP. Semua di browser.",
    "reselect": "Gambar lain",
    "resetSize": "Ukuran asli",
    "download": "Unduh gambar",
    "sourceSize": "Sumber",
    "sizeTitle": "Ukuran keluaran",
    "lock": "Kunci rasio",
    "percentTitle": "Skala",
    "edgeTitle": "Menurut sisi panjang",
    "edgeHint": "Sisi lebih panjang menjadi piksel yang dipilih; sisi pendek mengikuti rasio.",
    "smooth": "Skala halus",
    "formatTitle": "Format ekspor",
    "qualityTitle": "Kualitas",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Gagal memproses."
  },
  "ms": {
    "title_page": "Ubah saiz imej",
    "desc": "Skalakan dengan piksel atau peratus, kunci nisbah, kemudian eksport PNG, JPG atau WebP. Semua dalam pelayar.",
    "reselect": "Imej lain",
    "resetSize": "Saiz asal",
    "download": "Muat turun imej",
    "sourceSize": "Sumber",
    "sizeTitle": "Saiz output",
    "lock": "Kunci nisbah",
    "percentTitle": "Skala",
    "edgeTitle": "Mengikut sisi panjang",
    "edgeHint": "Sisi lebih panjang menjadi piksel dipilih; sisi pendek ikut nisbah.",
    "smooth": "Skala licin",
    "formatTitle": "Format eksport",
    "qualityTitle": "Kualiti",
    "msgNotImage": "Pilih fail imej.",
    "msgFail": "Gagal memproses."
  },
  "pl": {
    "title_page": "Zmień rozmiar obrazu",
    "desc": "Skaluj w pikselach lub procentach, zablokuj proporcje i eksportuj PNG, JPG lub WebP. Wszystko w przeglądarce.",
    "reselect": "Inny obraz",
    "resetSize": "Oryginalny rozmiar",
    "download": "Pobierz obraz",
    "sourceSize": "Źródło",
    "sizeTitle": "Rozmiar wyjściowy",
    "lock": "Zablokuj proporcje",
    "percentTitle": "Skala",
    "edgeTitle": "Według dłuższego boku",
    "edgeHint": "Dłuższy bok przyjmie wybraną wartość, krótszy wyjdzie z proporcji.",
    "smooth": "Płynne skalowanie",
    "formatTitle": "Format eksportu",
    "qualityTitle": "Jakość",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgFail": "Przetwarzanie nie powiodło się."
  },
  "uk": {
    "title_page": "Змінити розмір зображення",
    "desc": "Масштабуйте в пікселях або відсотках, зафіксуйте пропорції й експортуйте PNG, JPG або WebP. Усе в браузері.",
    "reselect": "Інше фото",
    "resetSize": "Початковий розмір",
    "download": "Завантажити зображення",
    "sourceSize": "Джерело",
    "sizeTitle": "Вихідний розмір",
    "lock": "Зберігати пропорції",
    "percentTitle": "Масштаб",
    "edgeTitle": "За довгим боком",
    "edgeHint": "Довший бік стане вибраним значенням, коротший порахується за пропорцією.",
    "smooth": "Згладжувати",
    "formatTitle": "Формат експорту",
    "qualityTitle": "Якість",
    "msgNotImage": "Виберіть файл зображення.",
    "msgFail": "Не вдалося обробити."
  },
  "sv": {
    "title_page": "Ändra bildstorlek",
    "desc": "Skala i pixlar eller procent, lås proportionerna och exportera PNG, JPG eller WebP. Allt i webbläsaren.",
    "reselect": "Annan bild",
    "resetSize": "Originalstorlek",
    "download": "Ladda ner bild",
    "sourceSize": "Källa",
    "sizeTitle": "Utstorlek",
    "lock": "Lås proportioner",
    "percentTitle": "Skala",
    "edgeTitle": "Efter långsida",
    "edgeHint": "Den längre sidan får valt pixelvärde; den korta följer proportionen.",
    "smooth": "Mjuk skalning",
    "formatTitle": "Exportformat",
    "qualityTitle": "Kvalitet",
    "msgNotImage": "Välj en bildfil.",
    "msgFail": "Bearbetningen misslyckades."
  },
  "zh-TW": {
    "title_page": "圖片尺寸調整",
    "desc": "拖入圖片後依像素或百分比縮放，可鎖定寬高比，再匯出 PNG / JPG / WebP。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "resetSize": "恢復原尺寸",
    "download": "下載圖片",
    "sourceSize": "原圖",
    "sizeTitle": "輸出寬高",
    "lock": "鎖定寬高比",
    "percentTitle": "縮放比例",
    "edgeTitle": "按長邊",
    "edgeHint": "按原圖較長的一邊縮放到所選像素，短邊按比例計算。",
    "smooth": "平滑縮放",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "msgNotImage": "請選擇圖片檔。",
    "msgFail": "處理失敗。"
  }
}
</i18n>
