<template>
  <!-- 全屏拖拽遮罩：拖入浏览器窗口时显示 -->
  <Teleport to="body">
    <Transition name="file-upload-fade">
      <div
        v-if="isMounted && isDragging"
        class="file-upload-overlay"
      >
        <div class="file-upload-overlay__card">
          <el-icon class="file-upload-overlay__icon"><Upload /></el-icon>
          <p class="file-upload-overlay__title">{{ t("overlayTitle") }}</p>
          <p class="file-upload-overlay__sub">{{ t("overlaySub") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 隐藏的文件 input（全局，两种模式共用） -->
  <input
    ref="fileInputRef"
    type="file"
    multiple
    :accept="props.accept"
    class="file-upload__hidden-input"
    @change="onFileChange"
  />
  <!-- 隐藏的文件夹 input（webkitdirectory 在 onMounted 中设置） -->
  <input
    ref="folderInputRef"
    type="file"
    multiple
    :accept="props.accept"
    class="file-upload__hidden-input"
    @change="onFolderChange"
  />

  <!-- 上传区域模式 -->
  <div
    v-if="type === 'area'"
    class="file-upload"
    :class="{ 'is-hover': isHover }"
    @click="triggerFileSelect"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div class="file-upload__body">
      <el-icon class="file-upload__icon"><Upload /></el-icon>
      <p class="file-upload__desc">{{ t("areaDesc") }}</p>
      <div
        class="file-upload__actions"
        @click.stop
      >
        <el-button
          type="primary"
          @click="triggerFileSelect"
        >
          <el-icon><Document /></el-icon>
          &nbsp;{{ t("selectFiles") }}
        </el-button>
        <el-button
          type="primary"
          @click="triggerFolderSelect"
        >
          <el-icon><FolderOpened /></el-icon>
          &nbsp;{{ t("selectFolder") }}
        </el-button>
      </div>
    </div>
  </div>

  <!-- 纯按钮模式 -->
  <div
    v-else-if="type === 'button'"
    class="file-upload-buttons"
  >
    <el-button
      type="primary"
      @click="triggerFileSelect"
    >
      <el-icon><Document /></el-icon>
      &nbsp;{{ t("selectFiles") }}
    </el-button>
    <el-button
      type="primary"
      @click="triggerFolderSelect"
    >
      <el-icon><FolderOpened /></el-icon>
      &nbsp;{{ t("selectFolder") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { Upload, Document, FolderOpened } from "@element-plus/icons-vue"

const { t } = useI18n({ useScope: "local" })

const props = withDefaults(
  defineProps<{
    /** area：上传区域模式（默认）；button：纯按钮模式 */
    type?: "area" | "button"
    /**
     * 允许的文件类型，透传给 input[accept]。
     * 支持扩展名（如 ".mp3,.wav"）或 MIME 类型（如 "audio/*"）。
     * 不传则不限制。
     */
    accept?: string
  }>(),
  { type: "area" }
)

const emit = defineEmits<{
  "files-added": [files: File[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isHover = ref(false)
const isMounted = ref(false)

let dragCounter = 0

// ── 触发文件选择 ──────────────────────────────────────────

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function triggerFolderSelect() {
  folderInputRef.value?.click()
}

// ── input change 处理 ─────────────────────────────────────

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  emitFiles(Array.from(input.files))
  input.value = ""
}

function onFolderChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  emitFiles(Array.from(input.files))
  input.value = ""
}

function emitFiles(files: File[]) {
  if (files.length > 0) emit("files-added", files)
}

// ── document 级别拖拽事件 ─────────────────────────────────

function onDragEnter(e: DragEvent) {
  e.preventDefault()
  dragCounter++
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  dragCounter--
  if (dragCounter <= 0) {
    dragCounter = 0
    isDragging.value = false
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  dragCounter = 0
  isDragging.value = false

  const items = e.dataTransfer?.items
  if (!items?.length) return

  const files = await collectFilesFromItems(Array.from(items))
  emitFiles(files)
}

// ── 文件夹扁平化：FileSystem API ──────────────────────────

async function collectFilesFromItems(
  items: DataTransferItem[]
): Promise<File[]> {
  const files: File[] = []
  for (const item of items) {
    const entry = item.webkitGetAsEntry()
    if (entry) await traverseEntry(entry, files)
  }
  return files
}

async function traverseEntry(
  entry: FileSystemEntry,
  files: File[]
): Promise<void> {
  if (entry.isFile) {
    const file = await entryToFile(entry as FileSystemFileEntry)
    if (file) files.push(file)
  } else if (entry.isDirectory) {
    const children = await readDirEntries(entry as FileSystemDirectoryEntry)
    for (const child of children) {
      await traverseEntry(child, files)
    }
  }
}

function entryToFile(entry: FileSystemFileEntry): Promise<File | null> {
  return new Promise(resolve => entry.file(resolve, () => resolve(null)))
}

function readDirEntries(
  dir: FileSystemDirectoryEntry
): Promise<FileSystemEntry[]> {
  return new Promise(resolve => {
    const reader = dir.createReader()
    const all: FileSystemEntry[] = []
    const readNext = () => {
      reader.readEntries(
        entries => {
          if (!entries.length) {
            resolve(all)
          } else {
            all.push(...entries)
            readNext()
          }
        },
        () => resolve(all)
      )
    }
    readNext()
  })
}

// ── 生命周期 ──────────────────────────────────────────────

onMounted(() => {
  isMounted.value = true

  // webkitdirectory 不是标准 HTML 属性，通过 ref 设置
  folderInputRef.value?.setAttribute("webkitdirectory", "")

  document.addEventListener("dragenter", onDragEnter)
  document.addEventListener("dragleave", onDragLeave)
  document.addEventListener("dragover", onDragOver)
  document.addEventListener("drop", onDrop)
})

onUnmounted(() => {
  document.removeEventListener("dragenter", onDragEnter)
  document.removeEventListener("dragleave", onDragLeave)
  document.removeEventListener("dragover", onDragOver)
  document.removeEventListener("drop", onDrop)
})
</script>

<style scoped>
/* ── 上传框 ─────────────────────────────────────────────── */

.file-upload {
  position: relative;
  width: 100%;
  height: 250px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.25s, background-color 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.file-upload.is-hover,
.file-upload:hover {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.file-upload__hidden-input {
  display: none;
}

.file-upload__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.file-upload__icon {
  font-size: 40px;
  color: var(--el-color-primary);
}

.file-upload__desc {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: center;
  line-height: 1.5;
}

.file-upload__actions {
  display: flex;
  gap: 10px;
  pointer-events: all;
}

/* ── 纯按钮模式 ──────────────────────────────────────────── */

.file-upload-buttons {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

/* ── 全屏拖拽遮罩 ────────────────────────────────────────── */

.file-upload-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.file-upload-overlay__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 48px 64px;
  min-width: 50%;
  min-height: 30%;
  border: 2px dashed rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
}

.file-upload-overlay__icon {
  font-size: 56px;
  color: #fff;
}

.file-upload-overlay__title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
}

.file-upload-overlay__sub {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

/* ── 遮罩动画 ────────────────────────────────────────────── */

.file-upload-fade-enter-active,
.file-upload-fade-leave-active {
  transition: opacity 0.2s ease;
}

.file-upload-fade-enter-from,
.file-upload-fade-leave-to {
  opacity: 0;
}
</style>

<i18n lang="json">
{
  "zh-CN": {
    "overlayTitle": "松手即可，文件立即添加",
    "overlaySub": "支持多文件与文件夹，文件夹将自动扁平化",
    "areaDesc": "拖拽文件或文件夹到网页窗口，或点击下方按钮选择",
    "selectFiles": "选择文件",
    "selectFolder": "选择文件夹"
  },
  "en": {
    "overlayTitle": "Release to add files instantly",
    "overlaySub": "Supports multiple files and folders; folders will be flattened automatically",
    "areaDesc": "Drag files or folders to the browser window, or click the buttons below",
    "selectFiles": "Select Files",
    "selectFolder": "Select Folder"
  },
  "zh-TW": {
    "overlayTitle": "放開即可，立即新增檔案",
    "overlaySub": "支援多個檔案與資料夾，資料夾將自動展平",
    "areaDesc": "拖曳檔案或資料夾到網頁視窗，或點擊下方按鈕選擇",
    "selectFiles": "選擇檔案",
    "selectFolder": "選擇資料夾"
  },
  "ja": {
    "overlayTitle": "離すと即座にファイルを追加",
    "overlaySub": "複数のファイルとフォルダに対応、フォルダは自動でフラット化",
    "areaDesc": "ファイルまたはフォルダをブラウザウィンドウにドラッグするか、下のボタンで選択",
    "selectFiles": "ファイルを選択",
    "selectFolder": "フォルダを選択"
  },
  "ko": {
    "overlayTitle": "놓으면 즉시 파일 추가",
    "overlaySub": "다중 파일 및 폴더 지원, 폴더는 자동으로 평탄화됩니다",
    "areaDesc": "파일이나 폴더를 브라우저 창에 드래그하거나 아래 버튼을 클릭하여 선택",
    "selectFiles": "파일 선택",
    "selectFolder": "폴더 선택"
  },
  "fr": {
    "overlayTitle": "Relâchez pour ajouter les fichiers",
    "overlaySub": "Prend en charge plusieurs fichiers et dossiers, les dossiers seront aplatis automatiquement",
    "areaDesc": "Glissez des fichiers ou dossiers dans la fenêtre, ou cliquez sur les boutons ci-dessous",
    "selectFiles": "Choisir des fichiers",
    "selectFolder": "Choisir un dossier"
  },
  "de": {
    "overlayTitle": "Loslassen zum Hinzufügen der Dateien",
    "overlaySub": "Unterstützt mehrere Dateien und Ordner; Ordner werden automatisch vereinfacht",
    "areaDesc": "Dateien oder Ordner ins Browserfenster ziehen oder Schaltflächen unten verwenden",
    "selectFiles": "Dateien auswählen",
    "selectFolder": "Ordner auswählen"
  },
  "es": {
    "overlayTitle": "Suelta para agregar archivos al instante",
    "overlaySub": "Compatible con múltiples archivos y carpetas; las carpetas se aplanarán automáticamente",
    "areaDesc": "Arrastra archivos o carpetas a la ventana del navegador, o usa los botones de abajo",
    "selectFiles": "Seleccionar archivos",
    "selectFolder": "Seleccionar carpeta"
  },
  "pt": {
    "overlayTitle": "Solte para adicionar arquivos",
    "overlaySub": "Suporta múltiplos arquivos e pastas; as pastas serão achatadas automaticamente",
    "areaDesc": "Arraste arquivos ou pastas para a janela do navegador, ou use os botões abaixo",
    "selectFiles": "Selecionar arquivos",
    "selectFolder": "Selecionar pasta"
  },
  "ru": {
    "overlayTitle": "Отпустите для добавления файлов",
    "overlaySub": "Поддерживаются несколько файлов и папок; папки будут автоматически развёрнуты",
    "areaDesc": "Перетащите файлы или папки в окно браузера или нажмите кнопки ниже",
    "selectFiles": "Выбрать файлы",
    "selectFolder": "Выбрать папку"
  },
  "ar": {
    "overlayTitle": "أفلت لإضافة الملفات فوراً",
    "overlaySub": "يدعم ملفات ومجلدات متعددة، وستُسوّى المجلدات تلقائياً",
    "areaDesc": "اسحب الملفات أو المجلدات إلى نافذة المتصفح، أو انقر على الأزرار أدناه",
    "selectFiles": "اختر الملفات",
    "selectFolder": "اختر مجلداً"
  },
  "hi": {
    "overlayTitle": "फ़ाइलें तुरंत जोड़ने के लिए छोड़ें",
    "overlaySub": "एकाधिक फ़ाइलें और फ़ोल्डर समर्थित हैं, फ़ोल्डर स्वचालित रूप से समतल होंगे",
    "areaDesc": "फ़ाइलें या फ़ोल्डर ब्राउज़र विंडो में खींचें, या नीचे के बटन पर क्लिक करें",
    "selectFiles": "फ़ाइलें चुनें",
    "selectFolder": "फ़ोल्डर चुनें"
  },
  "it": {
    "overlayTitle": "Rilascia per aggiungere i file",
    "overlaySub": "Supporta più file e cartelle; le cartelle verranno appiattite automaticamente",
    "areaDesc": "Trascina file o cartelle nella finestra del browser, oppure usa i pulsanti qui sotto",
    "selectFiles": "Seleziona file",
    "selectFolder": "Seleziona cartella"
  },
  "nl": {
    "overlayTitle": "Loslaten om bestanden toe te voegen",
    "overlaySub": "Ondersteunt meerdere bestanden en mappen; mappen worden automatisch afgevlakt",
    "areaDesc": "Sleep bestanden of mappen naar het browservenster, of gebruik de knoppen hieronder",
    "selectFiles": "Bestanden selecteren",
    "selectFolder": "Map selecteren"
  },
  "tr": {
    "overlayTitle": "Dosyaları anında eklemek için bırakın",
    "overlaySub": "Birden fazla dosya ve klasörü destekler; klasörler otomatik olarak düzleştirilir",
    "areaDesc": "Dosyaları veya klasörleri tarayıcı penceresine sürükleyin ya da aşağıdaki düğmeleri kullanın",
    "selectFiles": "Dosyaları seç",
    "selectFolder": "Klasörü seç"
  },
  "vi": {
    "overlayTitle": "Thả ra để thêm tệp ngay lập tức",
    "overlaySub": "Hỗ trợ nhiều tệp và thư mục; thư mục sẽ được làm phẳng tự động",
    "areaDesc": "Kéo tệp hoặc thư mục vào cửa sổ trình duyệt, hoặc nhấn các nút bên dưới",
    "selectFiles": "Chọn tệp",
    "selectFolder": "Chọn thư mục"
  },
  "th": {
    "overlayTitle": "ปล่อยเพื่อเพิ่มไฟล์ทันที",
    "overlaySub": "รองรับหลายไฟล์และโฟลเดอร์ โฟลเดอร์จะถูกทำให้แบนโดยอัตโนมัติ",
    "areaDesc": "ลากไฟล์หรือโฟลเดอร์ไปที่หน้าต่างเบราว์เซอร์ หรือคลิกปุ่มด้านล่าง",
    "selectFiles": "เลือกไฟล์",
    "selectFolder": "เลือกโฟลเดอร์"
  },
  "id": {
    "overlayTitle": "Lepaskan untuk menambahkan file seketika",
    "overlaySub": "Mendukung banyak file dan folder; folder akan diratakan secara otomatis",
    "areaDesc": "Seret file atau folder ke jendela browser, atau klik tombol di bawah",
    "selectFiles": "Pilih File",
    "selectFolder": "Pilih Folder"
  },
  "pl": {
    "overlayTitle": "Puść, aby natychmiast dodać pliki",
    "overlaySub": "Obsługuje wiele plików i folderów; foldery zostaną automatycznie spłaszczone",
    "areaDesc": "Przeciągnij pliki lub foldery do okna przeglądarki lub skorzystaj z przycisków poniżej",
    "selectFiles": "Wybierz pliki",
    "selectFolder": "Wybierz folder"
  },
  "sv": {
    "overlayTitle": "Släpp för att lägga till filer direkt",
    "overlaySub": "Stöder flera filer och mappar; mappar plattas automatiskt ut",
    "areaDesc": "Dra filer eller mappar till webbläsarfönstret, eller använd knapparna nedan",
    "selectFiles": "Välj filer",
    "selectFolder": "Välj mapp"
  }
}
</i18n>
