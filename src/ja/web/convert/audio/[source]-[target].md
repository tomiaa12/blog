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

# {{ $params.sourceLabel }} を {{ $params.targetLabel }} に変換

## {{ sourceQuery }} を {{ $params.targetLabel }} に変換

<p class="page-desc" style="display: none;"><strong>{{ $params.sourceLabel }}</strong> を <strong>{{ $params.targetLabel }}</strong> に無料でオンライン一括変換、ソフトウェアのインストール不要、安全で高速</p>

<p class="page-desc"><strong>{{ sourceQuery }}</strong> を <strong>{{ $params.targetLabel }}</strong> に無料でオンライン一括変換、ソフトウェアのインストール不要、安全で高速</p>

<Convert/>

### {{ sourceQuery || $params.sourceLabel }} フォーマットについて

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} フォーマットについて

{{ $params.targetDesc }}
