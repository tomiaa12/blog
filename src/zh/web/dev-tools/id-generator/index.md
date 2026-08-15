---
title: UUID / ULID / Token 生成器 - 在线批量生成随机 ID
description: 免费在线生成 UUID、ULID 和随机 Token，可批量复制或下载。UUID 与 Token 用浏览器加密接口，ULID 从 CDN 加载，不上传数据。
keywords: UUID生成器,ULID,Token生成,随机ID,UUID v4,在线UUID
head:
  - - meta
    - name: description
      content: 免费在线生成 UUID、ULID 和随机 Token，可批量复制或下载。UUID 与 Token 用浏览器加密接口，ULID 从 CDN 加载，不上传数据。
  - - meta
    - name: keywords
      content: UUID生成器,ULID,Token生成,随机ID,UUID v4,在线UUID
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import IdGenerator from "./components/IdGenerator.vue"
</script>

<IdGenerator />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
