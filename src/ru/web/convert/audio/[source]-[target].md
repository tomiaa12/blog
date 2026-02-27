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

# Конвертировать {{ $params.sourceLabel }} в {{ $params.targetLabel }}

<p class="page-desc">Бесплатно конвертируйте пакетно <strong>{{ $params.sourceLabel }}</strong> в <strong>{{ $params.targetLabel }}</strong> онлайн, без установки программ, безопасно и быстро</p>

<Convert/>

### О формате {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### О формате {{ $params.targetLabel }}

{{ $params.targetDesc }}
