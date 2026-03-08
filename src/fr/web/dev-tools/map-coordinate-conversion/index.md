---
title: Convertisseur de coordonnees en ligne - Outil gratuit pour coordonnees cartographiques
description: Prend en charge les conversions entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator et CGCS2000. Cliquez sur une carte ci-dessous pour ouvrir la page de conversion correspondante.
keywords: conversion de coordonnees,conversion de coordonnees cartographiques,convertisseur de coordonnees en ligne,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
head:
  - - meta
    - name: description
      content: Prend en charge les conversions entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator et CGCS2000. Cliquez sur une carte ci-dessous pour ouvrir la page de conversion correspondante.
  - - meta
    - name: keywords
      content: conversion de coordonnees,conversion de coordonnees cartographiques,convertisseur de coordonnees en ligne,WGS84,GCJ02,BD09,Baidu Mercator,EPSG:3857,CGCS2000
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getMapCoordinateCards, getMapCoordinatePageCopy } from '@/zh/web/dev-tools/map-coordinate-conversion/map-coordinate-conversion-cards'

const pageCopy = getMapCoordinatePageCopy('fr')
const mapCoordinateCards = getMapCoordinateCards('fr')
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# Convertisseur de coordonnees en ligne

<p class="page-desc">{{ pageCopy.description }}</p>

<CardGroupList :items="mapCoordinateCards" />
