---
title: 屏幕分辨率测试 - 在线查看屏幕与视口参数
description: 免费在线屏幕分辨率测试，显示 screen 与 window 相关尺寸、devicePixelRatio 等，便于核对显示参数。
keywords: 屏幕分辨率,viewport,devicePixelRatio,硬件测试
head:
  - - meta
    - name: description
      content: 免费在线屏幕分辨率测试，显示 screen 与 window 相关尺寸、devicePixelRatio 等，便于核对显示参数。
  - - meta
    - name: keywords
      content: 屏幕分辨率,viewport,devicePixelRatio,硬件测试
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import ScreenResolutionTest from "./components/ScreenResolutionTest.vue"
</script>

<ScreenResolutionTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
