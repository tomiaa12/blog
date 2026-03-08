---
title: أداة ترميز وفك ترميز URL عبر الإنترنت - مجانية لترميز URL وفكّه وتحليل Query وإنشائه
description: أداة مجانية عبر الإنترنت لترميز وفك ترميز URL، تدعم ترميز URL وفك ترميزه وتحليل معلمات Query وإنشاءها، ومناسبة لمعالجة الروابط وتصحيح المعلمات وتطوير الواجهات.
keywords: ترميز وفك ترميز URL,ترميز URL,فك ترميز URL,تحليل Query,إنشاء Query,أدوات URL,أداة URL عبر الإنترنت
head:
  - - meta
    - name: description
      content: أداة مجانية عبر الإنترنت لترميز وفك ترميز URL، تدعم ترميز URL وفك ترميزه وتحليل معلمات Query وإنشاءها، ومناسبة لمعالجة الروابط وتصحيح المعلمات وتطوير الواجهات.
  - - meta
    - name: keywords
      content: ترميز وفك ترميز URL,ترميز URL,فك ترميز URL,تحليل Query,إنشاء Query,أدوات URL,أداة URL عبر الإنترنت
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('ar')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
