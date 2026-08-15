<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import FileUpload from "@/components/FileUpload.vue"
import { copyToClipboard } from "@/utils"
import { ensureColorThief, type RGB } from "./loadColorThief"

const { t } = useI18n()

type Rank = {
  rgb: RGB
  hex: string
  pct: number
}

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"

const objectUrl = ref("")
const fileName = ref("image")
const srcImg = ref<HTMLImageElement | null>(null)
const ranks = ref<Rank[]>([])
const running = ref(false)
const loadingLib = ref(false)

const dominant = computed(() => ranks.value[0] ?? null)

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true
  return /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)
}

function toHex([r, g, b]: RGB) {
  return `#${[r, g, b].map(n => n.toString(16).padStart(2, "0")).join("")}`
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("img"))
    img.src = url
  })
}

function dist(r: number, g: number, b: number, rgb: RGB) {
  const dr = r - rgb[0]
  const dg = g - rgb[1]
  const db = b - rgb[2]
  return dr * dr + dg * dg + db * db
}

function rankByPixels(img: HTMLImageElement, palette: RGB[]) {
  const canvas = document.createElement("canvas")
  const max = 280
  const s = Math.min(1, max / img.naturalWidth, max / img.naturalHeight)
  const w = Math.max(1, Math.round(img.naturalWidth * s))
  const h = Math.max(1, Math.round(img.naturalHeight * s))
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  const counts = new Array(palette.length).fill(0) as number[]
  let total = 0
  for (let i = 0; i < data.length; i += 4) {
    if ((data[i + 3] ?? 0) < 24) continue
    const r = data[i]!
    const g = data[i + 1]!
    const b = data[i + 2]!
    let best = 0
    let bestD = Infinity
    for (let p = 0; p < palette.length; p++) {
      const d = dist(r, g, b, palette[p]!)
      if (d < bestD) {
        bestD = d
        best = p
      }
    }
    counts[best]! += 1
    total += 1
  }
  if (!total) return []
  return palette
    .map((rgb, i) => ({
      rgb,
      hex: toHex(rgb),
      pct: (counts[i]! / total) * 100,
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 10)
}

async function extract(img: HTMLImageElement) {
  running.value = true
  loadingLib.value = true
  try {
    const thief = await ensureColorThief()
    loadingLib.value = false
    const palette = thief.getPalette(img, 10, 4) || []
    const unique = palette.filter((c, i, arr) => {
      const hex = toHex(c)
      return arr.findIndex(x => toHex(x) === hex) === i
    })
    ranks.value = rankByPixels(img, unique)
    if (!ranks.value.length) ElMessage({ message: t("msgFail"), type: "error" })
  } catch {
    loadingLib.value = false
    ElMessage({ message: t("msgLib"), type: "error" })
  } finally {
    running.value = false
  }
}

async function pickImage(files: File[]) {
  const file = files.find(isImageFile)
  if (!file) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name.replace(/\.[^.]+$/, "") || "image"
  try {
    const img = await loadImage(objectUrl.value)
    srcImg.value = img
    await extract(img)
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  }
}

function reset() {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = ""
  srcImg.value = null
  ranks.value = []
}

async function copyHex(hex: string) {
  await copyToClipboard(hex)
  ElMessage({ message: t("copied"), type: "success", duration: 1200 })
}

async function copyAll() {
  if (!ranks.value.length) return
  const text = ranks.value
    .map((c, i) => `${i + 1}. ${c.hex}  rgb(${c.rgb.join(", ")})  ${c.pct.toFixed(1)}%`)
    .join("\n")
  await copyToClipboard(text)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

async function copyCss() {
  if (!ranks.value.length) return
  const text = ranks.value
    .map((c, i) => `--color-${i + 1}: ${c.hex};`)
    .join("\n")
  await copyToClipboard(text)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

onUnmounted(reset)
</script>

<template>
  <div class="ce-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <FileUpload
      v-if="!objectUrl"
      :multiple="false"
      :folder="false"
      :accept="ACCEPT"
      @files-added="pickImage"
    />

    <template v-else>
      <div class="toolbar">
        <el-button @click="reset">{{ t("reselect") }}</el-button>
        <el-button
          type="primary"
          :loading="running"
          :disabled="!srcImg"
          @click="srcImg && extract(srcImg)"
        >
          {{ t("run") }}
        </el-button>
        <el-button
          :disabled="!ranks.length"
          @click="copyAll"
        >
          {{ t("copyAll") }}
        </el-button>
        <el-button
          :disabled="!ranks.length"
          @click="copyCss"
        >
          {{ t("copyCss") }}
        </el-button>
        <span class="meta">
          <template v-if="loadingLib">{{ t("loadingLib") }}</template>
          <template v-else-if="srcImg">
            {{ srcImg.naturalWidth }} × {{ srcImg.naturalHeight }}
          </template>
        </span>
      </div>

      <div class="work">
        <div class="preview-wrap">
          <div class="preview-host">
            <img
              :src="objectUrl"
              alt=""
            />
          </div>
        </div>

        <div class="side">
          <template v-if="dominant">
            <h2 class="sub">{{ t("main") }}</h2>
            <button
              type="button"
              class="main-swatch"
              :style="{ background: dominant.hex }"
              @click="copyHex(dominant.hex)"
            >
              <span>{{ dominant.hex }}</span>
            </button>
            <p class="hint">{{ t("hint") }}</p>
          </template>
        </div>
      </div>

      <h2 class="sub list-title">{{ t("rankTitle") }}</h2>
      <ol class="rank-list">
        <li
          v-for="(c, i) in ranks"
          :key="c.hex + i"
          class="rank-row"
        >
          <span class="no">{{ i + 1 }}</span>
          <button
            type="button"
            class="swatch"
            :style="{ background: c.hex }"
            :title="t('copyHex')"
            @click="copyHex(c.hex)"
          />
          <div class="info">
            <div class="codes">
              <button
                type="button"
                class="hex"
                @click="copyHex(c.hex)"
              >
                {{ c.hex }}
              </button>
              <span class="rgb">rgb({{ c.rgb.join(", ") }})</span>
            </div>
            <div class="bar-wrap">
              <div
                class="bar"
                :style="{ width: `${Math.max(c.pct, 1.2)}%`, background: c.hex }"
              />
            </div>
          </div>
          <span class="pct">{{ c.pct.toFixed(1) }}%</span>
        </li>
      </ol>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.ce-page {
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
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 800px) {
  .work {
    grid-template-columns: 1fr;
  }
}

.preview-wrap {
  min-height: 280px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.preview-host {
  height: min(48vh, 420px);
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

.main-swatch {
  height: 120px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 10px 12px;
  cursor: pointer;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  font-family: "Fira Code", Consolas, monospace;
  font-size: 0.95rem;
}

.hint {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.list-title {
  margin-top: 24px;
}

.rank-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.rank-row {
  display: grid;
  grid-template-columns: 36px 44px minmax(0, 1fr) 64px;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);

  &:last-child {
    border-bottom: 0;
  }
}

.no {
  font-weight: 700;
  color: var(--vp-c-text-3);
  text-align: center;
}

.swatch {
  width: 44px;
  height: 44px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
}

.info {
  min-width: 0;
}

.codes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: baseline;
}

.hex {
  border: 0;
  padding: 0;
  background: none;
  color: var(--vp-c-text-1);
  font-family: "Fira Code", Consolas, monospace;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    color: var(--vp-c-brand-1);
  }
}

.rgb {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.bar-wrap {
  margin-top: 6px;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 3px;
}

.pct {
  font-variant-numeric: tabular-nums;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  text-align: right;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片主色调",
    "desc": "从图片里提取主色调和前 10 个颜色，按像素占比排行。首次会从 CDN 加载 ColorThief，图片不上传。",
    "reselect": "换一张",
    "run": "重新提取",
    "copyAll": "复制排行",
    "copyCss": "复制 CSS 变量",
    "copyHex": "复制色值",
    "main": "主色",
    "rankTitle": "前 10 颜色排行",
    "hint": "点击色块或色值即可复制 HEX。占比按采样像素归到最近色计算。",
    "loadingLib": "正在从 CDN 加载 ColorThief…",
    "copied": "已复制",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "提取失败，请换一张图。",
    "msgLib": "取色库加载失败，请检查网络后重试。"
  },
  "zh-CN": {
    "title_page": "图片主色调",
    "desc": "从图片里提取主色调和前 10 个颜色，按像素占比排行。首次会从 CDN 加载 ColorThief，图片不上传。",
    "reselect": "换一张",
    "run": "重新提取",
    "copyAll": "复制排行",
    "copyCss": "复制 CSS 变量",
    "copyHex": "复制色值",
    "main": "主色",
    "rankTitle": "前 10 颜色排行",
    "hint": "点击色块或色值即可复制 HEX。占比按采样像素归到最近色计算。",
    "loadingLib": "正在从 CDN 加载 ColorThief…",
    "copied": "已复制",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "提取失败，请换一张图。",
    "msgLib": "取色库加载失败，请检查网络后重试。"
  },
  "en": {
    "title_page": "Image palette",
    "desc": "Pull the dominant color and a top-10 ranking from a photo. ColorThief loads from a CDN. The image stays in your browser.",
    "reselect": "Choose another",
    "run": "Extract again",
    "copyAll": "Copy ranking",
    "copyCss": "Copy CSS variables",
    "copyHex": "Copy hex",
    "main": "Dominant",
    "rankTitle": "Top 10 colors",
    "hint": "Click a swatch or hex to copy. Shares are sampled pixels assigned to the nearest color.",
    "loadingLib": "Loading ColorThief from CDN…",
    "copied": "Copied",
    "msgNotImage": "Please choose an image file.",
    "msgFail": "Could not extract colors. Try another image.",
    "msgLib": "Could not load ColorThief. Check your network and retry."
  },
  "ja": {
    "title_page": "画像のメインカラー",
    "desc": "画像からメインカラーと上位 10 色を抽出。初回は CDN から ColorThief を読み込み、画像は送信しません。",
    "reselect": "別の画像",
    "run": "再抽出",
    "copyAll": "ランキングをコピー",
    "copyCss": "CSS 変数をコピー",
    "copyHex": "HEX をコピー",
    "main": "メイン",
    "rankTitle": "上位 10 色",
    "hint": "色または HEX をクリックでコピー。割合は最近傍色への割り当てです。",
    "loadingLib": "CDN から ColorThief を読み込み中…",
    "copied": "コピーしました",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "抽出に失敗しました。別の画像を試してください。",
    "msgLib": "ライブラリの読み込みに失敗しました。通信を確認して再試行してください。"
  },
  "ko": {
    "title_page": "이미지 주조색",
    "desc": "사진에서 주조색과 상위 10색을 추출합니다. ColorThief는 CDN에서 불러오며 이미지는 업로드되지 않습니다.",
    "reselect": "다른 이미지",
    "run": "다시 추출",
    "copyAll": "순위 복사",
    "copyCss": "CSS 변수 복사",
    "copyHex": "HEX 복사",
    "main": "주조색",
    "rankTitle": "상위 10색",
    "hint": "색 또는 HEX를 클릭하면 복사됩니다. 비율은 가장 가까운 색으로 묶은 샘플입니다.",
    "loadingLib": "CDN에서 ColorThief 불러오는 중…",
    "copied": "복사됨",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "추출에 실패했습니다. 다른 이미지를 시도하세요.",
    "msgLib": "라이브러리를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도하세요."
  },
  "fr": {
    "title_page": "Couleurs dominantes",
    "desc": "Extrayez la couleur dominante et un top 10 depuis une image. ColorThief vient d’un CDN. L’image reste locale.",
    "reselect": "Changer d’image",
    "run": "Extraire à nouveau",
    "copyAll": "Copier le classement",
    "copyCss": "Copier les variables CSS",
    "copyHex": "Copier le hex",
    "main": "Dominante",
    "rankTitle": "Top 10 des couleurs",
    "hint": "Cliquez une pastille ou un hex pour copier. Les parts viennent des pixels assignés à la couleur la plus proche.",
    "loadingLib": "Chargement de ColorThief depuis le CDN…",
    "copied": "Copié",
    "msgNotImage": "Choisissez un fichier image.",
    "msgFail": "Extraction impossible. Essayez une autre image.",
    "msgLib": "Impossible de charger ColorThief. Vérifiez le réseau et réessayez."
  },
  "de": {
    "title_page": "Bild-Hauptfarben",
    "desc": "Dominante Farbe und Top-10-Ranking aus einem Bild. ColorThief kommt vom CDN. Das Bild bleibt lokal.",
    "reselect": "Anderes Bild",
    "run": "Erneut extrahieren",
    "copyAll": "Ranking kopieren",
    "copyCss": "CSS-Variablen kopieren",
    "copyHex": "Hex kopieren",
    "main": "Dominant",
    "rankTitle": "Top 10 Farben",
    "hint": "Klick auf Fläche oder Hex kopiert. Anteile sind Pixel, die der nächsten Farbe zugeordnet wurden.",
    "loadingLib": "ColorThief wird vom CDN geladen…",
    "copied": "Kopiert",
    "msgNotImage": "Bitte eine Bilddatei wählen.",
    "msgFail": "Extraktion fehlgeschlagen. Anderes Bild versuchen.",
    "msgLib": "ColorThief konnte nicht geladen werden. Netzwerk prüfen und erneut versuchen."
  },
  "es": {
    "title_page": "Colores dominantes",
    "desc": "Saca el color dominante y un top 10 de una foto. ColorThief se carga desde un CDN. La imagen no se sube.",
    "reselect": "Otra imagen",
    "run": "Extraer de nuevo",
    "copyAll": "Copiar ranking",
    "copyCss": "Copiar variables CSS",
    "copyHex": "Copiar hex",
    "main": "Dominante",
    "rankTitle": "Top 10 de colores",
    "hint": "Pulsa una muestra o el hex para copiar. Los porcentajes son píxeles asignados al color más cercano.",
    "loadingLib": "Cargando ColorThief desde el CDN…",
    "copied": "Copiado",
    "msgNotImage": "Elige un archivo de imagen.",
    "msgFail": "No se pudieron extraer colores. Prueba otra imagen.",
    "msgLib": "No se pudo cargar ColorThief. Revisa la red e inténtalo de nuevo."
  },
  "pt": {
    "title_page": "Cores dominantes",
    "desc": "Extraia a cor dominante e um top 10 de uma imagem. O ColorThief vem de um CDN. A imagem fica no dispositivo.",
    "reselect": "Outra imagem",
    "run": "Extrair de novo",
    "copyAll": "Copiar ranking",
    "copyCss": "Copiar variáveis CSS",
    "copyHex": "Copiar hex",
    "main": "Dominante",
    "rankTitle": "Top 10 cores",
    "hint": "Clique numa amostra ou no hex para copiar. As fatias são pixels atribuídos à cor mais próxima.",
    "loadingLib": "Carregando ColorThief do CDN…",
    "copied": "Copiado",
    "msgNotImage": "Escolha um arquivo de imagem.",
    "msgFail": "Falha na extração. Tente outra imagem.",
    "msgLib": "Não foi possível carregar o ColorThief. Verifique a rede e tente de novo."
  },
  "ru": {
    "title_page": "Основные цвета изображения",
    "desc": "Извлеките доминирующий цвет и топ-10 из фото. ColorThief с CDN. Файл не загружается.",
    "reselect": "Другое фото",
    "run": "Извлечь снова",
    "copyAll": "Копировать рейтинг",
    "copyCss": "Копировать CSS-переменные",
    "copyHex": "Копировать hex",
    "main": "Доминанта",
    "rankTitle": "Топ-10 цветов",
    "hint": "Нажмите образец или hex, чтобы скопировать. Доли — пиксели, отнесённые к ближайшему цвету.",
    "loadingLib": "Загрузка ColorThief с CDN…",
    "copied": "Скопировано",
    "msgNotImage": "Выберите файл изображения.",
    "msgFail": "Не удалось извлечь цвета. Попробуйте другое фото.",
    "msgLib": "Не удалось загрузить ColorThief. Проверьте сеть и повторите."
  },
  "ar": {
    "title_page": "ألوان الصورة السائدة",
    "desc": "استخرج اللون السائد وأفضل 10 ألوان من صورة. يُحمَّل ColorThief من CDN والصورة تبقى محلية.",
    "reselect": "صورة أخرى",
    "run": "استخرج مجددًا",
    "copyAll": "نسخ الترتيب",
    "copyCss": "نسخ متغيرات CSS",
    "copyHex": "نسخ hex",
    "main": "السائد",
    "rankTitle": "أفضل 10 ألوان",
    "hint": "انقر العينة أو القيمة لنسخها. النسب من بكسلات تُنسب لأقرب لون.",
    "loadingLib": "جارٍ تحميل ColorThief من CDN…",
    "copied": "تم النسخ",
    "msgNotImage": "اختر ملف صورة.",
    "msgFail": "تعذر الاستخراج. جرّب صورة أخرى.",
    "msgLib": "تعذر تحميل ColorThief. تحقق من الشبكة ثم أعد المحاولة."
  },
  "hi": {
    "title_page": "छवि मुख्य रंग",
    "desc": "फ़ोटो से मुख्य रंग और शीर्ष 10 रंग निकालें। ColorThief CDN से आता है। छवि अपलोड नहीं होती।",
    "reselect": "दूसरी छवि",
    "run": "फिर निकालें",
    "copyAll": "रैंकिंग कॉपी",
    "copyCss": "CSS चर कॉपी",
    "copyHex": "HEX कॉपी",
    "main": "मुख्य",
    "rankTitle": "शीर्ष 10 रंग",
    "hint": "स्वैच या HEX पर क्लिक कर कॉपी करें। प्रतिशत निकटतम रंग को दिए गए पिक्सेल हैं।",
    "loadingLib": "CDN से ColorThief लोड हो रहा है…",
    "copied": "कॉपी हो गया",
    "msgNotImage": "कृपया छवि फ़ाइल चुनें।",
    "msgFail": "निकालना असफल। दूसरी छवि आज़माएँ।",
    "msgLib": "ColorThief लोड नहीं हुआ। नेटवर्क जाँचकर पुनः प्रयास करें।"
  },
  "it": {
    "title_page": "Colori dominanti",
    "desc": "Estrai il colore dominante e una top 10 da una foto. ColorThief arriva da un CDN. L’immagine resta in locale.",
    "reselect": "Un’altra immagine",
    "run": "Estrai di nuovo",
    "copyAll": "Copia classifica",
    "copyCss": "Copia variabili CSS",
    "copyHex": "Copia hex",
    "main": "Dominante",
    "rankTitle": "Top 10 colori",
    "hint": "Clicca un campione o l’hex per copiare. Le quote sono pixel assegnati al colore più vicino.",
    "loadingLib": "Caricamento di ColorThief dal CDN…",
    "copied": "Copiato",
    "msgNotImage": "Scegli un file immagine.",
    "msgFail": "Estrazione non riuscita. Prova un’altra immagine.",
    "msgLib": "Impossibile caricare ColorThief. Controlla la rete e riprova."
  },
  "nl": {
    "title_page": "Dominante kleuren",
    "desc": "Haal de dominante kleur en een top 10 uit een foto. ColorThief komt van een CDN. De afbeelding blijft lokaal.",
    "reselect": "Andere afbeelding",
    "run": "Opnieuw extraheren",
    "copyAll": "Ranking kopiëren",
    "copyCss": "CSS-variabelen kopiëren",
    "copyHex": "Hex kopiëren",
    "main": "Dominant",
    "rankTitle": "Top 10 kleuren",
    "hint": "Klik een staal of hex om te kopiëren. Aandelen zijn pixels bij de dichtstbijzijnde kleur.",
    "loadingLib": "ColorThief laden vanaf CDN…",
    "copied": "Gekopieerd",
    "msgNotImage": "Kies een afbeeldingsbestand.",
    "msgFail": "Extractie mislukt. Probeer een andere afbeelding.",
    "msgLib": "ColorThief kon niet worden geladen. Controleer het netwerk en probeer opnieuw."
  },
  "tr": {
    "title_page": "Görüntü ana renkleri",
    "desc": "Bir fotoğraftan baskın rengi ve ilk 10 rengi çıkarın. ColorThief CDN’den gelir. Görüntü yerelde kalır.",
    "reselect": "Başka görüntü",
    "run": "Yeniden çıkar",
    "copyAll": "Sıralamayı kopyala",
    "copyCss": "CSS değişkenlerini kopyala",
    "copyHex": "Hex kopyala",
    "main": "Baskın",
    "rankTitle": "İlk 10 renk",
    "hint": "Kopyalamak için örneğe veya hex’e tıklayın. Paylar en yakın renge atanan piksellerdir.",
    "loadingLib": "ColorThief CDN’den yükleniyor…",
    "copied": "Kopyalandı",
    "msgNotImage": "Lütfen bir görüntü dosyası seçin.",
    "msgFail": "Çıkarma başarısız. Başka bir görüntü deneyin.",
    "msgLib": "ColorThief yüklenemedi. Ağı kontrol edip tekrar deneyin."
  },
  "vi": {
    "title_page": "Màu chủ đạo ảnh",
    "desc": "Trích màu chủ đạo và top 10 từ ảnh. ColorThief tải từ CDN. Ảnh không được tải lên.",
    "reselect": "Ảnh khác",
    "run": "Trích lại",
    "copyAll": "Sao chép xếp hạng",
    "copyCss": "Sao chép biến CSS",
    "copyHex": "Sao chép hex",
    "main": "Chủ đạo",
    "rankTitle": "Top 10 màu",
    "hint": "Bấm mẫu màu hoặc hex để sao chép. Tỷ lệ là pixel gán cho màu gần nhất.",
    "loadingLib": "Đang tải ColorThief từ CDN…",
    "copied": "Đã sao chép",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Trích xuất thất bại. Thử ảnh khác.",
    "msgLib": "Không tải được ColorThief. Kiểm tra mạng rồi thử lại."
  },
  "th": {
    "title_page": "สีหลักของรูป",
    "desc": "ดึงสีหลักและ 10 อันดับจากรูป ColorThief มาจาก CDN รูปไม่ถูกอัปโหลด",
    "reselect": "เลือกรูปอื่น",
    "run": "ดึงอีกครั้ง",
    "copyAll": "คัดลอกอันดับ",
    "copyCss": "คัดลอกตัวแปร CSS",
    "copyHex": "คัดลอก hex",
    "main": "สีหลัก",
    "rankTitle": "10 สีอันดับต้น",
    "hint": "คลิกตัวอย่างหรือ hex เพื่อคัดลอก สัดส่วนมาจากพิกเซลที่จัดเข้าสีใกล้สุด",
    "loadingLib": "กำลังโหลด ColorThief จาก CDN…",
    "copied": "คัดลอกแล้ว",
    "msgNotImage": "โปรดเลือกไฟล์รูปภาพ",
    "msgFail": "ดึงสีไม่สำเร็จ ลองรูปอื่น",
    "msgLib": "โหลด ColorThief ไม่สำเร็จ ตรวจเครือข่ายแล้วลองใหม่"
  },
  "id": {
    "title_page": "Warna utama gambar",
    "desc": "Ambil warna dominan dan 10 besar dari foto. ColorThief dari CDN. Gambar tetap lokal.",
    "reselect": "Gambar lain",
    "run": "Ekstrak lagi",
    "copyAll": "Salin peringkat",
    "copyCss": "Salin variabel CSS",
    "copyHex": "Salin hex",
    "main": "Dominan",
    "rankTitle": "10 warna teratas",
    "hint": "Klik swatch atau hex untuk menyalin. Persentase dari piksel ke warna terdekat.",
    "loadingLib": "Memuat ColorThief dari CDN…",
    "copied": "Tersalin",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Ekstraksi gagal. Coba gambar lain.",
    "msgLib": "Gagal memuat ColorThief. Periksa jaringan lalu coba lagi."
  },
  "ms": {
    "title_page": "Warna utama imej",
    "desc": "Ekstrak warna dominan dan 10 teratas daripada foto. ColorThief dari CDN. Imej kekal setempat.",
    "reselect": "Imej lain",
    "run": "Ekstrak semula",
    "copyAll": "Salin kedudukan",
    "copyCss": "Salin pemboleh ubah CSS",
    "copyHex": "Salin hex",
    "main": "Dominan",
    "rankTitle": "10 warna teratas",
    "hint": "Klik swatch atau hex untuk menyalin. Peratusan daripada piksel ke warna terdekat.",
    "loadingLib": "Memuatkan ColorThief dari CDN…",
    "copied": "Disalin",
    "msgNotImage": "Sila pilih fail imej.",
    "msgFail": "Ekstrak gagal. Cuba imej lain.",
    "msgLib": "Tidak dapat memuatkan ColorThief. Semak rangkaian dan cuba lagi."
  },
  "pl": {
    "title_page": "Kolory dominujące",
    "desc": "Wyciągnij kolor dominujący i top 10 ze zdjęcia. ColorThief z CDN. Obraz zostaje lokalnie.",
    "reselect": "Inne zdjęcie",
    "run": "Wyodrębnij ponownie",
    "copyAll": "Kopiuj ranking",
    "copyCss": "Kopiuj zmienne CSS",
    "copyHex": "Kopiuj hex",
    "main": "Dominujący",
    "rankTitle": "Top 10 kolorów",
    "hint": "Kliknij próbkę lub hex, aby skopiować. Udziały to piksele przypisane do najbliższego koloru.",
    "loadingLib": "Wczytywanie ColorThief z CDN…",
    "copied": "Skopiowano",
    "msgNotImage": "Wybierz plik obrazu.",
    "msgFail": "Nie udało się wyodrębnić. Spróbuj innego zdjęcia.",
    "msgLib": "Nie udało się wczytać ColorThief. Sprawdź sieć i spróbuj ponownie."
  },
  "uk": {
    "title_page": "Основні кольори зображення",
    "desc": "Витягніть домінантний колір і топ-10 з фото. ColorThief з CDN. Файл не завантажується.",
    "reselect": "Інше фото",
    "run": "Витягти знову",
    "copyAll": "Копіювати рейтинг",
    "copyCss": "Копіювати CSS-змінні",
    "copyHex": "Копіювати hex",
    "main": "Домінанта",
    "rankTitle": "Топ-10 кольорів",
    "hint": "Натисніть зразок або hex, щоб скопіювати. Частки — пікселі, віднесені до найближчого кольору.",
    "loadingLib": "Завантаження ColorThief з CDN…",
    "copied": "Скопійовано",
    "msgNotImage": "Оберіть файл зображення.",
    "msgFail": "Не вдалося витягти кольори. Спробуйте інше фото.",
    "msgLib": "Не вдалося завантажити ColorThief. Перевірте мережу й повторіть."
  },
  "sv": {
    "title_page": "Bildens huvudfärger",
    "desc": "Ta fram den dominerande färgen och en topp 10 från ett foto. ColorThief hämtas från CDN. Bilden stannar lokalt.",
    "reselect": "Annan bild",
    "run": "Extrahera igen",
    "copyAll": "Kopiera ranking",
    "copyCss": "Kopiera CSS-variabler",
    "copyHex": "Kopiera hex",
    "main": "Dominant",
    "rankTitle": "Topp 10 färger",
    "hint": "Klicka en ruta eller hex för att kopiera. Andelar är pixlar till närmaste färg.",
    "loadingLib": "Laddar ColorThief från CDN…",
    "copied": "Kopierat",
    "msgNotImage": "Välj en bildfil.",
    "msgFail": "Kunde inte extrahera. Prova en annan bild.",
    "msgLib": "Kunde inte ladda ColorThief. Kontrollera nätverket och försök igen."
  },
  "zh-TW": {
    "title_page": "圖片主色調",
    "desc": "從圖片擷取主色與前 10 個顏色，依像素占比排序。首次會從 CDN 載入 ColorThief，圖片不上傳。",
    "reselect": "換一張",
    "run": "重新擷取",
    "copyAll": "複製排行",
    "copyCss": "複製 CSS 變數",
    "copyHex": "複製色值",
    "main": "主色",
    "rankTitle": "前 10 顏色排行",
    "hint": "點色塊或色值即可複製 HEX。占比依採樣像素歸到最近色計算。",
    "loadingLib": "正在從 CDN 載入 ColorThief…",
    "copied": "已複製",
    "msgNotImage": "請選擇圖片檔案。",
    "msgFail": "擷取失敗，請換一張圖。",
    "msgLib": "取色函式庫載入失敗，請檢查網路後重試。"
  }
}
</i18n>
