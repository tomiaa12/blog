<template>
  <div class="play">
    <div
      class="main"
      :style="screenSize"
    >
      <div
        v-if="loading || loadError"
        class="loading"
      >
        <template v-if="loadError">
          <p>{{ loadError }}</p>
        </template>
        <template v-else>
          <p class="title">{{ rom.displayName }}</p>
          <p class="stage">{{ loadingText }}</p>
          <div class="progress-wrap">
            <el-progress
              :percentage="loadingPercent"
              :stroke-width="14"
              :show-text="loadingPercent > 0"
              color="#e85d4c"
            />
            <div
              v-if="!loadingPercent"
              class="progress-wait"
            />
          </div>
        </template>
      </div>
      <div
        :id="playerId"
        :key="session"
        class="ejs-host"
      />
    </div>

    <div class="control">
      <el-tooltip
        :content="isPlaying ? '暂停' : '继续'"
        placement="top"
      >
        <el-icon
          size="36"
          @click="togglePlay"
        >
          <component :is="isPlaying ? pauseSvg : startSvg" />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        content="重启"
        placement="top"
      >
        <el-icon
          size="36"
          @click="reset"
        >
          <restartSvg />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        content="存档"
        placement="top"
      >
        <el-icon
          size="36"
          @click="showDialog"
        >
          <saveSvg />
        </el-icon>
      </el-tooltip>
      <div class="right">
        <el-tooltip
          content="全屏"
          placement="top"
        >
          <el-icon
            size="36"
            @click="fullscreen"
          >
            <el-icon-full-screen />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          content="截图"
          placement="top"
        >
          <el-icon
            size="36"
            @click="screenshot"
          >
            <el-icon-camera />
          </el-icon>
        </el-tooltip>
      </div>
    </div>

    <el-dialog
      v-model="show"
      title="存档"
    >
      <div
        v-for="(slot, index) in saveDatas"
        :key="index"
        class="save-data"
      >
        <div>
          <template v-if="slot">
            <img
              :src="slot.image"
              :alt="rom.displayName"
            />
            <div class="title">
              <div>{{ rom.displayName }}</div>
              <time>保存于{{ slot.date }}</time>
            </div>
            <el-button
              type="danger"
              @click="remove(index)"
            >
              删除
            </el-button>
            <el-button
              type="primary"
              @click="load(index)"
            >
              读取
            </el-button>
          </template>
          <template v-else>
            <div class="empty-img" />
            <div class="title empty">空</div>
          </template>
          <el-button
            type="primary"
            @click="save(index)"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { ElNotification } from "element-plus"
import startSvg from "../game/svg/start.svg"
import pauseSvg from "../game/svg/pause.svg"
import restartSvg from "../game/svg/restart.svg"
import saveSvg from "../game/svg/save.svg"
import { arcadeGameId, EmulatorJSAdapter } from "./EmulatorJSAdapter"
import { arcadeControls, buildEjsControllers } from "./controls"
import { resolveCores, getSystemOption } from "./cores"
import {
  getUnsupportedReason,
  guessParentRomId,
  isRomsetId,
  resolveRecordSetName,
  ROMSET_NAME_HINT,
  romsetZipName,
} from "./detectRom"
import { supportsEmulatorRuntime } from "./emulatorjs"
import {
  blobToArrayBuffer,
  deleteSaveSlot,
  getArcadeRecord,
  listSaveSlots,
  putSaveSlot,
  type ArcadeRecord,
  type ArcadeSaveSlot,
} from "./store"

const props = defineProps<{
  rom: ArcadeRecord
  romList: ArcadeRecord[]
  biosList: ArcadeRecord[]
}>()

const playerId = "arcade-ejs-player"
const session = ref(0)
const loading = ref(true)
const loadingText = ref("正在准备模拟器")
const loadingPercent = ref(0)
const loadError = ref("")
const isPlaying = ref(true)
const show = ref(false)
const saveDatas = ref<(ArcadeSaveSlot | null)[]>([null, null, null])
const screenSize = ref({
  width: "720px",
  height: "540px",
})

let adapter: EmulatorJSAdapter | null = null
let abort: AbortController | null = null
let isManualPause = false

function toFile(record: ArcadeRecord, fileName = record.id) {
  return new File([record.data], fileName, { type: "application/zip" })
}

function initScreenSize() {
  const { clientWidth } = document.documentElement
  const { innerHeight } = window
  let width = Math.min(clientWidth * 0.58, 960)
  if (clientWidth < 768) width = clientWidth - 40
  let height = (width * 3) / 4
  if (height > innerHeight * 0.72) {
    height = innerHeight * 0.72
    width = (height * 4) / 3
  }
  screenSize.value = {
    width: `${Math.round(width)}px`,
    height: `${Math.round(height)}px`,
  }
}

async function collectFiles(setName = props.rom.id) {
  const extras: ArcadeRecord[] = []
  const seen = new Set<string>([props.rom.id, romsetZipName(setName)])
  const pushExtra = (item?: ArcadeRecord) => {
    if (!item || seen.has(item.id)) return
    seen.add(item.id)
    extras.push(item)
  }
  for (const extraId of props.rom.extraIds || []) {
    pushExtra(
      props.romList.find(item => item.id === extraId) ||
        (await getArcadeRecord(extraId))
    )
  }
  const parentId = guessParentRomId(setName)
  let parent: ArcadeRecord | undefined
  if (parentId) {
    parent =
      props.romList.find(item => item.id === parentId) ||
      (await getArcadeRecord(parentId))
    if (parent) seen.add(parent.id)
  }
  const system = getSystemOption(props.rom.system)
  const bios = props.biosList.find(
    item =>
      item.id === (system?.biosName || "neogeo.zip") ||
      item.system === props.rom.system
  )
  return { extras, parent, bios, system }
}

async function launchGame() {
  abort?.abort()
  adapter?.destroy()
  adapter = null
  session.value += 1

  loading.value = true
  loadError.value = ""
  loadingText.value = "正在准备模拟器"
  loadingPercent.value = 0
  isPlaying.value = true
  isManualPause = false

  const controller = new AbortController()
  abort = controller

  try {
    const runtimeError = supportsEmulatorRuntime()
    if (runtimeError) throw new Error(runtimeError)

    const setName = await resolveRecordSetName(props.rom.id, props.rom.data)
    const unsupported = getUnsupportedReason(setName)
    if (unsupported) throw new Error(unsupported)
    if (!isRomsetId(setName)) throw new Error(ROMSET_NAME_HINT)

    const romZip = romsetZipName(setName)
    const { extras, parent, bios, system } = await collectFiles(setName)
    if (controller.signal.aborted) return
    if (system?.needsBios && !bios) {
      throw new Error(`需要系统文件 ${system.biosName || "neogeo.zip"}，请先拖入后再开始`)
    }

    await nextTick()
    const cores = resolveCores(props.rom.system, props.rom.core)
    let lastError = ""

    for (let i = 0; i < cores.length; i++) {
      if (controller.signal.aborted) return
      if (i > 0) {
        loadingText.value = "正在尝试备用模拟器"
        loadingPercent.value = 0
        adapter?.destroy()
        adapter = null
        session.value += 1
        await nextTick()
      }

      const next = new EmulatorJSAdapter()
      adapter = next
      try {
        await next.start({
          player: `#${playerId}`,
          rom: toFile(props.rom, romZip),
          core: cores[i],
          bios: bios ? toFile(bios) : undefined,
          parent: parent ? toFile(parent) : undefined,
          extras: extras.map(item => toFile(item)),
          gameName: romZip,
          gameId: arcadeGameId(romZip),
          controllers: buildEjsControllers(),
          onRomsetUnknown: () => {
            loadError.value =
              "这个 ROM 无法被识别。请确认 zip 是官方短文件名（如 kof97.zip），且内容完整"
            loading.value = false
            ElNotification.error(loadError.value)
          },
          onProgress: info => {
            loadingText.value = info.text
            if (info.percent > 0) loadingPercent.value = info.percent
          },
        })
        lastError = ""
        break
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err)
        next.destroy()
        if (adapter === next) adapter = null
      }
    }

    if (controller.signal.aborted) {
      adapter?.destroy()
      adapter = null
      return
    }
    if (lastError || !adapter) {
      throw new Error(
        lastError || "游戏无法运行：ROM 不完整、缺少母 ROM / 系统文件，或 romset 不匹配"
      )
    }
    loading.value = false
  } catch (err) {
    if (controller.signal.aborted) return
    loading.value = false
    const message = err instanceof Error ? err.message : String(err)
    loadError.value = message || "游戏启动失败"
    ElNotification.error(loadError.value)
  }
}

async function refreshSaves() {
  const slots = await listSaveSlots(props.rom.id)
  const next: (ArcadeSaveSlot | null)[] = [null, null, null]
  slots.forEach(slot => {
    if (slot.index >= 0 && slot.index < 3) next[slot.index] = slot
  })
  saveDatas.value = next
}

function getNow() {
  const pad = (n: number) => String(n).padStart(2, "0")
  const time = new Date()
  return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
}

const togglePlay = () => {
  if (!adapter) return
  if (isPlaying.value) {
    isManualPause = true
    adapter.pause()
    isPlaying.value = false
  } else {
    isManualPause = false
    adapter.resume()
    isPlaying.value = true
  }
}

const reset = () => {
  if (!adapter) return
  adapter.reset()
  isPlaying.value = true
  isManualPause = false
}

const fullscreen = () => {
  adapter?.fullscreen()
}

const screenshot = async () => {
  if (!adapter) return
  const blob = await adapter.screenshot()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${props.rom.displayName}.png`
  a.click()
  URL.revokeObjectURL(url)
}

const showDialog = () => {
  show.value = true
  if (adapter && isPlaying.value) {
    adapter.pause()
    isPlaying.value = false
  }
}

async function save(index: number) {
  if (!adapter) return
  adapter.resume()
  await nextTick()
  const state = await adapter.saveState()
  adapter.pause()
  isPlaying.value = false
  let image = ""
  try {
    image = await blobToDataUrl(await adapter.screenshot())
  } catch {
    image = ""
  }
  const slot: ArcadeSaveSlot = {
    id: `${props.rom.id}_${index}`,
    romId: props.rom.id,
    index,
    state: await blobToArrayBuffer(state),
    image,
    date: getNow(),
  }
  await putSaveSlot(slot)
  saveDatas.value[index] = slot
}

async function load(index: number) {
  if (!adapter) return
  const slot = saveDatas.value[index]
  if (!slot) return
  adapter.resume()
  isPlaying.value = true
  isManualPause = false
  await nextTick()
  await adapter.loadState(new Blob([slot.state]))
  show.value = false
}

async function remove(index: number) {
  const slot = saveDatas.value[index]
  if (!slot) return
  await deleteSaveSlot(slot.id)
  saveDatas.value[index] = null
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

const onFocus = () => {
  if (!adapter || isManualPause || show.value || arcadeControls.listening) return
  adapter.resume()
  isPlaying.value = true
}
const onBlur = () => {
  if (!adapter) return
  adapter.pause()
  isPlaying.value = false
}

watch(
  () => props.rom.id,
  async () => {
    initScreenSize()
    await refreshSaves()
    await nextTick()
    await launchGame()
  }
)

watch(
  () => [arcadeControls.playerCount, arcadeControls.maps],
  () => {
    adapter?.applyControllers(buildEjsControllers())
  },
  { deep: true }
)

watch(
  () => arcadeControls.listening,
  listening => {
    if (!adapter) return
    if (listening) {
      adapter.pause()
      isPlaying.value = false
      return
    }
    if (isManualPause || show.value) return
    adapter.resume()
    isPlaying.value = true
  }
)

onMounted(async () => {
  window.addEventListener("resize", initScreenSize)
  window.addEventListener("focus", onFocus)
  window.addEventListener("blur", onBlur)
  initScreenSize()
  await refreshSaves()
  await nextTick()
  await launchGame()
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", initScreenSize)
  window.removeEventListener("focus", onFocus)
  window.removeEventListener("blur", onBlur)
  abort?.abort()
  adapter?.destroy()
  adapter = null
})
</script>

<style lang="scss" scoped>
.play {
  flex: 1;
  min-width: 0;
}
.main {
  position: relative;
  margin: 0 auto;
  background: #000;
  overflow: hidden;
}
.ejs-host {
  width: 100%;
  height: 100%;
  :deep(.ejs_parent) {
    width: 100%;
    height: 100%;
  }
  :deep(.ejs_loading_text) {
    opacity: 0;
    pointer-events: none;
  }
}
.loading {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.88);
  gap: 14px;
  padding: 24px;
  .title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
  .stage {
    margin: 0;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.82);
  }
}
.progress-wrap {
  position: relative;
  width: min(380px, 86%);
  :deep(.el-progress__text) {
    color: #fff;
    font-size: 14px;
  }
}
.progress-wait {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 14px;
  overflow: hidden;
  border-radius: 100px;
  pointer-events: none;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40%;
    border-radius: inherit;
    background: #e85d4c;
    animation: arcade-load 1.1s ease-in-out infinite;
  }
}
@keyframes arcade-load {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(280%);
  }
}
.control {
  padding: 0.5em 0.2em;
  .el-icon {
    cursor: pointer;
    margin-right: 0.3em;
    img {
      width: 36px;
      height: 36px;
    }
  }
  .right {
    float: right;
  }
}
.save-data {
  display: flex;
  margin-bottom: 1em;
  min-height: 45px;
  border: 1px solid var(--el-border-color);
  > div {
    width: 100%;
    display: flex;
    align-items: center;
    img {
      height: 48px;
      width: 64px;
      object-fit: cover;
    }
    .title {
      margin-left: 1em;
      flex: 1;
    }
    .empty {
      text-align: center;
      line-height: 46px;
    }
    .empty-img {
      width: 64px;
      height: 48px;
      border-right: 1px solid var(--el-border-color);
    }
  }
}
</style>
