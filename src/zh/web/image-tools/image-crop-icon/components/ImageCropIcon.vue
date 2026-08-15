<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import ImageCropper from "@/components/ImageCropper.vue"
import type { CropRect } from "@/components/ImageCropper.vue"
import JSZip from "jszip"

const { t } = useI18n()

const ICON_SIZES = [16, 24, 32, 48, 64, 96, 128, 192, 256, 512] as const

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

const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)
const objectUrl = ref("")
const fileName = ref("icon")
const selected = ref<number[]>([32, 64, 128, 256])
const previews = ref<Record<number, string>>({})
const naturalSize = ref("")
const cropTick = ref(0)
const format = ref<ExportFmt>("png")
const quality = ref(0.92)

const needQuality = computed(() => format.value !== "png")

let previewTimer: ReturnType<typeof setTimeout> | null = null

function revokeUrl() {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = ""
}

function clearPreviews() {
  for (const url of Object.values(previews.value)) URL.revokeObjectURL(url)
  previews.value = {}
}

function pickImage(files: File[]) {
  const file = files.find(f => f.type.startsWith("image/"))
  if (!file) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  revokeUrl()
  clearPreviews()
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name.replace(/\.[^.]+$/, "") || "icon"
}

function onCropChange(_rect: CropRect) {
  cropTick.value += 1
}

function onImgLoad(size: { width: number; height: number }) {
  naturalSize.value = `${size.width} × ${size.height}`
  nextTick(refreshPreviews)
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(b => resolve(b), "image/png")
  })
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

function canvasToBlob(canvas: HTMLCanvasElement, fmt: ExportFmt, q: number) {
  return new Promise<Blob | null>(resolve => {
    const source = fmt === "jpeg" ? flattenJpeg(canvas) : canvas
    if (!source) {
      resolve(null)
      return
    }
    source.toBlob(
      b => resolve(b),
      MIME[fmt],
      fmt === "png" ? undefined : q
    )
  })
}

function scaleCanvas(source: HTMLCanvasElement, size: number) {
  const c = document.createElement("canvas")
  c.width = size
  c.height = size
  const ctx = c.getContext("2d")
  if (!ctx) return null
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, 0, 0, size, size)
  return c
}

async function refreshPreviews() {
  const cropper = cropperRef.value
  if (!cropper || !objectUrl.value) return
  const source = cropper.getCroppedCanvas()
  if (!source) return
  const next: Record<number, string> = {}
  for (const size of ICON_SIZES) {
    const c = scaleCanvas(source, size)
    if (!c) continue
    const blob = await canvasToPng(c)
    if (!blob) continue
    next[size] = URL.createObjectURL(blob)
  }
  clearPreviews()
  previews.value = next
}

watch(cropTick, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(() => {
    void refreshPreviews()
  }, 60)
})

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

function getSourceCanvas() {
  return cropperRef.value?.getCroppedCanvas() ?? null
}

async function blobForSize(size: number) {
  const source = getSourceCanvas()
  if (!source) return null
  const c = scaleCanvas(source, size)
  if (!c) return null
  return canvasToBlob(c, format.value, quality.value)
}

function fileLabel(size: number) {
  return `${fileName.value}-${size}.${EXT[format.value]}`
}

async function downloadOne(size: number) {
  const blob = await blobForSize(size)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, fileLabel(size))
}

async function downloadSelected() {
  const sizes = [...selected.value].sort((a, b) => a - b)
  if (!sizes.length) {
    ElMessage({ message: t("msgNoSize"), type: "warning" })
    return
  }
  if (sizes.length === 1) {
    await downloadOne(sizes[0]!)
    return
  }
  const zip = new JSZip()
  for (const size of sizes) {
    const blob = await blobForSize(size)
    if (blob) zip.file(fileLabel(size), blob)
  }
  const packed = await zip.generateAsync({ type: "blob" })
  saveBlob(packed, `${fileName.value}-icons.zip`)
}

function reset() {
  revokeUrl()
  clearPreviews()
  naturalSize.value = ""
}

onUnmounted(() => {
  if (previewTimer) clearTimeout(previewTimer)
  revokeUrl()
  clearPreviews()
})
</script>

<template>
  <div class="icon-page">
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
          @click="downloadSelected"
        >
          {{ t("download") }}
        </el-button>
        <span
          v-if="naturalSize"
          class="meta"
        >{{ t("sourceSize") }} {{ naturalSize }}</span>
      </div>

      <div class="work">
        <div class="crop-wrap">
          <div class="crop-stage-host">
            <ImageCropper
              ref="cropperRef"
              :src="objectUrl"
              :aspect-ratio="1"
              @change="onCropChange"
              @load="onImgLoad"
            />
          </div>
          <p class="crop-tip">{{ t("cropTip") }}</p>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("formatTitle") }}</h2>
          <el-radio-group
            v-model="format"
            class="fmt-group"
          >
            <el-radio-button value="png">PNG</el-radio-button>
            <el-radio-button value="jpeg">JPG</el-radio-button>
            <el-radio-button value="webp">WebP</el-radio-button>
          </el-radio-group>
          <p class="sizes-hint">{{ t("formatHint") }}</p>

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

          <h2 class="sub">{{ t("sizesTitle") }}</h2>
          <el-checkbox-group v-model="selected">
            <el-checkbox
              v-for="s in ICON_SIZES"
              :key="s"
              :label="s"
              :value="s"
            >
              {{ s }}×{{ s }}
            </el-checkbox>
          </el-checkbox-group>
          <p class="sizes-hint">{{ t("sizesHint") }}</p>

          <h2 class="sub">{{ t("previewTitle") }}</h2>
          <div class="previews">
            <div
              v-for="s in ICON_SIZES"
              :key="s"
              class="preview"
              :class="{ off: !selected.includes(s) }"
            >
              <div
                class="preview-frame"
                :style="{ width: `${Math.min(Math.max(s, 32), 96)}px`, height: `${Math.min(Math.max(s, 32), 96)}px` }"
              >
                <img
                  v-if="previews[s]"
                  :src="previews[s]"
                  :width="Math.min(s, 96)"
                  :height="Math.min(s, 96)"
                  alt=""
                />
              </div>
              <span>{{ s }}px</span>
              <el-button
                link
                type="primary"
                size="small"
                :disabled="!previews[s]"
                @click="downloadOne(s)"
              >
                {{ t("downloadOne") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.icon-page {
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

.crop-wrap {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  height: min(62vh, 520px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.crop-stage-host {
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
  margin: 12px 0 10px;
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

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-bottom: 8px;
}

.sizes-hint {
  margin: 0 0 8px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.previews {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 14px;
}

.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);

  &.off {
    opacity: 0.4;
  }
}

.preview-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(45deg, var(--vp-c-bg) 25%, transparent 25%) 0 0 / 8px 8px,
    linear-gradient(-45deg, var(--vp-c-bg) 25%, transparent 25%) 0 4px / 8px 8px;
  background-color: var(--vp-c-bg-soft);
  image-rendering: pixelated;
}

.preview-frame img {
  display: block;
  image-rendering: pixelated;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片裁切图标",
    "desc": "拖入图片，裁切为正方形后按常用图标尺寸导出 PNG、JPG 或 WebP。勾选多个尺寸会打成 ZIP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载所选尺寸",
    "downloadOne": "下载此尺寸",
    "sourceSize": "原图",
    "cropTip": "拖动选框移动，四角可缩放。滚轮缩放背景；按住中键或空格拖动背景。比例锁定为正方形。",
    "formatTitle": "导出格式",
    "formatHint": "PNG 保留透明；JPG 会铺白底；WebP 体积更小。",
    "qualityTitle": "画质",
    "sizesTitle": "导出尺寸",
    "sizesHint": "勾选多个尺寸时打包成 ZIP；只勾一个则直接下载该文件。",
    "previewTitle": "实时预览",
    "msgNotImage": "请选择图片文件。",
    "msgNoSize": "请至少勾选一个尺寸。",
    "msgFail": "导出失败。"
  },
  "zh-CN": {
    "title_page": "图片裁切图标",
    "desc": "拖入图片，裁切为正方形后按常用图标尺寸导出 PNG、JPG 或 WebP。勾选多个尺寸会打成 ZIP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载所选尺寸",
    "downloadOne": "下载此尺寸",
    "sourceSize": "原图",
    "cropTip": "拖动选框移动，四角可缩放。滚轮缩放背景；按住中键或空格拖动背景。比例锁定为正方形。",
    "formatTitle": "导出格式",
    "formatHint": "PNG 保留透明；JPG 会铺白底；WebP 体积更小。",
    "qualityTitle": "画质",
    "sizesTitle": "导出尺寸",
    "sizesHint": "勾选多个尺寸时打包成 ZIP；只勾一个则直接下载该文件。",
    "previewTitle": "实时预览",
    "msgNotImage": "请选择图片文件。",
    "msgNoSize": "请至少勾选一个尺寸。",
    "msgFail": "导出失败。"
  },
  "en": {
    "title_page": "Crop image to icon",
    "desc": "Drop an image, crop a square, then export PNG, JPG, or WebP at common icon sizes. Multiple sizes become a ZIP. Everything stays in your browser.",
    "reselect": "Choose another",
    "download": "Download selected",
    "downloadOne": "Download this size",
    "sourceSize": "Source",
    "cropTip": "Drag the box to move; corners resize. Scroll to zoom; hold middle mouse or Space to pan. Aspect is locked to square.",
    "formatTitle": "Export format",
    "formatHint": "PNG keeps transparency; JPG uses a white background; WebP is smaller.",
    "qualityTitle": "Quality",
    "sizesTitle": "Export sizes",
    "sizesHint": "Several sizes pack into a ZIP; one size downloads as a single file.",
    "previewTitle": "Live preview",
    "msgNotImage": "Please choose an image file.",
    "msgNoSize": "Select at least one size.",
    "msgFail": "Export failed."
  },
  "ja": {
    "title_page": "画像をアイコンに切り抜き",
    "desc": "画像を正方形に切り抜き、よく使うサイズで PNG / JPG / WebP として保存します。複数サイズは ZIP になります。処理はブラウザ内です。",
    "reselect": "別の画像",
    "download": "選択サイズを保存",
    "downloadOne": "このサイズを保存",
    "sourceSize": "元画像",
    "cropTip": "枠をドラッグして移動、四隅で拡大縮小。正方形固定です。",
    "formatTitle": "書き出し形式",
    "formatHint": "PNG は透明を保持、JPG は白背景、WebP は軽量です。",
    "qualityTitle": "画質",
    "sizesTitle": "書き出しサイズ",
    "sizesHint": "複数選択は ZIP、1つだけならそのファイルを保存します。",
    "previewTitle": "リアルタイムプレビュー",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgNoSize": "サイズを1つ以上選んでください。",
    "msgFail": "書き出せませんでした。"
  },
  "ko": {
    "title_page": "이미지를 아이콘으로 자르기",
    "desc": "이미지를 정사각형으로 자른 뒤 흔한 아이콘 크기로 PNG, JPG, WebP를 받습니다. 여러 크기는 ZIP입니다. 모두 브라우저에서 처리됩니다.",
    "reselect": "다른 이미지",
    "download": "선택한 크기 받기",
    "downloadOne": "이 크기 받기",
    "sourceSize": "원본",
    "cropTip": "상자를 끌어 이동하고 모서리로 크기 조절. 정사각형으로 고정됩니다.",
    "formatTitle": "내보내기 형식",
    "formatHint": "PNG는 투명을 유지하고, JPG는 흰 배경, WebP는 더 작습니다.",
    "qualityTitle": "화질",
    "sizesTitle": "내보내기 크기",
    "sizesHint": "여러 크기는 ZIP, 하나만 고르면 해당 파일로 받습니다.",
    "previewTitle": "실시간 미리보기",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgNoSize": "크기를 하나 이상 선택하세요.",
    "msgFail": "내보내지 못했습니다."
  },
  "fr": {
    "title_page": "Recadrer en icône",
    "desc": "Déposez une image, recadrez en carré, puis exportez PNG, JPG ou WebP aux tailles d’icône courantes. Plusieurs tailles = ZIP. Tout reste dans le navigateur.",
    "reselect": "Autre image",
    "download": "Télécharger la sélection",
    "downloadOne": "Cette taille",
    "sourceSize": "Source",
    "cropTip": "Glissez le cadre ; les coins redimensionnent. Ratio carré verrouillé.",
    "formatTitle": "Format d’export",
    "formatHint": "PNG garde la transparence ; JPG a un fond blanc ; WebP est plus léger.",
    "qualityTitle": "Qualité",
    "sizesTitle": "Tailles d’export",
    "sizesHint": "Plusieurs tailles vont dans un ZIP ; une seule se télécharge directement.",
    "previewTitle": "Aperçu en direct",
    "msgNotImage": "Choisissez un fichier image.",
    "msgNoSize": "Cochez au moins une taille.",
    "msgFail": "Échec de l’export."
  },
  "de": {
    "title_page": "Bild zur Ikone zuschneiden",
    "desc": "Bild ablegen, quadratisch zuschneiden, dann PNG, JPG oder WebP in gängigen Icon-Größen speichern. Mehrere Größen werden ein ZIP. Alles im Browser.",
    "reselect": "Anderes Bild",
    "download": "Auswahl herunterladen",
    "downloadOne": "Diese Größe",
    "sourceSize": "Quelle",
    "cropTip": "Rahmen ziehen zum Verschieben, Ecken zum Skalieren. Quadrat fest.",
    "formatTitle": "Exportformat",
    "formatHint": "PNG behält Transparenz; JPG hat weißen Hintergrund; WebP ist kleiner.",
    "qualityTitle": "Qualität",
    "sizesTitle": "Exportgrößen",
    "sizesHint": "Mehrere Größen als ZIP; eine Größe als einzelne Datei.",
    "previewTitle": "Live-Vorschau",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgNoSize": "Mindestens eine Größe wählen.",
    "msgFail": "Export fehlgeschlagen."
  },
  "es": {
    "title_page": "Recortar imagen a icono",
    "desc": "Suelta una imagen, recorta un cuadrado y exporta PNG, JPG o WebP en tamaños de icono. Varios tamaños van en un ZIP. Todo en el navegador.",
    "reselect": "Otra imagen",
    "download": "Descargar selección",
    "downloadOne": "Este tamaño",
    "sourceSize": "Origen",
    "cropTip": "Arrastra el recuadro; las esquinas cambian el tamaño. Proporción cuadrada.",
    "formatTitle": "Formato de exportación",
    "formatHint": "PNG conserva transparencia; JPG usa fondo blanco; WebP pesa menos.",
    "qualityTitle": "Calidad",
    "sizesTitle": "Tamaños de exportación",
    "sizesHint": "Varios tamaños se empaquetan en ZIP; uno solo se descarga directo.",
    "previewTitle": "Vista previa",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgNoSize": "Marca al menos un tamaño.",
    "msgFail": "Error al exportar."
  },
  "pt": {
    "title_page": "Recortar imagem para ícone",
    "desc": "Largue uma imagem, recorte um quadrado e exporte PNG, JPG ou WebP nos tamanhos de ícone. Vários tamanhos vão num ZIP. Tudo no navegador.",
    "reselect": "Outra imagem",
    "download": "Descarregar seleção",
    "downloadOne": "Este tamanho",
    "sourceSize": "Origem",
    "cropTip": "Arraste a caixa; os cantos redimensionam. Proporção quadrada.",
    "formatTitle": "Formato de exportação",
    "formatHint": "PNG mantém transparência; JPG usa fundo branco; WebP é mais leve.",
    "qualityTitle": "Qualidade",
    "sizesTitle": "Tamanhos de exportação",
    "sizesHint": "Vários tamanhos vão num ZIP; um só descarrega o ficheiro.",
    "previewTitle": "Pré-visualização",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgNoSize": "Selecione pelo menos um tamanho.",
    "msgFail": "Falha ao exportar."
  },
  "ru": {
    "title_page": "Обрезать картинку в иконку",
    "desc": "Перетащите изображение, обрежьте квадрат и сохраните PNG, JPG или WebP в типичных размерах иконки. Несколько размеров — ZIP. Всё в браузере.",
    "reselect": "Другое фото",
    "download": "Скачать выбранное",
    "downloadOne": "Этот размер",
    "sourceSize": "Исходник",
    "cropTip": "Перетаскивайте рамку, углы меняют размер. Квадрат зафиксирован.",
    "formatTitle": "Формат экспорта",
    "formatHint": "PNG сохраняет прозрачность; JPG с белым фоном; WebP легче.",
    "qualityTitle": "Качество",
    "sizesTitle": "Размеры экспорта",
    "sizesHint": "Несколько размеров упакуются в ZIP; один — отдельным файлом.",
    "previewTitle": "Предпросмотр",
    "msgNotImage": "Выберите файл изображения.",
    "msgNoSize": "Отметьте хотя бы один размер.",
    "msgFail": "Не удалось экспортировать."
  },
  "ar": {
    "title_page": "قص الصورة إلى أيقونة",
    "desc": "أسقط صورة، قص مربعاً، ثم صدّر PNG أو JPG أو WebP بأحجام الأيقونات الشائعة. عدة أحجام تصبح ZIP. كل شيء في المتصفح.",
    "reselect": "صورة أخرى",
    "download": "تنزيل المحدد",
    "downloadOne": "هذا الحجم",
    "sourceSize": "المصدر",
    "cropTip": "اسحب الإطار للتحريك، الزوايا لتغيير الحجم. النسبة مربعة.",
    "formatTitle": "صيغة التصدير",
    "formatHint": "PNG يحفظ الشفافية؛ JPG بخلفية بيضاء؛ WebP أصغر.",
    "qualityTitle": "الجودة",
    "sizesTitle": "أحجام التصدير",
    "sizesHint": "عدة أحجام تُحزم في ZIP؛ حجم واحد يُنزَّل مباشرة.",
    "previewTitle": "معاينة مباشرة",
    "msgNotImage": "اختر ملف صورة.",
    "msgNoSize": "حدد حجماً واحداً على الأقل.",
    "msgFail": "فشل التصدير."
  },
  "hi": {
    "title_page": "इमेज काटकर आइकन बनाएँ",
    "desc": "इमेज डालें, वर्ग काटें, फिर आम आइकन साइज़ में PNG, JPG या WebP निकालें। कई साइज़ ZIP बनते हैं। सब ब्राउज़र में रहता है।",
    "reselect": "दूसरी इमेज",
    "download": "चयन डाउनलोड",
    "downloadOne": "यह साइज़",
    "sourceSize": "स्रोत",
    "cropTip": "बॉक्स खींचें; कोनों से आकार बदलें। अनुपात वर्ग है।",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "formatHint": "PNG पारदर्शिता रखता है; JPG सफ़ेद बैकग्राउंड; WebP छोटा होता है।",
    "qualityTitle": "क्वालिटी",
    "sizesTitle": "एक्सपोर्ट साइज़",
    "sizesHint": "कई साइज़ ZIP में पैक होते हैं; एक साइज़ सीधे फ़ाइल डाउनलोड होता है।",
    "previewTitle": "लाइव पूर्वावलोकन",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgNoSize": "कम से कम एक साइज़ चुनें।",
    "msgFail": "एक्सपोर्ट असफल।"
  },
  "it": {
    "title_page": "Ritaglia immagine in icona",
    "desc": "Trascina un’immagine, ritaglia un quadrato ed esporta PNG, JPG o WebP nelle dimensioni icona. Più dimensioni diventano uno ZIP. Tutto nel browser.",
    "reselect": "Altra immagine",
    "download": "Scarica selezione",
    "downloadOne": "Questa dimensione",
    "sourceSize": "Sorgente",
    "cropTip": "Trascina il riquadro; gli angoli ridimensionano. Rapporto quadrato.",
    "formatTitle": "Formato di esportazione",
    "formatHint": "PNG mantiene la trasparenza; JPG ha sfondo bianco; WebP è più leggero.",
    "qualityTitle": "Qualità",
    "sizesTitle": "Dimensioni di esportazione",
    "sizesHint": "Più dimensioni vanno in uno ZIP; una sola si scarica come file.",
    "previewTitle": "Anteprima live",
    "msgNotImage": "Scegli un file immagine.",
    "msgNoSize": "Seleziona almeno una dimensione.",
    "msgFail": "Esportazione non riuscita."
  },
  "nl": {
    "title_page": "Afbeelding tot icoon bijsnijden",
    "desc": "Sleep een afbeelding, snijd een vierkant en exporteer PNG, JPG of WebP in gangbare icoongroottes. Meerdere maten worden een ZIP. Alles in de browser.",
    "reselect": "Andere afbeelding",
    "download": "Selectie downloaden",
    "downloadOne": "Dit formaat",
    "sourceSize": "Bron",
    "cropTip": "Sleep het kader; hoeken schalen. Vierkante verhouding.",
    "formatTitle": "Exportformaat",
    "formatHint": "PNG behoudt transparantie; JPG heeft witte achtergrond; WebP is kleiner.",
    "qualityTitle": "Kwaliteit",
    "sizesTitle": "Exportmaten",
    "sizesHint": "Meerdere maten als ZIP; één maat als los bestand.",
    "previewTitle": "Live voorbeeld",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgNoSize": "Kies minstens één formaat.",
    "msgFail": "Exporteren mislukt."
  },
  "tr": {
    "title_page": "Görüntüyü ikona kırp",
    "desc": "Görüntü bırakın, kare kırpın, ardından yaygın ikon boyutlarında PNG, JPG veya WebP alın. Birden fazla boyut ZIP olur. Hepsi tarayıcıda.",
    "reselect": "Başka görüntü",
    "download": "Seçilenleri indir",
    "downloadOne": "Bu boyut",
    "sourceSize": "Kaynak",
    "cropTip": "Kutuyu sürükleyin; köşeler boyutu değiştirir. Oran kare.",
    "formatTitle": "Dışa aktarma biçimi",
    "formatHint": "PNG şeffaflığı korur; JPG beyaz arka plan kullanır; WebP daha küçüktür.",
    "qualityTitle": "Kalite",
    "sizesTitle": "Dışa aktarma boyutları",
    "sizesHint": "Birden fazla boyut ZIP olur; tek boyut doğrudan dosya indirilir.",
    "previewTitle": "Canlı önizleme",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgNoSize": "En az bir boyut seçin.",
    "msgFail": "Dışa aktarma başarısız."
  },
  "vi": {
    "title_page": "Cắt ảnh thành biểu tượng",
    "desc": "Thả ảnh, cắt hình vuông, rồi xuất PNG, JPG hoặc WebP theo kích thước icon thông dụng. Nhiều kích thước thành ZIP. Tất cả trong trình duyệt.",
    "reselect": "Ảnh khác",
    "download": "Tải kích thước đã chọn",
    "downloadOne": "Kích thước này",
    "sourceSize": "Gốc",
    "cropTip": "Kéo khung để di chuyển, góc để đổi cỡ. Tỉ lệ vuông.",
    "formatTitle": "Định dạng xuất",
    "formatHint": "PNG giữ trong suốt; JPG nền trắng; WebP nhẹ hơn.",
    "qualityTitle": "Chất lượng",
    "sizesTitle": "Kích thước xuất",
    "sizesHint": "Nhiều kích thước đóng ZIP; một kích thước tải file trực tiếp.",
    "previewTitle": "Xem trước",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgNoSize": "Chọn ít nhất một kích thước.",
    "msgFail": "Xuất thất bại."
  },
  "th": {
    "title_page": "ครอปรูปเป็นไอคอน",
    "desc": "ลากรูปมา ครอปเป็นสี่เหลี่ยม แล้วส่งออก PNG JPG หรือ WebP ตามขนาดไอคอนที่ใช้บ่อย หลายขนาดจะเป็น ZIP ทำในเบราว์เซอร์",
    "reselect": "เลือกรูปใหม่",
    "download": "ดาวน์โหลดที่เลือก",
    "downloadOne": "ขนาดนี้",
    "sourceSize": "ต้นฉบับ",
    "cropTip": "ลากกรอบเพื่อย้าย มุมเพื่อย่อขยาย สัดส่วนสี่เหลี่ยมจัตุรัส",
    "formatTitle": "รูปแบบส่งออก",
    "formatHint": "PNG เก็บความโปร่งใส JPG พื้นขาว WebP ไฟล์เล็กกว่า",
    "qualityTitle": "คุณภาพ",
    "sizesTitle": "ขนาดส่งออก",
    "sizesHint": "หลายขนาดจะแพ็กเป็น ZIP เลือกอันเดียวจะดาวน์โหลดไฟล์นั้น",
    "previewTitle": "พรีวิวสด",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgNoSize": "เลือกอย่างน้อยหนึ่งขนาด",
    "msgFail": "ส่งออกไม่สำเร็จ"
  },
  "id": {
    "title_page": "Potong gambar jadi ikon",
    "desc": "Letakkan gambar, potong persegi, lalu ekspor PNG, JPG, atau WebP dalam ukuran ikon umum. Beberapa ukuran jadi ZIP. Semua di browser.",
    "reselect": "Gambar lain",
    "download": "Unduh yang dipilih",
    "downloadOne": "Ukuran ini",
    "sourceSize": "Sumber",
    "cropTip": "Seret kotak untuk geser; sudut mengubah ukuran. Rasio persegi.",
    "formatTitle": "Format ekspor",
    "formatHint": "PNG menjaga transparansi; JPG berlatar putih; WebP lebih kecil.",
    "qualityTitle": "Kualitas",
    "sizesTitle": "Ukuran ekspor",
    "sizesHint": "Beberapa ukuran dikemas ZIP; satu ukuran diunduh sebagai berkas.",
    "previewTitle": "Pratinjau langsung",
    "msgNotImage": "Pilih berkas gambar.",
    "msgNoSize": "Pilih setidaknya satu ukuran.",
    "msgFail": "Gagal mengekspor."
  },
  "ms": {
    "title_page": "Potong imej jadi ikon",
    "desc": "Letak imej, potong segi empat sama, kemudian eksport PNG, JPG atau WebP pada saiz ikon biasa. Beberapa saiz jadi ZIP. Semua dalam pelayar.",
    "reselect": "Imej lain",
    "download": "Muat turun pilihan",
    "downloadOne": "Saiz ini",
    "sourceSize": "Sumber",
    "cropTip": "Seret kotak untuk alih; sudut ubah saiz. Nisbah segi empat sama.",
    "formatTitle": "Format eksport",
    "formatHint": "PNG kekalkan ketelusan; JPG berlatar putih; WebP lebih kecil.",
    "qualityTitle": "Kualiti",
    "sizesTitle": "Saiz eksport",
    "sizesHint": "Beberapa saiz dibungkus ZIP; satu saiz dimuat turun sebagai fail.",
    "previewTitle": "Pratonton langsung",
    "msgNotImage": "Pilih fail imej.",
    "msgNoSize": "Pilih sekurang-kurangnya satu saiz.",
    "msgFail": "Eksport gagal."
  },
  "pl": {
    "title_page": "Przytnij obraz do ikony",
    "desc": "Upuść obraz, wytnij kwadrat i eksportuj PNG, JPG lub WebP w typowych rozmiarach ikon. Wiele rozmiarów to ZIP. Wszystko w przeglądarce.",
    "reselect": "Inny obraz",
    "download": "Pobierz zaznaczone",
    "downloadOne": "Ten rozmiar",
    "sourceSize": "Źródło",
    "cropTip": "Przeciągaj ramkę; rogi zmieniają rozmiar. Proporcja kwadratu.",
    "formatTitle": "Format eksportu",
    "formatHint": "PNG zachowuje przezroczystość; JPG ma białe tło; WebP jest lżejszy.",
    "qualityTitle": "Jakość",
    "sizesTitle": "Rozmiary eksportu",
    "sizesHint": "Wiele rozmiarów trafia do ZIP; jeden rozmiar pobiera się jako plik.",
    "previewTitle": "Podgląd na żywo",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgNoSize": "Zaznacz przynajmniej jeden rozmiar.",
    "msgFail": "Eksport nie powiódł się."
  },
  "uk": {
    "title_page": "Обрізати зображення в іконку",
    "desc": "Перетягніть зображення, обріжте квадрат і експортуйте PNG, JPG або WebP у типових розмірах іконки. Кілька розмірів — ZIP. Усе в браузері.",
    "reselect": "Інше фото",
    "download": "Завантажити вибране",
    "downloadOne": "Цей розмір",
    "sourceSize": "Джерело",
    "cropTip": "Перетягуйте рамку, кути змінюють розмір. Квадрат зафіксовано.",
    "formatTitle": "Формат експорту",
    "formatHint": "PNG зберігає прозорість; JPG з білим тлом; WebP легший.",
    "qualityTitle": "Якість",
    "sizesTitle": "Розміри експорту",
    "sizesHint": "Кілька розмірів пакуються в ZIP; один — окремим файлом.",
    "previewTitle": "Перегляд",
    "msgNotImage": "Виберіть файл зображення.",
    "msgNoSize": "Позначте хоча б один розмір.",
    "msgFail": "Не вдалося експортувати."
  },
  "sv": {
    "title_page": "Beskär bild till ikon",
    "desc": "Släpp en bild, beskär en kvadrat och exportera PNG, JPG eller WebP i vanliga ikonstorlekar. Flera storlekar blir en ZIP. Allt i webbläsaren.",
    "reselect": "Annan bild",
    "download": "Ladda ner valda",
    "downloadOne": "Denna storlek",
    "sourceSize": "Källa",
    "cropTip": "Dra rutan; hörnen ändrar storlek. Kvadratisk proportion.",
    "formatTitle": "Exportformat",
    "formatHint": "PNG behåller transparens; JPG har vit bakgrund; WebP är mindre.",
    "qualityTitle": "Kvalitet",
    "sizesTitle": "Exportstorlekar",
    "sizesHint": "Flera storlekar paketeras som ZIP; en storlek laddas ner som fil.",
    "previewTitle": "Liveförhandsvisning",
    "msgNotImage": "Välj en bildfil.",
    "msgNoSize": "Välj minst en storlek.",
    "msgFail": "Exporten misslyckades."
  },
  "zh-TW": {
    "title_page": "圖片裁切圖示",
    "desc": "拖入圖片，裁切為正方形後依常用圖示尺寸匯出 PNG、JPG 或 WebP。勾選多個尺寸會打成 ZIP。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "download": "下載所選尺寸",
    "downloadOne": "下載此尺寸",
    "sourceSize": "原圖",
    "cropTip": "拖動選框移動，四角可縮放。滾輪縮放背景；按住中鍵或空白鍵拖動背景。比例鎖定為正方形。",
    "formatTitle": "匯出格式",
    "formatHint": "PNG 保留透明；JPG 會鋪白底；WebP 體積更小。",
    "qualityTitle": "畫質",
    "sizesTitle": "匯出尺寸",
    "sizesHint": "勾選多個尺寸時打包成 ZIP；只勾一個則直接下載該檔案。",
    "previewTitle": "即時預覽",
    "msgNotImage": "請選擇圖片檔。",
    "msgNoSize": "請至少勾選一個尺寸。",
    "msgFail": "匯出失敗。"
  }
}
</i18n>
