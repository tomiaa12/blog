<script lang="ts" setup>
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
import mdKatex from "@traptitech/markdown-it-katex"
import "highlight.js/scss/atom-one-dark-reasonable.scss"
import { orginHost } from "./getMsg"
import mediumZoom from "medium-zoom"

interface Props {
  error?: boolean
  text?: string
  loading?: boolean
}
const props = defineProps<Props>()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  linkify: true,
  html: true,
  highlight(code: string, language = "sh") {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ""
      return highlightBlock(hljs.highlight(lang, code, true).value, lang, code)
    }
    return highlightBlock(hljs.highlightAuto(code).value, "", code)
  },
})

mdi.use(mdKatex, {
  blockClass: "katexmath-block",
  errorColor: " #cc0000",
})

// 自定义渲染规则，不使用 <pre> 标签包裹代码块
mdi.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const token = tokens[idx]
  const code = token.content
  const lang = token.info
  return options.highlight?.(code, lang, "") || code
}

const render = computed(() => {
  let value = outputText.value
  let count = value.split("```").length - 1

  // 闭合代码块，兼容 loading
  if (count % 2 === 1) {
    let t = "\n```"
    if (value[value.length - 1] === "`") {
      t = "``"
      if (value[value.length - 2] === "`") {
        t = "`"
        if (value[value.length - 3] === "`") t = "\n```"
      }
    }

    value += `${t}`
  }
  const loadingHTML = `${
    value[value.length - 1] === "`" ? "\n" : ""
  }<span class="loading"></span>`
  const temp =
    mdi.render(
      value.replace(/(\n)(?![^`]*```)/g, "\n\n") +
        (props.loading || typeing ? loadingHTML : "")
    ) || (props.error ? "出错啦！" : "")
  return temp
})

function highlightBlock(str: string, lang: string, code: string) {
  return `<div class="language-${lang}">
    <button
      title="Copy Code"
      class="copy"
      onclick="copyToClipboard(event)"
    >
      <span style="display: none">${code}</span>
    </button>
    <span class="lang">${lang}</span>
    <pre class="shiki material-theme-palenight"><code>${str}</code></pre>
  </div>
  `
}

const isHttpUrl = computed(() => /^http/.test(props.text!))

const isAudio = computed(
  () =>
    (/^\//.test(props.text!) || isHttpUrl.value) && /\.mp3$/.test(props.text!)
)

const isImg = computed(
  () =>
    (/^\//.test(props.text!) || isHttpUrl.value) &&
    /(\.png|\.jpg|\.gif)$/.test(props.text!)
)

const baseURL = computed(() => (isHttpUrl.value ? "" : orginHost))

let currentIndex = 0
let timer: number, timer2: number
const bgc = ref("currentColor")

timer2 = window.setInterval(() => {
  if (props.loading || typeing)
    bgc.value = bgc.value === "currentColor" ? "transparent" : "currentColor"
  else clearInterval(timer2)
}, 1200)

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(timer2)
})
let typeing = true
const outputText = ref("")
const typeText = () => {
  if (currentIndex < props.text!.length) {
    outputText.value += props.text![currentIndex]
    currentIndex++
  } else {
    clearInterval(timer)
  }
  typeing = currentIndex <= props.text!.length - 1
}

watch(
  () => props.text,
  async (newVal = "") => {
    if (!props.loading) {
      outputText.value = newVal
      typeing = false
      return
    }
    clearInterval(timer)
    timer = window.setInterval(typeText, 30)
    return
  },
  {
    immediate: true,
  }
)

const setZoom = async () => {
  await nextTick()
  const zoom = mediumZoom(imgRef.value.$el.children[0])
  zoom.update({ background: "var(--el-color-info-light-9)" })
}

const imgRef = ref()
</script>

<template>
  <div
    class="gpt-text"
    :class="error ? 'error' : ''"
  >
    <el-image
      v-if="isImg"
      ref="imgRef"
      style="max-width: 200px"
      :src="baseURL + props.text"
      fit="contain"
      @load="setZoom"
    />
    <audio
      v-else-if="isAudio"
      controls
      :src="baseURL + props.text"
    ></audio>
    <div
      v-else
      class="markdown-body"
      ref="textRef"
      v-html="render"
    />
  </div>
</template>

<style lang="scss" scoped>
@keyframes blink {
  0%,
  100% {
    background-color: currentColor;
  }

  50% {
    background-color: transparent;
  }
}

.gpt-text {
  margin-left: 1em;
  overflow-wrap: break-word;
  max-width: 100%;
  &.error {
    color: var(--el-color-danger);
  }
}

:deep() {
  .markdown-body {
    &::before {
      display: none;
    }
    > p:first-child {
      margin-top: 0;
    }
    > p:last-of-type {
      margin-bottom: 0;
    }
    div[class*="language-"] {
      min-width: 300px;
      min-height: 52px;
      max-width: 100%;
      border-radius: 8px;
    }
  }
  .loading {
    width: 4px;
    height: 22px;
    display: inline-block;
    vertical-align: text-bottom;
    background-color: v-bind(bgc);
    transition: var(--el-transition-all);
    margin-left: .5em;
  }
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

audio {
  height: 24px;
}
</style>
