---
title: "Test microfono - Forma d'onda online"
description: "Test gratuito nel browser: microfono e forma d'onda in tempo reale. Serve permesso (HTTPS o localhost). Audio solo locale."
keywords: "test microfono,microfono online,forma d'onda,test hardware"
head:
  - - meta
    - name: description
      content: "Test gratuito nel browser: microfono e forma d'onda in tempo reale. Serve permesso (HTTPS o localhost). Audio solo locale."
  - - meta
    - name: keywords
      content: "test microfono,microfono online,forma d'onda,test hardware"
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
