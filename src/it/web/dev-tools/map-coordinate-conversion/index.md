---
title: Convertitore di coordinate online - Strumento gratuito per coordinate mappa
description: Supporta la conversione tra WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator e CGCS2000. Fai clic su una scheda qui sotto per aprire la pagina di conversione corrispondente.
keywords: conversione coordinate,conversione coordinate mappa,convertitore di coordinate online,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Supporta la conversione tra WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator e CGCS2000. Fai clic su una scheda qui sotto per aprire la pagina di conversione corrispondente.
  - - meta
    - name: keywords
      content: conversione coordinate,conversione coordinate mappa,convertitore di coordinate online,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('it')
const mapCoordinateCards = getMapCoordinateCards('it')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Convertitore di coordinate online

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
