<template>
  <div class="game">
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
        <NesVue
          ref="nesVueRef"
          class="nes-vue"
          label="开始游戏"
          :url="BASE_URL + 'roms/' + curRom.url"
          :width="screenSize.width"
          :height="screenSize.height"
          @error="nesErrorAlert"
        />
        <div class="options">
          <div class="desc">
            <el-descriptions
              :title="curRom.title"
              :column="2"
              border
            >
              <el-descriptions-item label="发行">
                {{ curRom.publisher }}
              </el-descriptions-item>
              <el-descriptions-item label="发布">
                {{ curRom.source }}
              </el-descriptions-item>
              <el-descriptions-item label="容量">
                {{ (Number(curRom.size ?? 0) / 1024).toFixed(2) }}KB
              </el-descriptions-item>
              <el-descriptions-item label="类型">
                <el-tag size="large">
                  {{ curRom.type }} - {{ getCategory(curRom.type) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="备注">
                {{ curRom.comment }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </main>
    </template>
    <template v-else>
      <div class="fix">
        <el-input
          v-model="keyword"
          class="keyword-input"
          placeholder="输入搜索游戏名称"
          clearable
          size="large"
          @input="curCategory = ''"
        />

        <div class="cate">
          <el-check-tag
            :checked="!curCategory"
            size="large"
            @click="curCategory = ''"
          >
            全部游戏
          </el-check-tag>
          <el-check-tag
            v-for="i of categorys"
            :checked="curCategory === i.id"
            size="large"
            @click="curCategory = i.id"
          >
            {{ i.name }}
          </el-check-tag>
        </div>
      </div>

      <GameList
        :base-url="BASE_URL"
        :keyword="keyword"
        :cur-category="curCategory"
        @select="curRom = $event"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onBeforeUnmount, onMounted, watch } from "vue"
import { ref } from "vue"
import { NesVue, EmitErrorObj } from "nes-vue"
import { categorys } from "./game"
import { ElNotification } from "element-plus"
import GameList from "./game/GameList.vue"

const curCategory = ref("")

const BASE_URL = "https://tomiaa12.github.io/nesRoms/"

const keyword = ref("")

const curRom = ref()

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
function nesErrorAlert(e: EmitErrorObj) {
  const errCode: any = {
    404: "无法获取ROM：地址无效或网络错误",
    0: "不支持的游戏ROM",
    1: "保存失败",
    2: "存档不存在或数据错误",
  }
  errCode[e.code] && ElNotification.error(errCode[e.code])
}

const nesVueRef = ref()

const onFocus = () => nesVueRef.value?.play()
const onBlur = () => nesVueRef.value?.pause()

onMounted(() => {
  window.addEventListener("resize", fullscreenHandler)
  window.addEventListener("focus", onFocus)
  window.addEventListener("blur", onBlur)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", fullscreenHandler)
  window.removeEventListener("focus", onFocus)
  window.removeEventListener("blur", onBlur)
})

watch(curRom, fullscreenHandler)

const getCategory = (id: string) => categorys.find(i => i.id === id)?.name
</script>
<style lang="scss">
@font-face {
  font-family: zpix;
  src: url("/fonts/zpix.woff2");
}

.Layout.game {
  .container,
  .content,
  .content-container {
    max-width: unset !important;
  }
}

.game {
  font-family: zpix;
  h1 {
    display: none;
  }
  h2 {
    border-top: none;
    margin-top: 0;
  }
  .el-check-tag {
    margin: 0 1em 1em 0;
    cursor: pointer;
  }
  .el-space {
    .el-space__item {
      max-width: calc(50% - 8px);
    }
  }
  .fix {
    position: sticky;
    top: var(--vp-nav-height);
    z-index: 10;
    background-color: var(--vp-c-bg-elv);
    box-shadow: 0 2px 4px -3px rgb(0 0 0 / 0.1);
    border-bottom: 1px solid var(--vp-c-divider);
    padding-top: 1em;
    margin-bottom: 1em;
  }
  .keyword-input {
    margin-bottom: 24px;
    max-width: 768px;
    .el-input-group__append {
      --el-input-border-color: var(--el-color-primary);
      --el-button-hover-text-color: var(--el-color-white);
      --el-button-hover-bg-color: var(--el-color-primary-light-3);
      --el-button-active-text-color: var(--el-button-hover-text-color);
      --el-button-active-border-color: var(--el-color-primary-dark-2);
      --el-button-active-bg-color: var(--el-color-primary-dark-2);
      background: var(--el-color-primary);
      color: white;

      &:hover {
        --el-input-border-color: var(--el-color-primary-light-3);
        color: var(--el-button-hover-text-color);
        background-color: var(--el-button-hover-bg-color);
      }
      &:active {
        --el-input-border-color: var(--el-button-active-border-color);
        color: var(--el-button-active-text-color);
        background-color: var(--el-button-active-bg-color);
      }
    }
  }

  .back {
    margin-bottom: 1em;
  }
}

main {
  display: flex;
  flex-wrap: wrap;
  .nes-vue {
    margin: 0 1em 0 0 !important;
  }
}
</style>
