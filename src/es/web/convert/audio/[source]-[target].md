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

# Convertir {{ $params.sourceLabel }} a {{ $params.targetLabel }}

<p class="page-desc">Convierte por lotes <strong>{{ $params.sourceLabel }}</strong> a <strong>{{ $params.targetLabel }}</strong> de forma gratuita en línea, sin necesidad de instalar software, de forma segura y rápida</p>

<Convert/>

### Acerca del formato {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Acerca del formato {{ $params.targetLabel }}

{{ $params.targetDesc }}
