<template>
  <div class="b64-wrap">
    <!-- 文字模式 -->
    <template v-if="inputType === 'text'">
      <div
        class="b64-area"
        :class="{ 'is-dragover': isDragOver }"
      >
        <el-input
          v-model="text"
          type="textarea"
          :rows="8"
          :placeholder="t('textPlaceholder')"
        />
      </div>

      <div class="b64-actions">
        <el-button
          bg
          text
          size="large"
          :disabled="!text"
          @click="handleAction"
        >
          {{ operation === "encode" ? t("encode") : t("decode") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          @click="clearAll"
          >{{ t("clear") }}</el-button
        >
        <el-button
          bg
          text
          size="large"
          :disabled="!result"
          @click="copyResult"
          >{{ t("copyResult") }}</el-button
        >
      </div>

      <el-input
        v-model="result"
        type="textarea"
        :rows="8"
        :placeholder="t('resultPlaceholder')"
        readonly
      />
    </template>

    <!-- 图片模式 -->
    <template v-else-if="inputType === 'image'">
      <!-- 编码：图片 → Base64 -->
      <template v-if="operation === 'encode'">
        <div
          class="b64-dropzone"
          :class="{ 'is-dragover': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
          @drop.prevent="onImageDrop"
          @click="imageInput?.click()"
        >
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="b64-preview-img"
            alt="preview"
          />
          <template v-else>
            <el-icon class="b64-upload-icon"><UploadFilled /></el-icon>
            <p>{{ t("dropImageHint") }}</p>
          </template>
        </div>
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onImageFileChange"
        />

        <div class="b64-actions">
          <el-button
            bg
            text
            size="large"
            :disabled="!result"
            @click="copyResult"
            >{{ t("copyResult") }}</el-button
          >
          <el-button
            bg
            text
            size="large"
            @click="clearAll"
            >{{ t("clear") }}</el-button
          >
        </div>

        <el-input
          v-model="result"
          type="textarea"
          :rows="6"
          :placeholder="t('resultPlaceholder')"
          readonly
        />
      </template>

      <!-- 解码：Base64 → 图片预览 -->
      <template v-else>
        <el-input
          v-model="text"
          type="textarea"
          :rows="6"
          :placeholder="t('base64InputPlaceholder')"
        />

        <div class="b64-actions">
          <el-button
            bg
            text
            size="large"
            :disabled="!text"
            @click="decodeImage"
            >{{ t("decode") }}</el-button
          >
          <el-button
            bg
            text
            size="large"
            :disabled="!previewUrl"
            @click="downloadImage"
            >{{ t("downloadImage") }}</el-button
          >
          <el-button
            bg
            text
            size="large"
            @click="clearAll"
            >{{ t("clear") }}</el-button
          >
        </div>

        <div
          v-if="previewUrl"
          class="b64-image-result"
        >
          <img
            :src="previewUrl"
            class="b64-preview-img"
            alt="decoded"
          />
        </div>
      </template>
    </template>

    <!-- 文件模式 -->
    <template v-else-if="inputType === 'file'">
      <!-- 编码：文件 → Base64 -->
      <template v-if="operation === 'encode'">
        <div
          class="b64-dropzone"
          :class="{ 'is-dragover': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
          @drop.prevent="onFileDrop"
          @click="fileInput?.click()"
        >
          <el-icon class="b64-upload-icon"><UploadFilled /></el-icon>
          <p v-if="fileName">{{ fileName }}</p>
          <p v-else>{{ t("dropFileHint") }}</p>
        </div>
        <input
          ref="fileInput"
          type="file"
          style="display: none"
          @change="onFileChange"
        />

        <div class="b64-actions">
          <el-button
            bg
            text
            size="large"
            :disabled="!result"
            @click="copyResult"
            >{{ t("copyResult") }}</el-button
          >
          <el-button
            bg
            text
            size="large"
            @click="clearAll"
            >{{ t("clear") }}</el-button
          >
        </div>

        <el-input
          v-model="result"
          type="textarea"
          :rows="6"
          :placeholder="t('resultPlaceholder')"
          readonly
        />
      </template>

      <!-- 解码：Base64 → 文件下载 -->
      <template v-else>
        <el-input
          v-model="text"
          type="textarea"
          :rows="6"
          :placeholder="t('base64InputPlaceholder')"
        />

        <div class="b64-actions">
          <el-button
            bg
            text
            size="large"
            :disabled="!text"
            @click="decodeFile"
            >{{ t("decode") }}</el-button
          >
          <el-button
            bg
            text
            size="large"
            @click="clearAll"
            >{{ t("clear") }}</el-button
          >
          <el-input
            v-model="customFilename"
            class="b64-filename"
            :placeholder="t('filenamePlaceholder')"
            clearable
            size="large"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { UploadFilled } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import {
  base64Decode,
  base64Encode,
  file2Base64,
  saveBase64ToFile,
  getBase64MimeType,
  mimeToExt,
} from "@tomiaa/utils"
import { copyToClipboard } from "@/utils"

type InputType = "text" | "image" | "file"
type Operation = "encode" | "decode"

const props = defineProps<{
  inputType: InputType
  operation: Operation
}>()

const { t } = useI18n({ useScope: "local" })

const text = ref("")
const result = ref("")
const isDragOver = ref(false)
const previewUrl = ref("")
const fileName = ref("")
const customFilename = ref("")

const imageInput = ref<HTMLInputElement>()
const fileInput = ref<HTMLInputElement>()

function clearAll() {
  text.value = ""
  result.value = ""
  previewUrl.value = ""
  fileName.value = ""
  customFilename.value = ""
}

async function copyResult() {
  if (!result.value) return
  await copyToClipboard(result.value)
  ElMessage.success(t("copySuccess"))
}

// ── 文字模式 ──────────────────────────────────────────────
async function handleAction() {
  try {
    if (props.operation === "encode") {
      result.value = await base64Encode(text.value)
    } else {
      result.value = await base64Decode(text.value)
    }
    await copyToClipboard(result.value)
    ElMessage.success(t("copySuccess"))
  } catch {
    result.value = t("errorMsg")
  }
}

// ── 图片编码 ──────────────────────────────────────────────
async function encodeImageFile(file: File) {
  const data = (await file2Base64(file)) as string
  result.value = data
  previewUrl.value = data
  await copyToClipboard(data)
  ElMessage.success(t("copySuccess"))
}

function onImageDrop(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) encodeImageFile(file)
}

function onImageFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) encodeImageFile(file)
}

// ── 图片解码 ──────────────────────────────────────────────
function decodeImage() {
  try {
    const src = text.value.trim()
    previewUrl.value = src.startsWith("data:")
      ? src
      : `data:image/png;base64,${src}`
  } catch {
    ElMessage.error(t("errorMsg"))
  }
}

function downloadImage() {
  const a = document.createElement("a")
  a.href = previewUrl.value
  const mime = getBase64MimeType(previewUrl.value)
  const ext = (mime && mimeToExt(mime)) || ".png"
  a.download = `decoded-image${ext}`
  a.click()
}

// ── 文件编码 ──────────────────────────────────────────────
async function encodeFile(file: File) {
  fileName.value = file.name
  const data = (await file2Base64(file)) as string
  result.value = data
  await copyToClipboard(data)
  ElMessage.success(t("copySuccess"))
}

function onFileDrop(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) encodeFile(file)
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) encodeFile(file)
}

// ── 文件解码 ──────────────────────────────────────────────
function decodeFile() {
  try {
    const mime = getBase64MimeType(text.value)
    if (customFilename.value) {
      saveBase64ToFile(text.value, customFilename.value)
    } else {
      const ext = mime && mimeToExt(mime)
      if (!ext) {
        ElMessage.error(t("noExtError"))
        return
      }
      saveBase64ToFile(text.value, `decoded-file${Date.now()}${ext}`)
    }
  } catch {
    ElMessage.error(t("decodeFileError"))
  }
}
</script>

<style lang="scss" scoped>
.b64-wrap {
  margin-top: 16px;
}

.b64-area {
  position: relative;

  :deep(.el-textarea__inner) {
    border: 1px dashed var(--el-border-color);
    box-shadow: none;
    background: transparent;
  }

  &.is-dragover :deep(.el-textarea__inner) {
    border: 2px dashed var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

.b64-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.b64-filename {
  width: 200px;
}

.b64-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  padding: 24px;
  color: var(--el-text-color-secondary);

  p {
    margin: 8px 0 0;
    font-size: 14px;
    word-break: break-all;
    text-align: center;
  }

  &:hover,
  &.is-dragover {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

.b64-upload-icon {
  font-size: 48px;
  color: var(--el-text-color-placeholder);
}

.b64-preview-img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.b64-image-result {
  margin-top: 16px;
  text-align: center;
}
</style>

<i18n lang="json">
{
  "zh-CN": {
    "textPlaceholder": "输入文本",
    "base64InputPlaceholder": "输入 Base64 字符串",
    "resultPlaceholder": "结果将显示在这里",
    "encode": "编码",
    "decode": "解码",
    "clear": "清空",
    "copyResult": "复制结果",
    "copySuccess": "复制成功",
    "downloadImage": "下载图片",
    "dropImageHint": "点击或拖拽图片到此处",
    "dropFileHint": "点击或拖拽文件到此处",
    "filenamePlaceholder": "自定义文件名（可选）",
    "errorMsg": "出错了，请检查输入内容",
    "noExtError": "无法识别文件类型，请手动填写文件名",
    "decodeFileError": "解码失败，请确认 Base64 格式正确"
  },
  "en": {
    "textPlaceholder": "Enter text",
    "base64InputPlaceholder": "Enter Base64 string",
    "resultPlaceholder": "Result will appear here",
    "encode": "Encode",
    "decode": "Decode",
    "clear": "Clear",
    "copyResult": "Copy Result",
    "copySuccess": "Copied!",
    "downloadImage": "Download Image",
    "dropImageHint": "Click or drag image here",
    "dropFileHint": "Click or drag file here",
    "filenamePlaceholder": "Custom filename (optional)",
    "errorMsg": "Error, please check your input",
    "noExtError": "Cannot detect file type, please enter filename manually",
    "decodeFileError": "Decode failed, please verify the Base64 format"
  },
  "zh-TW": {
    "textPlaceholder": "輸入文字",
    "base64InputPlaceholder": "輸入 Base64 字串",
    "resultPlaceholder": "結果將顯示在這裡",
    "encode": "編碼",
    "decode": "解碼",
    "clear": "清空",
    "copyResult": "複製結果",
    "copySuccess": "複製成功",
    "downloadImage": "下載圖片",
    "dropImageHint": "點擊或拖曳圖片到此處",
    "dropFileHint": "點擊或拖曳檔案到此處",
    "filenamePlaceholder": "自訂檔案名稱（可選）",
    "errorMsg": "出錯了，請檢查輸入內容",
    "noExtError": "無法識別檔案類型，請手動填寫檔案名稱",
    "decodeFileError": "解碼失敗，請確認 Base64 格式正確"
  },
  "ja": {
    "textPlaceholder": "テキストを入力",
    "base64InputPlaceholder": "Base64 文字列を入力",
    "resultPlaceholder": "結果はここに表示されます",
    "encode": "エンコード",
    "decode": "デコード",
    "clear": "クリア",
    "copyResult": "結果をコピー",
    "copySuccess": "コピーしました",
    "downloadImage": "画像をダウンロード",
    "dropImageHint": "クリックまたは画像をここにドラッグ",
    "dropFileHint": "クリックまたはファイルをここにドラッグ",
    "filenamePlaceholder": "ファイル名（任意）",
    "errorMsg": "エラーが発生しました。入力内容を確認してください",
    "noExtError": "ファイル形式を検出できません。ファイル名を手動で入力してください",
    "decodeFileError": "デコード失敗。Base64 形式を確認してください"
  },
  "ko": {
    "textPlaceholder": "텍스트 입력",
    "base64InputPlaceholder": "Base64 문자열 입력",
    "resultPlaceholder": "결과가 여기에 표시됩니다",
    "encode": "인코딩",
    "decode": "디코딩",
    "clear": "지우기",
    "copyResult": "결과 복사",
    "copySuccess": "복사 완료",
    "downloadImage": "이미지 다운로드",
    "dropImageHint": "클릭하거나 이미지를 여기에 드래그하세요",
    "dropFileHint": "클릭하거나 파일을 여기에 드래그하세요",
    "filenamePlaceholder": "파일명 (선택)",
    "errorMsg": "오류 발생, 입력 내용을 확인하세요",
    "noExtError": "파일 형식을 감지할 수 없습니다. 파일명을 직접 입력하세요",
    "decodeFileError": "디코딩 실패, Base64 형식을 확인하세요"
  },
  "fr": {
    "textPlaceholder": "Entrez le texte",
    "base64InputPlaceholder": "Entrez la chaîne Base64",
    "resultPlaceholder": "Le résultat s'affichera ici",
    "encode": "Encoder",
    "decode": "Décoder",
    "clear": "Effacer",
    "copyResult": "Copier le résultat",
    "copySuccess": "Copié !",
    "downloadImage": "Télécharger l'image",
    "dropImageHint": "Cliquez ou déposez une image ici",
    "dropFileHint": "Cliquez ou déposez un fichier ici",
    "filenamePlaceholder": "Nom de fichier personnalisé (optionnel)",
    "errorMsg": "Erreur, veuillez vérifier votre saisie",
    "noExtError": "Type de fichier non détecté, veuillez saisir le nom manuellement",
    "decodeFileError": "Échec du décodage, vérifiez le format Base64"
  },
  "de": {
    "textPlaceholder": "Text eingeben",
    "base64InputPlaceholder": "Base64-String eingeben",
    "resultPlaceholder": "Ergebnis erscheint hier",
    "encode": "Kodieren",
    "decode": "Dekodieren",
    "clear": "Leeren",
    "copyResult": "Ergebnis kopieren",
    "copySuccess": "Kopiert!",
    "downloadImage": "Bild herunterladen",
    "dropImageHint": "Klicken oder Bild hier ablegen",
    "dropFileHint": "Klicken oder Datei hier ablegen",
    "filenamePlaceholder": "Benutzerdefinierter Dateiname (optional)",
    "errorMsg": "Fehler, bitte Eingabe prüfen",
    "noExtError": "Dateityp nicht erkannt, bitte Dateinamen manuell eingeben",
    "decodeFileError": "Dekodierung fehlgeschlagen, Base64-Format prüfen"
  },
  "es": {
    "textPlaceholder": "Ingrese texto",
    "base64InputPlaceholder": "Ingrese cadena Base64",
    "resultPlaceholder": "El resultado aparecerá aquí",
    "encode": "Codificar",
    "decode": "Decodificar",
    "clear": "Limpiar",
    "copyResult": "Copiar resultado",
    "copySuccess": "¡Copiado!",
    "downloadImage": "Descargar imagen",
    "dropImageHint": "Haga clic o arrastre una imagen aquí",
    "dropFileHint": "Haga clic o arrastre un archivo aquí",
    "filenamePlaceholder": "Nombre de archivo personalizado (opcional)",
    "errorMsg": "Error, verifique la entrada",
    "noExtError": "No se puede detectar el tipo de archivo, ingrese el nombre manualmente",
    "decodeFileError": "Error al decodificar, verifique el formato Base64"
  },
  "pt": {
    "textPlaceholder": "Insira o texto",
    "base64InputPlaceholder": "Insira a string Base64",
    "resultPlaceholder": "O resultado aparecerá aqui",
    "encode": "Codificar",
    "decode": "Decodificar",
    "clear": "Limpar",
    "copyResult": "Copiar resultado",
    "copySuccess": "Copiado!",
    "downloadImage": "Baixar imagem",
    "dropImageHint": "Clique ou arraste uma imagem aqui",
    "dropFileHint": "Clique ou arraste um arquivo aqui",
    "filenamePlaceholder": "Nome de arquivo personalizado (opcional)",
    "errorMsg": "Erro, verifique a entrada",
    "noExtError": "Tipo de arquivo não detectado, insira o nome manualmente",
    "decodeFileError": "Falha na decodificação, verifique o formato Base64"
  },
  "ru": {
    "textPlaceholder": "Введите текст",
    "base64InputPlaceholder": "Введите строку Base64",
    "resultPlaceholder": "Результат появится здесь",
    "encode": "Кодировать",
    "decode": "Декодировать",
    "clear": "Очистить",
    "copyResult": "Копировать результат",
    "copySuccess": "Скопировано!",
    "downloadImage": "Скачать изображение",
    "dropImageHint": "Нажмите или перетащите изображение сюда",
    "dropFileHint": "Нажмите или перетащите файл сюда",
    "filenamePlaceholder": "Имя файла (необязательно)",
    "errorMsg": "Ошибка, проверьте введённые данные",
    "noExtError": "Тип файла не определён, введите имя файла вручную",
    "decodeFileError": "Ошибка декодирования, проверьте формат Base64"
  },
  "ar": {
    "textPlaceholder": "أدخل النص",
    "base64InputPlaceholder": "أدخل سلسلة Base64",
    "resultPlaceholder": "ستظهر النتيجة هنا",
    "encode": "تشفير",
    "decode": "فك التشفير",
    "clear": "مسح",
    "copyResult": "نسخ النتيجة",
    "copySuccess": "تم النسخ!",
    "downloadImage": "تنزيل الصورة",
    "dropImageHint": "انقر أو اسحب صورة هنا",
    "dropFileHint": "انقر أو اسحب ملفًا هنا",
    "filenamePlaceholder": "اسم الملف المخصص (اختياري)",
    "errorMsg": "خطأ، يرجى التحقق من المدخلات",
    "noExtError": "تعذّر تحديد نوع الملف، يرجى إدخال الاسم يدويًا",
    "decodeFileError": "فشل فك التشفير، يرجى التحقق من تنسيق Base64"
  },
  "hi": {
    "textPlaceholder": "टेक्स्ट दर्ज करें",
    "base64InputPlaceholder": "Base64 स्ट्रिंग दर्ज करें",
    "resultPlaceholder": "परिणाम यहाँ दिखाई देगा",
    "encode": "एन्कोड",
    "decode": "डीकोड",
    "clear": "साफ़ करें",
    "copyResult": "परिणाम कॉपी करें",
    "copySuccess": "कॉपी हो गया!",
    "downloadImage": "छवि डाउनलोड करें",
    "dropImageHint": "यहाँ क्लिक करें या छवि खींचें",
    "dropFileHint": "यहाँ क्लिक करें या फ़ाइल खींचें",
    "filenamePlaceholder": "कस्टम फ़ाइल नाम (वैकल्पिक)",
    "errorMsg": "त्रुटि, कृपया इनपुट जाँचें",
    "noExtError": "फ़ाइल प्रकार का पता नहीं चला, कृपया मैन्युअल रूप से नाम दर्ज करें",
    "decodeFileError": "डीकोड विफल, कृपया Base64 प्रारूप सत्यापित करें"
  },
  "it": {
    "textPlaceholder": "Inserisci testo",
    "base64InputPlaceholder": "Inserisci stringa Base64",
    "resultPlaceholder": "Il risultato apparirà qui",
    "encode": "Codifica",
    "decode": "Decodifica",
    "clear": "Cancella",
    "copyResult": "Copia risultato",
    "copySuccess": "Copiato!",
    "downloadImage": "Scarica immagine",
    "dropImageHint": "Clicca o trascina un'immagine qui",
    "dropFileHint": "Clicca o trascina un file qui",
    "filenamePlaceholder": "Nome file personalizzato (opzionale)",
    "errorMsg": "Errore, controlla l'input",
    "noExtError": "Tipo di file non rilevato, inserisci il nome manualmente",
    "decodeFileError": "Decodifica fallita, verifica il formato Base64"
  },
  "nl": {
    "textPlaceholder": "Voer tekst in",
    "base64InputPlaceholder": "Voer Base64-string in",
    "resultPlaceholder": "Het resultaat verschijnt hier",
    "encode": "Coderen",
    "decode": "Decoderen",
    "clear": "Wissen",
    "copyResult": "Resultaat kopiëren",
    "copySuccess": "Gekopieerd!",
    "downloadImage": "Afbeelding downloaden",
    "dropImageHint": "Klik of sleep een afbeelding hier naartoe",
    "dropFileHint": "Klik of sleep een bestand hier naartoe",
    "filenamePlaceholder": "Aangepaste bestandsnaam (optioneel)",
    "errorMsg": "Fout, controleer de invoer",
    "noExtError": "Bestandstype niet herkend, voer de naam handmatig in",
    "decodeFileError": "Decodering mislukt, controleer het Base64-formaat"
  },
  "tr": {
    "textPlaceholder": "Metin girin",
    "base64InputPlaceholder": "Base64 dizisi girin",
    "resultPlaceholder": "Sonuç burada görünecek",
    "encode": "Kodla",
    "decode": "Kodu Çöz",
    "clear": "Temizle",
    "copyResult": "Sonucu Kopyala",
    "copySuccess": "Kopyalandı!",
    "downloadImage": "Resmi İndir",
    "dropImageHint": "Tıklayın veya resmi buraya sürükleyin",
    "dropFileHint": "Tıklayın veya dosyayı buraya sürükleyin",
    "filenamePlaceholder": "Özel dosya adı (isteğe bağlı)",
    "errorMsg": "Hata, lütfen girişi kontrol edin",
    "noExtError": "Dosya türü algılanamadı, lütfen adı manuel olarak girin",
    "decodeFileError": "Kod çözme başarısız, Base64 formatını kontrol edin"
  },
  "vi": {
    "textPlaceholder": "Nhập văn bản",
    "base64InputPlaceholder": "Nhập chuỗi Base64",
    "resultPlaceholder": "Kết quả sẽ hiển thị ở đây",
    "encode": "Mã hóa",
    "decode": "Giải mã",
    "clear": "Xóa",
    "copyResult": "Sao chép kết quả",
    "copySuccess": "Đã sao chép!",
    "downloadImage": "Tải ảnh xuống",
    "dropImageHint": "Nhấp hoặc kéo ảnh vào đây",
    "dropFileHint": "Nhấp hoặc kéo tệp vào đây",
    "filenamePlaceholder": "Tên tệp tùy chỉnh (tùy chọn)",
    "errorMsg": "Lỗi, vui lòng kiểm tra đầu vào",
    "noExtError": "Không thể nhận dạng loại tệp, vui lòng nhập tên thủ công",
    "decodeFileError": "Giải mã thất bại, vui lòng kiểm tra định dạng Base64"
  },
  "th": {
    "textPlaceholder": "ป้อนข้อความ",
    "base64InputPlaceholder": "ป้อนสตริง Base64",
    "resultPlaceholder": "ผลลัพธ์จะแสดงที่นี่",
    "encode": "เข้ารหัส",
    "decode": "ถอดรหัส",
    "clear": "ล้าง",
    "copyResult": "คัดลอกผลลัพธ์",
    "copySuccess": "คัดลอกแล้ว!",
    "downloadImage": "ดาวน์โหลดรูปภาพ",
    "dropImageHint": "คลิกหรือลากรูปภาพมาที่นี่",
    "dropFileHint": "คลิกหรือลากไฟล์มาที่นี่",
    "filenamePlaceholder": "ชื่อไฟล์กำหนดเอง (ไม่บังคับ)",
    "errorMsg": "เกิดข้อผิดพลาด โปรดตรวจสอบข้อมูลที่ป้อน",
    "noExtError": "ไม่สามารถระบุประเภทไฟล์ โปรดป้อนชื่อไฟล์ด้วยตนเอง",
    "decodeFileError": "ถอดรหัสล้มเหลว โปรดตรวจสอบรูปแบบ Base64"
  },
  "id": {
    "textPlaceholder": "Masukkan teks",
    "base64InputPlaceholder": "Masukkan string Base64",
    "resultPlaceholder": "Hasil akan muncul di sini",
    "encode": "Enkode",
    "decode": "Dekode",
    "clear": "Hapus",
    "copyResult": "Salin Hasil",
    "copySuccess": "Disalin!",
    "downloadImage": "Unduh Gambar",
    "dropImageHint": "Klik atau seret gambar ke sini",
    "dropFileHint": "Klik atau seret file ke sini",
    "filenamePlaceholder": "Nama file kustom (opsional)",
    "errorMsg": "Error, periksa input Anda",
    "noExtError": "Jenis file tidak terdeteksi, masukkan nama file secara manual",
    "decodeFileError": "Dekode gagal, periksa format Base64"
  },
  "pl": {
    "textPlaceholder": "Wprowadź tekst",
    "base64InputPlaceholder": "Wprowadź ciąg Base64",
    "resultPlaceholder": "Wynik pojawi się tutaj",
    "encode": "Koduj",
    "decode": "Dekoduj",
    "clear": "Wyczyść",
    "copyResult": "Kopiuj wynik",
    "copySuccess": "Skopiowano!",
    "downloadImage": "Pobierz obraz",
    "dropImageHint": "Kliknij lub przeciągnij obraz tutaj",
    "dropFileHint": "Kliknij lub przeciągnij plik tutaj",
    "filenamePlaceholder": "Niestandardowa nazwa pliku (opcjonalna)",
    "errorMsg": "Błąd, sprawdź dane wejściowe",
    "noExtError": "Nie można wykryć typu pliku, wprowadź nazwę ręcznie",
    "decodeFileError": "Dekodowanie nie powiodło się, sprawdź format Base64"
  },
  "sv": {
    "textPlaceholder": "Ange text",
    "base64InputPlaceholder": "Ange Base64-sträng",
    "resultPlaceholder": "Resultatet visas här",
    "encode": "Koda",
    "decode": "Avkoda",
    "clear": "Rensa",
    "copyResult": "Kopiera resultat",
    "copySuccess": "Kopierat!",
    "downloadImage": "Ladda ned bild",
    "dropImageHint": "Klicka eller dra en bild hit",
    "dropFileHint": "Klicka eller dra en fil hit",
    "filenamePlaceholder": "Anpassat filnamn (valfritt)",
    "errorMsg": "Fel, kontrollera inmatningen",
    "noExtError": "Filtyp kan inte identifieras, ange filnamn manuellt",
    "decodeFileError": "Avkodning misslyckades, kontrollera Base64-formatet"
  }
}
</i18n>
