<template>
  <div class="play">
    <div class="main">
      <span>{{ fps }}</span>
      <component
        :is="nesVue"
        ref="nesVueRef"
        class="nes-vue"
        label="开始游戏"
        :auto-start="true"
        :url="baseUrl + 'roms/' + curRom.url"
        :width="screenSize.width"
        :height="screenSize.height"
        @error="nesErrorAlert"
        @success="success"
        @fps="fpsChange"
      />
    </div>
    <div class="control">
      <el-tooltip
        :content="isPlaying ? '暂停' : '继续'"
        placement="top"
      >
        <el-icon
          size="36"
          @click="play"
        >
          <img :src="isPlaying ? pause : start" />
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
          <img :src="restart" />
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
          <img :src="saveSvg" />
        </el-icon>
      </el-tooltip>
      <div class="right">
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
        v-for="(saveData, index) in saveDatas"
        class="save-data"
      >
        <div v-if="curRom">
          <template v-if="saveData.id !== '-1'">
            <img
              :src="saveData.image"
              :alt="saveData.title"
            />
            <div class="title">
              <div>{{ saveData.title }}</div>
              <time>保存于{{ saveData.date }}</time>
            </div>
            <el-button
              type="danger"
              @click="remove(index)"
            >
              删除
            </el-button>
            <el-button
              type="primary"
              class="text-color-var-primary-front"
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
            class="text-color-var-primary-front"
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
import {
  ref,
  onBeforeUnmount,
  onMounted,
  watch,
  shallowRef,
  unref,
  nextTick,
} from "vue"
import { ElNotification } from "element-plus"

import start from "./svg/start.svg"
import pause from "./svg/pause.svg"
import restart from "./svg/restart.svg"
import saveSvg from "./svg/save.svg"

interface SaveData {
  id: string
  image: string
  title: string
  date: string
}

const props = defineProps<{
  curRom: any
  baseUrl: string
}>()
const emits = defineEmits([])

const nesVue = shallowRef()

onMounted(() => {
  import("nes-vue").then(({ NesVue }) => {
    nesVue.value = NesVue
  })
})

// 游戏画面大小
const screenSize = ref({
  width: "512px",
  height: "480px",
})

// 缓存画面大小
const lastSize = {
  width: screenSize.value.width,
  height: screenSize.value.height,
}

const isPlaying = ref(true)

watch(
  () => props.curRom,
  () => (isPlaying.value = true)
)

watch(isPlaying, () => {
  if (isPlaying.value) nesVueRef.value.play()
  else nesVueRef.value.pause()
})

// 全屏切换
let isFullScreen = false // 全屏状态
// 初始化游戏画面大小
function initScreenSize() {
  const { clientWidth } = document.documentElement
  const { innerHeight } = window
  let width = clientWidth * 0.6
  if (clientWidth < 768) {
    width = clientWidth - 40
  }
  let height = (width * 240) / 256
  if (height > innerHeight * 0.8) {
    height = innerHeight * 0.8
    width = (height * 256) / 240
  }
  screenSize.value.width = width + "px"
  screenSize.value.height = height + "px"
}

// 调整画面大小
function fullscreenHandler() {
  if (document.fullscreenElement) {
    isFullScreen = true
    lastSize.width = screenSize.value.width
    lastSize.height = screenSize.value.height
    screenSize.value.width = "100vw"
    screenSize.value.height = "100vh"
  } else if (isFullScreen) {
    isFullScreen = false
    screenSize.value.width = lastSize.width
    screenSize.value.height = lastSize.height
  } else {
    initScreenSize()
  }
}

// 错误处理
function nesErrorAlert(e: any) {
  const errCode: any = {
    404: "无法获取ROM：地址无效或网络错误",
    0: "不支持的游戏ROM",
    1: "保存失败",
    2: "存档不存在或数据错误",
  }
  errCode[e.code] && ElNotification.error(errCode[e.code])
}

const nesVueRef = ref()

// 是否为手动点击暂停
let isManualPause = false

const onFocus = () => {
  if (!nesVueRef.value || isManualPause) return
  isPlaying.value = true
}
const onBlur = () => {
  if (!nesVueRef.value) return
  isPlaying.value = false
}

onMounted(() => {
  window.addEventListener("resize", fullscreenHandler)
  window.addEventListener("focus", onFocus)
  window.addEventListener("blur", onBlur)
  fullscreenHandler()

  Object.assign(saveDatas.value, getStorage(props.curRom.id, setEmptyData()))
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", fullscreenHandler)
  window.removeEventListener("focus", onFocus)
  window.removeEventListener("blur", onBlur)
})

const play = () => {
  if (isPlaying.value) {
    isManualPause = true
  } else {
    isManualPause = false
  }
  isPlaying.value = !isPlaying.value
}

const reset = () => {
  nesVueRef.value.reset()
  isPlaying.value = true
  isManualPause = false
}

watch(() => props.curRom, fullscreenHandler)

const success = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  })
}

const fps = ref()
const fpsChange = (n: number) => {
  fps.value = n.toFixed(2)
}

const screenshot = () => nesVueRef.value.screenshot(true)

// 存档弹窗
const show = ref(false)

const showDialog = () => {
  show.value = true
  isPlaying.value = false
}

// 空存档对象
const emptySaveData: SaveData = {
  id: "-1",
  image: "",
  title: "",
  date: "",
}
// 设置空存档
function setEmptyData(): SaveData[] {
  return Array.from<SaveData>({ length: 3 }).fill(emptySaveData)
}

const saveDatas = ref<SaveData[]>(setEmptyData())

const removeStorage = (key: string) => localStorage.removeItem("game_" + key)
const setStorage = (key: string, value: any) =>
  localStorage.setItem("game_" + key, JSON.stringify(value))
const getStorage = (key: string, empty: any) => {
  const data = localStorage.getItem("game_" + key)
  return data ? JSON.parse(data) : empty
}

// 存档id
const getSaveId = (index: number) => `${props.curRom.id}_${index}`

// 删除存档
function remove(index: number) {
  nesVueRef.value.remove(getSaveId(index))
  saveDatas.value[index ?? 0] = emptySaveData
  if (saveDatas.value.every(item => item.id === "-1")) {
    removeStorage(props.curRom.id)
  } else {
    setStorage(props.curRom.id, unref(saveDatas))
  }
}

// 加载存档
async function load(index?: number) {
  isPlaying.value = true
  await nextTick()
  nesVueRef.value.load(getSaveId(index ?? 0))
  show.value = false
}

// 保存游戏
function save(index: number) {
  const saveImage = nesVueRef.value.screenshot()
  saveImage.onload = async () => {
    const id = getSaveId(index)
    isPlaying.value = true
    await nextTick()
    nesVueRef.value.save(id)
    isPlaying.value = false
    const cvs = document.createElement("canvas")
    cvs.width = 48
    cvs.height = 45
    const ctx = cvs.getContext("2d") as any
    ctx.drawImage(saveImage, 0, 0, cvs.width, cvs.height)
    saveDatas.value[index] = {
      id: props.curRom.id + id,
      image: cvs.toDataURL("image/png"),
      date: getNow(),
      title: props.curRom.title,
    }
    setStorage(props.curRom.id, unref(saveDatas))
  }
}

function getNow() {
  function digitComplement(n: number) {
    return String(n).length === 1 ? `0${n}` : String(n)
  }
  const time = new Date(Date.now())
  let result = time.getFullYear() + "年"
  result += time.getMonth() + 1 + "月"
  result += time.getDate() + "日 "
  result += digitComplement(time.getHours()) + ":"
  result += digitComplement(time.getMinutes()) + ":"
  result += digitComplement(time.getSeconds())
  return result
}
</script>
<style lang="scss" scoped>
.play {
  .main {
    position: relative;
    span {
      position: absolute;
      top: 0;
      right: 1em;
      color: white;
      z-index: 1;
    }
  }
}
.nes-vue {
  margin: 0 1em 0 0 !important;
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
      height: 100%;
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
      width: 48px;
      height: 100%;
      border-right: 1px solid var(--el-border-color);
    }
  }
}
</style>
