---
title: Онлайн Base64-инструмент - Бесплатно для текста, изображений и файлов
description: Бесплатный онлайн-инструмент Base64 для кодирования и декодирования текста, изображений и файлов. Без загрузки на сервер, мгновенная обработка, безопасно и приватно.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Бесплатный онлайн-инструмент Base64 для кодирования и декодирования текста, изображений и файлов. Без загрузки на сервер, мгновенная обработка, безопасно и приватно.
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

const base64Groups = getBase64Cards('ru')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
