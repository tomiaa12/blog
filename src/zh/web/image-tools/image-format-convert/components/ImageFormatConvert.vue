<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import JSZip from "jszip"
import FileUpload from "@/components/FileUpload.vue"
import { encodeIcoFromCanvases } from "@/utils"

const { t } = useI18n()

type ExportFmt = "png" | "jpeg" | "webp" | "bmp" | "ico" | "avif"

type Item = {
  id: number
  url: string
  name: string
  ext: string
  bytes: number
  w: number
  h: number
  img: HTMLImageElement
  outBlob: Blob | null
  outBytes: number
  error: boolean
}

const MIME: Record<ExportFmt, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",
  avif: "image/avif",
}

const EXT: Record<ExportFmt, string> = {
  png: "png",
  jpeg: "jpg",
  webp: "webp",
  bmp: "bmp",
  ico: "ico",
  avif: "avif",
}

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml,image/x-icon,image/avif,.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.ico,.avif"

const items = ref<Item[]>([])
const activeId = ref(0)
const format = ref<ExportFmt>("png")
const quality = ref(0.92)
const bg = ref("#ffffff")
const converting = ref(false)
const avifOk = ref(false)

let idSeq = 1
let convertTimer: ReturnType<typeof setTimeout> | null = null

const needQuality = computed(
  () => format.value === "jpeg" || format.value === "webp" || format.value === "avif"
)
const needBg = computed(
  () => format.value === "jpeg" || format.value === "bmp"
)
const active = computed(() => items.value.find(i => i.id === activeId.value) ?? items.value[0] ?? null)
const formats = computed<ExportFmt[]>(() => {
  const list: ExportFmt[] = ["png", "jpeg", "webp", "bmp", "ico"]
  if (avifOk.value) list.push("avif")
  return list
})

function detectAvif() {
  try {
    const c = document.createElement("canvas")
    c.width = 1
    c.height = 1
    avifOk.value = c.toDataURL("image/avif").startsWith("data:image/avif")
  } catch {
    avifOk.value = false
  }
}
detectAvif()

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true
  return /\.(png|jpe?g|webp|gif|bmp|svg|ico|avif)$/i.test(file.name)
}

function srcExt(file: File) {
  const m = file.name.match(/\.([^.]+)$/)
  if (m) return m[1]!.toLowerCase()
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/svg+xml": "svg",
    "image/x-icon": "ico",
    "image/vnd.microsoft.icon": "ico",
    "image/avif": "avif",
  }
  return map[file.type] || "img"
}

function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "") || "image"
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
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

function canvasToBmp(canvas: HTMLCanvasElement) {
  const w = canvas.width
  const h = canvas.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return new Blob([], { type: "image/bmp" })
  const { data } = ctx.getImageData(0, 0, w, h)
  const row = ((w * 3 + 3) >> 2) << 2
  const pixels = row * h
  const header = 14 + 40
  const buf = new ArrayBuffer(header + pixels)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)
  view.setUint8(0, 0x42)
  view.setUint8(1, 0x4d)
  view.setUint32(2, header + pixels, true)
  view.setUint32(10, header, true)
  view.setUint32(14, 40, true)
  view.setInt32(18, w, true)
  view.setInt32(22, h, true)
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  view.setUint32(34, pixels, true)
  for (let y = 0; y < h; y++) {
    const srcY = h - 1 - y
    let p = header + y * row
    for (let x = 0; x < w; x++) {
      const i = (srcY * w + x) * 4
      u8[p++] = data[i + 2]!
      u8[p++] = data[i + 1]!
      u8[p++] = data[i]!
    }
  }
  return new Blob([buf], { type: "image/bmp" })
}

function toBlob(canvas: HTMLCanvasElement, mime: string, q?: number) {
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(b => resolve(b), mime, q)
  })
}

function paintItem(item: Item) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  if (format.value === "ico") {
    const size = Math.min(256, Math.max(item.w, item.h, 1))
    canvas.width = size
    canvas.height = size
    ctx.fillStyle = bg.value
    ctx.fillRect(0, 0, size, size)
    const s = Math.min(size / item.w, size / item.h)
    const dw = Math.max(1, Math.round(item.w * s))
    const dh = Math.max(1, Math.round(item.h * s))
    ctx.drawImage(item.img, (size - dw) / 2, (size - dh) / 2, dw, dh)
    return canvas
  }

  canvas.width = item.w
  canvas.height = item.h
  if (needBg.value) {
    ctx.fillStyle = bg.value
    ctx.fillRect(0, 0, item.w, item.h)
  }
  ctx.drawImage(item.img, 0, 0)
  return canvas
}

async function convertOne(item: Item) {
  const canvas = paintItem(item)
  if (!canvas) {
    item.outBlob = null
    item.outBytes = 0
    item.error = true
    return
  }
  try {
    let blob: Blob | null = null
    if (format.value === "bmp") {
      blob = canvasToBmp(canvas)
    } else if (format.value === "ico") {
      blob = await encodeIcoFromCanvases([{ size: canvas.width, canvas }])
    } else {
      const q = needQuality.value ? quality.value : undefined
      blob = await toBlob(canvas, MIME[format.value], q)
    }
    if (!blob) throw new Error("blob")
    item.outBlob = blob
    item.outBytes = blob.size
    item.error = false
  } catch {
    item.outBlob = null
    item.outBytes = 0
    item.error = true
  }
}

async function convertAll() {
  if (!items.value.length) return
  converting.value = true
  try {
    for (const item of items.value) await convertOne(item)
  } finally {
    converting.value = false
  }
}

function scheduleConvert() {
  if (convertTimer) clearTimeout(convertTimer)
  convertTimer = setTimeout(() => {
    void convertAll()
  }, 80)
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
        url,
        name: file.name,
        ext: srcExt(file),
        bytes: file.size,
        w: img.naturalWidth,
        h: img.naturalHeight,
        img,
        outBlob: null,
        outBytes: 0,
        error: false,
      }
      items.value.push(item)
      if (!activeId.value) activeId.value = item.id
    } catch {
      URL.revokeObjectURL(url)
    }
  }
  if (!items.value.length) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  scheduleConvert()
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

function outName(item: Item) {
  return `${baseName(item.name)}.${EXT[format.value]}`
}

function downloadOne(item: Item) {
  if (!item.outBlob) {
    ElMessage({ message: t("msgFail"), type: "error" })
    return
  }
  saveBlob(item.outBlob, outName(item))
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
    let name = outName(item)
    const n = (used.get(name) ?? 0) + 1
    used.set(name, n)
    if (n > 1) name = `${baseName(item.name)}-${n}.${EXT[format.value]}`
    zip.file(name, item.outBlob!)
  }
  const blob = await zip.generateAsync({ type: "blob" })
  saveBlob(blob, `images-${EXT[format.value]}.zip`)
}

watch([format, quality, bg], () => {
  if (format.value === "avif" && !avifOk.value) {
    ElMessage({ message: t("msgAvifNo"), type: "warning" })
    format.value = "png"
    return
  }
  scheduleConvert()
})

onUnmounted(() => {
  if (convertTimer) clearTimeout(convertTimer)
  reset()
})
</script>

<template>
  <div class="fc-page">
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
          :loading="converting"
          :disabled="!items.some(i => i.outBlob)"
          @click="downloadAll"
        >
          {{ t("downloadAll") }}
        </el-button>
        <span class="meta">{{ t("count", { n: items.length }) }}</span>
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
            </template>
          </p>
        </div>

        <div class="side">
          <h2 class="sub">{{ t("formatTitle") }}</h2>
          <el-radio-group
            v-model="format"
            class="fmt-group"
          >
            <el-radio-button
              v-for="f in formats"
              :key="f"
              :value="f"
            >
              {{ EXT[f].toUpperCase() }}
            </el-radio-button>
          </el-radio-group>

          <template v-if="needQuality">
            <h2 class="sub">{{ t("qualityTitle") }} {{ Math.round(quality * 100) }}%</h2>
            <el-slider
              v-model="quality"
              :min="0.1"
              :max="1"
              :step="0.02"
              :show-tooltip="false"
            />
          </template>

          <template v-if="needBg">
            <h2 class="sub">{{ t("bgTitle") }}</h2>
            <div class="bg-row">
              <el-button
                size="small"
                @click="bg = '#ffffff'"
              >
                {{ t("bgWhite") }}
              </el-button>
              <el-button
                size="small"
                @click="bg = '#000000'"
              >
                {{ t("bgBlack") }}
              </el-button>
              <el-color-picker v-model="bg" />
            </div>
          </template>

          <p class="hint">{{ t("hint") }}</p>
        </div>
      </div>

      <h2 class="sub list-title">{{ t("listTitle") }}</h2>
      <div class="table-wrap">
        <table class="file-table">
          <thead>
            <tr>
              <th>{{ t("colName") }}</th>
              <th>{{ t("colFrom") }}</th>
              <th>{{ t("colDim") }}</th>
              <th>{{ t("colIn") }}</th>
              <th>{{ t("colOut") }}</th>
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
              <td>{{ item.ext.toUpperCase() }}</td>
              <td>{{ item.w }} × {{ item.h }}</td>
              <td>{{ fmtBytes(item.bytes) }}</td>
              <td>
                <span v-if="item.error">{{ t("msgFail") }}</span>
                <span v-else-if="item.outBytes">{{ fmtBytes(item.outBytes) }}</span>
                <span v-else>…</span>
              </td>
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
.fc-page {
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

.fmt-group {
  display: flex;
  flex-wrap: wrap;
}

.bg-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
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
    "title_page": "图片格式转换",
    "desc": "拖入一张或多张图片，批量转为 PNG、JPG、WebP、BMP、ICO，浏览器支持时也可导出 AVIF。处理都在本地完成，不上传服务器。",
    "reselect": "清空重选",
    "download": "下载",
    "downloadAll": "全部下载",
    "count": "共 {n} 张",
    "formatTitle": "目标格式",
    "qualityTitle": "画质",
    "bgTitle": "不透明底色",
    "bgWhite": "白",
    "bgBlack": "黑",
    "hint": "JPG / BMP 不支持透明通道，会先铺底色。ICO 会等比放入不超过 256 的正方形。",
    "listTitle": "文件列表",
    "colName": "文件名",
    "colFrom": "原格式",
    "colDim": "尺寸",
    "colIn": "原大小",
    "colOut": "转换后",
    "remove": "移除",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "转换失败。",
    "msgEmpty": "还没有可下载的结果。",
    "msgAvifNo": "当前浏览器不支持导出 AVIF。"
  },
  "zh-CN": {
    "title_page": "图片格式转换",
    "desc": "拖入一张或多张图片，批量转为 PNG、JPG、WebP、BMP、ICO，浏览器支持时也可导出 AVIF。处理都在本地完成，不上传服务器。",
    "reselect": "清空重选",
    "download": "下载",
    "downloadAll": "全部下载",
    "count": "共 {n} 张",
    "formatTitle": "目标格式",
    "qualityTitle": "画质",
    "bgTitle": "不透明底色",
    "bgWhite": "白",
    "bgBlack": "黑",
    "hint": "JPG / BMP 不支持透明通道，会先铺底色。ICO 会等比放入不超过 256 的正方形。",
    "listTitle": "文件列表",
    "colName": "文件名",
    "colFrom": "原格式",
    "colDim": "尺寸",
    "colIn": "原大小",
    "colOut": "转换后",
    "remove": "移除",
    "msgNotImage": "请选择图片文件。",
    "msgFail": "转换失败。",
    "msgEmpty": "还没有可下载的结果。",
    "msgAvifNo": "当前浏览器不支持导出 AVIF。"
  },
  "en": {
    "title_page": "Convert image format",
    "desc": "Drop one or more images and convert them to PNG, JPG, WebP, BMP, or ICO. AVIF is available when the browser supports it. Everything stays local.",
    "reselect": "Clear all",
    "download": "Download",
    "downloadAll": "Download all",
    "count": "{n} images",
    "formatTitle": "Target format",
    "qualityTitle": "Quality",
    "bgTitle": "Opaque background",
    "bgWhite": "White",
    "bgBlack": "Black",
    "hint": "JPG and BMP have no alpha, so a background is filled first. ICO is fitted into a square up to 256 px.",
    "listTitle": "Files",
    "colName": "Name",
    "colFrom": "From",
    "colDim": "Size",
    "colIn": "Original",
    "colOut": "Converted",
    "remove": "Remove",
    "msgNotImage": "Please choose image files.",
    "msgFail": "Conversion failed.",
    "msgEmpty": "Nothing to download yet.",
    "msgAvifNo": "This browser cannot export AVIF."
  },
  "ja": {
    "title_page": "画像形式の変換",
    "desc": "画像をドロップして PNG / JPG / WebP / BMP / ICO に一括変換。対応ブラウザでは AVIF も出力できます。すべて端末内で処理します。",
    "reselect": "すべてクリア",
    "download": "保存",
    "downloadAll": "すべて保存",
    "count": "{n} 枚",
    "formatTitle": "出力形式",
    "qualityTitle": "画質",
    "bgTitle": "不透明な背景",
    "bgWhite": "白",
    "bgBlack": "黒",
    "hint": "JPG / BMP は透明に非対応のため、先に背景を塗ります。ICO は最大 256px の正方形に収めます。",
    "listTitle": "ファイル",
    "colName": "名前",
    "colFrom": "元形式",
    "colDim": "サイズ",
    "colIn": "元容量",
    "colOut": "変換後",
    "remove": "削除",
    "msgNotImage": "画像ファイルを選んでください。",
    "msgFail": "変換に失敗しました。",
    "msgEmpty": "ダウンロードできる結果がありません。",
    "msgAvifNo": "このブラウザは AVIF を書き出せません。"
  },
  "ko": {
    "title_page": "이미지 형식 변환",
    "desc": "이미지를 끌어다 PNG, JPG, WebP, BMP, ICO로 일괄 변환합니다. 브라우저가 지원하면 AVIF도 가능합니다. 모두 로컬에서 처리됩니다.",
    "reselect": "모두 지우기",
    "download": "다운로드",
    "downloadAll": "모두 다운로드",
    "count": "{n}장",
    "formatTitle": "대상 형식",
    "qualityTitle": "품질",
    "bgTitle": "불투명 배경",
    "bgWhite": "흰색",
    "bgBlack": "검정",
    "hint": "JPG/BMP는 투명을 지원하지 않아 배경을 먼저 채웁니다. ICO는 최대 256px 정사각형에 맞춥니다.",
    "listTitle": "파일",
    "colName": "이름",
    "colFrom": "원본",
    "colDim": "크기",
    "colIn": "원본 용량",
    "colOut": "변환 후",
    "remove": "제거",
    "msgNotImage": "이미지 파일을 선택하세요.",
    "msgFail": "변환에 실패했습니다.",
    "msgEmpty": "다운로드할 결과가 없습니다.",
    "msgAvifNo": "이 브라우저는 AVIF를 내보낼 수 없습니다."
  },
  "fr": {
    "title_page": "Convertir le format d’image",
    "desc": "Déposez une ou plusieurs images et convertissez-les en PNG, JPG, WebP, BMP ou ICO. AVIF si le navigateur le permet. Tout reste local.",
    "reselect": "Tout effacer",
    "download": "Télécharger",
    "downloadAll": "Tout télécharger",
    "count": "{n} images",
    "formatTitle": "Format cible",
    "qualityTitle": "Qualité",
    "bgTitle": "Fond opaque",
    "bgWhite": "Blanc",
    "bgBlack": "Noir",
    "hint": "JPG et BMP n’ont pas d’alpha : un fond est d’abord appliqué. ICO est cadré dans un carré de 256 px max.",
    "listTitle": "Fichiers",
    "colName": "Nom",
    "colFrom": "Source",
    "colDim": "Dimensions",
    "colIn": "Original",
    "colOut": "Converti",
    "remove": "Retirer",
    "msgNotImage": "Choisissez des fichiers image.",
    "msgFail": "Échec de la conversion.",
    "msgEmpty": "Rien à télécharger pour l’instant.",
    "msgAvifNo": "Ce navigateur ne peut pas exporter l’AVIF."
  },
  "de": {
    "title_page": "Bildformat konvertieren",
    "desc": "Bilder ablegen und nach PNG, JPG, WebP, BMP oder ICO wandeln. AVIF, wenn der Browser es kann. Alles bleibt lokal.",
    "reselect": "Alles leeren",
    "download": "Download",
    "downloadAll": "Alle laden",
    "count": "{n} Bilder",
    "formatTitle": "Zielformat",
    "qualityTitle": "Qualität",
    "bgTitle": "Undurchsichtiger Hintergrund",
    "bgWhite": "Weiß",
    "bgBlack": "Schwarz",
    "hint": "JPG und BMP haben kein Alpha, daher wird zuerst ein Hintergrund gefüllt. ICO wird in ein Quadrat bis 256 px eingepasst.",
    "listTitle": "Dateien",
    "colName": "Name",
    "colFrom": "Von",
    "colDim": "Größe",
    "colIn": "Original",
    "colOut": "Konvertiert",
    "remove": "Entfernen",
    "msgNotImage": "Bitte Bilddateien wählen.",
    "msgFail": "Konvertierung fehlgeschlagen.",
    "msgEmpty": "Noch nichts zum Download.",
    "msgAvifNo": "Dieser Browser kann kein AVIF exportieren."
  },
  "es": {
    "title_page": "Convertir formato de imagen",
    "desc": "Suelta una o más imágenes y conviértelas a PNG, JPG, WebP, BMP o ICO. AVIF si el navegador lo admite. Todo se hace en local.",
    "reselect": "Vaciar",
    "download": "Descargar",
    "downloadAll": "Descargar todo",
    "count": "{n} imágenes",
    "formatTitle": "Formato destino",
    "qualityTitle": "Calidad",
    "bgTitle": "Fondo opaco",
    "bgWhite": "Blanco",
    "bgBlack": "Negro",
    "hint": "JPG y BMP no tienen alfa, se rellena un fondo. ICO se ajusta a un cuadrado de hasta 256 px.",
    "listTitle": "Archivos",
    "colName": "Nombre",
    "colFrom": "Origen",
    "colDim": "Tamaño",
    "colIn": "Original",
    "colOut": "Convertido",
    "remove": "Quitar",
    "msgNotImage": "Elige archivos de imagen.",
    "msgFail": "Error al convertir.",
    "msgEmpty": "Aún no hay nada que descargar.",
    "msgAvifNo": "Este navegador no puede exportar AVIF."
  },
  "pt": {
    "title_page": "Converter formato de imagem",
    "desc": "Arraste imagens e converta para PNG, JPG, WebP, BMP ou ICO. AVIF se o navegador suportar. Tudo fica no dispositivo.",
    "reselect": "Limpar tudo",
    "download": "Baixar",
    "downloadAll": "Baixar tudo",
    "count": "{n} imagens",
    "formatTitle": "Formato de destino",
    "qualityTitle": "Qualidade",
    "bgTitle": "Fundo opaco",
    "bgWhite": "Branco",
    "bgBlack": "Preto",
    "hint": "JPG e BMP não têm alfa, então um fundo é preenchido. ICO cabe num quadrado de até 256 px.",
    "listTitle": "Arquivos",
    "colName": "Nome",
    "colFrom": "De",
    "colDim": "Tamanho",
    "colIn": "Original",
    "colOut": "Convertido",
    "remove": "Remover",
    "msgNotImage": "Escolha arquivos de imagem.",
    "msgFail": "Falha na conversão.",
    "msgEmpty": "Ainda não há o que baixar.",
    "msgAvifNo": "Este navegador não exporta AVIF."
  },
  "ru": {
    "title_page": "Конвертация формата изображений",
    "desc": "Перетащите изображения и конвертируйте в PNG, JPG, WebP, BMP или ICO. AVIF — если браузер умеет. Всё локально.",
    "reselect": "Очистить",
    "download": "Скачать",
    "downloadAll": "Скачать все",
    "count": "{n} изобр.",
    "formatTitle": "Целевой формат",
    "qualityTitle": "Качество",
    "bgTitle": "Непрозрачный фон",
    "bgWhite": "Белый",
    "bgBlack": "Чёрный",
    "hint": "У JPG и BMP нет альфы, поэтому сначала заливается фон. ICO вписывается в квадрат до 256 px.",
    "listTitle": "Файлы",
    "colName": "Имя",
    "colFrom": "Исходный",
    "colDim": "Размер",
    "colIn": "Было",
    "colOut": "Стало",
    "remove": "Убрать",
    "msgNotImage": "Выберите файлы изображений.",
    "msgFail": "Ошибка конвертации.",
    "msgEmpty": "Пока нечего скачивать.",
    "msgAvifNo": "Этот браузер не умеет экспортировать AVIF."
  },
  "ar": {
    "title_page": "تحويل تنسيق الصور",
    "desc": "أسقط صورة أو أكثر وحوّلها إلى PNG أو JPG أو WebP أو BMP أو ICO. يتوفر AVIF إن دعمه المتصفح. كل شيء محلي.",
    "reselect": "مسح الكل",
    "download": "تنزيل",
    "downloadAll": "تنزيل الكل",
    "count": "{n} صور",
    "formatTitle": "التنسيق الهدف",
    "qualityTitle": "الجودة",
    "bgTitle": "خلفية غير شفافة",
    "bgWhite": "أبيض",
    "bgBlack": "أسود",
    "hint": "JPG و BMP بلا شفافية، لذلك تُملأ خلفية أولاً. ICO يُناسب مربعاً حتى 256 بكسل.",
    "listTitle": "الملفات",
    "colName": "الاسم",
    "colFrom": "من",
    "colDim": "الأبعاد",
    "colIn": "الأصل",
    "colOut": "بعد التحويل",
    "remove": "إزالة",
    "msgNotImage": "اختر ملفات صور.",
    "msgFail": "فشل التحويل.",
    "msgEmpty": "لا يوجد ما يمكن تنزيله بعد.",
    "msgAvifNo": "هذا المتصفح لا يصدّر AVIF."
  },
  "hi": {
    "title_page": "छवि प्रारूप बदलें",
    "desc": "एक या अधिक छवियाँ छोड़ें और PNG, JPG, WebP, BMP या ICO में बदलें। ब्राउज़र समर्थित हो तो AVIF भी। सब कुछ स्थानीय रहता है।",
    "reselect": "सब साफ़ करें",
    "download": "डाउनलोड",
    "downloadAll": "सभी डाउनलोड",
    "count": "{n} छवियाँ",
    "formatTitle": "लक्ष्य प्रारूप",
    "qualityTitle": "गुणवत्ता",
    "bgTitle": "अपारदर्शी पृष्ठभूमि",
    "bgWhite": "सफ़ेद",
    "bgBlack": "काला",
    "hint": "JPG और BMP में अल्फा नहीं होता, इसलिए पहले पृष्ठभूमि भरी जाती है। ICO अधिकतम 256 px वर्ग में फिट होता है।",
    "listTitle": "फ़ाइलें",
    "colName": "नाम",
    "colFrom": "से",
    "colDim": "आकार",
    "colIn": "मूल",
    "colOut": "बदला हुआ",
    "remove": "हटाएँ",
    "msgNotImage": "कृपया छवि फ़ाइलें चुनें।",
    "msgFail": "रूपांतरण असफल।",
    "msgEmpty": "अभी डाउनलोड करने को कुछ नहीं।",
    "msgAvifNo": "यह ब्राउज़र AVIF निर्यात नहीं कर सकता।"
  },
  "it": {
    "title_page": "Converti formato immagine",
    "desc": "Trascina una o più immagini e convertili in PNG, JPG, WebP, BMP o ICO. AVIF se il browser lo supporta. Tutto resta in locale.",
    "reselect": "Svuota",
    "download": "Scarica",
    "downloadAll": "Scarica tutto",
    "count": "{n} immagini",
    "formatTitle": "Formato destinazione",
    "qualityTitle": "Qualità",
    "bgTitle": "Sfondo opaco",
    "bgWhite": "Bianco",
    "bgBlack": "Nero",
    "hint": "JPG e BMP non hanno alfa: viene applicato uno sfondo. ICO è adattato a un quadrato fino a 256 px.",
    "listTitle": "File",
    "colName": "Nome",
    "colFrom": "Da",
    "colDim": "Dimensioni",
    "colIn": "Originale",
    "colOut": "Convertito",
    "remove": "Rimuovi",
    "msgNotImage": "Scegli file immagine.",
    "msgFail": "Conversione non riuscita.",
    "msgEmpty": "Non c’è ancora nulla da scaricare.",
    "msgAvifNo": "Questo browser non può esportare AVIF."
  },
  "nl": {
    "title_page": "Afbeeldingsformaat converteren",
    "desc": "Sleep afbeeldingen en zet ze om naar PNG, JPG, WebP, BMP of ICO. AVIF als de browser het kan. Alles blijft lokaal.",
    "reselect": "Alles wissen",
    "download": "Downloaden",
    "downloadAll": "Alles downloaden",
    "count": "{n} afbeeldingen",
    "formatTitle": "Doelformaat",
    "qualityTitle": "Kwaliteit",
    "bgTitle": "Ondoorzichtige achtergrond",
    "bgWhite": "Wit",
    "bgBlack": "Zwart",
    "hint": "JPG en BMP hebben geen alfa, dus eerst een achtergrond. ICO past in een vierkant tot 256 px.",
    "listTitle": "Bestanden",
    "colName": "Naam",
    "colFrom": "Van",
    "colDim": "Afmeting",
    "colIn": "Origineel",
    "colOut": "Geconverteerd",
    "remove": "Verwijderen",
    "msgNotImage": "Kies afbeeldingsbestanden.",
    "msgFail": "Conversie mislukt.",
    "msgEmpty": "Nog niets om te downloaden.",
    "msgAvifNo": "Deze browser kan geen AVIF exporteren."
  },
  "tr": {
    "title_page": "Görüntü biçimi dönüştür",
    "desc": "Görüntüleri bırakıp PNG, JPG, WebP, BMP veya ICO’ya dönüştürün. Tarayıcı destekliyorsa AVIF. Hepsi yerelde kalır.",
    "reselect": "Tümünü temizle",
    "download": "İndir",
    "downloadAll": "Tümünü indir",
    "count": "{n} görüntü",
    "formatTitle": "Hedef biçim",
    "qualityTitle": "Kalite",
    "bgTitle": "Opak arka plan",
    "bgWhite": "Beyaz",
    "bgBlack": "Siyah",
    "hint": "JPG ve BMP alfa desteklemez, önce arka plan doldurulur. ICO en fazla 256 px kareye sığdırılır.",
    "listTitle": "Dosyalar",
    "colName": "Ad",
    "colFrom": "Kaynak",
    "colDim": "Boyut",
    "colIn": "Orijinal",
    "colOut": "Dönüştürülen",
    "remove": "Kaldır",
    "msgNotImage": "Lütfen görüntü dosyaları seçin.",
    "msgFail": "Dönüştürme başarısız.",
    "msgEmpty": "İndirilecek bir şey yok.",
    "msgAvifNo": "Bu tarayıcı AVIF dışa aktaramaz."
  },
  "vi": {
    "title_page": "Chuyển định dạng ảnh",
    "desc": "Thả một hoặc nhiều ảnh và chuyển sang PNG, JPG, WebP, BMP hoặc ICO. AVIF nếu trình duyệt hỗ trợ. Mọi thứ xử lý cục bộ.",
    "reselect": "Xóa hết",
    "download": "Tải xuống",
    "downloadAll": "Tải tất cả",
    "count": "{n} ảnh",
    "formatTitle": "Định dạng đích",
    "qualityTitle": "Chất lượng",
    "bgTitle": "Nền đặc",
    "bgWhite": "Trắng",
    "bgBlack": "Đen",
    "hint": "JPG và BMP không có alpha nên sẽ tô nền trước. ICO được vừa vào hình vuông tối đa 256 px.",
    "listTitle": "Tệp",
    "colName": "Tên",
    "colFrom": "Từ",
    "colDim": "Kích thước",
    "colIn": "Gốc",
    "colOut": "Đã chuyển",
    "remove": "Xóa",
    "msgNotImage": "Hãy chọn tệp ảnh.",
    "msgFail": "Chuyển đổi thất bại.",
    "msgEmpty": "Chưa có gì để tải.",
    "msgAvifNo": "Trình duyệt này không xuất được AVIF."
  },
  "th": {
    "title_page": "แปลงรูปแบบรูปภาพ",
    "desc": "ลากรูปหนึ่งหรือหลายไฟล์แล้วแปลงเป็น PNG, JPG, WebP, BMP หรือ ICO รองรับ AVIF หากเบราว์เซอร์ทำได้ ทำทั้งหมดในเครื่อง",
    "reselect": "ล้างทั้งหมด",
    "download": "ดาวน์โหลด",
    "downloadAll": "ดาวน์โหลดทั้งหมด",
    "count": "{n} รูป",
    "formatTitle": "รูปแบบปลายทาง",
    "qualityTitle": "คุณภาพ",
    "bgTitle": "พื้นหลังทึบ",
    "bgWhite": "ขาว",
    "bgBlack": "ดำ",
    "hint": "JPG และ BMP ไม่มีแอลฟา จึงทาพื้นก่อน ICO จะพอดีกับสี่เหลี่ยมไม่เกิน 256 พิกเซล",
    "listTitle": "ไฟล์",
    "colName": "ชื่อ",
    "colFrom": "จาก",
    "colDim": "ขนาด",
    "colIn": "ต้นฉบับ",
    "colOut": "แปลงแล้ว",
    "remove": "ลบ",
    "msgNotImage": "โปรดเลือกไฟล์รูปภาพ",
    "msgFail": "แปลงไม่สำเร็จ",
    "msgEmpty": "ยังไม่มีไฟล์ให้ดาวน์โหลด",
    "msgAvifNo": "เบราว์เซอร์นี้ส่งออก AVIF ไม่ได้"
  },
  "id": {
    "title_page": "Konversi format gambar",
    "desc": "Letakkan satu atau lebih gambar dan ubah ke PNG, JPG, WebP, BMP, atau ICO. AVIF jika browser mendukung. Semuanya lokal.",
    "reselect": "Hapus semua",
    "download": "Unduh",
    "downloadAll": "Unduh semua",
    "count": "{n} gambar",
    "formatTitle": "Format tujuan",
    "qualityTitle": "Kualitas",
    "bgTitle": "Latar buram",
    "bgWhite": "Putih",
    "bgBlack": "Hitam",
    "hint": "JPG dan BMP tidak punya alfa, jadi latar diisi dulu. ICO dimasukkan ke kotak hingga 256 px.",
    "listTitle": "Berkas",
    "colName": "Nama",
    "colFrom": "Dari",
    "colDim": "Ukuran",
    "colIn": "Asli",
    "colOut": "Hasil",
    "remove": "Hapus",
    "msgNotImage": "Pilih berkas gambar.",
    "msgFail": "Konversi gagal.",
    "msgEmpty": "Belum ada yang bisa diunduh.",
    "msgAvifNo": "Browser ini tidak bisa mengekspor AVIF."
  },
  "ms": {
    "title_page": "Tukar format imej",
    "desc": "Letak satu atau lebih imej dan tukar kepada PNG, JPG, WebP, BMP atau ICO. AVIF jika pelayar menyokong. Semua kekal setempat.",
    "reselect": "Kosongkan",
    "download": "Muat turun",
    "downloadAll": "Muat semua",
    "count": "{n} imej",
    "formatTitle": "Format sasaran",
    "qualityTitle": "Kualiti",
    "bgTitle": "Latar legap",
    "bgWhite": "Putih",
    "bgBlack": "Hitam",
    "hint": "JPG dan BMP tiada alfa, jadi latar diisi dahulu. ICO dimuatkan ke segi empat hingga 256 px.",
    "listTitle": "Fail",
    "colName": "Nama",
    "colFrom": "Dari",
    "colDim": "Saiz",
    "colIn": "Asal",
    "colOut": "Ditukar",
    "remove": "Buang",
    "msgNotImage": "Sila pilih fail imej.",
    "msgFail": "Penukaran gagal.",
    "msgEmpty": "Belum ada yang boleh dimuat turun.",
    "msgAvifNo": "Pelayar ini tidak boleh mengeksport AVIF."
  },
  "pl": {
    "title_page": "Konwersja formatu obrazu",
    "desc": "Upuść obrazy i zamień je na PNG, JPG, WebP, BMP lub ICO. AVIF, jeśli przeglądarka to umie. Wszystko lokalnie.",
    "reselect": "Wyczyść",
    "download": "Pobierz",
    "downloadAll": "Pobierz wszystko",
    "count": "{n} obrazów",
    "formatTitle": "Format docelowy",
    "qualityTitle": "Jakość",
    "bgTitle": "Nieprzezroczyste tło",
    "bgWhite": "Białe",
    "bgBlack": "Czarne",
    "hint": "JPG i BMP nie mają alfy, więc najpierw wypełniane jest tło. ICO mieści się w kwadracie do 256 px.",
    "listTitle": "Pliki",
    "colName": "Nazwa",
    "colFrom": "Z",
    "colDim": "Wymiary",
    "colIn": "Oryginał",
    "colOut": "Po konwersji",
    "remove": "Usuń",
    "msgNotImage": "Wybierz pliki obrazów.",
    "msgFail": "Konwersja nie powiodła się.",
    "msgEmpty": "Nie ma jeszcze nic do pobrania.",
    "msgAvifNo": "Ta przeglądarka nie eksportuje AVIF."
  },
  "uk": {
    "title_page": "Конвертація формату зображень",
    "desc": "Перетягніть зображення й конвертуйте в PNG, JPG, WebP, BMP або ICO. AVIF — якщо браузер вміє. Усе локально.",
    "reselect": "Очистити",
    "download": "Завантажити",
    "downloadAll": "Завантажити все",
    "count": "{n} зобр.",
    "formatTitle": "Цільовий формат",
    "qualityTitle": "Якість",
    "bgTitle": "Непрозорий фон",
    "bgWhite": "Білий",
    "bgBlack": "Чорний",
    "hint": "У JPG і BMP немає альфи, тож спочатку заливається фон. ICO вписується в квадрат до 256 px.",
    "listTitle": "Файли",
    "colName": "Назва",
    "colFrom": "З",
    "colDim": "Розмір",
    "colIn": "Було",
    "colOut": "Стало",
    "remove": "Прибрати",
    "msgNotImage": "Оберіть файли зображень.",
    "msgFail": "Помилка конвертації.",
    "msgEmpty": "Поки нічого завантажувати.",
    "msgAvifNo": "Цей браузер не експортує AVIF."
  },
  "sv": {
    "title_page": "Konvertera bildformat",
    "desc": "Släpp bilder och konvertera till PNG, JPG, WebP, BMP eller ICO. AVIF om webbläsaren stödjer det. Allt stannar lokalt.",
    "reselect": "Rensa allt",
    "download": "Ladda ner",
    "downloadAll": "Ladda ner alla",
    "count": "{n} bilder",
    "formatTitle": "Målformat",
    "qualityTitle": "Kvalitet",
    "bgTitle": "Ogenomskinlig bakgrund",
    "bgWhite": "Vit",
    "bgBlack": "Svart",
    "hint": "JPG och BMP saknar alfa, så en bakgrund fylls först. ICO anpassas till en kvadrat på högst 256 px.",
    "listTitle": "Filer",
    "colName": "Namn",
    "colFrom": "Från",
    "colDim": "Storlek",
    "colIn": "Original",
    "colOut": "Konverterad",
    "remove": "Ta bort",
    "msgNotImage": "Välj bildfiler.",
    "msgFail": "Konverteringen misslyckades.",
    "msgEmpty": "Inget att ladda ner ännu.",
    "msgAvifNo": "Den här webbläsaren kan inte exportera AVIF."
  },
  "zh-TW": {
    "title_page": "圖片格式轉換",
    "desc": "拖入一張或多張圖片，批次轉為 PNG、JPG、WebP、BMP、ICO，瀏覽器支援時也可匯出 AVIF。處理都在本機完成，不上傳伺服器。",
    "reselect": "清空重選",
    "download": "下載",
    "downloadAll": "全部下載",
    "count": "共 {n} 張",
    "formatTitle": "目標格式",
    "qualityTitle": "畫質",
    "bgTitle": "不透明底色",
    "bgWhite": "白",
    "bgBlack": "黑",
    "hint": "JPG / BMP 不支援透明通道，會先鋪底色。ICO 會等比例放入不超過 256 的正方形。",
    "listTitle": "檔案列表",
    "colName": "檔名",
    "colFrom": "原格式",
    "colDim": "尺寸",
    "colIn": "原大小",
    "colOut": "轉換後",
    "remove": "移除",
    "msgNotImage": "請選擇圖片檔案。",
    "msgFail": "轉換失敗。",
    "msgEmpty": "還沒有可下載的結果。",
    "msgAvifNo": "目前瀏覽器不支援匯出 AVIF。"
  }
}
</i18n>
