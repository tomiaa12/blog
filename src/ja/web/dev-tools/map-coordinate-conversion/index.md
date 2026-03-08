---
title: オンライン座標変換 - 無料の地図座標変換ツール
description: WGS84、GCJ02、BD09、Baidu Mercator、Web Mercator、CGCS2000 間の変換に対応しています。下のカードをクリックすると対応する変換ページを開けます。
keywords: 座標変換,地図座標変換,オンライン座標変換,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: WGS84、GCJ02、BD09、Baidu Mercator、Web Mercator、CGCS2000 間の変換に対応しています。下のカードをクリックすると対応する変換ページを開けます。
  - - meta
    - name: keywords
      content: 座標変換,地図座標変換,オンライン座標変換,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('ja')
const mapCoordinateCards = getMapCoordinateCards('ja')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# オンライン座標変換

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
