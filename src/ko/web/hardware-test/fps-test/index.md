---
title: FPS 테스트 - 프레임레이트 추정
description: requestAnimationFrame 기반 대략적인 FPS로 부드러움을 확인합니다.
keywords: FPS,프레임레이트,하드웨어 테스트
head:
  - - meta
    - name: description
      content: requestAnimationFrame 기반 대략적인 FPS로 부드러움을 확인합니다.
  - - meta
    - name: keywords
      content: FPS,프레임레이트,하드웨어 테스트
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
