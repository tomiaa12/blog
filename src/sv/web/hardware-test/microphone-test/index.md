---
title: Mikrofontest - Vågform online
description: Gratis mikrofontest i webbläsaren med live volymvåg. Kräver tillstånd (HTTPS eller localhost). Ljudet stannar lokalt.
keywords: mikrofontest,online mikrofon,vågform,hårdvarutest
head:
  - - meta
    - name: description
      content: Gratis mikrofontest i webbläsaren med live volymvåg. Kräver tillstånd (HTTPS eller localhost). Ljudet stannar lokalt.
  - - meta
    - name: keywords
      content: mikrofontest,online mikrofon,vågform,hårdvarutest
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
