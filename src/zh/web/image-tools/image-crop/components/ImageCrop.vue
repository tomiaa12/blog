<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import ImageCropper from "@/components/ImageCropper.vue"
import type { CropRect } from "@/components/ImageCropper.vue"

const { t } = useI18n()

type RatioKey = "free" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "3:2" | "2:3" | "orig"
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

const RATIOS: RatioKey[] = ["free", "1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "orig"]

const objectUrl = ref("")
const fileName = ref("image")
const srcW = ref(0)
const srcH = ref(0)
const crop = ref<CropRect>({ x: 0, y: 0, width: 0, height: 0 })
const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)
const ratioKey = ref<RatioKey>("free")
const format = ref<ExportFmt>("png")
const quality = ref(0.92)
const needQuality = computed(() => format.value !== "png")

const aspect = computed<number | null>(() => {
  if (ratioKey.value === "free") return null
  if (ratioKey.value === "orig") return srcW.value && srcH.value ? srcW.value / srcH.value : 1
  const [w, h] = ratioKey.value.split(":").map(Number)
  return w && h ? w / h : 1
})

const cropLabel = computed(() => {
  const w = Math.round(crop.value.width)
  const h = Math.round(crop.value.height)
  if (!w || !h) return ""
  return `${w} × ${h}`
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
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name.replace(/\.[^.]+$/, "") || "image"
}

function onImgLoad(size: { width: number; height: number }) {
  srcW.value = size.width
  srcH.value = size.height
}

function onCropChange(rect: CropRect) {
  crop.value = rect
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

async function download() {
  const canvas = cropperRef.value?.getCroppedCanvas()
  if (!canvas) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  const blob = await canvasToBlob(canvas)
  if (!blob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(blob, `${fileName.value}-${canvas.width}x${canvas.height}.${EXT[format.value]}`)
}

function reset() {
  revoke(objectUrl.value)
  objectUrl.value = ""
  srcW.value = 0
  srcH.value = 0
  crop.value = { x: 0, y: 0, width: 0, height: 0 }
}

onUnmounted(reset)
</script>

<template>
  <div class="crop-page">
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
        >
          {{ t("sourceSize") }} {{ srcW }} × {{ srcH }}
          <template v-if="cropLabel"> · {{ t("cropSize") }} {{ cropLabel }}</template>
        </span>
      </div>

      <div class="work">
        <div class="stage-wrap">
          <div class="crop-host">
            <ImageCropper
              :key="`${objectUrl}-${ratioKey}`"
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
          <h2 class="sub">{{ t("ratioTitle") }}</h2>
          <div class="chips">
            <el-button
              v-for="r in RATIOS"
              :key="r"
              size="small"
              :type="ratioKey === r ? 'primary' : 'default'"
              @click="ratioKey = r"
            >
              {{ r === "free" || r === "orig" ? t(`ratio_${r}`) : r }}
            </el-button>
          </div>
          <p class="hint">{{ t("ratioHint") }}</p>

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
.crop-page {
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

.hint {
  margin: 0 0 8px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.fmt-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片裁剪",
    "desc": "自由框选或锁定 1:1、4:3、16:9 等比例裁切图片，按选区原图像素导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载裁剪结果",
    "sourceSize": "原图",
    "cropSize": "选区",
    "ratioTitle": "裁切比例",
    "ratio_free": "自由",
    "ratio_orig": "原图比例",
    "ratioHint": "自由模式可任意拉选区；锁定比例后四角按该比例缩放。",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "cropTip": "拖动选框移动，四角缩放。滚轮缩放背景；按住中键或空格拖动背景。",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。"
  },
  "zh-CN": {
    "title_page": "图片裁剪",
    "desc": "自由框选或锁定 1:1、4:3、16:9 等比例裁切图片，按选区原图像素导出 PNG / JPG / WebP。处理都在浏览器本地完成。",
    "reselect": "换一张",
    "download": "下载裁剪结果",
    "sourceSize": "原图",
    "cropSize": "选区",
    "ratioTitle": "裁切比例",
    "ratio_free": "自由",
    "ratio_orig": "原图比例",
    "ratioHint": "自由模式可任意拉选区；锁定比例后四角按该比例缩放。",
    "formatTitle": "导出格式",
    "qualityTitle": "画质",
    "cropTip": "拖动选框移动，四角缩放。滚轮缩放背景；按住中键或空格拖动背景。",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "处理失败。"
  },
  "en": {
    "title_page": "Crop image",
    "desc": "Freeform or locked-ratio crop (1:1, 4:3, 16:9…). Export the selection as PNG, JPG, or WebP. Everything stays in your browser.",
    "reselect": "Choose another",
    "download": "Download crop",
    "sourceSize": "Source",
    "cropSize": "Selection",
    "ratioTitle": "Aspect ratio",
    "ratio_free": "Free",
    "ratio_orig": "Original",
    "ratioHint": "Free mode lets you drag any rectangle; locked ratios keep the shape.",
    "formatTitle": "Export format",
    "qualityTitle": "Quality",
    "cropTip": "Drag the box; corners resize. Scroll to zoom; hold middle mouse or Space to pan.",
    "msgNotImage": "Please choose an image file.",
    "msgFail": "Could not process the image."
  },
  "ja": {
    "title_page": "画像の切り抜き",
    "desc": "自由または 1:1、4:3、16:9 などで切り抜き、選択範囲を PNG / JPG / WebP で保存します。処理はブラウザ内です。",
    "reselect": "別の画像",
    "download": "切り抜きを保存",
    "sourceSize": "元画像",
    "cropSize": "選択範囲",
    "ratioTitle": "縦横比",
    "ratio_free": "自由",
    "ratio_orig": "元の比率",
    "ratioHint": "自由なら任意の枠、固定なら比率を保ちます。",
    "formatTitle": "書き出し形式",
    "qualityTitle": "画質",
    "cropTip": "枠をドラッグ、四隅で拡大縮小。ホイールでズーム、中ボタンまたは Space で移動。",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "処理できませんでした。"
  },
  "ko": {
    "title_page": "이미지 자르기",
    "desc": "자유롭게 또는 1:1, 4:3, 16:9 비율로 자른 뒤 PNG, JPG, WebP로 받습니다. 모두 브라우저에서 처리됩니다.",
    "reselect": "다른 이미지",
    "download": "자른 이미지 받기",
    "sourceSize": "원본",
    "cropSize": "선택 영역",
    "ratioTitle": "비율",
    "ratio_free": "자유",
    "ratio_orig": "원본 비율",
    "ratioHint": "자유는 아무 사각형, 잠금은 비율을 유지합니다.",
    "formatTitle": "내보내기 형식",
    "qualityTitle": "화질",
    "cropTip": "상자를 끌고 모서리로 조절. 휠 확대, 가운데 버튼이나 Space로 이동.",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "처리하지 못했습니다."
  },
  "fr": {
    "title_page": "Recadrer l’image",
    "desc": "Recadrez librement ou avec un ratio 1:1, 4:3, 16:9… Exportez la sélection en PNG, JPG ou WebP.",
    "reselect": "Autre image",
    "download": "Télécharger le recadrage",
    "sourceSize": "Source",
    "cropSize": "Sélection",
    "ratioTitle": "Ratio",
    "ratio_free": "Libre",
    "ratio_orig": "Original",
    "ratioHint": "Libre : n’importe quel cadre. Verrouillé : le ratio est conservé.",
    "formatTitle": "Format d’export",
    "qualityTitle": "Qualité",
    "cropTip": "Glissez le cadre ; molette pour zoomer ; clic milieu ou Espace pour déplacer.",
    "msgNotImage": "Choisissez un fichier image.",
    "msgFail": "Échec du traitement."
  },
  "de": {
    "title_page": "Bild zuschneiden",
    "desc": "Frei oder mit 1:1, 4:3, 16:9 zuschneiden und die Auswahl als PNG, JPG oder WebP speichern.",
    "reselect": "Anderes Bild",
    "download": "Zuschnitt speichern",
    "sourceSize": "Quelle",
    "cropSize": "Auswahl",
    "ratioTitle": "Seitenverhältnis",
    "ratio_free": "Frei",
    "ratio_orig": "Original",
    "ratioHint": "Frei: beliebiges Rechteck. Gesperrt: Verhältnis bleibt.",
    "formatTitle": "Exportformat",
    "qualityTitle": "Qualität",
    "cropTip": "Rahmen ziehen; Rad zoomen; mittlere Taste oder Leertaste verschieben.",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgFail": "Verarbeitung fehlgeschlagen."
  },
  "es": {
    "title_page": "Recortar imagen",
    "desc": "Recorta libremente o con 1:1, 4:3, 16:9 y exporta la selección en PNG, JPG o WebP.",
    "reselect": "Otra imagen",
    "download": "Descargar recorte",
    "sourceSize": "Origen",
    "cropSize": "Selección",
    "ratioTitle": "Proporción",
    "ratio_free": "Libre",
    "ratio_orig": "Original",
    "ratioHint": "Libre: cualquier recuadro. Bloqueado: se mantiene el ratio.",
    "formatTitle": "Formato de exportación",
    "qualityTitle": "Calidad",
    "cropTip": "Arrastra el recuadro; rueda para zoom; botón medio o Espacio para mover.",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgFail": "Error al procesar."
  },
  "pt": {
    "title_page": "Recortar imagem",
    "desc": "Recorte livre ou com 1:1, 4:3, 16:9 e exporte a seleção em PNG, JPG ou WebP.",
    "reselect": "Outra imagem",
    "download": "Descarregar recorte",
    "sourceSize": "Origem",
    "cropSize": "Seleção",
    "ratioTitle": "Proporção",
    "ratio_free": "Livre",
    "ratio_orig": "Original",
    "ratioHint": "Livre: qualquer retângulo. Bloqueado: o rácio mantém-se.",
    "formatTitle": "Formato de exportação",
    "qualityTitle": "Qualidade",
    "cropTip": "Arraste a caixa; scroll para zoom; botão do meio ou Espaço para mover.",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgFail": "Falha ao processar."
  },
  "ru": {
    "title_page": "Обрезать картинку",
    "desc": "Свободная обрезка или 1:1, 4:3, 16:9. Сохраните выделение как PNG, JPG или WebP.",
    "reselect": "Другое фото",
    "download": "Скачать обрезку",
    "sourceSize": "Исходник",
    "cropSize": "Выделение",
    "ratioTitle": "Пропорции",
    "ratio_free": "Свободно",
    "ratio_orig": "Как в оригинале",
    "ratioHint": "Свободно — любой прямоугольник; фиксация держит соотношение.",
    "formatTitle": "Формат экспорта",
    "qualityTitle": "Качество",
    "cropTip": "Тащите рамку; колесо — масштаб; средняя кнопка или пробел — сдвиг.",
    "msgNotImage": "Выберите файл изображения.",
    "msgFail": "Не удалось обработать."
  },
  "ar": {
    "title_page": "قص الصورة",
    "desc": "قص حر أو بنسبة 1:1 و4:3 و16:9. صدّر التحديد PNG أو JPG أو WebP.",
    "reselect": "صورة أخرى",
    "download": "تنزيل القص",
    "sourceSize": "المصدر",
    "cropSize": "التحديد",
    "ratioTitle": "النسبة",
    "ratio_free": "حر",
    "ratio_orig": "الأصل",
    "ratioHint": "الحر أي مستطيل؛ المقفل يحافظ على النسبة.",
    "formatTitle": "صيغة التصدير",
    "qualityTitle": "الجودة",
    "cropTip": "اسحب الإطار؛ العجلة للتكبير؛ الزر الأوسط أو المسافة للتحريك.",
    "msgNotImage": "اختر ملف صورة.",
    "msgFail": "تعذر المعالجة."
  },
  "hi": {
    "title_page": "इमेज क्रॉप",
    "desc": "मुक्त या 1:1, 4:3, 16:9 अनुपात में काटें और चयन PNG, JPG या WebP में निकालें।",
    "reselect": "दूसरी इमेज",
    "download": "क्रॉप डाउनलोड",
    "sourceSize": "स्रोत",
    "cropSize": "चयन",
    "ratioTitle": "अनुपात",
    "ratio_free": "मुक्त",
    "ratio_orig": "मूल",
    "ratioHint": "मुक्त कोई भी आयत; लॉक अनुपात बनाए रखता है।",
    "formatTitle": "एक्सपोर्ट फ़ॉर्मेट",
    "qualityTitle": "क्वालिटी",
    "cropTip": "बॉक्स खींचें; स्क्रॉल से ज़ूम; मध्य बटन या स्पेस से पैन।",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgFail": "प्रोसेस असफल।"
  },
  "it": {
    "title_page": "Ritaglia immagine",
    "desc": "Ritaglio libero o 1:1, 4:3, 16:9. Esporta la selezione in PNG, JPG o WebP.",
    "reselect": "Altra immagine",
    "download": "Scarica ritaglio",
    "sourceSize": "Sorgente",
    "cropSize": "Selezione",
    "ratioTitle": "Proporzioni",
    "ratio_free": "Libero",
    "ratio_orig": "Originale",
    "ratioHint": "Libero: qualsiasi rettangolo. Bloccato: il rapporto resta.",
    "formatTitle": "Formato di esportazione",
    "qualityTitle": "Qualità",
    "cropTip": "Trascina il riquadro; rotella per zoom; tasto centrale o Spazio per spostare.",
    "msgNotImage": "Scegli un file immagine.",
    "msgFail": "Elaborazione non riuscita."
  },
  "nl": {
    "title_page": "Afbeelding bijsnijden",
    "desc": "Vrij of met 1:1, 4:3, 16:9 bijsnijden en de selectie als PNG, JPG of WebP exporteren.",
    "reselect": "Andere afbeelding",
    "download": "Uitsnede downloaden",
    "sourceSize": "Bron",
    "cropSize": "Selectie",
    "ratioTitle": "Verhouding",
    "ratio_free": "Vrij",
    "ratio_orig": "Origineel",
    "ratioHint": "Vrij: elke rechthoek. Vergrendeld: verhouding blijft.",
    "formatTitle": "Exportformaat",
    "qualityTitle": "Kwaliteit",
    "cropTip": "Sleep het kader; scroll om te zoomen; middelste knop of spatiebalk om te pan.",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgFail": "Verwerken mislukt."
  },
  "tr": {
    "title_page": "Görüntü kırp",
    "desc": "Serbest veya 1:1, 4:3, 16:9 oranında kırpın, seçimi PNG, JPG veya WebP olarak alın.",
    "reselect": "Başka görüntü",
    "download": "Kırpmayı indir",
    "sourceSize": "Kaynak",
    "cropSize": "Seçim",
    "ratioTitle": "Oran",
    "ratio_free": "Serbest",
    "ratio_orig": "Orijinal",
    "ratioHint": "Serbest herhangi bir dikdörtgen; kilit oranı korur.",
    "formatTitle": "Dışa aktarma biçimi",
    "qualityTitle": "Kalite",
    "cropTip": "Kutuyu sürükleyin; tekerlek yakınlaştırır; orta tuş veya Boşluk kaydırır.",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgFail": "İşlem başarısız."
  },
  "vi": {
    "title_page": "Cắt ảnh",
    "desc": "Cắt tự do hoặc theo 1:1, 4:3, 16:9, rồi xuất vùng chọn PNG, JPG hoặc WebP.",
    "reselect": "Ảnh khác",
    "download": "Tải phần cắt",
    "sourceSize": "Gốc",
    "cropSize": "Vùng chọn",
    "ratioTitle": "Tỉ lệ",
    "ratio_free": "Tự do",
    "ratio_orig": "Theo ảnh gốc",
    "ratioHint": "Tự do là hình chữ nhật bất kỳ; khóa thì giữ tỉ lệ.",
    "formatTitle": "Định dạng xuất",
    "qualityTitle": "Chất lượng",
    "cropTip": "Kéo khung; lăn chuột zoom; nút giữa hoặc Space để pan.",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Xử lý thất bại."
  },
  "th": {
    "title_page": "ครอปรูป",
    "desc": "ครอปอิสระหรือล็อก 1:1 4:3 16:9 แล้วส่งออกส่วนที่เลือกเป็น PNG JPG หรือ WebP",
    "reselect": "เลือกรูปใหม่",
    "download": "ดาวน์โหลดส่วนครอป",
    "sourceSize": "ต้นฉบับ",
    "cropSize": "พื้นที่เลือก",
    "ratioTitle": "สัดส่วน",
    "ratio_free": "อิสระ",
    "ratio_orig": "ตามต้นฉบับ",
    "ratioHint": "อิสระลากได้ทุกสี่เหลี่ยม ล็อกจะคงสัดส่วน",
    "formatTitle": "รูปแบบส่งออก",
    "qualityTitle": "คุณภาพ",
    "cropTip": "ลากกรอบ ลูกกลิ้งซูม ปุ่มกลางหรือ Space เลื่อนพื้นหลัง",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgFail": "ประมวลผลไม่สำเร็จ"
  },
  "id": {
    "title_page": "Potong gambar",
    "desc": "Potong bebas atau dengan rasio 1:1, 4:3, 16:9, lalu ekspor pilihan sebagai PNG, JPG, atau WebP.",
    "reselect": "Gambar lain",
    "download": "Unduh potongan",
    "sourceSize": "Sumber",
    "cropSize": "Pilihan",
    "ratioTitle": "Rasio",
    "ratio_free": "Bebas",
    "ratio_orig": "Asli",
    "ratioHint": "Bebas: sembarang persegi panjang. Terkunci: rasio tetap.",
    "formatTitle": "Format ekspor",
    "qualityTitle": "Kualitas",
    "cropTip": "Seret kotak; gulir untuk zoom; tombol tengah atau Spasi untuk geser.",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Gagal memproses."
  },
  "ms": {
    "title_page": "Potong imej",
    "desc": "Potong bebas atau dengan 1:1, 4:3, 16:9, kemudian eksport pilihan sebagai PNG, JPG atau WebP.",
    "reselect": "Imej lain",
    "download": "Muat turun potongan",
    "sourceSize": "Sumber",
    "cropSize": "Pilihan",
    "ratioTitle": "Nisbah",
    "ratio_free": "Bebas",
    "ratio_orig": "Asal",
    "ratioHint": "Bebas: sebarang segi empat. Dikunci: nisbah kekal.",
    "formatTitle": "Format eksport",
    "qualityTitle": "Kualiti",
    "cropTip": "Seret kotak; tatal untuk zum; butang tengah atau Space untuk alih.",
    "msgNotImage": "Pilih fail imej.",
    "msgFail": "Gagal memproses."
  },
  "pl": {
    "title_page": "Przytnij obraz",
    "desc": "Przytnij swobodnie lub w 1:1, 4:3, 16:9 i eksportuj zaznaczenie jako PNG, JPG lub WebP.",
    "reselect": "Inny obraz",
    "download": "Pobierz wycinek",
    "sourceSize": "Źródło",
    "cropSize": "Zaznaczenie",
    "ratioTitle": "Proporcje",
    "ratio_free": "Wolne",
    "ratio_orig": "Oryginał",
    "ratioHint": "Wolne: dowolny prostokąt. Blokada trzyma proporcje.",
    "formatTitle": "Format eksportu",
    "qualityTitle": "Jakość",
    "cropTip": "Przeciągaj ramkę; kółko zoomuje; środkowy przycisk lub spacja przesuwa.",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgFail": "Przetwarzanie nie powiodło się."
  },
  "uk": {
    "title_page": "Обрізати зображення",
    "desc": "Вільна обрізка або 1:1, 4:3, 16:9. Експортуйте виділення як PNG, JPG або WebP.",
    "reselect": "Інше фото",
    "download": "Завантажити обрізку",
    "sourceSize": "Джерело",
    "cropSize": "Виділення",
    "ratioTitle": "Пропорції",
    "ratio_free": "Вільно",
    "ratio_orig": "Як в оригіналі",
    "ratioHint": "Вільно — будь-який прямокутник; фіксація тримає співвідношення.",
    "formatTitle": "Формат експорту",
    "qualityTitle": "Якість",
    "cropTip": "Тягніть рамку; колесо — масштаб; середня кнопка або пробіл — зсув.",
    "msgNotImage": "Виберіть файл зображення.",
    "msgFail": "Не вдалося обробити."
  },
  "sv": {
    "title_page": "Beskär bild",
    "desc": "Beskär fritt eller med 1:1, 4:3, 16:9 och exportera urvalet som PNG, JPG eller WebP.",
    "reselect": "Annan bild",
    "download": "Ladda ner beskärning",
    "sourceSize": "Källa",
    "cropSize": "Markering",
    "ratioTitle": "Förhållande",
    "ratio_free": "Fritt",
    "ratio_orig": "Original",
    "ratioHint": "Fritt: valfri rektangel. Låst: förhållandet behålls.",
    "formatTitle": "Exportformat",
    "qualityTitle": "Kvalitet",
    "cropTip": "Dra rutan; scrolla för zoom; mittenknapp eller blanksteg för att pan.",
    "msgNotImage": "Välj en bildfil.",
    "msgFail": "Bearbetningen misslyckades."
  },
  "zh-TW": {
    "title_page": "圖片裁剪",
    "desc": "自由框選或鎖定 1:1、4:3、16:9 等比例裁切圖片，依選區原圖像素匯出 PNG / JPG / WebP。處理都在瀏覽器本機完成。",
    "reselect": "換一張",
    "download": "下載裁剪結果",
    "sourceSize": "原圖",
    "cropSize": "選區",
    "ratioTitle": "裁切比例",
    "ratio_free": "自由",
    "ratio_orig": "原圖比例",
    "ratioHint": "自由模式可任意拉選區；鎖定比例後四角按該比例縮放。",
    "formatTitle": "匯出格式",
    "qualityTitle": "畫質",
    "cropTip": "拖動選框移動，四角縮放。滾輪縮放背景；按住中鍵或空白鍵拖動背景。",
    "msgNotImage": "請選擇圖片檔。",
    "msgFail": "處理失敗。"
  }
}
</i18n>
