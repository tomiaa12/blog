---
title: FPS 测试 - 在线帧率检测
description: 免费在线 FPS 测试，基于 requestAnimationFrame 估算页面动画帧率，用于粗略观察显示刷新是否流畅。
keywords: FPS测试,帧率,刷新率,硬件测试
head:
  - - meta
    - name: description
      content: 免费在线 FPS 测试，基于 requestAnimationFrame 估算页面动画帧率，用于粗略观察显示刷新是否流畅。
  - - meta
    - name: keywords
      content: FPS测试,帧率,刷新率,硬件测试
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import FpsTest from "./components/FpsTest.vue"
</script>

<FpsTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
