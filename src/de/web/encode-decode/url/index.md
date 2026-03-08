---
title: Online URL Encode/Decode-Tool - Kostenlos fuer URL-Codierung, Decodierung, Query-Parser und Builder
description: Kostenloses Online-Tool fuer URL-Codierung und -Decodierung mit URL-Encoder, URL-Decoder, Query-Parser und Query-Builder. Ideal fuer Linkverarbeitung, Parameter-Debugging und API-Entwicklung.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Kostenloses Online-Tool fuer URL-Codierung und -Decodierung mit URL-Encoder, URL-Decoder, Query-Parser und Query-Builder. Ideal fuer Linkverarbeitung, Parameter-Debugging und API-Entwicklung.
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

const urlGroups = getUrlCards('de')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
