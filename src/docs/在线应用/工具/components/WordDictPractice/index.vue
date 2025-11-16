<template>
  <div class="word-dict-practice">
    <div
      class="word-dict-practice__header"
      :class="{
        'is-mobile': isMobile,
      }"
    >
      <FirebaseLogin />
      <!-- <Firebase /> -->
      <el-card shadow="never">
        <div class="header">
          <el-button
            type="primary"
            @click="showDictDialog = true"
          >
            <span v-if="currentDictInfo.description">更换词典</span>
            <span v-else>选择词典</span>
          </el-button>
          <span
            class="current-dict"
            v-if="currentDictInfo.description"
            >当前词典：{{ currentDictInfo.label }} -
            {{ currentDictInfo.description }} ({{
              currentDictInfo.length
            }}个词)</span
          >
        </div>
      </el-card>
      <el-card shadow="never">
        <el-form
          v-if="!globalDataLoading"
          class="settings-form"
          inline
        >
          <el-form-item label="按键音效：">
            <el-select
              v-model="globalData.sound"
              placeholder="选择键盘音效"
              style="min-width: 120px;"
            >
              <el-option
                v-for="option in keySoundOptions"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="globalData.autoJump">
              <el-tooltip content="启用后，正确输入单词后会自动跳转到下一个输入框" placement="top" effect="dark">
               正确后自动跳转
              </el-tooltip>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="globalData.autoPlayAudio">
              <el-tooltip content="启用后，默写时会自动播放单词发音" placement="top" effect="dark">
                默写时自动发音
              </el-tooltip>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="globalData.hideRareWords">
              <el-tooltip content="启用后，已标记为生僻词的单词将不会在默写列表中显示" placement="top" effect="dark">
                隐藏生僻词
              </el-tooltip>
            </el-checkbox>
          </el-form-item>
          
        </el-form>
        <div v-else>正在加载全局设置...</div>
      </el-card>
    </div>

    <el-dialog
      v-model="showDictDialog"
      title="选择词典"
      width="calc(100vw - 40px)"
      top="2vh"
    >
      <DictSelector
        v-model="currentDictId"
        @dict-selected="handleDictSelected"
      />
    </el-dialog>

    <div
      v-if="dictStatusMessage && (dictLoading || !selectedData.length)"
      :class="[
        'dict-status',
        dictStatusType && `dict-status--${dictStatusType}`,
      ]"
    >
      {{ dictStatusMessage }}
    </div>
    <Table
      v-if="!dictLoading && selectedData.length"
      :data="selectedData"
      :dict-id="currentDictId"
      class="word-table"
      :class="{
        'is-mobile': isMobile,
      }"
    />
    <div
      v-else-if="!dictLoading"
      class="dict-empty"
    >
      暂无词典数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
import Table from "./Table.vue"
import DictSelector from "./DictSelector.vue"
import { flatDictList } from "./dictTree"
import axios from "axios"
import Firebase from "@/components/Firebase.vue"
import FirebaseLogin from "@/components/FirebaseLogin.vue"
import { globalData, globalDataLoading } from "./hooks/useGlobaData"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import type { User } from "firebase/auth"
import { isMobile } from "@/utils"
const props = defineProps({})
const emits = defineEmits([])

// 用于在浏览器 localStorage 中持久化最近选择的词典 ID
const STORAGE_KEY = "word-dict-practice-selected-dict-id"

// 页面主体的响应式数据
const selectedData = ref<any[]>([])
const currentDictInfo = ref<any>({})
const currentDictId = ref<string>()
const showDictDialog = ref(false)
const dictLoading = ref(true)
const dictStatusMessage = ref<string | null>("正在加载词典数据...")
const dictStatusType = ref<"loading" | "success" | "info" | "warning" | null>(
  "loading"
)
const PAGE_KEY = "在线记单词"

const keySoundOptions = [
  {
    id: "机械键盘2.mp3",
    label: "机械键盘 2",
  },
  {
    id: "机械键盘1.mp3",
    label: "机械键盘 1",
  },
  {
    id: "老式机械键盘.mp3",
    label: "老式机械键盘",
  },
  {
    id: "笔记本键盘.mp3",
    label: "笔记本键盘",
  },
  {
    id: "机械0.mp3",
    label: "机械0",
  },
  {
    id: "机械1.mp3",
    label: "机械1",
  },
  {
    id: "机械2.mp3",
    label: "机械2",
  },
  {
    id: "机械3.mp3",
    label: "机械3",
  },
] as const

// 集成 Firebase 登录态相关的 hook
const { onAuthReady, onLogout, user, savePageData, loadPageData } =
  useFirebaseAuth()

let offLogout: (() => void) | null = null

// 登录状态确认后触发（包含未登录场景），据此初始化词典 ID
onAuthReady(async (authUser: User | null) => {
  if (authUser) {
    // 已登录用户优先尝试加载云端同步的词典偏好
    dictStatusMessage.value = "正在加载云端词典偏好..."
    dictStatusType.value = "loading"
    try {
      const saved = (await loadPageData(PAGE_KEY)) as any
      // 兼容旧数据结构，如果没有 currentDictInfo 则回退到 id
      const savedId = saved?.currentDictInfo?.id ?? saved?.id
      if (savedId) {
        dictStatusMessage.value = "已加载云端词典偏好，正在加载词典数据..."
        dictStatusType.value = "loading"
        if (currentDictId.value !== savedId) {
          // 当本地当前 ID 不一致时，更新 ID 触发 watch 去加载词典
          currentDictId.value = savedId
        } else {
          // 如果本地 ID 与云端一致，则直接补齐 currentDictInfo，避免 watch 的二次加载
          const dictInfo = cloneDictInfoById(savedId)
          if (dictInfo) {
            currentDictInfo.value = dictInfo
          }
        }
        // 同步最新的有效 ID 至 localStorage，保证刷新后仍然可用
        window.localStorage.setItem(STORAGE_KEY, savedId)
        return
      }
      // 云端未保存过偏好，则尝试应用本地缓存，没有缓存则回退默认词典
      const { storedId, fallbackId } = applyLocalDictPreference({
        forceAssignInfo: true,
      })
      dictStatusMessage.value = storedId
        ? "云端无记录，正在加载本地缓存词典..."
        : "云端无记录，正在加载默认词典..."
      dictStatusType.value = "loading"
      // 如果 fallback 走的是默认词典，刷新 localStorage 以便后续使用
      if (!storedId && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, fallbackId)
      }
      return
    } catch (error) {
      console.error("加载云端词典偏好失败:", error)
      // 云端读取失败时与未保存逻辑一致，继续尝试本地缓存
      const { storedId, fallbackId } = applyLocalDictPreference({
        forceAssignInfo: true,
      })
      dictStatusMessage.value = storedId
        ? "云端加载失败，正在加载本地缓存词典..."
        : "云端加载失败，正在加载默认词典..."
      dictStatusType.value = "loading"
      // 同样在 fallback 场景下刷新 localStorage，以免再次进入异常逻辑
      if (!storedId && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, fallbackId)
      }
      return
    }
  }

  // 未登录用户直接走本地逻辑，默认加载 localStorage 或默认词典
  dictStatusMessage.value = "正在加载词典数据..."
  dictStatusType.value = "loading"
  applyLocalDictPreference({ forceAssignInfo: true })
})

offLogout = onLogout(() => {
  // 退出登录后通知用户并恢复本地词典偏好
  dictStatusMessage.value = "已退出登录，正在加载本地词典..."
  dictStatusType.value = "info"
  applyLocalDictPreference({ forceAssignInfo: true })
})

// 根据 ID 深拷贝词典基础信息，避免引用修改原始配置
function cloneDictInfoById(dictId?: string) {
  if (!dictId) return null
  const dict = flatDictList.find(d => d.id === dictId)
  if (!dict) return null
  const { id, label, description, url, length, ...rest } = dict
  return { id, label, description, url, length, ...rest }
}

/**
 * 应用本地的词典偏好
 * @param options.forceAssignInfo 当需要强制覆盖 currentDictInfo 时设为 true
 * @returns storedId 表示 localStorage 中原有的词典 ID；fallbackId 表示最终采用的 ID
 */
function applyLocalDictPreference(options?: { forceAssignInfo?: boolean }) {
  let storedId: string | null = window.localStorage.getItem(STORAGE_KEY)
  // 如果本地没有缓存，则使用默认的 "cet4" 词典
  let effectiveId = storedId || "cet4"
  const needAssignInfo =
    options?.forceAssignInfo ||
    currentDictId.value === effectiveId ||
    !currentDictInfo.value?.id ||
    currentDictInfo.value?.id !== effectiveId

  let dictInfo = needAssignInfo ? cloneDictInfoById(effectiveId) : null
  if (needAssignInfo && !dictInfo && effectiveId !== "cet4") {
    // 若缓存 ID 已失效（例如词典已删除），则回退至默认词典并更新 localStorage
    effectiveId = "cet4"
    dictInfo = cloneDictInfoById(effectiveId)
    window.localStorage.setItem(STORAGE_KEY, effectiveId)
  }

  if (currentDictId.value !== effectiveId) {
    currentDictId.value = effectiveId
  }

  if (needAssignInfo && dictInfo) {
    currentDictInfo.value = dictInfo
  }

  return { storedId, fallbackId: effectiveId }
}

// 加载词典数据
async function loadDictById(dictId: string) {
  const dict = flatDictList.find(d => d.id === dictId)
  if (!dict) {
    console.error("未找到词典:", dictId)
    return
  }

  try {
    // 词典数据以静态 JSON 形式托管，直接通过 axios 获取
    const response = await axios.get(dict.url, {
      baseURL: "",
    })
    selectedData.value = response.data
    const dictInfo = cloneDictInfoById(dictId)
    if (dictInfo) {
      currentDictInfo.value = dictInfo
    }
  } catch (error) {
    console.error("加载词典失败:", error)
  }
}

// 监听 currentDictId 变化，自动加载词典（只在非用户点击时触发）
let isSelectingFromClick = false

watch(currentDictId, async (newValue, oldValue) => {
  if (!newValue || newValue === oldValue) {
    // 1. newValue 为空：说明词典 ID 尚未准备好，直接重置 loading 状态
    // 2. newValue 与 oldValue 相同：避免重复加载同一个词典
    isSelectingFromClick = false
    dictLoading.value = false
    return
  }
  if (isSelectingFromClick) {
    // 用户手动从弹窗中选择词典时，词典数据已经预先通过回调注入
    // 此处仅负责关闭 loading 与提示信息
    isSelectingFromClick = false
    dictLoading.value = false
    dictStatusMessage.value = null
    dictStatusType.value = null
    return
  }
  // 自动变更（例如登录后从云端读取到的 ID）需要主动请求词典数据
  dictLoading.value = true
  dictStatusMessage.value = "正在加载词典数据..."
  dictStatusType.value = "loading"
  try {
    await loadDictById(newValue)
  } finally {
    dictLoading.value = false
    dictStatusMessage.value = null
    dictStatusType.value = null
  }
})

// 存储当前词典信息到 Firebase
watch(
  currentDictInfo,
  async newValue => {
    if (!user.value || !newValue?.id) {
      // 未登录或词典信息无效时不进行云端写入
      return
    }
    try {
      // 只存储最必要的词典信息，避免存入大体量数据
      await savePageData(PAGE_KEY, {
        currentDictInfo: newValue,
      })
    } catch (error) {
      console.error("保存词典信息失败:", error)
    }
  },
  { deep: true }
)

function handleDictSelected(payload: { words: any[]; dictInfo: any }) {
  // 标记本次更新来源于用户点击，避免 watch 重复加载
  isSelectingFromClick = true
  // DictSelector 已经返回所需的词汇数据，直接应用
  selectedData.value = payload.words
  const dictInfo = cloneDictInfoById(payload.dictInfo?.id)
  if (dictInfo) {
    currentDictInfo.value = dictInfo
  }
  currentDictId.value = payload.dictInfo.id
  dictStatusMessage.value = null
  dictStatusType.value = null
  showDictDialog.value = false
  // 保存到 localStorage
  window.localStorage.setItem(STORAGE_KEY, payload.dictInfo.id)
}
</script>

<style lang="scss" scoped>
.word-dict-practice {
  width: 100%;
  height: 100%;
}
.word-dict-practice__header {
  margin: 1em 0;
  display: flex;
  align-items: stretch;
  margin-bottom: 16px;
  padding-top: 10px;
  gap: 16px;
  :deep() > div {
    flex: 1;
  }
  &.is-mobile {
    flex-wrap: wrap;
    :deep() > div {
      flex: none;
      width: 100%;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-top: 10px;
  .current-dict {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}

.dict-status,
.dict-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.dict-status--loading {
  color: var(--el-color-primary);
}

.dict-status--success {
  color: var(--el-color-success);
}

.dict-status--info {
  color: var(--el-text-color-regular);
}

.dict-status--warning {
  color: var(--el-color-warning);
}

::deep() .el-dialog__title {
  font-size: 25px;
  font-weight: 600;
}
</style>