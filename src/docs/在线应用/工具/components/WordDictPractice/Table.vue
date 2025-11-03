<template>
  <div class="table-container">
    <el-table
      :data="pagedData"
      :row-class-name="rowClass"
      border
    >
      <el-table-column
        label="序号"
        width="80"
        align="center"
      >
        <template #default="{ $index }">
          {{ (currentPage - 1) * pageSize + $index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="word"
        label="单词"
        width="150"
      >
        <template #header>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
            <span>单词</span>
            <el-icon
              :size="16"
              style="cursor: pointer;"
              @click="toggleColumnHide('word')"
            >
              <Hide v-if="!wordColumnHidden" />
              <View v-else />
            </el-icon>
          </div>
        </template>
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span v-if="row.wordHidden" style="flex: 1;">***</span>
            <span v-else style="flex: 1;">{{ row.word }}</span>
            <el-icon
              :size="16"
              style="cursor: pointer; flex-shrink: 0;"
              @click="row.wordHidden = !row.wordHidden"
            >
              <Hide v-if="!row.wordHidden" />
              <View v-else />
            </el-icon>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="音标"
        width="150"
      >
        <template #header>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
            <span>音标</span>
            <el-icon
              :size="16"
              style="cursor: pointer;"
              @click="toggleColumnHide('phonetic')"
            >
              <Hide v-if="!phoneticColumnHidden" />
              <View v-else />
            </el-icon>
          </div>
        </template>
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <div style="flex: 1">
              <template v-if="row.phoneticHidden">
                <p>***</p>
                <p>***</p>
              </template>
              <template v-else>
                <p>{{ row.phonetic0 }}</p>
                <p>{{ row.phonetic1 }}</p>
              </template>
            </div>
            <el-icon
              :size="16"
              style="cursor: pointer; flex-shrink: 0;"
              @click="row.phoneticHidden = !row.phoneticHidden"
            >
              <Hide v-if="!row.phoneticHidden" />
              <View v-else />
            </el-icon>
            <el-icon
              :size="20"
              style="cursor: pointer; color: var(--el-color-primary); flex-shrink: 0;"
              @click="playAudio(row.word, 'us')"
            >
              <VideoPlay />
            </el-icon>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="释义"
        width="300"
      >
        <template #default="{ row }">
          <div>
            <br />
            <p
              v-for="item in row.trans"
              :key="item.pos"
            >
              {{ item.pos }} {{ item.cn }}
            </p>
            <br />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="默写"
        min-width="300"
      >
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-icon
              :size="20"
              style="cursor: pointer; color: var(--el-color-primary)"
              @click="playAudio(row.word, 'us')"
            >
              <VideoPlay />
            </el-icon>
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              autosize
              v-model="row.modelValue"
              placeholder=""
              clearable
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[20, 50, 100]"
      :total="tableData.length"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 16px; justify-content: flex-end"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { ElIcon } from "element-plus"
import { VideoPlay, Hide, View } from "@element-plus/icons-vue"

const props = defineProps<{
  data: any
}>()

// 为每个数据项初始化 modelValue 字段，确保响应式
const tableData = ref<any[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(50)

// 计算当前页显示的数据
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 音频播放相关
const PronunciationApi = "https://dict.youdao.com/dictvoice?audio="
const audio = new Audio()

// 播放音频
function playAudio(word: string, type: string = "us") {
  const audioType = type === "uk" ? 1 : 2
  const url = `${PronunciationApi}${word}&type=${audioType}`
  audio.src = url
  audio.volume = 0.8 // 默认音量
  audio.playbackRate = 1 // 默认速度
  audio.play().catch(err => {
    console.error("播放失败:", err)
  })
}

// 列级别显示隐藏状态
const wordColumnHidden = ref(false)
const phoneticColumnHidden = ref(false)

// 切换列显示隐藏
function toggleColumnHide(key: 'word' | 'phonetic') {
  if (key === 'word') {
    wordColumnHidden.value = !wordColumnHidden.value
    tableData.value.forEach(row => {
      row.wordHidden = wordColumnHidden.value
    })
  } else if (key === 'phonetic') {
    phoneticColumnHidden.value = !phoneticColumnHidden.value
    tableData.value.forEach(row => {
      row.phoneticHidden = phoneticColumnHidden.value
    })
  }
}

// 初始化数据
watch(
  () => props.data,
  newData => {
    tableData.value = newData.map((item: any) => ({
      ...item,
      modelValue: item.modelValue || "",
      wordHidden: wordColumnHidden.value,
      phoneticHidden: phoneticColumnHidden.value,
    }))
    // 数据更新后重置到第一页
    currentPage.value = 1
  },
  { immediate: true }
)

function rowClass({ row }: any) {
  if (row.modelValue === row.word) return "bg-success"
  return ""
}
</script>
<style lang="scss" scoped>
:deep() {
  .bg-success {
    background-color: var(--el-color-success-light-9);
  }
}
</style>
