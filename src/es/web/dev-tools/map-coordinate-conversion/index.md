---
title: Convertidor de coordenadas en linea - Herramienta gratis para coordenadas de mapa
description: Convierte entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator y CGCS2000. Haz clic en cualquier tarjeta de abajo para abrir la pagina de conversion correspondiente.
keywords: conversion de coordenadas,conversion de coordenadas de mapa,convertidor de coordenadas en linea,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Convierte entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator y CGCS2000. Haz clic en cualquier tarjeta de abajo para abrir la pagina de conversion correspondiente.
  - - meta
    - name: keywords
      content: conversion de coordenadas,conversion de coordenadas de mapa,convertidor de coordenadas en linea,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('es')
const mapCoordinateCards = getMapCoordinateCards('es')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Convertidor de coordenadas en linea

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
