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

# Converter {{ $params.sourceLabel }} para {{ $params.targetLabel }}

<p class="page-desc">Converta em lote <strong>{{ $params.sourceLabel }}</strong> para <strong>{{ $params.targetLabel }}</strong> online gratuitamente, sem necessidade de instalar software, seguro e rápido</p>

<Convert/>

### Sobre o formato {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Sobre o formato {{ $params.targetLabel }}

{{ $params.targetDesc }}
