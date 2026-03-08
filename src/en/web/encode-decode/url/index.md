---
title: Online URL Encode Decode Tool - Free URL Encoder, Decoder, Query Parser and Builder
description: Free online URL encode/decode tool with URL encoder, URL decoder, query parser, and query builder. Great for link processing, parameter debugging, and API development.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Free online URL encode/decode tool with URL encoder, URL decoder, query parser, and query builder. Great for link processing, parameter debugging, and API development.
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

const urlGroups = getUrlCards('en')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
