<template>
  <div class="dict-selector">
    <el-tabs v-model="activeTab" class="dict-tabs">
      <el-tab-pane label="中国考试" name="中国考试">
        <div class="dict-grid">
          <div
            v-for="dict in chineseDicts"
            :key="dict.id"
            class="dict-card"
            @click="selectDict(dict)"
          >
            <div class="dict-title">{{ dict.label }}</div>
            <div class="dict-description">{{ dict.description }}</div>
            <div class="dict-count">{{ dict.length }}个词</div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="国际考试" name="国际考试">
        <div class="dict-grid">
          <div
            v-for="dict in internationalDicts"
            :key="dict.id"
            class="dict-card"
            @click="selectDict(dict)"
          >
            <div class="dict-title">{{ dict.label }}</div>
            <div class="dict-description">{{ dict.description }}</div>
            <div class="dict-count">{{ dict.length }}个词</div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="青少年英语" name="青少年英语">
        <div class="dict-grid">
          <div
            v-for="dict in youthDicts"
            :key="dict.id"
            class="dict-card"
            @click="selectDict(dict)"
          >
            <div class="dict-title">{{ dict.label }}</div>
            <div class="dict-description">{{ dict.description }}</div>
            <div class="dict-count">{{ dict.length }}个词</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { dictTree } from './dictTree'
import axios from 'axios'

const emits = defineEmits<{
  (e: 'dict-selected', data: { words: any[], dictInfo: any }): void
}>()

const activeTab = ref('中国考试')

// 扁平化词典数据并分类
const chineseDicts = ref<any[]>([])
const internationalDicts = ref<any[]>([])
const youthDicts = ref<any[]>([])

// 处理词典树数据
function flattenDicts(tree: any[]) {
  tree.forEach(category => {
    const flatDicts = flattenCategory(category.children)
    
    if (category.label === '中国考试') {
      chineseDicts.value = flatDicts
    } else if (category.label === '国际考试') {
      internationalDicts.value = flatDicts
    } else if (category.label === '青少年英语') {
      youthDicts.value = flatDicts
    }
  })
}

// 递归扁平化子分类
function flattenCategory(children: any[]): any[] {
  const result: any[] = []
  
  children.forEach(item => {
    if (item.children && item.children.length > 0) {
      // 如果有子分类，继续递归
      result.push(...flattenCategory(item.children))
    } else {
      // 如果没有子分类，就是词典项
      result.push(item)
    }
  })
  
  return result
}

// 初始化数据
flattenDicts(dictTree)

// 选择词典
async function selectDict(dict: any) {
  try {
    const response = await axios.get(dict.url,{
      baseURL: ""
    })
    emits('dict-selected', {
      words: response.data,
      dictInfo: dict
    })
  } catch (error) {
    console.error('加载词典失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.dict-tabs {
  :deep() {
    .el-tabs__header {
      margin-bottom: 20px;
    }
  }
}

.dict-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.dict-card {
  position: relative;
  padding: 16px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 120px;
  
  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.dict-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.dict-description {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.dict-count {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}
</style>

