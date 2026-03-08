---
title: เครื่องมือ URL ออนไลน์ - ฟรีสำหรับเข้ารหัส ถอดรหัส วิเคราะห์ และสร้าง Query
description: เครื่องมือ URL ออนไลน์ฟรี รองรับการเข้ารหัส URL ถอดรหัส URL วิเคราะห์พารามิเตอร์ Query และสร้าง Query string เหมาะสำหรับจัดการลิงก์ ดีบักพารามิเตอร์ และพัฒนา API
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: เครื่องมือ URL ออนไลน์ฟรี รองรับการเข้ารหัส URL ถอดรหัส URL วิเคราะห์พารามิเตอร์ Query และสร้าง Query string เหมาะสำหรับจัดการลิงก์ ดีบักพารามิเตอร์ และพัฒนา API
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

const urlGroups = getUrlCards('th')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
