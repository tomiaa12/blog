---
title: FPS-test
description: Ungefärlig FPS via requestAnimationFrame.
keywords: FPS,hårdvarutest
head:
  - - meta
    - name: description
      content: Ungefärlig FPS via requestAnimationFrame.
  - - meta
    - name: keywords
      content: FPS,hårdvarutest
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
