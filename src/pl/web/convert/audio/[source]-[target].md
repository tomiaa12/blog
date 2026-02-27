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

# Konwertuj {{ $params.sourceLabel }} do {{ $params.targetLabel }}

<p class="page-desc">Bezpłatna konwersja wsadowa online z <strong>{{ $params.sourceLabel }}</strong> do <strong>{{ $params.targetLabel }}</strong>, bez instalacji oprogramowania, bezpiecznie i szybko</p>

<Convert/>

### O formacie {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### O formacie {{ $params.targetLabel }}

{{ $params.targetDesc }}
