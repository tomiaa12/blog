---
title: Online Base64-tool - Gratis voor tekst, afbeelding en bestand
description: Gratis online Base64-tool voor het coderen en decoderen van tekst, afbeeldingen en bestanden. Geen serverupload, directe verwerking, veilig en prive.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Gratis online Base64-tool voor het coderen en decoderen van tekst, afbeeldingen en bestanden. Geen serverupload, directe verwerking, veilig en prive.
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

const base64Groups = getBase64Cards('nl')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
