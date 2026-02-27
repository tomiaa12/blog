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

# Convertir {{ $params.sourceLabel }} en {{ $params.targetLabel }}

<p class="page-desc">Conversion par lots gratuite en ligne de <strong>{{ $params.sourceLabel }}</strong> en <strong>{{ $params.targetLabel }}</strong>, aucune installation de logiciel requise, sécurisé et rapide</p>

<Convert/>

### À propos du format {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### À propos du format {{ $params.targetLabel }}

{{ $params.targetDesc }}
