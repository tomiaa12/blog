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

# {{ $params.sourceLabel }} 轉 {{ $params.targetLabel }}

## {{ sourceQuery }} 轉 {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">免費線上批次將 <strong>{{ $params.sourceLabel }}</strong> 格式轉換為 <strong>{{ $params.targetLabel }}</strong> 格式，無需安裝軟體，安全快速</p>

<p class="page-desc">免費線上批次將 <strong>{{ sourceQuery }}</strong> 格式轉換為 <strong>{{ $params.targetLabel }}</strong> 格式，無需安裝軟體，安全快速</p>

<Convert/>

### 關於 {{ sourceQuery || $params.sourceLabel }} 格式

{{ $params.sourceDesc }}

### 關於 {{ $params.targetLabel }} 格式

{{ $params.targetDesc }}
