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

# {{ $params.sourceLabel }} 转 {{ $params.targetLabel }}

<p class="page-desc">免费在线批量将 <strong>{{ $params.sourceLabel }}</strong> 格式转换为 <strong>{{ $params.targetLabel }}</strong> 格式，无需安装软件，安全快速</p>

<Convert/>

### 关于 {{ $params.sourceLabel }} 格式

{{ $params.sourceDesc }}

### 关于 {{ $params.targetLabel }} 格式

{{ $params.targetDesc }}
