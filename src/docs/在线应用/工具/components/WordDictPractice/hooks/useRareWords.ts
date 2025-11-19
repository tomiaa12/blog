import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue"
import { deleteField } from "firebase/firestore"
import { ElMessage } from "element-plus"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"

type RareWordTrans = { pos: string; cn: string }

export type RareWordItem = {
  key: string
  word: string
  trans: RareWordTrans[]
  phonetic0?: string | null
  phonetic1?: string | null
  sourceDictId?: string | null
  addedAt: string // ISO 8601格式的时间戳
}

type RareWordsStoreEntry = {
  word: string
  trans: RareWordTrans[]
  phonetic0?: string | null
  phonetic1?: string | null
  sourceDictId?: string | null
  addedAt: string // ISO 8601格式的时间戳
}

type RareWordsStore = Record<string, RareWordsStoreEntry>

const PAGE_KEY = "在线记单词"
const RARE_WORDS_RECORD_ID = "rareWords"
const RARE_WORDS_LOCAL_KEY = "word-dict-rare-words"

function normalizeWordKey(word: string) {
  const base = word.trim().toLowerCase()
  const normalized = base.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  return normalized || encodeURIComponent(base)
}

function buildWordKey(word: string) {
  return normalizeWordKey(word)
}

function loadRareWordsFromLocal(): RareWordsStore {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(RARE_WORDS_LOCAL_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") {
      return parsed as RareWordsStore
    }
  } catch (error) {
    console.error("读取本地生僻词失败:", error)
  }
  return {}
}

function saveRareWordsToLocal(store: RareWordsStore) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(RARE_WORDS_LOCAL_KEY, JSON.stringify(store))
  } catch (error) {
    console.error("保存本地生僻词失败:", error)
  }
}

function storeToList(store: RareWordsStore): RareWordItem[] {
  return Object.entries(store).map(([key, entry]) => ({
    key,
    word: entry.word ?? key,
    trans: Array.isArray(entry.trans) ? entry.trans : [],
    phonetic0: entry.phonetic0 ?? null,
    phonetic1: entry.phonetic1 ?? null,
    sourceDictId: entry.sourceDictId ?? null,
    addedAt: entry.addedAt ?? new Date().toISOString(), // 为旧数据设置默认时间
  }))
}

function normalizeRemoteData(data: any): RareWordsStore {
  if (!data || typeof data !== "object") return {}
  const maybeLegacy =
    data.rareWords && typeof data.rareWords === "object" ? data.rareWords : null
  const source = maybeLegacy ?? data
  const store: RareWordsStore = {}
  Object.entries(source).forEach(([key, value]) => {
    const entry = (value ?? {}) as any
    const word = entry.word ?? key
    store[key] = {
      word,
      trans: Array.isArray(entry.trans) ? entry.trans : [],
      phonetic0: entry.phonetic0 ?? entry.phonetic ?? null,
      phonetic1: entry.phonetic1 ?? null,
      sourceDictId: entry.sourceDictId ?? null,
      addedAt: entry.addedAt ?? new Date().toISOString(), // 为旧数据设置默认时间
    }
  })
  return store
}

function mergeStores(remote: RareWordsStore, local: RareWordsStore) {
  const merged: RareWordsStore = { ...remote }
  const pendingUpload: RareWordsStore = {}
  Object.entries(local).forEach(([key, entry]) => {
    const remoteEntry = merged[key]
    if (!remoteEntry) {
      merged[key] = entry
      pendingUpload[key] = entry
    } else {
      merged[key] = {
        ...remoteEntry,
        ...entry,
        word: entry.word ?? remoteEntry.word ?? key,
        addedAt: entry.addedAt ?? remoteEntry.addedAt ?? new Date().toISOString(), // 保留较早的时间
      }
    }
  })
  return { merged, pendingUpload }
}

export function useRareWords(dictId?: Ref<string | undefined | null>) {
  const {
    user,
    authReady,
    saveDocumentData,
    loadDocumentData,
    onAuthReady,
    onLogout,
  } = useFirebaseAuth()

  const rareWordsDrawerVisible = ref(false)
  const rareWords = ref<RareWordItem[]>([])
  const rareWordsLoading = ref(false)
  const rareWordsError = ref<string | null>(null)
  const addRareWordLoading = ref(false)
  const rareWordsLoaded = ref(false)

  const stateReadyForRareWords = computed(() => authReady.value && !!user.value)

  const rareWordsMap = computed(() => {
    const map = new Map<string, RareWordItem>()
    rareWords.value.forEach(item => {
      map.set(item.key, item)
    })
    return map
  })

  function clearRareWords(clearLocal = false) {
    rareWords.value = []
    rareWordsLoading.value = false
    rareWordsError.value = null
    rareWordsLoaded.value = true
    if (clearLocal && typeof window !== "undefined") {
      window.localStorage.removeItem(RARE_WORDS_LOCAL_KEY)
    }
  }

  async function initializeRareWords(options?: { forceRemote?: boolean }) {
    if (rareWordsLoading.value && !options?.forceRemote) {
      return
    }
    rareWordsLoading.value = true
    rareWordsError.value = null

    const localStore = loadRareWordsFromLocal()
    let workingStore: RareWordsStore = { ...localStore }

    try {
      if (options?.forceRemote ?? stateReadyForRareWords.value) {
        const remoteData = await loadDocumentData<Record<string, any> | null>(
          PAGE_KEY,
          RARE_WORDS_RECORD_ID
        )
        const remoteStore = normalizeRemoteData(remoteData ?? {})
        const { merged, pendingUpload } = mergeStores(remoteStore, localStore)
        workingStore = merged
        if (Object.keys(pendingUpload).length) {
          await saveDocumentData(PAGE_KEY, RARE_WORDS_RECORD_ID, pendingUpload)
        }
        saveRareWordsToLocal(workingStore)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      rareWordsError.value = message
      workingStore = localStore
    } finally {
      rareWords.value = storeToList(workingStore).sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()) // 默认时间倒序
      rareWordsLoaded.value = true
      rareWordsLoading.value = false
    }
  }

  function openRareWordsDrawer(forceRemote?: boolean | Event) {
    rareWordsDrawerVisible.value = true
    if (!rareWordsLoaded.value && !rareWordsLoading.value) {
      const shouldForce =
        typeof forceRemote === "boolean" ? forceRemote : stateReadyForRareWords.value
      initializeRareWords({ forceRemote: shouldForce })
    }
  }

  function isWordInRareList(word: string | null | undefined) {
    const normalized = word?.trim()
    if (!normalized) return false
    const key = buildWordKey(normalized)
    return rareWordsMap.value.has(key)
  }

  async function handleAddRareWord(row: any, dictId: string) {
    const word = row.word?.trim()
    if (!word) {
      ElMessage.error({ message: "无法获取单词内容", grouping: true })
      return
    }
    const key = buildWordKey(word)
    if (rareWordsMap.value.has(key)) {
      ElMessage.info({ message: "该单词已在生僻词列表中", grouping: true })
      return
    }

    const entry: RareWordsStoreEntry = {
      word,
      trans: Array.isArray(row.trans) ? row.trans : [],
      phonetic0: row.phonetic0 ?? null,
      phonetic1: row.phonetic1 ?? null,
      sourceDictId: dictId ?? null,
      addedAt: new Date().toISOString(),
    }
    const localStore = loadRareWordsFromLocal()
    localStore[key] = entry
    saveRareWordsToLocal(localStore)

    const optimisticItem: RareWordItem = {
      key,
      word,
      trans: entry.trans,
      phonetic0: entry.phonetic0 ?? null,
      phonetic1: entry.phonetic1 ?? null,
      sourceDictId: dictId ?? null,
      addedAt: entry.addedAt,
    }
    rareWords.value = [...rareWords.value.filter(item => item.key !== key), optimisticItem].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    rareWordsLoaded.value = true

    try {
      addRareWordLoading.value = true
      const canSyncRemote = stateReadyForRareWords.value
      if (canSyncRemote) {
        await saveDocumentData(PAGE_KEY, RARE_WORDS_RECORD_ID, {
          [key]: entry,
        })
      }
      ElMessage.success({
        message: canSyncRemote ? "已加入生僻词" : "已在本地记录生僻词，可登录后同步云端",
        grouping: true
      })
    } catch (error) {
      console.error("加入生僻词失败:", error)
      ElMessage.error({ message: "云端同步失败，已保存在本地", grouping: true })
    } finally {
      addRareWordLoading.value = false
    }
  }

  async function removeRareWord(key: string) {
    const trimmedKey = key?.trim()
    if (!trimmedKey) return
    const newStore: RareWordsStore = {}
    const localStore = loadRareWordsFromLocal()
    let removed = false
    Object.entries(localStore).forEach(([entryKey, entry]) => {
      if (entryKey === trimmedKey) {
        removed = true
        return
      }
      newStore[entryKey] = entry
    })
    if (!removed) {
      if (rareWordsMap.value.has(trimmedKey)) {
        removed = true
      } else {
        return
      }
    }
    saveRareWordsToLocal(newStore)
    rareWords.value = rareWords.value.filter(item => item.key !== trimmedKey)
    if (!rareWords.value.length) {
      rareWordsLoaded.value = true
    }
    try {
      if (stateReadyForRareWords.value) {
        await saveDocumentData(PAGE_KEY, RARE_WORDS_RECORD_ID, {
          [trimmedKey]: deleteField(),
        })
      }
      ElMessage.success({ message: "已移除生僻词", grouping: true })
    } catch (error) {
      console.error("移除生僻词失败:", error)
      ElMessage.error({ message: "云端同步失败，但本地已移除", grouping: true })
    }
  }

  async function clearAllRareWords() {
    const payload: Record<string, unknown> = {}
    rareWords.value.forEach(item => {
      payload[item.key] = deleteField()
    })
    saveRareWordsToLocal({})
    rareWords.value = []
    rareWordsLoaded.value = true
    try {
      if (stateReadyForRareWords.value && Object.keys(payload).length) {
        await saveDocumentData(PAGE_KEY, RARE_WORDS_RECORD_ID, payload)
      }
      ElMessage.success({ message: "已清空生僻词", grouping: true })
    } catch (error) {
      console.error("清空生僻词失败:", error)
      ElMessage.error({ message: "云端同步失败，但本地已清空", grouping: true })
    }
  }

  let lastSyncedUserId: string | null = null
  let offAuthReady: (() => void) | null = null
  let offLogout: (() => void) | null = null

  onMounted(() => {
    initializeRareWords()
    offAuthReady = onAuthReady(authUser => {
      if (authUser) {
        if (authUser.uid === lastSyncedUserId) {
          return
        }
        lastSyncedUserId = authUser.uid
        initializeRareWords({ forceRemote: true })
      }
    })
    offLogout = onLogout(() => {
      lastSyncedUserId = null
      clearRareWords(true)
      initializeRareWords()
    })
  })

  onBeforeUnmount(() => {
    if (offAuthReady) {
      offAuthReady()
      offAuthReady = null
    }
    if (offLogout) {
      offLogout()
      offLogout = null
    }
  })

  return {
    rareWordsDrawerVisible,
    rareWords,
    rareWordsLoading,
    rareWordsError,
    rareWordsLoaded,
    addRareWordLoading,
    stateReadyForRareWords,
    initializeRareWords,
    openRareWordsDrawer,
    handleAddRareWord,
    isWordInRareList,
    removeRareWord,
    clearAllRareWords,
  }
}

