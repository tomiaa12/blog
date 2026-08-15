---
title: AES 加解密 - AES-GCM / AES-CBC
description: 免费在线 AES 加密与解密，支持 AES-GCM、AES-CBC，可用口令派生密钥。加解密都在浏览器本地完成，明文和密钥不会上传。
keywords: AES加密,AES解密,AES-GCM,AES-CBC,在线AES,对称加密
head:
  - - meta
    - name: description
      content: 免费在线 AES 加密与解密，支持 AES-GCM、AES-CBC，可用口令派生密钥。加解密都在浏览器本地完成，明文和密钥不会上传。
  - - meta
    - name: keywords
      content: AES加密,AES解密,AES-GCM,AES-CBC,在线AES,对称加密
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import AesCrypto from "./components/AesCrypto.vue"
</script>

<AesCrypto />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
