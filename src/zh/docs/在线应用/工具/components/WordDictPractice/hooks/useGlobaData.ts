import { ref, watch } from "vue"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"

const PAGE_KEY = "在线记单词"
const LOCAL_STORAGE_KEY = "word-dict-practice-global-data"

const DEFAULT_GLOBAL_DATA = {
  sound: "机械键盘2.mp3",
  volume: 60,
  autoJump: true,
  autoPlayAudio: false,
  practiceMode: 'all' as 'all' | 'rareOnly' | 'excludeRare', // 练习模式：all-全部单词, rareOnly-仅生僻词, excludeRare-排除生僻词
}

export const globalData = ref<any>({ ...DEFAULT_GLOBAL_DATA })
export const globalDataLoading = ref(true)

const { onAuthReady, onLogout, user, savePageData, loadPageData } = useFirebaseAuth()

let suppressRemoteSave = false

function applyGlobalData(source?: Record<string, unknown>) {
  Object.assign(globalData.value, DEFAULT_GLOBAL_DATA, source ?? {})
}

function resetGlobalData() {
  applyGlobalData()
}

function scheduleReleaseSaveLock() {
  queueMicrotask(() => {
    suppressRemoteSave = false
  })
}

function loadLocalGlobalData(): Record<string, unknown> | null {
  if (typeof window === "undefined") {
    return null
  }
  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!raw) {
    return null
  }
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>
    }
  } catch (error) {
    console.error("解析本地全局设置失败:", error)
  }
  return null
}

function saveLocalGlobalData(data: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return
  }
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_GLOBAL_DATA, ...data })
    )
  } catch (error) {
    console.error("保存本地全局设置失败:", error)
  }
}

async function persistGlobalDataToRemote(data: Record<string, unknown>) {
  if (!user.value) {
    return
  }
  try {
    await savePageData(PAGE_KEY, {
      globalData: data,
    })
  } catch (error) {
    console.error("同步全局设置失败:", error)
  }
}

onAuthReady(async authUser => {
  globalDataLoading.value = true
  if (!authUser) {
    suppressRemoteSave = true
    const localData = loadLocalGlobalData()
    if (localData) {
      applyGlobalData(localData)
    } else {
      resetGlobalData()
    }
    scheduleReleaseSaveLock()
    globalDataLoading.value = false
    return
  }

  suppressRemoteSave = true
  let shouldSyncRemote = false
  try {
    const saved = (await loadPageData(PAGE_KEY)) as { globalData?: Record<string, unknown> } | null
    const savedGlobalData = saved?.globalData
    if (savedGlobalData && typeof savedGlobalData === "object") {
      applyGlobalData(savedGlobalData)
    } else {
      const localData = loadLocalGlobalData()
      if (localData) {
        applyGlobalData(localData)
        shouldSyncRemote = true
      } else {
        resetGlobalData()
      }
    }
  } catch (error) {
    console.error("加载全局设置失败:", error)
    const localData = loadLocalGlobalData()
    if (localData) {
      applyGlobalData(localData)
      shouldSyncRemote = true
    } else {
      resetGlobalData()
    }
  } finally {
    scheduleReleaseSaveLock()
    if (shouldSyncRemote) {
      queueMicrotask(async () => {
        if (!suppressRemoteSave && user.value) {
          await persistGlobalDataToRemote({ ...DEFAULT_GLOBAL_DATA, ...globalData.value })
        }
      })
    }
    globalDataLoading.value = false
  }
})

onLogout(() => {
  globalDataLoading.value = true
  suppressRemoteSave = true
  const localData = loadLocalGlobalData()
  if (localData) {
    applyGlobalData(localData)
  } else {
    resetGlobalData()
  }
  scheduleReleaseSaveLock()
  globalDataLoading.value = false
})

watch(
  globalData,
  async newValue => {
    const payload = { ...DEFAULT_GLOBAL_DATA, ...newValue }
    saveLocalGlobalData(payload)
    if (!user.value || suppressRemoteSave) {
      return
    }
    await persistGlobalDataToRemote(payload)
  },
  { deep: true }
)
