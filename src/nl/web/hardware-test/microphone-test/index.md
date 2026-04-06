---
title: Microfoontest - Online golfvorm
description: Gratis microfoontest in de browser met live golfvorm. Microfoontoestemming nodig (HTTPS of localhost). Audio blijft lokaal.
keywords: microfoontest,online microfoon,golfvorm,hardwaretest
head:
  - - meta
    - name: description
      content: Gratis microfoontest in de browser met live golfvorm. Microfoontoestemming nodig (HTTPS of localhost). Audio blijft lokaal.
  - - meta
    - name: keywords
      content: microfoontest,online microfoon,golfvorm,hardwaretest
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
