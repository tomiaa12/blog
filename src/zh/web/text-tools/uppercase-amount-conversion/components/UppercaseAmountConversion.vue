<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const inputValue = ref("1000000")

const DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]

function convertSection(n: number): string {
  if (n === 0) return ""
  const d3 = Math.floor(n / 1000)
  const d2 = Math.floor((n % 1000) / 100)
  const d1 = Math.floor((n % 100) / 10)
  const d0 = n % 10
  let result = ""
  if (d3) result += DIGITS[d3] + "仟"
  if (d2) {
    result += DIGITS[d2] + "佰"
  } else if (d3 && (d1 || d0)) {
    result += "零"
  }
  if (d1) {
    result += DIGITS[d1] + "拾"
  } else if ((d3 || d2) && d0) {
    result += "零"
  }
  if (d0) result += DIGITS[d0]
  return result
}

function toChineseMoney(numStr: string): string {
  const num = parseFloat(numStr)
  if (isNaN(num) || !isFinite(num)) return ""
  if (Math.abs(num) > 999999999999.99) return t("errorRange")

  if (num === 0) return "零元整"

  const negative = num < 0
  const absNum = Math.round(Math.abs(num) * 100) / 100

  const total = Math.round(absNum * 100)
  const yuan = Math.floor(total / 100)
  const jiao = Math.floor((total % 100) / 10)
  const fen = total % 10

  let yuanStr = ""
  const yi = Math.floor(yuan / 100000000)
  const wan = Math.floor((yuan % 100000000) / 10000)
  const ge = yuan % 10000

  if (yi > 0) {
    yuanStr += convertSection(yi) + "亿"
    if (wan === 0 && ge > 0 && ge < 1000) yuanStr += "零"
  }
  if (wan > 0) {
    if (yi > 0 && wan < 1000) yuanStr += "零"
    yuanStr += convertSection(wan) + "万"
    if (ge > 0 && ge < 1000) yuanStr += "零"
  }
  if (ge > 0) {
    if ((yi > 0 || wan > 0) && ge < 1000) yuanStr += "零"
    yuanStr += convertSection(ge)
  }
  if (yuan === 0) yuanStr = "零"
  yuanStr += "元"

  let centsStr = ""
  if (jiao === 0 && fen === 0) {
    centsStr = "整"
  } else if (jiao === 0) {
    centsStr = "零" + DIGITS[fen] + "分"
  } else {
    centsStr = DIGITS[jiao] + "角"
    if (fen > 0) centsStr += DIGITS[fen] + "分"
  }

  return (negative ? "负" : "") + yuanStr + centsStr
}

const result = computed(() => {
  const val = inputValue.value.trim()
  if (!val) return null
  if (!/^-?\d+(\.\d{0,2})?$/.test(val)) return { error: t("errorInvalid") }
  const converted = toChineseMoney(val)
  if (converted === t("errorRange")) return { error: converted }
  return { value: converted }
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
  <div class="amount-conv">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="input-area">
      <div class="input-header">
        <span class="label">{{ t("inputLabel") }}</span>
        <el-button @click="clear">{{ t("clear") }}</el-button>
      </div>
      <el-input
        v-model="inputValue"
        :placeholder="t('placeholder')"
        size="large"
        clearable
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

    <div class="examples">
      <div class="examples-title">{{ t("examplesTitle") }}</div>
      <div class="example-list">
        <span
          v-for="ex in ['1234.56', '100000', '0.05', '9999999999.99']"
          :key="ex"
          class="example-item"
          @click="inputValue = ex"
          >{{ ex }}</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.amount-conv {
  max-width: 800px;
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
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.02em;
  word-break: break-all;
}

.empty-hint {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
  padding: 48px 0 16px;
}

.examples {
  margin-top: 32px;
  padding-top: 24px;
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
  font-family: var(--vp-font-family-mono);

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "大写金额转换",
    "inputLabel": "输入金额（数字）",
    "placeholder": "请输入金额，如 1234.56",
    "outputLabel": "大写金额",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制！",
    "emptyHint": "请在上方输入金额",
    "errorInvalid": "请输入有效的数字，最多保留两位小数",
    "errorRange": "金额超出范围（最大支持 9999 亿）",
    "rangeHint": "支持最多两位小数，最大金额 9999 亿",
    "examplesTitle": "示例"
  },
  "en": {
    "title_page": "Chinese Financial Amount Converter",
    "inputLabel": "Enter Amount (Number)",
    "placeholder": "Enter an amount, e.g. 1234.56",
    "outputLabel": "Chinese Uppercase Amount",
    "clear": "Clear",
    "copy": "Copy",
    "copied": "Copied!",
    "emptyHint": "Enter an amount above to convert",
    "errorInvalid": "Please enter a valid number with at most 2 decimal places",
    "errorRange": "Amount out of range (max 999.99 billion)",
    "rangeHint": "Supports up to 2 decimal places, max 999.99 billion",
    "examplesTitle": "Examples"
  },
  "ja": {
    "title_page": "中国語大文字金額変換",
    "inputLabel": "金額を入力（数字）",
    "placeholder": "金額を入力してください、例：1234.56",
    "outputLabel": "大文字金額",
    "clear": "クリア",
    "copy": "コピー",
    "copied": "コピーしました",
    "emptyHint": "上に金額を入力してください",
    "errorInvalid": "有効な数字を入力してください（小数点以下2桁まで）",
    "errorRange": "金額が範囲外です（最大 9999億）",
    "rangeHint": "小数点以下2桁まで、最大金額 9999億",
    "examplesTitle": "例"
  },
  "ko": {
    "title_page": "중국어 금액 대문자 변환",
    "inputLabel": "금액 입력 (숫자)",
    "placeholder": "금액을 입력하세요, 예: 1234.56",
    "outputLabel": "대문자 금액",
    "clear": "지우기",
    "copy": "복사",
    "copied": "복사되었습니다!",
    "emptyHint": "위에 금액을 입력하세요",
    "errorInvalid": "소수점 이하 2자리까지의 유효한 숫자를 입력하세요",
    "errorRange": "금액이 범위를 초과합니다 (최대 9999억)",
    "rangeHint": "소수점 이하 2자리 지원, 최대 9999억",
    "examplesTitle": "예시"
  },
  "fr": {
    "title_page": "Convertisseur de montant en chinois",
    "inputLabel": "Entrer le montant (nombre)",
    "placeholder": "Entrez un montant, ex. 1234.56",
    "outputLabel": "Montant en chinois traditionnel",
    "clear": "Effacer",
    "copy": "Copier",
    "copied": "Copié !",
    "emptyHint": "Entrez un montant ci-dessus",
    "errorInvalid": "Entrez un nombre valide avec au plus 2 décimales",
    "errorRange": "Montant hors plage (max 999,99 milliards)",
    "rangeHint": "Jusqu'à 2 décimales, max 999,99 milliards",
    "examplesTitle": "Exemples"
  },
  "de": {
    "title_page": "Chinesischer Betrag-Konverter",
    "inputLabel": "Betrag eingeben (Zahl)",
    "placeholder": "Betrag eingeben, z.B. 1234.56",
    "outputLabel": "Chinesischer Großbuchstaben-Betrag",
    "clear": "Löschen",
    "copy": "Kopieren",
    "copied": "Kopiert!",
    "emptyHint": "Geben Sie oben einen Betrag ein",
    "errorInvalid": "Bitte geben Sie eine gültige Zahl mit max. 2 Dezimalstellen ein",
    "errorRange": "Betrag außerhalb des Bereichs (max. 999,99 Mrd.)",
    "rangeHint": "Max. 2 Dezimalstellen, max. Betrag 999,99 Mrd.",
    "examplesTitle": "Beispiele"
  },
  "es": {
    "title_page": "Convertidor de monto en chino",
    "inputLabel": "Ingresar monto (número)",
    "placeholder": "Ingrese un monto, ej. 1234.56",
    "outputLabel": "Monto en chino mayúscula",
    "clear": "Limpiar",
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "emptyHint": "Ingrese un monto arriba",
    "errorInvalid": "Ingrese un número válido con máximo 2 decimales",
    "errorRange": "Monto fuera de rango (máx. 999,99 mil millones)",
    "rangeHint": "Soporta hasta 2 decimales, máximo 999,99 mil millones",
    "examplesTitle": "Ejemplos"
  },
  "pt": {
    "title_page": "Conversor de valor em chinês",
    "inputLabel": "Inserir valor (número)",
    "placeholder": "Insira um valor, ex. 1234.56",
    "outputLabel": "Valor em chinês maiúsculo",
    "clear": "Limpar",
    "copy": "Copiar",
    "copied": "Copiado!",
    "emptyHint": "Insira um valor acima",
    "errorInvalid": "Insira um número válido com no máximo 2 casas decimais",
    "errorRange": "Valor fora do intervalo (máx. 999,99 bilhões)",
    "rangeHint": "Suporta até 2 casas decimais, máximo 999,99 bilhões",
    "examplesTitle": "Exemplos"
  },
  "ru": {
    "title_page": "Конвертер суммы на китайский",
    "inputLabel": "Введите сумму (число)",
    "placeholder": "Введите сумму, напр. 1234.56",
    "outputLabel": "Сумма прописью по-китайски",
    "clear": "Очистить",
    "copy": "Копировать",
    "copied": "Скопировано!",
    "emptyHint": "Введите сумму выше",
    "errorInvalid": "Введите допустимое число с не более чем 2 знаками после запятой",
    "errorRange": "Сумма вне диапазона (макс. 999,99 млрд)",
    "rangeHint": "До 2 знаков после запятой, макс. 999,99 млрд",
    "examplesTitle": "Примеры"
  },
  "ar": {
    "title_page": "محوّل المبلغ إلى الصينية",
    "inputLabel": "أدخل المبلغ (رقم)",
    "placeholder": "أدخل مبلغاً، مثل 1234.56",
    "outputLabel": "المبلغ بالحروف الصينية",
    "clear": "مسح",
    "copy": "نسخ",
    "copied": "تم النسخ!",
    "emptyHint": "أدخل مبلغاً أعلاه",
    "errorInvalid": "أدخل رقماً صالحاً بما لا يزيد عن منزلتين عشريتين",
    "errorRange": "المبلغ خارج النطاق (الحد الأقصى 999.99 مليار)",
    "rangeHint": "يدعم حتى منزلتين عشريتين، الحد الأقصى 999.99 مليار",
    "examplesTitle": "أمثلة"
  },
  "hi": {
    "title_page": "चीनी वित्तीय राशि परिवर्तक",
    "inputLabel": "राशि दर्ज करें (संख्या)",
    "placeholder": "राशि दर्ज करें, जैसे 1234.56",
    "outputLabel": "चीनी बड़े अक्षरों में राशि",
    "clear": "साफ़ करें",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया!",
    "emptyHint": "ऊपर राशि दर्ज करें",
    "errorInvalid": "अधिकतम 2 दशमलव स्थानों के साथ एक वैध संख्या दर्ज करें",
    "errorRange": "राशि सीमा से बाहर है (अधिकतम 9999 अरब)",
    "rangeHint": "अधिकतम 2 दशमलव स्थान, अधिकतम 9999 अरब",
    "examplesTitle": "उदाहरण"
  },
  "it": {
    "title_page": "Convertitore importo in cinese",
    "inputLabel": "Inserire importo (numero)",
    "placeholder": "Inserire un importo, es. 1234.56",
    "outputLabel": "Importo in cinese maiuscolo",
    "clear": "Cancella",
    "copy": "Copia",
    "copied": "Copiato!",
    "emptyHint": "Inserire un importo sopra",
    "errorInvalid": "Inserire un numero valido con max 2 cifre decimali",
    "errorRange": "Importo fuori intervallo (max 999,99 miliardi)",
    "rangeHint": "Supporta fino a 2 cifre decimali, max 999,99 miliardi",
    "examplesTitle": "Esempi"
  },
  "nl": {
    "title_page": "Bedrag naar Chinees converteren",
    "inputLabel": "Bedrag invoeren (getal)",
    "placeholder": "Voer een bedrag in, bijv. 1234.56",
    "outputLabel": "Bedrag in Chinees",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "copied": "Gekopieerd!",
    "emptyHint": "Voer hierboven een bedrag in",
    "errorInvalid": "Voer een geldig getal in met max. 2 decimalen",
    "errorRange": "Bedrag buiten bereik (max. 999,99 miljard)",
    "rangeHint": "Max. 2 decimalen, max. 999,99 miljard",
    "examplesTitle": "Voorbeelden"
  },
  "tr": {
    "title_page": "Çince Tutar Dönüştürücü",
    "inputLabel": "Tutar girin (sayı)",
    "placeholder": "Bir tutar girin, örn. 1234.56",
    "outputLabel": "Çince büyük harf tutarı",
    "clear": "Temizle",
    "copy": "Kopyala",
    "copied": "Kopyalandı!",
    "emptyHint": "Yukarıya bir tutar girin",
    "errorInvalid": "En fazla 2 ondalık basamaklı geçerli bir sayı girin",
    "errorRange": "Tutar aralık dışında (maks. 999,99 milyar)",
    "rangeHint": "En fazla 2 ondalık basamak, maks. 999,99 milyar",
    "examplesTitle": "Örnekler"
  },
  "vi": {
    "title_page": "Chuyển đổi số tiền sang chữ Hán",
    "inputLabel": "Nhập số tiền",
    "placeholder": "Nhập số tiền, ví dụ 1234.56",
    "outputLabel": "Số tiền bằng chữ Hán",
    "clear": "Xóa",
    "copy": "Sao chép",
    "copied": "Đã sao chép!",
    "emptyHint": "Nhập số tiền ở trên",
    "errorInvalid": "Vui lòng nhập số hợp lệ với tối đa 2 chữ số thập phân",
    "errorRange": "Số tiền vượt phạm vi (tối đa 999,99 tỷ)",
    "rangeHint": "Hỗ trợ tối đa 2 chữ số thập phân, tối đa 999,99 tỷ",
    "examplesTitle": "Ví dụ"
  },
  "th": {
    "title_page": "แปลงจำนวนเงินเป็นภาษาจีน",
    "inputLabel": "ป้อนจำนวนเงิน (ตัวเลข)",
    "placeholder": "ป้อนจำนวนเงิน เช่น 1234.56",
    "outputLabel": "จำนวนเงินเป็นอักษรจีนตัวใหญ่",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว!",
    "emptyHint": "ป้อนจำนวนเงินด้านบน",
    "errorInvalid": "กรุณาป้อนตัวเลขที่ถูกต้องโดยมีทศนิยมไม่เกิน 2 ตำแหน่ง",
    "errorRange": "จำนวนเงินเกินช่วงที่รองรับ (สูงสุด 999.99 พันล้าน)",
    "rangeHint": "รองรับทศนิยมสูงสุด 2 ตำแหน่ง สูงสุด 999.99 พันล้าน",
    "examplesTitle": "ตัวอย่าง"
  },
  "id": {
    "title_page": "Konverter Jumlah ke Bahasa China",
    "inputLabel": "Masukkan jumlah (angka)",
    "placeholder": "Masukkan jumlah, mis. 1234.56",
    "outputLabel": "Jumlah dalam huruf besar China",
    "clear": "Hapus",
    "copy": "Salin",
    "copied": "Disalin!",
    "emptyHint": "Masukkan jumlah di atas",
    "errorInvalid": "Masukkan angka valid dengan maksimal 2 desimal",
    "errorRange": "Jumlah di luar rentang (maks. 999,99 miliar)",
    "rangeHint": "Mendukung hingga 2 desimal, maks. 999,99 miliar",
    "examplesTitle": "Contoh"
  },
  "sv": {
    "title_page": "Kinesisk beloppskonverterare",
    "inputLabel": "Ange belopp (tal)",
    "placeholder": "Ange ett belopp, t.ex. 1234.56",
    "outputLabel": "Belopp med kinesiska tecken",
    "clear": "Rensa",
    "copy": "Kopiera",
    "copied": "Kopierat!",
    "emptyHint": "Ange ett belopp ovan",
    "errorInvalid": "Ange ett giltigt tal med max 2 decimaler",
    "errorRange": "Beloppet är utanför intervallet (max 999,99 miljarder)",
    "rangeHint": "Stöder upp till 2 decimaler, max 999,99 miljarder",
    "examplesTitle": "Exempel"
  },
  "pl": {
    "title_page": "Konwerter kwoty na chiński",
    "inputLabel": "Wprowadź kwotę (liczba)",
    "placeholder": "Wprowadź kwotę, np. 1234.56",
    "outputLabel": "Kwota po chińsku dużymi literami",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "copied": "Skopiowano!",
    "emptyHint": "Wprowadź kwotę powyżej",
    "errorInvalid": "Wprowadź prawidłową liczbę z maksymalnie 2 miejscami po przecinku",
    "errorRange": "Kwota poza zakresem (maks. 999,99 mld)",
    "rangeHint": "Obsługuje do 2 miejsc po przecinku, maks. 999,99 mld",
    "examplesTitle": "Przykłady"
  },
  "zh-TW": {
    "title_page": "大寫金額轉換",
    "inputLabel": "輸入金額（數字）",
    "placeholder": "請輸入金額，如 1234.56",
    "outputLabel": "大寫金額",
    "clear": "清空",
    "copy": "複製",
    "copied": "已複製！",
    "emptyHint": "請在上方輸入金額",
    "errorInvalid": "請輸入有效數字，最多保留兩位小數",
    "errorRange": "金額超出範圍（最大支援 9999 億）",
    "rangeHint": "支援最多兩位小數，最大金額 9999 億",
    "examplesTitle": "範例"
  }
}
</i18n>
