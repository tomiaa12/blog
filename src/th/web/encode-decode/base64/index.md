---
title: เครื่องมือ Base64 ออนไลน์ - ฟรีสำหรับข้อความ รูปภาพ และไฟล์
description: เครื่องมือ Base64 ออนไลน์ฟรีสำหรับเข้ารหัสและถอดรหัสข้อความ รูปภาพ และไฟล์ โดยไม่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์ ประมวลผลทันที ปลอดภัยและเป็นส่วนตัว
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: เครื่องมือ Base64 ออนไลน์ฟรีสำหรับเข้ารหัสและถอดรหัสข้อความ รูปภาพ และไฟล์ โดยไม่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์ ประมวลผลทันที ปลอดภัยและเป็นส่วนตัว
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

const base64Groups = getBase64Cards('th')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
