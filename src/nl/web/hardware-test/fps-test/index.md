---
title: FPS-test
description: Geschatte FPS via requestAnimationFrame.
keywords: FPS,hardwaretest
head:
  - - meta
    - name: description
      content: Geschatte FPS via requestAnimationFrame.
  - - meta
    - name: keywords
      content: FPS,hardwaretest
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
