---
title: 온라인 좌표 변환기 - 무료 지도 좌표 변환 도구
description: WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, CGCS2000 간 변환을 지원합니다. 아래 카드 중 하나를 클릭하면 해당 변환 페이지로 이동합니다.
keywords: 좌표 변환,지도 좌표 변환,온라인 좌표 변환기,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, CGCS2000 간 변환을 지원합니다. 아래 카드 중 하나를 클릭하면 해당 변환 페이지로 이동합니다.
  - - meta
    - name: keywords
      content: 좌표 변환,지도 좌표 변환,온라인 좌표 변환기,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('ko')
const mapCoordinateCards = getMapCoordinateCards('ko')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# 온라인 좌표 변환기

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
