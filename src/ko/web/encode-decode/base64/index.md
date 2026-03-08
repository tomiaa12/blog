---
title: 온라인 Base64 도구 - 무료 텍스트, 이미지, 파일 Base64 변환
description: 텍스트, 이미지, 파일용 무료 온라인 Base64 인코딩/디코딩 도구입니다. 서버 업로드 없이 즉시 처리되며 안전하고 개인 정보 보호에 적합합니다.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: 텍스트, 이미지, 파일용 무료 온라인 Base64 인코딩/디코딩 도구입니다. 서버 업로드 없이 즉시 처리되며 안전하고 개인 정보 보호에 적합합니다.
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

const base64Groups = getBase64Cards('ko')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
