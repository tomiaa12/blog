---
title: Outil URL en ligne - Gratuit pour encoder, decoder, analyser et generer Query
description: Outil gratuit en ligne pour encoder et decoder des URL, analyser des parametres Query et generer des chaines Query. Ideal pour le traitement des liens, le debug des parametres et le developpement API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Outil gratuit en ligne pour encoder et decoder des URL, analyser des parametres Query et generer des chaines Query. Ideal pour le traitement des liens, le debug des parametres et le developpement API.
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

const urlGroups = getUrlCards('fr')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
