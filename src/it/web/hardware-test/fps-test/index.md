---
title: Test FPS
description: FPS approssimativo con requestAnimationFrame.
keywords: FPS,test hardware
head:
  - - meta
    - name: description
      content: FPS approssimativo con requestAnimationFrame.
  - - meta
    - name: keywords
      content: FPS,test hardware
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
