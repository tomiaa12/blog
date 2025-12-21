<template>
  <div v-if="show" class="editor-plugin-tip">
    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M746.666667 102.4L362.666667 418.133333 194.133333 279.466667 0 358.4v307.2l194.133333 78.933333 168.533334-138.666666 384 315.733333 277.333333-102.4V204.8L746.666667 102.4z m0 217.6v384l-256-192 256-192z" fill="currentColor"/>
    </svg>
    <span>{{ message }}</span>
    <template v-for="(plugin, index) in plugins" :key="index">
      <a :href="plugin.url" target="_blank" rel="noopener noreferrer">
        {{ plugin.name }}
      </a>
      <span v-if="index < plugins.length - 1" class="separator"> / </span>
    </template>
    <button @click="dismiss" class="close-button" aria-label="关闭提示">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { isVSCode } from '@/utils/src/isVSCode'
import { isMobile } from '@/utils/src/isMobile'

export interface PluginLink {
  name: string
  url: string
}

const props = withDefaults(defineProps<{
  show?: boolean
  plugins?: PluginLink[]
  storageKey?: string
  message?: string
}>(), {
  show: undefined,
  plugins: () => [],
  storageKey: 'editor-plugin-tip-dismissed',
  message: 'VSCode 和 Cursor 插件版已上线：'
})

const isDismissed = ref(false)

// 检查本地存储是否已关闭
onMounted(() => {
  if (typeof window !== 'undefined') {
    const dismissed = localStorage.getItem(props.storageKey)
    isDismissed.value = dismissed === 'true'
  }
})

// 如果未传入 show，则自动判断：PC 端且非 VSCode 环境且未关闭
const show = computed(() => {
  if (props.show !== undefined) {
    return props.show
  }
  return !isMobile.value && !isVSCode() && props.plugins.length > 0 && !isDismissed.value
})

// 关闭提示
const dismiss = () => {
  isDismissed.value = true
  if (typeof window !== 'undefined') {
    localStorage.setItem(props.storageKey, 'true')
  }
}
</script>

<style scoped>
.editor-plugin-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 20px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  margin-right: 10%;
}

.editor-plugin-tip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.editor-plugin-tip .icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.editor-plugin-tip span {
  font-weight: 600;
  flex-shrink: 0;
}

.editor-plugin-tip .separator {
  font-weight: normal;
  opacity: 0.8;
}

.editor-plugin-tip a {
  color: #ffffff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  transition: border-color 0.2s ease;
}

.editor-plugin-tip a:hover {
  border-bottom-color: #ffffff;
}

.editor-plugin-tip .close-button {
  margin-left: auto;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  opacity: 0.7;
}

.editor-plugin-tip .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.editor-plugin-tip .close-button:active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>

