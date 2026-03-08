---
title: Ferramenta Base64 online - Gratis para texto, imagem e arquivo
description: Ferramenta Base64 online gratuita para codificar e decodificar texto, imagem e arquivo. Sem upload para servidor, processamento imediato, segura e privada.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Ferramenta Base64 online gratuita para codificar e decodificar texto, imagem e arquivo. Sem upload para servidor, processamento imediato, segura e privada.
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

const base64Groups = getBase64Cards('pt')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
