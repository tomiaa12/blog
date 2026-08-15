---
title: 加速度計テスト - モーション
description: "X/Y/Z 加速度と重力を表示。傾けると玉が動きます。"
keywords: 加速度計,重力,ハードウェアテスト
head:
  - - meta
    - name: description
      content: "X/Y/Z 加速度と重力を表示。傾けると玉が動きます。"
  - - meta
    - name: keywords
      content: 加速度計,重力,ハードウェアテスト
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import AccelerometerTest from '@/zh/web/hardware-test/accelerometer-test/components/AccelerometerTest.vue'
</script>

<AccelerometerTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
