<template>
  <div class="table-container">
    <div
      v-if="simpleWordsLoading && !simpleWordsLoaded"
      class="simple-word-init simple-word-init--loading"
    >
      正在加载熟悉单词...
    </div>
    <div
      v-else-if="!simpleWordsLoaded"
      class="simple-word-init simple-word-init--error"
    >
      <div>
        熟悉单词加载失败 {{ simpleWordsError ? `：${simpleWordsError}` : "" }}
      </div>
      <el-button
        size="small"
        type="primary"
        @click="
          initializeSimpleWords({ forceRemote: stateReadyForSimpleWords })
        "
      >
        重试
      </el-button>
    </div>
    <template v-else>
      <div class="table-header">
        <p>单词默写练习</p>
        <div>
          <el-button
            type="primary"
            @click="shuffleData"
          >
            随机排序
          </el-button>
          <el-button
            type="primary"
            @click="shuffleCurrentPageData"
          >
            当前页随机排序
          </el-button>
          <el-button
            type="success"
            @click="openSimpleWordsDrawer"
          >
            熟悉词（{{ simpleWords.length }}个）
          </el-button>
          <el-button
            type="success"
            @click="openCurrentDictSimpleWordsDrawer"
          >
            当前词典熟悉词（{{ currentDictSimpleWordsCount }}个）
          </el-button>
          <el-button
            type="warning"
            @click="openRareWordsDrawer"
          >
            生僻词（{{ rareWords.length }}个）
          </el-button>
          <el-button
            type="warning"
            @click="openCurrentDictRareWordsDrawer"
          >
            当前词典生僻词（{{ currentDictRareWordsCount }}个）
          </el-button>
          <span>剩余 {{ tableData.length }} 词</span>
          <el-tooltip placement="top">
              <template #content>
                <p>Ctrl + ←/→ 切换上一页/下一页</p>
                <p>Ctrl + ↑/↓ 切换到第一/最后一个输入框</p>
                <p>↑/↓ 切换到上/下一个输入框</p>
                <p>Ctrl + B 播放正在输入的单词发音</p>
                <p>Ctrl + J 加入当前聚焦的单词到熟悉单词</p>
                <p>Ctrl + Shift + J 将当前页默写正确的单词全部加入熟悉单词</p>
              </template>
            <el-button>快捷键</el-button>
          </el-tooltip>
        </div>
      </div>
      <el-table
        :data="pagedData"
        :row-class-name="rowClass"
        border
        @sort-change="handleSortChange"
      >
        <template v-if="!isMobile">
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
            sortable="custom"
          >
            <template #header="{ column }">
              <div class="word-column-header">
                <span>单词</span>
                <el-icon
                  :size="16"
                  style="cursor: pointer"
                  @click.stop="toggleColumnHide('word')"
                >
                  <Hide v-if="!wordColumnHidden" />
                  <View v-else />
                </el-icon>
              </div>
            </template>
            <template #default="{ row }">
              <div style="display: flex; align-items: center; gap: 8px">
                <span
                  style="flex: 1"
                  :style="{ filter: row.wordHidden ? 'blur(5px)' : 'none', userSelect: row.wordHidden ? 'none' : 'auto' }"
                  >{{ row.word }}</span
                >
                <el-icon
                  :size="16"
                  style="cursor: pointer; flex-shrink: 0"
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
            width="160"
          >
            <template #header>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                "
              >
                <span>音标</span>
                <el-icon
                  :size="16"
                  style="cursor: pointer"
                  @click="toggleColumnHide('phonetic')"
                >
                  <Hide v-if="!phoneticColumnHidden" />
                  <View v-else />
                </el-icon>
              </div>
            </template>
            <template #default="{ row }">
              <div style="display: flex; align-items: center; gap: 8px">
                <div style="flex: 1" :style="{ filter: row.phoneticHidden ? 'blur(5px)' : 'none', userSelect: row.phoneticHidden ? 'none' : 'auto' }">
                  <p class="phonetic-row">
                    <WordAudioButton
                      :word="row.word"
                      variant="us"
                    />
                    <span>[{{ row.phonetic0 }}]</span>
                  </p>
                  <p
                    v-if="row.phonetic1 && row.phonetic1 !== row.phonetic0"
                    class="phonetic-row"
                  >
                    <WordAudioButton
                      :word="row.word"
                      variant="uk"
                    />
                    <span>[{{ row.phonetic1 }}]</span>
                  </p>
                </div>
                <el-icon
                  :size="16"
                  style="cursor: pointer; flex-shrink: 0"
                  @click="row.phoneticHidden = !row.phoneticHidden"
                >
                  <Hide v-if="!row.phoneticHidden" />
                  <View v-else />
                </el-icon>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="释义"
            width="300"
          >
            <template #header>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                "
              >
                <span>释义</span>
                <el-icon
                  :size="16"
                  style="cursor: pointer"
                  @click="toggleColumnHide('trans')"
                >
                  <Hide v-if="!transColumnHidden" />
                  <View v-else />
                </el-icon>
              </div>
            </template>
            <template #default="{ row }">
              <div style="display: flex; align-items: center; gap: 8px">
                <div style="flex: 1" :style="{ filter: row.transHidden ? 'blur(5px)' : 'none', userSelect: row.transHidden ? 'none' : 'auto' }">
                  <br />
                  <ExpandableText
                    v-for="item in row.trans"
                    :key="item.pos"
                    :lines="2"
                  >
                    <PosTag :pos="item.pos">{{ item.pos }}</PosTag> {{ item.cn }}
                  </ExpandableText>
                  <br />
                </div>
                <el-icon
                  :size="16"
                  style="cursor: pointer; flex-shrink: 0"
                  @click="row.transHidden = !row.transHidden"
                >
                  <Hide v-if="!row.transHidden" />
                  <View v-else />
                </el-icon>
              </div>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          label="默写"
          :min-width="writeColumnMinWidth"
        >
          <template #header>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
              "
            >
              <span>默写</span>
              <el-button
                type="danger"
                size="small"
                @click="clearAllInputs"
                style="font-size: 12px; padding: 4px 8px"
              >
                重置输入框
              </el-button>
            </div>
          </template>
          <template #default="{ row, $index }">
            <div v-if="isMobile">
              <div class="mobile-inline-info">
                <div class="mobile-word">
                  单词：
                  <span :style="{ filter: row.wordHidden ? 'blur(5px)' : 'none', userSelect: row.wordHidden ? 'none' : 'auto' }">{{ row.word }}</span>
                  <el-icon
                    :size="16"
                    style="cursor: pointer; margin-left: 8px"
                    @click="row.wordHidden = !row.wordHidden"
                  >
                    <Hide v-if="!row.wordHidden" />
                    <View v-else />
                  </el-icon>
                </div>
                <div class="mobile-phonetic">
                  音标：
                  <div
                    class="flex"
                    :style="{ filter: row.phoneticHidden ? 'blur(5px)' : 'none', userSelect: row.phoneticHidden ? 'none' : 'auto' }"
                  >
                    <p class="phonetic-row">
                      <WordAudioButton
                        :word="row.word"
                        variant="us"
                      />
                      <span>[{{ row.phonetic0 }}]</span>
                    </p>
                    <p
                      v-if="row.phonetic1 && row.phonetic1 !== row.phonetic0"
                      class="phonetic-row"
                    >
                      <WordAudioButton
                        :word="row.word"
                        variant="uk"
                      />
                      <span>[{{ row.phonetic1 }}]</span>
                    </p>
                  </div>
                  <el-icon
                    :size="16"
                    style="cursor: pointer; margin-left: 8px"
                    @click="row.phoneticHidden = !row.phoneticHidden"
                  >
                    <Hide v-if="!row.phoneticHidden" />
                    <View v-else />
                  </el-icon>
                </div>
              </div>
              <br />
              <div style="display: flex; align-items: center; gap: 8px">
                <div style="flex: 1" :style="{ filter: row.transHidden ? 'blur(5px)' : 'none', userSelect: row.transHidden ? 'none' : 'auto' }">
                  <ExpandableText
                    v-for="item in row.trans"
                    :key="item.pos"
                    :lines="2"
                  >
                    <PosTag :pos="item.pos">{{ item.pos }}</PosTag> {{ item.cn }}
                  </ExpandableText>
                </div>
                <el-icon
                  :size="16"
                  style="cursor: pointer; flex-shrink: 0"
                  @click="row.transHidden = !row.transHidden"
                >
                  <Hide v-if="!row.transHidden" />
                  <View v-else />
                </el-icon>
              </div>
              <br />
            </div>
            <p class="input-tip-container">
              <WordAudioButton
                :word="row.word"
                variant="us"
              />
              <el-icon
                v-if="isInputCorrect(row)"
                :size="20"
                style="color: var(--el-color-success); margin-left: 8px"
              >
                <Check />
              </el-icon>
              <el-icon
                v-if="row.checked && !row.isCorrect"
                :size="20"
                style="color: var(--el-color-danger); margin-left: 8px"
              >
                <Close />
              </el-icon>

              <el-button
                type="primary"
                size="small"
                :disabled="isWordInSimpleList(row)"
                @click="handleAddSimpleWord(row, dictId)"
              >
                {{
                  isWordInSimpleList(row) ? "已加入熟悉词" : "加入熟悉词"
                }}
              </el-button>
              <el-button
                type="warning"
                size="small"
                :disabled="isWordInRareList(row)"
                @click="handleAddRareWord(row, dictId)"
              >
                {{
                  isWordInRareList(row) ? "已加入生僻词" : "加入生僻词"
                }}
              </el-button>
              <span v-if="focusedIndex === $index && !isMobile">
                按{{ row.checked && !row.isCorrect ? " Enter 或" : "" }} Tab
                键切换到下一个输入框
              </span>
            </p>
            <el-input
              :ref="el => setInputRef(el, $index)"
              v-model="row.modelValue"
              placeholder=""
              clearable
              autocomplete="off"
              @input="handleInputChange($event, row)"
              @keydown="handleInputKeydown($event, row)"
              @focus="handleInputFocus($index, $event)"
              @blur="handleInputBlur($index, row)"
              inputmode="text"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        :pager-count="4"
        :total="tableData.length"
        layout="prev, pager, next,total, sizes, jumper"
        style="
          margin-top: 16px;
          justify-content: flex-end;
          padding: 16px 16px 30px;
        "
      />
      <SimpleWordsDrawer
        v-model="simpleWordsDrawerVisible"
        :simple-words="displayedSimpleWords"
        :loading="simpleWordsLoading"
        :error="simpleWordsError"
        @remove="handleRemoveSimpleWord"
        @clear-all="handleClearAllSimpleWords"
      />
      <RareWordsDrawer
        v-model="rareWordsDrawerVisible"
        :rare-words="displayedRareWords"
        :loading="rareWordsLoading"
        :error="rareWordsError"
        @remove="handleRemoveRareWord"
        @clear-all="handleClearAllRareWords"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  toRef,
} from "vue"
import { Hide, View, Check, Close } from "@element-plus/icons-vue"
import ExpandableText from "./ExpandableText.vue"
import PosTag from "./PosTag.vue"
import SimpleWordsDrawer from "./SimpleWordsDrawer.vue"
import RareWordsDrawer from "./RareWordsDrawer.vue"
import WordAudioButton from "./WordAudioButton.vue"
import { isMobile } from "@/utils"
import { useSimpleWords } from "./hooks/useSimpleWords"
import type { SimpleWordItem } from "./hooks/useSimpleWords"
import { useRareWords } from "./hooks/useRareWords"
import type { RareWordItem } from "./hooks/useRareWords"
import { globalData } from "./hooks/useGlobaData"

import beep from "@/assets/sound/beep.wav"
import correct from "@/assets/sound/correct.wav"

const keySoundModules = import.meta.glob("@/assets/sound/key-sounds/*", {
  eager: true,
  import: "default",
})

const keySoundMap = Object.entries(keySoundModules).reduce<
  Record<string, string>
>((acc, [path, moduleValue]) => {
  const matched = path.split("/").pop()
  if (matched && typeof moduleValue === "string") {
    acc[matched] = moduleValue
  }
  return acc
}, {})
const props = defineProps<{
  data: any
  dictId: string
}>()

// 为每个数据项初始化 modelValue 字段，确保响应式
const tableData = ref<any[]>([])
const originalData = ref<any[]>([])

const dictIdRef = toRef(props, "dictId")

const {
  simpleWordsDrawerVisible,
  simpleWords,
  simpleWordsLoading,
  simpleWordsError,
  simpleWordsLoaded,
  addSimpleWordLoading,
  stateReadyForSimpleWords,
  initializeSimpleWords,
  openSimpleWordsDrawer,
  handleAddSimpleWord,
  isWordInSimpleList: isWordInSimpleListByWord,
  removeSimpleWord,
  clearAllSimpleWords,
} = useSimpleWords(dictIdRef)

// 生僻词相关
const {
  rareWordsDrawerVisible,
  rareWords,
  rareWordsLoading,
  rareWordsError,
  rareWordsLoaded,
  addRareWordLoading,
  stateReadyForRareWords,
  initializeRareWords,
  openRareWordsDrawer,
  handleAddRareWord,
  isWordInRareList: isWordInRareListByWord,
  removeRareWord,
  clearAllRareWords,
} = useRareWords(dictIdRef)

// 控制是否只显示当前词典的已熟悉单词
const showCurrentDictOnly = ref(false)
// 控制是否只显示当前词典的生僻词
const showCurrentDictRareOnly = ref(false)

// 计算当前词典的已熟悉单词数量
const currentDictSimpleWordsCount = computed(() => {
  if (!props.dictId) return simpleWords.value.length
  return simpleWords.value.filter(
    item => item.sourceDictId === props.dictId
  ).length
})

// 根据状态筛选显示的已熟悉单词
const displayedSimpleWords = computed(() => {
  if (!showCurrentDictOnly.value || !props.dictId) {
    return simpleWords.value
  }
  return simpleWords.value.filter(
    item => item.sourceDictId === props.dictId
  )
})

// 打开当前词典已熟悉单词抽屉
function openCurrentDictSimpleWordsDrawer() {
  showCurrentDictOnly.value = true
  openSimpleWordsDrawer()
}

// 监听抽屉关闭，重置筛选状态
watch(simpleWordsDrawerVisible, (newVal) => {
  if (!newVal) {
    showCurrentDictOnly.value = false
  }
})

// 计算当前词典的生僻词数量
const currentDictRareWordsCount = computed(() => {
  if (!props.dictId) return rareWords.value.length
  return rareWords.value.filter(
    item => item.sourceDictId === props.dictId
  ).length
})

// 根据状态筛选显示的生僻词
const displayedRareWords = computed(() => {
  if (!showCurrentDictRareOnly.value || !props.dictId) {
    return rareWords.value
  }
  return rareWords.value.filter(
    item => item.sourceDictId === props.dictId
  )
})

// 打开当前词典生僻词抽屉
function openCurrentDictRareWordsDrawer() {
  showCurrentDictRareOnly.value = true
  openRareWordsDrawer()
}

// 监听生僻词抽屉关闭，重置筛选状态
watch(rareWordsDrawerVisible, (newVal) => {
  if (!newVal) {
    showCurrentDictRareOnly.value = false
  }
})

function isWordInSimpleList(row: any) {
  return isWordInSimpleListByWord(row?.word)
}

function isWordInRareList(row: any) {
  return isWordInRareListByWord(row?.word)
}

async function handleRemoveSimpleWord(item: SimpleWordItem) {
  if (!item?.key) return
  await removeSimpleWord(item.key)
}

async function handleClearAllSimpleWords() {
  await clearAllSimpleWords()
}

async function handleRemoveRareWord(item: RareWordItem) {
  if (!item?.key) return
  await removeRareWord(item.key)
}

async function handleClearAllRareWords() {
  await clearAllRareWords()
}

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 统计排序状态
const sortOrder = ref<"ascending" | "descending" | null>(null)

// 输入框引用（使用 Map 存储，key 为行索引）
const inputRefs = new Map<number, any>()

// 当前聚焦的输入框索引（用于显示提示文字）
const focusedIndex = ref<number | null>(null)

const audioContextRef = ref<AudioContext | null>(null)
const audioBufferRef = ref<AudioBuffer | null>(null)
let currentSoundToken: symbol | null = null
const feedbackBufferCache = new Map<string, AudioBuffer | null>()
const feedbackBufferLoading = new Map<string, Promise<AudioBuffer | null>>()

function resolveKeySoundSrc(soundId?: unknown) {
  if (!soundId || typeof soundId !== "string") {
    return null
  }
  const matched = keySoundMap[soundId]
  if (matched) {
    return matched
  }
  console.warn(`未找到按键音效文件: ${soundId}`)
  return null
}

function ensureAudioContext() {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") {
    return null
  }
  if (!audioContextRef.value) {
    audioContextRef.value = new AudioContext()
  }
  return audioContextRef.value
}

async function updateKeySoundAudio(soundId?: unknown) {
  const src = resolveKeySoundSrc(soundId)
  if (!src) {
    audioBufferRef.value = null
    currentSoundToken = null
    return
  }
  const context = ensureAudioContext()
  if (!context) {
    return
  }

  const token = Symbol(src)
  currentSoundToken = token

  try {
    const response = await fetch(src)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await context.decodeAudioData(arrayBuffer)
    if (currentSoundToken === token) {
      audioBufferRef.value = audioBuffer
    }
  } catch (error) {
    if (currentSoundToken === token) {
      audioBufferRef.value = null
    }
    console.error("加载按键音效失败:", error)
  }
}

function playKeySound(event: KeyboardEvent | Event) {
  if (!(event instanceof KeyboardEvent)) {
    return
  }

  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return
  }

  const context = ensureAudioContext()
  const buffer = audioBufferRef.value
  if (!context || !buffer) {
    return
  }

  if (context.state === "suspended") {
    context.resume().catch(() => {
      // ignore resume errors
    })
  }

  const source = context.createBufferSource()
  source.buffer = buffer
  source.connect(context.destination)
  try {
    source.start(0)
  } catch (error) {
    console.warn("播放按键音效失败:", error)
  }
}

async function getFeedbackBuffer(
  context: AudioContext,
  src: string
): Promise<AudioBuffer | null> {
  const cached = feedbackBufferCache.get(src)
  if (cached !== undefined) {
    return cached
  }

  const loading = feedbackBufferLoading.get(src)
  if (loading) {
    return loading
  }

  const loader = (async () => {
    try {
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = await context.decodeAudioData(arrayBuffer)
      feedbackBufferCache.set(src, buffer)
      return buffer
    } catch (error) {
      console.error("加载反馈音效失败:", error)
      feedbackBufferCache.set(src, null)
      return null
    } finally {
      feedbackBufferLoading.delete(src)
    }
  })()

  feedbackBufferLoading.set(src, loader)
  return loader
}

async function playFeedbackSound(type: "correct" | "incorrect") {
  const context = ensureAudioContext()
  if (!context) {
    return
  }

  if (context.state === "suspended") {
    try {
      await context.resume()
    } catch {
      return
    }
  }

  const src = type === "correct" ? correct : beep
  const buffer = await getFeedbackBuffer(context, src)
  if (!buffer) {
    return
  }

  const source = context.createBufferSource()
  source.buffer = buffer
  source.connect(context.destination)
  try {
    source.start(0)
  } catch (error) {
    console.warn("播放反馈音效失败:", error)
  }
}

// 播放单词发音（使用与WordAudioButton相同的逻辑）
function playWordAudio(word: string, variant: "us" | "uk" = "us") {
  if (!word || typeof window === "undefined") {
    return
  }

  const PRONUNCIATION_API = "https://dict.youdao.com/dictvoice?audio="
  const encoded = encodeURIComponent(word)
  const audioType = variant === "uk" ? 1 : 2
  const url = `${PRONUNCIATION_API}${encoded}&type=${audioType}`

  const audio = new Audio()
  audio.pause()
  audio.src = url
  audio.playbackRate = 1

  audio.play().catch(error => {
    console.error("播放失败:", error)
  })
}

watch(
  () => globalData.value?.sound,
  soundId => {
    updateKeySoundAudio(soundId)
  },
  { immediate: true }
)

// 设置输入框引用
function setInputRef(el: any, index: number) {
  if (el) {
    inputRefs.set(index, el)
  } else {
    inputRefs.delete(index)
  }
}

function updateVisibleData(options: { resetPage?: boolean } = {}) {
  // 如果不需要重置页面，保持当前排序
  if (!options.resetPage && tableData.value.length > 0) {
    // 创建一个 Map 来记录当前 tableData 中每个单词的位置
    const orderMap = new Map<string, number>()
    tableData.value.forEach((row, index) => {
      orderMap.set(row.word, index)
    })
    
    // 从 originalData 过滤数据
    const filtered = originalData.value.filter(row => {
      // 过滤掉已熟悉的单词
      if (isWordInSimpleList(row)) return false
      
      // 根据练习模式过滤
      const isRare = isWordInRareList(row)
      const mode = globalData.value?.practiceMode || 'all'
      
      if (mode === 'rareOnly') {
        // 仅生僻词模式：只显示标记为生僻词的单词
        return isRare
      } else if (mode === 'excludeRare') {
        // 排除生僻词模式：隐藏标记为生僻词的单词
        return !isRare
      }
      // 'all' 模式：显示全部单词（包括生僻词）
      return true
    })
    
    // 根据之前的顺序重新排列数据
    const sorted = filtered.sort((a, b) => {
      const orderA = orderMap.has(a.word) ? orderMap.get(a.word)! : Infinity
      const orderB = orderMap.has(b.word) ? orderMap.get(b.word)! : Infinity
      return orderA - orderB
    })
    
    tableData.value = sorted
  } else {
    // 重置页面时，直接从 originalData 过滤
    const filtered = originalData.value.filter(row => {
      // 过滤掉已熟悉的单词
      if (isWordInSimpleList(row)) return false
      
      // 根据练习模式过滤
      const isRare = isWordInRareList(row)
      const mode = globalData.value?.practiceMode || 'all'
      
      if (mode === 'rareOnly') {
        // 仅生僻词模式：只显示标记为生僻词的单词
        return isRare
      } else if (mode === 'excludeRare') {
        // 排除生僻词模式：隐藏标记为生僻词的单词
        return !isRare
      }
      // 'all' 模式：显示全部单词（包括生僻词）
      return true
    })
    tableData.value = filtered
  }

  inputRefs.clear()
  focusedIndex.value = null

  const totalPages = tableData.value.length
    ? Math.ceil(tableData.value.length / pageSize.value)
    : 1
  if (options.resetPage) {
    currentPage.value = 1
    sortOrder.value = null
  } else if (currentPage.value > totalPages) {
    currentPage.value = totalPages || 1
  }
}

// 计算当前页显示的数据（排序后分页）
const pagedData = computed(() => {
  let sortedData = [...tableData.value]

  // 如果有排序，先排序
  if (sortOrder.value) {
    sortedData.sort((a, b) => {
      const wordA = (a.word || "").toLowerCase()
      const wordB = (b.word || "").toLowerCase()
      if (wordA < wordB) return sortOrder.value === "ascending" ? -1 : 1
      if (wordA > wordB) return sortOrder.value === "ascending" ? 1 : -1
      return 0
    })
  }

  // 然后分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedData.slice(start, end)
})

// 窗口宽度（用于响应式计算列宽）
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1920
)

// 计算默写列的最小宽度
const writeColumnMinWidth = computed(() => {
  if (isMobile.value) {
    return Math.floor(windowWidth.value * 0.85)
  }
  return 400
})

// 监听窗口大小变化
function handleResize() {
  if (typeof window !== "undefined") {
    windowWidth.value = window.innerWidth
  }
}

// 处理快捷键：Ctrl + ←/→ 切换页面，Ctrl + B 播放当前单词
function handleGlobalKeydown(event: KeyboardEvent) {
  // 处理方向键切换输入框（不需要Ctrl键）
  if (event.key === "ArrowUp") {
    event.preventDefault()
    if (focusedIndex.value !== null && focusedIndex.value > 0) {
      focusInputByIndex(focusedIndex.value - 1)
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    if (focusedIndex.value !== null && focusedIndex.value < pagedData.value.length - 1) {
      focusInputByIndex(focusedIndex.value + 1)
    }
  }

  // 需要Ctrl键的快捷键
  if (!event.ctrlKey) return

  if (event.key === "ArrowLeft") {
    event.preventDefault()
    if (currentPage.value > 1) {
      currentPage.value--
    }
    focusInputByIndex(0)
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    const totalPages = Math.ceil(tableData.value.length / pageSize.value)
    if (currentPage.value < totalPages) {
      currentPage.value++
    }
    focusInputByIndex(0)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    // Ctrl + ↑ 切换到第一个输入框
    focusInputByIndex(0)
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    // Ctrl + ↓ 切换到最后一个输入框
    focusInputByIndex(pagedData.value.length - 1)
  } else if (event.key === "b" || event.key === "B") {
    event.preventDefault()
    // 播放当前聚焦单词的发音
    if (focusedIndex.value !== null) {
      const currentRow = pagedData.value[focusedIndex.value]
      if (currentRow?.word) {
        playWordAudio(currentRow.word, "us")
      }
    }
  } else if (event.key === "j" || event.key === "J") {
    event.preventDefault()
    
    // Ctrl+Shift+J: 将当前页默写正确的单词全部加入熟悉单词
    if (event.shiftKey) {
      const correctWords = pagedData.value.filter(row =>
        row.modelValue && row.modelValue.trim().toLowerCase() === row.word.toLowerCase()
      )
      correctWords.forEach(row => {
        if (!isWordInSimpleList(row)) {
          handleAddSimpleWord(row, props.dictId)
        }
      })
    } 
    // Ctrl+J: 只加入当前聚焦的单词
    else {
      if (focusedIndex.value !== null) {
        const currentRow = pagedData.value[focusedIndex.value]
        if (currentRow && !isWordInSimpleList(currentRow)) {
          handleAddSimpleWord(currentRow, props.dictId)
        }
      }
    }

    // 操作完成后聚焦到离上次最近的输入框
    nextTick(() => {
      if (pagedData.value.length > 0) {
        const nearestIndex = focusedIndex.value !== null && focusedIndex.value < pagedData.value.length
          ? focusedIndex.value
          : 0
        focusInputByIndex(nearestIndex)
      }
    })
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize)
    window.addEventListener("keydown", handleGlobalKeydown)
    windowWidth.value = window.innerWidth
  }
})

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize)
    window.removeEventListener("keydown", handleGlobalKeydown)
  }
})

// 列级别显示隐藏状态（默认隐藏）
const wordColumnHidden = ref(true)
const phoneticColumnHidden = ref(true)
const transColumnHidden = ref(false) // 释义默认显示

// 切换列显示隐藏
function toggleColumnHide(key: "word" | "phonetic" | "trans") {
  if (key === "word") {
    wordColumnHidden.value = !wordColumnHidden.value
    originalData.value.forEach(row => {
      row.wordHidden = wordColumnHidden.value
    })
  } else if (key === "phonetic") {
    phoneticColumnHidden.value = !phoneticColumnHidden.value
    originalData.value.forEach(row => {
      row.phoneticHidden = phoneticColumnHidden.value
    })
  } else if (key === "trans") {
    transColumnHidden.value = !transColumnHidden.value
    originalData.value.forEach(row => {
      row.transHidden = transColumnHidden.value
    })
  }
}

// 初始化数据
watch(
  () => props.data,
  newData => {
    const existingRowMap = new Map<string, any[]>()
    originalData.value.forEach((row, index) => {
      const word = typeof row?.word === "string" ? row.word.toLowerCase() : ""
      const key = word || `__index_${index}`
      const list = existingRowMap.get(key)
      if (list) {
        list.push(row)
      } else {
        existingRowMap.set(key, [row])
      }
    })

    const nextOriginal = newData.map((item: any, index: number) => {
      const word = typeof item?.word === "string" ? item.word : ""
      const key = word ? word.toLowerCase() : `__index_${index}`
      const existingList = existingRowMap.get(key)
      const existing = existingList?.length ? existingList.shift() : undefined
      if (existing) {
        const { modelValue, wordHidden, phoneticHidden, transHidden, checked, isCorrect } =
          existing
        Object.assign(existing, item)
        existing.modelValue = modelValue ?? existing.modelValue ?? ""
        existing.wordHidden =
          typeof wordHidden === "boolean" ? wordHidden : wordColumnHidden.value
        existing.phoneticHidden =
          typeof phoneticHidden === "boolean"
            ? phoneticHidden
            : phoneticColumnHidden.value
        existing.transHidden =
          typeof transHidden === "boolean"
            ? transHidden
            : transColumnHidden.value
        existing.checked = typeof checked === "boolean" ? checked : false
        existing.isCorrect = typeof isCorrect === "boolean" ? isCorrect : false
        return existing
      }
      return {
        ...item,
        modelValue: item.modelValue || "",
        wordHidden: wordColumnHidden.value,
        phoneticHidden: phoneticColumnHidden.value,
        transHidden: transColumnHidden.value,
        checked: false, // 是否已校验
        isCorrect: false, // 是否正确
      }
    })

    originalData.value = nextOriginal
    updateVisibleData({ resetPage: true })
  },
  { immediate: true }
)

watch(
  () => simpleWords.value,
  () => {
    updateVisibleData()
  },
  { deep: true }
)

// 监听生僻词变化，更新数据
watch(
  () => rareWords.value,
  () => {
    updateVisibleData()
  },
  { deep: true }
)

// 监听练习模式变化，更新数据
watch(
  () => globalData.value?.practiceMode,
  () => {
    updateVisibleData()
  }
)

// 监听分页变化，清空输入框引用和聚焦状态
watch(currentPage, () => {
  inputRefs.clear()
  focusedIndex.value = null
})

// 处理回车键，移动到下一个输入框（不翻页）
function handleEnterKey(index: number, event: Event) {
  event.preventDefault()
  event.stopPropagation()

  const nextIndex = index + 1

  // 只在当前页内移动，不翻页
  if (nextIndex < pagedData.value.length) {
    nextTick(() => {
      // 方法1：尝试使用 ref
      focusInputByIndex(nextIndex)

      // 方法2：如果 ref 失败，使用 DOM 查询作为备选
      setTimeout(() => {
        const allInputs = document.querySelectorAll(
          ".table-container .el-input__inner"
        )
        if (allInputs.length > nextIndex) {
          const nextInput = allInputs[nextIndex] as HTMLInputElement
          if (nextInput && document.activeElement !== nextInput) {
            nextInput.focus()
            nextInput.select()
          }
        }
      }, 10)
    })
  }
}

// 根据索引聚焦输入框
function focusInputByIndex(index: number) {
  const input = inputRefs.get(index)
  if (!input) return

  // Element Plus Input 组件可能有 focus 方法
  if (typeof input.focus === "function") {
    input.focus()
    return
  }

  // 尝试从组件实例获取 input 元素
  let inputElement: HTMLInputElement | null = null

  // Vue 3 组件实例
  if (input.$el) {
    inputElement = input.$el.querySelector("input")
  }
  // 直接是 DOM 元素
  else if (input instanceof HTMLElement) {
    inputElement = input.querySelector("input") || (input as HTMLInputElement)
  }
  // Element Plus 可能使用 ref 属性
  else if (input.ref) {
    inputElement = input.ref
  }

  if (inputElement && inputElement instanceof HTMLInputElement) {
    inputElement.focus()
    inputElement.select()
  }
}

// 实时判断输入是否正确
function isInputCorrect(row: any): boolean {
  if (!row.modelValue || row.modelValue.trim() === "") {
    return false
  }
  return row.modelValue.trim().toLowerCase() === row.word.toLowerCase()
}

// 处理输入框获得焦点，自动滚动到可视区域
function handleInputFocus(index: number, event: FocusEvent) {
  const target = event.target as HTMLElement
  event.preventDefault()
  if (target && isMobile.value) {
    nextTick(() => {
      target.scrollIntoView({ block: "end" })
    })
  }

  // 设置当前聚焦的索引（用于显示提示文字）
  focusedIndex.value = index

  // 获得焦点时，清除错误图标的状态（不显示错误图标，但 Check 图标会实时显示）
  const row = pagedData.value[index]
  if (row) {
    row.checked = false

    // 如果启用了自动发音，播放单词音频
    if (globalData.value?.autoPlayAudio) {
      playWordAudio(row.word, "us")
    }
  }
}

// 处理输入框失去焦点，校验答案（用于显示错误图标）
function handleInputBlur(index: number, row: any) {
  // 清除聚焦状态（隐藏提示文字）
  focusedIndex.value = null

  if (!row.modelValue || row.modelValue.trim() === "") {
    row.checked = false
    row.isCorrect = false
    return
  }

  // 失去焦点后校验（用于显示错误图标）
  row.checked = true
  row.isCorrect = row.modelValue.trim().toLowerCase() === row.word.toLowerCase()
}

function handleInputKeydown(event: KeyboardEvent | Event, row: any) {
  const keyboardEvent = event as KeyboardEvent
  if ("isComposing" in keyboardEvent && keyboardEvent.isComposing) {
    return
  }

  // Ctrl + Tab: 回到上一个输入框
  if (keyboardEvent.shiftKey && keyboardEvent.key === "Tab") {
    event.preventDefault()
    const currentIndex = pagedData.value.indexOf(row)
    const prevIndex = currentIndex - 1

    if (prevIndex >= 0) {
      nextTick(() => {
        focusInputByIndex(prevIndex)
        setTimeout(() => {
          const allInputs = document.querySelectorAll(
            ".table-container .el-input__inner"
          )
          if (allInputs.length > prevIndex) {
            const prevInput = allInputs[prevIndex] as HTMLInputElement
            if (prevInput && document.activeElement !== prevInput) {
              prevInput.focus()
              prevInput.select()
            }
          }
        }, 10)
      })
    }
    return
  }

  // Enter 或 Tab: 检查是否正确，不正确则播放错误声音并显示错误图标
  if (keyboardEvent.key === "Enter" || keyboardEvent.key === "Tab") {
    const currentValue = row.modelValue || ""
    if (currentValue.trim()) {
      const isCorrect =
        currentValue.trim().toLowerCase() === row.word.toLowerCase()
      if (!isCorrect) {
        void playFeedbackSound("incorrect")
        // 显示错误图标
        row.checked = true
        row.isCorrect = false
        if (keyboardEvent.key === "Enter") return
      }
    } else {
      // 输入为空时清除错误状态
      row.checked = false
      row.isCorrect = false
    }
    // 只有输入正确时才跳转到下一个输入框
    handleEnterKey(pagedData.value.indexOf(row), event)
    return
  }

  // 退格键或删除键：清除错误状态，表示要修正
  if (keyboardEvent.key === "Backspace" || keyboardEvent.key === "Delete") {
    row.checked = false
    row.isCorrect = false
  }

  playKeySound(event)
}

// 清空所有输入框的值
function clearAllInputs() {
  originalData.value.forEach(row => {
    row.modelValue = ""
    row.checked = false
    row.isCorrect = false
    row.wordHidden = true
    row.phoneticHidden = true
    row.transHidden = false

  })
}

// 处理输入变化，实时检查是否正确
function handleInputChange(value: string, row: any) {
  if (!value || value.trim() === "") {
    return
  }

  const isCorrect = value.trim().toLowerCase() === row.word.toLowerCase()
  if (isCorrect) {
    void playFeedbackSound("correct")
    // 如果启用了自动跳转，自动跳到下一个输入框
    if (globalData.value?.autoJump) {
      nextTick(() => {
        const currentIndex = pagedData.value.indexOf(row)
        handleEnterKey(currentIndex, new Event("auto-jump"))
      })
    }
  }
}

// 打乱数据
function shuffleData() {
  // 使用 Fisher-Yates 洗牌算法
  const shuffled = [...originalData.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  // 清空所有输入框
  shuffled.forEach(row => {
    row.modelValue = ""
    row.checked = false
    row.isCorrect = false
  })
  originalData.value = shuffled
  updateVisibleData({ resetPage: true })
}

// 当前页随机排序
function shuffleCurrentPageData() {
  // 如果没有数据，直接返回
  if (tableData.value.length === 0) return
  
  // 计算当前页在 tableData 中的起始和结束位置
  const start = (currentPage.value - 1) * pageSize.value
  const end = Math.min(start + pageSize.value, tableData.value.length)
  
  // 保存当前页原始数据的副本
  const currentPageData = tableData.value.slice(start, end)
  
  // 使用 Fisher-Yates 洗牌算法打乱当前页数据
  for (let i = currentPageData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[currentPageData[i], currentPageData[j]] = [currentPageData[j], currentPageData[i]]
  }
  
  // 将打乱后的数据放回 tableData（不清空输入框）
  for (let i = 0; i < currentPageData.length; i++) {
    tableData.value[start + i] = currentPageData[i]
  }
  
  // 同时更新 originalData，保持数据一致性
  // 创建一个映射来快速查找 originalData 中的索引
  const wordToOriginalIndex = new Map<string, number>()
  for (let i = 0; i < originalData.value.length; i++) {
    const word = originalData.value[i].word
    if (!wordToOriginalIndex.has(word)) {
      wordToOriginalIndex.set(word, i)
    }
  }
  
  // 更新 originalData 中对应的数据
  currentPageData.forEach((item, idx) => {
    const originalIdx = wordToOriginalIndex.get(item.word)
    if (originalIdx !== undefined) {
      originalData.value[originalIdx] = item
    }
  })
  
  // 强制更新视图
  tableData.value = [...tableData.value]
}

// 单词排序方法（用于 Element Plus 的 sort-method）
function sortWord(a: any, b: any): number {
  const wordA = (a.word || "").toLowerCase()
  const wordB = (b.word || "").toLowerCase()
  if (wordA < wordB) return -1
  if (wordA > wordB) return 1
  return 0
}

// 处理排序变化
function handleSortChange({
  prop,
  order,
}: {
  prop: string
  order: string | null
}) {
  if (prop === "word") {
    sortOrder.value = order as "ascending" | "descending" | null
    // 排序后重置到第一页，但不影响输入框等数据
    // 输入框数据存储在 row.modelValue 中，排序时对象引用会一起移动，数据不会丢失
    currentPage.value = 1
  }
}

function rowClass({ row }: any) {
  if (row.modelValue.trim().toLowerCase() === row.word.trim().toLowerCase()) return "bg-success"
  return ""
}
</script>
<style lang="scss" scoped>
:deep() .el-drawer__header {
  margin-bottom: 0;
}
:deep() .el-button+.el-button {
  margin-left: 0;
  margin-right: 12px;
}

:deep() {
  .el-pagination {
    flex-wrap: wrap;
  }
}

.simple-word-init {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.simple-word-init--loading {
  color: var(--el-color-primary);
}

.simple-word-init--error {
  flex-direction: column;
  color: var(--el-color-danger);
}

.table-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.table-header {
  position: sticky;
  top: var(--word-dict-practice-table-header-offset, 15px);
  z-index: 5;
  background: var(--el-bg-color);
  margin-bottom: 16px;
  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px 0;
  }
  p {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}
.input-tip-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
}

.mobile-inline-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.mobile-word {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
:deep() .input-tip-container .el-icon {
  margin-left: 0 !important;
}

.mobile-phonetic {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.phonetic-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.flex {
  display: flex;
}
:deep() {
  .bg-success {
    background-color: var(--el-color-success-light-9);
  }

  // 去掉 el-table 的 hover 颜色
  .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  // 确保排序图标与自定义 header 内容对齐
  .word-column-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }

  .el-table__header-wrapper {
    .el-table__header {
      th {
        &.is-leaf {
          .cell {
            display: flex;
            align-items: center;
            justify-content: center;

            .caret-wrapper {
              order: 3; // 排序图标放在最后
              margin-left: auto;
            }

            .word-column-header {
              order: 1;
            }
          }
        }
      }
    }
  }
}
</style>
