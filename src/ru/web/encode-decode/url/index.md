---
title: Онлайн URL-инструмент - Бесплатное кодирование, декодирование, parser и builder Query
description: Бесплатный онлайн-инструмент для кодирования и декодирования URL, анализа параметров Query и создания Query string. Подходит для обработки ссылок, отладки параметров и разработки API.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: Бесплатный онлайн-инструмент для кодирования и декодирования URL, анализа параметров Query и создания Query string. Подходит для обработки ссылок, отладки параметров и разработки API.
  - - meta
    - name: keywords
      content: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('ru')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
