<template>
  <div class="word-dict-practice">
    <div class="header">
      <el-button type="primary" @click="showDictDialog = true">
        选择词典
      </el-button>
      <span class="current-dict" v-if="currentDictName">当前词典：{{ currentDictName }}</span>
    </div>
    
    <el-dialog
      v-model="showDictDialog"
      title="选择词典"
      width="calc(100vw - 40px)"
      top="2vh"
    >
      <DictSelector v-model="currentDictId" @dict-selected="handleDictSelected" />
    </el-dialog>
    
    <Table v-if="selectedData.length" :data="selectedData" class="word-table" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Table from './Table.vue'
import DictSelector from './DictSelector.vue'
import { flatDictList } from './dictTree'
import axios from 'axios'

const props = defineProps({})
const emits = defineEmits([])

const STORAGE_KEY = "word-dict-practice-selected-dict-id"

const selectedData = ref<any[]>([])
const currentDictName = ref('')
const currentDictId = ref<string>(localStorage.getItem(STORAGE_KEY) || 'cet4')
const showDictDialog = ref(false)

// 加载词典数据
async function loadDictById(dictId: string) {
  const dict = flatDictList.find(d => d.id === dictId)
  if (!dict) {
    console.error('未找到词典:', dictId)
    return
  }

  try {
    const response = await axios.get(dict.url, {
      baseURL: ""
    })
    selectedData.value = response.data
    currentDictName.value = dict.label
  } catch (error) {
    console.error('加载词典失败:', error)
  }
}

// 监听 currentDictId 变化，自动加载词典（只在非用户点击时触发）
let isSelectingFromClick = false

watch(currentDictId, (newValue, oldValue) => {
  // 如果是点击卡片导致的 currentDictId 变化，不在这里加载（由 handleDictSelected 处理）
  if (newValue && newValue !== oldValue && !isSelectingFromClick) {
    loadDictById(newValue)
  }
  isSelectingFromClick = false
}, { immediate: true })

function handleDictSelected(payload: { words: any[], dictInfo: any }) {
  isSelectingFromClick = true
  selectedData.value = payload.words
  currentDictName.value = payload.dictInfo.label
  currentDictId.value = payload.dictInfo.id
  showDictDialog.value = false
  // 保存到 localStorage
  localStorage.setItem(STORAGE_KEY, payload.dictInfo.id)
}
</script>

<style lang="scss" scoped>
.word-dict-practice {
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  
  .current-dict {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}

.word-table {
  height: calc(88vh - 60px);
}

:deep() .el-dialog__title {
  font-size: 25px;
  font-weight: 600;
}
</style>