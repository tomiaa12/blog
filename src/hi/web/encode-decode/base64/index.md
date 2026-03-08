---
title: ऑनलाइन Base64 टूल - मुफ्त टेक्स्ट, इमेज और फाइल Base64 कन्वर्टर
description: टेक्स्ट, इमेज और फाइल के लिए मुफ्त ऑनलाइन Base64 एन्कोड/डीकोड टूल। सर्वर पर अपलोड नहीं, तुरंत प्रोसेसिंग, सुरक्षित और निजी।
keywords: base64 encode decode,base64 encoder,base64 decoder,text to base64,image to base64,file to base64,online base64 tool
head:
  - - meta
    - name: description
      content: टेक्स्ट, इमेज और फाइल के लिए मुफ्त ऑनलाइन Base64 एन्कोड/डीकोड टूल। सर्वर पर अपलोड नहीं, तुरंत प्रोसेसिंग, सुरक्षित और निजी।
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

const base64Groups = getBase64Cards('hi')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
