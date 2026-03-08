---
title: Strumento URL online - Gratis per encode, decode, parser e builder Query
description: Strumento URL online gratuito per codifica URL, decodifica URL, parsing dei parametri Query e generazione di Query string. Utile per link, debug dei parametri e sviluppo API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Strumento URL online gratuito per codifica URL, decodifica URL, parsing dei parametri Query e generazione di Query string. Utile per link, debug dei parametri e sviluppo API.
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

const urlGroups = getUrlCards('it')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
