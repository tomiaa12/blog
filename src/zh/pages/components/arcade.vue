<template>
  <div
    class="arcade-page"
    :class="{ 'is-mobile': isMobile, 'is-dragging': dragging }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="romInputRef"
      accept=".zip"
      type="file"
      multiple
      hidden
      @change="handlePickRoms"
    />
    <input
      ref="biosInputRef"
      accept=".zip"
      type="file"
      hidden
      @change="handlePickBios"
    />

    <template v-if="curRom">
      <el-button
        class="back"
        text
        icon="el-icon-arrow-left"
        @click="curRom = null"
      >
        返回游戏列表
      </el-button>
      <main>
        <aside class="options">
          <el-descriptions
            :title="curRom.displayName"
            :column="1"
            border
          >
            <el-descriptions-item label="平台">
              {{ getSystemOption(curRom.system)?.label || "街机" }}
            </el-descriptions-item>
            <el-descriptions-item label="文件">
              {{ curRom.id }}
            </el-descriptions-item>
            <el-descriptions-item label="容量">
              {{ formatSize(curRom.size) }}
            </el-descriptions-item>
          </el-descriptions>
          <h3>键位</h3>
          <Keymap />
        </aside>
        <PlayArcade
          :rom="curRom"
          :rom-list="romRecords"
          :bios-list="biosRecords"
        />
      </main>
    </template>

    <template v-else>
      <section
        class="dropzone"
        :class="{ over: dragging }"
        @click="romInputRef?.click()"
      >
        <strong>把 ROM 拖到这里</strong>
        <span>或点击选择 zip 文件</span>
        <em>文件只留在本机，不会上传服务器</em>
      </section>

      <SearchCategory
        v-model="keyword"
        v-model:cate="curCategory"
        :data="categorysData"
        placeholder="搜索已安装游戏"
      />

      <section class="block">
        <div class="block-head">
          <h3>已安装游戏（{{ filteredRoms.length }}）</h3>
          <el-button
            type="primary"
            size="small"
            :loading="uploading"
            @click="romInputRef?.click()"
          >
            添加 ROM
          </el-button>
        </div>
        <p
          v-if="!filteredRoms.length"
          class="empty"
        >
          还没有游戏。把 zip 拖到上方区域，识别成功后会自动开始。
        </p>
        <ul
          v-else
          class="rom-list"
        >
          <li
            v-for="item in filteredRoms"
            :key="item.id"
            @click="playRom(item)"
          >
            <div class="thumb">ZIP</div>
            <div class="meta">
              <strong>{{ item.displayName }}</strong>
              <span>{{ item.id }}</span>
            </div>
            <el-tag size="small">{{ getSystemOption(item.system)?.label || "街机" }}</el-tag>
            <span class="size">{{ formatSize(item.size) }}</span>
            <el-button
              type="danger"
              text
              size="small"
              @click.stop="handleDelete(item)"
            >
              卸载
            </el-button>
          </li>
        </ul>
      </section>

      <el-dialog
        v-model="biosVisible"
        title="还差一个文件"
        width="420px"
        :close-on-click-modal="false"
      >
        <p class="bios-tip">
          「{{ pendingRom?.displayName || "这款游戏" }}」是 Neo Geo，需要你自己的
          <code>neogeo.zip</code>
          。拖进来或点选即可，只保存在本机。
        </p>
        <div
          class="bios-drop"
          @click="biosInputRef?.click()"
          @dragover.prevent
          @drop.prevent="onBiosDrop"
        >
          拖入 neogeo.zip
        </div>
        <template #footer>
          <el-button @click="cancelBiosPrompt">取消</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { isMobile } from "@/utils"
import SearchCategory from "./common/SearchCategory.vue"
import PlayArcade from "./arcade/PlayArcade.vue"
import Keymap from "./arcade/keymap.vue"
import { getUnsupportedReason, inspectArcadeRom } from "./arcade/detectRom"
import {
  ARCADE_SYSTEMS,
  getSystemOption,
  inferBiosSystem,
} from "./arcade/cores"
import { supportsEmulatorRuntime } from "./arcade/emulatorjs"
import {
  deleteArcadeRecord,
  formatSize,
  installArcadeFile,
  listArcadeRecords,
  type ArcadeRecord,
} from "./arcade/store"

const keyword = ref("")
const curCategory = ref("")
const curRom = ref<ArcadeRecord | null>(null)
const records = ref<ArcadeRecord[]>([])
const romInputRef = ref<HTMLInputElement | null>(null)
const biosInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const dragging = ref(false)
const biosVisible = ref(false)
const pendingRom = ref<ArcadeRecord | null>(null)
let dragDepth = 0

const categorysData = ARCADE_SYSTEMS.map(item => ({
  label: item.label,
  value: item.id,
}))

const romRecords = computed(() =>
  records.value
    .filter(item => item.kind === "rom")
    .slice()
    .sort((a, b) => b.installedAt - a.installedAt)
)

const biosRecords = computed(() =>
  records.value
    .filter(item => item.kind === "bios")
    .slice()
    .sort((a, b) => b.installedAt - a.installedAt)
)

const filteredRoms = computed(() => {
  let list = romRecords.value
  if (curCategory.value) {
    list = list.filter(item => item.system === curCategory.value)
  }
  const kw = keyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter(
      item =>
        item.displayName.toLowerCase().includes(kw) ||
        item.id.toLowerCase().includes(kw)
    )
  }
  return list
})

async function refresh() {
  try {
    records.value = await listArcadeRecords()
  } catch (err) {
    console.warn(err)
    records.value = []
  }
}

function hasBiosFor(item: ArcadeRecord) {
  const opt = getSystemOption(item.system)
  if (!opt?.needsBios) return true
  return biosRecords.value.some(
    bios => bios.system === item.system || bios.id === opt.biosName
  )
}

async function playRom(item: ArcadeRecord) {
  const blocked = getUnsupportedReason(item.id)
  if (blocked) {
    ElMessage.error(blocked)
    return
  }
  const runtimeError = supportsEmulatorRuntime()
  if (runtimeError) {
    ElMessage.error(runtimeError)
    return
  }
  if (!hasBiosFor(item)) {
    pendingRom.value = item
    biosVisible.value = true
    return
  }
  curRom.value = item
}

function cancelBiosPrompt() {
  biosVisible.value = false
  pendingRom.value = null
}

async function saveBiosFile(file: File) {
  if (file.name.toLowerCase() !== "neogeo.zip") {
    ElMessage.error("请拖入 neogeo.zip")
    return
  }
  uploading.value = true
  try {
    await installArcadeFile({
      file,
      kind: "bios",
      system: inferBiosSystem(file.name) || "neogeo",
      displayName: file.name,
    })
    await refresh()
    biosVisible.value = false
    const next = pendingRom.value
    pendingRom.value = null
    ElMessage.success("已保存，正在开始游戏")
    if (next) await playRom(next)
  } catch (err) {
    console.error(err)
    ElMessage.error("保存失败")
  } finally {
    uploading.value = false
  }
}

async function onBiosDrop(e: DragEvent) {
  const file = zipFilesFromList(e.dataTransfer?.files || null)[0]
  if (!file) {
    ElMessage.error("请拖入 neogeo.zip")
    return
  }
  await saveBiosFile(file)
}

function resetFileInput(input: HTMLInputElement | null) {
  if (input) input.value = ""
}

function zipFilesFromList(list: FileList | File[] | null) {
  return Array.from(list || []).filter(f => f.name.toLowerCase().endsWith(".zip"))
}

function onDragEnter() {
  if (curRom.value) return
  dragDepth += 1
  dragging.value = true
}

function onDragOver() {
  if (curRom.value) return
  dragging.value = true
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (!dragDepth) dragging.value = false
}

async function onDrop(e: DragEvent) {
  dragging.value = false
  dragDepth = 0
  if (curRom.value) return
  const files = zipFilesFromList(e.dataTransfer?.files || null)
  if (!files.length) {
    ElMessage.error("请拖入 zip 格式的 ROM")
    return
  }
  await installFiles(files)
}

async function handlePickRoms(e: Event) {
  const input = e.target as HTMLInputElement
  const files = zipFilesFromList(input.files)
  resetFileInput(input)
  if (!files.length) {
    ElMessage.error("请选择 zip 格式的 ROM")
    return
  }
  await installFiles(files)
}

async function installFiles(files: File[]) {
  uploading.value = true
  const installed: ArcadeRecord[] = []
  try {
    for (const file of files) {
      if (file.name.toLowerCase() === "neogeo.zip") {
        const rec = await installArcadeFile({
          file,
          kind: "bios",
          system: "neogeo",
          displayName: file.name,
        })
        ElMessage.success(`${file.name} 已保存`)
        installed.push(rec)
        continue
      }

      const info = await inspectArcadeRom(file)
      if (!info.ok) {
        ElMessage.error(`${file.name}：${info.reason}`)
        continue
      }
      const rec = await installArcadeFile({
        file,
        id: `${info.setName}.zip`,
        kind: "rom",
        core: info.core,
        system: info.system,
        displayName: info.displayName,
      })
      installed.push(rec)
      const platform = getSystemOption(info.system)?.label || "街机"
      const extra = info.cloneOf
        ? `。这像是克隆版，若无法运行请再拖入母 ROM ${info.cloneOf}.zip`
        : ""
      ElMessage.success(`${file.name} 已识别为 ${platform}${extra}`)
    }
  } catch (err) {
    console.error(err)
    ElMessage.error("安装失败")
  } finally {
    uploading.value = false
  }

  if (installed.length) await refresh()

  const playable = installed.filter(item => item.kind === "rom")
  if (playable.length === 1) {
    await playRom(playable[0])
  }
}

async function handlePickBios(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  resetFileInput(input)
  if (!file) return
  await saveBiosFile(file)
}

async function handleDelete(item: ArcadeRecord) {
  try {
    await ElMessageBox.confirm(`确定卸载 ${item.displayName} 吗？`, "确认卸载", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
    await deleteArcadeRecord(item.id)
    ElMessage.success("已卸载")
    await refresh()
  } catch (err) {
    if (err === "cancel") return
    console.error(err)
    ElMessage.error("卸载失败")
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<style lang="scss" scoped>
.arcade-page {
  padding: 1rem 3.8rem 2rem;
  &.is-mobile {
    padding: 16px;
  }
}
.back {
  margin-bottom: 1em;
}
main {
  display: flex;
  gap: 1.2em;
  align-items: flex-start;
}
.options {
  width: 28%;
  max-width: 420px;
  min-width: 260px;
  h3 {
    margin: 1.2em 0 0.6em;
    font-size: 16px;
  }
}
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 180px;
  margin-bottom: 24px;
  padding: 24px;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s, background 0.2s;
  strong {
    font-size: 22px;
  }
  span {
    color: var(--vp-c-text-2);
  }
  em {
    font-style: normal;
    font-size: 13px;
    color: var(--vp-c-text-3);
  }
  &:hover,
  &.over {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-bg);
  }
}
.arcade-page.is-dragging .dropzone {
  border-color: var(--vp-c-brand-1);
}
.block {
  margin-bottom: 24px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  h3 {
    margin: 0;
    font-size: 18px;
  }
}
.empty {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}
.bios-tip {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.bios-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  &:hover {
    border-color: var(--vp-c-brand-1);
  }
}
.rom-list {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    margin-bottom: 8px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
  }
}
.rom-list li {
  cursor: pointer;
  &:hover {
    border-color: var(--vp-c-brand-1);
  }
}
.thumb {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
}
.meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    color: var(--vp-c-text-3);
    font-size: 12px;
  }
}
.size {
  color: var(--vp-c-text-3);
  font-size: 12px;
  white-space: nowrap;
}
@media screen and (max-width: 960px) {
  main {
    flex-direction: column;
  }
  .options {
    width: 100%;
    max-width: none;
  }
}
</style>
