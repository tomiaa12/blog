---
title: Test mikrofonu - fala online
description: Darmowy test mikrofonu w przeglądarce z falą głośności. Wymaga zezwolenia (HTTPS lub localhost). Dźwięk pozostaje lokalnie.
keywords: test mikrofonu,mikrofon online,fala,test sprzętu
head:
  - - meta
    - name: description
      content: Darmowy test mikrofonu w przeglądarce z falą głośności. Wymaga zezwolenia (HTTPS lub localhost). Dźwięk pozostaje lokalnie.
  - - meta
    - name: keywords
      content: test mikrofonu,mikrofon online,fala,test sprzętu
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
