---
title: Онлайн-конвертер координат - Бесплатный инструмент для карт
description: Поддерживает преобразование между WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator и CGCS2000. Нажмите на любую карточку ниже, чтобы открыть нужную страницу преобразования.
keywords: преобразование координат,преобразование координат карты,онлайн-конвертер координат,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Поддерживает преобразование между WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator и CGCS2000. Нажмите на любую карточку ниже, чтобы открыть нужную страницу преобразования.
  - - meta
    - name: keywords
      content: преобразование координат,преобразование координат карты,онлайн-конвертер координат,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('ru')
const mapCoordinateCards = getMapCoordinateCards('ru')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Онлайн-конвертер координат

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
