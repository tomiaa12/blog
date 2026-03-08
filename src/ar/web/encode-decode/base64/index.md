---
title: أداة Base64 عبر الإنترنت - مجانية لترميز وفك ترميز النصوص والصور والملفات
description: أداة مجانية عبر الإنترنت لترميز وفك ترميز Base64 للنصوص والصور والملفات، دون رفع إلى الخادم، مع معالجة فورية وخصوصية عالية.
keywords: ترميز وفك ترميز Base64,ترميز Base64,فك ترميز Base64,نص إلى Base64,صورة إلى Base64,ملف إلى Base64,أداة Base64 عبر الإنترنت
head:
  - - meta
    - name: description
      content: أداة مجانية عبر الإنترنت لترميز وفك ترميز Base64 للنصوص والصور والملفات، دون رفع إلى الخادم، مع معالجة فورية وخصوصية عالية.
  - - meta
    - name: keywords
      content: ترميز وفك ترميز Base64,ترميز Base64,فك ترميز Base64,نص إلى Base64,صورة إلى Base64,ملف إلى Base64,أداة Base64 عبر الإنترنت
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getBase64Cards } from '@/zh/web/encode-decode/base64/base64-cards'

const base64Groups = getBase64Cards('ar')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
