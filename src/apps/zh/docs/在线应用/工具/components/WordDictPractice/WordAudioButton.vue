<template>
  <span class="word-audio-button">
    <el-icon
      :size="size"
      :style="iconStyle"
      @click="handleClick"
    >
      <VideoPlay />
    </el-icon>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { VideoPlay } from "@element-plus/icons-vue"

const PRONUNCIATION_API = "https://dict.youdao.com/dictvoice?audio="

const props = withDefaults(
  defineProps<{
    word: string
    variant?: "us" | "uk"
    size?: number
    color?: string
    volume?: number
    rate?: number
    disabled?: boolean
  }>(),
  {
    variant: "us",
    size: 20,
    color: "var(--el-color-primary)",
    volume: 0.8,
    rate: 1,
    disabled: false,
  }
)

const isPlaying = ref(false)
const audio = typeof window !== "undefined" ? new Audio() : null

const iconStyle = computed(() => ({
  color: props.color,
  cursor: props.disabled ? "not-allowed" : "pointer",
  opacity: props.disabled ? 0.5 : 1,
}))

const audioSource = computed(() => {
  if (!props.word) return ""
  const encoded = encodeURIComponent(props.word)
  const audioType = props.variant === "uk" ? 1 : 2
  return `${PRONUNCIATION_API}${encoded}&type=${audioType}`
})

function handleClick() {
  if (props.disabled || !audio || !audioSource.value) {
    return
  }
  audio.pause()
  audio.src = audioSource.value
  audio.volume = Math.min(Math.max(props.volume, 0), 1)
  audio.playbackRate = Math.max(props.rate, 0.1)
  isPlaying.value = true
  audio
    .play()
    .catch(error => {
      console.error("播放失败:", error)
      isPlaying.value = false
    })
}

if (audio) {
  audio.addEventListener("ended", () => {
    isPlaying.value = false
  })
  audio.addEventListener("pause", () => {
    isPlaying.value = false
  })
}
</script>

<style scoped>
.word-audio-button {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
</style>

