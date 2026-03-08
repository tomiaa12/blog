---
title: Online Base64-verktyg - Gratis foer text, bilder och filer
description: Gratis online Base64-verktyg foer kodning och avkodning av text, bilder och filer. Ingen serveruppladdning, omedelbar bearbetning, sakert och privat.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Gratis online Base64-verktyg foer kodning och avkodning av text, bilder och filer. Ingen serveruppladdning, omedelbar bearbetning, sakert och privat.
  - - meta
    - name: keywords
      content: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getBase64Cards } from '@/zh/web/encode-decode/base64/base64-cards'

const base64Groups = getBase64Cards('sv')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
