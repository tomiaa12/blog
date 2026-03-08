---
title: محول الإحداثيات عبر الإنترنت - أداة مجانية لتحويل إحداثيات الخرائط
description: يدعم التحويل بين WGS84 وGCJ02 وBD09 وBaidu Mercator وWeb Mercator وCGCS2000. انقر على أي بطاقة أدناه لفتح صفحة التحويل المناسبة.
keywords: تحويل الإحداثيات,تحويل إحداثيات الخرائط,محول الإحداثيات عبر الإنترنت,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: يدعم التحويل بين WGS84 وGCJ02 وBD09 وBaidu Mercator وWeb Mercator وCGCS2000. انقر على أي بطاقة أدناه لفتح صفحة التحويل المناسبة.
  - - meta
    - name: keywords
      content: تحويل الإحداثيات,تحويل إحداثيات الخرائط,محول الإحداثيات عبر الإنترنت,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('ar')
const mapCoordinateCards = getMapCoordinateCards('ar')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# محول الإحداثيات عبر الإنترنت

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
