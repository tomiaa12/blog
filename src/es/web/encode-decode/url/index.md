---
title: Herramienta URL online - Gratis para codificar, decodificar, analizar y generar Query
description: Herramienta gratuita online para codificar y decodificar URL, analizar parametros Query y generar cadenas Query. Ideal para procesar enlaces, depurar parametros y desarrollar APIs.
keywords: codificar y decodificar url,codificador url,decodificador url,query parser,query builder,herramienta url,url online
head:
  - - meta
    - name: description
      content: Herramienta gratuita online para codificar y decodificar URL, analizar parametros Query y generar cadenas Query. Ideal para procesar enlaces, depurar parametros y desarrollar APIs.
  - - meta
    - name: keywords
      content: codificar y decodificar url,codificador url,decodificador url,query parser,query builder,herramienta url,url online
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('es')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
