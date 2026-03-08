---
title: Narzedzie Base64 online - Darmowe dla tekstu, obrazow i plikow
description: Darmowe narzedzie Base64 online do kodowania i dekodowania tekstu, obrazow i plikow. Bez wysylania na serwer, natychmiastowe przetwarzanie, bezpieczne i prywatne.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Darmowe narzedzie Base64 online do kodowania i dekodowania tekstu, obrazow i plikow. Bez wysylania na serwer, natychmiastowe przetwarzanie, bezpieczne i prywatne.
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

const base64Groups = getBase64Cards('pl')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
