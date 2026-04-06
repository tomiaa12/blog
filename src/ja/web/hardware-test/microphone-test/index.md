---
title: マイクテスト - オンラインで音量波形を確認
description: ブラウザでマイクが使えるか確認し、音量波形をリアルタイム表示。マイク権限が必要（HTTPS または localhost）。音声は端末内のみ。
keywords: マイクテスト,マイク確認,オンラインマイク,波形,ハードウェアテスト
head:
  - - meta
    - name: description
      content: ブラウザでマイクが使えるか確認し、音量波形をリアルタイム表示。マイク権限が必要（HTTPS または localhost）。音声は端末内のみ。
  - - meta
    - name: keywords
      content: マイクテスト,マイク確認,オンラインマイク,波形,ハードウェアテスト
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
