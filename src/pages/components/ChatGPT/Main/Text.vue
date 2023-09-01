<script lang="ts" setup>
import { computed, ref } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
import mdKatex from "@traptitech/markdown-it-katex"
import "highlight.js/scss/atom-one-dark-reasonable.scss"

interface Props {
  error?: boolean
  text?: string
  loading?: boolean
}

const props = defineProps<Props>()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  linkify: true,
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

const text = computed(() => {
  const value = props.text ?? ""
  return mdi.render(value)
})

function highlightBlock(str: string, lang: string, code: string) {
  return `<div class="language-${lang}">
    <button
      title="Copy Code"
      class="copy"
      data-code="${code}"
      onclick="copyToClipboard(event)"
    ></button>
    <span class="lang">${lang}</span>
    <pre class="shiki material-theme-palenight"><code>${str}</code></pre>
  </div>`
}

defineExpose({ textRef })
</script>

<template>
  <div
    class="gpt-text"
    :class="error ? 'error' : ''"
    ref="textRef"
  >
    <div
      :class="['markdown-body']"
      v-html="text || (error && !text ? '出错啦！' : '')"
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
.loading::after {
  content: "";
  width: 4px;
  height: 20px;
  display: inline-block;
  animation: blink 1.2s infinite steps(1, start);
}

.gpt-text {
  margin-left: 1em;
  overflow-wrap: break-word;
  &.error{
    color: var(--el-color-danger);
  }
}

:deep() {
  p {
    margin: 0;
    line-height: 1.5;
  }
  pre {
    line-height: 0;
  }
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
