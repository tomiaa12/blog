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

# Converti {{ $params.sourceLabel }} in {{ $params.targetLabel }}

<p class="page-desc">Converti in batch <strong>{{ $params.sourceLabel }}</strong> in <strong>{{ $params.targetLabel }}</strong> online gratuitamente, senza installare software, sicuro e veloce</p>

<Convert/>

### Informazioni sul formato {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Informazioni sul formato {{ $params.targetLabel }}

{{ $params.targetDesc }}
