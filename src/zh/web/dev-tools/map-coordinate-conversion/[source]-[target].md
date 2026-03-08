---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import MapCoordinateTransform from './components/MapCoordinateTransform.vue'
import { getMapCoordinateCards } from './map-coordinate-conversion-cards'

const mapCoordinateCards = getMapCoordinateCards('zh')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# {{ $params.h1 }}

<p class="page-desc">{{ $params.description }}</p>

<MapCoordinateTransform
  lang="zh"
  :transform-key="$params.transform"
  :source-label="$params.sourceLabel"
  :target-label="$params.targetLabel"
/>

## {{ $params.moreTools }}

<CardGroupList :items="mapCoordinateCards" />
