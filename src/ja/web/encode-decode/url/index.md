---
title: オンライン URL ツール - 無料の URL エンコード、デコード、Query 解析、生成
description: 無料のオンライン URL ツールです。URL エンコード、URL デコード、Query パラメータ解析、Query 文字列生成に対応し、リンク処理、パラメータ確認、API 開発に便利です。
keywords: URL encode decode,URL encoder,URL decoder,query parser,query builder,URL tool,online URL tool
head:
  - - meta
    - name: description
      content: 無料のオンライン URL ツールです。URL エンコード、URL デコード、Query パラメータ解析、Query 文字列生成に対応し、リンク処理、パラメータ確認、API 開発に便利です。
  - - meta
    - name: keywords
      content: URL encode decode,URL encoder,URL decoder,query parser,query builder,URL tool,online URL tool
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('ja')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
