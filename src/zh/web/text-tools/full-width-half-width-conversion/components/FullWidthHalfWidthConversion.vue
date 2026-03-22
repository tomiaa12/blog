<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const inputText = ref("ＡＢＣＤＥＦＧ　１２３４５６７　！＠＃＄％＾＆＊（）")
const mode = ref<"toHalf" | "toFull">("toHalf")
const convertLetters = ref(true)
const convertDigits = ref(true)
const convertSymbols = ref(true)
const convertSpace = ref(true)

function isLetter(code: number) {
  return (
    (code >= 0x41 && code <= 0x5a) ||
    (code >= 0x61 && code <= 0x7a) || // A-Z a-z
    (code >= 0xff21 && code <= 0xff3a) ||
    (code >= 0xff41 && code <= 0xff5a)
  )
}
function isDigit(code: number) {
  return (code >= 0x30 && code <= 0x39) || (code >= 0xff10 && code <= 0xff19)
}
function isSymbol(code: number) {
  // half-width symbols: 0x21-0x2F, 0x3A-0x40, 0x5B-0x60, 0x7B-0x7E
  // full-width symbols: FF01-FF0F, FF1A-FF20, FF3B-FF40, FF5B-FF5E
  const halfSymbol =
    (code >= 0x21 && code <= 0x2f) ||
    (code >= 0x3a && code <= 0x40) ||
    (code >= 0x5b && code <= 0x60) ||
    (code >= 0x7b && code <= 0x7e)
  const fullSymbol =
    (code >= 0xff01 && code <= 0xff0f) ||
    (code >= 0xff1a && code <= 0xff20) ||
    (code >= 0xff3b && code <= 0xff40) ||
    (code >= 0xff5b && code <= 0xff5e)
  return halfSymbol || fullSymbol
}

function convertChar(char: string): string {
  const code = char.charCodeAt(0)

  if (mode.value === "toFull") {
    if (code === 0x20 && convertSpace.value) return "\u3000"
    if (code >= 0x21 && code <= 0x7e) {
      if (isLetter(code) && !convertLetters.value) return char
      if (isDigit(code) && !convertDigits.value) return char
      if (isSymbol(code) && !convertSymbols.value) return char
      return String.fromCharCode(code + 0xfee0)
    }
  } else {
    if (code === 0x3000 && convertSpace.value) return " "
    if (code >= 0xff01 && code <= 0xff5e) {
      if (isLetter(code) && !convertLetters.value) return char
      if (isDigit(code) && !convertDigits.value) return char
      if (isSymbol(code) && !convertSymbols.value) return char
      return String.fromCharCode(code - 0xfee0)
    }
  }
  return char
}

const result = computed(() => {
  if (!inputText.value) return null
  const converted = inputText.value.split("").map(convertChar).join("")
  const changed = inputText.value
    .split("")
    .filter((c, i) => c !== converted[i]).length
  return { text: converted, changed }
})

function copyResult() {
  if (!result.value?.text) return
  navigator.clipboard.writeText(result.value.text).then(() => {
    ElMessage({ message: t("copied"), type: "success", duration: 1500 })
  })
}

function swapMode() {
  mode.value = mode.value === "toHalf" ? "toFull" : "toHalf"
}

function clear() {
  inputText.value = ""
}
</script>

<template>
  <div class="fwhw-conv">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="mode-bar">
      <el-radio-group
        v-model="mode"
        size="large"
      >
        <el-radio-button value="toHalf">{{ t("toHalf") }}</el-radio-button>
        <el-radio-button value="toFull">{{ t("toFull") }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="options">
      <el-checkbox v-model="convertLetters">{{ t("optLetters") }}</el-checkbox>
      <el-checkbox v-model="convertDigits">{{ t("optDigits") }}</el-checkbox>
      <el-checkbox v-model="convertSymbols">{{ t("optSymbols") }}</el-checkbox>
      <el-checkbox v-model="convertSpace">{{ t("optSpace") }}</el-checkbox>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-header">
          <span class="label">{{ t("inputLabel") }}</span>
          <el-button @click="clear">{{ t("clear") }}</el-button>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="10"
          :placeholder="t('placeholder')"
          resize="vertical"
        />
      </div>

      <div class="panel-divider">
        <el-button
          circle
          @click="swapMode"
          :title="t('swapTitle')"
          >⇄</el-button
        >
      </div>

      <div class="panel">
        <div class="panel-header">
          <span class="label">
            {{ t("outputLabel") }}
            <span
              v-if="result"
              class="changed-badge"
            >
              {{ t("changed") }}：{{ result.changed }}
            </span>
          </span>
          <el-button
            type="primary"
            :disabled="!result?.text"
            @click="copyResult"
          >
            {{ t("copy") }}
          </el-button>
        </div>
        <div
          v-if="result"
          class="output-box"
        >
          {{ result.text }}
        </div>
        <div
          v-else
          class="output-box empty-hint"
        >
          {{ t("emptyHint") }}
        </div>
      </div>
    </div>

    <div class="examples">
      <div class="examples-title">{{ t("examplesTitle") }}</div>
      <div class="example-list">
        <span
          class="example-item"
          @click="inputText = 'ＡＢＣＤＥＦＧ１２３４５６７！＠＃＄％＾＆'"
          >全角示例</span
        >
        <span
          class="example-item"
          @click="inputText = 'ABCDEFG1234567!@#$%^&'"
          >半角示例</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fwhw-conv {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.mode-bar {
  margin-bottom: 16px;
}

.options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.panels {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  min-height: 32px;
}

.label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.changed-badge {
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  font-weight: normal;
}

.panel-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;

  @media (max-width: 700px) {
    padding-top: 0;
  }
}

.output-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 224px;
  max-height: 400px;
  overflow-y: auto;
  font-family: var(--vp-font-family-mono);

  &.empty-hint {
    color: var(--vp-c-text-3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
  }
}

.examples {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.examples-title {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.example-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.example-item {
  padding: 4px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "全角半角转换",
    "toHalf": "全角 → 半角",
    "toFull": "半角 → 全角",
    "inputLabel": "输入文本",
    "outputLabel": "转换结果",
    "placeholder": "输入要转换的文本...",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制！",
    "emptyHint": "请在左侧输入文本",
    "swapTitle": "切换方向",
    "changed": "已转换",
    "optLetters": "字母",
    "optDigits": "数字",
    "optSymbols": "符号",
    "optSpace": "空格",
    "examplesTitle": "示例"
  },
  "en": {
    "title_page": "Full-Width / Half-Width Converter",
    "toHalf": "Full-Width → Half-Width",
    "toFull": "Half-Width → Full-Width",
    "inputLabel": "Input Text",
    "outputLabel": "Result",
    "placeholder": "Enter text to convert...",
    "clear": "Clear",
    "copy": "Copy",
    "copied": "Copied!",
    "emptyHint": "Enter text on the left",
    "swapTitle": "Swap direction",
    "changed": "Converted",
    "optLetters": "Letters",
    "optDigits": "Digits",
    "optSymbols": "Symbols",
    "optSpace": "Space",
    "examplesTitle": "Examples"
  },
  "ja": {
    "title_page": "全角・半角変換",
    "toHalf": "全角 → 半角",
    "toFull": "半角 → 全角",
    "inputLabel": "入力テキスト",
    "outputLabel": "変換結果",
    "placeholder": "変換するテキストを入力してください...",
    "clear": "クリア",
    "copy": "コピー",
    "copied": "コピーしました",
    "emptyHint": "左側にテキストを入力してください",
    "swapTitle": "方向を切り替え",
    "changed": "変換済み",
    "optLetters": "文字",
    "optDigits": "数字",
    "optSymbols": "記号",
    "optSpace": "スペース",
    "examplesTitle": "例"
  },
  "ko": {
    "title_page": "전각·반각 변환",
    "toHalf": "전각 → 반각",
    "toFull": "반각 → 전각",
    "inputLabel": "입력 텍스트",
    "outputLabel": "변환 결과",
    "placeholder": "변환할 텍스트를 입력하세요...",
    "clear": "지우기",
    "copy": "복사",
    "copied": "복사되었습니다!",
    "emptyHint": "왼쪽에 텍스트를 입력하세요",
    "swapTitle": "방향 전환",
    "changed": "변환됨",
    "optLetters": "문자",
    "optDigits": "숫자",
    "optSymbols": "기호",
    "optSpace": "공백",
    "examplesTitle": "예시"
  },
  "fr": {
    "title_page": "Convertisseur pleine/demi-chasse",
    "toHalf": "Pleine → Demi-chasse",
    "toFull": "Demi → Pleine chasse",
    "inputLabel": "Texte d'entrée",
    "outputLabel": "Résultat",
    "placeholder": "Entrez le texte à convertir...",
    "clear": "Effacer",
    "copy": "Copier",
    "copied": "Copié !",
    "emptyHint": "Entrez du texte à gauche",
    "swapTitle": "Inverser la direction",
    "changed": "Convertis",
    "optLetters": "Lettres",
    "optDigits": "Chiffres",
    "optSymbols": "Symboles",
    "optSpace": "Espace",
    "examplesTitle": "Exemples"
  },
  "de": {
    "title_page": "Vollbreite/Halbbreite Konverter",
    "toHalf": "Vollbreite → Halbbreite",
    "toFull": "Halbbreite → Vollbreite",
    "inputLabel": "Eingabetext",
    "outputLabel": "Ergebnis",
    "placeholder": "Zu konvertierenden Text eingeben...",
    "clear": "Löschen",
    "copy": "Kopieren",
    "copied": "Kopiert!",
    "emptyHint": "Text links eingeben",
    "swapTitle": "Richtung wechseln",
    "changed": "Konvertiert",
    "optLetters": "Buchstaben",
    "optDigits": "Ziffern",
    "optSymbols": "Symbole",
    "optSpace": "Leerzeichen",
    "examplesTitle": "Beispiele"
  },
  "es": {
    "title_page": "Convertidor ancho completo/medio",
    "toHalf": "Ancho completo → Medio",
    "toFull": "Medio → Ancho completo",
    "inputLabel": "Texto de entrada",
    "outputLabel": "Resultado",
    "placeholder": "Ingrese el texto a convertir...",
    "clear": "Limpiar",
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "emptyHint": "Ingrese texto a la izquierda",
    "swapTitle": "Cambiar dirección",
    "changed": "Convertidos",
    "optLetters": "Letras",
    "optDigits": "Dígitos",
    "optSymbols": "Símbolos",
    "optSpace": "Espacio",
    "examplesTitle": "Ejemplos"
  },
  "pt": {
    "title_page": "Conversor largura total/meia",
    "toHalf": "Largura total → Meia",
    "toFull": "Meia → Largura total",
    "inputLabel": "Texto de entrada",
    "outputLabel": "Resultado",
    "placeholder": "Insira o texto a converter...",
    "clear": "Limpar",
    "copy": "Copiar",
    "copied": "Copiado!",
    "emptyHint": "Insira texto à esquerda",
    "swapTitle": "Inverter direção",
    "changed": "Convertidos",
    "optLetters": "Letras",
    "optDigits": "Dígitos",
    "optSymbols": "Símbolos",
    "optSpace": "Espaço",
    "examplesTitle": "Exemplos"
  },
  "ru": {
    "title_page": "Конвертер полной/полуширины",
    "toHalf": "Полная → Полуширина",
    "toFull": "Полу → Полная ширина",
    "inputLabel": "Входной текст",
    "outputLabel": "Результат",
    "placeholder": "Введите текст для конвертации...",
    "clear": "Очистить",
    "copy": "Копировать",
    "copied": "Скопировано!",
    "emptyHint": "Введите текст слева",
    "swapTitle": "Изменить направление",
    "changed": "Конвертировано",
    "optLetters": "Буквы",
    "optDigits": "Цифры",
    "optSymbols": "Символы",
    "optSpace": "Пробел",
    "examplesTitle": "Примеры"
  },
  "ar": {
    "title_page": "محوّل العرض الكامل/النصفي",
    "toHalf": "كامل العرض → نصف العرض",
    "toFull": "نصف → كامل العرض",
    "inputLabel": "النص المدخل",
    "outputLabel": "النتيجة",
    "placeholder": "أدخل النص للتحويل...",
    "clear": "مسح",
    "copy": "نسخ",
    "copied": "تم النسخ!",
    "emptyHint": "أدخل النص على اليسار",
    "swapTitle": "تبديل الاتجاه",
    "changed": "محوَّل",
    "optLetters": "حروف",
    "optDigits": "أرقام",
    "optSymbols": "رموز",
    "optSpace": "مسافة",
    "examplesTitle": "أمثلة"
  },
  "hi": {
    "title_page": "पूर्ण-चौड़ाई/अर्ध-चौड़ाई परिवर्तक",
    "toHalf": "पूर्ण → अर्ध चौड़ाई",
    "toFull": "अर्ध → पूर्ण चौड़ाई",
    "inputLabel": "इनपुट टेक्स्ट",
    "outputLabel": "परिणाम",
    "placeholder": "परिवर्तित करने के लिए टेक्स्ट दर्ज करें...",
    "clear": "साफ़ करें",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया!",
    "emptyHint": "बाईं ओर टेक्स्ट दर्ज करें",
    "swapTitle": "दिशा बदलें",
    "changed": "परिवर्तित",
    "optLetters": "अक्षर",
    "optDigits": "अंक",
    "optSymbols": "प्रतीक",
    "optSpace": "स्पेस",
    "examplesTitle": "उदाहरण"
  },
  "it": {
    "title_page": "Convertitore larghezza piena/media",
    "toHalf": "Piena → Mezza larghezza",
    "toFull": "Mezza → Piena larghezza",
    "inputLabel": "Testo di input",
    "outputLabel": "Risultato",
    "placeholder": "Inserire il testo da convertire...",
    "clear": "Cancella",
    "copy": "Copia",
    "copied": "Copiato!",
    "emptyHint": "Inserire testo a sinistra",
    "swapTitle": "Inverti direzione",
    "changed": "Convertiti",
    "optLetters": "Lettere",
    "optDigits": "Cifre",
    "optSymbols": "Simboli",
    "optSpace": "Spazio",
    "examplesTitle": "Esempi"
  },
  "nl": {
    "title_page": "Volbreedte/halfbreedte converter",
    "toHalf": "Volbreedte → Halfbreedte",
    "toFull": "Halfbreedte → Volbreedte",
    "inputLabel": "Invoertekst",
    "outputLabel": "Resultaat",
    "placeholder": "Voer de te converteren tekst in...",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "copied": "Gekopieerd!",
    "emptyHint": "Voer links tekst in",
    "swapTitle": "Richting omwisselen",
    "changed": "Geconverteerd",
    "optLetters": "Letters",
    "optDigits": "Cijfers",
    "optSymbols": "Symbolen",
    "optSpace": "Spatie",
    "examplesTitle": "Voorbeelden"
  },
  "tr": {
    "title_page": "Tam Genişlik/Yarı Genişlik Dönüştürücü",
    "toHalf": "Tam Genişlik → Yarı",
    "toFull": "Yarı → Tam Genişlik",
    "inputLabel": "Giriş Metni",
    "outputLabel": "Sonuç",
    "placeholder": "Dönüştürülecek metni girin...",
    "clear": "Temizle",
    "copy": "Kopyala",
    "copied": "Kopyalandı!",
    "emptyHint": "Sola metin girin",
    "swapTitle": "Yönü değiştir",
    "changed": "Dönüştürüldü",
    "optLetters": "Harfler",
    "optDigits": "Rakamlar",
    "optSymbols": "Semboller",
    "optSpace": "Boşluk",
    "examplesTitle": "Örnekler"
  },
  "vi": {
    "title_page": "Chuyển đổi độ rộng đầy đủ/nửa",
    "toHalf": "Đầy đủ → Nửa chiều rộng",
    "toFull": "Nửa → Đầy đủ chiều rộng",
    "inputLabel": "Văn bản đầu vào",
    "outputLabel": "Kết quả",
    "placeholder": "Nhập văn bản để chuyển đổi...",
    "clear": "Xóa",
    "copy": "Sao chép",
    "copied": "Đã sao chép!",
    "emptyHint": "Nhập văn bản bên trái",
    "swapTitle": "Đổi hướng",
    "changed": "Đã chuyển đổi",
    "optLetters": "Chữ cái",
    "optDigits": "Chữ số",
    "optSymbols": "Ký hiệu",
    "optSpace": "Khoảng trắng",
    "examplesTitle": "Ví dụ"
  },
  "th": {
    "title_page": "แปลงความกว้างเต็ม/ครึ่ง",
    "toHalf": "ความกว้างเต็ม → ครึ่ง",
    "toFull": "ครึ่ง → ความกว้างเต็ม",
    "inputLabel": "ข้อความที่ป้อน",
    "outputLabel": "ผลลัพธ์",
    "placeholder": "ป้อนข้อความที่ต้องการแปลง...",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว!",
    "emptyHint": "ป้อนข้อความทางซ้าย",
    "swapTitle": "สลับทิศทาง",
    "changed": "แปลงแล้ว",
    "optLetters": "ตัวอักษร",
    "optDigits": "ตัวเลข",
    "optSymbols": "สัญลักษณ์",
    "optSpace": "ช่องว่าง",
    "examplesTitle": "ตัวอย่าง"
  },
  "id": {
    "title_page": "Konverter Lebar Penuh/Setengah",
    "toHalf": "Lebar Penuh → Setengah",
    "toFull": "Setengah → Lebar Penuh",
    "inputLabel": "Teks Masukan",
    "outputLabel": "Hasil",
    "placeholder": "Masukkan teks untuk dikonversi...",
    "clear": "Hapus",
    "copy": "Salin",
    "copied": "Disalin!",
    "emptyHint": "Masukkan teks di sebelah kiri",
    "swapTitle": "Balik arah",
    "changed": "Dikonversi",
    "optLetters": "Huruf",
    "optDigits": "Angka",
    "optSymbols": "Simbol",
    "optSpace": "Spasi",
    "examplesTitle": "Contoh"
  },
  "sv": {
    "title_page": "Helbredd/halvbredd konverterare",
    "toHalf": "Helbredd → Halvbredd",
    "toFull": "Halvbredd → Helbredd",
    "inputLabel": "Inmatningstext",
    "outputLabel": "Resultat",
    "placeholder": "Ange text att konvertera...",
    "clear": "Rensa",
    "copy": "Kopiera",
    "copied": "Kopierat!",
    "emptyHint": "Ange text till vänster",
    "swapTitle": "Byt riktning",
    "changed": "Konverterade",
    "optLetters": "Bokstäver",
    "optDigits": "Siffror",
    "optSymbols": "Symboler",
    "optSpace": "Mellanslag",
    "examplesTitle": "Exempel"
  },
  "pl": {
    "title_page": "Konwerter pełnej/półszerokości",
    "toHalf": "Pełna → Półszerokość",
    "toFull": "Półszerokość → Pełna",
    "inputLabel": "Tekst wejściowy",
    "outputLabel": "Wynik",
    "placeholder": "Wprowadź tekst do konwersji...",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "copied": "Skopiowano!",
    "emptyHint": "Wprowadź tekst po lewej stronie",
    "swapTitle": "Zmień kierunek",
    "changed": "Przekonwertowane",
    "optLetters": "Litery",
    "optDigits": "Cyfry",
    "optSymbols": "Symbole",
    "optSpace": "Spacja",
    "examplesTitle": "Przykłady"
  },
  "zh-TW": {
    "title_page": "全形半形轉換",
    "toHalf": "全形 → 半形",
    "toFull": "半形 → 全形",
    "inputLabel": "輸入文字",
    "outputLabel": "轉換結果",
    "placeholder": "輸入要轉換的文字...",
    "clear": "清空",
    "copy": "複製",
    "copied": "已複製！",
    "emptyHint": "請在左側輸入文字",
    "swapTitle": "切換方向",
    "changed": "已轉換",
    "optLetters": "字母",
    "optDigits": "數字",
    "optSymbols": "符號",
    "optSpace": "空格",
    "examplesTitle": "範例"
  }
}
</i18n>
