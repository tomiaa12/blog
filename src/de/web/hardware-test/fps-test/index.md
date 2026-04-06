---
title: FPS-Test - Framerate-Schätzung
description: Grobe FPS über requestAnimationFrame für flüssige Darstellung.
keywords: FPS,Framerate,Hardwaretest
head:
  - - meta
    - name: description
      content: Grobe FPS über requestAnimationFrame für flüssige Darstellung.
  - - meta
    - name: keywords
      content: FPS,Framerate,Hardwaretest
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
