---
title: 線上 URL 編解碼工具 - 免費 URL 編碼、解碼、Query 解析與產生
description: 免費線上 URL 編解碼工具，支援 URL 編碼、URL 解碼、Query 參數解析、Query 參數產生，適合連結處理、參數除錯與 API 開發。
keywords: URL編解碼,URL編碼,URL解碼,Query參數解析,Query參數產生,URL工具,線上URL工具
head:
  - - meta
    - name: description
      content: 免費線上 URL 編解碼工具，支援 URL 編碼、URL 解碼、Query 參數解析、Query 參數產生，適合連結處理、參數除錯與 API 開發。
  - - meta
    - name: keywords
      content: URL編解碼,URL編碼,URL解碼,Query參數解析,Query參數產生,URL工具,線上URL工具
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('zh-TW')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
