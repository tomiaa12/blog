---
title: Microphone Test - Online Mic Check & Waveform
description: "Free online microphone test in your browser: check if the mic works, see a live volume waveform. Requires microphone permission; use HTTPS or localhost. Audio stays on your device."
keywords: microphone test,mic test,online microphone,waveform,hardware test
head:
  - - meta
    - name: description
      content: "Free online microphone test in your browser: check if the mic works, see a live volume waveform. Requires microphone permission; use HTTPS or localhost. Audio stays on your device."
  - - meta
    - name: keywords
      content: microphone test,mic test,online microphone,waveform,hardware test
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
