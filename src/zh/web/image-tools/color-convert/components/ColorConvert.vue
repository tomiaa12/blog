<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import {
  clamp,
  formatAll,
  hslToRgb,
  hsvToRgb,
  parseColor,
  type RGBA,
} from "./colorMath"

const { t } = useI18n()

const color = ref<RGBA>({ r: 67, g: 142, b: 219, a: 1 })
const draft = ref("#438edb")
const parseErr = ref(false)

const out = computed(() => formatAll(color.value))
const picker = computed({
  get: () => out.value.hexa,
  set: (v: string) => applyText(v),
})

const rows = computed(() => [
  { key: "hex", label: "HEX", value: out.value.hex },
  { key: "hexa", label: "HEXA", value: out.value.hexa },
  { key: "rgb", label: "RGB", value: out.value.rgb },
  { key: "rgba", label: "RGBA", value: out.value.rgba },
  { key: "hsl", label: "HSL", value: out.value.hsl },
  { key: "hsla", label: "HSLA", value: out.value.hsla },
  { key: "hsv", label: "HSV", value: out.value.hsv },
  { key: "hsb", label: "HSB", value: out.value.hsb },
  { key: "hwb", label: "HWB", value: out.value.hwb },
  { key: "cmyk", label: "CMYK", value: out.value.cmyk },
  { key: "dec", label: "0x", value: out.value.dec },
  { key: "css", label: "CSS", value: out.value.css },
])

function apply(next: RGBA) {
  color.value = {
    r: clamp(next.r, 0, 255),
    g: clamp(next.g, 0, 255),
    b: clamp(next.b, 0, 255),
    a: clamp(next.a, 0, 1),
  }
  draft.value = formatAll(color.value).hex
  parseErr.value = false
}

function applyText(text: string) {
  const parsed = parseColor(text)
  if (!parsed) {
    parseErr.value = true
    return false
  }
  apply(parsed)
  return true
}

function onDraft() {
  const parsed = parseColor(draft.value)
  parseErr.value = !!draft.value.trim() && !parsed
  if (parsed) apply(parsed)
}

function setRgb(part: "r" | "g" | "b", n: number | undefined) {
  apply({ ...color.value, [part]: n ?? 0 })
}

function setAlpha(n: number | undefined) {
  apply({ ...color.value, a: (n ?? 100) / 100 })
}

function setHsl(part: "h" | "s" | "l", n: number | undefined) {
  const hsl = {
    h: out.value.hh,
    s: out.value.hs,
    l: out.value.hl,
    [part]: n ?? 0,
  }
  apply(hslToRgb(hsl.h, hsl.s, hsl.l, color.value.a))
}

function setHsv(part: "h" | "s" | "v", n: number | undefined) {
  const hsv = {
    h: out.value.vh,
    s: out.value.vs,
    v: out.value.vv,
    [part]: n ?? 0,
  }
  apply(hsvToRgb(hsv.h, hsv.s, hsv.v, color.value.a))
}

async function copy(text: string) {
  await copyToClipboard(text)
  ElMessage({ message: t("copied"), type: "success", duration: 1200 })
}

async function copyAll() {
  await copyToClipboard(rows.value.map(r => `${r.label}: ${r.value}`).join("\n"))
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

watch(out, v => {
  if (parseColor(draft.value)) draft.value = v.hex
})
</script>

<template>
  <div class="cc-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="work">
      <div class="preview-col">
        <div
          class="preview"
          :style="{ background: out.rgba }"
        />
        <div class="picker-row">
          <el-color-picker
            v-model="picker"
            show-alpha
          />
          <el-input
            v-model="draft"
            :class="{ bad: parseErr }"
            :placeholder="t('placeholder')"
            @input="onDraft"
          />
        </div>
        <p
          v-if="parseErr"
          class="err"
        >
          {{ t("msgBad") }}
        </p>
        <p class="hint">{{ t("hint") }}</p>
        <el-button @click="copyAll">{{ t("copyAll") }}</el-button>
      </div>

      <div class="fields">
        <h2 class="sub">RGB</h2>
        <div class="sliders">
          <label>R
            <el-slider
              :model-value="out.r"
              :min="0"
              :max="255"
              :show-tooltip="false"
              @input="(v: number | number[]) => setRgb('r', Number(v))"
            />
            <el-input-number
              :model-value="out.r"
              :min="0"
              :max="255"
              controls-position="right"
              @change="(v: number | undefined) => setRgb('r', v)"
            />
          </label>
          <label>G
            <el-slider
              :model-value="out.g"
              :min="0"
              :max="255"
              :show-tooltip="false"
              @input="(v: number | number[]) => setRgb('g', Number(v))"
            />
            <el-input-number
              :model-value="out.g"
              :min="0"
              :max="255"
              controls-position="right"
              @change="(v: number | undefined) => setRgb('g', v)"
            />
          </label>
          <label>B
            <el-slider
              :model-value="out.b"
              :min="0"
              :max="255"
              :show-tooltip="false"
              @input="(v: number | number[]) => setRgb('b', Number(v))"
            />
            <el-input-number
              :model-value="out.b"
              :min="0"
              :max="255"
              controls-position="right"
              @change="(v: number | undefined) => setRgb('b', v)"
            />
          </label>
          <label>A
            <el-slider
              :model-value="Math.round(out.a * 100)"
              :min="0"
              :max="100"
              :show-tooltip="false"
              @input="(v: number | number[]) => setAlpha(Number(v))"
            />
            <el-input-number
              :model-value="Math.round(out.a * 100)"
              :min="0"
              :max="100"
              controls-position="right"
              @change="(v: number | undefined) => setAlpha(v)"
            />
          </label>
        </div>

        <h2 class="sub">HSL</h2>
        <div class="sliders">
          <label>H
            <el-slider
              :model-value="out.hh"
              :min="0"
              :max="360"
              :show-tooltip="false"
              @input="(v: number | number[]) => setHsl('h', Number(v))"
            />
          </label>
          <label>S
            <el-slider
              :model-value="out.hs"
              :min="0"
              :max="100"
              :show-tooltip="false"
              @input="(v: number | number[]) => setHsl('s', Number(v))"
            />
          </label>
          <label>L
            <el-slider
              :model-value="out.hl"
              :min="0"
              :max="100"
              :show-tooltip="false"
              @input="(v: number | number[]) => setHsl('l', Number(v))"
            />
          </label>
        </div>

        <h2 class="sub">HSV / HSB</h2>
        <div class="sliders">
          <label>H
            <el-slider
              :model-value="out.vh"
              :min="0"
              :max="360"
              :show-tooltip="false"
              @input="(v: number | number[]) => setHsv('h', Number(v))"
            />
          </label>
          <label>S
            <el-slider
              :model-value="out.vs"
              :min="0"
              :max="100"
              :show-tooltip="false"
              @input="(v: number | number[]) => setHsv('s', Number(v))"
            />
          </label>
          <label>V
            <el-slider
              :model-value="out.vv"
              :min="0"
              :max="100"
              :show-tooltip="false"
              @input="(v: number | number[]) => setHsv('v', Number(v))"
            />
          </label>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <div
        v-for="row in rows"
        :key="row.key"
        class="row"
      >
        <span class="lab">{{ row.label }}</span>
        <code>{{ row.value }}</code>
        <el-button
          size="small"
          @click="copy(row.value)"
        >
          {{ t("copy") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cc-page {
  max-width: 960px;
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

.work {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

@media (max-width: 800px) {
  .work {
    grid-template-columns: 1fr;
  }
}

.preview {
  height: 160px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-image:
    linear-gradient(45deg, var(--vp-c-bg) 25%, transparent 25%) 0 0 / 16px 16px,
    linear-gradient(-45deg, var(--vp-c-bg) 25%, transparent 25%) 0 8px / 16px 16px;
}

.picker-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
}

.bad :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--vp-c-danger-1, #c45656) inset;
}

.err {
  margin: 8px 0 0;
  font-size: 0.82rem;
  color: var(--vp-c-danger-1, #c45656);
}

.hint {
  margin: 10px 0 12px;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.sub {
  margin: 0 0 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sliders {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;

  label {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) 110px;
    gap: 8px;
    align-items: center;
    font-size: 0.82rem;
    color: var(--vp-c-text-2);
  }
}

.table-wrap {
  margin-top: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);

  &:last-child {
    border-bottom: 0;
  }
}

.lab {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

code {
  font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "颜色转换",
    "desc": "在 HEX、RGB、HSL、HSV / HSB、HWB、CMYK 之间互转，可取色、调滑块、复制 CSS。处理都在浏览器本地完成。",
    "placeholder": "#438edb、rgb(67, 142, 219)、steelblue…",
    "hint": "支持 #RGB / #RRGGBB / #RRGGBBAA、rgb()、hsl()、hsv()、hsb()、hwb()、cmyk()、0x 以及常见英文色名。",
    "copy": "复制",
    "copyAll": "复制全部格式",
    "copied": "已复制",
    "msgBad": "无法识别这种颜色写法。"
  },
  "zh-CN": {
    "title_page": "颜色转换",
    "desc": "在 HEX、RGB、HSL、HSV / HSB、HWB、CMYK 之间互转，可取色、调滑块、复制 CSS。处理都在浏览器本地完成。",
    "placeholder": "#438edb、rgb(67, 142, 219)、steelblue…",
    "hint": "支持 #RGB / #RRGGBB / #RRGGBBAA、rgb()、hsl()、hsv()、hsb()、hwb()、cmyk()、0x 以及常见英文色名。",
    "copy": "复制",
    "copyAll": "复制全部格式",
    "copied": "已复制",
    "msgBad": "无法识别这种颜色写法。"
  },
  "en": {
    "title_page": "Color converter",
    "desc": "Convert among HEX, RGB, HSL, HSV / HSB, HWB, and CMYK. Pick a color, drag sliders, copy CSS. Everything stays local.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Accepts #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x, and common English names.",
    "copy": "Copy",
    "copyAll": "Copy all formats",
    "copied": "Copied",
    "msgBad": "Could not parse this color."
  },
  "ja": {
    "title_page": "カラー変換",
    "desc": "HEX・RGB・HSL・HSV / HSB・HWB・CMYK を相互変換。スポイト、スライダー、CSS コピー。すべて端末内です。",
    "placeholder": "#438edb、rgb(67, 142, 219)、steelblue…",
    "hint": "#RGB / #RRGGBB / #RRGGBBAA、rgb()、hsl()、hsv()、hsb()、hwb()、cmyk()、0x、一般的な英語名に対応。",
    "copy": "コピー",
    "copyAll": "すべてコピー",
    "copied": "コピーしました",
    "msgBad": "この色の書き方を認識できません。"
  },
  "ko": {
    "title_page": "색 변환",
    "desc": "HEX, RGB, HSL, HSV / HSB, HWB, CMYK를 서로 변환합니다. 색 선택, 슬라이더, CSS 복사. 모두 로컬입니다.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "#RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x, 흔한 영문 색 이름을 지원합니다.",
    "copy": "복사",
    "copyAll": "모든 형식 복사",
    "copied": "복사됨",
    "msgBad": "이 색 표기를 인식하지 못했습니다."
  },
  "fr": {
    "title_page": "Convertisseur de couleurs",
    "desc": "Convertissez HEX, RGB, HSL, HSV / HSB, HWB et CMYK. Pipette, curseurs, copie CSS. Tout reste local.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Accepte #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x et les noms anglais courants.",
    "copy": "Copier",
    "copyAll": "Tout copier",
    "copied": "Copié",
    "msgBad": "Impossible d’analyser cette couleur."
  },
  "de": {
    "title_page": "Farbkonverter",
    "desc": "HEX, RGB, HSL, HSV / HSB, HWB und CMYK umrechnen. Pipette, Schieberegler, CSS kopieren. Alles lokal.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Akzeptiert #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x und gängige englische Namen.",
    "copy": "Kopieren",
    "copyAll": "Alle Formate kopieren",
    "copied": "Kopiert",
    "msgBad": "Diese Farbe konnte nicht gelesen werden."
  },
  "es": {
    "title_page": "Conversor de color",
    "desc": "Convierte HEX, RGB, HSL, HSV / HSB, HWB y CMYK. Cuentagotas, deslizadores y copia CSS. Todo es local.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Acepta #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x y nombres ingleses comunes.",
    "copy": "Copiar",
    "copyAll": "Copiar todos los formatos",
    "copied": "Copiado",
    "msgBad": "No se pudo reconocer este color."
  },
  "pt": {
    "title_page": "Conversor de cores",
    "desc": "Converta HEX, RGB, HSL, HSV / HSB, HWB e CMYK. Conta-gotas, sliders e cópia CSS. Tudo no dispositivo.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Aceita #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x e nomes ingleses comuns.",
    "copy": "Copiar",
    "copyAll": "Copiar todos os formatos",
    "copied": "Copiado",
    "msgBad": "Não foi possível reconhecer esta cor."
  },
  "ru": {
    "title_page": "Конвертер цветов",
    "desc": "Перевод HEX, RGB, HSL, HSV / HSB, HWB и CMYK. Пипетка, ползунки, копирование CSS. Всё локально.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Принимает #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x и обычные английские имена.",
    "copy": "Копировать",
    "copyAll": "Копировать все форматы",
    "copied": "Скопировано",
    "msgBad": "Не удалось разобрать этот цвет."
  },
  "ar": {
    "title_page": "محوّل الألوان",
    "desc": "حوّل بين HEX و RGB و HSL و HSV / HSB و HWB و CMYK. قطّارة ومنزلقات ونسخ CSS. كل شيء محلي.",
    "placeholder": "#438edb، rgb(67, 142, 219)، steelblue…",
    "hint": "يقبل #RGB / #RRGGBB / #RRGGBBAA و rgb() و hsl() و hsv() و hsb() و hwb() و cmyk() و 0x والأسماء الإنجليزية الشائعة.",
    "copy": "نسخ",
    "copyAll": "نسخ كل الصيغ",
    "copied": "تم النسخ",
    "msgBad": "تعذر التعرف على هذا اللون."
  },
  "hi": {
    "title_page": "रंग रूपांतरण",
    "desc": "HEX, RGB, HSL, HSV / HSB, HWB और CMYK बदलें। रंग चुनें, स्लाइडर चलाएँ, CSS कॉपी करें। सब स्थानीय रहता है।",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "#RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x और आम अंग्रेज़ी नाम चलते हैं।",
    "copy": "कॉपी",
    "copyAll": "सभी प्रारूप कॉपी",
    "copied": "कॉपी हो गया",
    "msgBad": "इस रंग को पहचाना नहीं जा सका।"
  },
  "it": {
    "title_page": "Convertitore di colori",
    "desc": "Converti HEX, RGB, HSL, HSV / HSB, HWB e CMYK. Contagocce, slider e copia CSS. Tutto resta in locale.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Accetta #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x e i nomi inglesi comuni.",
    "copy": "Copia",
    "copyAll": "Copia tutti i formati",
    "copied": "Copiato",
    "msgBad": "Impossibile riconoscere questo colore."
  },
  "nl": {
    "title_page": "Kleurconverter",
    "desc": "Zet HEX, RGB, HSL, HSV / HSB, HWB en CMYK om. Pipet, schuifregelaars, CSS kopiëren. Alles blijft lokaal.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Accepteert #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x en gangbare Engelse namen.",
    "copy": "Kopiëren",
    "copyAll": "Alle formaten kopiëren",
    "copied": "Gekopieerd",
    "msgBad": "Deze kleur kon niet worden herkend."
  },
  "tr": {
    "title_page": "Renk dönüştürücü",
    "desc": "HEX, RGB, HSL, HSV / HSB, HWB ve CMYK arasında dönüştürün. Damlalık, kaydırıcı, CSS kopyalama. Hepsi yerelde kalır.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "#RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x ve yaygın İngilizce adları kabul eder.",
    "copy": "Kopyala",
    "copyAll": "Tüm biçimleri kopyala",
    "copied": "Kopyalandı",
    "msgBad": "Bu renk tanınamadı."
  },
  "vi": {
    "title_page": "Chuyển đổi màu",
    "desc": "Chuyển giữa HEX, RGB, HSL, HSV / HSB, HWB và CMYK. Chọn màu, kéo thanh, sao chép CSS. Tất cả xử lý cục bộ.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Nhận #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x và tên tiếng Anh thông dụng.",
    "copy": "Sao chép",
    "copyAll": "Sao chép mọi định dạng",
    "copied": "Đã sao chép",
    "msgBad": "Không nhận diện được màu này."
  },
  "th": {
    "title_page": "แปลงสี",
    "desc": "แปลง HEX RGB HSL HSV / HSB HWB และ CMYK เลือกสี เลื่อนแถบ คัดลอก CSS ทำทั้งหมดในเครื่อง",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "รองรับ #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x และชื่ออังกฤษทั่วไป",
    "copy": "คัดลอก",
    "copyAll": "คัดลอกทุกรูปแบบ",
    "copied": "คัดลอกแล้ว",
    "msgBad": "ไม่รู้จักค่าสีนี้"
  },
  "id": {
    "title_page": "Konversi warna",
    "desc": "Ubah HEX, RGB, HSL, HSV / HSB, HWB, dan CMYK. Pilih warna, geser, salin CSS. Semuanya lokal.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Menerima #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x, dan nama Inggris umum.",
    "copy": "Salin",
    "copyAll": "Salin semua format",
    "copied": "Tersalin",
    "msgBad": "Warna ini tidak dikenali."
  },
  "ms": {
    "title_page": "Penukar warna",
    "desc": "Tukar HEX, RGB, HSL, HSV / HSB, HWB dan CMYK. Pilih warna, seret, salin CSS. Semua kekal setempat.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Menerima #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x dan nama Inggeris biasa.",
    "copy": "Salin",
    "copyAll": "Salin semua format",
    "copied": "Disalin",
    "msgBad": "Warna ini tidak dikenali."
  },
  "pl": {
    "title_page": "Konwerter kolorów",
    "desc": "Przelicz HEX, RGB, HSL, HSV / HSB, HWB i CMYK. Pipeta, suwaki, kopiowanie CSS. Wszystko lokalnie.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Akceptuje #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x i popularne angielskie nazwy.",
    "copy": "Kopiuj",
    "copyAll": "Kopiuj wszystkie formaty",
    "copied": "Skopiowano",
    "msgBad": "Nie rozpoznano tego koloru."
  },
  "uk": {
    "title_page": "Конвертер кольорів",
    "desc": "Перетворення HEX, RGB, HSL, HSV / HSB, HWB і CMYK. Піпетка, повзунки, копіювання CSS. Усе локально.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Приймає #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x і звичні англійські назви.",
    "copy": "Копіювати",
    "copyAll": "Копіювати всі формати",
    "copied": "Скопійовано",
    "msgBad": "Не вдалося розпізнати цей колір."
  },
  "sv": {
    "title_page": "Färgkonverterare",
    "desc": "Konvertera HEX, RGB, HSL, HSV / HSB, HWB och CMYK. Pipett, reglage, kopiera CSS. Allt stannar lokalt.",
    "placeholder": "#438edb, rgb(67, 142, 219), steelblue…",
    "hint": "Tar #RGB / #RRGGBB / #RRGGBBAA, rgb(), hsl(), hsv(), hsb(), hwb(), cmyk(), 0x och vanliga engelska namn.",
    "copy": "Kopiera",
    "copyAll": "Kopiera alla format",
    "copied": "Kopierat",
    "msgBad": "Kunde inte tolka den här färgen."
  },
  "zh-TW": {
    "title_page": "顏色轉換",
    "desc": "在 HEX、RGB、HSL、HSV / HSB、HWB、CMYK 之間互轉，可取色、調滑桿、複製 CSS。處理都在瀏覽器本機完成。",
    "placeholder": "#438edb、rgb(67, 142, 219)、steelblue…",
    "hint": "支援 #RGB / #RRGGBB / #RRGGBBAA、rgb()、hsl()、hsv()、hsb()、hwb()、cmyk()、0x 以及常見英文色名。",
    "copy": "複製",
    "copyAll": "複製全部格式",
    "copied": "已複製",
    "msgBad": "無法辨識這種顏色寫法。"
  }
}
</i18n>
