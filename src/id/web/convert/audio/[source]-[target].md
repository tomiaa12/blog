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

# Konversi {{ $params.sourceLabel }} ke {{ $params.targetLabel }}

<p class="page-desc">Konversi batch <strong>{{ $params.sourceLabel }}</strong> ke <strong>{{ $params.targetLabel }}</strong> secara online gratis, tidak perlu menginstal perangkat lunak, aman dan cepat</p>

<Convert/>

### Tentang format {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Tentang format {{ $params.targetLabel }}

{{ $params.targetDesc }}
