---
title: Online coordinatenconverter - Gratis tool voor kaartcoordinaten
description: Ondersteunt conversies tussen WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator en CGCS2000. Klik op een kaart hieronder om de bijbehorende conversiepagina te openen.
keywords: coordinatenconversie,kaartcoordinaten converteren,online coordinatenconverter,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Ondersteunt conversies tussen WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator en CGCS2000. Klik op een kaart hieronder om de bijbehorende conversiepagina te openen.
  - - meta
    - name: keywords
      content: coordinatenconversie,kaartcoordinaten converteren,online coordinatenconverter,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('nl')
const mapCoordinateCards = getMapCoordinateCards('nl')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Online coordinatenconverter

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
