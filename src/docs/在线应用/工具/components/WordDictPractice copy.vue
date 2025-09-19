<template>
  <div class="word-practice-container">
    <div class="left">
      <div class="controls">
        <el-input v-model="search" placeholder="搜索单词/音标/释义" clearable style="width:320px" />

        <!-- 保留重置与分页设置在上方 -->
        <el-button type="primary" @click="resetAll" style="margin-left:12px">重置</el-button>

        <div style="float:right; display:flex; gap:12px; align-items:center">
          <span>每页</span>
          <el-input-number v-model="pageSize" :min="1" :max="9999" controls-position="right" style="width:120px" />
        </div>
      </div>

      <el-table-v2 :data="pagedData" :default-sort="defaultSort"
        @sort-change="onSortChange">

        <!-- 单词列：表头带隐藏 checkbox -->
        <el-table-column prop="word" width="180">
          <template #header>
            <div style="display:flex; align-items:center; gap:8px">
              <span>单词</span>
              <el-checkbox v-model="hiddenColumns.word" @click.stop size="small"></el-checkbox>
            </div>
          </template>
          <template #default="{ row }">
            <span v-if="!hiddenColumns.word || row.correct">{{ row.word }}</span>
            <span v-else>••••</span>
          </template>
        </el-table-column>

        <!-- 音标列：表头带隐藏 checkbox -->
        <el-table-column prop="phonetic" width="160">
          <template #header>
            <div style="display:flex; align-items:center; gap:8px">
              <span>音标</span>
              <el-checkbox v-model="hiddenColumns.phonetic" @click.stop size="small"></el-checkbox>
            </div>
          </template>
          <template #default="{ row }">
            <span v-if="!hiddenColumns.phonetic || row.correct">{{ row.phonetic }}</span>
            <span v-else>••••</span>
          </template>
        </el-table-column>

        <!-- 释义列：表头带隐藏 checkbox -->
        <el-table-column prop="definition">
          <template #header>
            <div style="display:flex; align-items:center; gap:8px">
              <span>释义</span>
              <el-checkbox v-model="hiddenColumns.definition" @click.stop size="small"></el-checkbox>
            </div>
          </template>
          <template #default="{ row }">
            <span v-if="!hiddenColumns.definition || row.correct">{{ row.definition }}</span>
            <span v-else>••••</span>
          </template>
        </el-table-column>

        <!-- 是否正确列 -->
        <el-table-column prop="correct" label="是否正确" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.correct" type="success">✔</el-tag>
            <span v-else></span>
          </template>
        </el-table-column>

        <!-- 默写输入列：表头右侧放置默写字段选择 -->
        <el-table-column width="360">
          <template #header>
            <div style="display:flex; align-items:center; justify-content:space-between">
              <div style="display:flex; align-items:center; gap:8px">
                <span>默写（输入）</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px">
                <el-select v-model="testField" placeholder="默写字段" size="small" style="width:160px"
                  @click.stop>
                  <el-option label="单词 (word)" value="word" />
                  <el-option label="音标 (phonetic)" value="phonetic" />
                  <el-option label="释义 (definition)" value="definition" />
                </el-select>
              </div>
            </div>
          </template>

          <template #default="{ row }">
            <div style="display:flex; gap:8px; align-items:center">
              <el-input v-model="row.userInput" placeholder="在此输入默写答案" clearable @input="onInput(row)"
                @keyup.enter.native="onInput(row)" style="flex:1" />
              <el-button size="small" @click.stop="toggleSimpleFromRow(row)">
                {{ simpleWordIds.includes(row.id) ? '已在简单词' : '加入简单词' }}
              </el-button>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列：右侧额外操作（可选） -->
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button size="small" type="text" @click.stop="toggleSimpleFromRow(row)">
              {{ simpleWordIds.includes(row.id) ? '移除简单词' : '加入简单词' }}
            </el-button>
          </template>
        </el-table-column>

      </el-table-v2>

      <div class="footer">
        <el-pagination background :page-size="pageSize" :current-page.sync="currentPage" :total="filteredData.length"
          layout="prev, pager, next, total" />
      </div>
    </div>

    <div class="right">
      <div class="simple-list">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <h4>简单词</h4>
          <el-button type="text" @click="clearSimple">清空</el-button>
        </div>
        <el-input v-model="simpleSearch" placeholder="快速筛选" size="small" clearable />
        <div class="list-items">
          <el-checkbox-group v-model="simpleWordIds">
            <el-checkbox v-for="item in simpleCandidates" :key="item.id" :label="item.id">
              <span class="small-word">{{ item.word }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// ------------------------- props & emits -------------------------
// words: 外部传入的单词数组，每项对象结构：{ id?, word, phonetic, definition, correct? }
// pageSizeDefault: 默认每页大小（你之前要求 9999）
const props = defineProps({
  words: { type: Array, required: true, default: () => [] },
  pageSizeDefault: { type: Number, default: 9999 }
})
const emit = defineEmits(['update:words', 'correct'])

// ------------------------- 本地数据结构（localWords） -------------------------
// 我们在组件内部维护一份 localWords：
// { id, word, phonetic, definition, correct(boolean), userInput }
const localWords = ref([])
const makeLocal = (arr) => arr.map((w, idx) => ({
  id: w.id ?? `${Date.now()}_${idx}`,
  word: w.word ?? '',
  phonetic: w.phonetic ?? '',
  definition: w.definition ?? '',
  correct: !!w.correct,
  userInput: ''
}))
localWords.value = makeLocal(props.words)
// 当 props.words 变化时同步本地数据（深度监听）
watch(() => props.words, (v) => { localWords.value = makeLocal(v) }, { deep: true })

// ------------------------- 表头控制项 -------------------------
// 哪些列被隐藏（全局开关）
const hiddenColumns = reactive({ word: false, phonetic: false, definition: false })
// 当前默写考查的字段（默认为 word）
const testField = ref('word')

// ------------------------- 搜索 / 分页 / 排序 -------------------------
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(props.pageSizeDefault)
watch(pageSize, () => { currentPage.value = 1 })

// 简单词库（右侧）存储的是 id 列表，用于从练习表中过滤这些单词
const simpleWordIds = ref([])
const simpleSearch = ref('')

// 排序状态（简单实现）
const defaultSort = ref({ prop: '', order: '' })
function onSortChange (info) {
  defaultSort.value = info
}

// 过滤：搜索 + 排除已标为简单词
const filteredData = computed(() => {
  const q = search.value.trim().toLowerCase()
  return localWords.value.filter((row) => {
    if (simpleWordIds.value.includes(row.id)) return false
    if (!q) return true
    return (
      (row.word || '').toLowerCase().includes(q) ||
      (row.phonetic || '').toLowerCase().includes(q) ||
      (row.definition || '').toLowerCase().includes(q)
    )
  })
})

// 客户端排序
const sortedData = computed(() => {
  const list = filteredData.value.slice()
  const s = defaultSort.value
  if (!s || !s.prop) return list
  const order = s.order === 'ascending' ? 1 : -1
  list.sort((a, b) => {
    const va = (a[s.prop] || '').toString().toLowerCase()
    const vb = (b[s.prop] || '').toString().toLowerCase()
    if (va < vb) return -1 * order
    if (va > vb) return 1 * order
    return 0
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedData.value.length / pageSize.value)))
watch(currentPage, (v) => { if (v > totalPages.value) currentPage.value = totalPages.value })
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize.value
  const e = s + pageSize.value
  return sortedData.value.slice(s, e)
})

// 右侧简单词候选（支持搜索）
const simpleCandidates = computed(() => {
  const q = simpleSearch.value.trim().toLowerCase()
  return localWords.value.filter((r) => (q ? r.word.toLowerCase().includes(q) : true))
})

// ------------------------- 判定逻辑：严格匹配（忽略大小写与首尾空格） -------------------------
function checkAnswer (row) {
  const target = (row[testField.value] || '').trim().toLowerCase()
  const input = (row.userInput || '').trim().toLowerCase()
  if (!target) return false
  return input === target
}

function onInput (row) {
  // 每次输入都会触发校验，校验通过则标记 correct 并触发事件
  const ok = checkAnswer(row)
  if (ok && !row.correct) {
    row.correct = true
    emit('correct', { ...row })
  } else if (!ok && row.correct) {
    row.correct = false
  }
}

// ------------------------- 简单词操作 -------------------------
function toggleSimpleFromRow (row) {
  const id = row.id
  const idx = simpleWordIds.value.indexOf(id)
  if (idx === -1) {
    simpleWordIds.value.push(id)
    ElMessage.success(`已将 "${row.word}" 加入简单词`)
  } else {
    simpleWordIds.value.splice(idx, 1)
    ElMessage.info(`已从简单词移除 "${row.word}"`)
  }
}

function resetAll () {
  localWords.value.forEach((r) => { r.userInput = ''; r.correct = false })
  hiddenColumns.word = false
  hiddenColumns.phonetic = false
  hiddenColumns.definition = false
  simpleWordIds.value = []
}
function clearSimple () { simpleWordIds.value = [] }

// ------------------------- 同步回父组件 -------------------------
watch(localWords, (v) => {
  const stripped = v.map(({ id, word, phonetic, definition, correct }) => ({ id, word, phonetic, definition, correct }))
  emit('update:words', stripped)
}, { deep: true })
</script>

<style scoped>
.word-practice-container {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}
.left {
  flex: 1 1 70%;
}
.right {
  width: 260px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.table-wrap {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}
.footer {
  margin-top: 12px;
  text-align: right
}
.small-word {
  display: inline-block;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}
.list-items {
  margin-top: 8px;
  max-height: 520px;
  overflow: auto
}
</style>
