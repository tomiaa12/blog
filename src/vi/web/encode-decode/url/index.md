---
title: Cong cu URL truc tuyen - Mien phi ma hoa, giai ma, parser va tao Query
description: Cong cu URL truc tuyen mien phi ho tro ma hoa URL, giai ma URL, phan tich tham so Query va tao Query string. Phu hop cho xu ly lien ket, debug tham so va phat trien API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Cong cu URL truc tuyen mien phi ho tro ma hoa URL, giai ma URL, phan tich tham so Query va tao Query string. Phu hop cho xu ly lien ket, debug tham so va phat trien API.
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

const urlGroups = getUrlCards('vi')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
