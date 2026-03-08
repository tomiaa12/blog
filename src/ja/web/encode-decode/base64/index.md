---
title: オンライン Base64 ツール - 無料のテキスト、画像、ファイル Base64 変換
description: テキスト、画像、ファイルの Base64 エンコードとデコードに対応した無料オンラインツールです。サーバーアップロード不要、即時処理、安全でプライベートです。
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: テキスト、画像、ファイルの Base64 エンコードとデコードに対応した無料オンラインツールです。サーバーアップロード不要、即時処理、安全でプライベートです。
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

const base64Groups = getBase64Cards('ja')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
