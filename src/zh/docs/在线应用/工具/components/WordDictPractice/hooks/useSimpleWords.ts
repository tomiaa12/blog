import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue"
import { deleteField } from "firebase/firestore"
import { ElMessage } from "element-plus"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"

type SimpleWordTrans = { pos: string; cn: string }

export type SimpleWordItem = {
  key: string
  word: string
  trans: SimpleWordTrans[]
  phonetic0?: string | null
  phonetic1?: string | null
  sourceDictId?: string | null
  addedAt: string // ISO 8601格式的时间戳
}

type SimpleWordsStoreEntry = {
  word: string
  trans: SimpleWordTrans[]
  phonetic0?: string | null
  phonetic1?: string | null
  sourceDictId?: string | null
  addedAt: string // ISO 8601格式的时间戳
}

type SimpleWordsStore = Record<string, SimpleWordsStoreEntry>

const PAGE_KEY = "在线记单词"
const SIMPLE_WORDS_RECORD_ID = "simpleWords"
const SIMPLE_WORDS_LOCAL_KEY = "word-dict-simple-words"

function normalizeWordKey(word: string) {
  const base = word.trim().toLowerCase()
  const normalized = base.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  return normalized || encodeURIComponent(base)
}

function buildWordKey(word: string) {
  return normalizeWordKey(word)
}

function loadSimpleWordsFromLocal(): SimpleWordsStore {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(SIMPLE_WORDS_LOCAL_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") {
      return parsed as SimpleWordsStore
    }
  } catch (error) {
    console.error("读取本地熟悉单词失败:", error)
  }
  return {}
}

function saveSimpleWordsToLocal(store: SimpleWordsStore) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(SIMPLE_WORDS_LOCAL_KEY, JSON.stringify(store))
  } catch (error) {
    console.error("保存本地熟悉单词失败:", error)
  }
}

function storeToList(store: SimpleWordsStore): SimpleWordItem[] {
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

function normalizeRemoteData(data: any): SimpleWordsStore {
  if (!data || typeof data !== "object") return {}
  const maybeLegacy =
    data.simpleWords && typeof data.simpleWords === "object" ? data.simpleWords : null
  const source = maybeLegacy ?? data
  const store: SimpleWordsStore = {}
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

function mergeStores(remote: SimpleWordsStore, local: SimpleWordsStore) {
  const merged: SimpleWordsStore = { ...remote }
  const pendingUpload: SimpleWordsStore = {}
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

export function useSimpleWords(dictId?: Ref<string | undefined | null>) {
  const {
    user,
    authReady,
    saveDocumentData,
    loadDocumentData,
    onAuthReady,
    onLogout,
  } = useFirebaseAuth()

  const simpleWordsDrawerVisible = ref(false)
  const simpleWords = ref<SimpleWordItem[]>([])
  const simpleWordsLoading = ref(false)
  const simpleWordsError = ref<string | null>(null)
  const addSimpleWordLoading = ref(false)
  const simpleWordsLoaded = ref(false)

  const stateReadyForSimpleWords = computed(() => authReady.value && !!user.value)

  const simpleWordsMap = computed(() => {
    const map = new Map<string, SimpleWordItem>()
    simpleWords.value.forEach(item => {
      map.set(item.key, item)
    })
    return map
  })

  function clearSimpleWords(clearLocal = false) {
    simpleWords.value = []
    simpleWordsLoading.value = false
    simpleWordsError.value = null
    simpleWordsLoaded.value = true
    if (clearLocal && typeof window !== "undefined") {
      window.localStorage.removeItem(SIMPLE_WORDS_LOCAL_KEY)
    }
  }

  async function initializeSimpleWords(options?: { forceRemote?: boolean }) {
    if (simpleWordsLoading.value && !options?.forceRemote) {
      return
    }
    simpleWordsLoading.value = true
    simpleWordsError.value = null

    const localStore = loadSimpleWordsFromLocal()
    let workingStore: SimpleWordsStore = { ...localStore }

    try {
      if (options?.forceRemote ?? stateReadyForSimpleWords.value) {
        const remoteData = await loadDocumentData<Record<string, any> | null>(
          PAGE_KEY,
          SIMPLE_WORDS_RECORD_ID
        )
        const remoteStore = normalizeRemoteData(remoteData ?? {})
        const { merged, pendingUpload } = mergeStores(remoteStore, localStore)
        workingStore = merged
        if (Object.keys(pendingUpload).length) {
          await saveDocumentData(PAGE_KEY, SIMPLE_WORDS_RECORD_ID, pendingUpload)
        }
        saveSimpleWordsToLocal(workingStore)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      simpleWordsError.value = message
      workingStore = localStore
    } finally {
      simpleWords.value = storeToList(workingStore).sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()) // 默认时间倒序
      simpleWordsLoaded.value = true
      simpleWordsLoading.value = false
    }
  }

function openSimpleWordsDrawer(forceRemote?: boolean | Event) {
  simpleWordsDrawerVisible.value = true
  if (!simpleWordsLoaded.value && !simpleWordsLoading.value) {
    const shouldForce =
      typeof forceRemote === "boolean" ? forceRemote : stateReadyForSimpleWords.value
    initializeSimpleWords({ forceRemote: shouldForce })
  }
}

  function isWordInSimpleList(word: string | null | undefined) {
    const normalized = word?.trim()
    if (!normalized) return false
    const key = buildWordKey(normalized)
    return simpleWordsMap.value.has(key)
  }

  async function handleAddSimpleWord(row: any, dictId: string) {
    const word = row.word?.trim()
    if (!word) {
      ElMessage.error({ message: "无法获取单词内容", grouping: true })
      return
    }
    const key = buildWordKey(word)
    if (simpleWordsMap.value.has(key)) {
      ElMessage.info({ message: "该单词已在熟悉列表中", grouping: true })
      return
    }

    const entry: SimpleWordsStoreEntry = {
      word,
      trans: Array.isArray(row.trans) ? row.trans : [],
      phonetic0: row.phonetic0 ?? null,
      phonetic1: row.phonetic1 ?? null,
      sourceDictId: dictId ?? null,
      addedAt: new Date().toISOString(),
    }
    const localStore = loadSimpleWordsFromLocal()
    localStore[key] = entry
    saveSimpleWordsToLocal(localStore)

    const optimisticItem: SimpleWordItem = {
      key,
      word,
      trans: entry.trans,
      phonetic0: entry.phonetic0 ?? null,
      phonetic1: entry.phonetic1 ?? null,
      sourceDictId: dictId ?? null,
      addedAt: entry.addedAt,
    }
    simpleWords.value = [...simpleWords.value.filter(item => item.key !== key), optimisticItem].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    simpleWordsLoaded.value = true

    try {
      addSimpleWordLoading.value = true
      const canSyncRemote = stateReadyForSimpleWords.value
      if (canSyncRemote) {
        await saveDocumentData(PAGE_KEY, SIMPLE_WORDS_RECORD_ID, {
          [key]: entry,
        })
      }
      ElMessage.success({
        message: canSyncRemote ? "已加入熟悉单词" : "已在本地记录熟悉单词，可登录后同步云端",
        grouping: true
      })
    } catch (error) {
      console.error("加入已熟悉单词失败:", error)
      ElMessage.error({ message: "云端同步失败，已保存在本地", grouping: true })
    } finally {
      addSimpleWordLoading.value = false
    }
  }

  async function removeSimpleWord(key: string) {
    const trimmedKey = key?.trim()
    if (!trimmedKey) return
    const newStore: SimpleWordsStore = {}
    const localStore = loadSimpleWordsFromLocal()
    let removed = false
    Object.entries(localStore).forEach(([entryKey, entry]) => {
      if (entryKey === trimmedKey) {
        removed = true
        return
      }
      newStore[entryKey] = entry
    })
    if (!removed) {
      if (simpleWordsMap.value.has(trimmedKey)) {
        removed = true
      } else {
        return
      }
    }
    saveSimpleWordsToLocal(newStore)
    simpleWords.value = simpleWords.value.filter(item => item.key !== trimmedKey)
    if (!simpleWords.value.length) {
      simpleWordsLoaded.value = true
    }
    try {
      if (stateReadyForSimpleWords.value) {
        await saveDocumentData(PAGE_KEY, SIMPLE_WORDS_RECORD_ID, {
          [trimmedKey]: deleteField(),
        })
      }
      ElMessage.success({ message: "已移除熟悉单词", grouping: true })
    } catch (error) {
      console.error("移除熟悉单词失败:", error)
      ElMessage.error({ message: "云端同步失败，但本地已移除", grouping: true })
    }
  }

  async function clearAllSimpleWords() {
    const payload: Record<string, unknown> = {}
    simpleWords.value.forEach(item => {
      payload[item.key] = deleteField()
    })
    saveSimpleWordsToLocal({})
    simpleWords.value = []
    simpleWordsLoaded.value = true
    try {
      if (stateReadyForSimpleWords.value && Object.keys(payload).length) {
        await saveDocumentData(PAGE_KEY, SIMPLE_WORDS_RECORD_ID, payload)
      }
      ElMessage.success({ message: "已清空熟悉单词", grouping: true })
    } catch (error) {
      console.error("清空熟悉单词失败:", error)
      ElMessage.error({ message: "云端同步失败，但本地已清空", grouping: true })
    }
  }

  let lastSyncedUserId: string | null = null
  let offAuthReady: (() => void) | null = null
  let offLogout: (() => void) | null = null

  onMounted(() => {
    initializeSimpleWords()
    offAuthReady = onAuthReady(authUser => {
      if (authUser) {
        if (authUser.uid === lastSyncedUserId) {
          return
        }
        lastSyncedUserId = authUser.uid
        initializeSimpleWords({ forceRemote: true })
      }
    })
    offLogout = onLogout(() => {
      lastSyncedUserId = null
      clearSimpleWords(true)
      initializeSimpleWords()
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
    simpleWordsDrawerVisible,
    simpleWords,
    simpleWordsLoading,
    simpleWordsError,
    simpleWordsLoaded,
    addSimpleWordLoading,
    stateReadyForSimpleWords,
    initializeSimpleWords,
    openSimpleWordsDrawer,
    handleAddSimpleWord,
    isWordInSimpleList,
    removeSimpleWord,
    clearAllSimpleWords,
  }
}

