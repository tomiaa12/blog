---
title: 마이크 테스트 - 온라인 음량 파형 확인
description: 브라우저에서 마이크 동작과 실시간 음량 파형을 확인합니다. 마이크 권한 필요(HTTPS 또는 localhost). 오디오는 기기 내에서만 처리됩니다.
keywords: 마이크 테스트,온라인 마이크,파형,하드웨어 테스트
head:
  - - meta
    - name: description
      content: 브라우저에서 마이크 동작과 실시간 음량 파형을 확인합니다. 마이크 권한 필요(HTTPS 또는 localhost). 오디오는 기기 내에서만 처리됩니다.
  - - meta
    - name: keywords
      content: 마이크 테스트,온라인 마이크,파형,하드웨어 테스트
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import MicrophoneTest from '@/zh/web/hardware-test/microphone-test/components/MicrophoneTest.vue'
</script>

<MicrophoneTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
