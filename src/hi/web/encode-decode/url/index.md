---
title: ऑनलाइन URL टूल - मुफ्त URL एन्कोड, डिकोड, Query पार्स और जनरेट
description: मुफ्त ऑनलाइन URL टूल जो URL एन्कोडिंग, URL डीकोडिंग, Query पैरामीटर पार्सिंग और Query निर्माण को सपोर्ट करता है। लिंक प्रोसेसिंग, पैरामीटर डिबगिंग और API डेवलपमेंट के लिए उपयुक्त।
keywords: url encode decode,url encoder,url decoder,query parser,query builder,url tool,online url tool
head:
  - - meta
    - name: description
      content: मुफ्त ऑनलाइन URL टूल जो URL एन्कोडिंग, URL डीकोडिंग, Query पैरामीटर पार्सिंग और Query निर्माण को सपोर्ट करता है। लिंक प्रोसेसिंग, पैरामीटर डिबगिंग और API डेवलपमेंट के लिए उपयुक्त।
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

const urlGroups = getUrlCards('hi')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
