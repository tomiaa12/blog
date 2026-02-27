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

# {{ $params.sourceLabel }} in {{ $params.targetLabel }} konvertieren

<p class="page-desc">Kostenlose Online-Batch-Konvertierung von <strong>{{ $params.sourceLabel }}</strong> in <strong>{{ $params.targetLabel }}</strong>, keine Softwareinstallation erforderlich, sicher und schnell</p>

<Convert/>

### Über das Format {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Über das Format {{ $params.targetLabel }}

{{ $params.targetDesc }}
