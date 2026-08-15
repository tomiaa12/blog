<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import ImageCropper from "@/components/ImageCropper.vue"
import type { CropRect } from "@/components/ImageCropper.vue"
import JSZip from "jszip"
import { encodeIcoFromCanvases } from "@/utils"

const { t } = useI18n()

const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256] as const

const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)
const objectUrl = ref("")
const fileName = ref("icon")
const selected = ref<number[]>([16, 32, 48, 256])
const previews = ref<Record<number, string>>({})
const naturalSize = ref("")
const cropTick = ref(0)

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

async function refreshPreviews() {
  const cropper = cropperRef.value
  if (!cropper || !objectUrl.value) return
  const source = cropper.getCroppedCanvas()
  if (!source) return
  const next: Record<number, string> = {}
  for (const size of ICO_SIZES) {
    const c = document.createElement("canvas")
    c.width = size
    c.height = size
    const ctx = c.getContext("2d")
    if (!ctx) continue
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(source, 0, 0, size, size)
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

async function icoForSizes(sizes: number[]) {
  const source = getSourceCanvas()
  if (!source) return null
  const items: { size: number; canvas: HTMLCanvasElement }[] = []
  for (const size of sizes) {
    const c = scaleCanvas(source, size)
    if (c) items.push({ size, canvas: c })
  }
  if (!items.length) return null
  return encodeIcoFromCanvases(items)
}

async function downloadIco() {
  const sizes = [...selected.value].sort((a, b) => a - b)
  if (!sizes.length) {
    ElMessage({ message: t("msgNoSize"), type: "warning" })
    return
  }
  const ico = await icoForSizes(sizes)
  if (!ico) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(ico, `${fileName.value}.ico`)
}

async function downloadOne(size: number) {
  const ico = await icoForSizes([size])
  if (!ico) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(ico, `${fileName.value}-${size}.ico`)
}

async function downloadEach() {
  const sizes = [...selected.value].sort((a, b) => a - b)
  if (!sizes.length) {
    ElMessage({ message: t("msgNoSize"), type: "warning" })
    return
  }
  const zip = new JSZip()
  const combined = await icoForSizes(sizes)
  if (combined) zip.file(`${fileName.value}.ico`, combined)
  for (const size of sizes) {
    const one = await icoForSizes([size])
    if (one) zip.file(`${fileName.value}-${size}.ico`, one)
  }
  const blob = await zip.generateAsync({ type: "blob" })
  saveBlob(blob, `${fileName.value}-ico.zip`)
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
  <div class="ico-page">
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
          @click="downloadIco"
        >
          {{ t("download") }}
        </el-button>
        <el-button @click="downloadEach">{{ t("downloadZip") }}</el-button>
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
          <h2 class="sub">{{ t("sizesTitle") }}</h2>
          <el-checkbox-group v-model="selected">
            <el-checkbox
              v-for="s in ICO_SIZES"
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
              v-for="s in ICO_SIZES"
              :key="s"
              class="preview"
              :class="{ off: !selected.includes(s) }"
            >
              <div
                class="preview-frame"
                :style="{ width: `${Math.max(s, 32)}px`, height: `${Math.max(s, 32)}px` }"
              >
                <img
                  v-if="previews[s]"
                  :src="previews[s]"
                  :width="s"
                  :height="s"
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
.ico-page {
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
  margin: 0 0 10px;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-bottom: 8px;
}

.sizes-hint {
  margin: 0 0 16px;
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
    "title_page": "图片转 ICO",
    "desc": "拖入或选择图片，裁切为正方形后实时预览各尺寸。勾选的尺寸会写进同一个 ICO 文件（系统按场景选用 16/32/256 等）。也可单独下载每种尺寸，或打成 ZIP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载合并 ICO",
    "downloadZip": "各尺寸分别打包 ZIP",
    "downloadOne": "下载此尺寸",
    "sourceSize": "原图",
    "cropTip": "拖动选框移动，四角可缩放。滚轮缩放背景；按住中键或空格拖动背景。比例锁定为正方形。",
    "sizesTitle": "写入 ICO 的尺寸",
    "sizesHint": "「下载合并 ICO」只下一个文件，里面包含所有勾选尺寸。资源管理器预览通常只显示其中一张，这是正常的。每种尺寸要单独文件时，点预览下的「下载此尺寸」，或用 ZIP。",
    "previewTitle": "实时预览",
    "msgNotImage": "请选择图片文件。",
    "msgNoSize": "请至少勾选一个尺寸。",
    "msgFail": "生成 ICO 失败。"
  },
  "zh-CN": {
    "title_page": "图片转 ICO",
    "desc": "拖入或选择图片，裁切为正方形后实时预览各尺寸。勾选的尺寸会写进同一个 ICO 文件（系统按场景选用 16/32/256 等）。也可单独下载每种尺寸，或打成 ZIP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载合并 ICO",
    "downloadZip": "各尺寸分别打包 ZIP",
    "downloadOne": "下载此尺寸",
    "sourceSize": "原图",
    "cropTip": "拖动选框移动，四角可缩放。滚轮缩放背景；按住中键或空格拖动背景。比例锁定为正方形。",
    "sizesTitle": "写入 ICO 的尺寸",
    "sizesHint": "「下载合并 ICO」只下一个文件，里面包含所有勾选尺寸。资源管理器预览通常只显示其中一张，这是正常的。每种尺寸要单独文件时，点预览下的「下载此尺寸」，或用 ZIP。",
    "previewTitle": "实时预览",
    "msgNotImage": "请选择图片文件。",
    "msgNoSize": "请至少勾选一个尺寸。",
    "msgFail": "生成 ICO 失败。"
  },
  "en": {
    "title_page": "Image to ICO",
    "desc": "Drop an image, crop a square, and preview sizes. Selected sizes go into one ICO file; you can also download each size or a ZIP. Everything stays in your browser.",
    "reselect": "Choose another",
    "download": "Download combined ICO",
    "downloadZip": "ZIP each size",
    "downloadOne": "Download this size",
    "sourceSize": "Source",
    "cropTip": "Drag the box to move; corners resize. Scroll to zoom; hold middle mouse or Space to pan. Aspect is locked to square.",
    "sizesTitle": "Sizes in the ICO",
    "sizesHint": "Combined ICO is a single file that embeds every checked size. Explorer often previews only one image — that is expected. Use “Download this size” or ZIP for separate files.",
    "previewTitle": "Live preview",
    "msgNotImage": "Please choose an image file.",
    "msgNoSize": "Select at least one size.",
    "msgFail": "Could not build the ICO."
  },
  "ja": {
    "title_page": "画像を ICO に",
    "desc": "画像をドロップして正方形に切り抜き、各サイズをプレビューして ICO を保存します。処理はブラウザ内です。",
    "reselect": "別の画像",
    "download": "結合 ICO を保存",
    "downloadZip": "各サイズを ZIP",
    "downloadOne": "このサイズを保存",
    "sourceSize": "元画像",
    "cropTip": "枠をドラッグして移動、四隅で拡大縮小。正方形固定です。",
    "sizesTitle": "ICO に含めるサイズ",
    "sizesHint": "結合 ICO は1つのファイルに全サイズを含めます。エクスプローラーは1枚だけ表示することが多く、正常です。個別ファイルは「このサイズを保存」か ZIP を使ってください。",
    "previewTitle": "リアルタイムプレビュー",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgNoSize": "サイズを1つ以上選んでください。",
    "msgFail": "ICO を作成できませんでした。"
  },
  "ko": {
    "title_page": "이미지를 ICO로",
    "desc": "이미지를 넣고 정사각형으로 자른 뒤 크기를 미리 보고 ICO로 받습니다. 모두 브라우저에서 처리됩니다.",
    "reselect": "다른 이미지",
    "download": "합친 ICO 다운로드",
    "downloadZip": "크기별 ZIP",
    "downloadOne": "이 크기 받기",
    "sourceSize": "원본",
    "cropTip": "상자를 끌어 이동하고 모서리로 크기 조절. 정사각형으로 고정됩니다.",
    "sizesTitle": "ICO에 넣을 크기",
    "sizesHint": "합친 ICO는 선택한 크기를 한 파일에 넣습니다. 탐색기는 보통 한 장만 미리 봅니다. 각 크기를 따로 받으려면 미리보기 아래 버튼이나 ZIP을 쓰세요.",
    "previewTitle": "실시간 미리보기",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgNoSize": "크기를 하나 이상 선택하세요.",
    "msgFail": "ICO를 만들지 못했습니다."
  },
  "fr": {
    "title_page": "Image vers ICO",
    "desc": "Déposez une image, recadrez en carré, prévisualisez les tailles, puis téléchargez un ICO multi-tailles. Tout reste dans le navigateur.",
    "reselect": "Autre image",
    "download": "Télécharger l’ICO combiné",
    "downloadZip": "ZIP par taille",
    "downloadOne": "Cette taille",
    "sourceSize": "Source",
    "cropTip": "Glissez le cadre ; les coins redimensionnent. Ratio carré verrouillé.",
    "sizesTitle": "Tailles dans l’ICO",
    "sizesHint": "L’ICO combiné est un seul fichier contenant toutes les tailles cochées. L’Explorateur n’affiche souvent qu’une image, c’est normal. Utilisez « Cette taille » ou le ZIP pour des fichiers séparés.",
    "previewTitle": "Aperçu en direct",
    "msgNotImage": "Choisissez un fichier image.",
    "msgNoSize": "Cochez au moins une taille.",
    "msgFail": "Impossible de créer l’ICO."
  },
  "de": {
    "title_page": "Bild zu ICO",
    "desc": "Bild ablegen, quadratisch zuschneiden, Größen live sehen, dann ein Multi-Size-ICO speichern. Alles im Browser.",
    "reselect": "Anderes Bild",
    "download": "Kombiniertes ICO",
    "downloadZip": "Größen als ZIP",
    "downloadOne": "Diese Größe",
    "sourceSize": "Quelle",
    "cropTip": "Rahmen ziehen zum Verschieben, Ecken zum Skalieren. Quadrat fest.",
    "sizesTitle": "Größen in der ICO",
    "sizesHint": "Das kombinierte ICO ist eine Datei mit allen gewählten Größen. Der Explorer zeigt oft nur ein Vorschaubild — das ist normal. Einzeldateien über « Diese Größe » oder ZIP.",
    "previewTitle": "Live-Vorschau",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgNoSize": "Mindestens eine Größe wählen.",
    "msgFail": "ICO konnte nicht erzeugt werden."
  },
  "es": {
    "title_page": "Imagen a ICO",
    "desc": "Suelta una imagen, recorta un cuadrado, previsualiza tamaños y descarga un ICO. Todo en el navegador.",
    "reselect": "Otra imagen",
    "download": "Descargar ICO combinado",
    "downloadZip": "ZIP por tamaño",
    "downloadOne": "Este tamaño",
    "sourceSize": "Origen",
    "cropTip": "Arrastra el recuadro; las esquinas cambian el tamaño. Proporción cuadrada.",
    "sizesTitle": "Tamaños en el ICO",
    "sizesHint": "El ICO combinado es un solo archivo con todos los tamaños marcados. El Explorador suele mostrar solo una imagen; es normal. Usa « Este tamaño » o el ZIP para archivos sueltos.",
    "previewTitle": "Vista previa",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgNoSize": "Marca al menos un tamaño.",
    "msgFail": "No se pudo crear el ICO."
  },
  "pt": {
    "title_page": "Imagem para ICO",
    "desc": "Largue uma imagem, recorte um quadrado, veja os tamanhos e descarregue um ICO. Tudo no navegador.",
    "reselect": "Outra imagem",
    "download": "Descarregar ICO combinado",
    "downloadZip": "ZIP por tamanho",
    "downloadOne": "Este tamanho",
    "sourceSize": "Origem",
    "cropTip": "Arraste a caixa; os cantos redimensionam. Proporção quadrada.",
    "sizesTitle": "Tamanhos no ICO",
    "sizesHint": "O ICO combinado é um único ficheiro com todos os tamanhos. O Explorador costuma mostrar só uma imagem — é normal. Use « Este tamanho » ou o ZIP para ficheiros separados.",
    "previewTitle": "Pré-visualização",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgNoSize": "Selecione pelo menos um tamanho.",
    "msgFail": "Não foi possível criar o ICO."
  },
  "ru": {
    "title_page": "Картинка в ICO",
    "desc": "Перетащите изображение, обрежьте квадрат, смотрите размеры и скачайте ICO. Всё в браузере.",
    "reselect": "Другое фото",
    "download": "Скачать общий ICO",
    "downloadZip": "ZIP по размерам",
    "downloadOne": "Этот размер",
    "sourceSize": "Исходник",
    "cropTip": "Перетаскивайте рамку, углы меняют размер. Квадрат зафиксирован.",
    "sizesTitle": "Размеры в ICO",
    "sizesHint": "Общий ICO — один файл со всеми выбранными размерами. Проводник часто показывает одну картинку — так и должно быть. Отдельные файлы: «Этот размер» или ZIP.",
    "previewTitle": "Предпросмотр",
    "msgNotImage": "Выберите файл изображения.",
    "msgNoSize": "Отметьте хотя бы один размер.",
    "msgFail": "Не удалось создать ICO."
  },
  "ar": {
    "title_page": "صورة إلى ICO",
    "desc": "أسقط صورة، قص مربعاً، عاين الأحجام، ثم نزّل ICO. كل شيء في المتصفح.",
    "reselect": "صورة أخرى",
    "download": "تنزيل ICO المدمج",
    "downloadZip": "ZIP لكل حجم",
    "downloadOne": "هذا الحجم",
    "sourceSize": "المصدر",
    "cropTip": "اسحب الإطار للتحريك، الزوايا لتغيير الحجم. النسبة مربعة.",
    "sizesTitle": "الأحجام في ICO",
    "sizesHint": "ملف ICO المدمج واحد ويضم كل الأحجام المحددة. المستكشف غالباً يعرض صورة واحدة وهذا طبيعي. للتنزيل المنفصل استخدم «هذا الحجم» أو ZIP.",
    "previewTitle": "معاينة مباشرة",
    "msgNotImage": "اختر ملف صورة.",
    "msgNoSize": "حدد حجماً واحداً على الأقل.",
    "msgFail": "تعذر إنشاء ICO."
  },
  "hi": {
    "title_page": "इमेज से ICO",
    "desc": "इमेज डालें, वर्ग काटें, साइज़ देखें और ICO डाउनलोड करें। सब ब्राउज़र में रहता है।",
    "reselect": "दूसरी इमेज",
    "download": "संयुक्त ICO डाउनलोड",
    "downloadZip": "साइज़ ZIP",
    "downloadOne": "यह साइज़",
    "sourceSize": "स्रोत",
    "cropTip": "बॉक्स खींचें; कोनों से आकार बदलें। अनुपात वर्ग है।",
    "sizesTitle": "ICO में साइज़",
    "sizesHint": "संयुक्त ICO एक फ़ाइल में चुने गए सभी साइज़ रखता है। एक्सप्लोरर अक्सर एक ही चित्र दिखाता है — यह सामान्य है। अलग फ़ाइलों के लिए «यह साइज़» या ZIP इस्तेमाल करें।",
    "previewTitle": "लाइव पूर्वावलोकन",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgNoSize": "कम से कम एक साइज़ चुनें।",
    "msgFail": "ICO नहीं बन सका।"
  },
  "it": {
    "title_page": "Immagine in ICO",
    "desc": "Trascina un’immagine, ritaglia un quadrato, anteprima delle dimensioni e scarica un ICO. Tutto nel browser.",
    "reselect": "Altra immagine",
    "download": "Scarica ICO combinato",
    "downloadZip": "ZIP per dimensione",
    "downloadOne": "Questa dimensione",
    "sourceSize": "Sorgente",
    "cropTip": "Trascina il riquadro; gli angoli ridimensionano. Rapporto quadrato.",
    "sizesTitle": "Dimensioni nell’ICO",
    "sizesHint": "L’ICO combinato è un solo file con tutte le dimensioni selezionate. Esplora risorse spesso mostra una sola anteprima: è normale. Usa « Questa dimensione » o lo ZIP per file separati.",
    "previewTitle": "Anteprima live",
    "msgNotImage": "Scegli un file immagine.",
    "msgNoSize": "Seleziona almeno una dimensione.",
    "msgFail": "Impossibile creare l’ICO."
  },
  "nl": {
    "title_page": "Afbeelding naar ICO",
    "desc": "Sleep een afbeelding, snijd een vierkant, bekijk formaten en download een ICO. Alles in de browser.",
    "reselect": "Andere afbeelding",
    "download": "Gecombineerde ICO",
    "downloadZip": "ZIP per formaat",
    "downloadOne": "Dit formaat",
    "sourceSize": "Bron",
    "cropTip": "Sleep het kader; hoeken schalen. Vierkante verhouding.",
    "sizesTitle": "Maten in de ICO",
    "sizesHint": "De gecombineerde ICO is één bestand met alle aangevinkte formaten. Verkenner toont vaak maar één voorbeeld — dat hoort zo. Gebruik « Dit formaat » of ZIP voor losse bestanden.",
    "previewTitle": "Live voorbeeld",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgNoSize": "Kies minstens één formaat.",
    "msgFail": "ICO maken mislukt."
  },
  "tr": {
    "title_page": "Görüntüden ICO",
    "desc": "Görüntü bırakın, kare kırpın, boyutları görün ve ICO indirin. Hepsi tarayıcıda.",
    "reselect": "Başka görüntü",
    "download": "Birleşik ICO indir",
    "downloadZip": "Boyutları ZIP’le",
    "downloadOne": "Bu boyut",
    "sourceSize": "Kaynak",
    "cropTip": "Kutuyu sürükleyin; köşeler boyutu değiştirir. Oran kare.",
    "sizesTitle": "ICO’daki boyutlar",
    "sizesHint": "Birleşik ICO, seçilen tüm boyutları tek dosyada tutar. Gezgin genelde tek önizleme gösterir; bu normaldir. Ayrı dosyalar için « Bu boyut » veya ZIP kullanın.",
    "previewTitle": "Canlı önizleme",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgNoSize": "En az bir boyut seçin.",
    "msgFail": "ICO oluşturulamadı."
  },
  "vi": {
    "title_page": "Ảnh sang ICO",
    "desc": "Thả ảnh, cắt hình vuông, xem trước các kích thước rồi tải ICO. Tất cả trong trình duyệt.",
    "reselect": "Ảnh khác",
    "download": "Tải ICO gộp",
    "downloadZip": "ZIP từng kích thước",
    "downloadOne": "Kích thước này",
    "sourceSize": "Gốc",
    "cropTip": "Kéo khung để di chuyển, góc để đổi cỡ. Tỉ lệ vuông.",
    "sizesTitle": "Kích thước trong ICO",
    "sizesHint": "ICO gộp là một tệp chứa mọi kích thước đã chọn. Explorer thường chỉ hiện một ảnh — đó là bình thường. Dùng « Kích thước này » hoặc ZIP để tải riêng.",
    "previewTitle": "Xem trước",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgNoSize": "Chọn ít nhất một kích thước.",
    "msgFail": "Không tạo được ICO."
  },
  "th": {
    "title_page": "รูปเป็น ICO",
    "desc": "ลากรูปมา ครอปเป็นสี่เหลี่ยม ดูขนาดแล้วดาวน์โหลด ICO ทำในเบราว์เซอร์",
    "reselect": "เลือกรูปใหม่",
    "download": "ดาวน์โหลด ICO รวม",
    "downloadZip": "ZIP ตามขนาด",
    "downloadOne": "ขนาดนี้",
    "sourceSize": "ต้นฉบับ",
    "cropTip": "ลากกรอบเพื่อย้าย มุมเพื่อย่อขยาย สัดส่วนสี่เหลี่ยมจัตุรัส",
    "sizesTitle": "ขนาดใน ICO",
    "sizesHint": "ICO รวมเป็นไฟล์เดียวที่ใส่ทุกขนาดที่เลือก ตัวสำรวจมักแสดงแค่รูปเดียว ซึ่งเป็นเรื่องปกติ ใช้ «ขนาดนี้» หรือ ZIP หากต้องการไฟล์แยก",
    "previewTitle": "พรีวิวสด",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgNoSize": "เลือกอย่างน้อยหนึ่งขนาด",
    "msgFail": "สร้าง ICO ไม่สำเร็จ"
  },
  "id": {
    "title_page": "Gambar ke ICO",
    "desc": "Letakkan gambar, potong persegi, pratinjau ukuran, lalu unduh ICO. Semua di browser.",
    "reselect": "Gambar lain",
    "download": "Unduh ICO gabungan",
    "downloadZip": "ZIP per ukuran",
    "downloadOne": "Ukuran ini",
    "sourceSize": "Sumber",
    "cropTip": "Seret kotak untuk geser; sudut mengubah ukuran. Rasio persegi.",
    "sizesTitle": "Ukuran dalam ICO",
    "sizesHint": "ICO gabungan adalah satu berkas berisi semua ukuran terpilih. Explorer sering menampilkan satu gambar saja — itu wajar. Gunakan « Ukuran ini » atau ZIP untuk berkas terpisah.",
    "previewTitle": "Pratinjau langsung",
    "msgNotImage": "Pilih berkas gambar.",
    "msgNoSize": "Pilih setidaknya satu ukuran.",
    "msgFail": "Gagal membuat ICO."
  },
  "ms": {
    "title_page": "Imej ke ICO",
    "desc": "Letak imej, potong segi empat sama, pratonton saiz, kemudian muat turun ICO. Semua dalam pelayar.",
    "reselect": "Imej lain",
    "download": "Muat turun ICO gabungan",
    "downloadZip": "ZIP mengikut saiz",
    "downloadOne": "Saiz ini",
    "sourceSize": "Sumber",
    "cropTip": "Seret kotak untuk alih; sudut ubah saiz. Nisbah segi empat sama.",
    "sizesTitle": "Saiz dalam ICO",
    "sizesHint": "ICO gabungan ialah satu fail yang mengandungi semua saiz dipilih. Explorer sering memaparkan satu imej sahaja — itu biasa. Guna « Saiz ini » atau ZIP untuk fail berasingan.",
    "previewTitle": "Pratonton langsung",
    "msgNotImage": "Pilih fail imej.",
    "msgNoSize": "Pilih sekurang-kurangnya satu saiz.",
    "msgFail": "Gagal mencipta ICO."
  },
  "pl": {
    "title_page": "Obraz do ICO",
    "desc": "Upuść obraz, wytnij kwadrat, podglądaj rozmiary i pobierz ICO. Wszystko w przeglądarce.",
    "reselect": "Inny obraz",
    "download": "Pobierz ICO zbiorcze",
    "downloadZip": "ZIP wg rozmiarów",
    "downloadOne": "Ten rozmiar",
    "sourceSize": "Źródło",
    "cropTip": "Przeciągaj ramkę; rogi zmieniają rozmiar. Proporcja kwadratu.",
    "sizesTitle": "Rozmiary w ICO",
    "sizesHint": "ICO zbiorcze to jeden plik ze wszystkimi zaznaczonymi rozmiarami. Eksplorator często pokazuje jedną miniaturę — to normalne. Osobne pliki: « Ten rozmiar » lub ZIP.",
    "previewTitle": "Podgląd na żywo",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgNoSize": "Zaznacz przynajmniej jeden rozmiar.",
    "msgFail": "Nie udało się utworzyć ICO."
  },
  "uk": {
    "title_page": "Зображення в ICO",
    "desc": "Перетягніть зображення, обріжте квадрат, перегляньте розміри й завантажте ICO. Усе в браузері.",
    "reselect": "Інше фото",
    "download": "Завантажити спільний ICO",
    "downloadZip": "ZIP за розмірами",
    "downloadOne": "Цей розмір",
    "sourceSize": "Джерело",
    "cropTip": "Перетягуйте рамку, кути змінюють розмір. Квадрат зафіксовано.",
    "sizesTitle": "Розміри в ICO",
    "sizesHint": "Спільний ICO — один файл з усіма вибраними розмірами. Провідник часто показує одну картинку — так і має бути. Окремі файли: «Цей розмір» або ZIP.",
    "previewTitle": "Перегляд",
    "msgNotImage": "Виберіть файл зображення.",
    "msgNoSize": "Позначте хоча б один розмір.",
    "msgFail": "Не вдалося створити ICO."
  },
  "sv": {
    "title_page": "Bild till ICO",
    "desc": "Släpp en bild, beskär en kvadrat, förhandsgranska storlekar och ladda ner en ICO. Allt i webbläsaren.",
    "reselect": "Annan bild",
    "download": "Ladda ner kombinerad ICO",
    "downloadZip": "ZIP per storlek",
    "downloadOne": "Denna storlek",
    "sourceSize": "Källa",
    "cropTip": "Dra rutan; hörnen ändrar storlek. Kvadratisk proportion.",
    "sizesTitle": "Storlekar i ICO",
    "sizesHint": "Den kombinerade ICO-filen innehåller alla valda storlekar. Utforskaren visar ofta bara en bild — det är normalt. Använd « Denna storlek » eller ZIP för separata filer.",
    "previewTitle": "Liveförhandsvisning",
    "msgNotImage": "Välj en bildfil.",
    "msgNoSize": "Välj minst en storlek.",
    "msgFail": "Kunde inte skapa ICO."
  },
  "zh-TW": {
    "title_page": "圖片轉 ICO",
    "desc": "拖入或選擇圖片，裁切為正方形後即時預覽各尺寸。勾選的尺寸會寫進同一個 ICO 檔（系統依場景選用 16/32/256 等）。也可單獨下載每種尺寸，或打成 ZIP。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "download": "下載合併 ICO",
    "downloadZip": "各尺寸分別打包 ZIP",
    "downloadOne": "下載此尺寸",
    "sourceSize": "原圖",
    "cropTip": "拖動選框移動，四角可縮放。滾輪縮放背景；按住中鍵或空白鍵拖動背景。比例鎖定為正方形。",
    "sizesTitle": "寫入 ICO 的尺寸",
    "sizesHint": "「下載合併 ICO」只下一個檔案，裡面包含所有勾選尺寸。檔案總管預覽通常只顯示其中一張，這是正常的。每種尺寸要單獨檔案時，點預覽下的「下載此尺寸」，或用 ZIP。",
    "previewTitle": "即時預覽",
    "msgNotImage": "請選擇圖片檔。",
    "msgNoSize": "請至少勾選一個尺寸。",
    "msgFail": "產生 ICO 失敗。"
  }
}
</i18n>
