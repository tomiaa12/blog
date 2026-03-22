<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const inputText = ref("")

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_./]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

const conversions = computed(() => {
  const text = inputText.value
  if (!text.trim()) return []

  const words = toWords(text)
  const lines = text.split(/\n/)

  return [
    {
      key: "upper",
      label: t("upper"),
      result: text.toUpperCase(),
    },
    {
      key: "lower",
      label: t("lower"),
      result: text.toLowerCase(),
    },
    {
      key: "title",
      label: t("title"),
      result: text.replace(/\b\w/g, c => c.toUpperCase()),
    },
    {
      key: "sentence",
      label: t("sentence"),
      result: lines
        .map(line => line.charAt(0).toUpperCase() + line.slice(1).toLowerCase())
        .join("\n"),
    },
    {
      key: "camel",
      label: t("camel"),
      result:
        words[0].toLowerCase() +
        words
          .slice(1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(""),
    },
    {
      key: "pascal",
      label: t("pascal"),
      result: words
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(""),
    },
    {
      key: "snake",
      label: t("snake"),
      result: words.map(w => w.toLowerCase()).join("_"),
    },
    {
      key: "constant",
      label: t("constant"),
      result: words.map(w => w.toUpperCase()).join("_"),
    },
    {
      key: "kebab",
      label: t("kebab"),
      result: words.map(w => w.toLowerCase()).join("-"),
    },
    {
      key: "dot",
      label: t("dot"),
      result: words.map(w => w.toLowerCase()).join("."),
    },
  ]
})

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage({ message: t("copied"), type: "success", duration: 1500 })
  })
}

function clearInput() {
  inputText.value = ""
}
</script>

<template>
  <div class="case-conversion">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="input-area">
      <div class="input-header">
        <span class="label">{{ t("inputLabel") }}</span>
        <el-button
          
          @click="clearInput"
          >{{ t("clear") }}</el-button
        >
      </div>
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="5"
        :placeholder="t('placeholder')"
        resize="vertical"
      />
    </div>

    <div
      v-if="conversions.length"
      class="results"
    >
      <div
        v-for="item in conversions"
        :key="item.key"
        class="result-row"
      >
        <div class="result-label">{{ item.label }}</div>
        <div class="result-text">{{ item.result }}</div>
        <el-button
          
          class="copy-btn"
          @click="copyText(item.result)"
        >
          {{ t("copy") }}
        </el-button>
      </div>
    </div>

    <div
      v-else
      class="empty-hint"
    >
      {{ t("emptyHint") }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.case-conversion {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.input-area {
  margin-bottom: 24px;
}

.input-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-row {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 12px;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--vp-c-brand-1);
  }
}

.result-label {
  grid-column: 1;
  grid-row: 1;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.result-text {
  grid-column: 1;
  grid-row: 2;
  font-family: "Fira Code", "Cascadia Code", "Consolas", monospace;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  word-break: break-all;
  white-space: pre-wrap;
  min-width: 0;
}

.copy-btn {
  grid-column: 2;
  grid-row: 1 / 3;
  align-self: center;
  flex-shrink: 0;
}

.empty-hint {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
  padding: 48px 0;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "大小写转换",
    "inputLabel": "输入文本",
    "placeholder": "输入要转换的文本，支持空格、连字符、下划线、驼峰等格式...",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制",
    "emptyHint": "请在上方输入文本",
    "upper": "全大写",
    "lower": "全小写",
    "title": "标题大小写",
    "sentence": "句首大写",
    "camel": "驼峰命名 (camelCase)",
    "pascal": "帕斯卡命名 (PascalCase)",
    "snake": "下划线命名 (snake_case)",
    "constant": "常量命名 (CONSTANT_CASE)",
    "kebab": "短横线命名 (kebab-case)",
    "dot": "点分命名 (dot.case)"
  },
  "en": {
    "title_page": "Case Converter",
    "inputLabel": "Input Text",
    "placeholder": "Enter text to convert. Supports spaces, hyphens, underscores, camelCase, etc.",
    "clear": "Clear",
    "copy": "Copy",
    "copied": "Copied!",
    "emptyHint": "Enter some text above to see conversions",
    "upper": "UPPER CASE",
    "lower": "lower case",
    "title": "Title Case",
    "sentence": "Sentence case",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "ja": {
    "title_page": "大文字・小文字変換",
    "inputLabel": "入力テキスト",
    "placeholder": "変換するテキストを入力してください。スペース、ハイフン、アンダースコア、キャメルケースなどに対応しています。",
    "clear": "クリア",
    "copy": "コピー",
    "copied": "コピーしました",
    "emptyHint": "上にテキストを入力してください",
    "upper": "全大文字 (UPPER CASE)",
    "lower": "全小文字 (lower case)",
    "title": "タイトルケース (Title Case)",
    "sentence": "センテンスケース",
    "camel": "キャメルケース (camelCase)",
    "pascal": "パスカルケース (PascalCase)",
    "snake": "スネークケース (snake_case)",
    "constant": "定数ケース (CONSTANT_CASE)",
    "kebab": "ケバブケース (kebab-case)",
    "dot": "ドットケース (dot.case)"
  },
  "ko": {
    "title_page": "대소문자 변환",
    "inputLabel": "입력 텍스트",
    "placeholder": "변환할 텍스트를 입력하세요. 공백, 하이픈, 밑줄, 카멜케이스 등을 지원합니다.",
    "clear": "지우기",
    "copy": "복사",
    "copied": "복사되었습니다",
    "emptyHint": "위에 텍스트를 입력하세요",
    "upper": "전체 대문자 (UPPER CASE)",
    "lower": "전체 소문자 (lower case)",
    "title": "제목 케이스 (Title Case)",
    "sentence": "문장 케이스",
    "camel": "카멜 케이스 (camelCase)",
    "pascal": "파스칼 케이스 (PascalCase)",
    "snake": "스네이크 케이스 (snake_case)",
    "constant": "상수 케이스 (CONSTANT_CASE)",
    "kebab": "케밥 케이스 (kebab-case)",
    "dot": "점 케이스 (dot.case)"
  },
  "fr": {
    "title_page": "Convertisseur de casse",
    "inputLabel": "Texte à convertir",
    "placeholder": "Entrez le texte à convertir. Supporte espaces, tirets, underscores, camelCase, etc.",
    "clear": "Effacer",
    "copy": "Copier",
    "copied": "Copié !",
    "emptyHint": "Saisissez du texte ci-dessus",
    "upper": "MAJUSCULES",
    "lower": "minuscules",
    "title": "Casse de Titre",
    "sentence": "Casse de phrase",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "de": {
    "title_page": "Groß-/Kleinschreibung",
    "inputLabel": "Eingabetext",
    "placeholder": "Text zur Konvertierung eingeben. Unterstützt Leerzeichen, Bindestriche, Unterstriche, camelCase usw.",
    "clear": "Löschen",
    "copy": "Kopieren",
    "copied": "Kopiert!",
    "emptyHint": "Bitte oben Text eingeben",
    "upper": "GROSSBUCHSTABEN",
    "lower": "kleinbuchstaben",
    "title": "Titelschreibung",
    "sentence": "Satzanfang groß",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "es": {
    "title_page": "Convertidor de mayúsculas/minúsculas",
    "inputLabel": "Texto de entrada",
    "placeholder": "Ingrese el texto a convertir. Soporta espacios, guiones, guiones bajos, camelCase, etc.",
    "clear": "Limpiar",
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "emptyHint": "Ingrese texto arriba",
    "upper": "MAYÚSCULAS",
    "lower": "minúsculas",
    "title": "Formato Título",
    "sentence": "Formato oración",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "pt": {
    "title_page": "Conversor de maiúsculas/minúsculas",
    "inputLabel": "Texto de entrada",
    "placeholder": "Insira o texto a converter. Suporta espaços, hífens, underscores, camelCase, etc.",
    "clear": "Limpar",
    "copy": "Copiar",
    "copied": "Copiado!",
    "emptyHint": "Digite algum texto acima",
    "upper": "MAIÚSCULAS",
    "lower": "minúsculas",
    "title": "Formato Título",
    "sentence": "Formato frase",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "ru": {
    "title_page": "Конвертер регистра",
    "inputLabel": "Входной текст",
    "placeholder": "Введите текст для конвертации. Поддерживаются пробелы, дефисы, подчёркивания, camelCase и т.д.",
    "clear": "Очистить",
    "copy": "Копировать",
    "copied": "Скопировано!",
    "emptyHint": "Введите текст выше",
    "upper": "ВСЕ ЗАГЛАВНЫЕ",
    "lower": "все строчные",
    "title": "Заглавные слова",
    "sentence": "Начало предложения",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "ar": {
    "title_page": "محوّل حالة الأحرف",
    "inputLabel": "النص المدخل",
    "placeholder": "أدخل النص للتحويل. يدعم المسافات والشرطات والشرطات السفلية وcamelCase وما إلى ذلك.",
    "clear": "مسح",
    "copy": "نسخ",
    "copied": "تم النسخ!",
    "emptyHint": "أدخل نصاً أعلاه",
    "upper": "أحرف كبيرة كلها",
    "lower": "أحرف صغيرة كلها",
    "title": "حالة العنوان",
    "sentence": "حالة الجملة",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "hi": {
    "title_page": "केस कनवर्टर",
    "inputLabel": "इनपुट टेक्स्ट",
    "placeholder": "कनवर्ट करने के लिए टेक्स्ट दर्ज करें। स्पेस, हाइफन, अंडरस्कोर, camelCase आदि का समर्थन करता है।",
    "clear": "साफ़ करें",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया!",
    "emptyHint": "ऊपर कुछ टेक्स्ट दर्ज करें",
    "upper": "सभी बड़े अक्षर (UPPER CASE)",
    "lower": "सभी छोटे अक्षर (lower case)",
    "title": "शीर्षक केस (Title Case)",
    "sentence": "वाक्य केस",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "it": {
    "title_page": "Convertitore maiuscole/minuscole",
    "inputLabel": "Testo di input",
    "placeholder": "Inserisci il testo da convertire. Supporta spazi, trattini, underscore, camelCase, ecc.",
    "clear": "Cancella",
    "copy": "Copia",
    "copied": "Copiato!",
    "emptyHint": "Inserisci del testo sopra",
    "upper": "MAIUSCOLO",
    "lower": "minuscolo",
    "title": "Formato Titolo",
    "sentence": "Formato frase",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "nl": {
    "title_page": "Hoofdletter converter",
    "inputLabel": "Invoertekst",
    "placeholder": "Voer tekst in om te converteren. Ondersteunt spaties, koppeltekens, underscores, camelCase, enz.",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "copied": "Gekopieerd!",
    "emptyHint": "Voer hierboven tekst in",
    "upper": "HOOFDLETTERS",
    "lower": "kleine letters",
    "title": "Titelnotatie",
    "sentence": "Zinnotatie",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "tr": {
    "title_page": "Büyük/Küçük Harf Dönüştürücü",
    "inputLabel": "Giriş Metni",
    "placeholder": "Dönüştürülecek metni girin. Boşluk, kısa çizgi, alt çizgi, camelCase vb. desteklenir.",
    "clear": "Temizle",
    "copy": "Kopyala",
    "copied": "Kopyalandı!",
    "emptyHint": "Yukarıya bir metin girin",
    "upper": "BÜYÜK HARF",
    "lower": "küçük harf",
    "title": "Başlık Biçimi",
    "sentence": "Cümle Biçimi",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "vi": {
    "title_page": "Chuyển đổi chữ hoa/thường",
    "inputLabel": "Văn bản đầu vào",
    "placeholder": "Nhập văn bản để chuyển đổi. Hỗ trợ khoảng trắng, dấu gạch ngang, gạch dưới, camelCase, v.v.",
    "clear": "Xóa",
    "copy": "Sao chép",
    "copied": "Đã sao chép!",
    "emptyHint": "Nhập văn bản ở trên",
    "upper": "CHỮ HOA TẤT CẢ",
    "lower": "chữ thường tất cả",
    "title": "Chữ Hoa Đầu Từ",
    "sentence": "Chữ hoa đầu câu",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "th": {
    "title_page": "แปลงตัวพิมพ์ใหญ่/เล็ก",
    "inputLabel": "ข้อความที่ป้อน",
    "placeholder": "ป้อนข้อความที่ต้องการแปลง รองรับช่องว่าง ขีดกลาง ขีดล่าง camelCase ฯลฯ",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว!",
    "emptyHint": "กรุณาป้อนข้อความด้านบน",
    "upper": "ตัวพิมพ์ใหญ่ทั้งหมด",
    "lower": "ตัวพิมพ์เล็กทั้งหมด",
    "title": "รูปแบบหัวเรื่อง (Title Case)",
    "sentence": "รูปแบบประโยค",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "id": {
    "title_page": "Konverter Huruf Besar/Kecil",
    "inputLabel": "Teks Masukan",
    "placeholder": "Masukkan teks untuk dikonversi. Mendukung spasi, tanda hubung, garis bawah, camelCase, dll.",
    "clear": "Hapus",
    "copy": "Salin",
    "copied": "Disalin!",
    "emptyHint": "Masukkan teks di atas",
    "upper": "HURUF BESAR SEMUA",
    "lower": "huruf kecil semua",
    "title": "Format Judul (Title Case)",
    "sentence": "Format kalimat",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "sv": {
    "title_page": "Skiftlägesomvandlare",
    "inputLabel": "Inmatningstext",
    "placeholder": "Ange text att konvertera. Stöder blanksteg, bindestreck, understreck, camelCase etc.",
    "clear": "Rensa",
    "copy": "Kopiera",
    "copied": "Kopierat!",
    "emptyHint": "Skriv in text ovan",
    "upper": "VERSALER",
    "lower": "gemener",
    "title": "Titelformat",
    "sentence": "Meningsformat",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "pl": {
    "title_page": "Konwerter wielkości liter",
    "inputLabel": "Tekst wejściowy",
    "placeholder": "Wprowadź tekst do konwersji. Obsługuje spacje, myślniki, podkreślenia, camelCase itp.",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "copied": "Skopiowano!",
    "emptyHint": "Wprowadź tekst powyżej",
    "upper": "WIELKIE LITERY",
    "lower": "małe litery",
    "title": "Format tytułu",
    "sentence": "Format zdania",
    "camel": "camelCase",
    "pascal": "PascalCase",
    "snake": "snake_case",
    "constant": "CONSTANT_CASE",
    "kebab": "kebab-case",
    "dot": "dot.case"
  },
  "zh-TW": {
    "title_page": "大小寫轉換",
    "inputLabel": "輸入文字",
    "placeholder": "輸入要轉換的文字，支援空格、連字符、底線、駝峰等格式...",
    "clear": "清空",
    "copy": "複製",
    "copied": "已複製",
    "emptyHint": "請在上方輸入文字",
    "upper": "全大寫",
    "lower": "全小寫",
    "title": "標題大小寫",
    "sentence": "句首大寫",
    "camel": "駝峰命名 (camelCase)",
    "pascal": "帕斯卡命名 (PascalCase)",
    "snake": "底線命名 (snake_case)",
    "constant": "常數命名 (CONSTANT_CASE)",
    "kebab": "短橫線命名 (kebab-case)",
    "dot": "點分命名 (dot.case)"
  }
}
</i18n>
