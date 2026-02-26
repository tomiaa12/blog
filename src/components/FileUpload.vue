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
          <p class="file-upload-overlay__title">松手即可，文件立即添加</p>
          <p class="file-upload-overlay__sub">
            支持多文件与文件夹，文件夹将自动扁平化
          </p>
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
      <p class="file-upload__desc">
        拖拽文件或文件夹到网页窗口，或点击下方按钮选择
      </p>
      <div
        class="file-upload__actions"
        @click.stop
      >
        <el-button
          type="primary"
          @click="triggerFileSelect"
        >
          <el-icon><Document /></el-icon>
          &nbsp;选择文件
        </el-button>
        <el-button
          type="primary"
          @click="triggerFolderSelect"
        >
          <el-icon><FolderOpened /></el-icon>
          &nbsp;选择文件夹
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
      &nbsp;选择文件
    </el-button>
    <el-button
      type="primary"
      @click="triggerFolderSelect"
    >
      <el-icon><FolderOpened /></el-icon>
      &nbsp;选择文件夹
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { Upload, Document, FolderOpened } from "@element-plus/icons-vue"

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
