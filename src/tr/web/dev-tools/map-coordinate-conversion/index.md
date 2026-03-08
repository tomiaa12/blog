---
title: Cevrim ici koordinat donusturucu - Ucretsiz harita koordinat araci
description: WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator ve CGCS2000 arasinda donusumu destekler. Ilgili donusum sayfasini acmak icin asagidaki kartlardan birine tiklayin.
keywords: koordinat donusumu,harita koordinat donusumu,cevrim ici koordinat donusturucu,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator ve CGCS2000 arasinda donusumu destekler. Ilgili donusum sayfasini acmak icin asagidaki kartlardan birine tiklayin.
  - - meta
    - name: keywords
      content: koordinat donusumu,harita koordinat donusumu,cevrim ici koordinat donusturucu,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('tr')
const mapCoordinateCards = getMapCoordinateCards('tr')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Cevrim ici koordinat donusturucu

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
