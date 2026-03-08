---
title: 在线坐标转换 - 免费地图坐标转换工具
description: 免费在线坐标转换工具，支持 WGS84、GCJ02、BD09、EPSG:3857、百度墨卡托、CGCS2000 等坐标系互转。
keywords: 坐标转换,地图坐标转换,在线坐标转换,WGS84,GCJ02,BD09,百度墨卡托,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: 免费在线坐标转换工具，支持 WGS84、GCJ02、BD09、EPSG:3857、百度墨卡托、CGCS2000 等坐标系互转。
  - - meta
    - name: keywords
      content: 坐标转换,地图坐标转换,在线坐标转换,WGS84,GCJ02,BD09,百度墨卡托,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from './map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('zh')
const mapCoordinateCards = getMapCoordinateCards('zh')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# 在线坐标转换

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
