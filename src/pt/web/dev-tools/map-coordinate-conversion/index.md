---
title: Conversor de coordenadas online - Ferramenta gratis para coordenadas de mapa
description: Suporta conversoes entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator e CGCS2000. Clique em qualquer cartao abaixo para abrir a pagina de conversao correspondente.
keywords: conversao de coordenadas,conversao de coordenadas de mapa,conversor de coordenadas online,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Suporta conversoes entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator e CGCS2000. Clique em qualquer cartao abaixo para abrir a pagina de conversao correspondente.
  - - meta
    - name: keywords
      content: conversao de coordenadas,conversao de coordenadas de mapa,conversor de coordenadas online,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('pt')
const mapCoordinateCards = getMapCoordinateCards('pt')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Conversor de coordenadas online

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
