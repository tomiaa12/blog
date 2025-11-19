<template>
  <el-drawer
    v-model="visible"
    :lock-scroll="true"
    :title="`生僻词${rareWords.length}`"
    :size="isMobile ? '100%' : '35%'"
    direction="rtl"
    class="rare-word-drawer"
    append-to-body
  >
    <div class="rare-word-panel">
      <div
        v-if="loading"
        class="rare-word-status"
      >
        正在加载...
      </div>
      <div
        v-else-if="error"
        class="rare-word-status rare-word-status--error"
      >
        {{ error }}
      </div>
      <template v-else>
        <div>
          <div style="font-size: 14px; line-height: 1.8;">
            <p style="margin: 0 0 8px 0;">生僻词用于标记不常见或难以记忆的单词。</p>
            <p style="margin: 0;">可在设置中切换<strong>练习模式</strong>：专门练习生僻词，或暂时排除生僻词。</p>
          </div>
          <div
            class="rare-word-actions"
            v-if="rareWords.length"
          >
            <el-button
              type="danger"
              size="small"
              :disabled="!rareWords.length"
              @click="handleClearAll"
            >
              清空所有生僻词
            </el-button>
          </div>
        </div>
        <template v-if="rareWords.length">
          <div style="display: flex; gap: 8px; align-items: center;">
            <el-input
              v-model="keyWord"
              placeholder="输入单词或释义筛选"
              clearable
              style="flex: 1;"
            />
            <el-select
              v-model="sortType"
              placeholder="排序方式"
              style="width: 120px;"
              @change="handleSortChange"
            >
              <el-option label="时间倒序" value="timeDesc" />
              <el-option label="时间顺序" value="timeAsc" />
              <el-option label="单词顺序" value="wordAsc" />
              <el-option label="单词倒序" value="wordDesc" />
            </el-select>
          </div>
          
          <div 
            v-if="keyWord.trim() && filteredRareWords.length === 0"
            class="rare-word-status"
          >
            未找到匹配的单词
          </div>
          
          <div 
            v-else-if="keyWord.trim()"
            style="font-size: 13px; color: var(--el-text-color-regular); padding: 4px 0;"
          >
            找到 {{ filteredRareWords.length }} 个匹配的单词
          </div>
          
          <div class="rare-word-list">
            <div
              v-for="item in pagedRareWords"
              :key="item.key"
              class="rare-word-item"
            >
              <div class="rare-word-item__title">
                <span class="word">{{ item.word }}</span>
                <div class="rare-word-item__time">
                  {{ formatTime(item.addedAt) }}
                </div>
                <div
                  class="rare-word-item__phonetics"
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
              <div class="rare-word-item__trans">
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
              <div class="rare-word-item__actions">
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
            :total="filteredRareWords.length"
            :pager-count="4"
            layout="prev, pager, next, jumper"
            class="rare-word-pagination"
          />
        </template>
        <div
          v-else
          class="rare-word-status"
        >
          暂无生僻词
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import PosTag from "./PosTag.vue"
import { ElMessageBox } from "element-plus"
import type { RareWordItem } from "./hooks/useRareWords"
import { isMobile } from "@/utils"
import { useScrollLock } from "@/hooks/useScrollLock"
import WordAudioButton from "./WordAudioButton.vue"
import ExpandableText from "./ExpandableText.vue"

const props = defineProps<{
  modelValue: boolean
  rareWords: RareWordItem[]
  loading: boolean
  error: string | null
}>()

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "remove", item: RareWordItem): void
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
const sortType = ref<"timeDesc" | "timeAsc" | "wordAsc" | "wordDesc">("timeDesc") // 默认时间倒序

// 根据搜索关键词过滤并排序单词
const filteredRareWords = computed(() => {
  let filtered = props.rareWords

  // 先过滤
  if (keyWord.value.trim()) {
    const keyword = keyWord.value.trim().toLowerCase()
    filtered = props.rareWords.filter(item => {
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
  }

  // 再排序
  return filtered.sort((a, b) => {
    switch (sortType.value) {
      case "timeDesc":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      case "timeAsc":
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      case "wordAsc":
        return a.word.localeCompare(b.word)
      case "wordDesc":
        return b.word.localeCompare(a.word)
      default:
        return 0
    }
  })
})

// 分页后的单词列表
const pagedRareWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRareWords.value.slice(start, end)
})

// 监听搜索关键词变化，重置到第一页
watch(keyWord, () => {
  currentPage.value = 1
})

// 排序变化时重置到第一页
function handleSortChange() {
  currentPage.value = 1
}

// 格式化时间显示
function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }

  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}分钟前`
  }

  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}小时前`
  }

  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }

  // 超过7天显示具体日期时间
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  // 如果是今年，不显示年份
  if (year === now.getFullYear()) {
    return `${month}-${day} ${hour}:${minute}`
  }

  return `${year}-${month}-${day} ${hour}:${minute}`
}

watch(
  () => [filteredRareWords.value.length, pageSize.value],
  () => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredRareWords.value.length / pageSize.value)
    )
    if (currentPage.value > totalPages) {
      currentPage.value = totalPages
    }
  }
)

function handleRemove(item: RareWordItem) {
  emits("remove", item)
}

async function handleClearAll() {
  if (confirmingDeleteAll.value) return
  confirmingDeleteAll.value = true
  try {
    await ElMessageBox.confirm(
      "确定要清空所有生僻词吗？该操作不可恢复。",
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

.rare-word-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.rare-word-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  box-shadow: 0 1px 0 0 var(--el-border-color-light);
}

.rare-word-status {
  padding: 24px 0;
  text-align: center;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.rare-word-status--error {
  color: var(--el-color-danger);
}

.rare-word-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 55px;
  padding-right: 10px;
}

.rare-word-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rare-word-item__title {
  display: flex;
  align-items: center;
  gap: 8px;

  .word {
    font-weight: 600;
    font-size: 16px;
  }

  .rare-word-item__time {
    color: var(--el-text-color-placeholder);
    font-size: 12px;
    margin-left: auto;
  }

  .rare-word-item__phonetics {
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

.rare-word-item__trans {
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

.rare-word-item__actions {
  display: flex;
  justify-content: flex-end;
}

.rare-word-pagination {
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
.rare-word-drawer {
  .el-drawer__body {
    padding-right: 0;
    padding-top: 0;
  }
}
.rare-word-drawer {
  .el-drawer__header {
    margin-bottom: 10px;
  }
}
</style>

