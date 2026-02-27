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

# {{ $params.sourceLabel }} to {{ $params.targetLabel }}

<p class="page-desc">Free online batch convert <strong>{{ $params.sourceLabel }}</strong> to <strong>{{ $params.targetLabel }}</strong> format, no software installation required, safe and fast</p>

<Convert/>

### About {{ $params.sourceLabel }} Format

{{ $params.sourceDesc }}

### About {{ $params.targetLabel }} Format

{{ $params.targetDesc }}
