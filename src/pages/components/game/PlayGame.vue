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
      <!-- <el-tooltip
        content="存档"
        placement="top"
      >
        <el-icon size="36">
          <img :src="save" />
        </el-icon>
      </el-tooltip> -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, watch, shallowRef } from "vue"
import { ElNotification } from "element-plus"

import start from "./svg/start.svg"
import pause from "./svg/pause.svg"
import restart from "./svg/restart.svg"
import save from "./svg/save.svg"

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
  nesVueRef.value.play()
  isPlaying.value = true
}
const onBlur = () => {
  if (!nesVueRef.value) return
  nesVueRef.value?.pause()
  isPlaying.value = false
}

onMounted(() => {
  window.addEventListener("resize", fullscreenHandler)
  window.addEventListener("focus", onFocus)
  window.addEventListener("blur", onBlur)
  fullscreenHandler()
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", fullscreenHandler)
  window.removeEventListener("focus", onFocus)
  window.removeEventListener("blur", onBlur)
})

const play = () => {
  if (isPlaying.value) {
    nesVueRef.value.pause()
    isManualPause = true
  } else {
    nesVueRef.value.play()
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
</style>
