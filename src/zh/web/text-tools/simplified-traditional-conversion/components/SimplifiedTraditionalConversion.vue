<template>
  <div class="stc-wrap">
    <div class="stc-header">
      <h1 class="stc-title">{{ t("title") }}</h1>
      <p class="stc-desc">{{ t("desc") }}</p>
    </div>

    <div class="stc-body">
      <div class="stc-options">
        <div class="stc-option-row">
          <span class="stc-option-label">{{ t("directionLabel") }}</span>
          <el-radio-group
            v-model="direction"
            @change="handleConvert"
          >
            <el-radio-button value="cn2tw">{{ t("cn2tw") }}</el-radio-button>
            <el-radio-button value="cn2hk">{{ t("cn2hk") }}</el-radio-button>
            <el-radio-button value="tw2cn">{{ t("tw2cn") }}</el-radio-button>
            <el-radio-button value="hk2cn">{{ t("hk2cn") }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="stc-panels">
        <div class="stc-panel">
          <div class="stc-panel-label">{{ t("inputLabel") }}</div>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="12"
            :placeholder="t('inputPlaceholder')"
            class="stc-textarea"
            @input="handleConvert"
          />
        </div>

        <div class="stc-panel">
          <div class="stc-panel-header">
            <span class="stc-panel-label">{{ t("outputLabel") }}</span>
            <el-button
              :disabled="!outputText"
              @click="handleCopy"
              >{{ copied ? t("copied") : t("copy") }}</el-button
            >
          </div>
          <div
            v-if="loading"
            class="stc-loading"
          >
            <el-icon class="is-loading"><Loading /></el-icon>
            {{ t("loading") }}
          </div>
          <div
            v-else-if="error"
            class="stc-error"
          >
            {{ error }}
          </div>
          <el-input
            v-else
            v-model="outputText"
            type="textarea"
            :rows="12"
            readonly
            class="stc-textarea"
          />
        </div>
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
const direction = ref<"cn2tw" | "cn2hk" | "tw2cn" | "hk2cn">("cn2tw")
const loading = ref(false)
const error = ref("")
const copied = ref(false)

type OpenCCModule = {
  Converter: (opts: { from: string; to: string }) => (text: string) => string
}
let OpenCC: OpenCCModule | null = null

// 始终加载完整版，避免切换方向时重复加载不同文件
const OPENCC_CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js",
  "https://unpkg.com/opencc-js@1.0.5/dist/umd/full.js",
]

async function ensureOpenCC() {
  if (OpenCC) return
  loading.value = true
  error.value = ""
  try {
    OpenCC = await loadFirstAvailable(OPENCC_CDN_LIST, async url => {
      const win = await loadScript(url)
      return (win as any).OpenCC as OpenCCModule
    })
  } catch (e: any) {
    OpenCC = null
    error.value = t("loadError")
    throw e
  } finally {
    loading.value = false
  }
}

const FROM_TO_MAP = {
  cn2tw: { from: "cn", to: "tw" },
  cn2hk: { from: "cn", to: "hk" },
  tw2cn: { from: "tw", to: "cn" },
  hk2cn: { from: "hk", to: "cn" },
}

async function handleConvert() {
  if (!inputText.value.trim()) {
    outputText.value = ""
    return
  }
  await ensureOpenCC()
  if (!OpenCC) return

  const { from, to } = FROM_TO_MAP[direction.value]
  const converter = OpenCC.Converter({ from, to })
  outputText.value = converter(inputText.value)
}

async function handleCopy() {
  if (!outputText.value) return
  await navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<i18n lang="json">
{
  "zh": {
    "title": "简繁转换",
    "desc": "简体与繁体中文互转，支持台湾繁体、香港繁体，基于 OpenCC 引擎",
    "directionLabel": "转换方向",
    "cn2tw": "简体 → 台湾繁体",
    "cn2hk": "简体 → 香港繁体",
    "tw2cn": "台湾繁体 → 简体",
    "hk2cn": "香港繁体 → 简体",
    "inputLabel": "输入文本",
    "inputPlaceholder": "请输入要转换的文本...",
    "outputLabel": "转换结果",
    "copy": "复制",
    "copied": "已复制",
    "loading": "加载中...",
    "loadError": "库加载失败，请检查网络后重试"
  },
  "en": {
    "title": "Simplified-Traditional Converter",
    "desc": "Convert between Simplified and Traditional Chinese (Taiwan/Hong Kong), powered by OpenCC",
    "directionLabel": "Direction",
    "cn2tw": "Simplified → TW Traditional",
    "cn2hk": "Simplified → HK Traditional",
    "tw2cn": "TW Traditional → Simplified",
    "hk2cn": "HK Traditional → Simplified",
    "inputLabel": "Input",
    "inputPlaceholder": "Enter text to convert...",
    "outputLabel": "Result",
    "copy": "Copy",
    "copied": "Copied",
    "loading": "Loading...",
    "loadError": "Failed to load library, please check your network"
  },
  "ja": {
    "title": "簡体字・繁体字変換",
    "desc": "簡体字と繁体字（台湾・香港）を相互変換。OpenCCエンジン採用",
    "directionLabel": "変換方向",
    "cn2tw": "簡体字 → 台湾繁体字",
    "cn2hk": "簡体字 → 香港繁体字",
    "tw2cn": "台湾繁体字 → 簡体字",
    "hk2cn": "香港繁体字 → 簡体字",
    "inputLabel": "入力テキスト",
    "inputPlaceholder": "変換するテキストを入力してください...",
    "outputLabel": "変換結果",
    "copy": "コピー",
    "copied": "コピー済み",
    "loading": "読み込み中...",
    "loadError": "ライブラリの読み込みに失敗しました"
  },
  "ko": {
    "title": "간체-번체 변환",
    "desc": "간체와 번체 중국어(대만/홍콩) 상호 변환. OpenCC 엔진 기반",
    "directionLabel": "변환 방향",
    "cn2tw": "간체 → 대만 번체",
    "cn2hk": "간체 → 홍콩 번체",
    "tw2cn": "대만 번체 → 간체",
    "hk2cn": "홍콩 번체 → 간체",
    "inputLabel": "입력 텍스트",
    "inputPlaceholder": "변환할 텍스트를 입력하세요...",
    "outputLabel": "변환 결과",
    "copy": "복사",
    "copied": "복사됨",
    "loading": "로딩 중...",
    "loadError": "라이브러리 로드 실패, 네트워크를 확인하세요"
  },
  "fr": {
    "title": "Convertisseur simplifié-traditionnel",
    "desc": "Convertir entre le chinois simplifié et traditionnel (Taïwan/Hong Kong), propulsé par OpenCC",
    "directionLabel": "Direction",
    "cn2tw": "Simplifié → Trad. Taïwan",
    "cn2hk": "Simplifié → Trad. Hong Kong",
    "tw2cn": "Trad. Taïwan → Simplifié",
    "hk2cn": "Trad. Hong Kong → Simplifié",
    "inputLabel": "Texte d'entrée",
    "inputPlaceholder": "Entrez le texte à convertir...",
    "outputLabel": "Résultat",
    "copy": "Copier",
    "copied": "Copié",
    "loading": "Chargement...",
    "loadError": "Échec du chargement de la bibliothèque"
  },
  "de": {
    "title": "Vereinfacht-Traditionell-Konverter",
    "desc": "Konvertierung zwischen vereinfachtem und traditionellem Chinesisch (Taiwan/Hongkong), angetrieben von OpenCC",
    "directionLabel": "Richtung",
    "cn2tw": "Vereinfacht → Trad. Taiwan",
    "cn2hk": "Vereinfacht → Trad. Hongkong",
    "tw2cn": "Trad. Taiwan → Vereinfacht",
    "hk2cn": "Trad. Hongkong → Vereinfacht",
    "inputLabel": "Eingabetext",
    "inputPlaceholder": "Text zum Konvertieren eingeben...",
    "outputLabel": "Ergebnis",
    "copy": "Kopieren",
    "copied": "Kopiert",
    "loading": "Laden...",
    "loadError": "Bibliothek konnte nicht geladen werden"
  },
  "es": {
    "title": "Conversor simplificado-tradicional",
    "desc": "Convierte entre chino simplificado y tradicional (Taiwán/Hong Kong), impulsado por OpenCC",
    "directionLabel": "Dirección",
    "cn2tw": "Simplificado → Trad. Taiwán",
    "cn2hk": "Simplificado → Trad. Hong Kong",
    "tw2cn": "Trad. Taiwán → Simplificado",
    "hk2cn": "Trad. Hong Kong → Simplificado",
    "inputLabel": "Texto de entrada",
    "inputPlaceholder": "Ingresa el texto a convertir...",
    "outputLabel": "Resultado",
    "copy": "Copiar",
    "copied": "Copiado",
    "loading": "Cargando...",
    "loadError": "Error al cargar la biblioteca"
  },
  "pt": {
    "title": "Conversor simplificado-tradicional",
    "desc": "Converta entre o chinês simplificado e tradicional (Taiwan/Hong Kong), powered by OpenCC",
    "directionLabel": "Direção",
    "cn2tw": "Simplificado → Trad. Taiwan",
    "cn2hk": "Simplificado → Trad. Hong Kong",
    "tw2cn": "Trad. Taiwan → Simplificado",
    "hk2cn": "Trad. Hong Kong → Simplificado",
    "inputLabel": "Texto de entrada",
    "inputPlaceholder": "Insira o texto para converter...",
    "outputLabel": "Resultado",
    "copy": "Copiar",
    "copied": "Copiado",
    "loading": "Carregando...",
    "loadError": "Falha ao carregar a biblioteca"
  },
  "ru": {
    "title": "Конвертер упрощённого-традиционного",
    "desc": "Конвертирует между упрощённым и традиционным китайским (Тайвань/Гонконг), на основе OpenCC",
    "directionLabel": "Направление",
    "cn2tw": "Упрощённый → Тайвань",
    "cn2hk": "Упрощённый → Гонконг",
    "tw2cn": "Тайвань → Упрощённый",
    "hk2cn": "Гонконг → Упрощённый",
    "inputLabel": "Введите текст",
    "inputPlaceholder": "Введите текст для конвертации...",
    "outputLabel": "Результат",
    "copy": "Копировать",
    "copied": "Скопировано",
    "loading": "Загрузка...",
    "loadError": "Не удалось загрузить библиотеку"
  },
  "ar": {
    "title": "محوّل المبسّط-التقليدي",
    "desc": "تحويل بين الصينية المبسّطة والتقليدية (تايوان/هونغ كونغ)، مدعوم بـ OpenCC",
    "directionLabel": "الاتجاه",
    "cn2tw": "مبسّط ← تايوان التقليدية",
    "cn2hk": "مبسّط ← هونغ كونغ التقليدية",
    "tw2cn": "تايوان التقليدية ← مبسّط",
    "hk2cn": "هونغ كونغ التقليدية ← مبسّط",
    "inputLabel": "النص المدخل",
    "inputPlaceholder": "أدخل النص للتحويل...",
    "outputLabel": "النتيجة",
    "copy": "نسخ",
    "copied": "تم النسخ",
    "loading": "جارٍ التحميل...",
    "loadError": "فشل تحميل المكتبة"
  },
  "hi": {
    "title": "सरलीकृत-पारंपरिक कनवर्टर",
    "desc": "सरलीकृत और पारंपरिक चीनी (ताइवान/हांगकांग) के बीच रूपांतरण, OpenCC द्वारा",
    "directionLabel": "दिशा",
    "cn2tw": "सरलीकृत → ताइवान पारंपरिक",
    "cn2hk": "सरलीकृत → हांगकांग पारंपरिक",
    "tw2cn": "ताइवान पारंपरिक → सरलीकृत",
    "hk2cn": "हांगकांग पारंपरिक → सरलीकृत",
    "inputLabel": "टेक्स्ट दर्ज करें",
    "inputPlaceholder": "रूपांतरित करने के लिए टेक्स्ट दर्ज करें...",
    "outputLabel": "परिणाम",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया",
    "loading": "लोड हो रहा है...",
    "loadError": "लाइब्रेरी लोड करने में विफल"
  },
  "it": {
    "title": "Convertitore semplificato-tradizionale",
    "desc": "Converti tra cinese semplificato e tradizionale (Taiwan/Hong Kong), powered by OpenCC",
    "directionLabel": "Direzione",
    "cn2tw": "Semplificato → Trad. Taiwan",
    "cn2hk": "Semplificato → Trad. Hong Kong",
    "tw2cn": "Trad. Taiwan → Semplificato",
    "hk2cn": "Trad. Hong Kong → Semplificato",
    "inputLabel": "Testo di input",
    "inputPlaceholder": "Inserisci il testo da convertire...",
    "outputLabel": "Risultato",
    "copy": "Copia",
    "copied": "Copiato",
    "loading": "Caricamento...",
    "loadError": "Impossibile caricare la libreria"
  },
  "nl": {
    "title": "Vereenvoudigd-traditioneel converter",
    "desc": "Converteer tussen vereenvoudigd en traditioneel Chinees (Taiwan/Hongkong), powered by OpenCC",
    "directionLabel": "Richting",
    "cn2tw": "Vereenvoudigd → Trad. Taiwan",
    "cn2hk": "Vereenvoudigd → Trad. Hongkong",
    "tw2cn": "Trad. Taiwan → Vereenvoudigd",
    "hk2cn": "Trad. Hongkong → Vereenvoudigd",
    "inputLabel": "Invoertekst",
    "inputPlaceholder": "Voer tekst in om te converteren...",
    "outputLabel": "Resultaat",
    "copy": "Kopiëren",
    "copied": "Gekopieerd",
    "loading": "Laden...",
    "loadError": "Bibliotheek laden mislukt"
  },
  "tr": {
    "title": "Basitleştirilmiş-Geleneksel Dönüştürücü",
    "desc": "Basitleştirilmiş ve Geleneksel Çince (Tayvan/Hong Kong) arasında dönüştürme, OpenCC ile",
    "directionLabel": "Yön",
    "cn2tw": "Basit → Tayvan Geleneksel",
    "cn2hk": "Basit → HK Geleneksel",
    "tw2cn": "Tayvan Geleneksel → Basit",
    "hk2cn": "HK Geleneksel → Basit",
    "inputLabel": "Metin Girin",
    "inputPlaceholder": "Dönüştürülecek metni girin...",
    "outputLabel": "Sonuç",
    "copy": "Kopyala",
    "copied": "Kopyalandı",
    "loading": "Yükleniyor...",
    "loadError": "Kütüphane yüklenemedi"
  },
  "vi": {
    "title": "Chuyển đổi Giản thể-Phồn thể",
    "desc": "Chuyển đổi giữa tiếng Trung giản thể và phồn thể (Đài Loan/Hồng Kông), sử dụng OpenCC",
    "directionLabel": "Hướng chuyển đổi",
    "cn2tw": "Giản thể → Phồn thể Đài Loan",
    "cn2hk": "Giản thể → Phồn thể Hồng Kông",
    "tw2cn": "Phồn thể Đài Loan → Giản thể",
    "hk2cn": "Phồn thể Hồng Kông → Giản thể",
    "inputLabel": "Văn bản đầu vào",
    "inputPlaceholder": "Nhập văn bản cần chuyển đổi...",
    "outputLabel": "Kết quả",
    "copy": "Sao chép",
    "copied": "Đã sao chép",
    "loading": "Đang tải...",
    "loadError": "Tải thư viện thất bại"
  },
  "th": {
    "title": "แปลงอักษรจีนตัวย่อ-ตัวเต็ม",
    "desc": "แปลงระหว่างภาษาจีนตัวย่อและตัวเต็ม (ไต้หวัน/ฮ่องกง) ขับเคลื่อนโดย OpenCC",
    "directionLabel": "ทิศทางการแปลง",
    "cn2tw": "ตัวย่อ → ตัวเต็มไต้หวัน",
    "cn2hk": "ตัวย่อ → ตัวเต็มฮ่องกง",
    "tw2cn": "ตัวเต็มไต้หวัน → ตัวย่อ",
    "hk2cn": "ตัวเต็มฮ่องกง → ตัวย่อ",
    "inputLabel": "ป้อนข้อความ",
    "inputPlaceholder": "ป้อนข้อความที่ต้องการแปลง...",
    "outputLabel": "ผลลัพธ์",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว",
    "loading": "กำลังโหลด...",
    "loadError": "โหลดไลบรารีล้มเหลว"
  },
  "id": {
    "title": "Konverter Sederhana-Tradisional",
    "desc": "Konversi antara bahasa Tionghoa sederhana dan tradisional (Taiwan/Hong Kong), didukung OpenCC",
    "directionLabel": "Arah",
    "cn2tw": "Sederhana → Trad. Taiwan",
    "cn2hk": "Sederhana → Trad. Hong Kong",
    "tw2cn": "Trad. Taiwan → Sederhana",
    "hk2cn": "Trad. Hong Kong → Sederhana",
    "inputLabel": "Teks Masukan",
    "inputPlaceholder": "Masukkan teks untuk dikonversi...",
    "outputLabel": "Hasil",
    "copy": "Salin",
    "copied": "Disalin",
    "loading": "Memuat...",
    "loadError": "Gagal memuat pustaka"
  },
  "ms": {
    "title": "Penukar Ringkas-Tradisional",
    "desc": "Tukar antara bahasa Cina ringkas dan tradisional (Taiwan/Hong Kong), dikuasakan oleh OpenCC",
    "directionLabel": "Arah",
    "cn2tw": "Ringkas → Trad. Taiwan",
    "cn2hk": "Ringkas → Trad. Hong Kong",
    "tw2cn": "Trad. Taiwan → Ringkas",
    "hk2cn": "Trad. Hong Kong → Ringkas",
    "inputLabel": "Teks Input",
    "inputPlaceholder": "Masukkan teks untuk ditukar...",
    "outputLabel": "Hasil",
    "copy": "Salin",
    "copied": "Disalin",
    "loading": "Memuatkan...",
    "loadError": "Gagal memuatkan pustaka"
  },
  "pl": {
    "title": "Konwerter uproszczony-tradycyjny",
    "desc": "Konwertuj między uproszczonym a tradycyjnym chińskim (Tajwan/Hongkong), powered by OpenCC",
    "directionLabel": "Kierunek",
    "cn2tw": "Uproszczony → Trad. Tajwan",
    "cn2hk": "Uproszczony → Trad. Hongkong",
    "tw2cn": "Trad. Tajwan → Uproszczony",
    "hk2cn": "Trad. Hongkong → Uproszczony",
    "inputLabel": "Tekst wejściowy",
    "inputPlaceholder": "Wprowadź tekst do konwersji...",
    "outputLabel": "Wynik",
    "copy": "Kopiuj",
    "copied": "Skopiowano",
    "loading": "Ładowanie...",
    "loadError": "Nie udało się załadować biblioteki"
  },
  "uk": {
    "title": "Конвертер спрощеного-традиційного",
    "desc": "Конвертує між спрощеним і традиційним китайським (Тайвань/Гонконг), на основі OpenCC",
    "directionLabel": "Напрямок",
    "cn2tw": "Спрощений → Тайвань",
    "cn2hk": "Спрощений → Гонконг",
    "tw2cn": "Тайвань → Спрощений",
    "hk2cn": "Гонконг → Спрощений",
    "inputLabel": "Введіть текст",
    "inputPlaceholder": "Введіть текст для конвертації...",
    "outputLabel": "Результат",
    "copy": "Копіювати",
    "copied": "Скопійовано",
    "loading": "Завантаження...",
    "loadError": "Не вдалося завантажити бібліотеку"
  },
  "sv": {
    "title": "Förenklad-traditionell omvandlare",
    "desc": "Omvandla mellan förenklad och traditionell kinesiska (Taiwan/Hongkong), med OpenCC",
    "directionLabel": "Riktning",
    "cn2tw": "Förenklad → Taiwan trad.",
    "cn2hk": "Förenklad → HK trad.",
    "tw2cn": "Taiwan trad. → Förenklad",
    "hk2cn": "HK trad. → Förenklad",
    "inputLabel": "Ange text",
    "inputPlaceholder": "Ange text att omvandla...",
    "outputLabel": "Resultat",
    "copy": "Kopiera",
    "copied": "Kopierat",
    "loading": "Laddar...",
    "loadError": "Det gick inte att ladda biblioteket"
  },
  "zh-TW": {
    "title": "簡繁轉換",
    "desc": "簡體與繁體中文互轉，支援台灣繁體、香港繁體，基於 OpenCC 引擎",
    "directionLabel": "轉換方向",
    "cn2tw": "簡體 → 台灣繁體",
    "cn2hk": "簡體 → 香港繁體",
    "tw2cn": "台灣繁體 → 簡體",
    "hk2cn": "香港繁體 → 簡體",
    "inputLabel": "輸入文字",
    "inputPlaceholder": "請輸入要轉換的文字...",
    "outputLabel": "轉換結果",
    "copy": "複製",
    "copied": "已複製",
    "loading": "載入中...",
    "loadError": "庫載入失敗，請檢查網路後重試"
  }
}
</i18n>

<style lang="scss" scoped>
.stc-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}

.stc-header {
  text-align: center;
  margin-bottom: 28px;
}

.stc-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.stc-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.stc-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stc-options {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.stc-option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stc-option-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  min-width: 80px;
  flex-shrink: 0;
}

.stc-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stc-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stc-panel-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.stc-textarea {
  :deep(.el-textarea__inner) {
    font-size: 0.95rem;
    line-height: 1.7;
    resize: vertical;
  }
}

.stc-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 60px;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.stc-error {
  padding: 16px;
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
