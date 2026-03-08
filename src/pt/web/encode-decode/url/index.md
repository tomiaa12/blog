---
title: Ferramenta URL online - Gratis para encode, decode, parser e builder de Query
description: Ferramenta URL online gratuita para codificar URL, decodificar URL, analisar parametros Query e gerar Query string. Ideal para links, depuracao de parametros e desenvolvimento de API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Ferramenta URL online gratuita para codificar URL, decodificar URL, analisar parametros Query e gerar Query string. Ideal para links, depuracao de parametros e desenvolvimento de API.
  - - meta
    - name: keywords
      content: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('pt')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
