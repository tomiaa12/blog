---
title: Тест FPS - оценка частоты кадров
description: Приблизительный FPS через requestAnimationFrame.
keywords: FPS,частота кадров,тест железа
head:
  - - meta
    - name: description
      content: Приблизительный FPS через requestAnimationFrame.
  - - meta
    - name: keywords
      content: FPS,частота кадров,тест железа
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
