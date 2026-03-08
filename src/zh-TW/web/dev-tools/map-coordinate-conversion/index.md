---
title: 線上座標轉換 - 免費地圖座標轉換工具
description: 支援地球座標、火星座標、百度座標、百度墨卡托、墨卡托座標、天地圖座標等常見座標系互轉，點擊下方卡片即可進入對應轉換頁面。
keywords: 座標轉換,地圖座標轉換,線上座標轉換,WGS84,GCJ02,BD09,百度墨卡托,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: 支援地球座標、火星座標、百度座標、百度墨卡托、墨卡托座標、天地圖座標等常見座標系互轉，點擊下方卡片即可進入對應轉換頁面。
  - - meta
    - name: keywords
      content: 座標轉換,地圖座標轉換,線上座標轉換,WGS84,GCJ02,BD09,百度墨卡托,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('zh-TW')
const mapCoordinateCards = getMapCoordinateCards('zh-TW')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# 線上座標轉換

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
