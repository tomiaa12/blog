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

# {{ $params.sourceLabel }} を {{ $params.targetLabel }} に変換

<p class="page-desc"><strong>{{ $params.sourceLabel }}</strong> を <strong>{{ $params.targetLabel }}</strong> に無料でオンライン一括変換、ソフトウェアのインストール不要、安全で高速</p>

<Convert/>

### {{ $params.sourceLabel }} フォーマットについて

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} フォーマットについて

{{ $params.targetDesc }}
