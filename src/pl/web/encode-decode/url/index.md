---
title: Narzedzie URL online - Darmowe kodowanie, dekodowanie, parser i builder Query
description: Darmowe narzedzie URL online do kodowania URL, dekodowania URL, analizowania parametrow Query i budowania Query string. Przydatne do obrobki linkow, debugowania parametrow i tworzenia API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Darmowe narzedzie URL online do kodowania URL, dekodowania URL, analizowania parametrow Query i budowania Query string. Przydatne do obrobki linkow, debugowania parametrow i tworzenia API.
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

const urlGroups = getUrlCards('pl')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
