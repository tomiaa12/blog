<template>
  <el-drawer
    v-model="visible"
    title="已熟悉单词"
    :size="isMobile ? '100%' : '35%'"
    direction="rtl"
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
        <div >
          <div style="font-size: 14px;">熟悉单词将不会出现在默写单词列表中。</div>
          <div class="simple-word-actions">
            <p v-if="simpleWords.length" style="font-size: 14px;">
              共 {{ simpleWords.length }} 个熟悉单词
            </p>

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
          <div class="simple-word-list">
            <div
              v-for="item in pagedSimpleWords"
              :key="item.key"
              class="simple-word-item"
            >
              <div class="simple-word-item__title">
                <span class="word">{{ item.word }}</span>
                <span
                  class="phonetic"
                  v-if="item.phonetic0"
                  >[{{ item.phonetic0 }}]</span
                >
                <span
                  class="phonetic"
                  v-if="item.phonetic1 && item.phonetic1 !== item.phonetic0"
                >
                  [{{ item.phonetic1 }}]
                </span>
              </div>
              <div class="simple-word-item__trans">
                <span
                  v-for="trans in item.trans"
                  :key="trans.pos + trans.cn"
                  class="trans-item"
                >
                  <PosTag :pos="trans.pos">{{ trans.pos }}</PosTag>
                  {{ trans.cn }}
                </span>
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
            :total="simpleWords.length"
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

const confirmingDeleteAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const pagedSimpleWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.simpleWords.slice(start, end)
})

watch(
  () => [props.simpleWords.length, pageSize.value],
  () => {
    const totalPages = Math.max(
      1,
      Math.ceil(props.simpleWords.length / pageSize.value)
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
  align-items: baseline;
  gap: 8px;

  .word {
    font-weight: 600;
    font-size: 16px;
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
