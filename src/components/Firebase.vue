<template>
  <div class="firebase-form">
    <h3>Firebase 登录 + 存取 JSON（Vue3 版本）</h3>

    <FirebaseLogin />
    <div class="page-info">
      <strong>当前页面 key：</strong> {{ props.pageKey }}
    </div>

    <hr />

    <label><strong>JSON 内容（请输入合法 JSON）：</strong></label>
    <textarea
      v-model="text"
      class="json-area"
    ></textarea>

    <div class="controls">
      <button
        @click="save"
        class="btn"
      >
        保存到云端
      </button>
      <button
        @click="load"
        class="btn"
      >
        从云端加载
      </button>
      <button
        @click="startRealtime"
        class="btn"
        :disabled="realtimeOn"
      >
        开启实时同步
      </button>
      <button
        @click="stopRealtime"
        class="btn"
        :disabled="!realtimeOn"
      >
        关闭实时同步
      </button>
      <button
        @click="exportJson"
        class="btn"
      >
        导出 JSON
      </button>
      <button
        @click="clearLocal"
        class="btn"
      >
        清除本地缓存
      </button>
    </div>

    <hr class="section-divider" />

    <div class="record-section">
      <h4>记录示例（页面 {{ props.pageKey }}）</h4>

      <div class="record-meta">
        <label for="record-id">记录 ID：</label>
        <input
          id="record-id"
          v-model="recordId"
          class="record-id"
          placeholder="例如 default-record"
        />
      </div>

      <label><strong>记录 JSON：</strong></label>
      <textarea
        v-model="recordText"
        class="json-area record-area"
      ></textarea>

      <div class="controls record-controls">
        <button
          @click="saveRecord"
          class="btn"
        >
          保存记录
        </button>
        <button
          @click="loadRecord"
          class="btn"
        >
          从云端加载记录
        </button>
        <button
          @click="startRecordRealtime"
          class="btn"
          :disabled="recordRealtimeOn"
        >
          开启记录实时同步
        </button>
        <button
          @click="stopRecordRealtime"
          class="btn"
          :disabled="!recordRealtimeOn"
        >
          关闭记录实时同步
        </button>
        <button
          @click="clearRecordLocal"
          class="btn"
        >
          清除记录缓存
        </button>
      </div>
    </div>

    <pre id="status">{{ status }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from "vue"
import FirebaseLogin from "./FirebaseLogin.vue"
import { useFirebaseAuth } from "../hooks/useFirebaseAuth"
import type { Unsubscribe } from "firebase/firestore"

const props = withDefaults(defineProps<{ pageKey?: string }>(), {
  pageKey: "default",
})

const {
  user,
  savePageData,
  loadPageData,
  subscribePageData,
  saveRecordData,
  loadRecordData,
  subscribeRecordData,
} = useFirebaseAuth()

const text = ref('{  }')
const status = ref(
  "请先登录以使用云端存储（确保在 Firebase 控制台启用了 Google 登录，并把当前域名加入 Authorized domains）"
)
const realtimeOn = ref(false)
let unsubRealtime: Unsubscribe | null = null

const recordId = ref("default")
const recordText = ref("{  }")
const recordRealtimeOn = ref(false)
let unsubRecordRealtime: Unsubscribe | null = null

function showStatus(msg: string) {
  status.value = `[${new Date().toLocaleString()}] ${msg}`
}

function localKey(uid: string) {
  return `formcache_${uid}_${props.pageKey}`
}

function recordLocalKey(uid: string, id: string) {
  return `recordcache_${uid}_${props.pageKey}_${id}`
}

async function save() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text.value || "null")
  } catch (e) {
    alert(`JSON 语法错误：${(e as Error).message}`)
    return
  }
  try {
    await savePageData(props.pageKey, parsed)
    localStorage.setItem(localKey(current.uid), text.value)
    showStatus(`已保存到云端（页面：${props.pageKey}）并缓存到本地`)
  } catch (e) {
    showStatus(`保存失败：${(e as Error).message}`)
    console.error(e)
  }
}

async function load() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  try {
    const data = await loadPageData(props.pageKey)
    if (data === null) {
      text.value = ""
      showStatus("云端没有文档")
    } else {
      text.value = JSON.stringify(data, null, 2)
      localStorage.setItem(localKey(current.uid), text.value)
      showStatus("从云端加载成功并已缓存到本地")
    }
  } catch (e) {
    showStatus(`加载失败：${(e as Error).message}`)
    console.error(e)
  }
}

function startRealtime() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  if (unsubRealtime) return

  try {
    unsubRealtime = subscribePageData(
      props.pageKey,
      data => {
        const value = data ? JSON.stringify(data, null, 2) : ""
        text.value = value
        localStorage.setItem(localKey(current.uid), value)
        showStatus(`实时：已接收到页面 ${props.pageKey} 的远端变更`)
      },
      err => {
        showStatus(`实时订阅出错：${err.message}`)
      }
    )
    realtimeOn.value = true
    showStatus(`已开启页面 ${props.pageKey} 的实时同步`)
  } catch (e) {
    showStatus(`开启实时同步失败：${(e as Error).message}`)
  }
}

function stopRealtime() {
  if (unsubRealtime) {
    unsubRealtime()
    unsubRealtime = null
  }
  realtimeOn.value = false
  showStatus("已关闭实时同步")
}

function exportJson() {
  const blob = new Blob([text.value || ""], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${props.pageKey}.json`
  a.click()
  URL.revokeObjectURL(url)
  showStatus("已导出 JSON 文件")
}

function clearLocal() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  localStorage.removeItem(localKey(current.uid))
  showStatus("已清除本地缓存")
}

async function saveRecord() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  const id = recordId.value.trim()
  if (!id) {
    alert("请先填写记录 ID")
    return
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(recordText.value || "null")
  } catch (e) {
    alert(`记录 JSON 语法错误：${(e as Error).message}`)
    return
  }
  try {
    await saveRecordData(props.pageKey, id, parsed)
    localStorage.setItem(recordLocalKey(current.uid, id), recordText.value)
    showStatus(`记录 ${id} 已保存到页面 ${props.pageKey}`)
  } catch (e) {
    showStatus(`记录保存失败：${(e as Error).message}`)
    console.error(e)
  }
}

async function loadRecord() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  const id = recordId.value.trim()
  if (!id) {
    alert("请先填写记录 ID")
    return
  }
  try {
    const data = await loadRecordData(props.pageKey, id)
    if (data === null) {
      recordText.value = ""
      showStatus(`页面 ${props.pageKey} 下没有记录 ${id}`)
    } else {
      recordText.value = JSON.stringify(data, null, 2)
      localStorage.setItem(recordLocalKey(current.uid, id), recordText.value)
      showStatus(`记录 ${id} 已从云端加载并缓存`)
    }
  } catch (e) {
    showStatus(`记录加载失败：${(e as Error).message}`)
    console.error(e)
  }
}

function startRecordRealtime() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  const id = recordId.value.trim()
  if (!id) {
    alert("请先填写记录 ID")
    return
  }
  if (unsubRecordRealtime) return

  const uid = current.uid
  try {
    unsubRecordRealtime = subscribeRecordData(
      props.pageKey,
      id,
      data => {
        const value = data ? JSON.stringify(data, null, 2) : ""
        recordText.value = value
        localStorage.setItem(recordLocalKey(uid, id), value)
        showStatus(`实时：记录 ${id} 已更新`)
      },
      err => {
        showStatus(`记录实时订阅出错：${err.message}`)
      }
    )
    recordRealtimeOn.value = true
    showStatus(`已开启记录 ${id} 的实时同步`)
  } catch (e) {
    showStatus(`开启记录实时同步失败：${(e as Error).message}`)
  }
}

function stopRecordRealtime() {
  if (unsubRecordRealtime) {
    unsubRecordRealtime()
    unsubRecordRealtime = null
  }
  recordRealtimeOn.value = false
  showStatus("已关闭记录实时同步")
}

function clearRecordLocal() {
  const current = user.value
  if (!current) {
    alert("请先登录")
    return
  }
  const id = recordId.value.trim()
  if (!id) {
    alert("请先填写记录 ID")
    return
  }
  localStorage.removeItem(recordLocalKey(current.uid, id))
  showStatus(`已清除记录 ${id} 的本地缓存`)
}

watch(
  () => ({ currentUser: user.value, pageKey: props.pageKey }),
  ({ currentUser, pageKey }) => {
    if (!currentUser) {
      stopRealtime()
      showStatus("未登录")
      return
    }
    if (realtimeOn.value && unsubRealtime) {
      stopRealtime()
    }
    const cached = localStorage.getItem(localKey(currentUser.uid))
    if (cached) {
      text.value = cached
      showStatus("从本地缓存恢复内容（未必是云端最新）")
    } else {
      showStatus(`登录成功，未检测到页面 ${pageKey} 的本地缓存`)
    }
  },
  { immediate: true }
)

watch(
  () => ({ currentUser: user.value, pageKey: props.pageKey, id: recordId.value.trim() }),
  ({ currentUser, pageKey, id }) => {
    if (!currentUser) {
      stopRecordRealtime()
      recordText.value = ""
      return
    }
    if (!id) {
      recordText.value = ""
      stopRecordRealtime()
      showStatus("请填写记录 ID 以继续记录操作")
      return
    }
    if (recordRealtimeOn.value && unsubRecordRealtime) {
      stopRecordRealtime()
    }
    const cached = localStorage.getItem(recordLocalKey(currentUser.uid, id))
    if (cached) {
      recordText.value = cached
      showStatus(`记录 ${id} 已从本地缓存恢复（未必是云端最新）`)
    } else {
      recordText.value = "{  }"
      showStatus(`未检测到记录 ${id} 的本地缓存，可尝试从云端加载`)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (unsubRealtime) {
    unsubRealtime()
    unsubRealtime = null
  }
  if (unsubRecordRealtime) {
    unsubRecordRealtime()
    unsubRecordRealtime = null
  }
})
</script>

<style scoped>
.firebase-form {
  padding: 16px;
  max-width: 900px;
}
.json-area {
  width: 100%;
  height: 260px;
  font-family: monospace;
  margin-top: 8px;
}
.controls {
  margin-top: 8px;
}
.btn {
  margin: 6px 8px 6px 0;
  padding: 8px 12px;
  cursor: pointer;
}
#status {
  background: #f6f6f6;
  padding: 10px;
  border-radius: 6px;
  margin-top: 12px;
  white-space: pre-wrap;
}
.page-info {
  margin: 8px 0;
  color: #555;
}
.section-divider {
  margin-top: 24px;
  margin-bottom: 24px;
  border-top: 1px solid #eee;
}
.record-section {
  margin-top: 24px;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.record-id {
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
}

.record-area {
  margin-top: 8px;
}

.record-controls {
  margin-top: 8px;
}
</style>
