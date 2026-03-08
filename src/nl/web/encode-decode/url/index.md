---
title: Online URL-tool - Gratis URL coderen, decoderen, Query parser en builder
description: Gratis online URL-tool voor URL-codering, URL-decodering, Query-parameter parsing en Query-opbouw. Handig voor linkverwerking, parameterdebugging en API-ontwikkeling.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Gratis online URL-tool voor URL-codering, URL-decodering, Query-parameter parsing en Query-opbouw. Handig voor linkverwerking, parameterdebugging en API-ontwikkeling.
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

const urlGroups = getUrlCards('nl')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
