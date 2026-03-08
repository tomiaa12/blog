---
title: 온라인 URL 도구 - 무료 URL 인코딩, 디코딩, Query 파싱, 생성
description: URL 인코딩, URL 디코딩, Query 파라미터 파싱, Query 생성 기능을 제공하는 무료 온라인 URL 도구입니다. 링크 처리, 파라미터 디버깅, API 개발에 적합합니다.
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: URL 인코딩, URL 디코딩, Query 파라미터 파싱, Query 생성 기능을 제공하는 무료 온라인 URL 도구입니다. 링크 처리, 파라미터 디버깅, API 개발에 적합합니다.
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

const urlGroups = getUrlCards('ko')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
