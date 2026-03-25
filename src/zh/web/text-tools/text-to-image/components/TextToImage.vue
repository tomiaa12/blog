<template>
  <div class="tti-wrap">
    <div class="tti-header">
      <h1 class="tti-title">{{ t("title") }}</h1>
      <p class="tti-desc">{{ t("desc") }}</p>
    </div>

    <div class="tti-body">
      <!-- 设置面板 -->
      <div class="tti-settings">
        <div class="tti-field">
          <label class="tti-label">{{ t("textLabel") }}</label>
          <el-input
            v-model="text"
            type="textarea"
            :rows="6"
            :placeholder="t('textPlaceholder')"
            @input="renderCanvas"
          />
        </div>

        <div class="tti-field-row">
          <div class="tti-field tti-field-half">
            <label class="tti-label">{{ t("fontSizeLabel") }} (px)</label>
            <el-input-number
              v-model="fontSize"
              :min="8"
              :max="200"
              @change="renderCanvas"
            />
          </div>
          <div class="tti-field tti-field-half">
            <label class="tti-label">
              {{ t("widthLabel") }} (px)
              <el-checkbox
                v-model="autoWidth"
                class="tti-auto-check"
                @change="handleAutoWidthChange"
                >{{ t("autoWidthLabel") }}</el-checkbox
              >
            </label>
            <el-input-number
              v-if="!autoWidth"
              v-model="imageWidth"
              :min="100"
              :max="2000"
              :step="50"
              @change="renderCanvas"
            />
            <div
              v-else
              class="tti-auto-badge"
            >
              {{ t("autoWidthHint") }}
            </div>
          </div>
        </div>

        <div class="tti-field">
          <label class="tti-label">{{ t("ratioLabel") }}</label>
          <el-select
            v-model="aspectRatio"
            @change="renderCanvas"
          >
            <el-option
              value="auto"
              :label="t('ratioAuto')"
            />
            <el-option
              value="1:1"
              :label="t('ratioSquare')"
            />
            <el-option
              value="4:3"
              :label="t('ratio43')"
            />
            <el-option
              value="16:9"
              :label="t('ratio169')"
            />
            <el-option
              value="3:4"
              :label="t('ratio34')"
            />
            <el-option
              value="9:16"
              :label="t('ratio916')"
            />
            <el-option
              value="custom"
              :label="t('ratioCustom')"
            />
          </el-select>
        </div>

        <div
          v-if="aspectRatio === 'custom'"
          class="tti-field"
        >
          <label class="tti-label">{{ t("heightLabel") }} (px)</label>
          <el-input-number
            v-model="customHeight"
            :min="60"
            :max="4000"
            :step="50"
            @change="renderCanvas"
          />
        </div>

        <div class="tti-field">
          <label class="tti-label">{{ t("fontFamilyLabel") }}</label>
          <el-select
            v-model="fontFamily"
            @change="renderCanvas"
          >
            <el-option
              value="sans-serif"
              :label="t('fontSansSerif')"
            />
            <el-option
              value="serif"
              :label="t('fontSerif')"
            />
            <el-option
              value="monospace"
              :label="t('fontMono')"
            />
            <el-option
              value="'SimHei', '黑体', sans-serif"
              :label="t('fontBlack')"
            />
            <el-option
              value="'SimSun', '宋体', serif"
              :label="t('fontSong')"
            />
          </el-select>
        </div>

        <div class="tti-field-row">
          <div class="tti-field tti-field-half">
            <label class="tti-label">{{ t("textColorLabel") }}</label>
            <div class="tti-color-row">
              <input
                v-model="textColor"
                type="color"
                class="tti-color-picker"
                @input="renderCanvas"
              />
              <span class="tti-color-hex">{{ textColor }}</span>
            </div>
          </div>
          <div class="tti-field tti-field-half">
            <label class="tti-label">{{ t("bgColorLabel") }}</label>
            <div class="tti-color-row">
              <input
                v-model="bgColor"
                type="color"
                class="tti-color-picker"
                :disabled="transparentBg"
                @input="renderCanvas"
              />
              <span class="tti-color-hex">{{
                transparentBg ? t("transparent") : bgColor
              }}</span>
            </div>
          </div>
        </div>

        <div class="tti-field-row">
          <div class="tti-field tti-field-half">
            <label class="tti-label">{{ t("paddingLabel") }} (px)</label>
            <el-input-number
              v-model="padding"
              :min="0"
              :max="200"
              @change="renderCanvas"
            />
          </div>
          <div class="tti-field tti-field-half">
            <label class="tti-label">{{ t("lineHeightLabel") }}</label>
            <el-input-number
              v-model="lineHeight"
              :min="1"
              :max="3"
              :step="0.1"
              :precision="1"
              @change="renderCanvas"
            />
          </div>
        </div>

        <div class="tti-field">
          <label class="tti-label">{{ t("textAlignLabel") }}</label>
          <el-radio-group
            v-model="textAlign"
            @change="renderCanvas"
          >
            <el-radio-button value="left">{{ t("alignLeft") }}</el-radio-button>
            <el-radio-button value="center">{{
              t("alignCenter")
            }}</el-radio-button>
            <el-radio-button value="right">{{
              t("alignRight")
            }}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="tti-field">
          <label class="tti-label">{{ t("styleLabel") }}</label>
          <div class="tti-toggle-row">
            <el-checkbox
              v-model="bold"
              @change="renderCanvas"
              >{{ t("boldLabel") }}</el-checkbox
            >
            <el-checkbox
              v-model="italic"
              @change="renderCanvas"
              >{{ t("italicLabel") }}</el-checkbox
            >
            <el-checkbox
              v-model="transparentBg"
              @change="renderCanvas"
              >{{ t("transparentLabel") }}</el-checkbox
            >
          </div>
        </div>

        <div class="tti-actions">
          <el-button
            size="large"
            @click="resetAll"
          >
            {{ t("resetBtn") }}
          </el-button>
        </div>
      </div>

      <!-- 预览面板 -->
      <div
        ref="previewRef"
        class="tti-preview"
      >
        <div class="tti-preview-label">{{ t("previewLabel") }}</div>
        <canvas
          ref="canvasRef"
          class="tti-canvas"
        />
        <div class="tti-actions">
          <el-button
            type="primary"
            size="large"
            @click="download"
          >
            {{ t("downloadBtn") }}
          </el-button>
          <el-button
            size="large"
            :disabled="!canCopy"
            @click="copyImage"
          >
            {{ copyLabel }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const text = ref("人生若只如初见，\n何事秋风悲画扇。")
const fontSize = ref(32)
const fontFamily = ref("sans-serif")
const bold = ref(false)
const italic = ref(false)
const textColor = ref("#333333")
const bgColor = ref("#ffffff")
const transparentBg = ref(false)
const padding = ref(32)
const imageWidth = ref(600)
const lineHeight = ref(1.6)
const textAlign = ref<"left" | "center" | "right">("left")
const aspectRatio = ref("auto")
const customHeight = ref(400)
const autoWidth = ref(false)

const copyLabel = ref(t("copyImageBtn"))
const canCopy = ref(typeof ClipboardItem !== "undefined")

function getFontStr(): string {
  const parts: string[] = []
  if (italic.value) parts.push("italic")
  if (bold.value) parts.push("bold")
  parts.push(`${fontSize.value}px`)
  parts.push(fontFamily.value)
  return parts.join(" ")
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number
): string[] {
  const paragraphs = rawText.split("\n")
  const result: string[] = []
  for (const para of paragraphs) {
    if (para === "") {
      result.push("")
      continue
    }
    let line = ""
    for (const char of [...para]) {
      const test = line + char
      if (ctx.measureText(test).width > maxWidth && line !== "") {
        result.push(line)
        line = char
      } else {
        line = test
      }
    }
    if (line) result.push(line)
  }
  return result
}

function getFixedHeight(w: number, contentH: number): number {
  switch (aspectRatio.value) {
    case "1:1":
      return w
    case "4:3":
      return Math.round((w * 3) / 4)
    case "16:9":
      return Math.round((w * 9) / 16)
    case "3:4":
      return Math.round((w * 4) / 3)
    case "9:16":
      return Math.round((w * 16) / 9)
    case "custom":
      return Math.max(customHeight.value, 60)
    default:
      return Math.max(contentH, 60)
  }
}

function renderCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const w = Math.max(
    autoWidth.value
      ? previewRef.value?.clientWidth ?? imageWidth.value
      : imageWidth.value,
    100
  )
  const pad = padding.value
  const lh = Math.round(fontSize.value * lineHeight.value)
  const font = getFontStr()

  ctx.font = font
  const maxW = Math.max(w - pad * 2, 10)
  const lines = wrapText(ctx, text.value || " ", maxW)
  const contentH = lines.length * lh + pad * 2
  const h = getFixedHeight(w, contentH)

  canvas.width = w
  canvas.height = h

  if (transparentBg.value) {
    ctx.clearRect(0, 0, w, h)
  } else {
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, w, h)
  }

  ctx.font = font
  ctx.fillStyle = textColor.value
  ctx.textBaseline = "top"
  ctx.textAlign = textAlign.value as CanvasTextAlign

  let x = pad
  if (textAlign.value === "center") x = w / 2
  else if (textAlign.value === "right") x = w - pad

  lines.forEach((line, i) => {
    ctx.fillText(line, x, pad + i * lh)
  })
}

function handleAutoWidthChange() {
  if (autoWidth.value && previewRef.value) {
    resizeObserver = new ResizeObserver(() => renderCanvas())
    resizeObserver.observe(previewRef.value)
  } else {
    resizeObserver?.disconnect()
    resizeObserver = null
  }
  renderCanvas()
}

function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  const url = canvas.toDataURL("image/png")
  const a = document.createElement("a")
  a.href = url
  a.download = "text-to-image.png"
  a.click()
}

function copyImage() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.toBlob(async blob => {
    if (!blob) return
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
      copyLabel.value = t("copySuccess")
      setTimeout(() => {
        copyLabel.value = t("copyImageBtn")
      }, 2000)
    } catch {
      ElMessage.error(t("copyFail"))
    }
  })
}

function resetAll() {
  text.value = "人生若只如初见，\n何事秋风悲画扇。"
  fontSize.value = 32
  fontFamily.value = "sans-serif"
  bold.value = false
  italic.value = false
  textColor.value = "#333333"
  bgColor.value = "#ffffff"
  transparentBg.value = false
  padding.value = 32
  imageWidth.value = 600
  lineHeight.value = 1.6
  textAlign.value = "left"
  aspectRatio.value = "auto"
  customHeight.value = 400
  autoWidth.value = false
  resizeObserver?.disconnect()
  resizeObserver = null
  renderCanvas()
}

onMounted(() => {
  renderCanvas()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<i18n lang="json">
{
  "zh": {
    "title": "文字转图片",
    "desc": "将文字内容生成可下载的 PNG 图片，支持自定义字体、颜色、背景和对齐方式。",
    "textLabel": "文字内容",
    "textPlaceholder": "输入要转换为图片的文字...",
    "fontSizeLabel": "字号",
    "widthLabel": "图片宽度",
    "autoWidthLabel": "自适应",
    "autoWidthHint": "跟随预览区宽度",
    "ratioLabel": "高度比例",
    "ratioAuto": "自适应高度",
    "ratioSquare": "正方形 1:1",
    "ratio43": "横向 4:3",
    "ratio169": "宽屏 16:9",
    "ratio34": "竖向 3:4",
    "ratio916": "竖版 9:16",
    "ratioCustom": "自定义高度",
    "heightLabel": "图片高度",
    "fontFamilyLabel": "字体",
    "fontSansSerif": "无衬线体",
    "fontSerif": "衬线体",
    "fontMono": "等宽体",
    "fontBlack": "黑体",
    "fontSong": "宋体",
    "textColorLabel": "文字颜色",
    "bgColorLabel": "背景颜色",
    "transparent": "透明",
    "paddingLabel": "内边距",
    "lineHeightLabel": "行高",
    "textAlignLabel": "对齐方式",
    "alignLeft": "左对齐",
    "alignCenter": "居中",
    "alignRight": "右对齐",
    "styleLabel": "样式",
    "boldLabel": "粗体",
    "italicLabel": "斜体",
    "transparentLabel": "透明背景",
    "previewLabel": "预览",
    "downloadBtn": "下载 PNG",
    "copyImageBtn": "复制图片",
    "copySuccess": "已复制！",
    "copyFail": "复制失败",
    "resetBtn": "重置"
  },
  "en": {
    "title": "Text to Image",
    "desc": "Convert text to a downloadable PNG image. Customize font, color, background, and alignment.",
    "textLabel": "Text",
    "textPlaceholder": "Enter text to convert to image...",
    "fontSizeLabel": "Font size",
    "widthLabel": "Image width",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Fits preview area width",
    "ratioLabel": "Height ratio",
    "ratioAuto": "Auto height",
    "ratioSquare": "Square 1:1",
    "ratio43": "Landscape 4:3",
    "ratio169": "Widescreen 16:9",
    "ratio34": "Portrait 3:4",
    "ratio916": "Portrait 9:16",
    "ratioCustom": "Custom height",
    "heightLabel": "Image height",
    "fontFamilyLabel": "Font",
    "fontSansSerif": "Sans-serif",
    "fontSerif": "Serif",
    "fontMono": "Monospace",
    "fontBlack": "Heiti (Black)",
    "fontSong": "Songti (Song)",
    "textColorLabel": "Text color",
    "bgColorLabel": "Background color",
    "transparent": "Transparent",
    "paddingLabel": "Padding",
    "lineHeightLabel": "Line height",
    "textAlignLabel": "Alignment",
    "alignLeft": "Left",
    "alignCenter": "Center",
    "alignRight": "Right",
    "styleLabel": "Style",
    "boldLabel": "Bold",
    "italicLabel": "Italic",
    "transparentLabel": "Transparent BG",
    "previewLabel": "Preview",
    "downloadBtn": "Download PNG",
    "copyImageBtn": "Copy image",
    "copySuccess": "Copied!",
    "copyFail": "Copy failed",
    "resetBtn": "Reset"
  },
  "ja": {
    "title": "テキストを画像に変換",
    "desc": "テキストをダウンロード可能な PNG 画像に変換します。フォント・色・背景・配置をカスタマイズできます。",
    "textLabel": "テキスト",
    "textPlaceholder": "画像に変換するテキストを入力...",
    "fontSizeLabel": "フォントサイズ",
    "widthLabel": "画像幅",
    "autoWidthLabel": "自動",
    "autoWidthHint": "プレビュー幅に合わせる",
    "ratioLabel": "高さ比率",
    "ratioAuto": "自動",
    "ratioSquare": "正方形 1:1",
    "ratio43": "横向き 4:3",
    "ratio169": "ワイド 16:9",
    "ratio34": "縦向き 3:4",
    "ratio916": "縦長 9:16",
    "ratioCustom": "カスタム",
    "heightLabel": "画像高さ",
    "fontFamilyLabel": "フォント",
    "fontSansSerif": "ゴシック体",
    "fontSerif": "明朝体",
    "fontMono": "等幅",
    "fontBlack": "黒体",
    "fontSong": "宋体",
    "textColorLabel": "文字色",
    "bgColorLabel": "背景色",
    "transparent": "透明",
    "paddingLabel": "余白",
    "lineHeightLabel": "行間",
    "textAlignLabel": "揃え",
    "alignLeft": "左揃え",
    "alignCenter": "中央揃え",
    "alignRight": "右揃え",
    "styleLabel": "スタイル",
    "boldLabel": "太字",
    "italicLabel": "斜体",
    "transparentLabel": "透明背景",
    "previewLabel": "プレビュー",
    "downloadBtn": "PNG ダウンロード",
    "copyImageBtn": "画像をコピー",
    "copySuccess": "コピーしました！",
    "copyFail": "コピー失敗",
    "resetBtn": "リセット"
  },
  "ko": {
    "title": "텍스트를 이미지로 변환",
    "desc": "텍스트를 다운로드 가능한 PNG 이미지로 변환합니다. 폰트, 색상, 배경, 정렬을 커스터마이즈하세요.",
    "textLabel": "텍스트",
    "textPlaceholder": "이미지로 변환할 텍스트를 입력하세요...",
    "fontSizeLabel": "글자 크기",
    "widthLabel": "이미지 너비",
    "autoWidthLabel": "자동",
    "autoWidthHint": "미리보기 너비에 맞춤",
    "ratioAuto": "자동",
    "ratioSquare": "정사각형 1:1",
    "ratio43": "가로 4:3",
    "ratio169": "와이드 16:9",
    "ratio34": "세로 3:4",
    "ratio916": "세로 9:16",
    "ratioCustom": "사용자 정의",
    "heightLabel": "이미지 높이",
    "fontFamilyLabel": "폰트",
    "fontSansSerif": "고딕체",
    "fontSerif": "명조체",
    "fontMono": "등폭",
    "fontBlack": "흑체",
    "fontSong": "송체",
    "textColorLabel": "글자 색상",
    "bgColorLabel": "배경 색상",
    "transparent": "투명",
    "paddingLabel": "여백",
    "lineHeightLabel": "줄 간격",
    "textAlignLabel": "정렬",
    "alignLeft": "왼쪽",
    "alignCenter": "가운데",
    "alignRight": "오른쪽",
    "styleLabel": "스타일",
    "boldLabel": "굵게",
    "italicLabel": "기울임",
    "transparentLabel": "투명 배경",
    "previewLabel": "미리보기",
    "downloadBtn": "PNG 다운로드",
    "copyImageBtn": "이미지 복사",
    "copySuccess": "복사됨!",
    "copyFail": "복사 실패",
    "resetBtn": "초기화"
  },
  "fr": {
    "title": "Texte en image",
    "desc": "Convertissez du texte en image PNG téléchargeable. Personnalisez la police, la couleur, le fond et l'alignement.",
    "textLabel": "Texte",
    "textPlaceholder": "Saisissez le texte à convertir en image...",
    "fontSizeLabel": "Taille de police",
    "widthLabel": "Largeur de l'image",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "S'adapte à la largeur",
    "ratioAuto": "Hauteur auto",
    "ratioSquare": "Carré 1:1",
    "ratio43": "Paysage 4:3",
    "ratio169": "Écran large 16:9",
    "ratio34": "Portrait 3:4",
    "ratio916": "Portrait 9:16",
    "ratioCustom": "Hauteur personnalisée",
    "heightLabel": "Hauteur de l'image",
    "fontFamilyLabel": "Police",
    "fontSansSerif": "Sans-sérif",
    "fontSerif": "Sérif",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Couleur du texte",
    "bgColorLabel": "Couleur de fond",
    "transparent": "Transparent",
    "paddingLabel": "Marge interne",
    "lineHeightLabel": "Interligne",
    "textAlignLabel": "Alignement",
    "alignLeft": "Gauche",
    "alignCenter": "Centre",
    "alignRight": "Droite",
    "styleLabel": "Style",
    "boldLabel": "Gras",
    "italicLabel": "Italique",
    "transparentLabel": "Fond transparent",
    "previewLabel": "Aperçu",
    "downloadBtn": "Télécharger PNG",
    "copyImageBtn": "Copier l'image",
    "copySuccess": "Copié !",
    "copyFail": "Échec de la copie",
    "resetBtn": "Réinitialiser"
  },
  "de": {
    "title": "Text zu Bild",
    "desc": "Text in ein herunterladbares PNG-Bild umwandeln. Schriftart, Farbe, Hintergrund und Ausrichtung anpassen.",
    "textLabel": "Text",
    "textPlaceholder": "Text zum Konvertieren eingeben...",
    "fontSizeLabel": "Schriftgröße",
    "widthLabel": "Bildbreite",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Passt sich der Breite an",
    "ratioAuto": "Automatische Höhe",
    "ratioSquare": "Quadrat 1:1",
    "ratio43": "Querformat 4:3",
    "ratio169": "Breitbild 16:9",
    "ratio34": "Hochformat 3:4",
    "ratio916": "Hochformat 9:16",
    "ratioCustom": "Benutzerdefiniert",
    "heightLabel": "Bildhöhe",
    "fontFamilyLabel": "Schriftart",
    "fontSansSerif": "Serifenlos",
    "fontSerif": "Serif",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Textfarbe",
    "bgColorLabel": "Hintergrundfarbe",
    "transparent": "Transparent",
    "paddingLabel": "Innenabstand",
    "lineHeightLabel": "Zeilenhöhe",
    "textAlignLabel": "Ausrichtung",
    "alignLeft": "Links",
    "alignCenter": "Mitte",
    "alignRight": "Rechts",
    "styleLabel": "Stil",
    "boldLabel": "Fett",
    "italicLabel": "Kursiv",
    "transparentLabel": "Transparenter Hintergrund",
    "previewLabel": "Vorschau",
    "downloadBtn": "PNG herunterladen",
    "copyImageBtn": "Bild kopieren",
    "copySuccess": "Kopiert!",
    "copyFail": "Kopieren fehlgeschlagen",
    "resetBtn": "Zurücksetzen"
  },
  "es": {
    "title": "Texto a imagen",
    "desc": "Convierte texto en una imagen PNG descargable. Personaliza fuente, color, fondo y alineación.",
    "textLabel": "Texto",
    "textPlaceholder": "Ingresa el texto a convertir en imagen...",
    "fontSizeLabel": "Tamaño de fuente",
    "widthLabel": "Ancho de imagen",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Se adapta al ancho",
    "ratioAuto": "Alto automático",
    "ratioSquare": "Cuadrado 1:1",
    "ratio43": "Horizontal 4:3",
    "ratio169": "Panorámico 16:9",
    "ratio34": "Vertical 3:4",
    "ratio916": "Vertical 9:16",
    "ratioCustom": "Alto personalizado",
    "heightLabel": "Alto de imagen",
    "fontFamilyLabel": "Fuente",
    "fontSansSerif": "Sin serifa",
    "fontSerif": "Serifa",
    "fontMono": "Monoespaciada",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Color de texto",
    "bgColorLabel": "Color de fondo",
    "transparent": "Transparente",
    "paddingLabel": "Relleno",
    "lineHeightLabel": "Altura de línea",
    "textAlignLabel": "Alineación",
    "alignLeft": "Izquierda",
    "alignCenter": "Centro",
    "alignRight": "Derecha",
    "styleLabel": "Estilo",
    "boldLabel": "Negrita",
    "italicLabel": "Cursiva",
    "transparentLabel": "Fondo transparente",
    "previewLabel": "Vista previa",
    "downloadBtn": "Descargar PNG",
    "copyImageBtn": "Copiar imagen",
    "copySuccess": "¡Copiado!",
    "copyFail": "Error al copiar",
    "resetBtn": "Restablecer"
  },
  "pt": {
    "title": "Texto para imagem",
    "desc": "Converta texto em uma imagem PNG para download. Personalize fonte, cor, fundo e alinhamento.",
    "textLabel": "Texto",
    "textPlaceholder": "Insira o texto para converter em imagem...",
    "fontSizeLabel": "Tamanho da fonte",
    "widthLabel": "Largura da imagem",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Adapta à largura",
    "ratioAuto": "Altura automática",
    "ratioSquare": "Quadrado 1:1",
    "ratio43": "Paisagem 4:3",
    "ratio169": "Panorâmico 16:9",
    "ratio34": "Retrato 3:4",
    "ratio916": "Retrato 9:16",
    "ratioCustom": "Altura personalizada",
    "heightLabel": "Altura da imagem",
    "fontFamilyLabel": "Fonte",
    "fontSansSerif": "Sem serifa",
    "fontSerif": "Serifa",
    "fontMono": "Monoespaçada",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Cor do texto",
    "bgColorLabel": "Cor de fundo",
    "transparent": "Transparente",
    "paddingLabel": "Recuo",
    "lineHeightLabel": "Altura da linha",
    "textAlignLabel": "Alinhamento",
    "alignLeft": "Esquerda",
    "alignCenter": "Centro",
    "alignRight": "Direita",
    "styleLabel": "Estilo",
    "boldLabel": "Negrito",
    "italicLabel": "Itálico",
    "transparentLabel": "Fundo transparente",
    "previewLabel": "Pré-visualização",
    "downloadBtn": "Baixar PNG",
    "copyImageBtn": "Copiar imagem",
    "copySuccess": "Copiado!",
    "copyFail": "Falha ao copiar",
    "resetBtn": "Redefinir"
  },
  "ru": {
    "title": "Текст в изображение",
    "desc": "Преобразуйте текст в загружаемый PNG-файл. Настройте шрифт, цвет, фон и выравнивание.",
    "textLabel": "Текст",
    "textPlaceholder": "Введите текст для преобразования в изображение...",
    "fontSizeLabel": "Размер шрифта",
    "widthLabel": "Ширина изображения",
    "autoWidthLabel": "Авто",
    "autoWidthHint": "По ширине области",
    "ratioAuto": "Автовысота",
    "ratioSquare": "Квадрат 1:1",
    "ratio43": "Горизонтальное 4:3",
    "ratio169": "Широкоформатное 16:9",
    "ratio34": "Вертикальное 3:4",
    "ratio916": "Вертикальное 9:16",
    "ratioCustom": "Произвольная высота",
    "heightLabel": "Высота изображения",
    "fontFamilyLabel": "Шрифт",
    "fontSansSerif": "Без засечек",
    "fontSerif": "С засечками",
    "fontMono": "Моноширинный",
    "fontBlack": "Хэйти",
    "fontSong": "Сунти",
    "textColorLabel": "Цвет текста",
    "bgColorLabel": "Цвет фона",
    "transparent": "Прозрачный",
    "paddingLabel": "Отступ",
    "lineHeightLabel": "Межстрочный интервал",
    "textAlignLabel": "Выравнивание",
    "alignLeft": "По левому краю",
    "alignCenter": "По центру",
    "alignRight": "По правому краю",
    "styleLabel": "Стиль",
    "boldLabel": "Жирный",
    "italicLabel": "Курсив",
    "transparentLabel": "Прозрачный фон",
    "previewLabel": "Предпросмотр",
    "downloadBtn": "Скачать PNG",
    "copyImageBtn": "Копировать изображение",
    "copySuccess": "Скопировано!",
    "copyFail": "Ошибка копирования",
    "resetBtn": "Сбросить"
  },
  "ar": {
    "title": "النص إلى صورة",
    "desc": "حوّل النص إلى صورة PNG قابلة للتنزيل. خصّص الخط واللون والخلفية والمحاذاة.",
    "textLabel": "النص",
    "textPlaceholder": "أدخل النص لتحويله إلى صورة...",
    "fontSizeLabel": "حجم الخط",
    "widthLabel": "عرض الصورة",
    "autoWidthLabel": "تلقائي",
    "autoWidthHint": "يتكيف مع العرض",
    "ratioAuto": "ارتفاع تلقائي",
    "ratioSquare": "مربع 1:1",
    "ratio43": "أفقي 4:3",
    "ratio169": "عريض 16:9",
    "ratio34": "عمودي 3:4",
    "ratio916": "عمودي 9:16",
    "ratioCustom": "ارتفاع مخصص",
    "heightLabel": "ارتفاع الصورة",
    "fontFamilyLabel": "الخط",
    "fontSansSerif": "بدون ذيول",
    "fontSerif": "مع ذيول",
    "fontMono": "أحادي المسافة",
    "fontBlack": "هيتي",
    "fontSong": "سونغتي",
    "textColorLabel": "لون النص",
    "bgColorLabel": "لون الخلفية",
    "transparent": "شفاف",
    "paddingLabel": "الحشو",
    "lineHeightLabel": "ارتفاع السطر",
    "textAlignLabel": "المحاذاة",
    "alignLeft": "يسار",
    "alignCenter": "وسط",
    "alignRight": "يمين",
    "styleLabel": "النمط",
    "boldLabel": "عريض",
    "italicLabel": "مائل",
    "transparentLabel": "خلفية شفافة",
    "previewLabel": "معاينة",
    "downloadBtn": "تنزيل PNG",
    "copyImageBtn": "نسخ الصورة",
    "copySuccess": "تم النسخ!",
    "copyFail": "فشل النسخ",
    "resetBtn": "إعادة تعيين"
  },
  "hi": {
    "title": "टेक्स्ट से इमेज",
    "desc": "टेक्स्ट को डाउनलोड योग्य PNG इमेज में बदलें। फ़ॉन्ट, रंग, बैकग्राउंड और अलाइनमेंट कस्टमाइज़ करें।",
    "textLabel": "टेक्स्ट",
    "textPlaceholder": "इमेज में बदलने के लिए टेक्स्ट दर्ज करें...",
    "fontSizeLabel": "फ़ॉन्ट आकार",
    "widthLabel": "इमेज चौड़ाई",
    "autoWidthLabel": "स्वतः",
    "autoWidthHint": "प्रीव्यू की चौड़ाई के अनुसार",
    "ratioAuto": "स्वचालित ऊंचाई",
    "ratioSquare": "वर्गाकार 1:1",
    "ratio43": "क्षैतिज 4:3",
    "ratio169": "वाइडस्क्रीन 16:9",
    "ratio34": "लंबवत 3:4",
    "ratio916": "लंबवत 9:16",
    "ratioCustom": "कस्टम ऊंचाई",
    "heightLabel": "इमेज ऊंचाई",
    "fontFamilyLabel": "फ़ॉन्ट",
    "fontSansSerif": "सैन्स-सेरिफ़",
    "fontSerif": "सेरिफ़",
    "fontMono": "मोनोस्पेस",
    "fontBlack": "हेइती",
    "fontSong": "सोंगटी",
    "textColorLabel": "टेक्स्ट रंग",
    "bgColorLabel": "बैकग्राउंड रंग",
    "transparent": "पारदर्शी",
    "paddingLabel": "पैडिंग",
    "lineHeightLabel": "लाइन ऊंचाई",
    "textAlignLabel": "अलाइनमेंट",
    "alignLeft": "बाएं",
    "alignCenter": "मध्य",
    "alignRight": "दाएं",
    "styleLabel": "स्टाइल",
    "boldLabel": "बोल्ड",
    "italicLabel": "इटैलिक",
    "transparentLabel": "पारदर्शी बैकग्राउंड",
    "previewLabel": "प्रीव्यू",
    "downloadBtn": "PNG डाउनलोड",
    "copyImageBtn": "इमेज कॉपी",
    "copySuccess": "कॉपी हो गया!",
    "copyFail": "कॉपी विफल",
    "resetBtn": "रीसेट"
  },
  "it": {
    "title": "Testo in immagine",
    "desc": "Converti testo in un'immagine PNG scaricabile. Personalizza font, colore, sfondo e allineamento.",
    "textLabel": "Testo",
    "textPlaceholder": "Inserisci il testo da convertire in immagine...",
    "fontSizeLabel": "Dimensione font",
    "widthLabel": "Larghezza immagine",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Si adatta alla larghezza",
    "ratioAuto": "Altezza automatica",
    "ratioSquare": "Quadrato 1:1",
    "ratio43": "Paesaggio 4:3",
    "ratio169": "Widescreen 16:9",
    "ratio34": "Ritratto 3:4",
    "ratio916": "Ritratto 9:16",
    "ratioCustom": "Altezza personalizzata",
    "heightLabel": "Altezza immagine",
    "fontFamilyLabel": "Font",
    "fontSansSerif": "Sans-serif",
    "fontSerif": "Serif",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Colore testo",
    "bgColorLabel": "Colore sfondo",
    "transparent": "Trasparente",
    "paddingLabel": "Spaziatura interna",
    "lineHeightLabel": "Altezza riga",
    "textAlignLabel": "Allineamento",
    "alignLeft": "Sinistra",
    "alignCenter": "Centro",
    "alignRight": "Destra",
    "styleLabel": "Stile",
    "boldLabel": "Grassetto",
    "italicLabel": "Corsivo",
    "transparentLabel": "Sfondo trasparente",
    "previewLabel": "Anteprima",
    "downloadBtn": "Scarica PNG",
    "copyImageBtn": "Copia immagine",
    "copySuccess": "Copiato!",
    "copyFail": "Copia fallita",
    "resetBtn": "Reimposta"
  },
  "nl": {
    "title": "Tekst naar afbeelding",
    "desc": "Converteer tekst naar een downloadbare PNG-afbeelding. Pas lettertype, kleur, achtergrond en uitlijning aan.",
    "textLabel": "Tekst",
    "textPlaceholder": "Voer tekst in om te converteren naar afbeelding...",
    "fontSizeLabel": "Lettergrootte",
    "widthLabel": "Afbeeldingsbreedte",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Past zich aan de breedte aan",
    "ratioAuto": "Automatische hoogte",
    "ratioSquare": "Vierkant 1:1",
    "ratio43": "Liggend 4:3",
    "ratio169": "Breedbeeld 16:9",
    "ratio34": "Staand 3:4",
    "ratio916": "Staand 9:16",
    "ratioCustom": "Aangepaste hoogte",
    "heightLabel": "Afbeeldingshoogte",
    "fontFamilyLabel": "Lettertype",
    "fontSansSerif": "Schreefloos",
    "fontSerif": "Schreef",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Tekstkleur",
    "bgColorLabel": "Achtergrondkleur",
    "transparent": "Transparant",
    "paddingLabel": "Opvulling",
    "lineHeightLabel": "Regelafstand",
    "textAlignLabel": "Uitlijning",
    "alignLeft": "Links",
    "alignCenter": "Midden",
    "alignRight": "Rechts",
    "styleLabel": "Stijl",
    "boldLabel": "Vet",
    "italicLabel": "Cursief",
    "transparentLabel": "Transparante achtergrond",
    "previewLabel": "Voorbeeld",
    "downloadBtn": "PNG downloaden",
    "copyImageBtn": "Afbeelding kopiëren",
    "copySuccess": "Gekopieerd!",
    "copyFail": "Kopiëren mislukt",
    "resetBtn": "Opnieuw instellen"
  },
  "tr": {
    "title": "Metni görüntüye dönüştür",
    "desc": "Metni indirilebilir bir PNG görüntüsüne dönüştürün. Yazı tipi, renk, arka plan ve hizalamayı özelleştirin.",
    "textLabel": "Metin",
    "textPlaceholder": "Görüntüye dönüştürülecek metni girin...",
    "fontSizeLabel": "Yazı tipi boyutu",
    "widthLabel": "Görüntü genişliği",
    "autoWidthLabel": "Otomatik",
    "autoWidthHint": "Genişliğe uyar",
    "ratioAuto": "Otomatik yükseklik",
    "ratioSquare": "Kare 1:1",
    "ratio43": "Yatay 4:3",
    "ratio169": "Geniş ekran 16:9",
    "ratio34": "Dikey 3:4",
    "ratio916": "Dikey 9:16",
    "ratioCustom": "Özel yükseklik",
    "heightLabel": "Görüntü yüksekliği",
    "fontFamilyLabel": "Yazı tipi",
    "fontSansSerif": "Serifsiz",
    "fontSerif": "Serifli",
    "fontMono": "Sabit genişlik",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Metin rengi",
    "bgColorLabel": "Arka plan rengi",
    "transparent": "Şeffaf",
    "paddingLabel": "Dolgu",
    "lineHeightLabel": "Satır yüksekliği",
    "textAlignLabel": "Hizalama",
    "alignLeft": "Sol",
    "alignCenter": "Orta",
    "alignRight": "Sağ",
    "styleLabel": "Stil",
    "boldLabel": "Kalın",
    "italicLabel": "İtalik",
    "transparentLabel": "Şeffaf arka plan",
    "previewLabel": "Önizleme",
    "downloadBtn": "PNG indir",
    "copyImageBtn": "Görüntüyü kopyala",
    "copySuccess": "Kopyalandı!",
    "copyFail": "Kopyalama başarısız",
    "resetBtn": "Sıfırla"
  },
  "vi": {
    "title": "Chuyển văn bản thành ảnh",
    "desc": "Chuyển đổi văn bản thành ảnh PNG có thể tải xuống. Tùy chỉnh phông chữ, màu sắc, nền và căn chỉnh.",
    "textLabel": "Văn bản",
    "textPlaceholder": "Nhập văn bản để chuyển thành ảnh...",
    "fontSizeLabel": "Cỡ chữ",
    "widthLabel": "Chiều rộng ảnh",
    "autoWidthLabel": "Tự động",
    "autoWidthHint": "Theo chiều rộng vùng xem",
    "ratioAuto": "Chiều cao tự động",
    "ratioSquare": "Vuông 1:1",
    "ratio43": "Ngang 4:3",
    "ratio169": "Màn hình rộng 16:9",
    "ratio34": "Dọc 3:4",
    "ratio916": "Dọc 9:16",
    "ratioCustom": "Tùy chỉnh chiều cao",
    "heightLabel": "Chiều cao ảnh",
    "fontFamilyLabel": "Phông chữ",
    "fontSansSerif": "Không chân",
    "fontSerif": "Có chân",
    "fontMono": "Đơn cách",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Màu chữ",
    "bgColorLabel": "Màu nền",
    "transparent": "Trong suốt",
    "paddingLabel": "Khoảng đệm",
    "lineHeightLabel": "Chiều cao dòng",
    "textAlignLabel": "Căn chỉnh",
    "alignLeft": "Trái",
    "alignCenter": "Giữa",
    "alignRight": "Phải",
    "styleLabel": "Kiểu chữ",
    "boldLabel": "In đậm",
    "italicLabel": "In nghiêng",
    "transparentLabel": "Nền trong suốt",
    "previewLabel": "Xem trước",
    "downloadBtn": "Tải PNG",
    "copyImageBtn": "Sao chép ảnh",
    "copySuccess": "Đã sao chép!",
    "copyFail": "Sao chép thất bại",
    "resetBtn": "Đặt lại"
  },
  "th": {
    "title": "แปลงข้อความเป็นรูปภาพ",
    "desc": "แปลงข้อความเป็นรูปภาพ PNG ที่ดาวน์โหลดได้ ปรับแต่งแบบอักษร สี พื้นหลัง และการจัดวาง",
    "textLabel": "ข้อความ",
    "textPlaceholder": "ป้อนข้อความที่ต้องการแปลงเป็นรูปภาพ...",
    "fontSizeLabel": "ขนาดตัวอักษร",
    "widthLabel": "ความกว้างรูปภาพ",
    "autoWidthLabel": "อัตโนมัติ",
    "autoWidthHint": "ตามความกว้างพื้นที่",
    "ratioAuto": "ความสูงอัตโนมัติ",
    "ratioSquare": "สี่เหลี่ยมจัตุรัส 1:1",
    "ratio43": "แนวนอน 4:3",
    "ratio169": "จอไวด์ 16:9",
    "ratio34": "แนวตั้ง 3:4",
    "ratio916": "แนวตั้ง 9:16",
    "ratioCustom": "ความสูงกำหนดเอง",
    "heightLabel": "ความสูงรูปภาพ",
    "fontFamilyLabel": "แบบอักษร",
    "fontSansSerif": "ไม่มีเส้นปลาย",
    "fontSerif": "มีเส้นปลาย",
    "fontMono": "ขนาดคงที่",
    "fontBlack": "เฮ่ยถี่",
    "fontSong": "ซ่งถี่",
    "textColorLabel": "สีข้อความ",
    "bgColorLabel": "สีพื้นหลัง",
    "transparent": "โปร่งใส",
    "paddingLabel": "ระยะห่างภายใน",
    "lineHeightLabel": "ความสูงบรรทัด",
    "textAlignLabel": "การจัดวาง",
    "alignLeft": "ซ้าย",
    "alignCenter": "กลาง",
    "alignRight": "ขวา",
    "styleLabel": "สไตล์",
    "boldLabel": "ตัวหนา",
    "italicLabel": "ตัวเอียง",
    "transparentLabel": "พื้นหลังโปร่งใส",
    "previewLabel": "ตัวอย่าง",
    "downloadBtn": "ดาวน์โหลด PNG",
    "copyImageBtn": "คัดลอกรูปภาพ",
    "copySuccess": "คัดลอกแล้ว!",
    "copyFail": "คัดลอกล้มเหลว",
    "resetBtn": "รีเซ็ต"
  },
  "id": {
    "title": "Teks ke gambar",
    "desc": "Ubah teks menjadi gambar PNG yang dapat diunduh. Sesuaikan font, warna, latar belakang, dan perataan.",
    "textLabel": "Teks",
    "textPlaceholder": "Masukkan teks untuk dikonversi menjadi gambar...",
    "fontSizeLabel": "Ukuran font",
    "widthLabel": "Lebar gambar",
    "autoWidthLabel": "Otomatis",
    "autoWidthHint": "Mengikuti lebar area",
    "ratioAuto": "Tinggi otomatis",
    "ratioSquare": "Persegi 1:1",
    "ratio43": "Lanskap 4:3",
    "ratio169": "Layar lebar 16:9",
    "ratio34": "Potret 3:4",
    "ratio916": "Potret 9:16",
    "ratioCustom": "Tinggi kustom",
    "heightLabel": "Tinggi gambar",
    "fontFamilyLabel": "Font",
    "fontSansSerif": "Sans-serif",
    "fontSerif": "Serif",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Warna teks",
    "bgColorLabel": "Warna latar belakang",
    "transparent": "Transparan",
    "paddingLabel": "Bantalan",
    "lineHeightLabel": "Tinggi baris",
    "textAlignLabel": "Perataan",
    "alignLeft": "Kiri",
    "alignCenter": "Tengah",
    "alignRight": "Kanan",
    "styleLabel": "Gaya",
    "boldLabel": "Tebal",
    "italicLabel": "Miring",
    "transparentLabel": "Latar belakang transparan",
    "previewLabel": "Pratinjau",
    "downloadBtn": "Unduh PNG",
    "copyImageBtn": "Salin gambar",
    "copySuccess": "Disalin!",
    "copyFail": "Gagal menyalin",
    "resetBtn": "Atur ulang"
  },
  "ms": {
    "title": "Teks ke gambar",
    "desc": "Tukar teks kepada imej PNG yang boleh dimuat turun. Sesuaikan fon, warna, latar belakang dan penjajaran.",
    "textLabel": "Teks",
    "textPlaceholder": "Masukkan teks untuk ditukar kepada gambar...",
    "fontSizeLabel": "Saiz fon",
    "widthLabel": "Lebar imej",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Ikut lebar kawasan",
    "ratioAuto": "Tinggi auto",
    "ratioSquare": "Segi empat 1:1",
    "ratio43": "Landskap 4:3",
    "ratio169": "Skrin lebar 16:9",
    "ratio34": "Potret 3:4",
    "ratio916": "Potret 9:16",
    "ratioCustom": "Tinggi tersuai",
    "heightLabel": "Tinggi imej",
    "fontFamilyLabel": "Fon",
    "fontSansSerif": "Sans-serif",
    "fontSerif": "Serif",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Warna teks",
    "bgColorLabel": "Warna latar belakang",
    "transparent": "Telus",
    "paddingLabel": "Pelapik",
    "lineHeightLabel": "Ketinggian baris",
    "textAlignLabel": "Penjajaran",
    "alignLeft": "Kiri",
    "alignCenter": "Tengah",
    "alignRight": "Kanan",
    "styleLabel": "Gaya",
    "boldLabel": "Tebal",
    "italicLabel": "Condong",
    "transparentLabel": "Latar belakang telus",
    "previewLabel": "Pratonton",
    "downloadBtn": "Muat turun PNG",
    "copyImageBtn": "Salin gambar",
    "copySuccess": "Disalin!",
    "copyFail": "Gagal menyalin",
    "resetBtn": "Tetapkan semula"
  },
  "pl": {
    "title": "Tekst do obrazu",
    "desc": "Konwertuj tekst na obraz PNG do pobrania. Dostosuj czcionkę, kolor, tło i wyrównanie.",
    "textLabel": "Tekst",
    "textPlaceholder": "Wprowadź tekst do konwersji na obraz...",
    "fontSizeLabel": "Rozmiar czcionki",
    "widthLabel": "Szerokość obrazu",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Dopasowuje się do szerokości",
    "ratioAuto": "Automatyczna wysokość",
    "ratioSquare": "Kwadrat 1:1",
    "ratio43": "Poziome 4:3",
    "ratio169": "Szerokoekranowe 16:9",
    "ratio34": "Pionowe 3:4",
    "ratio916": "Pionowe 9:16",
    "ratioCustom": "Niestandardowa wysokość",
    "heightLabel": "Wysokość obrazu",
    "fontFamilyLabel": "Czcionka",
    "fontSansSerif": "Bezszeryfowa",
    "fontSerif": "Szeryfowa",
    "fontMono": "Stałoszeryfowa",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Kolor tekstu",
    "bgColorLabel": "Kolor tła",
    "transparent": "Przezroczysty",
    "paddingLabel": "Wypełnienie",
    "lineHeightLabel": "Wysokość wiersza",
    "textAlignLabel": "Wyrównanie",
    "alignLeft": "Lewo",
    "alignCenter": "Środek",
    "alignRight": "Prawo",
    "styleLabel": "Styl",
    "boldLabel": "Pogrubienie",
    "italicLabel": "Kursywa",
    "transparentLabel": "Przezroczyste tło",
    "previewLabel": "Podgląd",
    "downloadBtn": "Pobierz PNG",
    "copyImageBtn": "Kopiuj obraz",
    "copySuccess": "Skopiowano!",
    "copyFail": "Kopiowanie nieudane",
    "resetBtn": "Resetuj"
  },
  "uk": {
    "title": "Текст у зображення",
    "desc": "Перетворіть текст на завантажуваний PNG-файл. Налаштуйте шрифт, колір, фон і вирівнювання.",
    "textLabel": "Текст",
    "textPlaceholder": "Введіть текст для перетворення у зображення...",
    "fontSizeLabel": "Розмір шрифту",
    "widthLabel": "Ширина зображення",
    "autoWidthLabel": "Авто",
    "autoWidthHint": "По ширині області",
    "ratioAuto": "Автовисота",
    "ratioSquare": "Квадрат 1:1",
    "ratio43": "Горизонтальне 4:3",
    "ratio169": "Широкоформатне 16:9",
    "ratio34": "Вертикальне 3:4",
    "ratio916": "Вертикальне 9:16",
    "ratioCustom": "Довільна висота",
    "heightLabel": "Висота зображення",
    "fontFamilyLabel": "Шрифт",
    "fontSansSerif": "Без засічок",
    "fontSerif": "Із засічками",
    "fontMono": "Моноширинний",
    "fontBlack": "Хейті",
    "fontSong": "Сунті",
    "textColorLabel": "Колір тексту",
    "bgColorLabel": "Колір фону",
    "transparent": "Прозорий",
    "paddingLabel": "Відступ",
    "lineHeightLabel": "Міжрядковий інтервал",
    "textAlignLabel": "Вирівнювання",
    "alignLeft": "По лівому краю",
    "alignCenter": "По центру",
    "alignRight": "По правому краю",
    "styleLabel": "Стиль",
    "boldLabel": "Жирний",
    "italicLabel": "Курсив",
    "transparentLabel": "Прозорий фон",
    "previewLabel": "Перегляд",
    "downloadBtn": "Завантажити PNG",
    "copyImageBtn": "Копіювати зображення",
    "copySuccess": "Скопійовано!",
    "copyFail": "Помилка копіювання",
    "resetBtn": "Скинути"
  },
  "sv": {
    "title": "Text till bild",
    "desc": "Konvertera text till en nedladdningsbar PNG-bild. Anpassa teckensnitt, färg, bakgrund och justering.",
    "textLabel": "Text",
    "textPlaceholder": "Ange text att konvertera till bild...",
    "fontSizeLabel": "Teckenstorlek",
    "widthLabel": "Bildbredd",
    "autoWidthLabel": "Auto",
    "autoWidthHint": "Anpassas till bredden",
    "ratioAuto": "Automatisk höjd",
    "ratioSquare": "Kvadrat 1:1",
    "ratio43": "Liggande 4:3",
    "ratio169": "Bredskärm 16:9",
    "ratio34": "Stående 3:4",
    "ratio916": "Stående 9:16",
    "ratioCustom": "Anpassad höjd",
    "heightLabel": "Bildhöjd",
    "fontFamilyLabel": "Teckensnitt",
    "fontSansSerif": "Utan serifer",
    "fontSerif": "Med serifer",
    "fontMono": "Monospace",
    "fontBlack": "Heiti",
    "fontSong": "Songti",
    "textColorLabel": "Textfärg",
    "bgColorLabel": "Bakgrundsfärg",
    "transparent": "Genomskinlig",
    "paddingLabel": "Utfyllnad",
    "lineHeightLabel": "Radhöjd",
    "textAlignLabel": "Justering",
    "alignLeft": "Vänster",
    "alignCenter": "Mitten",
    "alignRight": "Höger",
    "styleLabel": "Stil",
    "boldLabel": "Fet",
    "italicLabel": "Kursiv",
    "transparentLabel": "Genomskinlig bakgrund",
    "previewLabel": "Förhandsvisning",
    "downloadBtn": "Ladda ned PNG",
    "copyImageBtn": "Kopiera bild",
    "copySuccess": "Kopierat!",
    "copyFail": "Kopiering misslyckades",
    "resetBtn": "Återställ"
  },
  "zh-TW": {
    "title": "文字轉圖片",
    "desc": "將文字內容生成可下載的 PNG 圖片，支援自訂字體、顏色、背景和對齊方式。",
    "textLabel": "文字內容",
    "textPlaceholder": "輸入要轉換為圖片的文字...",
    "fontSizeLabel": "字號",
    "widthLabel": "圖片寬度",
    "autoWidthLabel": "自適應",
    "autoWidthHint": "跟隨預覽區寬度",
    "ratioAuto": "自適應高度",
    "ratioSquare": "正方形 1:1",
    "ratio43": "橫向 4:3",
    "ratio169": "寬屏 16:9",
    "ratio34": "縱向 3:4",
    "ratio916": "縱版 9:16",
    "ratioCustom": "自訂高度",
    "heightLabel": "圖片高度",
    "fontFamilyLabel": "字體",
    "fontSansSerif": "無襯線體",
    "fontSerif": "襯線體",
    "fontMono": "等寬體",
    "fontBlack": "黑體",
    "fontSong": "宋體",
    "textColorLabel": "文字顏色",
    "bgColorLabel": "背景顏色",
    "transparent": "透明",
    "paddingLabel": "內邊距",
    "lineHeightLabel": "行高",
    "textAlignLabel": "對齊方式",
    "alignLeft": "靠左",
    "alignCenter": "居中",
    "alignRight": "靠右",
    "styleLabel": "樣式",
    "boldLabel": "粗體",
    "italicLabel": "斜體",
    "transparentLabel": "透明背景",
    "previewLabel": "預覽",
    "downloadBtn": "下載 PNG",
    "copyImageBtn": "複製圖片",
    "copySuccess": "已複製！",
    "copyFail": "複製失敗",
    "resetBtn": "重置"
  }
}
</i18n>

<style lang="scss" scoped>
.tti-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.tti-header {
  text-align: center;
  margin-bottom: 28px;
}

.tti-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.tti-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin: 0;
}

.tti-body {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.tti-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px;
}

.tti-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tti-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tti-field-half {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tti-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: auto;
}

.tti-color-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tti-color-picker {
  width: 36px;
  height: 36px;
  padding: 2px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  background: none;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.tti-color-hex {
  font-size: 0.82rem;
  font-family: monospace;
  color: var(--vp-c-text-2);
}

.tti-toggle-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.tti-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.tti-preview {
  gap: 10px;
  min-width: 0;
}

.tti-preview-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.tti-canvas {
  max-width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  display: block;
}

.tti-auto-check {
  margin-left: 8px;
  font-weight: 400;
  position: relative;
  top: 4px;
  :deep(.el-checkbox__label) {
    font-size: 0.78rem;
    color: var(--vp-c-brand-1);
  }
}

.tti-auto-badge {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 6px;
  font-size: 0.82rem;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}
</style>
