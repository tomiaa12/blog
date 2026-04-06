---
title: Тест разрешения - экран и viewport
description: Размеры окна/экрана, devicePixelRatio и др.
keywords: разрешение,viewport,devicePixelRatio,тест железа
head:
  - - meta
    - name: description
      content: Размеры окна/экрана, devicePixelRatio и др.
  - - meta
    - name: keywords
      content: разрешение,viewport,devicePixelRatio,тест железа
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import ScreenResolutionTest from '@/zh/web/hardware-test/screen-resolution-test/components/ScreenResolutionTest.vue'
</script>

<ScreenResolutionTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
