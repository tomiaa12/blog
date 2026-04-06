---
title: FPS testi
description: requestAnimationFrame ile yaklaşık FPS.
keywords: FPS,donanım testi
head:
  - - meta
    - name: description
      content: requestAnimationFrame ile yaklaşık FPS.
  - - meta
    - name: keywords
      content: FPS,donanım testi
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
