---
title: Strumento Base64 online - Gratis per testo, immagini e file
description: Strumento Base64 online gratuito per codificare e decodificare testo, immagini e file. Nessun upload al server, elaborazione immediata, sicuro e privato.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Strumento Base64 online gratuito per codificare e decodificare testo, immagini e file. Nessun upload al server, elaborazione immediata, sicuro e privato.
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

const base64Groups = getBase64Cards('it')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
