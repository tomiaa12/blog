<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const inputText = ref(`君不见黄河之水天上来，奔流到海不复回。
君不见高堂明镜悲白发，朝如青丝暮成雪。
人生得意须尽欢，莫使金樽空对月。
天生我材必有用，千金散尽还复来。
烹羊宰牛且为乐，会须一饮三百杯。
岑夫子，丹丘生，将进酒，杯莫停。
与君歌一曲，请君为我倾耳听。(倾耳听 一作：侧耳听)
钟鼓馔玉不足贵，但愿长醉不愿醒。(不足贵 一作：何足贵；不愿醒 一作：不复醒)
古来圣贤皆寂寞，惟有饮者留其名。(古来 一作：自古；惟 通：唯)
陈王昔时宴平乐，斗酒十千恣欢谑。
主人何为言少钱，径须沽取对君酌。
五花马、千金裘，呼儿将出换美酒，与尔同销万古愁。`)

const stats = computed(() => {
  const text = inputText.value
  if (!text) return null

  const lines = text.split("\n")
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())
  const sentences = text.match(/[^.!?。！？\n]+[.!?。！？]+/g) ?? []

  const totalChars = text.length
  const noSpaceChars = text.replace(/\s/g, "").length
  const spaces = text.match(/\s/g)?.length ?? 0

  const cjkChars =
    text.match(/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g)
      ?.length ?? 0
  const latinLetters = text.match(/[a-zA-Z]/g)?.length ?? 0
  const digits = text.match(/[0-9０-９]/g)?.length ?? 0
  const punctuation =
    text.match(/[^\w\s\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g)
      ?.length ?? 0
  const englishWords = text.match(/\b[a-zA-Z]+\b/g)?.length ?? 0

  // Frequency analysis (top 10 non-whitespace chars)
  const freq: Record<string, number> = {}
  for (const ch of text) {
    if (!/\s/.test(ch)) freq[ch] = (freq[ch] ?? 0) + 1
  }
  const topChars = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  return {
    totalChars,
    noSpaceChars,
    spaces,
    cjkChars,
    latinLetters,
    digits,
    punctuation,
    englishWords,
    lineCount: lines.length,
    paragraphCount: Math.max(paragraphs.length, text.trim() ? 1 : 0),
    sentenceCount: sentences.length,
    topChars,
  }
})

function copyStats() {
  if (!stats.value) return
  const s = stats.value
  const lines = [
    `${t("totalChars")}: ${s.totalChars}`,
    `${t("noSpaceChars")}: ${s.noSpaceChars}`,
    `${t("cjkChars")}: ${s.cjkChars}`,
    `${t("latinLetters")}: ${s.latinLetters}`,
    `${t("digits")}: ${s.digits}`,
    `${t("englishWords")}: ${s.englishWords}`,
    `${t("lineCount")}: ${s.lineCount}`,
    `${t("paragraphCount")}: ${s.paragraphCount}`,
    `${t("sentenceCount")}: ${s.sentenceCount}`,
  ].join("\n")
  navigator.clipboard.writeText(lines).then(() => {
    ElMessage({ message: t("copied"), type: "success", duration: 1500 })
  })
}

function clear() {
  inputText.value = ""
}
</script>

<template>
  <div class="word-count">
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
      <div class="stats-header">
        <span class="section-title">{{ t("statsTitle") }}</span>
        <el-button
          size="small"
          @click="copyStats"
          >{{ t("copyStats") }}</el-button
        >
      </div>

      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-value">{{ stats.totalChars.toLocaleString() }}</div>
          <div class="stat-label">{{ t("totalChars") }}</div>
        </div>
        <div class="stat-card primary">
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
            {{ stats.latinLetters.toLocaleString() }}
          </div>
          <div class="stat-label">{{ t("latinLetters") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ stats.englishWords.toLocaleString() }}
          </div>
          <div class="stat-label">{{ t("englishWords") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.digits.toLocaleString() }}</div>
          <div class="stat-label">{{ t("digits") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.punctuation.toLocaleString() }}</div>
          <div class="stat-label">{{ t("punctuation") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.spaces.toLocaleString() }}</div>
          <div class="stat-label">{{ t("spaces") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.lineCount.toLocaleString() }}</div>
          <div class="stat-label">{{ t("lineCount") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ stats.paragraphCount.toLocaleString() }}
          </div>
          <div class="stat-label">{{ t("paragraphCount") }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ stats.sentenceCount.toLocaleString() }}
          </div>
          <div class="stat-label">{{ t("sentenceCount") }}</div>
        </div>
      </div>

      <div
        v-if="stats.topChars.length"
        class="freq-section"
      >
        <div class="section-title">{{ t("freqTitle") }}</div>
        <div class="freq-list">
          <div
            v-for="[ch, count] in stats.topChars"
            :key="ch"
            class="freq-item"
          >
            <span class="freq-char">{{ ch }}</span>
            <div class="freq-bar-wrap">
              <div
                class="freq-bar"
                :style="{ width: (count / stats.topChars[0][1]) * 100 + '%' }"
              />
            </div>
            <span class="freq-count">{{ count }}</span>
          </div>
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
.word-count {
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

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 28px;
}

.stat-card {
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-align: center;

  &.primary {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);

    .stat-value {
      color: var(--vp-c-brand-1);
      font-size: 1.6rem;
    }
  }
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  font-family: var(--vp-font-family-mono);
}

.stat-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.freq-section {
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.freq-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}

.freq-item {
  display: grid;
  grid-template-columns: 28px 1fr 48px;
  align-items: center;
  gap: 10px;
}

.freq-char {
  font-size: 1rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  font-weight: 600;
  text-align: center;
}

.freq-bar-wrap {
  height: 8px;
  background: var(--vp-c-divider);
  border-radius: 4px;
  overflow: hidden;
}

.freq-bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.freq-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  text-align: right;
  font-family: var(--vp-font-family-mono);
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
    "title_page": "字数统计",
    "inputLabel": "输入文本",
    "placeholder": "粘贴或输入要统计的文本...",
    "clear": "清空",
    "copied": "已复制！",
    "emptyHint": "请在上方输入文本",
    "statsTitle": "统计结果",
    "copyStats": "复制统计",
    "totalChars": "总字符数",
    "noSpaceChars": "不含空格",
    "cjkChars": "汉字数",
    "latinLetters": "英文字母",
    "englishWords": "英文单词",
    "digits": "数字",
    "punctuation": "标点符号",
    "spaces": "空白字符",
    "lineCount": "行数",
    "paragraphCount": "段落数",
    "sentenceCount": "句子数",
    "freqTitle": "字符频率（前15）"
  },
  "en": {
    "title_page": "Word Count",
    "inputLabel": "Input Text",
    "placeholder": "Paste or type the text to analyze...",
    "clear": "Clear",
    "copied": "Copied!",
    "emptyHint": "Enter some text above to get statistics",
    "statsTitle": "Statistics",
    "copyStats": "Copy Stats",
    "totalChars": "Total Chars",
    "noSpaceChars": "No Spaces",
    "cjkChars": "CJK Chars",
    "latinLetters": "Latin Letters",
    "englishWords": "English Words",
    "digits": "Digits",
    "punctuation": "Punctuation",
    "spaces": "Whitespace",
    "lineCount": "Lines",
    "paragraphCount": "Paragraphs",
    "sentenceCount": "Sentences",
    "freqTitle": "Character Frequency (Top 15)"
  },
  "ja": {
    "title_page": "文字数カウント",
    "inputLabel": "入力テキスト",
    "placeholder": "分析するテキストを貼り付けるか入力してください...",
    "clear": "クリア",
    "copied": "コピーしました",
    "emptyHint": "上にテキストを入力してください",
    "statsTitle": "統計結果",
    "copyStats": "統計をコピー",
    "totalChars": "総文字数",
    "noSpaceChars": "スペースなし",
    "cjkChars": "CJK文字数",
    "latinLetters": "ラテン文字",
    "englishWords": "英単語数",
    "digits": "数字",
    "punctuation": "句読点",
    "spaces": "空白",
    "lineCount": "行数",
    "paragraphCount": "段落数",
    "sentenceCount": "文数",
    "freqTitle": "文字頻度（上位15）"
  },
  "ko": {
    "title_page": "글자 수 세기",
    "inputLabel": "입력 텍스트",
    "placeholder": "분석할 텍스트를 붙여넣거나 입력하세요...",
    "clear": "지우기",
    "copied": "복사되었습니다!",
    "emptyHint": "위에 텍스트를 입력하세요",
    "statsTitle": "통계 결과",
    "copyStats": "통계 복사",
    "totalChars": "총 문자 수",
    "noSpaceChars": "공백 제외",
    "cjkChars": "한중일 문자",
    "latinLetters": "라틴 문자",
    "englishWords": "영어 단어",
    "digits": "숫자",
    "punctuation": "구두점",
    "spaces": "공백",
    "lineCount": "줄 수",
    "paragraphCount": "단락 수",
    "sentenceCount": "문장 수",
    "freqTitle": "문자 빈도 (상위 15)"
  },
  "fr": {
    "title_page": "Compteur de mots",
    "inputLabel": "Texte d'entrée",
    "placeholder": "Collez ou saisissez le texte à analyser...",
    "clear": "Effacer",
    "copied": "Copié !",
    "emptyHint": "Saisissez du texte ci-dessus",
    "statsTitle": "Statistiques",
    "copyStats": "Copier les stats",
    "totalChars": "Caractères totaux",
    "noSpaceChars": "Sans espaces",
    "cjkChars": "Caractères CJK",
    "latinLetters": "Lettres latines",
    "englishWords": "Mots anglais",
    "digits": "Chiffres",
    "punctuation": "Ponctuation",
    "spaces": "Espaces",
    "lineCount": "Lignes",
    "paragraphCount": "Paragraphes",
    "sentenceCount": "Phrases",
    "freqTitle": "Fréquence des caractères (Top 15)"
  },
  "de": {
    "title_page": "Wörter zählen",
    "inputLabel": "Eingabetext",
    "placeholder": "Text zum Analysieren einfügen oder eingeben...",
    "clear": "Löschen",
    "copied": "Kopiert!",
    "emptyHint": "Geben Sie oben Text ein",
    "statsTitle": "Statistiken",
    "copyStats": "Stats kopieren",
    "totalChars": "Zeichen gesamt",
    "noSpaceChars": "Ohne Leerzeichen",
    "cjkChars": "CJK-Zeichen",
    "latinLetters": "Lateinische Buchstaben",
    "englishWords": "Englische Wörter",
    "digits": "Ziffern",
    "punctuation": "Satzzeichen",
    "spaces": "Leerzeichen",
    "lineCount": "Zeilen",
    "paragraphCount": "Absätze",
    "sentenceCount": "Sätze",
    "freqTitle": "Zeichenhäufigkeit (Top 15)"
  },
  "es": {
    "title_page": "Contador de palabras",
    "inputLabel": "Texto de entrada",
    "placeholder": "Pegue o escriba el texto a analizar...",
    "clear": "Limpiar",
    "copied": "¡Copiado!",
    "emptyHint": "Ingrese texto arriba",
    "statsTitle": "Estadísticas",
    "copyStats": "Copiar estadísticas",
    "totalChars": "Caracteres totales",
    "noSpaceChars": "Sin espacios",
    "cjkChars": "Caracteres CJK",
    "latinLetters": "Letras latinas",
    "englishWords": "Palabras en inglés",
    "digits": "Dígitos",
    "punctuation": "Puntuación",
    "spaces": "Espacios",
    "lineCount": "Líneas",
    "paragraphCount": "Párrafos",
    "sentenceCount": "Oraciones",
    "freqTitle": "Frecuencia de caracteres (Top 15)"
  },
  "pt": {
    "title_page": "Contador de palavras",
    "inputLabel": "Texto de entrada",
    "placeholder": "Cole ou escreva o texto a analisar...",
    "clear": "Limpar",
    "copied": "Copiado!",
    "emptyHint": "Insira texto acima",
    "statsTitle": "Estatísticas",
    "copyStats": "Copiar stats",
    "totalChars": "Caracteres totais",
    "noSpaceChars": "Sem espaços",
    "cjkChars": "Caracteres CJK",
    "latinLetters": "Letras latinas",
    "englishWords": "Palavras inglesas",
    "digits": "Dígitos",
    "punctuation": "Pontuação",
    "spaces": "Espaços",
    "lineCount": "Linhas",
    "paragraphCount": "Parágrafos",
    "sentenceCount": "Sentenças",
    "freqTitle": "Frequência de caracteres (Top 15)"
  },
  "ru": {
    "title_page": "Подсчёт слов",
    "inputLabel": "Входной текст",
    "placeholder": "Вставьте или введите текст для анализа...",
    "clear": "Очистить",
    "copied": "Скопировано!",
    "emptyHint": "Введите текст выше",
    "statsTitle": "Статистика",
    "copyStats": "Копировать статистику",
    "totalChars": "Всего символов",
    "noSpaceChars": "Без пробелов",
    "cjkChars": "Символов CJK",
    "latinLetters": "Латинских букв",
    "englishWords": "Английских слов",
    "digits": "Цифр",
    "punctuation": "Знаков пунктуации",
    "spaces": "Пробелов",
    "lineCount": "Строк",
    "paragraphCount": "Абзацев",
    "sentenceCount": "Предложений",
    "freqTitle": "Частота символов (Топ 15)"
  },
  "ar": {
    "title_page": "عداد الكلمات",
    "inputLabel": "النص المدخل",
    "placeholder": "الصق النص أو اكتبه للتحليل...",
    "clear": "مسح",
    "copied": "تم النسخ!",
    "emptyHint": "أدخل نصاً أعلاه",
    "statsTitle": "الإحصائيات",
    "copyStats": "نسخ الإحصائيات",
    "totalChars": "إجمالي الأحرف",
    "noSpaceChars": "بدون مسافات",
    "cjkChars": "أحرف CJK",
    "latinLetters": "أحرف لاتينية",
    "englishWords": "الكلمات الإنجليزية",
    "digits": "الأرقام",
    "punctuation": "علامات الترقيم",
    "spaces": "المسافات",
    "lineCount": "الأسطر",
    "paragraphCount": "الفقرات",
    "sentenceCount": "الجمل",
    "freqTitle": "تكرار الأحرف (أفضل 15)"
  },
  "hi": {
    "title_page": "शब्द गणना",
    "inputLabel": "इनपुट टेक्स्ट",
    "placeholder": "विश्लेषण के लिए टेक्स्ट पेस्ट करें या टाइप करें...",
    "clear": "साफ़ करें",
    "copied": "कॉपी हो गया!",
    "emptyHint": "ऊपर टेक्स्ट दर्ज करें",
    "statsTitle": "आँकड़े",
    "copyStats": "आँकड़े कॉपी करें",
    "totalChars": "कुल वर्ण",
    "noSpaceChars": "बिना रिक्त स्थान",
    "cjkChars": "CJK वर्ण",
    "latinLetters": "लैटिन अक्षर",
    "englishWords": "अंग्रेज़ी शब्द",
    "digits": "अंक",
    "punctuation": "विराम चिह्न",
    "spaces": "रिक्त स्थान",
    "lineCount": "पंक्तियाँ",
    "paragraphCount": "अनुच्छेद",
    "sentenceCount": "वाक्य",
    "freqTitle": "वर्ण आवृत्ति (शीर्ष 15)"
  },
  "it": {
    "title_page": "Contatore di parole",
    "inputLabel": "Testo di input",
    "placeholder": "Incolla o inserisci il testo da analizzare...",
    "clear": "Cancella",
    "copied": "Copiato!",
    "emptyHint": "Inserire testo sopra",
    "statsTitle": "Statistiche",
    "copyStats": "Copia statistiche",
    "totalChars": "Caratteri totali",
    "noSpaceChars": "Senza spazi",
    "cjkChars": "Caratteri CJK",
    "latinLetters": "Lettere latine",
    "englishWords": "Parole inglesi",
    "digits": "Cifre",
    "punctuation": "Punteggiatura",
    "spaces": "Spazi",
    "lineCount": "Righe",
    "paragraphCount": "Paragrafi",
    "sentenceCount": "Frasi",
    "freqTitle": "Frequenza caratteri (Top 15)"
  },
  "nl": {
    "title_page": "Woordteller",
    "inputLabel": "Invoertekst",
    "placeholder": "Plak of typ de te analyseren tekst...",
    "clear": "Wissen",
    "copied": "Gekopieerd!",
    "emptyHint": "Voer hierboven tekst in",
    "statsTitle": "Statistieken",
    "copyStats": "Stats kopiëren",
    "totalChars": "Totaal tekens",
    "noSpaceChars": "Zonder spaties",
    "cjkChars": "CJK-tekens",
    "latinLetters": "Latijnse letters",
    "englishWords": "Engelse woorden",
    "digits": "Cijfers",
    "punctuation": "Interpunctie",
    "spaces": "Spaties",
    "lineCount": "Regels",
    "paragraphCount": "Alinea's",
    "sentenceCount": "Zinnen",
    "freqTitle": "Tekenfrequentie (Top 15)"
  },
  "tr": {
    "title_page": "Kelime Sayacı",
    "inputLabel": "Giriş Metni",
    "placeholder": "Analiz edilecek metni yapıştırın veya yazın...",
    "clear": "Temizle",
    "copied": "Kopyalandı!",
    "emptyHint": "Yukarıya metin girin",
    "statsTitle": "İstatistikler",
    "copyStats": "İstatistikleri Kopyala",
    "totalChars": "Toplam karakter",
    "noSpaceChars": "Boşluksuz",
    "cjkChars": "CJK karakterler",
    "latinLetters": "Latin harfleri",
    "englishWords": "İngilizce kelimeler",
    "digits": "Rakamlar",
    "punctuation": "Noktalama",
    "spaces": "Boşluklar",
    "lineCount": "Satırlar",
    "paragraphCount": "Paragraflar",
    "sentenceCount": "Cümleler",
    "freqTitle": "Karakter sıklığı (Top 15)"
  },
  "vi": {
    "title_page": "Đếm từ",
    "inputLabel": "Văn bản đầu vào",
    "placeholder": "Dán hoặc nhập văn bản để phân tích...",
    "clear": "Xóa",
    "copied": "Đã sao chép!",
    "emptyHint": "Nhập văn bản ở trên",
    "statsTitle": "Thống kê",
    "copyStats": "Sao chép thống kê",
    "totalChars": "Tổng ký tự",
    "noSpaceChars": "Không tính khoảng trắng",
    "cjkChars": "Ký tự CJK",
    "latinLetters": "Chữ cái Latin",
    "englishWords": "Từ tiếng Anh",
    "digits": "Chữ số",
    "punctuation": "Dấu câu",
    "spaces": "Khoảng trắng",
    "lineCount": "Dòng",
    "paragraphCount": "Đoạn văn",
    "sentenceCount": "Câu",
    "freqTitle": "Tần suất ký tự (Top 15)"
  },
  "th": {
    "title_page": "นับจำนวนคำ",
    "inputLabel": "ข้อความที่ป้อน",
    "placeholder": "วาง หรือพิมพ์ข้อความเพื่อวิเคราะห์...",
    "clear": "ล้าง",
    "copied": "คัดลอกแล้ว!",
    "emptyHint": "ป้อนข้อความด้านบน",
    "statsTitle": "สถิติ",
    "copyStats": "คัดลอกสถิติ",
    "totalChars": "ตัวอักษรทั้งหมด",
    "noSpaceChars": "ไม่นับช่องว่าง",
    "cjkChars": "อักขระ CJK",
    "latinLetters": "ตัวอักษรละติน",
    "englishWords": "คำภาษาอังกฤษ",
    "digits": "ตัวเลข",
    "punctuation": "เครื่องหมายวรรคตอน",
    "spaces": "ช่องว่าง",
    "lineCount": "บรรทัด",
    "paragraphCount": "ย่อหน้า",
    "sentenceCount": "ประโยค",
    "freqTitle": "ความถี่ของตัวอักษร (Top 15)"
  },
  "id": {
    "title_page": "Penghitung Kata",
    "inputLabel": "Teks Masukan",
    "placeholder": "Tempel atau ketik teks untuk dianalisis...",
    "clear": "Hapus",
    "copied": "Disalin!",
    "emptyHint": "Masukkan teks di atas",
    "statsTitle": "Statistik",
    "copyStats": "Salin Statistik",
    "totalChars": "Total karakter",
    "noSpaceChars": "Tanpa spasi",
    "cjkChars": "Karakter CJK",
    "latinLetters": "Huruf Latin",
    "englishWords": "Kata bahasa Inggris",
    "digits": "Angka",
    "punctuation": "Tanda baca",
    "spaces": "Spasi",
    "lineCount": "Baris",
    "paragraphCount": "Paragraf",
    "sentenceCount": "Kalimat",
    "freqTitle": "Frekuensi karakter (Top 15)"
  },
  "sv": {
    "title_page": "Ordräknare",
    "inputLabel": "Inmatningstext",
    "placeholder": "Klistra in eller skriv text för analys...",
    "clear": "Rensa",
    "copied": "Kopierat!",
    "emptyHint": "Ange text ovan",
    "statsTitle": "Statistik",
    "copyStats": "Kopiera statistik",
    "totalChars": "Totalt tecken",
    "noSpaceChars": "Utan mellanslag",
    "cjkChars": "CJK-tecken",
    "latinLetters": "Latinska bokstäver",
    "englishWords": "Engelska ord",
    "digits": "Siffror",
    "punctuation": "Skiljetecken",
    "spaces": "Mellanslag",
    "lineCount": "Rader",
    "paragraphCount": "Stycken",
    "sentenceCount": "Meningar",
    "freqTitle": "Teckensfrekvens (Top 15)"
  },
  "pl": {
    "title_page": "Licznik słów",
    "inputLabel": "Tekst wejściowy",
    "placeholder": "Wklej lub wpisz tekst do analizy...",
    "clear": "Wyczyść",
    "copied": "Skopiowano!",
    "emptyHint": "Wprowadź tekst powyżej",
    "statsTitle": "Statystyki",
    "copyStats": "Kopiuj statystyki",
    "totalChars": "Łączna liczba znaków",
    "noSpaceChars": "Bez spacji",
    "cjkChars": "Znaki CJK",
    "latinLetters": "Litery łacińskie",
    "englishWords": "Angielskie słowa",
    "digits": "Cyfry",
    "punctuation": "Interpunkcja",
    "spaces": "Spacje",
    "lineCount": "Wiersze",
    "paragraphCount": "Akapity",
    "sentenceCount": "Zdania",
    "freqTitle": "Częstotliwość znaków (Top 15)"
  },
  "zh-TW": {
    "title_page": "字數統計",
    "inputLabel": "輸入文字",
    "placeholder": "貼上或輸入要統計的文字...",
    "clear": "清空",
    "copied": "已複製！",
    "emptyHint": "請在上方輸入文字",
    "statsTitle": "統計結果",
    "copyStats": "複製統計",
    "totalChars": "總字元數",
    "noSpaceChars": "不含空格",
    "cjkChars": "漢字數",
    "latinLetters": "英文字母",
    "englishWords": "英文單字",
    "digits": "數字",
    "punctuation": "標點符號",
    "spaces": "空白字元",
    "lineCount": "行數",
    "paragraphCount": "段落數",
    "sentenceCount": "句子數",
    "freqTitle": "字元頻率（前15）"
  }
}
</i18n>
