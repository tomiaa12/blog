---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

<script setup>
import { useData } from 'vitepress'
import Convert from '@/zh/web/convert/audio/Convert/index.vue'

const { params } = useData()
</script>

# {{ $params.sourceLabel }} to {{ $params.targetLabel }} 변환

<p class="page-desc"><strong>{{ $params.sourceLabel }}</strong>을 <strong>{{ $params.targetLabel }}</strong>로 무료 온라인 일괄 변환, 소프트웨어 설치 불필요, 안전하고 빠름</p>

<Convert/>

### {{ $params.sourceLabel }} 형식 정보

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} 형식 정보

{{ $params.targetDesc }}
