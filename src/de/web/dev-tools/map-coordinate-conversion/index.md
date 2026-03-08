---
title: Online-Koordinatenumrechner - Kostenloses Tool fuer Kartenkoordinaten
description: Unterstuetzt Umrechnungen zwischen WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator und CGCS2000. Klicken Sie unten auf eine Karte, um die passende Umrechnungsseite zu oeffnen.
keywords: Koordinatenumrechnung,Kartenkoordinaten umrechnen,Online-Koordinatenumrechner,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Unterstuetzt Umrechnungen zwischen WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator und CGCS2000. Klicken Sie unten auf eine Karte, um die passende Umrechnungsseite zu oeffnen.
  - - meta
    - name: keywords
      content: Koordinatenumrechnung,Kartenkoordinaten umrechnen,Online-Koordinatenumrechner,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('de')
const mapCoordinateCards = getMapCoordinateCards('de')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Online-Koordinatenumrechner

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
