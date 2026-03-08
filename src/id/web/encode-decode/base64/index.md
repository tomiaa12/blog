---
title: Alat Base64 online - Gratis untuk teks, gambar, dan file
description: Alat Base64 online gratis untuk encode dan decode teks, gambar, dan file. Tanpa upload ke server, proses instan, aman dan privat.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Alat Base64 online gratis untuk encode dan decode teks, gambar, dan file. Tanpa upload ke server, proses instan, aman dan privat.
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

const base64Groups = getBase64Cards('id')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
