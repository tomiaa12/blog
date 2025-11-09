<template>
  <div
    class="dict-selector"
    v-loading="loadingDictId !== null"
    element-loading-text="正在加载词典..."
    element-loading-background="rgba(255, 255, 255, 0.85)"
  >
    <el-tabs v-model="activeTab" class="dict-tabs">
      <el-tab-pane 
        v-for="category in dictTree" 
        :key="category.label" 
        :label="category.label" 
        :name="category.label"
      >
        <!-- 第二级：遍历子分类，显示 label 和卡片 -->
        <div v-for="subCategory in category.children" :key="subCategory.label" class="sub-category-section">
          <div class="sub-category-label">{{ subCategory.label }}</div>
          <div class="dict-card-grid">
            <!-- 第三级：竖着的长方形卡片显示词典 label + length -->
            <div
              v-for="dict in subCategory.children"
              :key="dict.id"
              class="dict-card"
              :class="{ 'is-selected': selectedDictId === dict.id }"
              @click="selectDict(dict)"
            >
                <div class="dict-label">{{ dict.label }}</div>
                <div class="dict-desc">{{ dict.description }}</div>
                <div class="dict-length">{{ dict.length }}个词</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { dictTree, flatDictList } from './dictTree'
import axios from 'axios'

const props = defineProps<{
  modelValue?: string | null
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'dict-selected', data: { words: any[], dictInfo: any }): void
}>()

const activeTab = ref<string>(dictTree[0]?.label || '')
const loadingDictId = ref<string | null>(null)

// 计算属性：使用 modelValue 作为选中状态
const selectedDictId = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emits('update:modelValue', value)
})

// 加载词典数据（点击卡片时调用）
async function loadDictById(dictId: string) {
  const dict = flatDictList.find(d => d.id === dictId)
  if (!dict) {
    console.error('未找到词典:', dictId)
    return
  }

  try {
    loadingDictId.value = dictId
    const response = await axios.get(dict.url, {
      baseURL: ""
    })
    emits('dict-selected', {
      words: response.data,
      dictInfo: dict
    })
  } catch (error) {
    console.error('加载词典失败:', error)
  } finally {
    loadingDictId.value = null
  }
}

// 监听 modelValue 变化，自动切换 tab（不加载数据，由父组件处理）
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const dict = flatDictList.find(d => d.id === newValue)
    if (dict) {
      // 找到词典所属的分类，切换到对应的 tab
      for (const category of dictTree) {
        for (const subCategory of category.children) {
          if (subCategory.children?.some(d => d.id === newValue)) {
            activeTab.value = category.label
            break
          }
        }
      }
    }
  }
}, { immediate: true })

// 选择词典（点击卡片时调用）
function selectDict(dict: any) {
  selectedDictId.value = dict.id
  // 加载词典数据
  loadDictById(dict.id)
}

</script>

<style lang="scss" scoped>

.dict-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
}

.sub-category-section {
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.sub-category-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.dict-card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.dict-card {
  width: 140px;
  min-height: 170px;
  padding: 12px 10px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 1s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  &.is-selected {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  }
}

.dict-desc {
  font-size: 12px;
  color: inherit;
  opacity: 0.8;
  word-break: break-all;
  text-align: left;
}
.dict-label {
  font-size: 16px;
  font-weight: 500;
  color: inherit;
  word-break: break-all;
}

.dict-length {
  font-size: 12px;
  color: inherit;
  opacity: 0.8;
  margin-top: auto;
  text-align: right;
}

.dict-card.is-selected .dict-length {
  opacity: 1;
}

:deep() .el-tabs__item {
  font-size: 20px;
  font-weight: 600;
}
</style>

