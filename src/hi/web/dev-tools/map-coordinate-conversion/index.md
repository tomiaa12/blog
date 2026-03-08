---
title: ऑनलाइन निर्देशांक कन्वर्टर - मुफ्त मानचित्र निर्देशांक रूपांतरण टूल
description: WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator और CGCS2000 के बीच रूपांतरण का समर्थन करता है। नीचे किसी भी कार्ड पर क्लिक करके संबंधित रूपांतरण पेज खोलें।
keywords: निर्देशांक रूपांतरण,मानचित्र निर्देशांक रूपांतरण,ऑनलाइन निर्देशांक कन्वर्टर,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator और CGCS2000 के बीच रूपांतरण का समर्थन करता है। नीचे किसी भी कार्ड पर क्लिक करके संबंधित रूपांतरण पेज खोलें।
  - - meta
    - name: keywords
      content: निर्देशांक रूपांतरण,मानचित्र निर्देशांक रूपांतरण,ऑनलाइन निर्देशांक कन्वर्टर,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('hi')
const mapCoordinateCards = getMapCoordinateCards('hi')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# ऑनलाइन निर्देशांक कन्वर्टर

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
