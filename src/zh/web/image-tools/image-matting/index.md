---
title: 图片抠图 - 浏览器本地 AI 去背景
description: 免费在线抠图去背景，使用 Transformers.js 在浏览器本地运行，不上传图片。可换成透明、白、蓝、红底，导出 PNG。
keywords: 图片抠图,去背景,AI抠图,透明背景,在线抠图,transformers.js
head:
  - - meta
    - name: description
      content: 免费在线抠图去背景，使用 Transformers.js 在浏览器本地运行，不上传图片。可换成透明、白、蓝、红底，导出 PNG。
  - - meta
    - name: keywords
      content: 图片抠图,去背景,AI抠图,透明背景,在线抠图,transformers.js
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import ImageMatting from "./components/ImageMatting.vue"
</script>

<ImageMatting />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
