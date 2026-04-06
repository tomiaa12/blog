---
title: Test FPS
description: Szacunkowe FPS przez requestAnimationFrame.
keywords: FPS,test sprzętu
head:
  - - meta
    - name: description
      content: Szacunkowe FPS przez requestAnimationFrame.
  - - meta
    - name: keywords
      content: FPS,test sprzętu
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import FpsTest from '@/zh/web/hardware-test/fps-test/components/FpsTest.vue'
</script>

<FpsTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
