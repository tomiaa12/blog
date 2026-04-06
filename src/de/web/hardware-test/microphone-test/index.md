---
title: Mikrofontest - Online mit Wellenform
description: Kostenloser Mikrofontest im Browser mit Live-Wellenform. Mikrofonberechtigung nötig (HTTPS oder localhost). Audio bleibt lokal.
keywords: Mikrofontest,Online Mikrofon,Wellenform,Hardwaretest
head:
  - - meta
    - name: description
      content: Kostenloser Mikrofontest im Browser mit Live-Wellenform. Mikrofonberechtigung nötig (HTTPS oder localhost). Audio bleibt lokal.
  - - meta
    - name: keywords
      content: Mikrofontest,Online Mikrofon,Wellenform,Hardwaretest
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
