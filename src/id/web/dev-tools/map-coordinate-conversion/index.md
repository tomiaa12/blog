---
title: Konverter koordinat online - Alat gratis untuk konversi koordinat peta
description: Mendukung konversi antara WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, dan CGCS2000. Klik kartu di bawah untuk membuka halaman konversi yang sesuai.
keywords: konversi koordinat,konversi koordinat peta,konverter koordinat online,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Mendukung konversi antara WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, dan CGCS2000. Klik kartu di bawah untuk membuka halaman konversi yang sesuai.
  - - meta
    - name: keywords
      content: konversi koordinat,konversi koordinat peta,konverter koordinat online,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('id')
const mapCoordinateCards = getMapCoordinateCards('id')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Konverter koordinat online

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
