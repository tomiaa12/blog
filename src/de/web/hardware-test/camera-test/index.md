---
title: Kameratest - Online-Vorschau
description: Kameravorschau im Browser. Kamerazugriff erforderlich. Kein Video-Upload.
keywords: Webcam,Kameratest,Hardwaretest
head:
  - - meta
    - name: description
      content: Kameravorschau im Browser. Kamerazugriff erforderlich. Kein Video-Upload.
  - - meta
    - name: keywords
      content: Webcam,Kameratest,Hardwaretest
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
