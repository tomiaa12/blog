<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { fromHex, toBase64, toHex, utf8 } from "../../shared/bytes"
import { ensureSparkMd5 } from "./loadSparkMd5"

const { t } = useI18n()

type Algo = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

const ALGOS: Algo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"]

type Row = { algo: Algo; hex: string; base64: string }

const input = ref("hello kyx")
const selected = ref<Algo[]>([...ALGOS])
const rows = ref<Row[]>([])
const running = ref(false)

async function md5Hex(text: string) {
  const SparkMD5 = await ensureSparkMd5()
  const bytes = utf8(text)
  const spark = new SparkMD5.ArrayBuffer()
  spark.append(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
  return spark.end()
}

async function shaDigest(algo: Exclude<Algo, "MD5">, text: string) {
  return crypto.subtle.digest(algo, utf8(text))
}

async function run() {
  if (!input.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  if (!selected.value.length) {
    ElMessage({ message: t("msgAlgo"), type: "warning" })
    return
  }
  running.value = true
  try {
    const next: Row[] = []
    for (const algo of ALGOS) {
      if (!selected.value.includes(algo)) continue
      if (algo === "MD5") {
        const hex = await md5Hex(input.value)
        next.push({ algo, hex, base64: toBase64(fromHex(hex)) })
      } else {
        const buf = await shaDigest(algo, input.value)
        next.push({ algo, hex: toHex(buf), base64: toBase64(buf) })
      }
    }
    rows.value = next
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

async function copyText(text: string) {
  await copyToClipboard(text)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function useSample() {
  input.value = "hello kyx"
  selected.value = [...ALGOS]
}

function clearAll() {
  input.value = ""
  rows.value = []
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="pane-label">{{ t("algoLabel") }}</div>
    <el-checkbox-group
      v-model="selected"
      class="algos"
    >
      <el-checkbox
        v-for="a in ALGOS"
        :key="a"
        :label="a"
        :value="a"
      >
        {{ a }}
      </el-checkbox>
    </el-checkbox-group>

    <div class="pane-label">{{ t("inputLabel") }}</div>
    <el-input
      v-model="input"
      type="textarea"
      :rows="8"
      :placeholder="t('inputPh')"
      resize="vertical"
      class="code-area"
    />

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="run"
      >
        {{ t("run") }}
      </el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <div
      v-if="rows.length"
      class="results"
    >
      <div
        v-for="row in rows"
        :key="row.algo"
        class="card"
      >
        <div class="card-title">{{ row.algo }}</div>
        <div class="row">
          <span class="fmt">Hex</span>
          <code>{{ row.hex }}</code>
          <el-button
            size="small"
            @click="copyText(row.hex)"
          >
            {{ t("copy") }}
          </el-button>
        </div>
        <div class="row">
          <span class="fmt">Base64</span>
          <code>{{ row.base64 }}</code>
          <el-button
            size="small"
            @click="copyText(row.base64)"
          >
            {{ t("copy") }}
          </el-button>
        </div>
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

.algos {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 14px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.pane-label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.code-area {
  margin-bottom: 14px;

  :deep(textarea) {
    font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
    font-size: 0.88rem;
    line-height: 1.55;
  }
}

.results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.card-title {
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 8px;
}

.fmt {
  flex: 0 0 56px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  padding-top: 4px;
}

code {
  flex: 1;
  min-width: 0;
  word-break: break-all;
  font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 0.82rem;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "文本哈希",
    "desc": "对一段文本计算 MD5、SHA-1、SHA-256、SHA-384、SHA-512。SHA 用浏览器 Web Crypto，MD5 从 CDN 加载 SparkMD5。原文留在本地，不会上传。",
    "algoLabel": "算法",
    "inputLabel": "原文",
    "inputPh": "要计算哈希的文本",
    "run": "计算哈希",
    "sample": "示例",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制",
    "msgEmpty": "请先输入原文。",
    "msgAlgo": "请至少选择一种算法。",
    "msgFail": "计算失败。请检查网络（MD5 需加载 CDN）或浏览器是否支持 Web Crypto。"
  },
  "zh-CN": {
    "title_page": "文本哈希",
    "desc": "对一段文本计算 MD5、SHA-1、SHA-256、SHA-384、SHA-512。SHA 用浏览器 Web Crypto，MD5 从 CDN 加载 SparkMD5。原文留在本地，不会上传。",
    "algoLabel": "算法",
    "inputLabel": "原文",
    "inputPh": "要计算哈希的文本",
    "run": "计算哈希",
    "sample": "示例",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制",
    "msgEmpty": "请先输入原文。",
    "msgAlgo": "请至少选择一种算法。",
    "msgFail": "计算失败。请检查网络（MD5 需加载 CDN）或浏览器是否支持 Web Crypto。"
  },
  "en": {
    "title_page": "Text Hash",
    "desc": "Hash text with MD5, SHA-1, SHA-256, SHA-384, and SHA-512. SHA uses Web Crypto; MD5 loads SparkMD5 from a CDN. The text stays in your browser.",
    "algoLabel": "Algorithms",
    "inputLabel": "Text",
    "inputPh": "Text to hash",
    "run": "Hash",
    "sample": "Sample",
    "clear": "Clear",
    "copy": "Copy",
    "copied": "Copied",
    "msgEmpty": "Enter some text first.",
    "msgAlgo": "Select at least one algorithm.",
    "msgFail": "Failed. Check the network (MD5 needs a CDN) or Web Crypto support."
  },
  "ja": {
    "title_page": "テキストハッシュ",
    "desc": "テキストの MD5 / SHA-1 / SHA-256 / SHA-384 / SHA-512 を計算します。SHA は Web Crypto、MD5 は CDN の SparkMD5。本文は端末内に留まります。",
    "algoLabel": "アルゴリズム",
    "inputLabel": "本文",
    "inputPh": "ハッシュするテキスト",
    "run": "ハッシュを計算",
    "sample": "サンプル",
    "clear": "クリア",
    "copy": "コピー",
    "copied": "コピーしました",
    "msgEmpty": "先に本文を入力してください。",
    "msgAlgo": "少なくとも 1 つ選んでください。",
    "msgFail": "失敗しました。CDN（MD5）または Web Crypto を確認してください。"
  },
  "ko": {
    "title_page": "텍스트 해시",
    "desc": "텍스트의 MD5, SHA-1, SHA-256, SHA-384, SHA-512를 계산합니다. SHA는 Web Crypto, MD5는 CDN의 SparkMD5입니다. 본문은 브라우저에 남습니다.",
    "algoLabel": "알고리즘",
    "inputLabel": "원문",
    "inputPh": "해시할 텍스트",
    "run": "해시 계산",
    "sample": "예제",
    "clear": "지우기",
    "copy": "복사",
    "copied": "복사됨",
    "msgEmpty": "먼저 원문을 입력하세요.",
    "msgAlgo": "알고리즘을 하나 이상 선택하세요.",
    "msgFail": "실패했습니다. CDN(MD5) 또는 Web Crypto를 확인하세요."
  },
  "fr": {
    "title_page": "Empreinte de texte",
    "desc": "Calcule MD5, SHA-1, SHA-256, SHA-384 et SHA-512. SHA via Web Crypto, MD5 via SparkMD5 en CDN. Le texte reste dans le navigateur.",
    "algoLabel": "Algorithmes",
    "inputLabel": "Texte",
    "inputPh": "Texte à hacher",
    "run": "Calculer",
    "sample": "Exemple",
    "clear": "Effacer",
    "copy": "Copier",
    "copied": "Copié",
    "msgEmpty": "Saisissez d’abord du texte.",
    "msgAlgo": "Choisissez au moins un algorithme.",
    "msgFail": "Échec. Vérifiez le CDN (MD5) ou Web Crypto."
  },
  "de": {
    "title_page": "Text-Hash",
    "desc": "Berechnet MD5, SHA-1, SHA-256, SHA-384 und SHA-512. SHA über Web Crypto, MD5 über SparkMD5 per CDN. Der Text bleibt im Browser.",
    "algoLabel": "Algorithmen",
    "inputLabel": "Text",
    "inputPh": "Zu hashender Text",
    "run": "Hashen",
    "sample": "Beispiel",
    "clear": "Leeren",
    "copy": "Kopieren",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst Text eingeben.",
    "msgAlgo": "Mindestens einen Algorithmus wählen.",
    "msgFail": "Fehlgeschlagen. CDN (MD5) oder Web Crypto prüfen."
  },
  "es": {
    "title_page": "Hash de texto",
    "desc": "Calcula MD5, SHA-1, SHA-256, SHA-384 y SHA-512. SHA usa Web Crypto; MD5 carga SparkMD5 por CDN. El texto se queda en el navegador.",
    "algoLabel": "Algoritmos",
    "inputLabel": "Texto",
    "inputPh": "Texto a hashear",
    "run": "Calcular",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "copy": "Copiar",
    "copied": "Copiado",
    "msgEmpty": "Escribe un texto primero.",
    "msgAlgo": "Elige al menos un algoritmo.",
    "msgFail": "Error. Revisa la CDN (MD5) o Web Crypto."
  },
  "pt": {
    "title_page": "Hash de texto",
    "desc": "Calcula MD5, SHA-1, SHA-256, SHA-384 e SHA-512. SHA usa Web Crypto; MD5 carrega SparkMD5 via CDN. O texto fica no navegador.",
    "algoLabel": "Algoritmos",
    "inputLabel": "Texto",
    "inputPh": "Texto para hashear",
    "run": "Calcular",
    "sample": "Exemplo",
    "clear": "Limpar",
    "copy": "Copiar",
    "copied": "Copiado",
    "msgEmpty": "Digite um texto primeiro.",
    "msgAlgo": "Escolha pelo menos um algoritmo.",
    "msgFail": "Falha. Verifique a CDN (MD5) ou o Web Crypto."
  },
  "ru": {
    "title_page": "Хеш текста",
    "desc": "Считает MD5, SHA-1, SHA-256, SHA-384 и SHA-512. SHA через Web Crypto, MD5 через SparkMD5 с CDN. Текст остаётся в браузере.",
    "algoLabel": "Алгоритмы",
    "inputLabel": "Текст",
    "inputPh": "Текст для хеша",
    "run": "Посчитать",
    "sample": "Пример",
    "clear": "Очистить",
    "copy": "Копировать",
    "copied": "Скопировано",
    "msgEmpty": "Сначала введите текст.",
    "msgAlgo": "Выберите хотя бы один алгоритм.",
    "msgFail": "Ошибка. Проверьте CDN (MD5) или Web Crypto."
  },
  "ar": {
    "title_page": "تجزئة النص",
    "desc": "احسب MD5 وSHA-1 وSHA-256 وSHA-384 وSHA-512. SHA عبر Web Crypto وMD5 عبر SparkMD5 من CDN. النص يبقى في المتصفح.",
    "algoLabel": "الخوارزميات",
    "inputLabel": "النص",
    "inputPh": "النص للتجزئة",
    "run": "احسب",
    "sample": "مثال",
    "clear": "مسح",
    "copy": "نسخ",
    "copied": "تم النسخ",
    "msgEmpty": "أدخل نصاً أولاً.",
    "msgAlgo": "اختر خوارزمية واحدة على الأقل.",
    "msgFail": "فشل. تحقق من CDN (MD5) أو Web Crypto."
  },
  "hi": {
    "title_page": "टेक्स्ट हैश",
    "desc": "MD5, SHA-1, SHA-256, SHA-384, SHA-512 निकालें। SHA Web Crypto से, MD5 CDN के SparkMD5 से। पाठ ब्राउज़र में रहता है।",
    "algoLabel": "एल्गोरिद्म",
    "inputLabel": "पाठ",
    "inputPh": "हैश करने वाला पाठ",
    "run": "हैश करें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "copy": "कॉपी",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले पाठ लिखें।",
    "msgAlgo": "कम से कम एक एल्गोरिद्म चुनें।",
    "msgFail": "असफल। CDN (MD5) या Web Crypto जाँचें।"
  },
  "it": {
    "title_page": "Hash del testo",
    "desc": "Calcola MD5, SHA-1, SHA-256, SHA-384 e SHA-512. SHA con Web Crypto, MD5 con SparkMD5 da CDN. Il testo resta nel browser.",
    "algoLabel": "Algoritmi",
    "inputLabel": "Testo",
    "inputPh": "Testo da hashare",
    "run": "Calcola",
    "sample": "Esempio",
    "clear": "Svuota",
    "copy": "Copia",
    "copied": "Copiato",
    "msgEmpty": "Inserisci prima del testo.",
    "msgAlgo": "Scegli almeno un algoritmo.",
    "msgFail": "Errore. Controlla CDN (MD5) o Web Crypto."
  },
  "nl": {
    "title_page": "Tekst-hash",
    "desc": "Bereken MD5, SHA-1, SHA-256, SHA-384 en SHA-512. SHA via Web Crypto, MD5 via SparkMD5 van een CDN. De tekst blijft in de browser.",
    "algoLabel": "Algoritmen",
    "inputLabel": "Tekst",
    "inputPh": "Tekst om te hashen",
    "run": "Hashen",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "copied": "Gekopieerd",
    "msgEmpty": "Voer eerst tekst in.",
    "msgAlgo": "Kies minstens één algoritme.",
    "msgFail": "Mislukt. Controleer CDN (MD5) of Web Crypto."
  },
  "tr": {
    "title_page": "Metin özeti",
    "desc": "MD5, SHA-1, SHA-256, SHA-384, SHA-512 hesaplayın. SHA Web Crypto, MD5 CDN’deki SparkMD5. Metin tarayıcıda kalır.",
    "algoLabel": "Algoritmalar",
    "inputLabel": "Metin",
    "inputPh": "Özetlenecek metin",
    "run": "Hesapla",
    "sample": "Örnek",
    "clear": "Temizle",
    "copy": "Kopyala",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce metin girin.",
    "msgAlgo": "En az bir algoritma seçin.",
    "msgFail": "Başarısız. CDN (MD5) veya Web Crypto’yu kontrol edin."
  },
  "vi": {
    "title_page": "Băm văn bản",
    "desc": "Tính MD5, SHA-1, SHA-256, SHA-384, SHA-512. SHA dùng Web Crypto, MD5 tải SparkMD5 từ CDN. Văn bản ở lại trình duyệt.",
    "algoLabel": "Thuật toán",
    "inputLabel": "Văn bản",
    "inputPh": "Văn bản cần băm",
    "run": "Tính hash",
    "sample": "Mẫu",
    "clear": "Xóa",
    "copy": "Sao chép",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy nhập văn bản trước.",
    "msgAlgo": "Chọn ít nhất một thuật toán.",
    "msgFail": "Thất bại. Kiểm tra CDN (MD5) hoặc Web Crypto."
  },
  "th": {
    "title_page": "แฮชข้อความ",
    "desc": "คำนวณ MD5 SHA-1 SHA-256 SHA-384 SHA-512 SHA ใช้ Web Crypto MD5 โหลด SparkMD5 จาก CDN ข้อความอยู่ในเบราว์เซอร์",
    "algoLabel": "อัลกอริทึม",
    "inputLabel": "ข้อความ",
    "inputPh": "ข้อความที่จะแฮช",
    "run": "คำนวณแฮช",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "ใส่ข้อความก่อน",
    "msgAlgo": "เลือกอย่างน้อยหนึ่งอัลกอริทึม",
    "msgFail": "ล้มเหลว ตรวจ CDN (MD5) หรือ Web Crypto"
  },
  "id": {
    "title_page": "Hash teks",
    "desc": "Hitung MD5, SHA-1, SHA-256, SHA-384, SHA-512. SHA memakai Web Crypto, MD5 memuat SparkMD5 dari CDN. Teks tetap di browser.",
    "algoLabel": "Algoritma",
    "inputLabel": "Teks",
    "inputPh": "Teks yang di-hash",
    "run": "Hitung hash",
    "sample": "Contoh",
    "clear": "Hapus",
    "copy": "Salin",
    "copied": "Disalin",
    "msgEmpty": "Masukkan teks dulu.",
    "msgAlgo": "Pilih setidaknya satu algoritma.",
    "msgFail": "Gagal. Periksa CDN (MD5) atau Web Crypto."
  },
  "ms": {
    "title_page": "Cincang teks",
    "desc": "Kira MD5, SHA-1, SHA-256, SHA-384, SHA-512. SHA guna Web Crypto, MD5 muat SparkMD5 dari CDN. Teks kekal dalam pelayar.",
    "algoLabel": "Algoritma",
    "inputLabel": "Teks",
    "inputPh": "Teks untuk dicincang",
    "run": "Kira hash",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "copy": "Salin",
    "copied": "Disalin",
    "msgEmpty": "Masukkan teks dahulu.",
    "msgAlgo": "Pilih sekurang-kurangnya satu algoritma.",
    "msgFail": "Gagal. Semak CDN (MD5) atau Web Crypto."
  },
  "pl": {
    "title_page": "Skrót tekstu",
    "desc": "Liczy MD5, SHA-1, SHA-256, SHA-384 i SHA-512. SHA przez Web Crypto, MD5 przez SparkMD5 z CDN. Tekst zostaje w przeglądarce.",
    "algoLabel": "Algorytmy",
    "inputLabel": "Tekst",
    "inputPh": "Tekst do skrótu",
    "run": "Oblicz",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wpisz tekst.",
    "msgAlgo": "Wybierz przynajmniej jeden algorytm.",
    "msgFail": "Błąd. Sprawdź CDN (MD5) albo Web Crypto."
  },
  "uk": {
    "title_page": "Хеш тексту",
    "desc": "Рахує MD5, SHA-1, SHA-256, SHA-384 і SHA-512. SHA через Web Crypto, MD5 через SparkMD5 з CDN. Текст лишається в браузері.",
    "algoLabel": "Алгоритми",
    "inputLabel": "Текст",
    "inputPh": "Текст для хешу",
    "run": "Порахувати",
    "sample": "Приклад",
    "clear": "Очистити",
    "copy": "Копіювати",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку введіть текст.",
    "msgAlgo": "Оберіть хоча б один алгоритм.",
    "msgFail": "Помилка. Перевірте CDN (MD5) або Web Crypto."
  },
  "sv": {
    "title_page": "Texthash",
    "desc": "Beräkna MD5, SHA-1, SHA-256, SHA-384 och SHA-512. SHA via Web Crypto, MD5 via SparkMD5 från CDN. Texten stannar i webbläsaren.",
    "algoLabel": "Algoritmer",
    "inputLabel": "Text",
    "inputPh": "Text att hasha",
    "run": "Beräkna",
    "sample": "Exempel",
    "clear": "Rensa",
    "copy": "Kopiera",
    "copied": "Kopierat",
    "msgEmpty": "Skriv text först.",
    "msgAlgo": "Välj minst en algoritm.",
    "msgFail": "Misslyckades. Kontrollera CDN (MD5) eller Web Crypto."
  },
  "zh-TW": {
    "title_page": "文字雜湊",
    "desc": "對一段文字計算 MD5、SHA-1、SHA-256、SHA-384、SHA-512。SHA 用瀏覽器 Web Crypto，MD5 從 CDN 載入 SparkMD5。原文留在本機，不會上傳。",
    "algoLabel": "演算法",
    "inputLabel": "原文",
    "inputPh": "要計算雜湊的文字",
    "run": "計算雜湊",
    "sample": "範例",
    "clear": "清空",
    "copy": "複製",
    "copied": "已複製",
    "msgEmpty": "請先輸入原文。",
    "msgAlgo": "請至少選擇一種演算法。",
    "msgFail": "計算失敗。請檢查網路（MD5 需載入 CDN）或瀏覽器是否支援 Web Crypto。"
  }
}
</i18n>
