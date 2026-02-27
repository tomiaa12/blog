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

# Konvertera {{ $params.sourceLabel }} till {{ $params.targetLabel }}

<p class="page-desc">Gratis batchkonvertering online av <strong>{{ $params.sourceLabel }}</strong> till <strong>{{ $params.targetLabel }}</strong>, ingen programvaruinstallation krävs, säkert och snabbt</p>

<Convert/>

### Om formatet {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Om formatet {{ $params.targetLabel }}

{{ $params.targetDesc }}
