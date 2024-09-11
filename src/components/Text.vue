<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
import mdKatex from "@traptitech/markdown-it-katex"
import "highlight.js/scss/atom-one-dark-reasonable.scss"

interface Props {
  error?: boolean
  text?: string
  loading?: boolean
  once?: boolean
  html?: boolean
  interval?: number
}
const props = withDefaults(defineProps<Props>(), {
  html: true,
  interval: 30,
  loading: true,
  text: "",
})

const emits = defineEmits(["end"])

const mdi = new MarkdownIt({
  linkify: true,
  html: props.html,
  breaks: true,
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
  const temp = mdi.render(outputText.value) || (props.error ? "出错啦！" : "")
  return temp || '<span></span>'
})

function highlightBlock(str: string, lang: string, code: string) {
  return `<div class="language-${lang} vp-adaptive-theme">
    <button
      class="copy"
      title="Copy Code"
      onclick="copyToClip(this)"
    >
    </button>
    <span class="lang">${lang}</span>
    <pre class="shiki github-dark vp-code-dark"><code>${str}</code></pre>
    <pre class="shiki github-light vp-code-light"><code>${str}</code></pre>
  </div>
  `
}

let currentIndex = 0
let timer: number
const display = computed(() => props.loading || typeing.value ? 'inline-block' : 'none')
onUnmounted(() => {
  clearInterval(timer)
})
const typeing = ref(true)
const outputText = ref("")
const typeText = () => {
  if (currentIndex < props.text!.length) {
    outputText.value += props.text![currentIndex]
    currentIndex++
  } else {
    clearInterval(timer)
    if (props.once) {
      emits("end")
    }
  }
  typeing.value = currentIndex <= props.text!.length - 1
}

watch(
  () => props.text,
  async (newVal = "") => {
    if (!props.loading) {
      outputText.value = newVal
      typeing.value = false
      return
    }
    clearInterval(timer)
    timer = window.setInterval(typeText, props.interval)
    return
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div
    class="gpt-text"
    :class="error ? 'error' : ''"
  >
    <div
      class="markdown-body"
      v-html="render"
    />
  </div>
</template>

<style lang="scss" scoped>
.gpt-text {
  overflow-wrap: break-word;
  max-width: 100%;
  display: flex;
  &.error {
    color: var(--el-color-danger);
  }
}

:deep() {
  .markdown-body > :not(ol):not(ul):not(pre):last-child::after, .markdown-body > pre:last-child code::after {
    content: "●";
    font-family: Circle, system-ui, sans-serif;
    line-height: 32px;
    transform: scale(2);
    display: v-bind(display);
    margin-left: 0.5em;
  }
  .markdown-body > pre:last-child code::after {
    color: var(--el-color-black);
  }
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
}
</style>

<style lang="scss">
html:not(.dark) {
  .markdown-body .github-dark {
    display: none;
  }
}
html.dark {
  .markdown-body .github-light {
    display: none;
  }
}
</style>
