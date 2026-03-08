---
title: Online Base64-Tool - Kostenlos fuer Text-, Bild- und Datei-Base64-Konvertierung
description: Kostenloses Online-Tool fuer Base64-Codierung und -Decodierung von Texten, Bildern und Dateien. Kein Server-Upload noetig, sofortige Verarbeitung, sicher und privat.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Kostenloses Online-Tool fuer Base64-Codierung und -Decodierung von Texten, Bildern und Dateien. Kein Server-Upload noetig, sofortige Verarbeitung, sicher und privat.
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

const base64Groups = getBase64Cards('de')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
