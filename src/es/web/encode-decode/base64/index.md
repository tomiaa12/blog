---
title: Herramienta Base64 online - Gratis para texto, imagen y archivo
description: Herramienta gratuita online para codificar y decodificar Base64 de texto, imagen y archivo. Sin subir al servidor, procesamiento instantaneo, segura y privada.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Herramienta gratuita online para codificar y decodificar Base64 de texto, imagen y archivo. Sin subir al servidor, procesamiento instantaneo, segura y privada.
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

const base64Groups = getBase64Cards('es')
</script>


<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>