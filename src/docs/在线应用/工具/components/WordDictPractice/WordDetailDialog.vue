<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '100%' : '800px'"
    :fullscreen="isMobile"
    :before-close="handleClose"
    custom-class="word-detail-dialog"
    append-to-body
    lock-scroll
    top="3vh"
  >
    <div
      v-if="wordData"
      class="word-detail-content"
    >
      <!-- 基本信息 -->
      <div class="word-basic-info">
        <div class="word-header">
          <h2 class="word-title">{{ wordData.word }}</h2>
          <div class="phonetics">
            <div class="phonetic-item">
              <span class="phonetic-label">英:</span>
              <span class="phonetic-text">{{
                wordData.phonetic0 || "暂无"
              }}</span>
              <WordAudioButton
                :word="wordData.word"
                variant="uk"
                :size="16"
                class="audio-btn"
              />
            </div>
            <div class="phonetic-item">
              <span class="phonetic-label">美:</span>
              <span class="phonetic-text">{{
                wordData.phonetic1 || "暂无"
              }}</span>
              <WordAudioButton
                :word="wordData.word"
                variant="us"
                :size="16"
                class="audio-btn"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 翻译 -->
      <div
        v-if="wordData.trans && wordData.trans.length"
        class="section"
      >
        <h3 class="section-title">翻译</h3>
        <div class="trans-list">
          <div
            v-for="item in wordData.trans"
            :key="item.pos"
            class="trans-item"
          >
            <PosTag
              :pos="item.pos"
              class="trans-pos"
              >{{ item.pos }}</PosTag
            >
            <span class="trans-cn">{{ item.cn }}</span>
          </div>
        </div>
      </div>

      <!-- 例句 -->
      <div
        v-if="wordData.sentences && wordData.sentences.length"
        class="section"
      >
        <h3 class="section-title">例句</h3>
        <div class="sentences-list">
          <div
            v-for="(sentence, index) in wordData.sentences"
            :key="index"
            class="sentence-item"
          >
            <div class="sentence-en">
              <span
                v-html="highlightWordInText(sentence.c, wordData.word)"
              ></span>
              <WordAudioButton
                :word="sentence.c"
                :size="14"
                class="sentence-audio-btn"
              />
            </div>
            <div class="sentence-cn">{{ sentence.cn }}</div>
          </div>
        </div>
      </div>

      <!-- 短语 -->
      <div
        v-if="wordData.phrases && wordData.phrases.length"
        class="section"
      >
        <h3 class="section-title">短语</h3>
        <div class="phrases-list">
          <div
            v-for="(phrase, index) in wordData.phrases"
            :key="index"
            class="phrase-item"
          >
            <div class="phrase-en">
              {{ phrase.c }}
              <WordAudioButton
                :word="phrase.c"
                :size="14"
                class="phrase-audio-btn"
              />
            </div>
            <div class="phrase-cn">{{ phrase.cn }}</div>
          </div>
        </div>
      </div>

      <!-- 同义词 -->
      <div
        v-if="wordData.synos && wordData.synos.length"
        class="section"
      >
        <h3 class="section-title">同义词</h3>
        <div class="synos-list">
          <div
            v-for="(syno, index) in wordData.synos"
            :key="index"
            class="syno-item"
          >
            <div class="syno-header">
              <PosTag
                v-if="syno.pos"
                :pos="syno.pos"
                class="syno-pos"
                >{{ syno.pos }}</PosTag
              >
              <span class="syno-cn">{{ syno.cn }}</span>
            </div>
            <div
              v-if="syno.ws && syno.ws.length"
              class="syno-words"
            >
              <div
                v-for="(word, wordIndex) in syno.ws"
                :key="wordIndex"
                class="syno-word"
              >
                <span class="syno-word-text">{{ word }}</span>
                <WordAudioButton
                  :word="word"
                  :size="12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关词 -->
      <div
        v-if="
          wordData.relWords &&
          wordData.relWords.rels &&
          wordData.relWords.rels.length
        "
        class="section"
      >
        <h3 class="section-title">
          相关词
          <span
            v-if="wordData.relWords.root"
            class="root-word"
            >(词根: {{ wordData.relWords.root }})</span
          >
        </h3>
        <div class="rel-words-list">
          <div
            v-for="(relGroup, index) in wordData.relWords.rels"
            :key="index"
            class="rel-group"
          >
            <div
              v-if="relGroup.pos"
              class="rel-pos"
            >
              <PosTag :pos="relGroup.pos">{{ relGroup.pos }}</PosTag>
            </div>
            <div
              v-if="relGroup.words && relGroup.words.length"
              class="rel-words"
            >
              <div
                v-for="(word, wordIndex) in relGroup.words"
                :key="wordIndex"
                class="rel-word-item"
              >
                <span class="rel-word">{{ word.c }}</span>
                <span class="rel-word-cn">{{ word.cn }}</span>
                <WordAudioButton
                  :word="word.c"
                  :size="14"
                  class="rel-word-audio-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 词源 -->
      <div
        v-if="wordData.etymology && wordData.etymology.length"
        class="section"
      >
        <h3 class="section-title">词源</h3>
        <div class="etymology-list">
          <template v-for="(etym, index) in wordData.etymology">
            <div
              class="etymology-item"
              v-if="etym.d"
            >
              <div
                v-if="etym.t"
                class="etymology-title"
              >
                {{ etym.t }}
              </div>
              <div class="etymology-desc">
                {{ etym.d }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { isMobile } from "@/utils"
import PosTag from "./PosTag.vue"
import WordAudioButton from "./WordAudioButton.vue"

interface Props {
  modelValue: boolean
  wordData: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const visible = ref(false)

watch(
  () => props.modelValue,
  newVal => {
    visible.value = newVal
  }
)

watch(visible, newVal => {
  emit("update:modelValue", newVal)
})

const handleClose = () => {
  visible.value = false
}

// 在文本中标红指定单词
const highlightWordInText = (text: string, word: string): string => {
  if (!text || !word) return text

  // 转义正则表达式特殊字符
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  // 创建不区分大小写的正则表达式
  const regex = new RegExp(`\\b${escapedWord}\\b`, "gi")

  return text.replace(regex, `<span class="highlight-word">$&</span>`)
}
</script>

<style scoped>
.word-detail-dialog {
  --el-dialog-padding-primary: 20px;
}

/* 确保弹窗打开时背景不滚动 */
.word-detail-dialog :deep(.el-overlay) {
  overflow: hidden;
}

.word-detail-dialog :deep(.el-dialog__body) {
  overflow-y: auto;
}

.word-detail-content {
  overflow-y: auto;
}

/* 基本信息 */
.word-basic-info {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-bg-color);
  border-radius: 8px;
}

.word-header {
  text-align: center;
}

.word-title {
  font-size: 28px;
  font-weight: bold;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.phonetics {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 12px;
}

.phonetic-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.phonetic-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-color-primary);
}

.phonetic-text {
  font-size: 16px;
  color: var(--el-text-color-regular);
  font-family: "Courier New", monospace;
}

.audio-btn {
  margin-left: 4px;
}

/* 章节样式 */
.section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid var(--vp-c-gray-soft);
  border-radius: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
  border-bottom: 1px solid var(--el-color-primary);
  padding-bottom: 4px;
}

.root-word {
  font-size: 14px;
  font-weight: normal;
  color: var(--el-text-color-regular);
  margin-left: 8px;
}

/* 翻译列表 */
.trans-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trans-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: var(--vp-c-gray-soft);
  border-radius: 4px;
}

.trans-pos {
  flex-shrink: 0;
}

.trans-cn {
  flex: 1;
  line-height: 1.5;
}

/* 例句和短语列表 */
.sentences-list,
.phrases-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sentence-item,
.phrase-item {
  padding: 12px;
  background: var(--vp-c-gray-soft);
  border-radius: 6px;
}

.sentence-en,
.phrase-en {
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
}

:deep() .highlight-word {
  background-color: var(--el-color-warning-light-9);
  color: var(--el-color-danger);
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.sentence-audio-btn,
.phrase-audio-btn,
.rel-word-audio-btn {
  margin-left: 8px;
  flex-shrink: 0;
}

.sentence-cn,
.phrase-cn {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

/* 同义词列表 */
.synos-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.syno-item {
  padding: 12px;
  background: var(--vp-c-gray-soft);
  border-radius: 6px;
}

.syno-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.syno-pos {
  flex-shrink: 0;
}

.syno-cn {
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.syno-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.syno-word {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
  border-radius: 4px;
  font-size: 14px;
}

.syno-word-text {
  flex: 1;
}

/* 相关词列表 */
.rel-words-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rel-group {
  padding: 12px;
  background: var(--vp-c-gray-soft);
  border-radius: 6px;
}

.rel-pos {
  margin-bottom: 8px;
}

.rel-words {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rel-word-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.rel-word {
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.rel-word-cn {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

/* 词源列表 */
.etymology-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.etymology-item {
  padding: 12px;
  background: var(--vp-c-gray-soft);
  border-radius: 6px;
}

.etymology-title {
  font-weight: bold;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.etymology-desc {
  color: var(--el-text-color-regular);
  line-height: 1.6;
  white-space: pre-line;
}

/* 对话框底部 */
.dialog-footer {
  text-align: right;
}
h3 {
  position: sticky;
  top: 0;
  background: var(--el-bg-color);
  z-index: 1;
}
/* 移动端适配 */
@media (max-width: 768px) {
  .word-detail-content {
    max-height: 90vh;
  }

  .word-title {
    font-size: 24px;
  }

  .phonetics {
    flex-direction: column;
    gap: 12px;
  }

  .phonetic-item {
    padding: 4px 8px;
  }

  .section {
    margin-bottom: 16px;
    padding: 12px;
  }

  .trans-item,
  .sentence-item,
  .phrase-item,
  .syno-item,
  .rel-group,
  .etymology-item {
    padding: 8px;
  }
}
</style>
