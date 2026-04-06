---
title: カメラテスト - オンラインでプレビュー
description: ブラウザでカメラ映像をプレビュー。カメラ権限が必要。動画はアップロードしません。
keywords: カメラテスト,ウェブカメラ,ハードウェアテスト
head:
  - - meta
    - name: description
      content: ブラウザでカメラ映像をプレビュー。カメラ権限が必要。動画はアップロードしません。
  - - meta
    - name: keywords
      content: カメラテスト,ウェブカメラ,ハードウェアテスト
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CameraTest from '@/zh/web/hardware-test/camera-test/components/CameraTest.vue'
</script>

<CameraTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
