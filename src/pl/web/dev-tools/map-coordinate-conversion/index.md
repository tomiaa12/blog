---
title: Internetowy konwerter wspolrzednych - Darmowe narzedzie mapowe
description: Obsluguje konwersje miedzy WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator i CGCS2000. Kliknij dowolna karte ponizej, aby otworzyc odpowiednia strone konwersji.
keywords: konwersja wspolrzednych,konwersja wspolrzednych mapy,internetowy konwerter wspolrzednych,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Obsluguje konwersje miedzy WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator i CGCS2000. Kliknij dowolna karte ponizej, aby otworzyc odpowiednia strone konwersji.
  - - meta
    - name: keywords
      content: konwersja wspolrzednych,konwersja wspolrzednych mapy,internetowy konwerter wspolrzednych,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('pl')
const mapCoordinateCards = getMapCoordinateCards('pl')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Internetowy konwerter wspolrzednych

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
