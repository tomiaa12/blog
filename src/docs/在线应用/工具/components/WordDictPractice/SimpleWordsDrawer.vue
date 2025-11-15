<template>
  <el-drawer
    v-model="visible"
    :lock-scroll="true"
    :title="`已熟悉单词${ simpleWords.length }`"
    :size="isMobile ? '100%' : '35%'"
    direction="rtl"
    class="simple-word-drawer"
    append-to-body
  >
    <div class="simple-word-panel">
      <div
        v-if="loading"
        class="simple-word-status"
      >
        正在加载...
      </div>
      <div
        v-else-if="error"
        class="simple-word-status simple-word-status--error"
      >
        {{ error }}
      </div>
      <template v-else>
        <div>
          <div style="font-size: 14px">
            熟悉单词将不会出现在默写单词列表中。
          </div>
          <div
            class="simple-word-actions"
            v-if="simpleWords.length"
          >
            <!-- <p style="font-size: 14px">
              共 {{ simpleWords.length }} 个熟悉单词
            </p> -->

            <el-button
              type="danger"
              size="small"
              :disabled="!simpleWords.length"
              @click="handleClearAll"
            >
              清空所有熟悉单词
            </el-button>
          </div>
        </div>
        <template v-if="simpleWords.length">
          <el-input 
            v-model="keyWord" 
            placeholder="输入单词或释义筛选" 
            clearable 
          />
          
          <div 
            v-if="keyWord.trim() && filteredSimpleWords.length === 0"
            class="simple-word-status"
          >
            未找到匹配的单词
          </div>
          
          <div 
            v-else-if="keyWord.trim()"
            style="font-size: 13px; color: var(--el-text-color-regular); padding: 4px 0;"
          >
            找到 {{ filteredSimpleWords.length }} 个匹配的单词
          </div>
          
          <div class="simple-word-list">
            <div
              v-for="item in pagedSimpleWords"
              :key="item.key"
              class="simple-word-item"
            >
              <div class="simple-word-item__title">
                <span class="word">{{ item.word }}</span>
                <div
                  class="simple-word-item__phonetics"
                  v-if="
                    item.phonetic0 ||
                    (item.phonetic1 && item.phonetic1 !== item.phonetic0)
                  "
                >
                  <span
                    class="phonetic-item"
                    v-if="item.phonetic0"
                  >
                    <WordAudioButton
                      :word="item.word"
                      variant="us"
                      :size="18"
                    />
                    <span class="phonetic">[{{ item.phonetic0 }}]</span>
                  </span>
                  <span
                    class="phonetic-item"
                    v-if="item.phonetic1 && item.phonetic1 !== item.phonetic0"
                  >
                    <WordAudioButton
                      :word="item.word"
                      variant="uk"
                      :size="18"
                    />
                    <span class="phonetic">[{{ item.phonetic1 }}]</span>
                  </span>
                </div>
              </div>
              <div class="simple-word-item__trans">
                <ExpandableText
                  v-for="trans in item.trans"
                  :key="trans.pos + trans.cn"
                  :max-lines="2"
                >
                  <span class="trans-item">
                    <PosTag :pos="trans.pos">{{ trans.pos }}</PosTag>
                    {{ trans.cn }}
                  </span>
                </ExpandableText>
              </div>
              <div class="simple-word-item__actions">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleRemove(item)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="filteredSimpleWords.length"
            :pager-count="4"
            layout="prev, pager, next, jumper"
            class="simple-word-pagination"
          />
        </template>
        <div
          v-else
          class="simple-word-status"
        >
          暂无已熟悉单词
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import PosTag from "./PosTag.vue"
import { ElMessageBox } from "element-plus"
import type { SimpleWordItem } from "./hooks/useSimpleWords"
import { isMobile } from "@/utils"
import { useScrollLock } from "@/hooks/useScrollLock"
import WordAudioButton from "./WordAudioButton.vue"
import ExpandableText from "./ExpandableText.vue"

const props = defineProps<{
  modelValue: boolean
  simpleWords: SimpleWordItem[]
  loading: boolean
  error: string | null
}>()

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "remove", item: SimpleWordItem): void
  (e: "clear-all"): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: value => emits("update:modelValue", value),
})

useScrollLock(visible)
const keyWord = ref("")
const confirmingDeleteAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 根据搜索关键词过滤单词
const filteredSimpleWords = computed(() => {
  if (!keyWord.value.trim()) {
    return props.simpleWords
  }
  
  const keyword = keyWord.value.trim().toLowerCase()
  return props.simpleWords.filter(item => {
    // 搜索单词
    if (item.word.toLowerCase().includes(keyword)) {
      return true
    }
    
    // 搜索释义
    if (item.trans && item.trans.length > 0) {
      return item.trans.some(trans => {
        const cnText = trans.cn?.toLowerCase() || ""
        const posText = trans.pos?.toLowerCase() || ""
        return cnText.includes(keyword) || posText.includes(keyword)
      })
    }
    
    return false
  })
})

// 分页后的单词列表
const pagedSimpleWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSimpleWords.value.slice(start, end)
})

// 监听搜索关键词变化，重置到第一页
watch(keyWord, () => {
  currentPage.value = 1
})

watch(
  () => [filteredSimpleWords.value.length, pageSize.value],
  () => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredSimpleWords.value.length / pageSize.value)
    )
    if (currentPage.value > totalPages) {
      currentPage.value = totalPages
    }
  }
)

function handleRemove(item: SimpleWordItem) {
  emits("remove", item)
}

async function handleClearAll() {
  if (confirmingDeleteAll.value) return
  confirmingDeleteAll.value = true
  try {
    await ElMessageBox.confirm(
      "确定要清空所有熟悉单词吗？该操作不可恢复。",
      "清空确认",
      {
        confirmButtonText: "确认清空",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
    emits("clear-all")
  } catch {
    // cancelled
  } finally {
    confirmingDeleteAll.value = false
  }
}
</script>

<style scoped lang="scss">

.simple-word-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.simple-word-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  box-shadow: 0 1px 0 0 var(--el-border-color-light);
}

.simple-word-status {
  padding: 24px 0;
  text-align: center;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.simple-word-status--error {
  color: var(--el-color-danger);
}

.simple-word-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 55px;
  padding-right: 10px;
}

.simple-word-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.simple-word-item__title {
  display: flex;
  align-items: center;
  gap: 8px;

  .word {
    font-weight: 600;
    font-size: 16px;
  }

  .simple-word-item__phonetics {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;

    .phonetic-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }

  .phonetic {
    color: var(--el-text-color-placeholder);
    font-size: 13px;
  }
}

.simple-word-item__trans {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;

  .trans-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.simple-word-item__actions {
  display: flex;
  justify-content: flex-end;
}

.simple-word-pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  position: absolute;
  bottom: 0;
  background-color: var(--el-bg-color);
}
</style>

<style lang="scss">
.simple-word-drawer {
  .el-drawer__body {
    padding-right: 0;
    padding-top: 0;
  }
}
.simple-word-drawer {
  .el-drawer__header {
    margin-bottom: 10px;
  }
}
</style>
