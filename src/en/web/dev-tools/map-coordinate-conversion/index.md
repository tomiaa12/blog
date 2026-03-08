---
title: Online Coordinate Converter - Free Map Coordinate Conversion Tool
description: Convert between WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, and CGCS2000. Click any card below to open the corresponding conversion page.
keywords: coordinate converter,map coordinate conversion,online coordinate converter,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Convert between WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, and CGCS2000. Click any card below to open the corresponding conversion page.
  - - meta
    - name: keywords
      content: coordinate converter,map coordinate conversion,online coordinate converter,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('en')
const mapCoordinateCards = getMapCoordinateCards('en')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Online Coordinate Converter

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
