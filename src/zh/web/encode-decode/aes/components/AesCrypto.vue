<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { concatBytes, fromBase64, fromHex, toBase64, toHex, utf8 } from "../../shared/bytes"

const { t } = useI18n()

type Mode = "GCM" | "CBC"
type OutFmt = "base64" | "hex"

const VERSION = 1
const SALT_LEN = 16
const ITER = 100_000
const IV_LEN: Record<Mode, number> = { GCM: 12, CBC: 16 }

const input = ref("hello kyx")
const password = ref("password")
const mode = ref<Mode>("GCM")
const outFmt = ref<OutFmt>("base64")
const output = ref("")
const running = ref(false)

function encodePacked(buf: Uint8Array) {
  return outFmt.value === "hex" ? toHex(buf) : toBase64(buf)
}

function decodePacked(text: string) {
  const clean = text.trim()
  if (!clean) throw new Error("empty")
  const asHex = () => fromHex(clean)
  const asB64 = () => fromBase64(clean)
  if (outFmt.value === "hex") {
    try {
      return asHex()
    } catch {
      return asB64()
    }
  }
  try {
    return asB64()
  } catch {
    return asHex()
  }
}

async function deriveKey(pass: string, salt: Uint8Array, aesMode: Mode, usages: KeyUsage[]) {
  const material = await crypto.subtle.importKey("raw", utf8(pass), "PBKDF2", false, ["deriveKey"])
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
    material,
    { name: aesMode === "GCM" ? "AES-GCM" : "AES-CBC", length: 256 },
    false,
    usages
  )
}

function pack(modeVal: Mode, salt: Uint8Array, iv: Uint8Array, ct: ArrayBuffer) {
  return concatBytes(new Uint8Array([VERSION, modeVal === "GCM" ? 0 : 1]), salt, iv, new Uint8Array(ct))
}

function unpack(buf: Uint8Array) {
  if (buf.length < 2 + SALT_LEN + 12) throw new Error("short")
  if (buf[0] !== VERSION) throw new Error("ver")
  const modeVal: Mode = buf[1] === 0 ? "GCM" : "CBC"
  const ivLen = IV_LEN[modeVal]
  const salt = buf.subarray(2, 2 + SALT_LEN)
  const iv = buf.subarray(2 + SALT_LEN, 2 + SALT_LEN + ivLen)
  const ct = buf.subarray(2 + SALT_LEN + ivLen)
  if (!ct.length) throw new Error("short")
  return { modeVal, salt, iv, ct }
}

async function encrypt() {
  if (!input.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  if (!password.value) {
    ElMessage({ message: t("msgKey"), type: "warning" })
    return
  }
  running.value = true
  try {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN))
    const iv = crypto.getRandomValues(new Uint8Array(IV_LEN[mode.value]))
    const key = await deriveKey(password.value, salt, mode.value, ["encrypt"])
    const algo =
      mode.value === "GCM"
        ? ({ name: "AES-GCM", iv } as AesGcmParams)
        : ({ name: "AES-CBC", iv } as AesCbcParams)
    const ct = await crypto.subtle.encrypt(algo, key, utf8(input.value))
    output.value = encodePacked(pack(mode.value, salt, iv, ct))
  } catch {
    ElMessage({ message: t("msgEncFail"), type: "error" })
  } finally {
    running.value = false
  }
}

async function decrypt() {
  if (!input.value.trim()) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  if (!password.value) {
    ElMessage({ message: t("msgKey"), type: "warning" })
    return
  }
  running.value = true
  try {
    const packed = decodePacked(input.value)
    const { modeVal, salt, iv, ct } = unpack(packed)
    mode.value = modeVal
    const key = await deriveKey(password.value, salt, modeVal, ["decrypt"])
    const algo =
      modeVal === "GCM"
        ? ({ name: "AES-GCM", iv } as AesGcmParams)
        : ({ name: "AES-CBC", iv } as AesCbcParams)
    const pt = await crypto.subtle.decrypt(algo, key, ct)
    output.value = new TextDecoder().decode(pt)
  } catch {
    ElMessage({ message: t("msgDecFail"), type: "error" })
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

function sendBack() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  input.value = output.value
}

function useSample() {
  input.value = "hello kyx"
  password.value = "password"
  mode.value = "GCM"
}

function clearAll() {
  input.value = ""
  password.value = ""
  output.value = ""
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-radio-group v-model="mode">
        <el-radio-button value="GCM">AES-GCM</el-radio-button>
        <el-radio-button value="CBC">AES-CBC</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="outFmt">
        <el-radio-button value="base64">Base64</el-radio-button>
        <el-radio-button value="hex">Hex</el-radio-button>
      </el-radio-group>
    </div>

    <div class="field">
      <div class="pane-label">{{ t("keyLabel") }}</div>
      <el-input
        v-model="password"
        :placeholder="t('keyPh')"
        show-password
      />
    </div>

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
        @click="encrypt"
      >
        {{ t("enc") }}
      </el-button>
      <el-button
        :loading="running"
        @click="decrypt"
      >
        {{ t("dec") }}
      </el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
      <el-button @click="sendBack">{{ t("back") }}</el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <div class="pane-label">{{ t("outputLabel") }}</div>
    <el-input
      v-model="output"
      type="textarea"
      :rows="8"
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

.field {
  margin-bottom: 14px;
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
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "AES 加解密",
    "desc": "用口令派生 256 位密钥，在浏览器里做 AES-GCM 或 AES-CBC。密文打包为盐、IV 和密文，可往返解密。明文和口令都留在本地，不会上传。",
    "keyLabel": "口令",
    "keyPh": "用于派生密钥的口令",
    "inputLabel": "输入",
    "inputPh": "明文或密文",
    "enc": "加密",
    "dec": "解密",
    "copy": "复制结果",
    "back": "回填到输入",
    "sample": "示例",
    "clear": "清空",
    "outputLabel": "输出",
    "outputHint": "加密或解密后显示",
    "copied": "已复制",
    "msgEmpty": "请先输入内容。",
    "msgKey": "请先输入口令。",
    "msgNoOut": "还没有可复制的结果。",
    "msgEncFail": "加密失败，请检查浏览器是否支持 Web Crypto。",
    "msgDecFail": "解密失败。请确认口令正确，且密文是本工具生成的。"
  },
  "zh-CN": {
    "title_page": "AES 加解密",
    "desc": "用口令派生 256 位密钥，在浏览器里做 AES-GCM 或 AES-CBC。密文打包为盐、IV 和密文，可往返解密。明文和口令都留在本地，不会上传。",
    "keyLabel": "口令",
    "keyPh": "用于派生密钥的口令",
    "inputLabel": "输入",
    "inputPh": "明文或密文",
    "enc": "加密",
    "dec": "解密",
    "copy": "复制结果",
    "back": "回填到输入",
    "sample": "示例",
    "clear": "清空",
    "outputLabel": "输出",
    "outputHint": "加密或解密后显示",
    "copied": "已复制",
    "msgEmpty": "请先输入内容。",
    "msgKey": "请先输入口令。",
    "msgNoOut": "还没有可复制的结果。",
    "msgEncFail": "加密失败，请检查浏览器是否支持 Web Crypto。",
    "msgDecFail": "解密失败。请确认口令正确，且密文是本工具生成的。"
  },
  "en": {
    "title_page": "AES Encrypt & Decrypt",
    "desc": "Derive a 256-bit key from a password and encrypt with AES-GCM or AES-CBC in the browser. Ciphertext packs salt, IV, and data so you can decrypt it later. Plaintext and password stay local.",
    "keyLabel": "Password",
    "keyPh": "Password used to derive the key",
    "inputLabel": "Input",
    "inputPh": "Plaintext or ciphertext",
    "enc": "Encrypt",
    "dec": "Decrypt",
    "copy": "Copy result",
    "back": "Send back to input",
    "sample": "Sample",
    "clear": "Clear",
    "outputLabel": "Output",
    "outputHint": "Appears after encrypt or decrypt",
    "copied": "Copied",
    "msgEmpty": "Enter some text first.",
    "msgKey": "Enter a password first.",
    "msgNoOut": "There is nothing to copy yet.",
    "msgEncFail": "Encrypt failed. Check that this browser supports Web Crypto.",
    "msgDecFail": "Decrypt failed. Check the password and that the ciphertext was made here."
  },
  "ja": {
    "title_page": "AES 暗号化・復号",
    "desc": "パスワードから 256 ビット鍵を派生し、ブラウザ内で AES-GCM / AES-CBC します。暗号文は塩・IV・本文をまとめており往復復号できます。平文とパスワードは端末内に留まります。",
    "keyLabel": "パスワード",
    "keyPh": "鍵派生用パスワード",
    "inputLabel": "入力",
    "inputPh": "平文または暗号文",
    "enc": "暗号化",
    "dec": "復号",
    "copy": "結果をコピー",
    "back": "入力へ戻す",
    "sample": "サンプル",
    "clear": "クリア",
    "outputLabel": "出力",
    "outputHint": "処理後に表示",
    "copied": "コピーしました",
    "msgEmpty": "先に内容を入力してください。",
    "msgKey": "先にパスワードを入力してください。",
    "msgNoOut": "コピーできる結果がありません。",
    "msgEncFail": "暗号化に失敗しました。Web Crypto を確認してください。",
    "msgDecFail": "復号に失敗しました。パスワードと、本ツールの暗号文かを確認してください。"
  },
  "ko": {
    "title_page": "AES 암·복호화",
    "desc": "비밀번호로 256비트 키를 만들고 브라우저에서 AES-GCM 또는 AES-CBC를 수행합니다. 암호문은 솔트, IV, 데이터를 묶어 다시 복호화할 수 있습니다. 평문과 비밀번호는 로컬에 남습니다.",
    "keyLabel": "비밀번호",
    "keyPh": "키 유도에 쓸 비밀번호",
    "inputLabel": "입력",
    "inputPh": "평문 또는 암호문",
    "enc": "암호화",
    "dec": "복호화",
    "copy": "결과 복사",
    "back": "입력으로 되돌리기",
    "sample": "예제",
    "clear": "지우기",
    "outputLabel": "출력",
    "outputHint": "처리 후 표시",
    "copied": "복사됨",
    "msgEmpty": "먼저 내용을 입력하세요.",
    "msgKey": "먼저 비밀번호를 입력하세요.",
    "msgNoOut": "복사할 결과가 없습니다.",
    "msgEncFail": "암호화에 실패했습니다. Web Crypto 지원을 확인하세요.",
    "msgDecFail": "복호화에 실패했습니다. 비밀번호와 이 도구에서 만든 암호문인지 확인하세요."
  },
  "fr": {
    "title_page": "Chiffrement AES",
    "desc": "Dérive une clé 256 bits d’un mot de passe et chiffre en AES-GCM ou AES-CBC dans le navigateur. Le texte chiffré contient sel, IV et données pour un aller-retour. Rien n’est envoyé.",
    "keyLabel": "Mot de passe",
    "keyPh": "Mot de passe pour dériver la clé",
    "inputLabel": "Entrée",
    "inputPh": "Texte clair ou chiffré",
    "enc": "Chiffrer",
    "dec": "Déchiffrer",
    "copy": "Copier le résultat",
    "back": "Renvoyer vers l’entrée",
    "sample": "Exemple",
    "clear": "Effacer",
    "outputLabel": "Sortie",
    "outputHint": "Apparaît après traitement",
    "copied": "Copié",
    "msgEmpty": "Saisissez d’abord du texte.",
    "msgKey": "Saisissez d’abord un mot de passe.",
    "msgNoOut": "Rien à copier.",
    "msgEncFail": "Échec du chiffrement. Vérifiez Web Crypto.",
    "msgDecFail": "Échec du déchiffrement. Vérifiez le mot de passe et que le texte vient de cet outil."
  },
  "de": {
    "title_page": "AES ver- und entschlüsseln",
    "desc": "Leitet einen 256-Bit-Schlüssel aus einem Passwort ab und nutzt AES-GCM oder AES-CBC im Browser. Der Geheimtext enthält Salz, IV und Daten. Klartext und Passwort bleiben lokal.",
    "keyLabel": "Passwort",
    "keyPh": "Passwort zur Schlüsselableitung",
    "inputLabel": "Eingabe",
    "inputPh": "Klar- oder Geheimtext",
    "enc": "Verschlüsseln",
    "dec": "Entschlüsseln",
    "copy": "Ergebnis kopieren",
    "back": "Zurück ins Eingabefeld",
    "sample": "Beispiel",
    "clear": "Leeren",
    "outputLabel": "Ausgabe",
    "outputHint": "Erscheint nach der Verarbeitung",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst Text eingeben.",
    "msgKey": "Bitte zuerst ein Passwort eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren.",
    "msgEncFail": "Verschlüsseln fehlgeschlagen. Web Crypto prüfen.",
    "msgDecFail": "Entschlüsseln fehlgeschlagen. Passwort und Herkunft des Geheimtexts prüfen."
  },
  "es": {
    "title_page": "Cifrado AES",
    "desc": "Deriva una clave de 256 bits de una contraseña y cifra con AES-GCM o AES-CBC en el navegador. El cifrado incluye sal, IV y datos para poder descifrarlo. Nada se sube.",
    "keyLabel": "Contraseña",
    "keyPh": "Contraseña para derivar la clave",
    "inputLabel": "Entrada",
    "inputPh": "Texto claro o cifrado",
    "enc": "Cifrar",
    "dec": "Descifrar",
    "copy": "Copiar resultado",
    "back": "Devolver a la entrada",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "outputLabel": "Salida",
    "outputHint": "Aparece tras cifrar o descifrar",
    "copied": "Copiado",
    "msgEmpty": "Escribe algo primero.",
    "msgKey": "Escribe una contraseña primero.",
    "msgNoOut": "Aún no hay nada que copiar.",
    "msgEncFail": "Error al cifrar. Comprueba Web Crypto.",
    "msgDecFail": "Error al descifrar. Revisa la contraseña y que el texto salga de esta herramienta."
  },
  "pt": {
    "title_page": "Cifrar e decifrar AES",
    "desc": "Deriva uma chave de 256 bits de uma senha e cifra com AES-GCM ou AES-CBC no navegador. O texto cifrado inclui sal, IV e dados para decifrar depois. Nada é enviado.",
    "keyLabel": "Senha",
    "keyPh": "Senha para derivar a chave",
    "inputLabel": "Entrada",
    "inputPh": "Texto claro ou cifrado",
    "enc": "Cifrar",
    "dec": "Decifrar",
    "copy": "Copiar resultado",
    "back": "Enviar de volta",
    "sample": "Exemplo",
    "clear": "Limpar",
    "outputLabel": "Saída",
    "outputHint": "Aparece após cifrar ou decifrar",
    "copied": "Copiado",
    "msgEmpty": "Digite um texto primeiro.",
    "msgKey": "Digite uma senha primeiro.",
    "msgNoOut": "Ainda não há o que copiar.",
    "msgEncFail": "Falha ao cifrar. Verifique o Web Crypto.",
    "msgDecFail": "Falha ao decifrar. Confira a senha e se o texto veio desta ferramenta."
  },
  "ru": {
    "title_page": "AES шифрование",
    "desc": "Выводит 256-битный ключ из пароля и шифрует AES-GCM или AES-CBC в браузере. Шифртекст содержит соль, IV и данные для обратной расшифровки. Ничего не отправляется.",
    "keyLabel": "Пароль",
    "keyPh": "Пароль для вывода ключа",
    "inputLabel": "Ввод",
    "inputPh": "Открытый или шифртекст",
    "enc": "Зашифровать",
    "dec": "Расшифровать",
    "copy": "Копировать результат",
    "back": "Вернуть во ввод",
    "sample": "Пример",
    "clear": "Очистить",
    "outputLabel": "Вывод",
    "outputHint": "Появится после обработки",
    "copied": "Скопировано",
    "msgEmpty": "Сначала введите текст.",
    "msgKey": "Сначала введите пароль.",
    "msgNoOut": "Пока нечего копировать.",
    "msgEncFail": "Ошибка шифрования. Проверьте Web Crypto.",
    "msgDecFail": "Ошибка расшифровки. Проверьте пароль и что текст создан этим инструментом."
  },
  "ar": {
    "title_page": "تشفير AES وفكّه",
    "desc": "اشتق مفتاحاً 256 بت من كلمة مرور وشفّر بـ AES-GCM أو AES-CBC في المتصفح. النص المشفّر يضم الملح وIV والبيانات لفكّه لاحقاً. لا يُرفع شيء.",
    "keyLabel": "كلمة المرور",
    "keyPh": "كلمة المرور لاشتقاق المفتاح",
    "inputLabel": "الإدخال",
    "inputPh": "نص واضح أو مشفّر",
    "enc": "تشفير",
    "dec": "فك التشفير",
    "copy": "نسخ النتيجة",
    "back": "إعادة إلى الإدخال",
    "sample": "مثال",
    "clear": "مسح",
    "outputLabel": "المخرج",
    "outputHint": "يظهر بعد المعالجة",
    "copied": "تم النسخ",
    "msgEmpty": "أدخل نصاً أولاً.",
    "msgKey": "أدخل كلمة مرور أولاً.",
    "msgNoOut": "لا شيء للنسخ بعد.",
    "msgEncFail": "فشل التشفير. تحقق من Web Crypto.",
    "msgDecFail": "فشل فك التشفير. تحقق من كلمة المرور وأن النص من هذه الأداة."
  },
  "hi": {
    "title_page": "AES एन्क्रिप्ट / डिक्रिप्ट",
    "desc": "पासवर्ड से 256-बिट कुंजी बनाकर ब्राउज़र में AES-GCM या AES-CBC करें। सिफरटेक्स्ट में नमक, IV और डेटा होता है ताकि बाद में खोला जा सके। कुछ अपलोड नहीं होता।",
    "keyLabel": "पासवर्ड",
    "keyPh": "कुंजी बनाने वाला पासवर्ड",
    "inputLabel": "इनपुट",
    "inputPh": "सादा या एन्क्रिप्टेड पाठ",
    "enc": "एन्क्रिप्ट",
    "dec": "डिक्रिप्ट",
    "copy": "परिणाम कॉपी",
    "back": "इनपुट में वापस",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "outputLabel": "आउटपुट",
    "outputHint": "प्रोसेस के बाद दिखेगा",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले पाठ लिखें।",
    "msgKey": "पहले पासवर्ड लिखें।",
    "msgNoOut": "कॉपी करने को कुछ नहीं।",
    "msgEncFail": "एन्क्रिप्ट असफल। Web Crypto जाँचें।",
    "msgDecFail": "डिक्रिप्ट असफल। पासवर्ड और यह टूल का सिफरटेक्स्ट जाँचें।"
  },
  "it": {
    "title_page": "Cifra e decifra AES",
    "desc": "Deriva una chiave a 256 bit da una password e cifra con AES-GCM o AES-CBC nel browser. Il testo cifrato include sale, IV e dati per decifrarlo. Niente viene inviato.",
    "keyLabel": "Password",
    "keyPh": "Password per derivare la chiave",
    "inputLabel": "Input",
    "inputPh": "Testo in chiaro o cifrato",
    "enc": "Cifra",
    "dec": "Decifra",
    "copy": "Copia risultato",
    "back": "Rimanda all’input",
    "sample": "Esempio",
    "clear": "Svuota",
    "outputLabel": "Output",
    "outputHint": "Compare dopo l’elaborazione",
    "copied": "Copiato",
    "msgEmpty": "Inserisci prima del testo.",
    "msgKey": "Inserisci prima una password.",
    "msgNoOut": "Non c’è ancora nulla da copiare.",
    "msgEncFail": "Cifratura non riuscita. Controlla Web Crypto.",
    "msgDecFail": "Decifratura non riuscita. Controlla password e origine del testo."
  },
  "nl": {
    "title_page": "AES versleutelen",
    "desc": "Leid een 256-bits sleutel af van een wachtwoord en versleutel met AES-GCM of AES-CBC in de browser. De ciphertext bevat zout, IV en data. Niets wordt geüpload.",
    "keyLabel": "Wachtwoord",
    "keyPh": "Wachtwoord om de sleutel af te leiden",
    "inputLabel": "Invoer",
    "inputPh": "Platte of versleutelde tekst",
    "enc": "Versleutelen",
    "dec": "Ontsleutelen",
    "copy": "Resultaat kopiëren",
    "back": "Terug naar invoer",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "outputLabel": "Uitvoer",
    "outputHint": "Verschijnt na verwerken",
    "copied": "Gekopieerd",
    "msgEmpty": "Voer eerst tekst in.",
    "msgKey": "Voer eerst een wachtwoord in.",
    "msgNoOut": "Nog niets om te kopiëren.",
    "msgEncFail": "Versleutelen mislukt. Controleer Web Crypto.",
    "msgDecFail": "Ontsleutelen mislukt. Controleer wachtwoord en of de tekst hier is gemaakt."
  },
  "tr": {
    "title_page": "AES şifrele / çöz",
    "desc": "Paroladan 256 bit anahtar türetip tarayıcıda AES-GCM veya AES-CBC kullanır. Şifreli metin tuz, IV ve veriyi paketler. Hiçbir şey yüklenmez.",
    "keyLabel": "Parola",
    "keyPh": "Anahtar türetmek için parola",
    "inputLabel": "Girdi",
    "inputPh": "Açık veya şifreli metin",
    "enc": "Şifrele",
    "dec": "Çöz",
    "copy": "Sonucu kopyala",
    "back": "Girdiye geri gönder",
    "sample": "Örnek",
    "clear": "Temizle",
    "outputLabel": "Çıktı",
    "outputHint": "İşlemden sonra görünür",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce metin girin.",
    "msgKey": "Önce parola girin.",
    "msgNoOut": "Kopyalanacak bir şey yok.",
    "msgEncFail": "Şifreleme başarısız. Web Crypto’yu kontrol edin.",
    "msgDecFail": "Çözme başarısız. Parolayı ve metnin bu araçtan geldiğini kontrol edin."
  },
  "vi": {
    "title_page": "Mã hóa AES",
    "desc": "Sinh khóa 256 bit từ mật khẩu và mã hóa AES-GCM hoặc AES-CBC trong trình duyệt. Bản mã gồm muối, IV và dữ liệu để giải được. Không tải gì lên.",
    "keyLabel": "Mật khẩu",
    "keyPh": "Mật khẩu để sinh khóa",
    "inputLabel": "Đầu vào",
    "inputPh": "Văn bản rõ hoặc đã mã hóa",
    "enc": "Mã hóa",
    "dec": "Giải mã",
    "copy": "Sao chép kết quả",
    "back": "Đưa lại đầu vào",
    "sample": "Mẫu",
    "clear": "Xóa",
    "outputLabel": "Đầu ra",
    "outputHint": "Hiện sau khi xử lý",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy nhập nội dung trước.",
    "msgKey": "Hãy nhập mật khẩu trước.",
    "msgNoOut": "Chưa có gì để sao chép.",
    "msgEncFail": "Mã hóa thất bại. Kiểm tra Web Crypto.",
    "msgDecFail": "Giải mã thất bại. Kiểm tra mật khẩu và bản mã có phải của công cụ này."
  },
  "th": {
    "title_page": "เข้ารหัส AES",
    "desc": "สร้างคีย์ 256 บิตจากรหัสผ่าน แล้วเข้ารหัส AES-GCM หรือ AES-CBC ในเบราว์เซอร์ ข้อความเข้ารหัสรวมเกลือ IV และข้อมูล เพื่อถอดกลับได้ ไม่มีการอัปโหลด",
    "keyLabel": "รหัสผ่าน",
    "keyPh": "รหัสผ่านสำหรับสร้างคีย์",
    "inputLabel": "อินพุต",
    "inputPh": "ข้อความธรรมดาหรือเข้ารหัส",
    "enc": "เข้ารหัส",
    "dec": "ถอดรหัส",
    "copy": "คัดลอกผลลัพธ์",
    "back": "ส่งกลับไปอินพุต",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "outputLabel": "เอาต์พุต",
    "outputHint": "แสดงหลังประมวลผล",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "ใส่ข้อความก่อน",
    "msgKey": "ใส่รหัสผ่านก่อน",
    "msgNoOut": "ยังไม่มีอะไรให้คัดลอก",
    "msgEncFail": "เข้ารหัสไม่สำเร็จ ตรวจ Web Crypto",
    "msgDecFail": "ถอดรหัสไม่สำเร็จ ตรวจรหัสผ่านและว่าข้อความมาจากเครื่องมือนี้"
  },
  "id": {
    "title_page": "Enkripsi AES",
    "desc": "Turunkan kunci 256-bit dari kata sandi lalu enkripsi AES-GCM atau AES-CBC di browser. Ciphertext memuat garam, IV, dan data agar bisa didekripsi. Tidak ada yang diunggah.",
    "keyLabel": "Kata sandi",
    "keyPh": "Kata sandi untuk menurunkan kunci",
    "inputLabel": "Masukan",
    "inputPh": "Teks biasa atau terenkripsi",
    "enc": "Enkripsi",
    "dec": "Dekripsi",
    "copy": "Salin hasil",
    "back": "Kembalikan ke masukan",
    "sample": "Contoh",
    "clear": "Hapus",
    "outputLabel": "Keluaran",
    "outputHint": "Muncul setelah diproses",
    "copied": "Disalin",
    "msgEmpty": "Masukkan teks dulu.",
    "msgKey": "Masukkan kata sandi dulu.",
    "msgNoOut": "Belum ada yang bisa disalin.",
    "msgEncFail": "Enkripsi gagal. Periksa Web Crypto.",
    "msgDecFail": "Dekripsi gagal. Periksa kata sandi dan apakah teks dari alat ini."
  },
  "ms": {
    "title_page": "Penyulitan AES",
    "desc": "Terbitkan kunci 256-bit daripada kata laluan dan sulitkan dengan AES-GCM atau AES-CBC dalam pelayar. Teks tersulit mengandungi garam, IV dan data. Tiada yang dimuat naik.",
    "keyLabel": "Kata laluan",
    "keyPh": "Kata laluan untuk terbitkan kunci",
    "inputLabel": "Input",
    "inputPh": "Teks biasa atau tersulit",
    "enc": "Sulitkan",
    "dec": "Nyahsulit",
    "copy": "Salin hasil",
    "back": "Hantar semula ke input",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "outputLabel": "Output",
    "outputHint": "Muncul selepas diproses",
    "copied": "Disalin",
    "msgEmpty": "Masukkan teks dahulu.",
    "msgKey": "Masukkan kata laluan dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin.",
    "msgEncFail": "Penyulitan gagal. Semak Web Crypto.",
    "msgDecFail": "Nyahsulit gagal. Semak kata laluan dan sama ada teks dari alat ini."
  },
  "pl": {
    "title_page": "Szyfrowanie AES",
    "desc": "Wyprowadza 256-bitowy klucz z hasła i szyfruje AES-GCM lub AES-CBC w przeglądarce. Szyfrogram zawiera sól, IV i dane, więc da się odszyfrować. Nic nie jest wysyłane.",
    "keyLabel": "Hasło",
    "keyPh": "Hasło do wyprowadzenia klucza",
    "inputLabel": "Wejście",
    "inputPh": "Tekst jawny lub szyfrogram",
    "enc": "Szyfruj",
    "dec": "Deszyfruj",
    "copy": "Kopiuj wynik",
    "back": "Wróć do wejścia",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "outputLabel": "Wyjście",
    "outputHint": "Pojawi się po przetworzeniu",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wpisz tekst.",
    "msgKey": "Najpierw wpisz hasło.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania.",
    "msgEncFail": "Szyfrowanie nie powiodło się. Sprawdź Web Crypto.",
    "msgDecFail": "Deszyfrowanie nie powiodło się. Sprawdź hasło i pochodzenie tekstu."
  },
  "uk": {
    "title_page": "Шифрування AES",
    "desc": "Виводить 256-бітний ключ із пароля й шифрує AES-GCM або AES-CBC у браузері. Шифротекст містить сіль, IV і дані для зворотного розшифрування. Нічого не надсилається.",
    "keyLabel": "Пароль",
    "keyPh": "Пароль для виведення ключа",
    "inputLabel": "Ввід",
    "inputPh": "Відкритий або шифротекст",
    "enc": "Зашифрувати",
    "dec": "Розшифрувати",
    "copy": "Копіювати результат",
    "back": "Повернути у ввід",
    "sample": "Приклад",
    "clear": "Очистити",
    "outputLabel": "Вивід",
    "outputHint": "З’явиться після обробки",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку введіть текст.",
    "msgKey": "Спочатку введіть пароль.",
    "msgNoOut": "Поки немає що копіювати.",
    "msgEncFail": "Помилка шифрування. Перевірте Web Crypto.",
    "msgDecFail": "Помилка розшифрування. Перевірте пароль і що текст з цього інструмента."
  },
  "sv": {
    "title_page": "AES-kryptering",
    "desc": "Härleder en 256-bitars nyckel från ett lösenord och krypterar med AES-GCM eller AES-CBC i webbläsaren. Chiffertexten packar salt, IV och data. Inget skickas.",
    "keyLabel": "Lösenord",
    "keyPh": "Lösenord för att härleda nyckeln",
    "inputLabel": "Indata",
    "inputPh": "Klartext eller chiffertext",
    "enc": "Kryptera",
    "dec": "Dekryptera",
    "copy": "Kopiera resultat",
    "back": "Skicka tillbaka till indata",
    "sample": "Exempel",
    "clear": "Rensa",
    "outputLabel": "Utdata",
    "outputHint": "Visas efter bearbetning",
    "copied": "Kopierat",
    "msgEmpty": "Skriv text först.",
    "msgKey": "Skriv ett lösenord först.",
    "msgNoOut": "Inget att kopiera ännu.",
    "msgEncFail": "Kryptering misslyckades. Kontrollera Web Crypto.",
    "msgDecFail": "Dekryptering misslyckades. Kontrollera lösenord och att texten kommer härifrån."
  },
  "zh-TW": {
    "title_page": "AES 加解密",
    "desc": "用口令派生 256 位金鑰，在瀏覽器裡做 AES-GCM 或 AES-CBC。密文打包為鹽、IV 和密文，可往返解密。明文和口令都留在本機，不會上傳。",
    "keyLabel": "口令",
    "keyPh": "用於派生金鑰的口令",
    "inputLabel": "輸入",
    "inputPh": "明文或密文",
    "enc": "加密",
    "dec": "解密",
    "copy": "複製結果",
    "back": "回填到輸入",
    "sample": "範例",
    "clear": "清空",
    "outputLabel": "輸出",
    "outputHint": "加密或解密後顯示",
    "copied": "已複製",
    "msgEmpty": "請先輸入內容。",
    "msgKey": "請先輸入口令。",
    "msgNoOut": "還沒有可複製的結果。",
    "msgEncFail": "加密失敗，請檢查瀏覽器是否支援 Web Crypto。",
    "msgDecFail": "解密失敗。請確認口令正確，且密文是本工具產生的。"
  }
}
</i18n>
