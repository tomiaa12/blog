<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const inputText = ref(`The Beauty of Morning Moments
There is something magical about the early morning, a quiet charm that few people take the time to truly appreciate. Before the world fully wakes up, the air is fresh and cool, carrying the soft scent of grass and flowers. The sky slowly changes from deep indigo to gentle pink and golden orange, as if the sun is painting a masterpiece just for those who are awake to see it.
At this hour, the noise of daily life has not yet begun. No busy car horns, no loud conversations, no hurried footsteps. Instead, you can hear the light chirping of birds, the gentle wind blowing through the trees, and the quiet sound of a new day starting. It is a moment of peace, a chance to breathe deeply and forget the worries of yesterday.
Many people rush through their mornings, checking phones, planning schedules, and feeling anxious about the day ahead. But those who pause for just a few minutes discover something precious. Morning is not only the start of a new day but also a gift—a chance to reset, to hope, and to choose kindness and patience.
Whether you sit by a window with a cup of warm tea, take a slow walk in a park, or simply close your eyes and listen to the world around you, the morning offers a moment of calm. It reminds us that beauty exists in the quiet, ordinary moments of life, if we only open our eyes and hearts to notice it.
Every morning is a new beginning, full of possibilities. It is up to us to embrace its quiet beauty and make the most of the fresh start it brings.`)
const chineseReadSpeed = ref(400)
const englishReadSpeed = ref(200)

const stats = computed(() => {
  const text = inputText.value
  if (!text) return null

  const totalChars = text.length
  const noSpaceChars = text.replace(/\s/g, "").length
  const cjkChars = (
    text.match(/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) ?? []
  ).length
  const paragraphs = text.split(/\n+/).filter(p => p.trim()).length
  const sentences = (text.match(/[.!?。！？]+/g) ?? []).length
  // Count English words (sequences of Latin letters)
  const englishWords = (text.match(/\b[a-zA-Z]+\b/g) ?? []).length

  const cjkMinutes = cjkChars / chineseReadSpeed.value
  const enMinutes = englishWords / englishReadSpeed.value
  const totalMinutes = cjkMinutes + enMinutes

  const displayMinutes = Math.max(1, Math.round(totalMinutes))

  return {
    totalChars,
    noSpaceChars,
    cjkChars,
    englishWords,
    paragraphs,
    sentences,
    readingMinutes: displayMinutes,
    rawMinutes: totalMinutes,
  }
})

function clear() {
  inputText.value = ""
}

function formatTime(minutes: number): string {
  if (minutes < 1) return `< 1 ${t("minute")}`
  if (minutes < 60)
    return `${Math.round(minutes)} ${
      minutes === 1 ? t("minute") : t("minutes")
    }`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h} ${t("hour")} ${m} ${t("minutes")}` : `${h} ${t("hour")}`
}
</script>

<template>
  <div class="reading-time">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="input-area">
      <div class="input-header">
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

    <template v-if="stats">
      <div class="stats-grid">
        <div class="stat-card highlight">
          <div class="stat-value">{{ formatTime(stats.rawMinutes) }}</div>
          <div class="stat-label">{{ t("readingTime") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalChars.toLocaleString() }}</div>
          <div class="stat-label">{{ t("totalChars") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ stats.noSpaceChars.toLocaleString() }}
          </div>
          <div class="stat-label">{{ t("noSpaceChars") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.cjkChars.toLocaleString() }}</div>
          <div class="stat-label">{{ t("cjkChars") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ stats.englishWords.toLocaleString() }}
          </div>
          <div class="stat-label">{{ t("englishWords") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.paragraphs.toLocaleString() }}</div>
          <div class="stat-label">{{ t("paragraphs") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.sentences.toLocaleString() }}</div>
          <div class="stat-label">{{ t("sentences") }}</div>
        </div>
      </div>

      <div class="speed-settings">
        <div class="speed-title">{{ t("speedSettings") }}</div>
        <div class="speed-row">
          <span class="speed-label">{{ t("chineseSpeed") }}</span>
          <el-slider
            v-model="chineseReadSpeed"
            :min="100"
            :max="800"
            :step="50"
            :marks="{ 200: '200', 400: '400', 600: '600' }"
            show-input
            size="small"
            style="flex: 1; margin: 0 16px"
          />
          <span class="speed-unit">{{ t("charsPerMin") }}</span>
        </div>
        <div class="speed-row">
          <span class="speed-label">{{ t("englishSpeed") }}</span>
          <el-slider
            v-model="englishReadSpeed"
            :min="100"
            :max="500"
            :step="25"
            :marks="{ 150: '150', 250: '250', 400: '400' }"
            show-input
            size="small"
            style="flex: 1; margin: 0 16px"
          />
          <span class="speed-unit">{{ t("wordsPerMin") }}</span>
        </div>
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
.reading-time {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.stat-card {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-align: center;
  transition: border-color 0.2s;

  &.highlight {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    grid-column: span 2;

    .stat-value {
      font-size: 1.8rem;
      color: var(--vp-c-brand-1);
    }
  }
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  font-family: var(--vp-font-family-mono);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.speed-settings {
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.speed-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.speed-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.speed-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  min-width: 80px;
}

.speed-unit {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
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
    "title_page": "阅读时间估算",
    "inputLabel": "输入文本",
    "placeholder": "粘贴或输入文章内容，自动统计字数并估算阅读时间...",
    "clear": "清空",
    "emptyHint": "请在上方输入文本",
    "readingTime": "预计阅读时间",
    "totalChars": "总字符数",
    "noSpaceChars": "不含空格",
    "cjkChars": "中文字数",
    "englishWords": "英文单词",
    "paragraphs": "段落数",
    "sentences": "句子数",
    "speedSettings": "阅读速度设置",
    "chineseSpeed": "中文速度",
    "englishSpeed": "英文速度",
    "charsPerMin": "字/分钟",
    "wordsPerMin": "词/分钟",
    "minute": "分钟",
    "minutes": "分钟",
    "hour": "小时"
  },
  "en": {
    "title_page": "Reading Time Estimator",
    "inputLabel": "Input Text",
    "placeholder": "Paste or type your text here to estimate reading time...",
    "clear": "Clear",
    "emptyHint": "Enter some text above to get statistics",
    "readingTime": "Est. Reading Time",
    "totalChars": "Total Characters",
    "noSpaceChars": "No Spaces",
    "cjkChars": "CJK Characters",
    "englishWords": "English Words",
    "paragraphs": "Paragraphs",
    "sentences": "Sentences",
    "speedSettings": "Reading Speed Settings",
    "chineseSpeed": "CJK Speed",
    "englishSpeed": "English Speed",
    "charsPerMin": "chars/min",
    "wordsPerMin": "words/min",
    "minute": "min",
    "minutes": "min",
    "hour": "hr"
  },
  "ja": {
    "title_page": "読了時間の見積もり",
    "inputLabel": "入力テキスト",
    "placeholder": "テキストを貼り付けるか入力して、読了時間を推定します...",
    "clear": "クリア",
    "emptyHint": "上にテキストを入力してください",
    "readingTime": "推定読了時間",
    "totalChars": "総文字数",
    "noSpaceChars": "スペースなし",
    "cjkChars": "CJK文字数",
    "englishWords": "英単語数",
    "paragraphs": "段落数",
    "sentences": "文数",
    "speedSettings": "読書速度設定",
    "chineseSpeed": "CJK速度",
    "englishSpeed": "英語速度",
    "charsPerMin": "字/分",
    "wordsPerMin": "語/分",
    "minute": "分",
    "minutes": "分",
    "hour": "時間"
  },
  "ko": {
    "title_page": "읽기 시간 추정",
    "inputLabel": "입력 텍스트",
    "placeholder": "텍스트를 붙여넣거나 입력하여 읽기 시간을 추정합니다...",
    "clear": "지우기",
    "emptyHint": "위에 텍스트를 입력하세요",
    "readingTime": "예상 읽기 시간",
    "totalChars": "총 문자 수",
    "noSpaceChars": "공백 제외",
    "cjkChars": "한중일 문자",
    "englishWords": "영어 단어",
    "paragraphs": "단락 수",
    "sentences": "문장 수",
    "speedSettings": "읽기 속도 설정",
    "chineseSpeed": "CJK 속도",
    "englishSpeed": "영어 속도",
    "charsPerMin": "자/분",
    "wordsPerMin": "단어/분",
    "minute": "분",
    "minutes": "분",
    "hour": "시간"
  },
  "fr": {
    "title_page": "Estimateur de temps de lecture",
    "inputLabel": "Texte d'entrée",
    "placeholder": "Collez ou saisissez votre texte pour estimer le temps de lecture...",
    "clear": "Effacer",
    "emptyHint": "Saisissez du texte ci-dessus pour obtenir des statistiques",
    "readingTime": "Temps de lecture estimé",
    "totalChars": "Caractères totaux",
    "noSpaceChars": "Sans espaces",
    "cjkChars": "Caractères CJK",
    "englishWords": "Mots anglais",
    "paragraphs": "Paragraphes",
    "sentences": "Phrases",
    "speedSettings": "Paramètres de vitesse",
    "chineseSpeed": "Vitesse CJK",
    "englishSpeed": "Vitesse anglais",
    "charsPerMin": "car./min",
    "wordsPerMin": "mots/min",
    "minute": "min",
    "minutes": "min",
    "hour": "h"
  },
  "de": {
    "title_page": "Lesezeit-Schätzer",
    "inputLabel": "Eingabetext",
    "placeholder": "Text einfügen oder eingeben, um die Lesezeit zu schätzen...",
    "clear": "Löschen",
    "emptyHint": "Geben Sie oben Text ein, um Statistiken zu erhalten",
    "readingTime": "Geschätzte Lesezeit",
    "totalChars": "Zeichen gesamt",
    "noSpaceChars": "Ohne Leerzeichen",
    "cjkChars": "CJK-Zeichen",
    "englishWords": "Englische Wörter",
    "paragraphs": "Absätze",
    "sentences": "Sätze",
    "speedSettings": "Lesegeschwindigkeit",
    "chineseSpeed": "CJK-Geschwindigkeit",
    "englishSpeed": "Englisch-Geschwindigkeit",
    "charsPerMin": "Zeichen/Min",
    "wordsPerMin": "Wörter/Min",
    "minute": "Min",
    "minutes": "Min",
    "hour": "Std"
  },
  "es": {
    "title_page": "Estimador de tiempo de lectura",
    "inputLabel": "Texto de entrada",
    "placeholder": "Pegue o escriba su texto para estimar el tiempo de lectura...",
    "clear": "Limpiar",
    "emptyHint": "Ingrese texto arriba para obtener estadísticas",
    "readingTime": "Tiempo de lectura est.",
    "totalChars": "Caracteres totales",
    "noSpaceChars": "Sin espacios",
    "cjkChars": "Caracteres CJK",
    "englishWords": "Palabras en inglés",
    "paragraphs": "Párrafos",
    "sentences": "Oraciones",
    "speedSettings": "Velocidad de lectura",
    "chineseSpeed": "Velocidad CJK",
    "englishSpeed": "Velocidad inglés",
    "charsPerMin": "car./min",
    "wordsPerMin": "pal./min",
    "minute": "min",
    "minutes": "min",
    "hour": "h"
  },
  "pt": {
    "title_page": "Estimador de tempo de leitura",
    "inputLabel": "Texto de entrada",
    "placeholder": "Cole ou digite seu texto para estimar o tempo de leitura...",
    "clear": "Limpar",
    "emptyHint": "Insira texto acima para obter estatísticas",
    "readingTime": "Tempo de leitura est.",
    "totalChars": "Caracteres totais",
    "noSpaceChars": "Sem espaços",
    "cjkChars": "Caracteres CJK",
    "englishWords": "Palavras em inglês",
    "paragraphs": "Parágrafos",
    "sentences": "Sentenças",
    "speedSettings": "Velocidade de leitura",
    "chineseSpeed": "Velocidade CJK",
    "englishSpeed": "Velocidade inglês",
    "charsPerMin": "car./min",
    "wordsPerMin": "pal./min",
    "minute": "min",
    "minutes": "min",
    "hour": "h"
  },
  "ru": {
    "title_page": "Оценщик времени чтения",
    "inputLabel": "Входной текст",
    "placeholder": "Вставьте или введите текст для оценки времени чтения...",
    "clear": "Очистить",
    "emptyHint": "Введите текст выше для получения статистики",
    "readingTime": "Время чтения",
    "totalChars": "Всего символов",
    "noSpaceChars": "Без пробелов",
    "cjkChars": "Символов CJK",
    "englishWords": "Английских слов",
    "paragraphs": "Абзацев",
    "sentences": "Предложений",
    "speedSettings": "Скорость чтения",
    "chineseSpeed": "Скорость CJK",
    "englishSpeed": "Скорость английского",
    "charsPerMin": "симв./мин",
    "wordsPerMin": "слов/мин",
    "minute": "мин",
    "minutes": "мин",
    "hour": "ч"
  },
  "ar": {
    "title_page": "تقدير وقت القراءة",
    "inputLabel": "النص المدخل",
    "placeholder": "الصق النص أو اكتبه لتقدير وقت القراءة...",
    "clear": "مسح",
    "emptyHint": "أدخل نصاً أعلاه للحصول على إحصائيات",
    "readingTime": "وقت القراءة المقدّر",
    "totalChars": "إجمالي الأحرف",
    "noSpaceChars": "بدون مسافات",
    "cjkChars": "أحرف CJK",
    "englishWords": "الكلمات الإنجليزية",
    "paragraphs": "الفقرات",
    "sentences": "الجمل",
    "speedSettings": "إعدادات سرعة القراءة",
    "chineseSpeed": "سرعة CJK",
    "englishSpeed": "سرعة الإنجليزية",
    "charsPerMin": "حرف/دقيقة",
    "wordsPerMin": "كلمة/دقيقة",
    "minute": "دقيقة",
    "minutes": "دقائق",
    "hour": "ساعة"
  },
  "hi": {
    "title_page": "पढ़ने का समय अनुमान",
    "inputLabel": "इनपुट टेक्स्ट",
    "placeholder": "पढ़ने का समय अनुमानित करने के लिए टेक्स्ट पेस्ट करें या टाइप करें...",
    "clear": "साफ़ करें",
    "emptyHint": "आँकड़े प्राप्त करने के लिए ऊपर टेक्स्ट दर्ज करें",
    "readingTime": "अनुमानित पढ़ने का समय",
    "totalChars": "कुल वर्ण",
    "noSpaceChars": "बिना रिक्त स्थान",
    "cjkChars": "CJK वर्ण",
    "englishWords": "अंग्रेज़ी शब्द",
    "paragraphs": "अनुच्छेद",
    "sentences": "वाक्य",
    "speedSettings": "पढ़ने की गति सेटिंग",
    "chineseSpeed": "CJK गति",
    "englishSpeed": "अंग्रेज़ी गति",
    "charsPerMin": "वर्ण/मिनट",
    "wordsPerMin": "शब्द/मिनट",
    "minute": "मिनट",
    "minutes": "मिनट",
    "hour": "घंटा"
  },
  "it": {
    "title_page": "Stimatore di tempo di lettura",
    "inputLabel": "Testo di input",
    "placeholder": "Incolla o inserisci il testo per stimare il tempo di lettura...",
    "clear": "Cancella",
    "emptyHint": "Inserisci del testo sopra per ottenere statistiche",
    "readingTime": "Tempo di lettura stimato",
    "totalChars": "Caratteri totali",
    "noSpaceChars": "Senza spazi",
    "cjkChars": "Caratteri CJK",
    "englishWords": "Parole inglesi",
    "paragraphs": "Paragrafi",
    "sentences": "Frasi",
    "speedSettings": "Velocità di lettura",
    "chineseSpeed": "Velocità CJK",
    "englishSpeed": "Velocità inglese",
    "charsPerMin": "car./min",
    "wordsPerMin": "par./min",
    "minute": "min",
    "minutes": "min",
    "hour": "h"
  },
  "nl": {
    "title_page": "Leestijd schatter",
    "inputLabel": "Invoertekst",
    "placeholder": "Plak of typ uw tekst om de leestijd te schatten...",
    "clear": "Wissen",
    "emptyHint": "Voer hierboven tekst in voor statistieken",
    "readingTime": "Geschatte leestijd",
    "totalChars": "Totaal tekens",
    "noSpaceChars": "Zonder spaties",
    "cjkChars": "CJK-tekens",
    "englishWords": "Engelse woorden",
    "paragraphs": "Alinea's",
    "sentences": "Zinnen",
    "speedSettings": "Leessnelheid instellingen",
    "chineseSpeed": "CJK-snelheid",
    "englishSpeed": "Engelse snelheid",
    "charsPerMin": "tek./min",
    "wordsPerMin": "wrd./min",
    "minute": "min",
    "minutes": "min",
    "hour": "u"
  },
  "tr": {
    "title_page": "Okuma Süresi Tahmincisi",
    "inputLabel": "Giriş Metni",
    "placeholder": "Okuma süresini tahmin etmek için metin yapıştırın veya yazın...",
    "clear": "Temizle",
    "emptyHint": "İstatistik almak için yukarıya metin girin",
    "readingTime": "Tahmini okuma süresi",
    "totalChars": "Toplam karakter",
    "noSpaceChars": "Boşluksuz",
    "cjkChars": "CJK karakterler",
    "englishWords": "İngilizce kelimeler",
    "paragraphs": "Paragraflar",
    "sentences": "Cümleler",
    "speedSettings": "Okuma hızı ayarları",
    "chineseSpeed": "CJK hızı",
    "englishSpeed": "İngilizce hızı",
    "charsPerMin": "kar./dak",
    "wordsPerMin": "kel./dak",
    "minute": "dak",
    "minutes": "dak",
    "hour": "sa"
  },
  "vi": {
    "title_page": "Ước tính thời gian đọc",
    "inputLabel": "Văn bản đầu vào",
    "placeholder": "Dán hoặc nhập văn bản để ước tính thời gian đọc...",
    "clear": "Xóa",
    "emptyHint": "Nhập văn bản ở trên để xem thống kê",
    "readingTime": "Thời gian đọc ước tính",
    "totalChars": "Tổng ký tự",
    "noSpaceChars": "Không tính khoảng trắng",
    "cjkChars": "Ký tự CJK",
    "englishWords": "Từ tiếng Anh",
    "paragraphs": "Đoạn văn",
    "sentences": "Câu",
    "speedSettings": "Cài đặt tốc độ đọc",
    "chineseSpeed": "Tốc độ CJK",
    "englishSpeed": "Tốc độ tiếng Anh",
    "charsPerMin": "ký tự/phút",
    "wordsPerMin": "từ/phút",
    "minute": "phút",
    "minutes": "phút",
    "hour": "giờ"
  },
  "th": {
    "title_page": "ประมาณเวลาในการอ่าน",
    "inputLabel": "ข้อความที่ป้อน",
    "placeholder": "วาง หรือพิมพ์ข้อความเพื่อประมาณเวลาในการอ่าน...",
    "clear": "ล้าง",
    "emptyHint": "ป้อนข้อความด้านบนเพื่อดูสถิติ",
    "readingTime": "เวลาอ่านโดยประมาณ",
    "totalChars": "ตัวอักษรทั้งหมด",
    "noSpaceChars": "ไม่นับช่องว่าง",
    "cjkChars": "อักขระ CJK",
    "englishWords": "คำภาษาอังกฤษ",
    "paragraphs": "ย่อหน้า",
    "sentences": "ประโยค",
    "speedSettings": "การตั้งค่าความเร็วในการอ่าน",
    "chineseSpeed": "ความเร็ว CJK",
    "englishSpeed": "ความเร็วภาษาอังกฤษ",
    "charsPerMin": "ตัว/นาที",
    "wordsPerMin": "คำ/นาที",
    "minute": "นาที",
    "minutes": "นาที",
    "hour": "ชั่วโมง"
  },
  "id": {
    "title_page": "Estimasi Waktu Baca",
    "inputLabel": "Teks Masukan",
    "placeholder": "Tempel atau ketik teks untuk memperkirakan waktu baca...",
    "clear": "Hapus",
    "emptyHint": "Masukkan teks di atas untuk melihat statistik",
    "readingTime": "Perkiraan waktu baca",
    "totalChars": "Total karakter",
    "noSpaceChars": "Tanpa spasi",
    "cjkChars": "Karakter CJK",
    "englishWords": "Kata bahasa Inggris",
    "paragraphs": "Paragraf",
    "sentences": "Kalimat",
    "speedSettings": "Pengaturan kecepatan baca",
    "chineseSpeed": "Kecepatan CJK",
    "englishSpeed": "Kecepatan bahasa Inggris",
    "charsPerMin": "kar./menit",
    "wordsPerMin": "kat./menit",
    "minute": "menit",
    "minutes": "menit",
    "hour": "jam"
  },
  "sv": {
    "title_page": "Lästidsuppskattare",
    "inputLabel": "Inmatningstext",
    "placeholder": "Klistra in eller skriv text för att uppskatta lästiden...",
    "clear": "Rensa",
    "emptyHint": "Ange text ovan för att se statistik",
    "readingTime": "Beräknad lästid",
    "totalChars": "Totalt tecken",
    "noSpaceChars": "Utan mellanslag",
    "cjkChars": "CJK-tecken",
    "englishWords": "Engelska ord",
    "paragraphs": "Stycken",
    "sentences": "Meningar",
    "speedSettings": "Lästighetsinställningar",
    "chineseSpeed": "CJK-hastighet",
    "englishSpeed": "Engelsk hastighet",
    "charsPerMin": "tecken/min",
    "wordsPerMin": "ord/min",
    "minute": "min",
    "minutes": "min",
    "hour": "h"
  },
  "pl": {
    "title_page": "Szacowanie czasu czytania",
    "inputLabel": "Tekst wejściowy",
    "placeholder": "Wklej lub wpisz tekst, aby oszacować czas czytania...",
    "clear": "Wyczyść",
    "emptyHint": "Wprowadź tekst powyżej, aby zobaczyć statystyki",
    "readingTime": "Szacowany czas czytania",
    "totalChars": "Łączna liczba znaków",
    "noSpaceChars": "Bez spacji",
    "cjkChars": "Znaki CJK",
    "englishWords": "Angielskie słowa",
    "paragraphs": "Akapity",
    "sentences": "Zdania",
    "speedSettings": "Ustawienia prędkości czytania",
    "chineseSpeed": "Prędkość CJK",
    "englishSpeed": "Prędkość angielskiego",
    "charsPerMin": "zn./min",
    "wordsPerMin": "sł./min",
    "minute": "min",
    "minutes": "min",
    "hour": "godz"
  },
  "zh-TW": {
    "title_page": "閱讀時間估算",
    "inputLabel": "輸入文字",
    "placeholder": "貼上或輸入文章內容，自動統計字數並估算閱讀時間...",
    "clear": "清空",
    "emptyHint": "請在上方輸入文字",
    "readingTime": "預計閱讀時間",
    "totalChars": "總字元數",
    "noSpaceChars": "不含空格",
    "cjkChars": "中文字數",
    "englishWords": "英文單字",
    "paragraphs": "段落數",
    "sentences": "句子數",
    "speedSettings": "閱讀速度設定",
    "chineseSpeed": "中文速度",
    "englishSpeed": "英文速度",
    "charsPerMin": "字/分鐘",
    "wordsPerMin": "詞/分鐘",
    "minute": "分鐘",
    "minutes": "分鐘",
    "hour": "小時"
  }
}
</i18n>
