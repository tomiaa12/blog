<template>
  <div class="expandable-text" :class="{ 'has-expand-btn': canExpand && !isExpanded }">
    <div 
      ref="textRef"
      class="text-content"
      :class="{ 'is-expanded': isExpanded, 'is-clamped': !isExpanded && canExpand }"
      :style="{ '-webkit-line-clamp': isExpanded ? 'none' : maxLines }"
    >
      <span class="text-inner">
        <slot>{{ text }}</slot>
      </span>
      <span 
        v-if="canExpand && !isExpanded" 
        class="expand-btn-inline"
        @click.stop="toggleExpand"
      >
        {{ '展开' }}
      </span>
    </div>
    <span 
      v-if="canExpand && isExpanded" 
      class="expand-btn"
      @click="toggleExpand"
    >
      {{ '收起' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const props = withDefaults(defineProps<{
  text?: string
  maxLines?: number
}>(), {
  maxLines: 2
})

const textRef = ref<HTMLElement | null>(null)
const isExpanded = ref(false)
const canExpand = ref(false)
const maxLines = props.maxLines
let observer: MutationObserver | null = null

function checkCanExpand() {
  nextTick(() => {
    if (!textRef.value) return
    
    // 临时移除限制，获取实际高度
    const originalClasses = textRef.value.className
    const originalDisplay = textRef.value.style.display
    const originalWebkitLineClamp = textRef.value.style.getPropertyValue('-webkit-line-clamp')
    
    textRef.value.classList.remove('is-clamped')
    textRef.value.style.display = 'block'
    textRef.value.style.setProperty('-webkit-line-clamp', 'none')
    textRef.value.style.setProperty('line-clamp', 'none')
    
    const actualHeight = textRef.value.scrollHeight
    
    // 恢复限制状态
    textRef.value.className = originalClasses
    textRef.value.style.display = originalDisplay
    if (originalWebkitLineClamp) {
      textRef.value.style.setProperty('-webkit-line-clamp', originalWebkitLineClamp)
    }
    
    // 计算限制高度
    const lineHeight = parseFloat(window.getComputedStyle(textRef.value).lineHeight) || 20
    const maxHeight = lineHeight * maxLines
    
    const newCanExpand = actualHeight > maxHeight + 2 // 加2px容差
    canExpand.value = newCanExpand
    
    // 根据状态设置样式
    if (isExpanded.value) {
      textRef.value.classList.add('is-expanded')
      textRef.value.classList.remove('is-clamped')
      textRef.value.style.setProperty('-webkit-line-clamp', 'none')
      textRef.value.style.setProperty('line-clamp', 'none')
    } else if (newCanExpand) {
      textRef.value.classList.add('is-clamped')
      textRef.value.classList.remove('is-expanded')
      textRef.value.style.setProperty('-webkit-line-clamp', String(maxLines))
      textRef.value.style.setProperty('line-clamp', String(maxLines))
    } else {
      textRef.value.classList.remove('is-clamped', 'is-expanded')
      textRef.value.style.removeProperty('-webkit-line-clamp')
      textRef.value.style.removeProperty('line-clamp')
    }
  })
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  checkCanExpand()
}

onMounted(() => {
  checkCanExpand()
  
  // 监听内容变化
  if (textRef.value) {
    observer = new MutationObserver(() => {
      checkCanExpand()
    })
    observer.observe(textRef.value, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

// 监听 props 变化
watch(() => props.text, () => {
  checkCanExpand()
})
</script>

<style lang="scss" scoped>
.expandable-text {
  display: block;
  width: 100%;
  margin-bottom: 4px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.text-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.5;
  text-overflow: ellipsis;
  position: relative;
  
  &.is-clamped {
    -webkit-line-clamp: v-bind(maxLines);
    line-clamp: v-bind(maxLines);
    padding-right: 50px; // 为按钮留出空间
  }
  
  &.is-expanded {
    display: block;
    -webkit-line-clamp: none;
    line-clamp: none;
    padding-right: 0;
  }
}

.text-inner {
  display: inline;
}

.expand-btn,
.expand-btn-inline {
  color: var(--el-color-primary);
  cursor: pointer;
  font-size: 12px;
  user-select: none;
  white-space: nowrap;
  
  &:hover {
    text-decoration: underline;
  }
}

.expand-btn {
  margin-left: 4px;
  display: inline-block;
}

.expand-btn-inline {
  position: absolute;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent 0%, var(--el-bg-color) 15%);
  padding-left: 8px;
  z-index: 1;
  height: 1.5em; // 与行高一致
  line-height: 1.5;
  display: flex;
  align-items: center;
}
</style>


