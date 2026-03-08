---
title: Cevrim ici URL araci - Ucretsiz URL kodlama, cozme, Query parser ve builder
description: Ucretsiz cevrim ici URL araci; URL kodlama, URL cozme, Query parametrelerini ayrisma ve Query string olusturma icin uygundur. Link isleme, parametre hata ayiklama ve API gelistirme icin idealdir.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Ucretsiz cevrim ici URL araci; URL kodlama, URL cozme, Query parametrelerini ayrisma ve Query string olusturma icin uygundur. Link isleme, parametre hata ayiklama ve API gelistirme icin idealdir.
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

const urlGroups = getUrlCards('tr')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
