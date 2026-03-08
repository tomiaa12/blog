---
title: Outil Base64 en ligne - Gratuit pour texte, image et fichier
description: Outil gratuit en ligne pour encoder et decoder Base64 pour le texte, les images et les fichiers. Aucun televersement serveur, traitement immediat, securise et prive.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Outil gratuit en ligne pour encoder et decoder Base64 pour le texte, les images et les fichiers. Aucun televersement serveur, traitement immediat, securise et prive.
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

const base64Groups = getBase64Cards('fr')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
