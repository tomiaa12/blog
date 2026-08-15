<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { toBase64, toBase64Url, toHex, utf8 } from "../../shared/bytes"

const { t } = useI18n()

type Algo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
type OutFmt = "hex" | "base64" | "base64url"

const ALGOS: Algo[] = ["SHA-256", "SHA-1", "SHA-384", "SHA-512"]

const message = ref("hello kyx")
const secret = ref("secret")
const algo = ref<Algo>("SHA-256")
const outFmt = ref<OutFmt>("hex")
const output = ref("")
const running = ref(false)

async function run() {
  if (!message.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  if (!secret.value) {
    ElMessage({ message: t("msgKey"), type: "warning" })
    return
  }
  running.value = true
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      utf8(secret.value),
      { name: "HMAC", hash: algo.value },
      false,
      ["sign"]
    )
    const sig = await crypto.subtle.sign("HMAC", key, utf8(message.value))
    output.value =
      outFmt.value === "hex" ? toHex(sig) : outFmt.value === "base64" ? toBase64(sig) : toBase64Url(sig)
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

async function copyOut() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  await copyToClipboard(output.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function useSample() {
  message.value = "hello kyx"
  secret.value = "secret"
}

function clearAll() {
  message.value = ""
  secret.value = ""
  output.value = ""
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-select
        v-model="algo"
        class="sel"
      >
        <el-option
          v-for="a in ALGOS"
          :key="a"
          :label="a"
          :value="a"
        />
      </el-select>
      <el-radio-group v-model="outFmt">
        <el-radio-button value="hex">Hex</el-radio-button>
        <el-radio-button value="base64">Base64</el-radio-button>
        <el-radio-button value="base64url">Base64URL</el-radio-button>
      </el-radio-group>
    </div>

    <div class="field">
      <div class="pane-label">{{ t("keyLabel") }}</div>
      <el-input
        v-model="secret"
        :placeholder="t('keyPh')"
        show-password
      />
    </div>
    <div class="field">
      <div class="pane-label">{{ t("msgLabel") }}</div>
      <el-input
        v-model="message"
        type="textarea"
        :rows="8"
        :placeholder="t('msgPh')"
        resize="vertical"
        class="code-area"
      />
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="run"
      >
        {{ t("run") }}
      </el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <div class="pane-label">{{ t("outputLabel") }}</div>
    <el-input
      v-model="output"
      type="textarea"
      :rows="4"
      :placeholder="t('outputHint')"
      resize="vertical"
      class="code-area"
    />
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

.toolbar,
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.sel {
  width: 140px;
}

.field {
  margin-bottom: 14px;
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
    "title_page": "HMAC 生成器",
    "desc": "用密钥对一段原文计算 HMAC，支持 SHA-1、SHA-256、SHA-384、SHA-512。计算走浏览器 Web Crypto，密钥和原文都留在本地。",
    "keyLabel": "密钥",
    "keyPh": "输入共享密钥",
    "msgLabel": "原文",
    "msgPh": "要签名的文本",
    "run": "生成 HMAC",
    "copy": "复制结果",
    "sample": "示例",
    "clear": "清空",
    "outputLabel": "结果",
    "outputHint": "点击生成后显示",
    "copied": "已复制",
    "msgEmpty": "请先输入原文。",
    "msgKey": "请先输入密钥。",
    "msgNoOut": "还没有可复制的结果。",
    "msgFail": "计算失败，请检查浏览器是否支持 Web Crypto。"
  },
  "zh-CN": {
    "title_page": "HMAC 生成器",
    "desc": "用密钥对一段原文计算 HMAC，支持 SHA-1、SHA-256、SHA-384、SHA-512。计算走浏览器 Web Crypto，密钥和原文都留在本地。",
    "keyLabel": "密钥",
    "keyPh": "输入共享密钥",
    "msgLabel": "原文",
    "msgPh": "要签名的文本",
    "run": "生成 HMAC",
    "copy": "复制结果",
    "sample": "示例",
    "clear": "清空",
    "outputLabel": "结果",
    "outputHint": "点击生成后显示",
    "copied": "已复制",
    "msgEmpty": "请先输入原文。",
    "msgKey": "请先输入密钥。",
    "msgNoOut": "还没有可复制的结果。",
    "msgFail": "计算失败，请检查浏览器是否支持 Web Crypto。"
  },
  "en": {
    "title_page": "HMAC Generator",
    "desc": "Compute an HMAC of a message with a secret key. SHA-1, SHA-256, SHA-384, and SHA-512 are available via Web Crypto. The key and message stay in your browser.",
    "keyLabel": "Secret",
    "keyPh": "Shared secret",
    "msgLabel": "Message",
    "msgPh": "Text to sign",
    "run": "Generate HMAC",
    "copy": "Copy result",
    "sample": "Sample",
    "clear": "Clear",
    "outputLabel": "Result",
    "outputHint": "Appears after Generate",
    "copied": "Copied",
    "msgEmpty": "Enter a message first.",
    "msgKey": "Enter a secret first.",
    "msgNoOut": "There is nothing to copy yet.",
    "msgFail": "Failed. Check that this browser supports Web Crypto."
  },
  "ja": {
    "title_page": "HMAC 生成",
    "desc": "秘密鍵でメッセージの HMAC を計算します。SHA-1 / SHA-256 / SHA-384 / SHA-512 に対応。Web Crypto を使い、鍵と本文は端末内に留まります。",
    "keyLabel": "鍵",
    "keyPh": "共有鍵",
    "msgLabel": "本文",
    "msgPh": "署名するテキスト",
    "run": "HMAC を生成",
    "copy": "結果をコピー",
    "sample": "サンプル",
    "clear": "クリア",
    "outputLabel": "結果",
    "outputHint": "生成後に表示",
    "copied": "コピーしました",
    "msgEmpty": "先に本文を入力してください。",
    "msgKey": "先に鍵を入力してください。",
    "msgNoOut": "コピーできる結果がありません。",
    "msgFail": "失敗しました。Web Crypto に対応しているか確認してください。"
  },
  "ko": {
    "title_page": "HMAC 생성기",
    "desc": "비밀키로 메시지의 HMAC을 계산합니다. SHA-1, SHA-256, SHA-384, SHA-512를 지원합니다. Web Crypto로 처리하며 키와 본문은 브라우저에 남습니다.",
    "keyLabel": "비밀키",
    "keyPh": "공유 비밀",
    "msgLabel": "메시지",
    "msgPh": "서명할 텍스트",
    "run": "HMAC 생성",
    "copy": "결과 복사",
    "sample": "예제",
    "clear": "지우기",
    "outputLabel": "결과",
    "outputHint": "생성 후 표시",
    "copied": "복사됨",
    "msgEmpty": "먼저 메시지를 입력하세요.",
    "msgKey": "먼저 비밀키를 입력하세요.",
    "msgNoOut": "복사할 결과가 없습니다.",
    "msgFail": "실패했습니다. 브라우저가 Web Crypto를 지원하는지 확인하세요."
  },
  "fr": {
    "title_page": "Générateur HMAC",
    "desc": "Calculez un HMAC avec une clé secrète. SHA-1, SHA-256, SHA-384 et SHA-512 via Web Crypto. La clé et le message restent dans le navigateur.",
    "keyLabel": "Clé",
    "keyPh": "Secret partagé",
    "msgLabel": "Message",
    "msgPh": "Texte à signer",
    "run": "Générer HMAC",
    "copy": "Copier le résultat",
    "sample": "Exemple",
    "clear": "Effacer",
    "outputLabel": "Résultat",
    "outputHint": "Apparaît après Générer",
    "copied": "Copié",
    "msgEmpty": "Saisissez d’abord un message.",
    "msgKey": "Saisissez d’abord une clé.",
    "msgNoOut": "Rien à copier.",
    "msgFail": "Échec. Vérifiez que le navigateur gère Web Crypto."
  },
  "de": {
    "title_page": "HMAC-Generator",
    "desc": "Berechnet einen HMAC mit einem Geheimnis. SHA-1, SHA-256, SHA-384 und SHA-512 über Web Crypto. Schlüssel und Nachricht bleiben im Browser.",
    "keyLabel": "Geheimnis",
    "keyPh": "Geteiltes Geheimnis",
    "msgLabel": "Nachricht",
    "msgPh": "Zu signierender Text",
    "run": "HMAC erzeugen",
    "copy": "Ergebnis kopieren",
    "sample": "Beispiel",
    "clear": "Leeren",
    "outputLabel": "Ergebnis",
    "outputHint": "Erscheint nach Erzeugen",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst eine Nachricht eingeben.",
    "msgKey": "Bitte zuerst ein Geheimnis eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren.",
    "msgFail": "Fehlgeschlagen. Unterstützt der Browser Web Crypto?"
  },
  "es": {
    "title_page": "Generador HMAC",
    "desc": "Calcula un HMAC con una clave secreta. SHA-1, SHA-256, SHA-384 y SHA-512 vía Web Crypto. La clave y el mensaje se quedan en el navegador.",
    "keyLabel": "Clave",
    "keyPh": "Secreto compartido",
    "msgLabel": "Mensaje",
    "msgPh": "Texto a firmar",
    "run": "Generar HMAC",
    "copy": "Copiar resultado",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "outputLabel": "Resultado",
    "outputHint": "Aparece tras Generar",
    "copied": "Copiado",
    "msgEmpty": "Escribe un mensaje primero.",
    "msgKey": "Escribe una clave primero.",
    "msgNoOut": "Aún no hay nada que copiar.",
    "msgFail": "Error. Comprueba que el navegador admita Web Crypto."
  },
  "pt": {
    "title_page": "Gerador HMAC",
    "desc": "Calcula um HMAC com uma chave secreta. SHA-1, SHA-256, SHA-384 e SHA-512 via Web Crypto. A chave e a mensagem ficam no navegador.",
    "keyLabel": "Chave",
    "keyPh": "Segredo compartilhado",
    "msgLabel": "Mensagem",
    "msgPh": "Texto a assinar",
    "run": "Gerar HMAC",
    "copy": "Copiar resultado",
    "sample": "Exemplo",
    "clear": "Limpar",
    "outputLabel": "Resultado",
    "outputHint": "Aparece após Gerar",
    "copied": "Copiado",
    "msgEmpty": "Digite uma mensagem primeiro.",
    "msgKey": "Digite uma chave primeiro.",
    "msgNoOut": "Ainda não há o que copiar.",
    "msgFail": "Falha. Verifique se o navegador tem Web Crypto."
  },
  "ru": {
    "title_page": "Генератор HMAC",
    "desc": "Считает HMAC сообщения с секретом. SHA-1, SHA-256, SHA-384 и SHA-512 через Web Crypto. Ключ и текст остаются в браузере.",
    "keyLabel": "Секрет",
    "keyPh": "Общий секрет",
    "msgLabel": "Сообщение",
    "msgPh": "Текст для подписи",
    "run": "Сгенерировать HMAC",
    "copy": "Копировать результат",
    "sample": "Пример",
    "clear": "Очистить",
    "outputLabel": "Результат",
    "outputHint": "Появится после генерации",
    "copied": "Скопировано",
    "msgEmpty": "Сначала введите сообщение.",
    "msgKey": "Сначала введите секрет.",
    "msgNoOut": "Пока нечего копировать.",
    "msgFail": "Ошибка. Проверьте поддержку Web Crypto."
  },
  "ar": {
    "title_page": "مولّد HMAC",
    "desc": "احسب HMAC لرسالة بمفتاح سري. SHA-1 وSHA-256 وSHA-384 وSHA-512 عبر Web Crypto. المفتاح والرسالة يبقيان في المتصفح.",
    "keyLabel": "المفتاح",
    "keyPh": "السر المشترك",
    "msgLabel": "الرسالة",
    "msgPh": "النص للتوقيع",
    "run": "توليد HMAC",
    "copy": "نسخ النتيجة",
    "sample": "مثال",
    "clear": "مسح",
    "outputLabel": "النتيجة",
    "outputHint": "تظهر بعد التوليد",
    "copied": "تم النسخ",
    "msgEmpty": "أدخل رسالة أولاً.",
    "msgKey": "أدخل مفتاحاً أولاً.",
    "msgNoOut": "لا شيء للنسخ بعد.",
    "msgFail": "فشل. تحقق من دعم Web Crypto."
  },
  "hi": {
    "title_page": "HMAC जनरेटर",
    "desc": "गुप्त कुंजी से संदेश का HMAC निकालें। SHA-1, SHA-256, SHA-384, SHA-512 Web Crypto से। कुंजी और संदेश ब्राउज़र में रहते हैं।",
    "keyLabel": "कुंजी",
    "keyPh": "साझा रहस्य",
    "msgLabel": "संदेश",
    "msgPh": "हस्ताक्षर करने वाला पाठ",
    "run": "HMAC बनाएँ",
    "copy": "परिणाम कॉपी",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "outputLabel": "परिणाम",
    "outputHint": "बनाने के बाद दिखेगा",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले संदेश लिखें।",
    "msgKey": "पहले कुंजी लिखें।",
    "msgNoOut": "कॉपी करने को कुछ नहीं।",
    "msgFail": "असफल। देखें कि ब्राउज़र Web Crypto चलता है।"
  },
  "it": {
    "title_page": "Generatore HMAC",
    "desc": "Calcola un HMAC con una chiave segreta. SHA-1, SHA-256, SHA-384 e SHA-512 via Web Crypto. Chiave e messaggio restano nel browser.",
    "keyLabel": "Chiave",
    "keyPh": "Segreto condiviso",
    "msgLabel": "Messaggio",
    "msgPh": "Testo da firmare",
    "run": "Genera HMAC",
    "copy": "Copia risultato",
    "sample": "Esempio",
    "clear": "Svuota",
    "outputLabel": "Risultato",
    "outputHint": "Compare dopo Genera",
    "copied": "Copiato",
    "msgEmpty": "Inserisci prima un messaggio.",
    "msgKey": "Inserisci prima una chiave.",
    "msgNoOut": "Non c’è ancora nulla da copiare.",
    "msgFail": "Errore. Verifica che il browser supporti Web Crypto."
  },
  "nl": {
    "title_page": "HMAC-generator",
    "desc": "Bereken een HMAC met een geheim. SHA-1, SHA-256, SHA-384 en SHA-512 via Web Crypto. Sleutel en bericht blijven in de browser.",
    "keyLabel": "Geheim",
    "keyPh": "Gedeeld geheim",
    "msgLabel": "Bericht",
    "msgPh": "Tekst om te ondertekenen",
    "run": "HMAC maken",
    "copy": "Resultaat kopiëren",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "outputLabel": "Resultaat",
    "outputHint": "Verschijnt na Maken",
    "copied": "Gekopieerd",
    "msgEmpty": "Voer eerst een bericht in.",
    "msgKey": "Voer eerst een geheim in.",
    "msgNoOut": "Nog niets om te kopiëren.",
    "msgFail": "Mislukt. Ondersteunt de browser Web Crypto?"
  },
  "tr": {
    "title_page": "HMAC üreteci",
    "desc": "Gizli anahtarla HMAC hesaplayın. SHA-1, SHA-256, SHA-384, SHA-512 Web Crypto ile. Anahtar ve ileti tarayıcıda kalır.",
    "keyLabel": "Anahtar",
    "keyPh": "Paylaşılan sır",
    "msgLabel": "İleti",
    "msgPh": "İmzalanacak metin",
    "run": "HMAC üret",
    "copy": "Sonucu kopyala",
    "sample": "Örnek",
    "clear": "Temizle",
    "outputLabel": "Sonuç",
    "outputHint": "Ürettikten sonra görünür",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce ileti girin.",
    "msgKey": "Önce anahtar girin.",
    "msgNoOut": "Kopyalanacak bir şey yok.",
    "msgFail": "Başarısız. Tarayıcı Web Crypto destekliyor mu?"
  },
  "vi": {
    "title_page": "Tạo HMAC",
    "desc": "Tính HMAC của tin nhắn bằng khóa bí mật. SHA-1, SHA-256, SHA-384, SHA-512 qua Web Crypto. Khóa và nội dung ở lại trình duyệt.",
    "keyLabel": "Khóa",
    "keyPh": "Bí mật dùng chung",
    "msgLabel": "Tin nhắn",
    "msgPh": "Văn bản cần ký",
    "run": "Tạo HMAC",
    "copy": "Sao chép kết quả",
    "sample": "Mẫu",
    "clear": "Xóa",
    "outputLabel": "Kết quả",
    "outputHint": "Hiện sau khi tạo",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy nhập tin nhắn trước.",
    "msgKey": "Hãy nhập khóa trước.",
    "msgNoOut": "Chưa có gì để sao chép.",
    "msgFail": "Thất bại. Kiểm tra trình duyệt có Web Crypto không."
  },
  "th": {
    "title_page": "ตัวสร้าง HMAC",
    "desc": "คำนวณ HMAC ด้วยคีย์ลับ รองรับ SHA-1 SHA-256 SHA-384 SHA-512 ผ่าน Web Crypto คีย์และข้อความอยู่ในเบราว์เซอร์",
    "keyLabel": "คีย์",
    "keyPh": "ความลับร่วม",
    "msgLabel": "ข้อความ",
    "msgPh": "ข้อความที่จะลงนาม",
    "run": "สร้าง HMAC",
    "copy": "คัดลอกผลลัพธ์",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "outputLabel": "ผลลัพธ์",
    "outputHint": "แสดงหลังสร้าง",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "ใส่ข้อความก่อน",
    "msgKey": "ใส่คีย์ก่อน",
    "msgNoOut": "ยังไม่มีอะไรให้คัดลอก",
    "msgFail": "ล้มเหลว ตรวจว่าเบราว์เซอร์รองรับ Web Crypto"
  },
  "id": {
    "title_page": "Pembuat HMAC",
    "desc": "Hitung HMAC pesan dengan kunci rahasia. SHA-1, SHA-256, SHA-384, SHA-512 lewat Web Crypto. Kunci dan pesan tetap di browser.",
    "keyLabel": "Kunci",
    "keyPh": "Rahasia bersama",
    "msgLabel": "Pesan",
    "msgPh": "Teks yang ditandatangani",
    "run": "Buat HMAC",
    "copy": "Salin hasil",
    "sample": "Contoh",
    "clear": "Hapus",
    "outputLabel": "Hasil",
    "outputHint": "Muncul setelah dibuat",
    "copied": "Disalin",
    "msgEmpty": "Masukkan pesan dulu.",
    "msgKey": "Masukkan kunci dulu.",
    "msgNoOut": "Belum ada yang bisa disalin.",
    "msgFail": "Gagal. Cek apakah browser mendukung Web Crypto."
  },
  "ms": {
    "title_page": "Penjana HMAC",
    "desc": "Kira HMAC mesej dengan kunci rahsia. SHA-1, SHA-256, SHA-384, SHA-512 melalui Web Crypto. Kunci dan mesej kekal dalam pelayar.",
    "keyLabel": "Kunci",
    "keyPh": "Rahsia kongsi",
    "msgLabel": "Mesej",
    "msgPh": "Teks untuk ditandatangani",
    "run": "Jana HMAC",
    "copy": "Salin hasil",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "outputLabel": "Hasil",
    "outputHint": "Muncul selepas jana",
    "copied": "Disalin",
    "msgEmpty": "Masukkan mesej dahulu.",
    "msgKey": "Masukkan kunci dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin.",
    "msgFail": "Gagal. Semak sama ada pelayar menyokong Web Crypto."
  },
  "pl": {
    "title_page": "Generator HMAC",
    "desc": "Liczy HMAC wiadomości z sekretem. SHA-1, SHA-256, SHA-384 i SHA-512 przez Web Crypto. Klucz i treść zostają w przeglądarce.",
    "keyLabel": "Sekret",
    "keyPh": "Wspólny sekret",
    "msgLabel": "Wiadomość",
    "msgPh": "Tekst do podpisu",
    "run": "Wygeneruj HMAC",
    "copy": "Kopiuj wynik",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "outputLabel": "Wynik",
    "outputHint": "Pojawi się po wygenerowaniu",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wpisz wiadomość.",
    "msgKey": "Najpierw wpisz sekret.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania.",
    "msgFail": "Błąd. Sprawdź, czy przeglądarka ma Web Crypto."
  },
  "uk": {
    "title_page": "Генератор HMAC",
    "desc": "Рахує HMAC повідомлення з секретом. SHA-1, SHA-256, SHA-384 і SHA-512 через Web Crypto. Ключ і текст лишаються в браузері.",
    "keyLabel": "Секрет",
    "keyPh": "Спільний секрет",
    "msgLabel": "Повідомлення",
    "msgPh": "Текст для підпису",
    "run": "Згенерувати HMAC",
    "copy": "Копіювати результат",
    "sample": "Приклад",
    "clear": "Очистити",
    "outputLabel": "Результат",
    "outputHint": "З’явиться після генерації",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку введіть повідомлення.",
    "msgKey": "Спочатку введіть секрет.",
    "msgNoOut": "Поки немає що копіювати.",
    "msgFail": "Помилка. Перевірте підтримку Web Crypto."
  },
  "sv": {
    "title_page": "HMAC-generator",
    "desc": "Beräkna HMAC med en hemlig nyckel. SHA-1, SHA-256, SHA-384 och SHA-512 via Web Crypto. Nyckel och meddelande stannar i webbläsaren.",
    "keyLabel": "Nyckel",
    "keyPh": "Delad hemlighet",
    "msgLabel": "Meddelande",
    "msgPh": "Text att signera",
    "run": "Skapa HMAC",
    "copy": "Kopiera resultat",
    "sample": "Exempel",
    "clear": "Rensa",
    "outputLabel": "Resultat",
    "outputHint": "Visas efter Skapa",
    "copied": "Kopierat",
    "msgEmpty": "Skriv ett meddelande först.",
    "msgKey": "Skriv en nyckel först.",
    "msgNoOut": "Inget att kopiera ännu.",
    "msgFail": "Misslyckades. Stöder webbläsaren Web Crypto?"
  },
  "zh-TW": {
    "title_page": "HMAC 產生器",
    "desc": "用金鑰對一段原文計算 HMAC，支援 SHA-1、SHA-256、SHA-384、SHA-512。計算走瀏覽器 Web Crypto，金鑰和原文都留在本機。",
    "keyLabel": "金鑰",
    "keyPh": "輸入共用金鑰",
    "msgLabel": "原文",
    "msgPh": "要簽名的文字",
    "run": "產生 HMAC",
    "copy": "複製結果",
    "sample": "範例",
    "clear": "清空",
    "outputLabel": "結果",
    "outputHint": "點產生後顯示",
    "copied": "已複製",
    "msgEmpty": "請先輸入原文。",
    "msgKey": "請先輸入金鑰。",
    "msgNoOut": "還沒有可複製的結果。",
    "msgFail": "計算失敗，請檢查瀏覽器是否支援 Web Crypto。"
  }
}
</i18n>
