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
      <DictSelector @dict-selected="handleDictSelected" />
    </el-dialog>
    
    <Table v-if="selectedData.length" :data="selectedData" class="word-table" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Table from './Table.vue'
import DictSelector from './DictSelector.vue'

const props = defineProps({})
const emits = defineEmits([])

const selectedData = ref<any[]>([])
const currentDictName = ref('')
const showDictDialog = ref(false)

function handleDictSelected(payload: { words: any[], dictInfo: any }) {
  selectedData.value = payload.words
  currentDictName.value = payload.dictInfo.label
  showDictDialog.value = false
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