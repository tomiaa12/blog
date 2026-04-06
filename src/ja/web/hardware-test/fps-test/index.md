---
title: FPSテスト - フレームレートの目安
description: requestAnimationFrame からおおよその FPS を表示し、表示の滑らかさを確認。
keywords: FPS,フレームレート,リフレッシュ,ハードウェアテスト
head:
  - - meta
    - name: description
      content: requestAnimationFrame からおおよその FPS を表示し、表示の滑らかさを確認。
  - - meta
    - name: keywords
      content: FPS,フレームレート,リフレッシュ,ハードウェアテスト
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
