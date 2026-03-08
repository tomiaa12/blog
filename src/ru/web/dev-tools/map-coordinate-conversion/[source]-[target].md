---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import MapCoordinateTransform from '@/zh/web/dev-tools/map-coordinate-conversion/components/MapCoordinateTransform.vue'
import { getMapCoordinateCards } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const mapCoordinateCards = getMapCoordinateCards('ru')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# {{ $params.h1 }}

<p class="page-desc">{{ $params.description }}</p>

<MapCoordinateTransform
  lang="ru"
  :transform-key="$params.transform"
  :source-label="$params.sourceLabel"
  :target-label="$params.targetLabel"
/>

## {{ $params.moreTools }}

<CardGroupList :items="mapCoordinateCards" />
