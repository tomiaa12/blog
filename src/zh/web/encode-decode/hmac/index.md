---
title: HMAC 生成器 - SHA256 / SHA1 / SHA512
description: 免费在线生成 HMAC 签名，支持 SHA-1、SHA-256、SHA-384、SHA-512。用浏览器 Web Crypto 在本地计算，密钥和原文不会上传。
keywords: HMAC,HMAC-SHA256,HMAC生成器,消息认证码,在线HMAC,SHA256签名
head:
  - - meta
    - name: description
      content: 免费在线生成 HMAC 签名，支持 SHA-1、SHA-256、SHA-384、SHA-512。用浏览器 Web Crypto 在本地计算，密钥和原文不会上传。
  - - meta
    - name: keywords
      content: HMAC,HMAC-SHA256,HMAC生成器,消息认证码,在线HMAC,SHA256签名
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import HmacGenerator from "./components/HmacGenerator.vue"
</script>

<HmacGenerator />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
