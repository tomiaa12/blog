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

# {{ $params.sourceLabel }} 轉 {{ $params.targetLabel }}

<p class="page-desc">免費線上批次將 <strong>{{ $params.sourceLabel }}</strong> 格式轉換為 <strong>{{ $params.targetLabel }}</strong> 格式，無需安裝軟體，安全快速</p>

<Convert/>

### 關於 {{ $params.sourceLabel }} 格式

{{ $params.sourceDesc }}

### 關於 {{ $params.targetLabel }} 格式

{{ $params.targetDesc }}
