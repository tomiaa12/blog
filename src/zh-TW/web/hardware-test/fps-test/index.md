---
title: FPS 測試 - 線上幀率檢測
description: 免費線上 FPS 測試，以 requestAnimationFrame 估算頁面動畫幀率，用於粗略觀察顯示重新整理是否流暢。
keywords: FPS測試,幀率,重新整理率,硬體測試
head:
  - - meta
    - name: description
      content: 免費線上 FPS 測試，以 requestAnimationFrame 估算頁面動畫幀率，用於粗略觀察顯示重新整理是否流暢。
  - - meta
    - name: keywords
      content: FPS測試,幀率,重新整理率,硬體測試
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
