<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"

const { t } = useI18n()

const LETTER: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
}

const FROM = Object.fromEntries(Object.entries(LETTER).map(([k, v]) => [v, k]))

const SAMPLE = "SOS HELP"
const input = ref(SAMPLE)
const output = ref("")

function encode(text: string) {
  const words = text.trim().split(/\s+/)
  const unknown: string[] = []
  const encoded = words.map(word =>
    [...word.toUpperCase()]
      .map(ch => {
        const code = LETTER[ch]
        if (!code) {
          unknown.push(ch)
          return ""
        }
        return code
      })
      .filter(Boolean)
      .join(" ")
  )
  if (unknown.length) ElMessage({ message: t("msgSkip", { c: unknown.join(" ") }), type: "warning" })
  return encoded.filter(Boolean).join(" / ")
}

function decode(morse: string) {
  return morse
    .trim()
    .split(/\s*\/\s*|\s{3,}/)
    .map(word =>
      word
        .trim()
        .split(/\s+/)
        .map(code => FROM[code] ?? "")
        .join("")
    )
    .join(" ")
    .trim()
}

function toMorse() {
  if (!input.value.trim()) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  output.value = encode(input.value)
}

function toText() {
  if (!input.value.trim()) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  output.value = decode(input.value)
}

async function copyOut() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  await copyToClipboard(output.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function toInput() {
  if (!output.value) return
  input.value = output.value
}

function useSample() {
  input.value = SAMPLE
}

function clearAll() {
  input.value = ""
  output.value = ""
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="actions">
      <el-button
        type="primary"
        @click="toMorse"
      >
        {{ t("toMorse") }}
      </el-button>
      <el-button @click="toText">{{ t("toText") }}</el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
      <el-button @click="toInput">{{ t("toInput") }}</el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <div class="panes">
      <div class="pane">
        <div class="pane-label">{{ t("inputLabel") }}</div>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="t('placeholder')"
          resize="vertical"
          class="code-area"
        />
      </div>
      <div class="pane">
        <div class="pane-label">{{ t("outputLabel") }}</div>
        <el-input
          v-model="output"
          type="textarea"
          :rows="12"
          :placeholder="t('outputHint')"
          resize="vertical"
          class="code-area"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-page {
  max-width: 1100px;
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

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 800px) {
  .panes {
    grid-template-columns: 1fr;
  }
}

.pane-label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.code-area :deep(textarea) {
  font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 0.88rem;
  line-height: 1.55;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "摩斯电码",
    "desc": "把文字编成国际摩斯电码，或把点划还原成文字。字母之间用空格，单词之间用斜杠。只处理拉丁字母、数字和常用标点，数据不会上传。",
    "toMorse": "编成电码",
    "toText": "还原文字",
    "copy": "复制结果",
    "toInput": "结果回填",
    "sample": "示例",
    "clear": "清空",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "输入文字或摩斯电码…",
    "outputHint": "点击上方按钮后显示结果",
    "copied": "已复制",
    "msgEmpty": "请先输入内容。",
    "msgNoOut": "还没有可复制的结果。",
    "msgSkip": "已跳过无法编码的字符：{c}"
  },
  "zh-CN": {
    "title_page": "摩斯电码",
    "desc": "把文字编成国际摩斯电码，或把点划还原成文字。字母之间用空格，单词之间用斜杠。只处理拉丁字母、数字和常用标点，数据不会上传。",
    "toMorse": "编成电码",
    "toText": "还原文字",
    "copy": "复制结果",
    "toInput": "结果回填",
    "sample": "示例",
    "clear": "清空",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "输入文字或摩斯电码…",
    "outputHint": "点击上方按钮后显示结果",
    "copied": "已复制",
    "msgEmpty": "请先输入内容。",
    "msgNoOut": "还没有可复制的结果。",
    "msgSkip": "已跳过无法编码的字符：{c}"
  },
  "en": {
    "title_page": "Morse Code",
    "desc": "Encode text to International Morse, or decode dots and dashes back to text. Spaces separate letters, slashes separate words. Latin letters, digits, and common punctuation only. Nothing is uploaded.",
    "toMorse": "To Morse",
    "toText": "To text",
    "copy": "Copy result",
    "toInput": "Send to input",
    "sample": "Sample",
    "clear": "Clear",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Type text or Morse…",
    "outputHint": "Result appears after you run a command",
    "copied": "Copied",
    "msgEmpty": "Enter some text first.",
    "msgNoOut": "There is nothing to copy yet.",
    "msgSkip": "Skipped characters that cannot be encoded: {c}"
  },
  "ja": {
    "title_page": "モールス信号",
    "desc": "国際モールス信号へ変換、または点と線を文字に戻します。文字は空白、語はスラッシュで区切ります。ラテン文字・数字・よく使う記号のみ。アップロードしません。",
    "toMorse": "モールスへ",
    "toText": "文字へ",
    "copy": "結果をコピー",
    "toInput": "結果を入力へ",
    "sample": "サンプル",
    "clear": "クリア",
    "inputLabel": "入力",
    "outputLabel": "出力",
    "placeholder": "文字またはモールスを入力…",
    "outputHint": "上のボタンを押すと結果が表示されます",
    "copied": "コピーしました",
    "msgEmpty": "先に内容を入力してください。",
    "msgNoOut": "コピーできる結果がありません。",
    "msgSkip": "符号化できない文字をスキップしました：{c}"
  },
  "ko": {
    "title_page": "모스 부호",
    "desc": "국제 모스 부호로 바꾸거나 점과 선을 글자로 되돌립니다. 글자는 공백, 단어는 슬래시로 구분합니다. 라틴 문자, 숫자, 흔한 문장부호만 지원하며 업로드하지 않습니다.",
    "toMorse": "모스로",
    "toText": "글자로",
    "copy": "결과 복사",
    "toInput": "결과를 입력으로",
    "sample": "예제",
    "clear": "지우기",
    "inputLabel": "입력",
    "outputLabel": "출력",
    "placeholder": "글자 또는 모스 입력…",
    "outputHint": "위 버튼을 누르면 결과가 나타납니다",
    "copied": "복사됨",
    "msgEmpty": "먼저 내용을 입력하세요.",
    "msgNoOut": "복사할 결과가 없습니다.",
    "msgSkip": "인코딩할 수 없는 문자를 건너뛰었습니다: {c}"
  },
  "fr": {
    "title_page": "Code Morse",
    "desc": "Encodez du texte en Morse international, ou décodez points et traits. Les lettres sont séparées par des espaces, les mots par des barres. Lettres latines, chiffres et ponctuation courante. Rien n’est envoyé.",
    "toMorse": "Vers Morse",
    "toText": "Vers texte",
    "copy": "Copier le résultat",
    "toInput": "Renvoyer en entrée",
    "sample": "Exemple",
    "clear": "Effacer",
    "inputLabel": "Entrée",
    "outputLabel": "Sortie",
    "placeholder": "Texte ou Morse…",
    "outputHint": "Le résultat apparaît après une action",
    "copied": "Copié",
    "msgEmpty": "Saisissez d’abord du contenu.",
    "msgNoOut": "Rien à copier.",
    "msgSkip": "Caractères ignorés : {c}"
  },
  "de": {
    "title_page": "Morsecode",
    "desc": "Text in internationalen Morsecode wandeln oder Punkte und Striche zurücklesen. Buchstaben per Leerzeichen, Wörter per Schrägstrich. Nur Latein, Ziffern und gängige Satzzeichen. Nichts wird hochgeladen.",
    "toMorse": "Nach Morse",
    "toText": "Nach Text",
    "copy": "Ergebnis kopieren",
    "toInput": "Ins Eingabefeld",
    "sample": "Beispiel",
    "clear": "Leeren",
    "inputLabel": "Eingabe",
    "outputLabel": "Ausgabe",
    "placeholder": "Text oder Morse…",
    "outputHint": "Ergebnis erscheint nach einem Klick",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst etwas eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren.",
    "msgSkip": "Übersprungene Zeichen: {c}"
  },
  "es": {
    "title_page": "Código Morse",
    "desc": "Pasa texto a Morse internacional o recupera letras desde puntos y rayas. Espacios entre letras, barras entre palabras. Solo latín, dígitos y puntuación habitual. No se sube nada.",
    "toMorse": "A Morse",
    "toText": "A texto",
    "copy": "Copiar resultado",
    "toInput": "Enviar a entrada",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "inputLabel": "Entrada",
    "outputLabel": "Salida",
    "placeholder": "Texto o Morse…",
    "outputHint": "El resultado aparece tras pulsar un botón",
    "copied": "Copiado",
    "msgEmpty": "Escribe algo primero.",
    "msgNoOut": "Aún no hay nada que copiar.",
    "msgSkip": "Caracteres omitidos: {c}"
  },
  "pt": {
    "title_page": "Código Morse",
    "desc": "Converta texto em Morse internacional ou volte pontos e traços para letras. Espaços separam letras, barras separam palavras. Só latim, dígitos e pontuação comum. Nada é enviado.",
    "toMorse": "Para Morse",
    "toText": "Para texto",
    "copy": "Copiar resultado",
    "toInput": "Enviar à entrada",
    "sample": "Exemplo",
    "clear": "Limpar",
    "inputLabel": "Entrada",
    "outputLabel": "Saída",
    "placeholder": "Texto ou Morse…",
    "outputHint": "O resultado aparece após um comando",
    "copied": "Copiado",
    "msgEmpty": "Digite algo primeiro.",
    "msgNoOut": "Ainda não há o que copiar.",
    "msgSkip": "Caracteres ignorados: {c}"
  },
  "ru": {
    "title_page": "Азбука Морзе",
    "desc": "Кодируйте текст в международную азбуку Морзе или возвращайте точки и тире в буквы. Пробел между буквами, слэш между словами. Только латиница, цифры и обычная пунктуация. Ничего не загружается.",
    "toMorse": "В Морзе",
    "toText": "В текст",
    "copy": "Копировать результат",
    "toInput": "В поле ввода",
    "sample": "Пример",
    "clear": "Очистить",
    "inputLabel": "Ввод",
    "outputLabel": "Вывод",
    "placeholder": "Текст или Морзе…",
    "outputHint": "Результат появится после кнопки",
    "copied": "Скопировано",
    "msgEmpty": "Сначала введите текст.",
    "msgNoOut": "Пока нечего копировать.",
    "msgSkip": "Пропущенные символы: {c}"
  },
  "ar": {
    "title_page": "شفرة مورس",
    "desc": "حوّل النص إلى مورس الدولي أو أعد النقاط والشرطات إلى حروف. المسافة بين الحروف والشرطة المائلة بين الكلمات. أحرف لاتينية وأرقام وعلامات شائعة فقط. لا يُرفع شيء.",
    "toMorse": "إلى مورس",
    "toText": "إلى نص",
    "copy": "نسخ النتيجة",
    "toInput": "إلى الإدخال",
    "sample": "مثال",
    "clear": "مسح",
    "inputLabel": "إدخال",
    "outputLabel": "إخراج",
    "placeholder": "نص أو مورس…",
    "outputHint": "تظهر النتيجة بعد زر",
    "copied": "تم النسخ",
    "msgEmpty": "أدخل محتوى أولاً.",
    "msgNoOut": "لا شيء للنسخ بعد.",
    "msgSkip": "تم تخطي أحرف: {c}"
  },
  "hi": {
    "title_page": "मोर्स कोड",
    "desc": "पाठ को अंतरराष्ट्रीय मोर्स में बदलें या बिंदु-रेखा को अक्षर बनाएँ। अक्षरों के बीच स्पेस, शब्दों के बीच स्लैश। केवल लैटिन, अंक और आम विराम। कुछ अपलोड नहीं होता।",
    "toMorse": "मोर्स में",
    "toText": "पाठ में",
    "copy": "परिणाम कॉपी",
    "toInput": "इनपुट में भेजें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "inputLabel": "इनपुट",
    "outputLabel": "आउटपुट",
    "placeholder": "पाठ या मोर्स…",
    "outputHint": "बटन के बाद परिणाम दिखेगा",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले कुछ लिखें।",
    "msgNoOut": "कॉपी करने को कुछ नहीं।",
    "msgSkip": "छोड़े गए अक्षर: {c}"
  },
  "it": {
    "title_page": "Codice Morse",
    "desc": "Converti testo in Morse internazionale o torna da punti e linee alle lettere. Spazi tra lettere, barre tra parole. Solo latino, cifre e punteggiatura comune. Nulla viene caricato.",
    "toMorse": "In Morse",
    "toText": "In testo",
    "copy": "Copia risultato",
    "toInput": "Invia all’input",
    "sample": "Esempio",
    "clear": "Svuota",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Testo o Morse…",
    "outputHint": "Il risultato appare dopo un pulsante",
    "copied": "Copiato",
    "msgEmpty": "Inserisci prima del contenuto.",
    "msgNoOut": "Non c’è ancora nulla da copiare.",
    "msgSkip": "Caratteri saltati: {c}"
  },
  "nl": {
    "title_page": "Morsecode",
    "desc": "Zet tekst om naar internationale Morse of punten en strepen terug naar letters. Spaties tussen letters, schuine strepen tussen woorden. Alleen Latijn, cijfers en gewone leestekens. Niets wordt geüpload.",
    "toMorse": "Naar Morse",
    "toText": "Naar tekst",
    "copy": "Resultaat kopiëren",
    "toInput": "Naar invoer",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "inputLabel": "Invoer",
    "outputLabel": "Uitvoer",
    "placeholder": "Tekst of Morse…",
    "outputHint": "Resultaat verschijnt na een knop",
    "copied": "Gekopieerd",
    "msgEmpty": "Voer eerst iets in.",
    "msgNoOut": "Nog niets om te kopiëren.",
    "msgSkip": "Overgeslagen tekens: {c}"
  },
  "tr": {
    "title_page": "Mors kodu",
    "desc": "Metni uluslararası Mors’a çevirin veya nokta ve çizgileri harfe döndürün. Harfler boşluk, sözcükler eğik çizgi ile ayrılır. Yalnızca Latin, rakam ve yaygın noktalama. Hiçbir şey yüklenmez.",
    "toMorse": "Mors’a",
    "toText": "Metne",
    "copy": "Sonucu kopyala",
    "toInput": "Girdiye gönder",
    "sample": "Örnek",
    "clear": "Temizle",
    "inputLabel": "Girdi",
    "outputLabel": "Çıktı",
    "placeholder": "Metin veya Mors…",
    "outputHint": "Sonuç bir düğmeden sonra görünür",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce bir şey girin.",
    "msgNoOut": "Kopyalanacak bir şey yok.",
    "msgSkip": "Atlanan karakterler: {c}"
  },
  "vi": {
    "title_page": "Mã Morse",
    "desc": "Đổi chữ sang Morse quốc tế hoặc trả dấu chấm gạch về chữ. Chữ cách nhau bằng khoảng trắng, từ bằng gạch chéo. Chỉ chữ Latin, số và dấu câu thường. Không tải lên.",
    "toMorse": "Sang Morse",
    "toText": "Sang chữ",
    "copy": "Sao chép kết quả",
    "toInput": "Đưa về ô nhập",
    "sample": "Mẫu",
    "clear": "Xóa",
    "inputLabel": "Nhập",
    "outputLabel": "Xuất",
    "placeholder": "Chữ hoặc Morse…",
    "outputHint": "Kết quả hiện sau khi bấm nút",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy nhập nội dung trước.",
    "msgNoOut": "Chưa có gì để sao chép.",
    "msgSkip": "Đã bỏ qua ký tự: {c}"
  },
  "th": {
    "title_page": "รหัสมอร์ส",
    "desc": "แปลงข้อความเป็นมอร์สนานาชาติ หรือคืนจุดและขีดเป็นตัวอักษร เว้นวรรคคั่นตัวอักษร ใช้ทับคั่นคำ รองรับละติน ตัวเลข และเครื่องหมายทั่วไป ไม่ได้อัปโหลด",
    "toMorse": "เป็นมอร์ส",
    "toText": "เป็นข้อความ",
    "copy": "คัดลอกผลลัพธ์",
    "toInput": "ส่งกลับช่องใส่",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "inputLabel": "อินพุต",
    "outputLabel": "เอาต์พุต",
    "placeholder": "ข้อความหรือมอร์ส…",
    "outputHint": "ผลลัพธ์จะโชว์หลังกดปุ่ม",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "ใส่เนื้อหาก่อน",
    "msgNoOut": "ยังไม่มีอะไรให้คัดลอก",
    "msgSkip": "ข้ามอักขระที่แปลงไม่ได้: {c}"
  },
  "id": {
    "title_page": "Kode Morse",
    "desc": "Ubah teks ke Morse internasional atau kembalikan titik dan garis menjadi huruf. Spasi antar huruf, garis miring antar kata. Hanya Latin, angka, dan tanda baca umum. Tidak diunggah.",
    "toMorse": "Ke Morse",
    "toText": "Ke teks",
    "copy": "Salin hasil",
    "toInput": "Kirim ke input",
    "sample": "Contoh",
    "clear": "Hapus",
    "inputLabel": "Masukan",
    "outputLabel": "Keluaran",
    "placeholder": "Teks atau Morse…",
    "outputHint": "Hasil muncul setelah tombol",
    "copied": "Disalin",
    "msgEmpty": "Masukkan isi dulu.",
    "msgNoOut": "Belum ada yang bisa disalin.",
    "msgSkip": "Karakter dilewati: {c}"
  },
  "ms": {
    "title_page": "Kod Morse",
    "desc": "Tukar teks kepada Morse antarabangsa atau pulangkan titik dan sengkang kepada huruf. Jarak antara huruf, condong antara perkataan. Latin, digit dan tanda baca biasa sahaja. Tiada dimuat naik.",
    "toMorse": "Ke Morse",
    "toText": "Ke teks",
    "copy": "Salin hasil",
    "toInput": "Hantar ke input",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Teks atau Morse…",
    "outputHint": "Hasil muncul selepas butang",
    "copied": "Disalin",
    "msgEmpty": "Masukkan kandungan dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin.",
    "msgSkip": "Aksara dilangkau: {c}"
  },
  "pl": {
    "title_page": "Alfabet Morse’a",
    "desc": "Zamień tekst na międzynarodowy Morse albo punkty i kreski z powrotem na litery. Spacje między literami, ukośniki między słowami. Tylko łacinka, cyfry i zwykła interpunkcja. Nic nie jest wysyłane.",
    "toMorse": "Na Morse’a",
    "toText": "Na tekst",
    "copy": "Kopiuj wynik",
    "toInput": "Wyślij do wejścia",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "inputLabel": "Wejście",
    "outputLabel": "Wyjście",
    "placeholder": "Tekst lub Morse…",
    "outputHint": "Wynik pojawi się po przycisku",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wpisz treść.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania.",
    "msgSkip": "Pominięte znaki: {c}"
  },
  "uk": {
    "title_page": "Азбука Морзе",
    "desc": "Кодуйте текст у міжнародну азбуку Морзе або повертайте крапки й тире в літери. Пробіл між літерами, скісна риска між словами. Лише латиниця, цифри й звична пунктуація. Нічого не надсилається.",
    "toMorse": "У Морзе",
    "toText": "У текст",
    "copy": "Копіювати результат",
    "toInput": "У поле вводу",
    "sample": "Приклад",
    "clear": "Очистити",
    "inputLabel": "Ввід",
    "outputLabel": "Вивід",
    "placeholder": "Текст або Морзе…",
    "outputHint": "Результат з’явиться після кнопки",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку введіть текст.",
    "msgNoOut": "Поки немає що копіювати.",
    "msgSkip": "Пропущені символи: {c}"
  },
  "sv": {
    "title_page": "Morsealfabet",
    "desc": "Koda text till internationell Morse eller återställ punkter och streck till bokstäver. Mellanslag mellan bokstäver, snedstreck mellan ord. Endast latin, siffror och vanlig interpunktion. Inget laddas upp.",
    "toMorse": "Till Morse",
    "toText": "Till text",
    "copy": "Kopiera resultat",
    "toInput": "Skicka till inmatning",
    "sample": "Exempel",
    "clear": "Rensa",
    "inputLabel": "Inmatning",
    "outputLabel": "Utdata",
    "placeholder": "Text eller Morse…",
    "outputHint": "Resultatet syns efter en knapp",
    "copied": "Kopierat",
    "msgEmpty": "Skriv något först.",
    "msgNoOut": "Inget att kopiera ännu.",
    "msgSkip": "Överhoppade tecken: {c}"
  },
  "zh-TW": {
    "title_page": "摩斯電碼",
    "desc": "把文字編成國際摩斯電碼，或把點劃還原成文字。字母之間用空格，單詞之間用斜線。只處理拉丁字母、數字和常用標點，資料不會上傳。",
    "toMorse": "編成電碼",
    "toText": "還原文字",
    "copy": "複製結果",
    "toInput": "結果回填",
    "sample": "範例",
    "clear": "清空",
    "inputLabel": "輸入",
    "outputLabel": "輸出",
    "placeholder": "輸入文字或摩斯電碼…",
    "outputHint": "點上方按鈕後顯示結果",
    "copied": "已複製",
    "msgEmpty": "請先輸入內容。",
    "msgNoOut": "還沒有可複製的結果。",
    "msgSkip": "已跳過無法編碼的字元：{c}"
  }
}
</i18n>
