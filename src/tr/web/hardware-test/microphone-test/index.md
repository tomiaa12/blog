---
title: Mikrofon testi - Çevrimiçi dalga formu
description: Tarayıcıda ücretsiz mikrofon testi ve canlı ses dalgası. İzin gerekir (HTTPS veya localhost). Ses yerel kalır.
keywords: mikrofon testi,online mikrofon,dalga,donanım testi
head:
  - - meta
    - name: description
      content: Tarayıcıda ücretsiz mikrofon testi ve canlı ses dalgası. İzin gerekir (HTTPS veya localhost). Ses yerel kalır.
  - - meta
    - name: keywords
      content: mikrofon testi,online mikrofon,dalga,donanım testi
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import MicrophoneTest from '@/zh/web/hardware-test/microphone-test/components/MicrophoneTest.vue'
</script>

<MicrophoneTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
