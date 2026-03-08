---
title: 在线 URL 编解码工具 - 免费 URL 编码、解码、Query 解析与生成
description: 免费在线 URL 编解码工具，支持 URL 编码、URL 解码、Query 参数解析、Query 参数生成，适合链接处理、参数调试与接口开发。
keywords: URL编解码,URL编码,URL解码,Query参数解析,Query参数生成,URL工具,在线URL工具
head:
  - - meta
    - name: description
      content: 免费在线 URL 编解码工具，支持 URL 编码、URL 解码、Query 参数解析、Query 参数生成，适合链接处理、参数调试与接口开发。
  - - meta
    - name: keywords
      content: URL编解码,URL编码,URL解码,Query参数解析,Query参数生成,URL工具,在线URL工具
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { urlGroups } from './url-cards.ts'
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
