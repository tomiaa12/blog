<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import { removeBackground } from "./loadMatting"

const { t } = useI18n()

type BgKey = "transparent" | "white" | "black" | "blue" | "red" | "custom"

const BG: Record<Exclude<BgKey, "transparent" | "custom">, string> = {
  white: "#ffffff",
  black: "#111111",
  blue: "#438edb",
  red: "#c41e3a",
}

const objectUrl = ref("")
const fileName = ref("cutout")
const srcImg = ref<HTMLImageElement | null>(null)
const cutout = ref<HTMLCanvasElement | null>(null)
const previewUrl = ref("")
const running = ref(false)
const progressText = ref("")
const bgKey = ref<BgKey>("transparent")
const customColor = ref("#438edb")

const bgColor = computed(() => {
  if (bgKey.value === "transparent") return "transparent"
  if (bgKey.value === "custom") return customColor.value
  return BG[bgKey.value]
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
  revoke(previewUrl.value)
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name.replace(/\.[^.]+$/, "") || "cutout"
  cutout.value = null
  previewUrl.value = ""
  try {
    srcImg.value = await loadImage(objectUrl.value)
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

function paintPreview() {
  const src = cutout.value
  if (!src) return
  const canvas = document.createElement("canvas")
  canvas.width = src.width
  canvas.height = src.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  if (bgColor.value !== "transparent") {
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(src, 0, 0)
  canvas.toBlob(blob => {
    if (!blob) return
    revoke(previewUrl.value)
    previewUrl.value = URL.createObjectURL(blob)
  }, "image/png")
}

async function run() {
  if (!srcImg.value || running.value) return
  running.value = true
  progressText.value = t("loadingLib")
  try {
    cutout.value = await removeBackground(srcImg.value, info => {
      if (info.status === "progress" && info.progress != null) {
        progressText.value = t("loadingModel", {
          n: Math.round(info.progress),
        })
      } else if (info.status === "ready") {
        progressText.value = t("inferring")
      } else {
        progressText.value = t("loadingModel", { n: 0 })
      }
    })
    progressText.value = ""
    paintPreview()
  } catch {
    progressText.value = ""
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
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

function download() {
  const src = cutout.value
  if (!src) return
  const canvas = document.createElement("canvas")
  canvas.width = src.width
  canvas.height = src.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  if (bgColor.value !== "transparent") {
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(src, 0, 0)
  canvas.toBlob(blob => {
    if (!blob) {
      ElMessage({ message: t("msgFail"), type: "error" })
      return
    }
    saveBlob(blob, `${fileName.value}-cutout.png`)
  }, "image/png")
}

function reset() {
  revoke(objectUrl.value)
  revoke(previewUrl.value)
  objectUrl.value = ""
  previewUrl.value = ""
  srcImg.value = null
  cutout.value = null
  progressText.value = ""
}

function onBgChange() {
  if (cutout.value) paintPreview()
}

onUnmounted(reset)
</script>

<template>
  <div class="mt-page">
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
          :loading="running"
          @click="run"
        >
          {{ t("run") }}
        </el-button>
        <el-button
          :disabled="!cutout"
          @click="download"
        >
          {{ t("download") }}
        </el-button>
        <span
          v-if="progressText"
          class="meta"
        >{{ progressText }}</span>
      </div>

      <div class="work">
        <div class="preview-wrap">
          <div class="preview-host">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt=""
            />
            <img
              v-else
              :src="objectUrl"
              alt=""
            />
          </div>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("bgTitle") }}</h2>
          <el-radio-group
            v-model="bgKey"
            class="fmt-group"
            @change="onBgChange"
          >
            <el-radio-button value="transparent">{{ t("bgClear") }}</el-radio-button>
            <el-radio-button value="white">{{ t("bgWhite") }}</el-radio-button>
            <el-radio-button value="black">{{ t("bgBlack") }}</el-radio-button>
            <el-radio-button value="blue">{{ t("bgBlue") }}</el-radio-button>
            <el-radio-button value="red">{{ t("bgRed") }}</el-radio-button>
            <el-radio-button value="custom">{{ t("bgCustom") }}</el-radio-button>
          </el-radio-group>
          <div
            v-if="bgKey === 'custom'"
            class="row"
          >
            <el-color-picker
              v-model="customColor"
              @change="onBgChange"
            />
          </div>
          <p class="hint">{{ t("hint") }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.mt-page {
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

.preview-host img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.side {
  padding: 12px 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.sub {
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
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
  margin-bottom: 8px;
}

.hint {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片抠图",
    "desc": "用 Transformers.js 在浏览器里本地抠图，不上传服务器。首次会从 CDN 下载模型，之后可换成透明、白、蓝、红底并导出 PNG。",
    "reselect": "换一张",
    "run": "开始抠图",
    "download": "下载 PNG",
    "bgTitle": "背景",
    "bgClear": "透明",
    "bgWhite": "白",
    "bgBlack": "黑",
    "bgBlue": "蓝",
    "bgRed": "红",
    "bgCustom": "自定义",
    "hint": "首次加载模型大约几十 MB，请稍候。人像效果较好，复杂场景可能有毛边。",
    "loadingLib": "正在从 CDN 加载 Transformers.js…",
    "loadingModel": "正在下载模型 {n}%",
    "inferring": "正在抠图…",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "抠图失败，请换一张图或稍后重试。"
  },
  "zh-CN": {
    "title_page": "图片抠图",
    "desc": "用 Transformers.js 在浏览器里本地抠图，不上传服务器。首次会从 CDN 下载模型，之后可换成透明、白、蓝、红底并导出 PNG。",
    "reselect": "换一张",
    "run": "开始抠图",
    "download": "下载 PNG",
    "bgTitle": "背景",
    "bgClear": "透明",
    "bgWhite": "白",
    "bgBlack": "黑",
    "bgBlue": "蓝",
    "bgRed": "红",
    "bgCustom": "自定义",
    "hint": "首次加载模型大约几十 MB，请稍候。人像效果较好，复杂场景可能有毛边。",
    "loadingLib": "正在从 CDN 加载 Transformers.js…",
    "loadingModel": "正在下载模型 {n}%",
    "inferring": "正在抠图…",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "抠图失败，请换一张图或稍后重试。"
  },
  "en": {
    "title_page": "Remove background",
    "desc": "Cut out subjects in your browser with Transformers.js. Nothing is uploaded. First run downloads the model from a CDN.",
    "reselect": "Choose another",
    "run": "Remove background",
    "download": "Download PNG",
    "bgTitle": "Background",
    "bgClear": "Clear",
    "bgWhite": "White",
    "bgBlack": "Black",
    "bgBlue": "Blue",
    "bgRed": "Red",
    "bgCustom": "Custom",
    "hint": "The first run downloads tens of MB. Portraits work best.",
    "loadingLib": "Loading Transformers.js from CDN…",
    "loadingModel": "Downloading model {n}%",
    "inferring": "Removing background…",
    "msgNotImage": "Please choose an image file.",
    "msgFail": "Could not remove the background. Try another image."
  },
  "ja": {
    "title_page": "画像の切り抜き",
    "desc": "Transformers.js でブラウザ内切り抜き。画像は送信しません。初回は CDN からモデルを取得します。",
    "reselect": "別の画像",
    "run": "背景を削除",
    "download": "PNG を保存",
    "bgTitle": "背景",
    "bgClear": "透明",
    "bgWhite": "白",
    "bgBlack": "黒",
    "bgBlue": "青",
    "bgRed": "赤",
    "bgCustom": "カスタム",
    "hint": "初回は数十 MB をダウンロードします。人物向きです。",
    "loadingLib": "CDN から Transformers.js を読み込み中…",
    "loadingModel": "モデル {n}%",
    "inferring": "切り抜き中…",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "切り抜きに失敗しました。"
  },
  "ko": {
    "title_page": "이미지 배경 제거",
    "desc": "Transformers.js로 브라우저에서 배경을 지웁니다. 이미지는 업로드되지 않습니다.",
    "reselect": "다른 이미지",
    "run": "배경 제거",
    "download": "PNG 다운로드",
    "bgTitle": "배경",
    "bgClear": "투명",
    "bgWhite": "흰색",
    "bgBlack": "검정",
    "bgBlue": "파랑",
    "bgRed": "빨강",
    "bgCustom": "사용자 지정",
    "hint": "처음에는 모델 수십 MB를 받습니다. 인물에 더 잘 맞습니다.",
    "loadingLib": "CDN에서 Transformers.js 로드 중…",
    "loadingModel": "모델 {n}%",
    "inferring": "배경 제거 중…",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "배경을 제거하지 못했습니다."
  },
  "fr": {
    "title_page": "Détourer l’image",
    "desc": "Supprimez l’arrière-plan dans le navigateur avec Transformers.js. Rien n’est envoyé.",
    "reselect": "Autre image",
    "run": "Détourer",
    "download": "Télécharger le PNG",
    "bgTitle": "Fond",
    "bgClear": "Transparent",
    "bgWhite": "Blanc",
    "bgBlack": "Noir",
    "bgBlue": "Bleu",
    "bgRed": "Rouge",
    "bgCustom": "Perso",
    "hint": "Le premier lancement télécharge des dizaines de Mo. Mieux pour les portraits.",
    "loadingLib": "Chargement de Transformers.js…",
    "loadingModel": "Modèle {n}%",
    "inferring": "Détourage…",
    "msgNotImage": "Choisissez un fichier image.",
    "msgFail": "Échec du détourage."
  },
  "de": {
    "title_page": "Hintergrund entfernen",
    "desc": "Freistellen im Browser mit Transformers.js. Es wird nichts hochgeladen.",
    "reselect": "Anderes Bild",
    "run": "Freistellen",
    "download": "PNG herunterladen",
    "bgTitle": "Hintergrund",
    "bgClear": "Transparent",
    "bgWhite": "Weiß",
    "bgBlack": "Schwarz",
    "bgBlue": "Blau",
    "bgRed": "Rot",
    "bgCustom": "Eigene",
    "hint": "Beim ersten Mal werden einige Dutzend MB geladen. Am besten für Porträts.",
    "loadingLib": "Transformers.js wird geladen…",
    "loadingModel": "Modell {n}%",
    "inferring": "Freistellen…",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgFail": "Freistellen fehlgeschlagen."
  },
  "es": {
    "title_page": "Recortar fondo",
    "desc": "Quita el fondo en el navegador con Transformers.js. No se sube nada.",
    "reselect": "Otra imagen",
    "run": "Quitar fondo",
    "download": "Descargar PNG",
    "bgTitle": "Fondo",
    "bgClear": "Transparente",
    "bgWhite": "Blanco",
    "bgBlack": "Negro",
    "bgBlue": "Azul",
    "bgRed": "Rojo",
    "bgCustom": "Personalizado",
    "hint": "La primera vez descarga decenas de MB. Mejor con retratos.",
    "loadingLib": "Cargando Transformers.js…",
    "loadingModel": "Modelo {n}%",
    "inferring": "Quitando fondo…",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgFail": "No se pudo quitar el fondo."
  },
  "pt": {
    "title_page": "Recortar fundo",
    "desc": "Remova o fundo no navegador com Transformers.js. Nada é enviado.",
    "reselect": "Outra imagem",
    "run": "Remover fundo",
    "download": "Descarregar PNG",
    "bgTitle": "Fundo",
    "bgClear": "Transparente",
    "bgWhite": "Branco",
    "bgBlack": "Preto",
    "bgBlue": "Azul",
    "bgRed": "Vermelho",
    "bgCustom": "Personalizado",
    "hint": "A primeira vez descarrega dezenas de MB. Melhor em retratos.",
    "loadingLib": "A carregar Transformers.js…",
    "loadingModel": "Modelo {n}%",
    "inferring": "A remover o fundo…",
    "msgNotImage": "Escolha um ficheiro de imagem.",
    "msgFail": "Falha ao remover o fundo."
  },
  "ru": {
    "title_page": "Вырезать фон",
    "desc": "Удалите фон в браузере через Transformers.js. Файлы не отправляются.",
    "reselect": "Другое фото",
    "run": "Убрать фон",
    "download": "Скачать PNG",
    "bgTitle": "Фон",
    "bgClear": "Прозрачный",
    "bgWhite": "Белый",
    "bgBlack": "Чёрный",
    "bgBlue": "Синий",
    "bgRed": "Красный",
    "bgCustom": "Свой",
    "hint": "В первый раз скачается несколько десятков МБ. Лучше для портретов.",
    "loadingLib": "Загрузка Transformers.js…",
    "loadingModel": "Модель {n}%",
    "inferring": "Удаление фона…",
    "msgNotImage": "Выберите файл изображения.",
    "msgFail": "Не удалось убрать фон."
  },
  "ar": {
    "title_page": "قص الخلفية",
    "desc": "أزل الخلفية في المتصفح عبر Transformers.js. لا يُرفع شيء.",
    "reselect": "صورة أخرى",
    "run": "إزالة الخلفية",
    "download": "تنزيل PNG",
    "bgTitle": "الخلفية",
    "bgClear": "شفاف",
    "bgWhite": "أبيض",
    "bgBlack": "أسود",
    "bgBlue": "أزرق",
    "bgRed": "أحمر",
    "bgCustom": "مخصص",
    "hint": "التحميل الأول عشرات الميغابايت. أفضل للصور الشخصية.",
    "loadingLib": "جارٍ تحميل Transformers.js…",
    "loadingModel": "النموذج {n}%",
    "inferring": "جارٍ إزالة الخلفية…",
    "msgNotImage": "اختر ملف صورة.",
    "msgFail": "تعذر إزالة الخلفية."
  },
  "hi": {
    "title_page": "बैकग्राउंड हटाएँ",
    "desc": "Transformers.js से ब्राउज़र में बैकग्राउंड काटें। कुछ अपलोड नहीं होता।",
    "reselect": "दूसरी इमेज",
    "run": "बैकग्राउंड हटाएँ",
    "download": "PNG डाउनलोड",
    "bgTitle": "पृष्ठभूमि",
    "bgClear": "पारदर्शी",
    "bgWhite": "सफ़ेद",
    "bgBlack": "काला",
    "bgBlue": "नीला",
    "bgRed": "लाल",
    "bgCustom": "कस्टम",
    "hint": "पहली बार कई MB मॉडल आएगा। पोर्ट्रेट पर बेहतर।",
    "loadingLib": "Transformers.js लोड हो रहा है…",
    "loadingModel": "मॉडल {n}%",
    "inferring": "बैकग्राउंड हट रहा है…",
    "msgNotImage": "कोई इमेज फ़ाइल चुनें।",
    "msgFail": "बैकग्राउंड नहीं हटा।"
  },
  "it": {
    "title_page": "Rimuovi sfondo",
    "desc": "Ritaglia lo sfondo nel browser con Transformers.js. Nulla viene inviato.",
    "reselect": "Altra immagine",
    "run": "Rimuovi sfondo",
    "download": "Scarica PNG",
    "bgTitle": "Sfondo",
    "bgClear": "Trasparente",
    "bgWhite": "Bianco",
    "bgBlack": "Nero",
    "bgBlue": "Blu",
    "bgRed": "Rosso",
    "bgCustom": "Personalizzato",
    "hint": "Al primo avvio scarica decine di MB. Meglio sui ritratti.",
    "loadingLib": "Caricamento di Transformers.js…",
    "loadingModel": "Modello {n}%",
    "inferring": "Rimozione sfondo…",
    "msgNotImage": "Scegli un file immagine.",
    "msgFail": "Impossibile rimuovere lo sfondo."
  },
  "nl": {
    "title_page": "Achtergrond verwijderen",
    "desc": "Verwijder de achtergrond in de browser met Transformers.js. Niets wordt geüpload.",
    "reselect": "Andere afbeelding",
    "run": "Achtergrond weg",
    "download": "PNG downloaden",
    "bgTitle": "Achtergrond",
    "bgClear": "Transparant",
    "bgWhite": "Wit",
    "bgBlack": "Zwart",
    "bgBlue": "Blauw",
    "bgRed": "Rood",
    "bgCustom": "Aangepast",
    "hint": "De eerste keer worden tientallen MB geladen. Beste bij portretten.",
    "loadingLib": "Transformers.js laden…",
    "loadingModel": "Model {n}%",
    "inferring": "Achtergrond verwijderen…",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgFail": "Achtergrond verwijderen mislukt."
  },
  "tr": {
    "title_page": "Arka planı kaldır",
    "desc": "Transformers.js ile tarayıcıda arka planı silin. Hiçbir şey yüklenmez.",
    "reselect": "Başka görüntü",
    "run": "Arka planı kaldır",
    "download": "PNG indir",
    "bgTitle": "Arka plan",
    "bgClear": "Saydam",
    "bgWhite": "Beyaz",
    "bgBlack": "Siyah",
    "bgBlue": "Mavi",
    "bgRed": "Kırmızı",
    "bgCustom": "Özel",
    "hint": "İlk çalıştırmada onlarca MB iner. Portrelerde daha iyi.",
    "loadingLib": "Transformers.js yükleniyor…",
    "loadingModel": "Model {n}%",
    "inferring": "Arka plan kaldırılıyor…",
    "msgNotImage": "Bir görüntü dosyası seçin.",
    "msgFail": "Arka plan kaldırılamadı."
  },
  "vi": {
    "title_page": "Tách nền ảnh",
    "desc": "Xóa nền ngay trên trình duyệt bằng Transformers.js. Không tải ảnh lên máy chủ.",
    "reselect": "Ảnh khác",
    "run": "Xóa nền",
    "download": "Tải PNG",
    "bgTitle": "Nền",
    "bgClear": "Trong suốt",
    "bgWhite": "Trắng",
    "bgBlack": "Đen",
    "bgBlue": "Xanh",
    "bgRed": "Đỏ",
    "bgCustom": "Tùy chỉnh",
    "hint": "Lần đầu tải mô hình vài chục MB. Hiệu quả hơn với ảnh chân dung.",
    "loadingLib": "Đang tải Transformers.js…",
    "loadingModel": "Mô hình {n}%",
    "inferring": "Đang xóa nền…",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Không xóa được nền."
  },
  "th": {
    "title_page": "ตัดพื้นหลัง",
    "desc": "ตัดพื้นหลังในเบราว์เซอร์ด้วย Transformers.js ไม่ได้อัปโหลดรูป",
    "reselect": "เลือกรูปใหม่",
    "run": "ตัดพื้นหลัง",
    "download": "ดาวน์โหลด PNG",
    "bgTitle": "พื้นหลัง",
    "bgClear": "โปร่งใส",
    "bgWhite": "ขาว",
    "bgBlack": "ดำ",
    "bgBlue": "น้ำเงิน",
    "bgRed": "แดง",
    "bgCustom": "กำหนดเอง",
    "hint": "ครั้งแรกจะโหลดโมเดลหลายสิบ MB เหมาะกับรูปคน",
    "loadingLib": "กำลังโหลด Transformers.js…",
    "loadingModel": "โมเดล {n}%",
    "inferring": "กำลังตัดพื้นหลัง…",
    "msgNotImage": "เลือกไฟล์รูปภาพ",
    "msgFail": "ตัดพื้นหลังไม่สำเร็จ"
  },
  "id": {
    "title_page": "Hapus latar",
    "desc": "Hapus latar di browser dengan Transformers.js. Tidak ada unggahan.",
    "reselect": "Gambar lain",
    "run": "Hapus latar",
    "download": "Unduh PNG",
    "bgTitle": "Latar",
    "bgClear": "Transparan",
    "bgWhite": "Putih",
    "bgBlack": "Hitam",
    "bgBlue": "Biru",
    "bgRed": "Merah",
    "bgCustom": "Kustom",
    "hint": "Pertama kali mengunduh puluhan MB. Lebih baik untuk potret.",
    "loadingLib": "Memuat Transformers.js…",
    "loadingModel": "Model {n}%",
    "inferring": "Menghapus latar…",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Gagal menghapus latar."
  },
  "ms": {
    "title_page": "Buang latar",
    "desc": "Buang latar dalam pelayar dengan Transformers.js. Tiada muat naik.",
    "reselect": "Imej lain",
    "run": "Buang latar",
    "download": "Muat turun PNG",
    "bgTitle": "Latar",
    "bgClear": "Lutsinar",
    "bgWhite": "Putih",
    "bgBlack": "Hitam",
    "bgBlue": "Biru",
    "bgRed": "Merah",
    "bgCustom": "Tersuai",
    "hint": "Kali pertama memuat turun puluhan MB. Lebih baik untuk potret.",
    "loadingLib": "Memuatkan Transformers.js…",
    "loadingModel": "Model {n}%",
    "inferring": "Membuang latar…",
    "msgNotImage": "Pilih fail imej.",
    "msgFail": "Gagal membuang latar."
  },
  "pl": {
    "title_page": "Wycinanie tła",
    "desc": "Usuń tło w przeglądarce przez Transformers.js. Nic nie jest wysyłane.",
    "reselect": "Inny obraz",
    "run": "Usuń tło",
    "download": "Pobierz PNG",
    "bgTitle": "Tło",
    "bgClear": "Przezroczyste",
    "bgWhite": "Białe",
    "bgBlack": "Czarne",
    "bgBlue": "Niebieskie",
    "bgRed": "Czerwone",
    "bgCustom": "Własne",
    "hint": "Za pierwszym razem pobierze kilkadziesiąt MB. Najlepiej na portrety.",
    "loadingLib": "Wczytywanie Transformers.js…",
    "loadingModel": "Model {n}%",
    "inferring": "Usuwanie tła…",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgFail": "Nie udało się usunąć tła."
  },
  "uk": {
    "title_page": "Вирізати тло",
    "desc": "Приберіть тло в браузері через Transformers.js. Нічого не надсилається.",
    "reselect": "Інше фото",
    "run": "Прибрати тло",
    "download": "Завантажити PNG",
    "bgTitle": "Тло",
    "bgClear": "Прозоре",
    "bgWhite": "Біле",
    "bgBlack": "Чорне",
    "bgBlue": "Синє",
    "bgRed": "Червоне",
    "bgCustom": "Своє",
    "hint": "Перший раз завантажить десятки МБ. Краще для портретів.",
    "loadingLib": "Завантаження Transformers.js…",
    "loadingModel": "Модель {n}%",
    "inferring": "Видалення тла…",
    "msgNotImage": "Виберіть файл зображення.",
    "msgFail": "Не вдалося прибрати тло."
  },
  "sv": {
    "title_page": "Ta bort bakgrund",
    "desc": "Frilägg i webbläsaren med Transformers.js. Inget laddas upp.",
    "reselect": "Annan bild",
    "run": "Ta bort bakgrund",
    "download": "Ladda ner PNG",
    "bgTitle": "Bakgrund",
    "bgClear": "Transparent",
    "bgWhite": "Vit",
    "bgBlack": "Svart",
    "bgBlue": "Blå",
    "bgRed": "Röd",
    "bgCustom": "Anpassad",
    "hint": "Första gången laddas tiotals MB. Bäst för porträtt.",
    "loadingLib": "Laddar Transformers.js…",
    "loadingModel": "Modell {n}%",
    "inferring": "Tar bort bakgrund…",
    "msgNotImage": "Välj en bildfil.",
    "msgFail": "Kunde inte ta bort bakgrunden."
  },
  "zh-TW": {
    "title_page": "圖片去背",
    "desc": "用 Transformers.js 在瀏覽器本機去背，不上傳伺服器。首次會從 CDN 下載模型，之後可換成透明、白、藍、紅底並匯出 PNG。",
    "reselect": "換一張",
    "run": "開始去背",
    "download": "下載 PNG",
    "bgTitle": "背景",
    "bgClear": "透明",
    "bgWhite": "白",
    "bgBlack": "黑",
    "bgBlue": "藍",
    "bgRed": "紅",
    "bgCustom": "自訂",
    "hint": "首次載入模型大約數十 MB，請稍候。人像效果較好。",
    "loadingLib": "正在從 CDN 載入 Transformers.js…",
    "loadingModel": "正在下載模型 {n}%",
    "inferring": "正在去背…",
    "msgNotImage": "請選擇圖片檔。",
    "msgFail": "去背失敗，請換一張圖或稍後重試。"
  }
}
</i18n>
