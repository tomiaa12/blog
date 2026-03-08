---
title: 在线 Base64 编解码工具 - 免费文本、图片、文件 Base64 转换
description: 免费在线 Base64 编解码工具，支持文字、图片、文件的 Base64 编码与解码，无需上传服务器，即时处理，安全私密。
keywords: Base64编解码,Base64编码,Base64解码,文本转Base64,图片转Base64,文件转Base64,在线Base64工具
head:
  - - meta
    - name: description
      content: 免费在线 Base64 编解码工具，支持文字、图片、文件的 Base64 编码与解码，无需上传服务器，即时处理，安全私密。
  - - meta
    - name: keywords
      content: Base64编解码,Base64编码,Base64解码,文本转Base64,图片转Base64,文件转Base64,在线Base64工具
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { base64Groups } from './base64-cards.ts'
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
