<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const inputValue = ref("8")
const mode = ref<"toRoman" | "toArabic">("toRoman")

const ROMAN_MAP: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
]

function arabicToRoman(num: number): string {
  if (num <= 0 || num > 3999) return ""
  let result = ""
  for (const [val, sym] of ROMAN_MAP) {
    while (num >= val) {
      result += sym
      num -= val
    }
  }
  return result
}

function romanToArabic(roman: string): number {
  const vals: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }
  let result = 0
  const str = roman.toUpperCase()
  for (let i = 0; i < str.length; i++) {
    const cur = vals[str[i]] ?? 0
    const next = vals[str[i + 1]] ?? 0
    if (cur < next) result -= cur
    else result += cur
  }
  return result
}

const result = computed(() => {
  const val = inputValue.value.trim()
  if (!val) return null

  if (mode.value === "toRoman") {
    const num = parseInt(val)
    if (isNaN(num) || num <= 0 || num > 3999) {
      return { error: t("errorRange") }
    }
    return { value: arabicToRoman(num) }
  } else {
    if (!/^[IVXLCDMivxlcdm]+$/.test(val)) {
      return { error: t("errorInvalid") }
    }
    const num = romanToArabic(val)
    if (num <= 0 || num > 3999) {
      return { error: t("errorInvalid") }
    }
    return { value: String(num) }
  }
})

function copyResult() {
  if (!result.value?.value) return
  navigator.clipboard.writeText(result.value.value).then(() => {
    ElMessage({ message: t("copied"), type: "success", duration: 1500 })
  })
}

function clear() {
  inputValue.value = ""
}
</script>

<template>
  <div class="roman-conv">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="mode-selector">
      <el-radio-group
        v-model="mode"
        size="large"
      >
        <el-radio-button value="toRoman">{{ t("toRoman") }}</el-radio-button>
        <el-radio-button value="toArabic">{{ t("toArabic") }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="input-area">
      <div class="input-header">
        <span class="label">{{
          mode === "toRoman" ? t("inputArabic") : t("inputRoman")
        }}</span>
        <el-button @click="clear">{{ t("clear") }}</el-button>
      </div>
      <el-input
        v-model="inputValue"
        :placeholder="
          mode === 'toRoman' ? t('placeholderArabic') : t('placeholderRoman')
        "
        size="large"
        clearable
        @keyup.enter="() => {}"
      />
      <div class="range-hint">{{ t("rangeHint") }}</div>
    </div>

    <template v-if="result">
      <div
        v-if="result.error"
        class="error-msg"
      >
        {{ result.error }}
      </div>
      <div
        v-else
        class="result-card"
      >
        <span class="result-label">{{ t("outputLabel") }}</span>
        <span class="result-value">{{ result.value }}</span>
        <el-button
          type="primary"
          @click="copyResult"
          >{{ t("copy") }}</el-button
        >
      </div>
    </template>

    <div
      v-else
      class="empty-hint"
    >
      {{ t("emptyHint") }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.roman-conv {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.mode-selector {
  margin-bottom: 28px;
}

.input-area {
  margin-bottom: 28px;
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

.range-hint {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.error-msg {
  padding: 16px 20px;
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-1);
  border-radius: 8px;
  color: var(--vp-c-danger-1);
  font-size: 0.95rem;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
}

.result-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.result-value {
  flex: 1;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.05em;
  word-break: break-all;
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
    "title_page": "罗马数字转换",
    "toRoman": "阿拉伯数字 → 罗马数字",
    "toArabic": "罗马数字 → 阿拉伯数字",
    "inputArabic": "输入阿拉伯数字",
    "inputRoman": "输入罗马数字",
    "placeholderArabic": "请输入 1 ~ 3999 之间的整数",
    "placeholderRoman": "请输入罗马数字，如 MMXXIV",
    "outputLabel": "转换结果",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制！",
    "emptyHint": "请在上方输入数字",
    "errorRange": "请输入 1 ~ 3999 之间的整数",
    "errorInvalid": "无效的罗马数字",
    "rangeHint": "支持范围：1 ~ 3999"
  },
  "en": {
    "title_page": "Roman Numeral Converter",
    "toRoman": "Arabic → Roman",
    "toArabic": "Roman → Arabic",
    "inputArabic": "Enter Arabic Number",
    "inputRoman": "Enter Roman Numeral",
    "placeholderArabic": "Enter an integer between 1 and 3999",
    "placeholderRoman": "Enter a Roman numeral, e.g. MMXXIV",
    "outputLabel": "Result",
    "clear": "Clear",
    "copy": "Copy",
    "copied": "Copied!",
    "emptyHint": "Enter a number above to convert",
    "errorRange": "Please enter an integer between 1 and 3999",
    "errorInvalid": "Invalid Roman numeral",
    "rangeHint": "Supported range: 1 ~ 3999"
  },
  "ja": {
    "title_page": "ローマ数字変換",
    "toRoman": "アラビア数字 → ローマ数字",
    "toArabic": "ローマ数字 → アラビア数字",
    "inputArabic": "アラビア数字を入力",
    "inputRoman": "ローマ数字を入力",
    "placeholderArabic": "1～3999 の整数を入力してください",
    "placeholderRoman": "ローマ数字を入力してください（例：MMXXIV）",
    "outputLabel": "変換結果",
    "clear": "クリア",
    "copy": "コピー",
    "copied": "コピーしました",
    "emptyHint": "上に数字を入力してください",
    "errorRange": "1～3999 の整数を入力してください",
    "errorInvalid": "無効なローマ数字です",
    "rangeHint": "対応範囲：1 ～ 3999"
  },
  "ko": {
    "title_page": "로마 숫자 변환",
    "toRoman": "아라비아 숫자 → 로마 숫자",
    "toArabic": "로마 숫자 → 아라비아 숫자",
    "inputArabic": "아라비아 숫자 입력",
    "inputRoman": "로마 숫자 입력",
    "placeholderArabic": "1 ~ 3999 사이의 정수를 입력하세요",
    "placeholderRoman": "로마 숫자를 입력하세요 (예: MMXXIV)",
    "outputLabel": "변환 결과",
    "clear": "지우기",
    "copy": "복사",
    "copied": "복사되었습니다!",
    "emptyHint": "위에 숫자를 입력하세요",
    "errorRange": "1 ~ 3999 사이의 정수를 입력하세요",
    "errorInvalid": "유효하지 않은 로마 숫자입니다",
    "rangeHint": "지원 범위: 1 ~ 3999"
  },
  "fr": {
    "title_page": "Convertisseur de chiffres romains",
    "toRoman": "Arabe → Romain",
    "toArabic": "Romain → Arabe",
    "inputArabic": "Entrez un nombre arabe",
    "inputRoman": "Entrez un chiffre romain",
    "placeholderArabic": "Entrez un entier entre 1 et 3999",
    "placeholderRoman": "Entrez un chiffre romain, ex. MMXXIV",
    "outputLabel": "Résultat",
    "clear": "Effacer",
    "copy": "Copier",
    "copied": "Copié !",
    "emptyHint": "Entrez un nombre ci-dessus pour convertir",
    "errorRange": "Veuillez entrer un entier entre 1 et 3999",
    "errorInvalid": "Chiffre romain invalide",
    "rangeHint": "Plage supportée : 1 ~ 3999"
  },
  "de": {
    "title_page": "Römische Zahlen Konverter",
    "toRoman": "Arabisch → Römisch",
    "toArabic": "Römisch → Arabisch",
    "inputArabic": "Arabische Zahl eingeben",
    "inputRoman": "Römische Zahl eingeben",
    "placeholderArabic": "Geben Sie eine ganze Zahl zwischen 1 und 3999 ein",
    "placeholderRoman": "Geben Sie eine römische Zahl ein, z.B. MMXXIV",
    "outputLabel": "Ergebnis",
    "clear": "Löschen",
    "copy": "Kopieren",
    "copied": "Kopiert!",
    "emptyHint": "Geben Sie oben eine Zahl ein",
    "errorRange": "Bitte geben Sie eine ganze Zahl zwischen 1 und 3999 ein",
    "errorInvalid": "Ungültige römische Zahl",
    "rangeHint": "Unterstützter Bereich: 1 ~ 3999"
  },
  "es": {
    "title_page": "Convertidor de números romanos",
    "toRoman": "Árabe → Romano",
    "toArabic": "Romano → Árabe",
    "inputArabic": "Ingresar número arábigo",
    "inputRoman": "Ingresar número romano",
    "placeholderArabic": "Ingrese un entero entre 1 y 3999",
    "placeholderRoman": "Ingrese un número romano, ej. MMXXIV",
    "outputLabel": "Resultado",
    "clear": "Limpiar",
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "emptyHint": "Ingrese un número arriba para convertir",
    "errorRange": "Por favor ingrese un entero entre 1 y 3999",
    "errorInvalid": "Número romano inválido",
    "rangeHint": "Rango soportado: 1 ~ 3999"
  },
  "pt": {
    "title_page": "Conversor de números romanos",
    "toRoman": "Árabe → Romano",
    "toArabic": "Romano → Árabe",
    "inputArabic": "Inserir número arábico",
    "inputRoman": "Inserir número romano",
    "placeholderArabic": "Insira um inteiro entre 1 e 3999",
    "placeholderRoman": "Insira um número romano, ex. MMXXIV",
    "outputLabel": "Resultado",
    "clear": "Limpar",
    "copy": "Copiar",
    "copied": "Copiado!",
    "emptyHint": "Insira um número acima para converter",
    "errorRange": "Por favor insira um inteiro entre 1 e 3999",
    "errorInvalid": "Número romano inválido",
    "rangeHint": "Intervalo suportado: 1 ~ 3999"
  },
  "ru": {
    "title_page": "Конвертер римских цифр",
    "toRoman": "Арабские → Римские",
    "toArabic": "Римские → Арабские",
    "inputArabic": "Введите арабское число",
    "inputRoman": "Введите римское число",
    "placeholderArabic": "Введите целое число от 1 до 3999",
    "placeholderRoman": "Введите римское число, напр. MMXXIV",
    "outputLabel": "Результат",
    "clear": "Очистить",
    "copy": "Копировать",
    "copied": "Скопировано!",
    "emptyHint": "Введите число выше для конвертации",
    "errorRange": "Введите целое число от 1 до 3999",
    "errorInvalid": "Неверное римское число",
    "rangeHint": "Поддерживаемый диапазон: 1 ~ 3999"
  },
  "ar": {
    "title_page": "محوّل الأرقام الرومانية",
    "toRoman": "عربي → روماني",
    "toArabic": "روماني → عربي",
    "inputArabic": "أدخل رقمًا عربيًا",
    "inputRoman": "أدخل رقمًا رومانيًا",
    "placeholderArabic": "أدخل عددًا صحيحًا بين 1 و 3999",
    "placeholderRoman": "أدخل رقمًا رومانيًا، مثل MMXXIV",
    "outputLabel": "النتيجة",
    "clear": "مسح",
    "copy": "نسخ",
    "copied": "تم النسخ!",
    "emptyHint": "أدخل رقمًا أعلاه للتحويل",
    "errorRange": "يرجى إدخال عدد صحيح بين 1 و 3999",
    "errorInvalid": "رقم روماني غير صالح",
    "rangeHint": "النطاق المدعوم: 1 ~ 3999"
  },
  "hi": {
    "title_page": "रोमन अंक परिवर्तक",
    "toRoman": "अरेबिक → रोमन",
    "toArabic": "रोमन → अरेबिक",
    "inputArabic": "अरेबिक संख्या दर्ज करें",
    "inputRoman": "रोमन अंक दर्ज करें",
    "placeholderArabic": "1 से 3999 के बीच पूर्णांक दर्ज करें",
    "placeholderRoman": "रोमन अंक दर्ज करें, जैसे MMXXIV",
    "outputLabel": "परिणाम",
    "clear": "साफ़ करें",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया!",
    "emptyHint": "परिवर्तित करने के लिए ऊपर संख्या दर्ज करें",
    "errorRange": "कृपया 1 से 3999 के बीच पूर्णांक दर्ज करें",
    "errorInvalid": "अमान्य रोमन अंक",
    "rangeHint": "समर्थित सीमा: 1 ~ 3999"
  },
  "it": {
    "title_page": "Convertitore di numeri romani",
    "toRoman": "Arabo → Romano",
    "toArabic": "Romano → Arabo",
    "inputArabic": "Inserire numero arabo",
    "inputRoman": "Inserire numero romano",
    "placeholderArabic": "Inserire un intero tra 1 e 3999",
    "placeholderRoman": "Inserire un numero romano, es. MMXXIV",
    "outputLabel": "Risultato",
    "clear": "Cancella",
    "copy": "Copia",
    "copied": "Copiato!",
    "emptyHint": "Inserire un numero sopra per convertire",
    "errorRange": "Inserire un intero tra 1 e 3999",
    "errorInvalid": "Numero romano non valido",
    "rangeHint": "Intervallo supportato: 1 ~ 3999"
  },
  "nl": {
    "title_page": "Romeinse cijfer converter",
    "toRoman": "Arabisch → Romeins",
    "toArabic": "Romeins → Arabisch",
    "inputArabic": "Arabisch getal invoeren",
    "inputRoman": "Romeins cijfer invoeren",
    "placeholderArabic": "Voer een geheel getal in tussen 1 en 3999",
    "placeholderRoman": "Voer een Romeins cijfer in, bijv. MMXXIV",
    "outputLabel": "Resultaat",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "copied": "Gekopieerd!",
    "emptyHint": "Voer hierboven een getal in om te converteren",
    "errorRange": "Voer een geheel getal in tussen 1 en 3999",
    "errorInvalid": "Ongeldig Romeins cijfer",
    "rangeHint": "Ondersteund bereik: 1 ~ 3999"
  },
  "tr": {
    "title_page": "Roma Rakamı Dönüştürücü",
    "toRoman": "Arap → Roma",
    "toArabic": "Roma → Arap",
    "inputArabic": "Arap rakamı girin",
    "inputRoman": "Roma rakamı girin",
    "placeholderArabic": "1 ile 3999 arasında bir tam sayı girin",
    "placeholderRoman": "Roma rakamı girin, örn. MMXXIV",
    "outputLabel": "Sonuç",
    "clear": "Temizle",
    "copy": "Kopyala",
    "copied": "Kopyalandı!",
    "emptyHint": "Dönüştürmek için yukarıya bir sayı girin",
    "errorRange": "Lütfen 1 ile 3999 arasında bir tam sayı girin",
    "errorInvalid": "Geçersiz Roma rakamı",
    "rangeHint": "Desteklenen aralık: 1 ~ 3999"
  },
  "vi": {
    "title_page": "Chuyển đổi số La Mã",
    "toRoman": "Ả Rập → La Mã",
    "toArabic": "La Mã → Ả Rập",
    "inputArabic": "Nhập số Ả Rập",
    "inputRoman": "Nhập số La Mã",
    "placeholderArabic": "Nhập số nguyên từ 1 đến 3999",
    "placeholderRoman": "Nhập số La Mã, ví dụ MMXXIV",
    "outputLabel": "Kết quả",
    "clear": "Xóa",
    "copy": "Sao chép",
    "copied": "Đã sao chép!",
    "emptyHint": "Nhập số ở trên để chuyển đổi",
    "errorRange": "Vui lòng nhập số nguyên từ 1 đến 3999",
    "errorInvalid": "Số La Mã không hợp lệ",
    "rangeHint": "Phạm vi hỗ trợ: 1 ~ 3999"
  },
  "th": {
    "title_page": "แปลงเลขโรมัน",
    "toRoman": "อาหรับ → โรมัน",
    "toArabic": "โรมัน → อาหรับ",
    "inputArabic": "ป้อนเลขอาหรับ",
    "inputRoman": "ป้อนเลขโรมัน",
    "placeholderArabic": "ป้อนจำนวนเต็มระหว่าง 1 ถึง 3999",
    "placeholderRoman": "ป้อนเลขโรมัน เช่น MMXXIV",
    "outputLabel": "ผลลัพธ์",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว!",
    "emptyHint": "ป้อนตัวเลขด้านบนเพื่อแปลง",
    "errorRange": "กรุณาป้อนจำนวนเต็มระหว่าง 1 ถึง 3999",
    "errorInvalid": "เลขโรมันไม่ถูกต้อง",
    "rangeHint": "ช่วงที่รองรับ: 1 ~ 3999"
  },
  "id": {
    "title_page": "Konverter Angka Romawi",
    "toRoman": "Arab → Romawi",
    "toArabic": "Romawi → Arab",
    "inputArabic": "Masukkan angka Arab",
    "inputRoman": "Masukkan angka Romawi",
    "placeholderArabic": "Masukkan bilangan bulat antara 1 dan 3999",
    "placeholderRoman": "Masukkan angka Romawi, mis. MMXXIV",
    "outputLabel": "Hasil",
    "clear": "Hapus",
    "copy": "Salin",
    "copied": "Disalin!",
    "emptyHint": "Masukkan angka di atas untuk mengonversi",
    "errorRange": "Masukkan bilangan bulat antara 1 dan 3999",
    "errorInvalid": "Angka Romawi tidak valid",
    "rangeHint": "Rentang yang didukung: 1 ~ 3999"
  },
  "sv": {
    "title_page": "Romerska siffror konverterare",
    "toRoman": "Arabiska → Romerska",
    "toArabic": "Romerska → Arabiska",
    "inputArabic": "Ange arabiskt tal",
    "inputRoman": "Ange romersk siffra",
    "placeholderArabic": "Ange ett heltal mellan 1 och 3999",
    "placeholderRoman": "Ange en romersk siffra, t.ex. MMXXIV",
    "outputLabel": "Resultat",
    "clear": "Rensa",
    "copy": "Kopiera",
    "copied": "Kopierat!",
    "emptyHint": "Ange ett tal ovan för att konvertera",
    "errorRange": "Ange ett heltal mellan 1 och 3999",
    "errorInvalid": "Ogiltig romersk siffra",
    "rangeHint": "Stödda intervall: 1 ~ 3999"
  },
  "pl": {
    "title_page": "Konwerter cyfr rzymskich",
    "toRoman": "Arabskie → Rzymskie",
    "toArabic": "Rzymskie → Arabskie",
    "inputArabic": "Wprowadź liczbę arabską",
    "inputRoman": "Wprowadź cyfrę rzymską",
    "placeholderArabic": "Wprowadź liczbę całkowitą od 1 do 3999",
    "placeholderRoman": "Wprowadź cyfrę rzymską, np. MMXXIV",
    "outputLabel": "Wynik",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "copied": "Skopiowano!",
    "emptyHint": "Wprowadź liczbę powyżej, aby przekonwertować",
    "errorRange": "Wprowadź liczbę całkowitą od 1 do 3999",
    "errorInvalid": "Nieprawidłowa cyfra rzymska",
    "rangeHint": "Obsługiwany zakres: 1 ~ 3999"
  },
  "zh-TW": {
    "title_page": "羅馬數字轉換",
    "toRoman": "阿拉伯數字 → 羅馬數字",
    "toArabic": "羅馬數字 → 阿拉伯數字",
    "inputArabic": "輸入阿拉伯數字",
    "inputRoman": "輸入羅馬數字",
    "placeholderArabic": "請輸入 1 ~ 3999 之間的整數",
    "placeholderRoman": "請輸入羅馬數字，如 MMXXIV",
    "outputLabel": "轉換結果",
    "clear": "清空",
    "copy": "複製",
    "copied": "已複製！",
    "emptyHint": "請在上方輸入數字",
    "errorRange": "請輸入 1 ~ 3999 之間的整數",
    "errorInvalid": "無效的羅馬數字",
    "rangeHint": "支援範圍：1 ~ 3999"
  }
}
</i18n>
