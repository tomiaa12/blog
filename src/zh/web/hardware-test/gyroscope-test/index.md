---
title: 陀螺仪测试 - 在线检测设备姿态
description: 免费在线陀螺仪测试，读取 alpha / beta / gamma 姿态角，倾斜手机即可看到画面跟随旋转，用于检查陀螺仪是否正常。
keywords: 陀螺仪测试,姿态,DeviceOrientation,alpha,beta,gamma,硬件测试
head:
  - - meta
    - name: description
      content: 免费在线陀螺仪测试，读取 alpha / beta / gamma 姿态角，倾斜手机即可看到画面跟随旋转，用于检查陀螺仪是否正常。
  - - meta
    - name: keywords
      content: 陀螺仪测试,姿态,DeviceOrientation,alpha,beta,gamma,硬件测试
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import GyroscopeTest from "./components/GyroscopeTest.vue"
</script>

<GyroscopeTest />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
