---
title: เครื่องมือแปลงพิกัดออนไลน์ - เครื่องมือฟรีสำหรับพิกัดแผนที่
description: รองรับการแปลงระหว่าง WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator และ CGCS2000 คลิกการ์ดด้านล่างเพื่อเปิดหน้าการแปลงที่ตรงกัน
keywords: แปลงพิกัด,แปลงพิกัดแผนที่,เครื่องมือแปลงพิกัดออนไลน์,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: รองรับการแปลงระหว่าง WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator และ CGCS2000 คลิกการ์ดด้านล่างเพื่อเปิดหน้าการแปลงที่ตรงกัน
  - - meta
    - name: keywords
      content: แปลงพิกัด,แปลงพิกัดแผนที่,เครื่องมือแปลงพิกัดออนไลน์,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('th')
const mapCoordinateCards = getMapCoordinateCards('th')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# เครื่องมือแปลงพิกัดออนไลน์

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
