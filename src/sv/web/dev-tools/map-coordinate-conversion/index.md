---
title: Online koordinatkonverterare - Gratis verktyg foer kartkoordinater
description: Stoeder konvertering mellan WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator och CGCS2000. Klicka pa ett kort nedan for att oppna motsvarande konverteringssida.
keywords: koordinatkonvertering,kartkoordinatkonvertering,online koordinatkonverterare,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Stoeder konvertering mellan WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator och CGCS2000. Klicka pa ett kort nedan for att oppna motsvarande konverteringssida.
  - - meta
    - name: keywords
      content: koordinatkonvertering,kartkoordinatkonvertering,online koordinatkonverterare,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('sv')
const mapCoordinateCards = getMapCoordinateCards('sv')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Online koordinatkonverterare

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
