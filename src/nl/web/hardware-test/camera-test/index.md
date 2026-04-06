---
title: Cameratest - Online voorbeeld
description: Cameravoorbeeld in de browser. Toestemming vereist. Geen video-upload.
keywords: webcam,camera,hardwaretest
head:
  - - meta
    - name: description
      content: Cameravoorbeeld in de browser. Toestemming vereist. Geen video-upload.
  - - meta
    - name: keywords
      content: webcam,camera,hardwaretest
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
