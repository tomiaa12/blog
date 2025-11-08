<template>
  <div class="word-dict-practice">
    <div class="word-dict-practice__header">
      <FirebaseLogin />
      <!-- <Firebase /> -->
      <el-card shadow="never" :body-style="{ width: '400px' }">
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
      :class="['dict-status', dictStatusType && `dict-status--${dictStatusType}`]"
    >
      {{ dictStatusMessage }}
    </div>
    <Table
      v-if="!dictLoading && selectedData.length"
      :data="selectedData"
      :dict-id="currentDictId"
      class="word-table"
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
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import type { User } from "firebase/auth"

const props = defineProps({})
const emits = defineEmits([])

const STORAGE_KEY = "word-dict-practice-selected-dict-id"

const selectedData = ref<any[]>([])
const currentDictInfo = ref<any>({})
const currentDictId = ref<string>()
const showDictDialog = ref(false)
const dictLoading = ref(true)
const dictStatusMessage = ref<string | null>("正在加载词典数据...")
const dictStatusType = ref<"loading" | "success" | "info" | "warning" | null>("loading")

const { onAuthReady, onLogout, user, savePageData, loadPageData } = useFirebaseAuth()
const PAGE_KEY = "在线记单词"

let offLogout: (() => void) | null = null

// 登录状态确认后触发（包含未登录场景），据此初始化词典 ID
onAuthReady(async (authUser: User | null) => {
  if (authUser) {
    dictStatusMessage.value = "正在加载云端词典偏好..."
    dictStatusType.value = "loading"
    try {
      const saved = (await loadPageData(PAGE_KEY)) as any
      const savedId = saved?.currentDictInfo?.id ?? saved?.id
      if (savedId) {
        dictStatusMessage.value = "已加载云端词典偏好，正在加载词典数据..."
        dictStatusType.value = "loading"
        if (currentDictId.value !== savedId) {
          currentDictId.value = savedId
        } else {
          const dictInfo = cloneDictInfoById(savedId)
          if (dictInfo) {
            currentDictInfo.value = dictInfo
          }
        }
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, savedId)
        }
        return
      }
      const { storedId, fallbackId } = applyLocalDictPreference({ forceAssignInfo: true })
      dictStatusMessage.value = storedId
        ? "云端无记录，正在加载本地缓存词典..."
        : "云端无记录，正在加载默认词典..."
      dictStatusType.value = "loading"
      if (!storedId && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, fallbackId)
      }
      return
    } catch (error) {
      console.error("加载云端词典偏好失败:", error)
      const { storedId, fallbackId } = applyLocalDictPreference({ forceAssignInfo: true })
      dictStatusMessage.value = storedId
        ? "云端加载失败，正在加载本地缓存词典..."
        : "云端加载失败，正在加载默认词典..."
      dictStatusType.value = "loading"
      if (!storedId && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, fallbackId)
      }
      return
    }
  }

  dictStatusMessage.value = "正在加载词典数据..."
  dictStatusType.value = "loading"
  applyLocalDictPreference({ forceAssignInfo: true })
})

offLogout = onLogout(() => {
  dictStatusMessage.value = "已退出登录，正在加载本地词典..."
  dictStatusType.value = "info"
  applyLocalDictPreference({ forceAssignInfo: true })
})

function cloneDictInfoById(dictId?: string) {
  if (!dictId) return null
  const dict = flatDictList.find(d => d.id === dictId)
  if (!dict) return null
  const { id, label, description, url, length, ...rest } = dict
  return { id, label, description, url, length, ...rest }
}

function applyLocalDictPreference(options?: { forceAssignInfo?: boolean }) {
  let storedId: string | null = null
  if (typeof window !== "undefined") {
    storedId = window.localStorage.getItem(STORAGE_KEY)
  }
  let effectiveId = storedId || "cet4"
  const needAssignInfo =
    options?.forceAssignInfo ||
    currentDictId.value === effectiveId ||
    !currentDictInfo.value?.id ||
    currentDictInfo.value?.id !== effectiveId

  let dictInfo = needAssignInfo ? cloneDictInfoById(effectiveId) : null
  if (needAssignInfo && !dictInfo && effectiveId !== "cet4") {
    effectiveId = "cet4"
    dictInfo = cloneDictInfoById(effectiveId)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, effectiveId)
    }
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
    isSelectingFromClick = false
    dictLoading.value = false
    return
  }
  if (isSelectingFromClick) {
    isSelectingFromClick = false
    dictLoading.value = false
    dictStatusMessage.value = null
    dictStatusType.value = null
    return
  }
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
      return
    }
    try {
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
  isSelectingFromClick = true
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
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, payload.dictInfo.id)
  }
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

.word-table {
  height: calc(88vh - 60px);
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
