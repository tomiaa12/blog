---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero audio-convert-page
---

<style lang="scss">
  @use '@/style/widescreen.scss';
  .audio-convert-page h1 { display: none; }
  .audio-convert-page h2 { text-align: center; }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import Convert from '@/zh/web/convert/audio/Convert/index.vue'

const { params } = useData()

const sourceQuery = ref('')
onMounted(() => {
  const search = new URLSearchParams(window.location.search)
  sourceQuery.value = search.get('source') ?? ''
})
</script>

# {{ $params.sourceLabel }} 转 {{ $params.targetLabel }}

## {{ sourceQuery }} 转 {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">免费在线批量将 <strong>{{ $params.sourceLabel }}</strong> 格式转换为 <strong>{{ $params.targetLabel }}</strong> 格式，无需安装软件，安全快速</p>

<p class="page-desc">免费在线批量将 <strong>{{ sourceQuery }}</strong> 格式转换为 <strong>{{ $params.targetLabel }}</strong> 格式，无需安装软件，安全快速</p>

<Convert/>

### 关于 {{ sourceQuery || $params.sourceLabel }} 格式

{{ $params.sourceDesc }}

### 关于 {{ $params.targetLabel }} 格式

{{ $params.targetDesc }}
