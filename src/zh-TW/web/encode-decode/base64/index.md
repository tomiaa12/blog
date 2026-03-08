---
title: 線上 Base64 編解碼工具 - 免費文字、圖片、檔案 Base64 轉換
description: 免費線上 Base64 編解碼工具，支援文字、圖片、檔案的 Base64 編碼與解碼，無需上傳伺服器，即時處理，安全私密。
keywords: Base64編解碼,Base64編碼,Base64解碼,文字轉Base64,圖片轉Base64,檔案轉Base64,線上Base64工具
head:
  - - meta
    - name: description
      content: 免費線上 Base64 編解碼工具，支援文字、圖片、檔案的 Base64 編碼與解碼，無需上傳伺服器，即時處理，安全私密。
  - - meta
    - name: keywords
      content: Base64編解碼,Base64編碼,Base64解碼,文字轉Base64,圖片轉Base64,檔案轉Base64,線上Base64工具
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getBase64Cards } from '@/zh/web/encode-decode/base64/base64-cards'

const base64Groups = getBase64Cards('zh-TW')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
