<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import JSZip from "jszip"
import FileUpload from "@/components/FileUpload.vue"
import { getImageCompression } from "./loadCompress"

const { t } = useI18n()

type OutType = "keep" | "jpeg" | "webp" | "png"

type Item = {
  id: number
  file: File
  url: string
  name: string
  bytes: number
  w: number
  h: number
  outBlob: Blob | null
  outName: string
  outBytes: number
  progress: number
  error: boolean
}

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"

const MB_PRESETS = [0.2, 0.5, 1, 2, 5]
const EDGE_PRESETS = [1280, 1920, 2560, 3840]

const items = ref<Item[]>([])
const activeId = ref(0)
const maxMB = ref(1)
const maxEdge = ref(0)
const outType = ref<OutType>("keep")
const quality = ref(0.8)
const keepRes = ref(false)
const preserveExif = ref(false)
const running = ref(false)
const loadingLib = ref(false)

let idSeq = 1

const active = computed(
  () => items.value.find(i => i.id === activeId.value) ?? items.value[0] ?? null
)
const needQuality = computed(() => outType.value !== "png")
const readyCount = computed(() => items.value.filter(i => i.outBlob).length)

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true
  return /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)
}

function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "") || "image"
}

function srcExt(file: File) {
  const m = file.name.match(/\.([^.]+)$/)
  if (m) return m[1]!.toLowerCase()
  if (file.type === "image/jpeg") return "jpg"
  if (file.type === "image/png") return "png"
  if (file.type === "image/webp") return "webp"
  return "jpg"
}

function outExt(file: File) {
  if (outType.value === "jpeg") return "jpg"
  if (outType.value === "webp") return "webp"
  if (outType.value === "png") return "png"
  const ext = srcExt(file)
  return ext === "jpeg" ? "jpg" : ext
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function saveRatio(item: Item) {
  if (!item.outBytes || !item.bytes) return ""
  const p = Math.round((1 - item.outBytes / item.bytes) * 100)
  return p > 0 ? `-${p}%` : p < 0 ? `+${-p}%` : "0%"
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("img"))
    img.src = url
  })
}

function saveBlob(blob: Blob, name: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

async function addFiles(files: File[]) {
  const list = files.filter(isImageFile)
  if (!list.length) {
    ElMessage({ message: t("msgNotImage"), type: "warning" })
    return
  }
  for (const file of list) {
    const url = URL.createObjectURL(file)
    try {
      const img = await loadImage(url)
      const item: Item = {
        id: idSeq++,
        file,
        url,
        name: file.name,
        bytes: file.size,
        w: img.naturalWidth,
        h: img.naturalHeight,
        outBlob: null,
        outName: "",
        outBytes: 0,
        progress: 0,
        error: false,
      }
      items.value.push(item)
      if (!activeId.value) activeId.value = item.id
    } catch {
      URL.revokeObjectURL(url)
    }
  }
  if (!items.value.length) ElMessage({ message: t("msgFail"), type: "error" })
}

function removeItem(id: number) {
  const idx = items.value.findIndex(i => i.id === id)
  if (idx < 0) return
  URL.revokeObjectURL(items.value[idx]!.url)
  items.value.splice(idx, 1)
  if (activeId.value === id) activeId.value = items.value[0]?.id ?? 0
}

function reset() {
  for (const item of items.value) URL.revokeObjectURL(item.url)
  items.value = []
  activeId.value = 0
}

function clearResults() {
  for (const item of items.value) {
    item.outBlob = null
    item.outName = ""
    item.outBytes = 0
    item.progress = 0
    item.error = false
  }
}

async function compressOne(item: Item, fn: Awaited<ReturnType<typeof getImageCompression>>) {
  item.progress = 0
  item.error = false
  item.outBlob = null
  item.outBytes = 0
  const opts: Parameters<typeof fn.fn>[1] = {
    maxSizeMB: Math.max(0.05, maxMB.value),
    useWebWorker: true,
    libURL: fn.url,
    initialQuality: quality.value,
    alwaysKeepResolution: keepRes.value,
    preserveExif: preserveExif.value,
    onProgress: p => {
      item.progress = Math.max(0, Math.min(100, p))
    },
  }
  if (maxEdge.value > 0 && !keepRes.value) opts.maxWidthOrHeight = maxEdge.value
  if (outType.value !== "keep") {
    opts.fileType =
      outType.value === "jpeg"
        ? "image/jpeg"
        : outType.value === "webp"
          ? "image/webp"
          : "image/png"
  }
  const out = await fn.fn(item.file, opts)
  item.outBlob = out
  item.outBytes = out.size
  item.outName = `${baseName(item.name)}.${outExt(item.file)}`
  item.progress = 100
}

async function run() {
  if (!items.value.length || running.value) return
  running.value = true
  loadingLib.value = true
  try {
    const lib = await getImageCompression()
    loadingLib.value = false
    for (const item of items.value) {
      try {
        await compressOne(item, lib)
      } catch {
        item.error = true
        item.progress = 0
      }
    }
    if (!readyCount.value) ElMessage({ message: t("msgFail"), type: "error" })
  } catch {
    loadingLib.value = false
    ElMessage({ message: t("msgLib"), type: "error" })
  } finally {
    running.value = false
  }
}

function downloadOne(item: Item) {
  if (!item.outBlob) return
  saveBlob(item.outBlob, item.outName || `${baseName(item.name)}.${outExt(item.file)}`)
}

async function downloadAll() {
  const ready = items.value.filter(i => i.outBlob)
  if (!ready.length) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  if (ready.length === 1) {
    downloadOne(ready[0]!)
    return
  }
  const zip = new JSZip()
  const used = new Map<string, number>()
  for (const item of ready) {
    let name = item.outName || `${baseName(item.name)}.${outExt(item.file)}`
    const n = (used.get(name) ?? 0) + 1
    used.set(name, n)
    if (n > 1) name = `${baseName(item.name)}-${n}.${outExt(item.file)}`
    zip.file(name, item.outBlob!)
  }
  saveBlob(await zip.generateAsync({ type: "blob" }), "compressed-images.zip")
}

onUnmounted(reset)
</script>

<template>
  <div class="cp-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <FileUpload
      v-if="!items.length"
      :accept="ACCEPT"
      @files-added="addFiles"
    />

    <template v-else>
      <div class="toolbar">
        <FileUpload
          type="button"
          :accept="ACCEPT"
          @files-added="addFiles"
        />
        <el-button @click="reset">{{ t("reselect") }}</el-button>
        <el-button
          type="primary"
          :loading="running"
          @click="run"
        >
          {{ t("run") }}
        </el-button>
        <el-button
          :disabled="!readyCount"
          @click="downloadAll"
        >
          {{ t("downloadAll") }}
        </el-button>
        <span class="meta">
          <template v-if="loadingLib">{{ t("loadingLib") }}</template>
          <template v-else>{{ t("count", { n: items.length }) }}</template>
        </span>
      </div>

      <div class="work">
        <div class="preview-wrap">
          <div class="preview-host">
            <img
              v-if="active"
              :src="active.url"
              alt=""
            />
          </div>
          <p
            v-if="active"
            class="preview-meta"
          >
            {{ active.w }} × {{ active.h }} · {{ fmtBytes(active.bytes) }}
            <template v-if="active.outBytes">
              → {{ fmtBytes(active.outBytes) }}
              <span class="save">{{ saveRatio(active) }}</span>
            </template>
          </p>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("mbTitle") }} {{ maxMB }} MB</h2>
          <el-slider
            v-model="maxMB"
            :min="0.1"
            :max="10"
            :step="0.1"
            :show-tooltip="false"
            @change="clearResults"
          />
          <div class="chips">
            <el-button
              v-for="m in MB_PRESETS"
              :key="m"
              size="small"
              :type="maxMB === m ? 'primary' : 'default'"
              @click="maxMB = m; clearResults()"
            >
              {{ m }} MB
            </el-button>
          </div>

          <h2 class="sub">{{ t("edgeTitle") }}</h2>
          <div class="chips">
            <el-button
              size="small"
              :type="maxEdge === 0 ? 'primary' : 'default'"
              @click="maxEdge = 0; clearResults()"
            >
              {{ t("edgeNone") }}
            </el-button>
            <el-button
              v-for="e in EDGE_PRESETS"
              :key="e"
              size="small"
              :type="maxEdge === e ? 'primary' : 'default'"
              @click="maxEdge = e; clearResults()"
            >
              {{ e }}px
            </el-button>
          </div>

          <h2 class="sub">{{ t("formatTitle") }}</h2>
          <el-radio-group
            v-model="outType"
            class="fmt-group"
            @change="clearResults"
          >
            <el-radio-button value="keep">{{ t("fmtKeep") }}</el-radio-button>
            <el-radio-button value="jpeg">JPG</el-radio-button>
            <el-radio-button value="webp">WebP</el-radio-button>
            <el-radio-button value="png">PNG</el-radio-button>
          </el-radio-group>

          <template v-if="needQuality">
            <h2 class="sub">{{ t("qualityTitle") }} {{ Math.round(quality * 100) }}%</h2>
            <el-slider
              v-model="quality"
              :min="0.1"
              :max="1"
              :step="0.02"
              :show-tooltip="false"
              @change="clearResults"
            />
          </template>

          <el-checkbox
            v-model="keepRes"
            @change="clearResults"
          >
            {{ t("keepRes") }}
          </el-checkbox>
          <el-checkbox
            v-model="preserveExif"
            @change="clearResults"
          >
            {{ t("exif") }}
          </el-checkbox>
          <p class="hint">{{ t("hint") }}</p>
        </div>
      </div>

      <h2 class="sub list-title">{{ t("listTitle") }}</h2>
      <div class="table-wrap">
        <table class="file-table">
          <thead>
            <tr>
              <th>{{ t("colName") }}</th>
              <th>{{ t("colDim") }}</th>
              <th>{{ t("colIn") }}</th>
              <th>{{ t("colOut") }}</th>
              <th>{{ t("colSave") }}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              :class="{ active: item.id === active?.id }"
              @click="activeId = item.id"
            >
              <td class="name">{{ item.name }}</td>
              <td>{{ item.w }} × {{ item.h }}</td>
              <td>{{ fmtBytes(item.bytes) }}</td>
              <td>
                <span v-if="item.error">{{ t("msgFail") }}</span>
                <span v-else-if="item.outBytes">{{ fmtBytes(item.outBytes) }}</span>
                <span v-else-if="item.progress">{{ Math.round(item.progress) }}%</span>
                <span v-else>—</span>
              </td>
              <td>{{ item.outBytes ? saveRatio(item) : "—" }}</td>
              <td class="acts">
                <el-button
                  size="small"
                  :disabled="!item.outBlob"
                  @click.stop="downloadOne(item)"
                >
                  {{ t("download") }}
                </el-button>
                <el-button
                  size="small"
                  @click.stop="removeItem(item.id)"
                >
                  {{ t("remove") }}
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.cp-page {
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

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.work {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 800px) {
  .work {
    grid-template-columns: 1fr;
  }
}

.preview-wrap {
  min-height: 280px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.preview-host {
  height: min(48vh, 420px);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(45deg, var(--vp-c-bg) 25%, transparent 25%) 0 0 / 16px 16px,
    linear-gradient(-45deg, var(--vp-c-bg) 25%, transparent 25%) 0 8px / 16px 16px;
  background-color: var(--vp-c-bg-soft);
}

.preview-host img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-meta {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}

.save {
  margin-left: 6px;
  color: var(--vp-c-brand-1);
}

.side {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sub {
  margin: 8px 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.fmt-group {
  display: flex;
  flex-wrap: wrap;
}

.hint {
  margin: 4px 0 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.list-title {
  margin-top: 24px;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid var(--vp-c-divider);
    white-space: nowrap;
  }

  th {
    color: var(--vp-c-text-2);
    font-weight: 600;
    background: var(--vp-c-bg-soft);
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover,
  tbody tr.active {
    background: var(--vp-c-bg-soft);
  }

  .name {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .acts {
    text-align: right;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "图片压缩",
    "desc": "用 browser-image-compression 在浏览器里本地压缩，可限制目标体积和最长边，支持 JPG / PNG / WebP。首次会从 CDN 加载库，不上传图片。",
    "reselect": "清空重选",
    "run": "开始压缩",
    "download": "下载",
    "downloadAll": "全部下载",
    "count": "共 {n} 张",
    "loadingLib": "正在从 CDN 加载压缩库…",
    "mbTitle": "目标体积",
    "edgeTitle": "最长边",
    "edgeNone": "不限制",
    "formatTitle": "输出格式",
    "fmtKeep": "原格式",
    "qualityTitle": "初始画质",
    "keepRes": "保持原始分辨率",
    "exif": "保留 EXIF",
    "hint": "目标体积是上限，实际结果可能更小。保持分辨率时不会缩小宽高。",
    "listTitle": "文件列表",
    "colName": "文件名",
    "colDim": "尺寸",
    "colIn": "原大小",
    "colOut": "压缩后",
    "colSave": "节省",
    "remove": "移除",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "压缩失败。",
    "msgEmpty": "还没有可下载的结果。",
    "msgLib": "压缩库加载失败，请检查网络后重试。"
  },
  "zh-CN": {
    "title_page": "图片压缩",
    "desc": "用 browser-image-compression 在浏览器里本地压缩，可限制目标体积和最长边，支持 JPG / PNG / WebP。首次会从 CDN 加载库，不上传图片。",
    "reselect": "清空重选",
    "run": "开始压缩",
    "download": "下载",
    "downloadAll": "全部下载",
    "count": "共 {n} 张",
    "loadingLib": "正在从 CDN 加载压缩库…",
    "mbTitle": "目标体积",
    "edgeTitle": "最长边",
    "edgeNone": "不限制",
    "formatTitle": "输出格式",
    "fmtKeep": "原格式",
    "qualityTitle": "初始画质",
    "keepRes": "保持原始分辨率",
    "exif": "保留 EXIF",
    "hint": "目标体积是上限，实际结果可能更小。保持分辨率时不会缩小宽高。",
    "listTitle": "文件列表",
    "colName": "文件名",
    "colDim": "尺寸",
    "colIn": "原大小",
    "colOut": "压缩后",
    "colSave": "节省",
    "remove": "移除",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "压缩失败。",
    "msgEmpty": "还没有可下载的结果。",
    "msgLib": "压缩库加载失败，请检查网络后重试。"
  },
  "en": {
    "title_page": "Compress images",
    "desc": "Compress JPG, PNG, and WebP in your browser with browser-image-compression. Cap file size and longest edge. The library loads from a CDN; images stay local.",
    "reselect": "Clear all",
    "run": "Compress",
    "download": "Download",
    "downloadAll": "Download all",
    "count": "{n} images",
    "loadingLib": "Loading compressor from CDN…",
    "mbTitle": "Target size",
    "edgeTitle": "Longest edge",
    "edgeNone": "No limit",
    "formatTitle": "Output format",
    "fmtKeep": "Original",
    "qualityTitle": "Initial quality",
    "keepRes": "Keep original resolution",
    "exif": "Keep EXIF",
    "hint": "Target size is a ceiling. Keeping resolution skips resizing.",
    "listTitle": "Files",
    "colName": "Name",
    "colDim": "Size",
    "colIn": "Original",
    "colOut": "Compressed",
    "colSave": "Saved",
    "remove": "Remove",
    "msgNotImage": "Please choose image files.",
    "msgFail": "Compression failed.",
    "msgEmpty": "Nothing to download yet.",
    "msgLib": "Could not load the compressor. Check your network and retry."
  },
  "ja": {
    "title_page": "画像圧縮",
    "desc": "browser-image-compression でブラウザ内圧縮。容量と長辺を制限できます。初回は CDN から読み込み、画像は送信しません。",
    "reselect": "すべてクリア",
    "run": "圧縮する",
    "download": "保存",
    "downloadAll": "すべて保存",
    "count": "{n} 枚",
    "loadingLib": "CDN から圧縮ライブラリを読み込み中…",
    "mbTitle": "目標サイズ",
    "edgeTitle": "長辺",
    "edgeNone": "制限なし",
    "formatTitle": "出力形式",
    "fmtKeep": "元の形式",
    "qualityTitle": "初期画質",
    "keepRes": "解像度を維持",
    "exif": "EXIF を残す",
    "hint": "目標サイズは上限です。解像度維持時は縮小しません。",
    "listTitle": "ファイル",
    "colName": "名前",
    "colDim": "サイズ",
    "colIn": "元容量",
    "colOut": "圧縮後",
    "colSave": "削減",
    "remove": "削除",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "圧縮に失敗しました。",
    "msgEmpty": "ダウンロードできる結果がありません。",
    "msgLib": "ライブラリの読み込みに失敗しました。通信を確認して再試行してください。"
  },
  "ko": {
    "title_page": "이미지 압축",
    "desc": "browser-image-compression으로 브라우저에서 JPG, PNG, WebP를 압축합니다. 용량과 긴 변을 제한할 수 있습니다. 라이브러리는 CDN에서 받고 이미지는 업로드하지 않습니다.",
    "reselect": "모두 지우기",
    "run": "압축",
    "download": "다운로드",
    "downloadAll": "모두 다운로드",
    "count": "{n}장",
    "loadingLib": "CDN에서 압축 라이브러리 불러오는 중…",
    "mbTitle": "목표 용량",
    "edgeTitle": "긴 변",
    "edgeNone": "제한 없음",
    "formatTitle": "출력 형식",
    "fmtKeep": "원본",
    "qualityTitle": "초기 품질",
    "keepRes": "해상도 유지",
    "exif": "EXIF 유지",
    "hint": "목표 용량은 상한입니다. 해상도 유지 시 크기를 줄이지 않습니다.",
    "listTitle": "파일",
    "colName": "이름",
    "colDim": "크기",
    "colIn": "원본",
    "colOut": "압축 후",
    "colSave": "절약",
    "remove": "제거",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "압축에 실패했습니다.",
    "msgEmpty": "다운로드할 결과가 없습니다.",
    "msgLib": "라이브러리를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도하세요."
  },
  "fr": {
    "title_page": "Compresser des images",
    "desc": "Compressez JPG, PNG et WebP dans le navigateur avec browser-image-compression. Limitez le poids et le plus grand côté. La librairie vient d’un CDN ; les images restent locales.",
    "reselect": "Tout effacer",
    "run": "Compresser",
    "download": "Télécharger",
    "downloadAll": "Tout télécharger",
    "count": "{n} images",
    "loadingLib": "Chargement du compresseur depuis le CDN…",
    "mbTitle": "Taille cible",
    "edgeTitle": "Plus grand côté",
    "edgeNone": "Sans limite",
    "formatTitle": "Format de sortie",
    "fmtKeep": "Original",
    "qualityTitle": "Qualité initiale",
    "keepRes": "Garder la résolution",
    "exif": "Garder l’EXIF",
    "hint": "La taille cible est un plafond. Garder la résolution évite le redimensionnement.",
    "listTitle": "Fichiers",
    "colName": "Nom",
    "colDim": "Dimensions",
    "colIn": "Original",
    "colOut": "Compressé",
    "colSave": "Gain",
    "remove": "Retirer",
    "msgNotImage": "Choisissez des fichiers image.",
    "msgFail": "Échec de la compression.",
    "msgEmpty": "Rien à télécharger pour l’instant.",
    "msgLib": "Impossible de charger le compresseur. Vérifiez le réseau et réessayez."
  },
  "de": {
    "title_page": "Bilder komprimieren",
    "desc": "JPG, PNG und WebP im Browser mit browser-image-compression verkleinern. Dateigröße und längste Kante begrenzen. Die Bibliothek kommt vom CDN; Bilder bleiben lokal.",
    "reselect": "Alles leeren",
    "run": "Komprimieren",
    "download": "Download",
    "downloadAll": "Alle laden",
    "count": "{n} Bilder",
    "loadingLib": "Kompressor wird vom CDN geladen…",
    "mbTitle": "Zielgröße",
    "edgeTitle": "Längste Kante",
    "edgeNone": "Kein Limit",
    "formatTitle": "Ausgabeformat",
    "fmtKeep": "Original",
    "qualityTitle": "Startqualität",
    "keepRes": "Auflösung behalten",
    "exif": "EXIF behalten",
    "hint": "Die Zielgröße ist eine Obergrenze. Bei behaltener Auflösung wird nicht skaliert.",
    "listTitle": "Dateien",
    "colName": "Name",
    "colDim": "Größe",
    "colIn": "Original",
    "colOut": "Komprimiert",
    "colSave": "Ersparnis",
    "remove": "Entfernen",
    "msgNotImage": "Bitte Bilddateien wählen.",
    "msgFail": "Komprimierung fehlgeschlagen.",
    "msgEmpty": "Noch nichts zum Download.",
    "msgLib": "Kompressor konnte nicht geladen werden. Netzwerk prüfen und erneut versuchen."
  },
  "es": {
    "title_page": "Comprimir imágenes",
    "desc": "Comprime JPG, PNG y WebP en el navegador con browser-image-compression. Limita el peso y el lado más largo. La librería se carga desde un CDN; las imágenes no se suben.",
    "reselect": "Vaciar",
    "run": "Comprimir",
    "download": "Descargar",
    "downloadAll": "Descargar todo",
    "count": "{n} imágenes",
    "loadingLib": "Cargando el compresor desde el CDN…",
    "mbTitle": "Tamaño objetivo",
    "edgeTitle": "Lado más largo",
    "edgeNone": "Sin límite",
    "formatTitle": "Formato de salida",
    "fmtKeep": "Original",
    "qualityTitle": "Calidad inicial",
    "keepRes": "Mantener resolución",
    "exif": "Conservar EXIF",
    "hint": "El tamaño objetivo es un tope. Mantener la resolución no redimensiona.",
    "listTitle": "Archivos",
    "colName": "Nombre",
    "colDim": "Tamaño",
    "colIn": "Original",
    "colOut": "Comprimido",
    "colSave": "Ahorro",
    "remove": "Quitar",
    "msgNotImage": "Elige archivos de imagen.",
    "msgFail": "Error al comprimir.",
    "msgEmpty": "Aún no hay nada que descargar.",
    "msgLib": "No se pudo cargar el compresor. Revisa la red e inténtalo de nuevo."
  },
  "pt": {
    "title_page": "Comprimir imagens",
    "desc": "Comprima JPG, PNG e WebP no navegador com browser-image-compression. Limite o tamanho e o lado maior. A biblioteca vem de um CDN; as imagens ficam no dispositivo.",
    "reselect": "Limpar tudo",
    "run": "Comprimir",
    "download": "Baixar",
    "downloadAll": "Baixar tudo",
    "count": "{n} imagens",
    "loadingLib": "Carregando o compressor do CDN…",
    "mbTitle": "Tamanho alvo",
    "edgeTitle": "Lado maior",
    "edgeNone": "Sem limite",
    "formatTitle": "Formato de saída",
    "fmtKeep": "Original",
    "qualityTitle": "Qualidade inicial",
    "keepRes": "Manter resolução",
    "exif": "Manter EXIF",
    "hint": "O tamanho alvo é um teto. Manter a resolução não redimensiona.",
    "listTitle": "Arquivos",
    "colName": "Nome",
    "colDim": "Tamanho",
    "colIn": "Original",
    "colOut": "Comprimido",
    "colSave": "Economia",
    "remove": "Remover",
    "msgNotImage": "Escolha arquivos de imagem.",
    "msgFail": "Falha na compressão.",
    "msgEmpty": "Ainda não há o que baixar.",
    "msgLib": "Não foi possível carregar o compressor. Verifique a rede e tente de novo."
  },
  "ru": {
    "title_page": "Сжатие изображений",
    "desc": "Сжимайте JPG, PNG и WebP в браузере через browser-image-compression. Ограничьте объём и длинную сторону. Библиотека с CDN, файлы не загружаются.",
    "reselect": "Очистить",
    "run": "Сжать",
    "download": "Скачать",
    "downloadAll": "Скачать все",
    "count": "{n} изобр.",
    "loadingLib": "Загрузка библиотеки с CDN…",
    "mbTitle": "Целевой размер",
    "edgeTitle": "Длинная сторона",
    "edgeNone": "Без лимита",
    "formatTitle": "Формат выхода",
    "fmtKeep": "Исходный",
    "qualityTitle": "Начальное качество",
    "keepRes": "Сохранить разрешение",
    "exif": "Сохранить EXIF",
    "hint": "Целевой размер — верхняя граница. При сохранении разрешения масштаб не меняется.",
    "listTitle": "Файлы",
    "colName": "Имя",
    "colDim": "Размер",
    "colIn": "Было",
    "colOut": "После",
    "colSave": "Экономия",
    "remove": "Убрать",
    "msgNotImage": "Выберите файлы изображений.",
    "msgFail": "Ошибка сжатия.",
    "msgEmpty": "Пока нечего скачивать.",
    "msgLib": "Не удалось загрузить библиотеку. Проверьте сеть и повторите."
  },
  "ar": {
    "title_page": "ضغط الصور",
    "desc": "اضغط JPG و PNG و WebP في المتصفح عبر browser-image-compression. حدد الحجم والجانب الأطول. تُحمَّل المكتبة من CDN والصور تبقى محلية.",
    "reselect": "مسح الكل",
    "run": "ضغط",
    "download": "تنزيل",
    "downloadAll": "تنزيل الكل",
    "count": "{n} صور",
    "loadingLib": "جارٍ تحميل المكتبة من CDN…",
    "mbTitle": "الحجم المستهدف",
    "edgeTitle": "الجانب الأطول",
    "edgeNone": "بلا حد",
    "formatTitle": "صيغة الإخراج",
    "fmtKeep": "الأصل",
    "qualityTitle": "الجودة الأولية",
    "keepRes": "الإبقاء على الدقة",
    "exif": "الإبقاء على EXIF",
    "hint": "الحجم المستهدف حد أقصى. الإبقاء على الدقة يمنع التصغير.",
    "listTitle": "الملفات",
    "colName": "الاسم",
    "colDim": "الأبعاد",
    "colIn": "الأصل",
    "colOut": "بعد الضغط",
    "colSave": "التوفير",
    "remove": "إزالة",
    "msgNotImage": "اختر ملفات صور.",
    "msgFail": "فشل الضغط.",
    "msgEmpty": "لا يوجد ما يمكن تنزيله بعد.",
    "msgLib": "تعذر تحميل المكتبة. تحقق من الشبكة ثم أعد المحاولة."
  },
  "hi": {
    "title_page": "छवि संपीड़न",
    "desc": "browser-image-compression से ब्राउज़र में JPG, PNG, WebP संपीड़ित करें। आकार और सबसे लंबी भुजा सीमित करें। लाइब्रेरी CDN से आती है, छवियाँ स्थानीय रहती हैं।",
    "reselect": "सब साफ़ करें",
    "run": "संपीड़ित करें",
    "download": "डाउनलोड",
    "downloadAll": "सभी डाउनलोड",
    "count": "{n} छवियाँ",
    "loadingLib": "CDN से कंप्रेसर लोड हो रहा है…",
    "mbTitle": "लक्ष्य आकार",
    "edgeTitle": "सबसे लंबी भुजा",
    "edgeNone": "कोई सीमा नहीं",
    "formatTitle": "आउटपुट प्रारूप",
    "fmtKeep": "मूल",
    "qualityTitle": "प्रारंभिक गुणवत्ता",
    "keepRes": "रिज़ॉल्यूशन बनाए रखें",
    "exif": "EXIF रखें",
    "hint": "लक्ष्य आकार ऊपरी सीमा है। रिज़ॉल्यूशन बनाए रखने पर आकार नहीं घटता।",
    "listTitle": "फ़ाइलें",
    "colName": "नाम",
    "colDim": "आकार",
    "colIn": "मूल",
    "colOut": "संपीड़ित",
    "colSave": "बचत",
    "remove": "हटाएँ",
    "msgNotImage": "कृपया छवि फ़ाइलें चुनें।",
    "msgFail": "संपीड़न असफल।",
    "msgEmpty": "अभी डाउनलोड करने को कुछ नहीं।",
    "msgLib": "कंप्रेसर लोड नहीं हुआ। नेटवर्क जाँचकर पुनः प्रयास करें।"
  },
  "it": {
    "title_page": "Comprimi immagini",
    "desc": "Comprimi JPG, PNG e WebP nel browser con browser-image-compression. Limita peso e lato più lungo. La libreria arriva da un CDN; le immagini restano in locale.",
    "reselect": "Svuota",
    "run": "Comprimi",
    "download": "Scarica",
    "downloadAll": "Scarica tutto",
    "count": "{n} immagini",
    "loadingLib": "Caricamento del compressore dal CDN…",
    "mbTitle": "Dimensione obiettivo",
    "edgeTitle": "Lato più lungo",
    "edgeNone": "Nessun limite",
    "formatTitle": "Formato di uscita",
    "fmtKeep": "Originale",
    "qualityTitle": "Qualità iniziale",
    "keepRes": "Mantieni risoluzione",
    "exif": "Mantieni EXIF",
    "hint": "La dimensione obiettivo è un tetto. Mantenere la risoluzione non ridimensiona.",
    "listTitle": "File",
    "colName": "Nome",
    "colDim": "Dimensioni",
    "colIn": "Originale",
    "colOut": "Compresso",
    "colSave": "Risparmio",
    "remove": "Rimuovi",
    "msgNotImage": "Scegli file immagine.",
    "msgFail": "Compressione non riuscita.",
    "msgEmpty": "Non c’è ancora nulla da scaricare.",
    "msgLib": "Impossibile caricare il compressore. Controlla la rete e riprova."
  },
  "nl": {
    "title_page": "Afbeeldingen comprimeren",
    "desc": "Comprimeer JPG, PNG en WebP in de browser met browser-image-compression. Beperk bestandsgrootte en langste zijde. De bibliotheek komt van een CDN; afbeeldingen blijven lokaal.",
    "reselect": "Alles wissen",
    "run": "Comprimeren",
    "download": "Downloaden",
    "downloadAll": "Alles downloaden",
    "count": "{n} afbeeldingen",
    "loadingLib": "Compressor laden vanaf CDN…",
    "mbTitle": "Doelgrootte",
    "edgeTitle": "Langste zijde",
    "edgeNone": "Geen limiet",
    "formatTitle": "Uitvoerformaat",
    "fmtKeep": "Origineel",
    "qualityTitle": "Startkwaliteit",
    "keepRes": "Resolutie behouden",
    "exif": "EXIF behouden",
    "hint": "Doelgrootte is een maximum. Resolutie behouden slaat schalen over.",
    "listTitle": "Bestanden",
    "colName": "Naam",
    "colDim": "Afmeting",
    "colIn": "Origineel",
    "colOut": "Gecomprimeerd",
    "colSave": "Besparing",
    "remove": "Verwijderen",
    "msgNotImage": "Kies afbeeldingsbestanden.",
    "msgFail": "Comprimeren mislukt.",
    "msgEmpty": "Nog niets om te downloaden.",
    "msgLib": "Compressor kon niet worden geladen. Controleer het netwerk en probeer opnieuw."
  },
  "tr": {
    "title_page": "Görüntü sıkıştır",
    "desc": "browser-image-compression ile tarayıcıda JPG, PNG ve WebP sıkıştırın. Boyutu ve en uzun kenarı sınırlayın. Kütüphane CDN’den gelir; görüntüler yerelde kalır.",
    "reselect": "Tümünü temizle",
    "run": "Sıkıştır",
    "download": "İndir",
    "downloadAll": "Tümünü indir",
    "count": "{n} görüntü",
    "loadingLib": "Sıkıştırıcı CDN’den yükleniyor…",
    "mbTitle": "Hedef boyut",
    "edgeTitle": "En uzun kenar",
    "edgeNone": "Sınırsız",
    "formatTitle": "Çıktı biçimi",
    "fmtKeep": "Orijinal",
    "qualityTitle": "Başlangıç kalitesi",
    "keepRes": "Çözünürlüğü koru",
    "exif": "EXIF’i koru",
    "hint": "Hedef boyut bir üst sınırdır. Çözünürlük korunursa yeniden boyutlandırılmaz.",
    "listTitle": "Dosyalar",
    "colName": "Ad",
    "colDim": "Boyut",
    "colIn": "Orijinal",
    "colOut": "Sıkıştırılmış",
    "colSave": "Kazanç",
    "remove": "Kaldır",
    "msgNotImage": "Lütfen görüntü dosyaları seçin.",
    "msgFail": "Sıkıştırma başarısız.",
    "msgEmpty": "İndirilecek bir şey yok.",
    "msgLib": "Sıkıştırıcı yüklenemedi. Ağı kontrol edip tekrar deneyin."
  },
  "vi": {
    "title_page": "Nén ảnh",
    "desc": "Nén JPG, PNG, WebP trong trình duyệt bằng browser-image-compression. Giới hạn dung lượng và cạnh dài nhất. Thư viện tải từ CDN; ảnh không được tải lên.",
    "reselect": "Xóa hết",
    "run": "Nén",
    "download": "Tải xuống",
    "downloadAll": "Tải tất cả",
    "count": "{n} ảnh",
    "loadingLib": "Đang tải thư viện nén từ CDN…",
    "mbTitle": "Dung lượng đích",
    "edgeTitle": "Cạnh dài nhất",
    "edgeNone": "Không giới hạn",
    "formatTitle": "Định dạng xuất",
    "fmtKeep": "Giữ nguyên",
    "qualityTitle": "Chất lượng ban đầu",
    "keepRes": "Giữ độ phân giải",
    "exif": "Giữ EXIF",
    "hint": "Dung lượng đích là trần. Giữ độ phân giải sẽ không thu nhỏ.",
    "listTitle": "Tệp",
    "colName": "Tên",
    "colDim": "Kích thước",
    "colIn": "Gốc",
    "colOut": "Đã nén",
    "colSave": "Tiết kiệm",
    "remove": "Xóa",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Nén thất bại.",
    "msgEmpty": "Chưa có gì để tải.",
    "msgLib": "Không tải được thư viện. Kiểm tra mạng rồi thử lại."
  },
  "th": {
    "title_page": "บีบอัดรูปภาพ",
    "desc": "บีบอัด JPG PNG WebP ในเบราว์เซอร์ด้วย browser-image-compression จำกัดขนาดและด้านยาวสุด ไลบรารีมาจาก CDN รูปไม่ถูกอัปโหลด",
    "reselect": "ล้างทั้งหมด",
    "run": "บีบอัด",
    "download": "ดาวน์โหลด",
    "downloadAll": "ดาวน์โหลดทั้งหมด",
    "count": "{n} รูป",
    "loadingLib": "กำลังโหลดไลบรารีจาก CDN…",
    "mbTitle": "ขนาดเป้าหมาย",
    "edgeTitle": "ด้านยาวสุด",
    "edgeNone": "ไม่จำกัด",
    "formatTitle": "รูปแบบส่งออก",
    "fmtKeep": "ต้นฉบับ",
    "qualityTitle": "คุณภาพเริ่มต้น",
    "keepRes": "คงความละเอียด",
    "exif": "เก็บ EXIF",
    "hint": "ขนาดเป้าหมายเป็นเพดาน คงความละเอียดจะไม่ย่อขนาด",
    "listTitle": "ไฟล์",
    "colName": "ชื่อ",
    "colDim": "ขนาด",
    "colIn": "ต้นฉบับ",
    "colOut": "หลังบีบอัด",
    "colSave": "ประหยัด",
    "remove": "ลบ",
    "msgNotImage": "โปรดเลือกไฟล์รูปภาพ",
    "msgFail": "บีบอัดไม่สำเร็จ",
    "msgEmpty": "ยังไม่มีไฟล์ให้ดาวน์โหลด",
    "msgLib": "โหลดไลบรารีไม่สำเร็จ ตรวจเครือข่ายแล้วลองใหม่"
  },
  "id": {
    "title_page": "Kompres gambar",
    "desc": "Kompres JPG, PNG, dan WebP di browser dengan browser-image-compression. Batasi ukuran dan sisi terpanjang. Pustaka dari CDN; gambar tetap lokal.",
    "reselect": "Hapus semua",
    "run": "Kompres",
    "download": "Unduh",
    "downloadAll": "Unduh semua",
    "count": "{n} gambar",
    "loadingLib": "Memuat kompresor dari CDN…",
    "mbTitle": "Ukuran target",
    "edgeTitle": "Sisi terpanjang",
    "edgeNone": "Tanpa batas",
    "formatTitle": "Format keluaran",
    "fmtKeep": "Asli",
    "qualityTitle": "Kualitas awal",
    "keepRes": "Pertahankan resolusi",
    "exif": "Pertahankan EXIF",
    "hint": "Ukuran target adalah batas atas. Mempertahankan resolusi tidak mengubah ukuran.",
    "listTitle": "Berkas",
    "colName": "Nama",
    "colDim": "Ukuran",
    "colIn": "Asli",
    "colOut": "Terkompresi",
    "colSave": "Hemat",
    "remove": "Hapus",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Kompresi gagal.",
    "msgEmpty": "Belum ada yang bisa diunduh.",
    "msgLib": "Gagal memuat kompresor. Periksa jaringan lalu coba lagi."
  },
  "ms": {
    "title_page": "Mampatkan imej",
    "desc": "Mampatkan JPG, PNG dan WebP dalam pelayar dengan browser-image-compression. Hadkan saiz dan sisi terpanjang. Pustaka dari CDN; imej kekal setempat.",
    "reselect": "Kosongkan",
    "run": "Mampatkan",
    "download": "Muat turun",
    "downloadAll": "Muat semua",
    "count": "{n} imej",
    "loadingLib": "Memuatkan pemampat dari CDN…",
    "mbTitle": "Saiz sasaran",
    "edgeTitle": "Sisi terpanjang",
    "edgeNone": "Tiada had",
    "formatTitle": "Format output",
    "fmtKeep": "Asal",
    "qualityTitle": "Kualiti awal",
    "keepRes": "Kekalkan resolusi",
    "exif": "Kekalkan EXIF",
    "hint": "Saiz sasaran ialah siling. Kekalkan resolusi tidak mengubah saiz.",
    "listTitle": "Fail",
    "colName": "Nama",
    "colDim": "Saiz",
    "colIn": "Asal",
    "colOut": "Dimampatkan",
    "colSave": "Jimat",
    "remove": "Buang",
    "msgNotImage": "Sila pilih fail imej.",
    "msgFail": "Pemampatan gagal.",
    "msgEmpty": "Belum ada yang boleh dimuat turun.",
    "msgLib": "Tidak dapat memuatkan pemampat. Semak rangkaian dan cuba lagi."
  },
  "pl": {
    "title_page": "Kompresja obrazów",
    "desc": "Kompresuj JPG, PNG i WebP w przeglądarce przez browser-image-compression. Ogranicz wagę i najdłuższy bok. Biblioteka z CDN; pliki zostają lokalnie.",
    "reselect": "Wyczyść",
    "run": "Kompresuj",
    "download": "Pobierz",
    "downloadAll": "Pobierz wszystko",
    "count": "{n} obrazów",
    "loadingLib": "Wczytywanie kompresora z CDN…",
    "mbTitle": "Docelowy rozmiar",
    "edgeTitle": "Najdłuższy bok",
    "edgeNone": "Bez limitu",
    "formatTitle": "Format wyjścia",
    "fmtKeep": "Oryginał",
    "qualityTitle": "Jakość początkowa",
    "keepRes": "Zachowaj rozdzielczość",
    "exif": "Zachowaj EXIF",
    "hint": "Docelowy rozmiar to górny limit. Zachowanie rozdzielczości pomija skalowanie.",
    "listTitle": "Pliki",
    "colName": "Nazwa",
    "colDim": "Wymiary",
    "colIn": "Oryginał",
    "colOut": "Po kompresji",
    "colSave": "Oszczędność",
    "remove": "Usuń",
    "msgNotImage": "Wybierz pliki obrazów.",
    "msgFail": "Kompresja nie powiodła się.",
    "msgEmpty": "Nie ma jeszcze nic do pobrania.",
    "msgLib": "Nie udało się wczytać kompresora. Sprawdź sieć i spróbuj ponownie."
  },
  "uk": {
    "title_page": "Стиснення зображень",
    "desc": "Стискайте JPG, PNG і WebP у браузері через browser-image-compression. Обмежте обсяг і довгу сторону. Бібліотека з CDN, файли не завантажуються.",
    "reselect": "Очистити",
    "run": "Стиснути",
    "download": "Завантажити",
    "downloadAll": "Завантажити все",
    "count": "{n} зобр.",
    "loadingLib": "Завантаження бібліотеки з CDN…",
    "mbTitle": "Цільовий розмір",
    "edgeTitle": "Довга сторона",
    "edgeNone": "Без ліміту",
    "formatTitle": "Формат виходу",
    "fmtKeep": "Вихідний",
    "qualityTitle": "Початкова якість",
    "keepRes": "Зберегти роздільність",
    "exif": "Зберегти EXIF",
    "hint": "Цільовий розмір — верхня межа. Зі збереженою роздільністю масштаб не змінюється.",
    "listTitle": "Файли",
    "colName": "Назва",
    "colDim": "Розмір",
    "colIn": "Було",
    "colOut": "Після",
    "colSave": "Економія",
    "remove": "Прибрати",
    "msgNotImage": "Оберіть файли зображень.",
    "msgFail": "Помилка стиснення.",
    "msgEmpty": "Поки нічого завантажувати.",
    "msgLib": "Не вдалося завантажити бібліотеку. Перевірте мережу й повторіть."
  },
  "sv": {
    "title_page": "Komprimera bilder",
    "desc": "Komprimera JPG, PNG och WebP i webbläsaren med browser-image-compression. Begränsa filstorlek och längsta sida. Biblioteket hämtas från CDN; bilderna stannar lokalt.",
    "reselect": "Rensa allt",
    "run": "Komprimera",
    "download": "Ladda ner",
    "downloadAll": "Ladda ner alla",
    "count": "{n} bilder",
    "loadingLib": "Laddar kompressor från CDN…",
    "mbTitle": "Målstorlek",
    "edgeTitle": "Längsta sida",
    "edgeNone": "Ingen gräns",
    "formatTitle": "Utformat",
    "fmtKeep": "Original",
    "qualityTitle": "Startkvalitet",
    "keepRes": "Behåll upplösning",
    "exif": "Behåll EXIF",
    "hint": "Målstorleken är ett tak. Behållen upplösning hoppar över skalning.",
    "listTitle": "Filer",
    "colName": "Namn",
    "colDim": "Storlek",
    "colIn": "Original",
    "colOut": "Komprimerad",
    "colSave": "Sparat",
    "remove": "Ta bort",
    "msgNotImage": "Välj bildfiler.",
    "msgFail": "Komprimeringen misslyckades.",
    "msgEmpty": "Inget att ladda ner ännu.",
    "msgLib": "Kunde inte ladda kompressorn. Kontrollera nätverket och försök igen."
  },
  "zh-TW": {
    "title_page": "圖片壓縮",
    "desc": "用 browser-image-compression 在瀏覽器裡本機壓縮，可限制目標體積與最長邊，支援 JPG / PNG / WebP。首次會從 CDN 載入函式庫，不上傳圖片。",
    "reselect": "清空重選",
    "run": "開始壓縮",
    "download": "下載",
    "downloadAll": "全部下載",
    "count": "共 {n} 張",
    "loadingLib": "正在從 CDN 載入壓縮函式庫…",
    "mbTitle": "目標體積",
    "edgeTitle": "最長邊",
    "edgeNone": "不限制",
    "formatTitle": "輸出格式",
    "fmtKeep": "原格式",
    "qualityTitle": "初始畫質",
    "keepRes": "保持原始解析度",
    "exif": "保留 EXIF",
    "hint": "目標體積是上限，實際結果可能更小。保持解析度時不會縮小寬高。",
    "listTitle": "檔案列表",
    "colName": "檔名",
    "colDim": "尺寸",
    "colIn": "原大小",
    "colOut": "壓縮後",
    "colSave": "節省",
    "remove": "移除",
    "msgNotImage": "請選擇圖片檔案。",
    "msgFail": "壓縮失敗。",
    "msgEmpty": "還沒有可下載的結果。",
    "msgLib": "壓縮函式庫載入失敗，請檢查網路後重試。"
  }
}
</i18n>
