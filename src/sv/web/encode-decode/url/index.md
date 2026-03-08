---
title: Online URL-verktyg - Gratis foer URL-kodning, avkodning, Query-parser och builder
description: Gratis online URL-verktyg foer URL-kodning, URL-avkodning, Query-parameteranalys och Query-byggning. Perfekt foer lankhantering, parameterdebuggning och API-utveckling.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Gratis online URL-verktyg foer URL-kodning, URL-avkodning, Query-parameteranalys och Query-byggning. Perfekt foer lankhantering, parameterdebuggning och API-utveckling.
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

const urlGroups = getUrlCards('sv')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
