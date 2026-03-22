<template>
  <div class="py-wrap">
    <div class="py-header">
      <h1 class="py-title">{{ t("title") }}</h1>
      <p class="py-desc">{{ t("desc") }}</p>
    </div>

    <div class="py-body">
      <div class="py-panel">
        <div class="py-panel-label">{{ t("inputLabel") }}</div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="8"
          :placeholder="t('inputPlaceholder')"
          class="py-textarea"
          @input="handleConvert"
        />
      </div>

      <div class="py-options">
        <div class="py-option-row">
          <span class="py-option-label">{{ t("toneLabel") }}</span>
          <el-radio-group
            v-model="toneType"
            @change="handleConvert"
          >
            <el-radio-button value="symbol">{{
              t("toneSymbol")
            }}</el-radio-button>
            <el-radio-button value="num">{{ t("toneNum") }}</el-radio-button>
            <el-radio-button value="none">{{ t("toneNone") }}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="py-option-row">
          <span class="py-option-label">{{ t("modeLabel") }}</span>
          <el-radio-group
            v-model="outputMode"
            @change="handleConvert"
          >
            <el-radio-button value="pinyin">{{
              t("modePinyin")
            }}</el-radio-button>
            <el-radio-button value="above">{{
              t("modeAbove")
            }}</el-radio-button>
            <el-radio-button value="bopomofo">{{
              t("modeBopomofo")
            }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="py-panel">
        <div class="py-panel-header">
          <span class="py-panel-label">{{ t("outputLabel") }}</span>
          <el-button
            size="small"
            :disabled="outputMode === 'above' ? !outputHtml : !outputText"
            @click="handleCopy"
            >{{ copied ? t("copied") : t("copy") }}</el-button
          >
        </div>
        <div
          v-if="loading"
          class="py-loading"
        >
          <el-icon class="is-loading"><Loading /></el-icon>
          {{ t("loading") }}
        </div>
        <div
          v-else-if="error"
          class="py-error"
        >
          {{ error }}
        </div>
        <!-- ruby 注音模式：渲染 HTML，不可直接放 textarea -->
        <div
          v-else-if="outputMode === 'above'"
          class="py-ruby-output"
          v-html="outputHtml"
        />
        <el-input
          v-else
          v-model="outputText"
          type="textarea"
          :rows="8"
          readonly
          class="py-textarea"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { Loading } from "@element-plus/icons-vue"
import { loadFirstAvailable, loadScript } from "@/utils"

const { t } = useI18n()

const inputText = ref("")
const outputText = ref("")
const outputHtml = ref("")
const toneType = ref<"symbol" | "num" | "none">("symbol")
const outputMode = ref<"pinyin" | "above" | "bopomofo">("pinyin")
const loading = ref(false)
const error = ref("")
const copied = ref(false)

type PinyinProModule = {
  pinyin: (text: string, options?: Record<string, unknown>) => string
}
let pinyinPro: PinyinProModule | null = null

async function ensurePinyinPro() {
  if (pinyinPro) return
  loading.value = true
  error.value = ""
  try {
    pinyinPro = await loadFirstAvailable(
      [
        "https://cdn.jsdelivr.net/npm/pinyin-pro@3.28.0/dist/index.js",
        "https://unpkg.com/pinyin-pro@3.28.0/dist/index.js",
      ],
      async url => {
        const win = await loadScript(url)
        return (win as any).pinyinPro as PinyinProModule
      }
    )
  } catch (e: any) {
    pinyinPro = null
    error.value = t("loadError")
    throw e
  } finally {
    loading.value = false
  }
}

async function handleConvert() {
  if (!inputText.value.trim()) {
    outputText.value = ""
    outputHtml.value = ""
    return
  }
  await ensurePinyinPro()
  if (!pinyinPro) return

  const { pinyin } = pinyinPro

  if (outputMode.value === "above") {
    // pinyin-pro 无 type:'html'，逐字取拼音后手动拼 ruby 标签
    const chars = [...inputText.value]
    const html = chars
      .map(char => {
        if (/[\u4e00-\u9fa5]/.test(char)) {
          const py = pinyin(char, { toneType: toneType.value, type: "string" })
          return `<ruby>${char}<rt>${py}</rt></ruby>`
        }
        if (char === "\n") return "<br>"
        return char
      })
      .join("")
    outputHtml.value = html
    outputText.value = ""
    return
  }

  outputHtml.value = ""

  if (outputMode.value === "bopomofo") {
    outputText.value = pinyin(inputText.value, {
      toneType: "symbol",
      type: "string",
      separator: " ",
      pattern: "bopomofo",
    } as any)
    return
  }

  outputText.value = pinyin(inputText.value, {
    toneType: toneType.value,
    type: "string",
    separator: " ",
  })
}

async function handleCopy() {
  const text =
    outputMode.value === "above"
      ? outputHtml.value
          .replace(/<rt>(.*?)<\/rt>/g, "($1)")
          .replace(/<[^>]+>/g, "")
      : outputText.value
  if (!text) return
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<i18n lang="json">
{
  "zh": {
    "title": "拼音转换",
    "desc": "汉字转拼音，支持声调符号、数字声调、无声调及注音符号",
    "inputLabel": "输入汉字",
    "inputPlaceholder": "请输入要转换的汉字...",
    "toneLabel": "声调格式",
    "toneSymbol": "符号（ā）",
    "toneNum": "数字（a1）",
    "toneNone": "无声调",
    "modeLabel": "输出模式",
    "modePinyin": "拼音",
    "modeAbove": "拼音+汉字",
    "modeBopomofo": "注音符号",
    "outputLabel": "转换结果",
    "copy": "复制",
    "copied": "已复制",
    "loading": "加载中...",
    "loadError": "库加载失败，请检查网络后重试"
  },
  "en": {
    "title": "Pinyin Converter",
    "desc": "Convert Chinese characters to Pinyin with tone marks, numbers, or no tones",
    "inputLabel": "Input Chinese",
    "inputPlaceholder": "Enter Chinese characters to convert...",
    "toneLabel": "Tone Format",
    "toneSymbol": "Symbol (ā)",
    "toneNum": "Number (a1)",
    "toneNone": "No Tone",
    "modeLabel": "Output Mode",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + Chinese",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Result",
    "copy": "Copy",
    "copied": "Copied",
    "loading": "Loading...",
    "loadError": "Failed to load library, please check your network"
  },
  "ja": {
    "title": "ピンイン変換",
    "desc": "漢字をピンインに変換。声調記号・数字・なしに対応",
    "inputLabel": "漢字を入力",
    "inputPlaceholder": "変換する漢字を入力してください...",
    "toneLabel": "声調フォーマット",
    "toneSymbol": "記号（ā）",
    "toneNum": "数字（a1）",
    "toneNone": "声調なし",
    "modeLabel": "出力モード",
    "modePinyin": "ピンイン",
    "modeAbove": "ピンイン＋漢字",
    "modeBopomofo": "注音符号",
    "outputLabel": "変換結果",
    "copy": "コピー",
    "copied": "コピー済み",
    "loading": "読み込み中...",
    "loadError": "ライブラリの読み込みに失敗しました"
  },
  "ko": {
    "title": "병음 변환",
    "desc": "한자를 병음으로 변환. 성조 기호, 숫자, 없음 지원",
    "inputLabel": "한자 입력",
    "inputPlaceholder": "변환할 한자를 입력하세요...",
    "toneLabel": "성조 형식",
    "toneSymbol": "기호（ā）",
    "toneNum": "숫자（a1）",
    "toneNone": "성조 없음",
    "modeLabel": "출력 모드",
    "modePinyin": "병음",
    "modeAbove": "병음 + 한자",
    "modeBopomofo": "주음부호",
    "outputLabel": "변환 결과",
    "copy": "복사",
    "copied": "복사됨",
    "loading": "로딩 중...",
    "loadError": "라이브러리 로드 실패, 네트워크를 확인하세요"
  },
  "fr": {
    "title": "Convertisseur Pinyin",
    "desc": "Convertir les caractères chinois en Pinyin avec tons, chiffres ou sans tons",
    "inputLabel": "Saisir le chinois",
    "inputPlaceholder": "Entrez les caractères chinois à convertir...",
    "toneLabel": "Format des tons",
    "toneSymbol": "Symbole (ā)",
    "toneNum": "Chiffre (a1)",
    "toneNone": "Sans ton",
    "modeLabel": "Mode de sortie",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + chinois",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Résultat",
    "copy": "Copier",
    "copied": "Copié",
    "loading": "Chargement...",
    "loadError": "Échec du chargement de la bibliothèque"
  },
  "de": {
    "title": "Pinyin-Konverter",
    "desc": "Chinesische Zeichen in Pinyin umwandeln mit Tonzeichen, Zahlen oder ohne",
    "inputLabel": "Chinesisch eingeben",
    "inputPlaceholder": "Chinesische Zeichen zum Konvertieren eingeben...",
    "toneLabel": "Tonformat",
    "toneSymbol": "Symbol (ā)",
    "toneNum": "Zahl (a1)",
    "toneNone": "Kein Ton",
    "modeLabel": "Ausgabemodus",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + Chinesisch",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Ergebnis",
    "copy": "Kopieren",
    "copied": "Kopiert",
    "loading": "Laden...",
    "loadError": "Bibliothek konnte nicht geladen werden"
  },
  "es": {
    "title": "Conversor de Pinyin",
    "desc": "Convierte caracteres chinos a Pinyin con tonos, números o sin tonos",
    "inputLabel": "Ingresar chino",
    "inputPlaceholder": "Ingresa los caracteres chinos a convertir...",
    "toneLabel": "Formato de tono",
    "toneSymbol": "Símbolo (ā)",
    "toneNum": "Número (a1)",
    "toneNone": "Sin tono",
    "modeLabel": "Modo de salida",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + chino",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Resultado",
    "copy": "Copiar",
    "copied": "Copiado",
    "loading": "Cargando...",
    "loadError": "Error al cargar la biblioteca"
  },
  "pt": {
    "title": "Conversor de Pinyin",
    "desc": "Converta caracteres chineses em Pinyin com tons, números ou sem tons",
    "inputLabel": "Inserir chinês",
    "inputPlaceholder": "Insira os caracteres chineses para converter...",
    "toneLabel": "Formato de tom",
    "toneSymbol": "Símbolo (ā)",
    "toneNum": "Número (a1)",
    "toneNone": "Sem tom",
    "modeLabel": "Modo de saída",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + chinês",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Resultado",
    "copy": "Copiar",
    "copied": "Copiado",
    "loading": "Carregando...",
    "loadError": "Falha ao carregar a biblioteca"
  },
  "ru": {
    "title": "Конвертер пиньинь",
    "desc": "Конвертирует китайские иероглифы в пиньинь с тонами, цифрами или без",
    "inputLabel": "Введите китайский",
    "inputPlaceholder": "Введите китайские иероглифы для конвертации...",
    "toneLabel": "Формат тона",
    "toneSymbol": "Символ (ā)",
    "toneNum": "Цифра (a1)",
    "toneNone": "Без тона",
    "modeLabel": "Режим вывода",
    "modePinyin": "Пиньинь",
    "modeAbove": "Пиньинь + иероглифы",
    "modeBopomofo": "Бопомофо",
    "outputLabel": "Результат",
    "copy": "Копировать",
    "copied": "Скопировано",
    "loading": "Загрузка...",
    "loadError": "Не удалось загрузить библиотеку"
  },
  "ar": {
    "title": "محوّل البينيين",
    "desc": "تحويل الحروف الصينية إلى بينيين مع علامات النبرة أو الأرقام أو بدونها",
    "inputLabel": "أدخل النص الصيني",
    "inputPlaceholder": "أدخل الحروف الصينية للتحويل...",
    "toneLabel": "تنسيق النبرة",
    "toneSymbol": "رمز (ā)",
    "toneNum": "رقم (a1)",
    "toneNone": "بدون نبرة",
    "modeLabel": "وضع الإخراج",
    "modePinyin": "بينيين",
    "modeAbove": "بينيين + صيني",
    "modeBopomofo": "بوبوموفو",
    "outputLabel": "النتيجة",
    "copy": "نسخ",
    "copied": "تم النسخ",
    "loading": "جارٍ التحميل...",
    "loadError": "فشل تحميل المكتبة"
  },
  "hi": {
    "title": "पिनयिन कनवर्टर",
    "desc": "चीनी वर्णों को पिनयिन में बदलें - टोन चिह्न, संख्या या बिना टोन के",
    "inputLabel": "चीनी टेक्स्ट दर्ज करें",
    "inputPlaceholder": "रूपांतरित करने के लिए चीनी वर्ण दर्ज करें...",
    "toneLabel": "टोन प्रारूप",
    "toneSymbol": "चिह्न (ā)",
    "toneNum": "संख्या (a1)",
    "toneNone": "टोन नहीं",
    "modeLabel": "आउटपुट मोड",
    "modePinyin": "पिनयिन",
    "modeAbove": "पिनयिन + चीनी",
    "modeBopomofo": "बोपोमोफो",
    "outputLabel": "परिणाम",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया",
    "loading": "लोड हो रहा है...",
    "loadError": "लाइब्रेरी लोड करने में विफल"
  },
  "it": {
    "title": "Convertitore Pinyin",
    "desc": "Converti caratteri cinesi in Pinyin con toni, numeri o senza toni",
    "inputLabel": "Inserisci cinese",
    "inputPlaceholder": "Inserisci i caratteri cinesi da convertire...",
    "toneLabel": "Formato tono",
    "toneSymbol": "Simbolo (ā)",
    "toneNum": "Numero (a1)",
    "toneNone": "Senza tono",
    "modeLabel": "Modalità output",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + cinese",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Risultato",
    "copy": "Copia",
    "copied": "Copiato",
    "loading": "Caricamento...",
    "loadError": "Impossibile caricare la libreria"
  },
  "nl": {
    "title": "Pinyin Converter",
    "desc": "Converteer Chinese tekens naar Pinyin met toonmarkeringen, cijfers of zonder tonen",
    "inputLabel": "Voer Chinees in",
    "inputPlaceholder": "Voer Chinese tekens in om te converteren...",
    "toneLabel": "Toonformaat",
    "toneSymbol": "Symbool (ā)",
    "toneNum": "Getal (a1)",
    "toneNone": "Geen toon",
    "modeLabel": "Uitvoermodus",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + Chinees",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Resultaat",
    "copy": "Kopiëren",
    "copied": "Gekopieerd",
    "loading": "Laden...",
    "loadError": "Bibliotheek laden mislukt"
  },
  "tr": {
    "title": "Pinyin Dönüştürücü",
    "desc": "Çince karakterleri ton işaretleri, sayılar veya tonsuz Pinyin'e dönüştürün",
    "inputLabel": "Çince Girin",
    "inputPlaceholder": "Dönüştürülecek Çince karakterleri girin...",
    "toneLabel": "Ton Formatı",
    "toneSymbol": "Sembol (ā)",
    "toneNum": "Sayı (a1)",
    "toneNone": "Tonsuz",
    "modeLabel": "Çıkış Modu",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + Çince",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Sonuç",
    "copy": "Kopyala",
    "copied": "Kopyalandı",
    "loading": "Yükleniyor...",
    "loadError": "Kütüphane yüklenemedi"
  },
  "vi": {
    "title": "Chuyển đổi Pinyin",
    "desc": "Chuyển đổi chữ Hán sang Pinyin với dấu thanh điệu, số hoặc không dấu",
    "inputLabel": "Nhập tiếng Trung",
    "inputPlaceholder": "Nhập ký tự tiếng Trung cần chuyển đổi...",
    "toneLabel": "Định dạng thanh điệu",
    "toneSymbol": "Ký hiệu (ā)",
    "toneNum": "Số (a1)",
    "toneNone": "Không dấu",
    "modeLabel": "Chế độ đầu ra",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + chữ Hán",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Kết quả",
    "copy": "Sao chép",
    "copied": "Đã sao chép",
    "loading": "Đang tải...",
    "loadError": "Tải thư viện thất bại"
  },
  "th": {
    "title": "แปลงพินอิน",
    "desc": "แปลงอักขระจีนเป็นพินอินพร้อมเครื่องหมายวรรณยุกต์ ตัวเลข หรือไม่มีวรรณยุกต์",
    "inputLabel": "ป้อนภาษาจีน",
    "inputPlaceholder": "ป้อนอักขระจีนที่ต้องการแปลง...",
    "toneLabel": "รูปแบบวรรณยุกต์",
    "toneSymbol": "สัญลักษณ์ (ā)",
    "toneNum": "ตัวเลข (a1)",
    "toneNone": "ไม่มีวรรณยุกต์",
    "modeLabel": "โหมดเอาต์พุต",
    "modePinyin": "พินอิน",
    "modeAbove": "พินอิน + จีน",
    "modeBopomofo": "บอโปโมโฟ",
    "outputLabel": "ผลลัพธ์",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว",
    "loading": "กำลังโหลด...",
    "loadError": "โหลดไลบรารีล้มเหลว"
  },
  "id": {
    "title": "Konverter Pinyin",
    "desc": "Konversi karakter Tionghoa ke Pinyin dengan tanda nada, angka, atau tanpa nada",
    "inputLabel": "Masukkan bahasa Tionghoa",
    "inputPlaceholder": "Masukkan karakter Tionghoa untuk dikonversi...",
    "toneLabel": "Format Nada",
    "toneSymbol": "Simbol (ā)",
    "toneNum": "Angka (a1)",
    "toneNone": "Tanpa Nada",
    "modeLabel": "Mode Output",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + Tionghoa",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Hasil",
    "copy": "Salin",
    "copied": "Disalin",
    "loading": "Memuat...",
    "loadError": "Gagal memuat pustaka"
  },
  "ms": {
    "title": "Penukar Pinyin",
    "desc": "Tukar aksara Cina kepada Pinyin dengan tanda nada, nombor atau tanpa nada",
    "inputLabel": "Masukkan bahasa Cina",
    "inputPlaceholder": "Masukkan aksara Cina untuk ditukar...",
    "toneLabel": "Format Nada",
    "toneSymbol": "Simbol (ā)",
    "toneNum": "Nombor (a1)",
    "toneNone": "Tanpa Nada",
    "modeLabel": "Mod Output",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + Cina",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Hasil",
    "copy": "Salin",
    "copied": "Disalin",
    "loading": "Memuatkan...",
    "loadError": "Gagal memuatkan pustaka"
  },
  "pl": {
    "title": "Konwerter Pinyin",
    "desc": "Konwertuj chińskie znaki na Pinyin z oznaczeniami tonów, cyframi lub bez tonów",
    "inputLabel": "Wprowadź chiński",
    "inputPlaceholder": "Wprowadź chińskie znaki do konwersji...",
    "toneLabel": "Format tonu",
    "toneSymbol": "Symbol (ā)",
    "toneNum": "Cyfra (a1)",
    "toneNone": "Bez tonu",
    "modeLabel": "Tryb wyjścia",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + chiński",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Wynik",
    "copy": "Kopiuj",
    "copied": "Skopiowano",
    "loading": "Ładowanie...",
    "loadError": "Nie udało się załadować biblioteki"
  },
  "uk": {
    "title": "Конвертер піньїнь",
    "desc": "Конвертує китайські ієрогліфи в піньїнь з тонами, цифрами або без",
    "inputLabel": "Введіть китайський",
    "inputPlaceholder": "Введіть китайські ієрогліфи для конвертації...",
    "toneLabel": "Формат тону",
    "toneSymbol": "Символ (ā)",
    "toneNum": "Цифра (a1)",
    "toneNone": "Без тону",
    "modeLabel": "Режим виводу",
    "modePinyin": "Піньїнь",
    "modeAbove": "Піньїнь + ієрогліфи",
    "modeBopomofo": "Бопомофо",
    "outputLabel": "Результат",
    "copy": "Копіювати",
    "copied": "Скопійовано",
    "loading": "Завантаження...",
    "loadError": "Не вдалося завантажити бібліотеку"
  },
  "sv": {
    "title": "Pinyin-omvandlare",
    "desc": "Omvandla kinesiska tecken till pinyin med tonmarkeringar, siffror eller utan toner",
    "inputLabel": "Ange kinesiska",
    "inputPlaceholder": "Ange kinesiska tecken att omvandla...",
    "toneLabel": "Tonformat",
    "toneSymbol": "Symbol (ā)",
    "toneNum": "Siffra (a1)",
    "toneNone": "Utan ton",
    "modeLabel": "Utdataläge",
    "modePinyin": "Pinyin",
    "modeAbove": "Pinyin + kinesiska",
    "modeBopomofo": "Bopomofo",
    "outputLabel": "Resultat",
    "copy": "Kopiera",
    "copied": "Kopierat",
    "loading": "Laddar...",
    "loadError": "Det gick inte att ladda biblioteket"
  },
  "zh-TW": {
    "title": "拼音轉換",
    "desc": "漢字轉拼音，支援聲調符號、數字聲調、無聲調及注音符號",
    "inputLabel": "輸入漢字",
    "inputPlaceholder": "請輸入要轉換的漢字...",
    "toneLabel": "聲調格式",
    "toneSymbol": "符號（ā）",
    "toneNum": "數字（a1）",
    "toneNone": "無聲調",
    "modeLabel": "輸出模式",
    "modePinyin": "拼音",
    "modeAbove": "拼音＋漢字",
    "modeBopomofo": "注音符號",
    "outputLabel": "轉換結果",
    "copy": "複製",
    "copied": "已複製",
    "loading": "載入中...",
    "loadError": "庫載入失敗，請檢查網路後重試"
  }
}
</i18n>

<style lang="scss" scoped>
.py-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}

.py-header {
  text-align: center;
  margin-bottom: 28px;
}

.py-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.py-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.py-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.py-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.py-panel-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.py-textarea {
  :deep(.el-textarea__inner) {
    font-size: 0.95rem;
    line-height: 1.7;
    resize: vertical;
  }
}

.py-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.py-option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.py-option-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  min-width: 80px;
  flex-shrink: 0;
}

.py-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 40px;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.py-error {
  padding: 16px;
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  border-radius: 4px;
  font-size: 0.9rem;
}

.py-ruby-output {
  min-height: 200px;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 1rem;
  line-height: 2.8;
  word-break: break-all;

  :deep(ruby) {
    margin: 0 2px;
  }

  :deep(rt) {
    font-size: 0.65em;
    color: var(--vp-c-brand-1);
  }
}
</style>
