<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { loadFirstAvailable, loadScript } from "@/utils"

const { t } = useI18n()

// ── segmentit loader ─────────────────────────────────────────
interface SegToken {
  w: string
  p: number
}
interface SegLib {
  Segment: new () => { doSegment(text: string): SegToken[] }
  useDefault: (
    seg: InstanceType<SegLib["Segment"]>
  ) => InstanceType<SegLib["Segment"]>
}

let _lib: SegLib | null = null
let _seg: InstanceType<SegLib["Segment"]> | null = null
let _loadingLib = false
let _loadPromise: Promise<void> | null = null

const libLoading = ref(false)
const libError = ref("")

async function ensureSegmentit() {
  if (_seg) return
  if (_loadPromise) return _loadPromise

  _loadPromise = (async () => {
    libLoading.value = true
    libError.value = ""
    try {
      _lib = await loadFirstAvailable(
        [
          "https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.js",
          "https://unpkg.com/segmentit@2.0.3/dist/umd/segmentit.js",
        ],
        async url => {
          const win = await loadScript(url)
          return (win as any).Segmentit as SegLib
        },
        () => import("segmentit") as Promise<any>
      )
      _seg = _lib!.useDefault(new _lib!.Segment())
    } catch (e) {
      _lib = null
      _seg = null
      _loadPromise = null
      libError.value = t("loadError")
      throw e
    } finally {
      libLoading.value = false
    }
  })()

  return _loadPromise
}

// ── state ─────────────────────────────────────────────────────
const inputText = ref("")
const topN = ref(30)
const minLen = ref(2)
const excludeStopwords = ref(true)
const analyzing = ref(false)
const result = ref<{ word: string; count: number }[]>([])
const totalTokens = ref(0)

// Common Chinese stopwords / function words to filter
const STOPWORDS = new Set([
  "的",
  "了",
  "在",
  "是",
  "我",
  "有",
  "和",
  "就",
  "不",
  "人",
  "都",
  "一",
  "一个",
  "上",
  "也",
  "很",
  "到",
  "说",
  "要",
  "去",
  "你",
  "会",
  "着",
  "没有",
  "看",
  "好",
  "自己",
  "这",
  "那",
  "这个",
  "那个",
  "什么",
  "以",
  "为",
  "对",
  "与",
  "及",
  "如",
  "或",
  "从",
  "被",
  "但",
  "而",
  "把",
  "让",
  "使",
  "关于",
  "对于",
  "来",
  "他",
  "她",
  "它",
  "我们",
  "你们",
  "他们",
  "这样",
  "那样",
  "这些",
  "那些",
  "可以",
  "可能",
  "因为",
  "所以",
  "如果",
  "虽然",
  "但是",
  "然后",
  "然而",
  "因此",
  "不过",
  "只是",
  "只有",
  "已经",
  "还是",
  "还有",
  "之",
  "其",
  "以及",
  "或者",
  "并且",
  "并",
  "中",
  "其中",
  "通过",
  "进行",
  "下",
  "后",
  "前",
  "时",
  "当",
  "各",
  "该",
  "此",
  "等",
  "即",
  "即使",
  "无论",
  "只要",
  "不仅",
  "而且",
  "再",
  "又",
  "也",
])

async function analyze() {
  if (!inputText.value.trim()) return
  analyzing.value = true
  try {
    await ensureSegmentit()
    if (!_seg) return

    const tokens: SegToken[] = _seg.doSegment(inputText.value)

    const freq: Record<string, number> = {}
    let total = 0

    for (const tok of tokens) {
      const w = tok.w.trim()
      // Filter: punctuation / whitespace / too short
      if (!w || w.length < minLen.value) continue
      if (/^\s+$/.test(w) || /^[\p{P}\p{S}\d]+$/u.test(w)) continue
      if (excludeStopwords.value && STOPWORDS.has(w)) continue
      freq[w] = (freq[w] ?? 0) + 1
      total++
    }

    totalTokens.value = total
    result.value = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN.value)
      .map(([word, count]) => ({ word, count }))
  } finally {
    analyzing.value = false
  }
}

const maxCount = computed(() => result.value[0]?.count ?? 1)

function copyResult() {
  if (!result.value.length) return
  const text = result.value
    .map((r, i) => `${i + 1}. ${r.word}\t${r.count}`)
    .join("\n")
  navigator.clipboard.writeText(text).then(() => {
    ElMessage({ message: t("copied"), type: "success", duration: 1500 })
  })
}

function clear() {
  inputText.value = ""
  result.value = []
  totalTokens.value = 0
}
</script>

<template>
  <div class="kw-stats">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="main-layout">
      <!-- Left: input + options -->
      <div class="left-panel">
        <div class="panel-header">
          <span class="label">{{ t("inputLabel") }}</span>
          <el-button @click="clear">{{ t("clear") }}</el-button>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="12"
          :placeholder="t('placeholder')"
          resize="vertical"
        />

        <div class="options">
          <div class="option-row">
            <span class="opt-label">{{ t("topN") }}</span>
            <el-radio-group
              v-model="topN"
              size="small"
            >
              <el-radio-button :value="20">20</el-radio-button>
              <el-radio-button :value="30">30</el-radio-button>
              <el-radio-button :value="50">50</el-radio-button>
              <el-radio-button :value="100">100</el-radio-button>
            </el-radio-group>
          </div>
          <div class="option-row">
            <span class="opt-label">{{ t("minLen") }}</span>
            <el-radio-group
              v-model="minLen"
              size="small"
            >
              <el-radio-button :value="1">1</el-radio-button>
              <el-radio-button :value="2">2</el-radio-button>
              <el-radio-button :value="3">3</el-radio-button>
            </el-radio-group>
          </div>
          <div class="option-row">
            <el-checkbox v-model="excludeStopwords">{{
              t("excludeStopwords")
            }}</el-checkbox>
          </div>
        </div>

        <el-button
          type="primary"
          :loading="analyzing || libLoading"
          :disabled="!inputText.trim()"
          class="analyze-btn"
          @click="analyze"
        >
          {{ libLoading ? t("loadingLib") : t("analyzeBtn") }}
        </el-button>

        <div
          v-if="libError"
          class="error-msg"
        >
          {{ libError }}
        </div>
      </div>

      <!-- Right: result -->
      <div class="right-panel">
        <div
          v-if="!result.length && !analyzing"
          class="empty-hint"
        >
          {{ t("emptyHint") }}
        </div>

        <template v-else-if="result.length">
          <div class="result-header">
            <span class="section-title">
              {{ t("resultTitle") }}
              <span class="result-meta">
                {{ t("topLabel", { n: result.length }) }} /
                {{ t("totalTokens", { n: totalTokens }) }}
              </span>
            </span>
            <el-button
              size="small"
              @click="copyResult"
              >{{ t("copyResult") }}</el-button
            >
          </div>

          <div class="kw-list">
            <div
              v-for="(item, idx) in result"
              :key="item.word"
              class="kw-item"
            >
              <span class="kw-rank">{{ idx + 1 }}</span>
              <span class="kw-word">{{ item.word }}</span>
              <div class="kw-bar-wrap">
                <div
                  class="kw-bar"
                  :style="{ width: (item.count / maxCount) * 100 + '%' }"
                />
              </div>
              <span class="kw-count">{{ item.count }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kw-stats {
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

.main-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.options {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.opt-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  min-width: 70px;
}

.analyze-btn {
  margin-top: 16px;
  width: 100%;
}

.error-msg {
  margin-top: 10px;
  color: var(--vp-c-danger-1);
  font-size: 0.85rem;
}

// Right panel
.right-panel {
  min-height: 200px;
}

.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.result-meta {
  font-size: 0.8rem;
  font-weight: normal;
  color: var(--vp-c-text-3);
}

.kw-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kw-item {
  display: grid;
  grid-template-columns: 28px 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.kw-rank {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  text-align: right;
  font-family: var(--vp-font-family-mono);
}

.kw-word {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.kw-bar-wrap {
  flex: 1;
  height: 8px;
  background: var(--vp-c-divider);
  border-radius: 4px;
  overflow: hidden;
  min-width: 60px;
}

.kw-bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.kw-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  text-align: right;
  min-width: 28px;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "关键词统计",
    "inputLabel": "输入文本",
    "placeholder": "粘贴或输入要分析的文本...",
    "clear": "清空",
    "topN": "显示 Top",
    "minLen": "最短词长",
    "excludeStopwords": "过滤常用停用词",
    "analyzeBtn": "开始分析",
    "loadingLib": "正在加载分词库...",
    "loadError": "分词库加载失败，请刷新重试",
    "emptyHint": "在左侧输入文本后点击「开始分析」",
    "resultTitle": "关键词频率",
    "topLabel": "Top {n}",
    "totalTokens": "有效词 {n} 个",
    "copyResult": "复制结果",
    "copied": "已复制！"
  },
  "en": {
    "title_page": "Keyword Statistics",
    "inputLabel": "Input Text",
    "placeholder": "Paste or type the text to analyze...",
    "clear": "Clear",
    "topN": "Top",
    "minLen": "Min length",
    "excludeStopwords": "Filter stopwords",
    "analyzeBtn": "Analyze",
    "loadingLib": "Loading segmentation library...",
    "loadError": "Failed to load library, please refresh",
    "emptyHint": "Enter text on the left and click Analyze",
    "resultTitle": "Keyword Frequency",
    "topLabel": "Top {n}",
    "totalTokens": "{n} valid tokens",
    "copyResult": "Copy",
    "copied": "Copied!"
  },
  "ja": {
    "title_page": "キーワード統計",
    "inputLabel": "テキスト入力",
    "placeholder": "分析するテキストを貼り付けるか入力してください...",
    "clear": "クリア",
    "topN": "Top 件数",
    "minLen": "最小文字数",
    "excludeStopwords": "ストップワードを除外",
    "analyzeBtn": "分析開始",
    "loadingLib": "分析ライブラリを読み込み中...",
    "loadError": "ライブラリの読み込みに失敗しました",
    "emptyHint": "左にテキストを入力して「分析開始」をクリック",
    "resultTitle": "キーワード頻度",
    "topLabel": "Top {n}",
    "totalTokens": "有効トークン {n} 個",
    "copyResult": "コピー",
    "copied": "コピーしました"
  },
  "ko": {
    "title_page": "키워드 통계",
    "inputLabel": "입력 텍스트",
    "placeholder": "분석할 텍스트를 붙여넣거나 입력하세요...",
    "clear": "지우기",
    "topN": "Top",
    "minLen": "최소 길이",
    "excludeStopwords": "불용어 필터링",
    "analyzeBtn": "분석 시작",
    "loadingLib": "분석 라이브러리 로딩 중...",
    "loadError": "라이브러리 로드 실패, 새로고침 해주세요",
    "emptyHint": "왼쪽에 텍스트를 입력하고 분석을 클릭하세요",
    "resultTitle": "키워드 빈도",
    "topLabel": "Top {n}",
    "totalTokens": "유효 토큰 {n}개",
    "copyResult": "복사",
    "copied": "복사되었습니다!"
  },
  "fr": {
    "title_page": "Statistiques de mots-clés",
    "inputLabel": "Texte d'entrée",
    "placeholder": "Collez ou saisissez le texte à analyser...",
    "clear": "Effacer",
    "topN": "Top",
    "minLen": "Longueur min.",
    "excludeStopwords": "Filtrer les mots vides",
    "analyzeBtn": "Analyser",
    "loadingLib": "Chargement de la bibliothèque...",
    "loadError": "Échec du chargement, veuillez rafraîchir",
    "emptyHint": "Saisissez du texte à gauche puis cliquez sur Analyser",
    "resultTitle": "Fréquence des mots-clés",
    "topLabel": "Top {n}",
    "totalTokens": "{n} tokens valides",
    "copyResult": "Copier",
    "copied": "Copié !"
  },
  "de": {
    "title_page": "Schlüsselwortstatistik",
    "inputLabel": "Eingabetext",
    "placeholder": "Text zum Analysieren einfügen oder eingeben...",
    "clear": "Löschen",
    "topN": "Top",
    "minLen": "Mindestlänge",
    "excludeStopwords": "Stoppwörter filtern",
    "analyzeBtn": "Analysieren",
    "loadingLib": "Bibliothek wird geladen...",
    "loadError": "Bibliothek konnte nicht geladen werden",
    "emptyHint": "Text links eingeben und auf Analysieren klicken",
    "resultTitle": "Schlüsselworthäufigkeit",
    "topLabel": "Top {n}",
    "totalTokens": "{n} gültige Token",
    "copyResult": "Kopieren",
    "copied": "Kopiert!"
  },
  "es": {
    "title_page": "Estadísticas de palabras clave",
    "inputLabel": "Texto de entrada",
    "placeholder": "Pega o escribe el texto a analizar...",
    "clear": "Limpiar",
    "topN": "Top",
    "minLen": "Long. mínima",
    "excludeStopwords": "Filtrar palabras vacías",
    "analyzeBtn": "Analizar",
    "loadingLib": "Cargando biblioteca...",
    "loadError": "Error al cargar la biblioteca",
    "emptyHint": "Introduce texto a la izquierda y haz clic en Analizar",
    "resultTitle": "Frecuencia de palabras clave",
    "topLabel": "Top {n}",
    "totalTokens": "{n} tokens válidos",
    "copyResult": "Copiar",
    "copied": "¡Copiado!"
  },
  "pt": {
    "title_page": "Estatísticas de palavras-chave",
    "inputLabel": "Texto de entrada",
    "placeholder": "Cole ou escreva o texto a analisar...",
    "clear": "Limpar",
    "topN": "Top",
    "minLen": "Comprimento mín.",
    "excludeStopwords": "Filtrar stopwords",
    "analyzeBtn": "Analisar",
    "loadingLib": "Carregando biblioteca...",
    "loadError": "Falha ao carregar biblioteca",
    "emptyHint": "Insira texto à esquerda e clique em Analisar",
    "resultTitle": "Frequência de palavras-chave",
    "topLabel": "Top {n}",
    "totalTokens": "{n} tokens válidos",
    "copyResult": "Copiar",
    "copied": "Copiado!"
  },
  "ru": {
    "title_page": "Статистика ключевых слов",
    "inputLabel": "Входной текст",
    "placeholder": "Вставьте или введите текст для анализа...",
    "clear": "Очистить",
    "topN": "Топ",
    "minLen": "Мин. длина",
    "excludeStopwords": "Фильтровать стоп-слова",
    "analyzeBtn": "Анализировать",
    "loadingLib": "Загрузка библиотеки...",
    "loadError": "Не удалось загрузить библиотеку",
    "emptyHint": "Введите текст слева и нажмите «Анализировать»",
    "resultTitle": "Частота ключевых слов",
    "topLabel": "Топ {n}",
    "totalTokens": "{n} токенов",
    "copyResult": "Копировать",
    "copied": "Скопировано!"
  },
  "ar": {
    "title_page": "إحصائيات الكلمات الرئيسية",
    "inputLabel": "النص المدخل",
    "placeholder": "الصق أو اكتب النص للتحليل...",
    "clear": "مسح",
    "topN": "أعلى",
    "minLen": "الحد الأدنى للطول",
    "excludeStopwords": "تصفية الكلمات الشائعة",
    "analyzeBtn": "تحليل",
    "loadingLib": "جارٍ تحميل المكتبة...",
    "loadError": "فشل تحميل المكتبة",
    "emptyHint": "أدخل نصاً على اليسار ثم انقر تحليل",
    "resultTitle": "تكرار الكلمات الرئيسية",
    "topLabel": "أعلى {n}",
    "totalTokens": "{n} رمز صالح",
    "copyResult": "نسخ",
    "copied": "تم النسخ!"
  },
  "hi": {
    "title_page": "कीवर्ड आँकड़े",
    "inputLabel": "इनपुट टेक्स्ट",
    "placeholder": "विश्लेषण के लिए टेक्स्ट पेस्ट करें या टाइप करें...",
    "clear": "साफ़ करें",
    "topN": "शीर्ष",
    "minLen": "न्यूनतम लंबाई",
    "excludeStopwords": "स्टॉपवर्ड फ़िल्टर करें",
    "analyzeBtn": "विश्लेषण करें",
    "loadingLib": "लाइब्रेरी लोड हो रही है...",
    "loadError": "लाइब्रेरी लोड करने में विफल",
    "emptyHint": "बाईं ओर टेक्स्ट दर्ज करें और विश्लेषण क्लिक करें",
    "resultTitle": "कीवर्ड आवृत्ति",
    "topLabel": "शीर्ष {n}",
    "totalTokens": "{n} वैध टोकन",
    "copyResult": "कॉपी करें",
    "copied": "कॉपी हो गया!"
  },
  "it": {
    "title_page": "Statistiche parole chiave",
    "inputLabel": "Testo di input",
    "placeholder": "Incolla o inserisci il testo da analizzare...",
    "clear": "Cancella",
    "topN": "Top",
    "minLen": "Lungh. min.",
    "excludeStopwords": "Filtra stopword",
    "analyzeBtn": "Analizza",
    "loadingLib": "Caricamento libreria...",
    "loadError": "Impossibile caricare la libreria",
    "emptyHint": "Inserisci testo a sinistra e clicca Analizza",
    "resultTitle": "Frequenza parole chiave",
    "topLabel": "Top {n}",
    "totalTokens": "{n} token validi",
    "copyResult": "Copia",
    "copied": "Copiato!"
  },
  "nl": {
    "title_page": "Trefwoordstatistieken",
    "inputLabel": "Invoertekst",
    "placeholder": "Plak of typ de te analyseren tekst...",
    "clear": "Wissen",
    "topN": "Top",
    "minLen": "Min. lengte",
    "excludeStopwords": "Stopwoorden filteren",
    "analyzeBtn": "Analyseren",
    "loadingLib": "Bibliotheek laden...",
    "loadError": "Bibliotheek kon niet worden geladen",
    "emptyHint": "Voer links tekst in en klik op Analyseren",
    "resultTitle": "Trefwoordfrequentie",
    "topLabel": "Top {n}",
    "totalTokens": "{n} geldige tokens",
    "copyResult": "Kopiëren",
    "copied": "Gekopieerd!"
  },
  "tr": {
    "title_page": "Anahtar Kelime İstatistikleri",
    "inputLabel": "Giriş Metni",
    "placeholder": "Analiz edilecek metni yapıştırın veya yazın...",
    "clear": "Temizle",
    "topN": "Top",
    "minLen": "Min. uzunluk",
    "excludeStopwords": "Etkisiz kelimeleri filtrele",
    "analyzeBtn": "Analiz Et",
    "loadingLib": "Kütüphane yükleniyor...",
    "loadError": "Kütüphane yüklenemedi",
    "emptyHint": "Sola metin girin ve Analiz Et'e tıklayın",
    "resultTitle": "Anahtar Kelime Sıklığı",
    "topLabel": "Top {n}",
    "totalTokens": "{n} geçerli token",
    "copyResult": "Kopyala",
    "copied": "Kopyalandı!"
  },
  "vi": {
    "title_page": "Thống kê từ khóa",
    "inputLabel": "Văn bản đầu vào",
    "placeholder": "Dán hoặc nhập văn bản để phân tích...",
    "clear": "Xóa",
    "topN": "Top",
    "minLen": "Độ dài tối thiểu",
    "excludeStopwords": "Lọc từ dừng",
    "analyzeBtn": "Phân tích",
    "loadingLib": "Đang tải thư viện...",
    "loadError": "Không thể tải thư viện",
    "emptyHint": "Nhập văn bản bên trái và nhấn Phân tích",
    "resultTitle": "Tần suất từ khóa",
    "topLabel": "Top {n}",
    "totalTokens": "{n} token hợp lệ",
    "copyResult": "Sao chép",
    "copied": "Đã sao chép!"
  },
  "th": {
    "title_page": "สถิติคำสำคัญ",
    "inputLabel": "ข้อความที่ป้อน",
    "placeholder": "วาง หรือพิมพ์ข้อความเพื่อวิเคราะห์...",
    "clear": "ล้าง",
    "topN": "Top",
    "minLen": "ความยาวขั้นต่ำ",
    "excludeStopwords": "กรองคำหยุด",
    "analyzeBtn": "วิเคราะห์",
    "loadingLib": "กำลังโหลดไลบรารี...",
    "loadError": "โหลดไลบรารีล้มเหลว",
    "emptyHint": "ป้อนข้อความทางซ้ายแล้วคลิกวิเคราะห์",
    "resultTitle": "ความถี่ของคำสำคัญ",
    "topLabel": "Top {n}",
    "totalTokens": "{n} โทเค็นที่ถูกต้อง",
    "copyResult": "คัดลอก",
    "copied": "คัดลอกแล้ว!"
  },
  "id": {
    "title_page": "Statistik Kata Kunci",
    "inputLabel": "Teks Masukan",
    "placeholder": "Tempel atau ketik teks untuk dianalisis...",
    "clear": "Hapus",
    "topN": "Top",
    "minLen": "Panjang min.",
    "excludeStopwords": "Filter kata berhenti",
    "analyzeBtn": "Analisis",
    "loadingLib": "Memuat pustaka...",
    "loadError": "Gagal memuat pustaka",
    "emptyHint": "Masukkan teks di sebelah kiri lalu klik Analisis",
    "resultTitle": "Frekuensi Kata Kunci",
    "topLabel": "Top {n}",
    "totalTokens": "{n} token valid",
    "copyResult": "Salin",
    "copied": "Disalin!"
  },
  "sv": {
    "title_page": "Nyckelordsstatistik",
    "inputLabel": "Inmatningstext",
    "placeholder": "Klistra in eller skriv text för analys...",
    "clear": "Rensa",
    "topN": "Top",
    "minLen": "Min. längd",
    "excludeStopwords": "Filtrera stoppord",
    "analyzeBtn": "Analysera",
    "loadingLib": "Laddar bibliotek...",
    "loadError": "Det gick inte att ladda biblioteket",
    "emptyHint": "Ange text till vänster och klicka på Analysera",
    "resultTitle": "Nyckelordsfrekvens",
    "topLabel": "Top {n}",
    "totalTokens": "{n} giltiga tokens",
    "copyResult": "Kopiera",
    "copied": "Kopierat!"
  },
  "pl": {
    "title_page": "Statystyki słów kluczowych",
    "inputLabel": "Tekst wejściowy",
    "placeholder": "Wklej lub wpisz tekst do analizy...",
    "clear": "Wyczyść",
    "topN": "Top",
    "minLen": "Min. długość",
    "excludeStopwords": "Filtruj słowa stop",
    "analyzeBtn": "Analizuj",
    "loadingLib": "Ładowanie biblioteki...",
    "loadError": "Nie udało się załadować biblioteki",
    "emptyHint": "Wprowadź tekst po lewej stronie i kliknij Analizuj",
    "resultTitle": "Częstotliwość słów kluczowych",
    "topLabel": "Top {n}",
    "totalTokens": "{n} prawidłowych tokenów",
    "copyResult": "Kopiuj",
    "copied": "Skopiowano!"
  },
  "zh-TW": {
    "title_page": "關鍵字統計",
    "inputLabel": "輸入文字",
    "placeholder": "貼上或輸入要分析的文字...",
    "clear": "清空",
    "topN": "顯示 Top",
    "minLen": "最短詞長",
    "excludeStopwords": "過濾常用停用詞",
    "analyzeBtn": "開始分析",
    "loadingLib": "正在載入分詞庫...",
    "loadError": "分詞庫載入失敗，請重新整理",
    "emptyHint": "在左側輸入文字後點擊「開始分析」",
    "resultTitle": "關鍵字頻率",
    "topLabel": "Top {n}",
    "totalTokens": "有效詞 {n} 個",
    "copyResult": "複製結果",
    "copied": "已複製！"
  }
}
</i18n>
