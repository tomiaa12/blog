---
title: Cevrim ici Base64 araci - Metin, gorsel ve dosya icin ucretsiz
description: Metin, gorsel ve dosyalar icin ucretsiz cevrim ici Base64 kodlama ve cozme araci. Sunucuya yukleme yok, aninda isleme, guvenli ve ozel.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Metin, gorsel ve dosyalar icin ucretsiz cevrim ici Base64 kodlama ve cozme araci. Sunucuya yukleme yok, aninda isleme, guvenli ve ozel.
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

const base64Groups = getBase64Cards('tr')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
