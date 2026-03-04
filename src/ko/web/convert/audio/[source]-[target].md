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

# {{ $params.sourceLabel }} to {{ $params.targetLabel }} 변환

## {{ sourceQuery }} to {{ $params.targetLabel }} 변환

<p class="page-desc" style="display: none;"><strong>{{ $params.sourceLabel }}</strong>을 <strong>{{ $params.targetLabel }}</strong>로 무료 온라인 일괄 변환, 소프트웨어 설치 불필요, 안전하고 빠름</p>

<p class="page-desc"><strong>{{ sourceQuery }}</strong>을 <strong>{{ $params.targetLabel }}</strong>로 무료 온라인 일괄 변환, 소프트웨어 설치 불필요, 안전하고 빠름</p>

<Convert/>

### {{ sourceQuery || $params.sourceLabel }} 형식 정보

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} 형식 정보

{{ $params.targetDesc }}
