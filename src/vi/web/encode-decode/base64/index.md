---
title: Cong cu Base64 truc tuyen - Mien phi cho van ban, hinh anh va tep
description: Cong cu Base64 truc tuyen mien phi de ma hoa va giai ma van ban, hinh anh va tep. Khong can tai len may chu, xu ly ngay lap tuc, an toan va rieng tu.
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: Cong cu Base64 truc tuyen mien phi de ma hoa va giai ma van ban, hinh anh va tep. Khong can tai len may chu, xu ly ngay lap tuc, an toan va rieng tu.
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

const base64Groups = getBase64Cards('vi')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
