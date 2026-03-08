---
title: Alat URL online - Gratis untuk encode, decode, parse, dan build Query
description: Alat URL online gratis untuk encode URL, decode URL, parse parameter Query, dan membuat Query string. Cocok untuk pemrosesan tautan, debugging parameter, dan pengembangan API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Alat URL online gratis untuk encode URL, decode URL, parse parameter Query, dan membuat Query string. Cocok untuk pemrosesan tautan, debugging parameter, dan pengembangan API.
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

const urlGroups = getUrlCards('id')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
