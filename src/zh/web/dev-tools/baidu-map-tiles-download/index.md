---
title: 百度地图瓦片下载 - 在线框选下载矢量瓦片
description: 在地图上框选范围，按缩放级别批量下载百度地图矢量瓦片（.png），打包为 zip，便于离线部署或学习研究（请遵守百度地图服务条款）。
keywords: 百度地图,瓦片下载,离线地图,OpenLayers,JSZip,矢量瓦片
head:
  - - meta
    - name: description
      content: 在地图上框选范围，按缩放级别批量下载百度地图矢量瓦片（.png），打包为 zip，便于离线部署或学习研究（请遵守百度地图服务条款）。
  - - meta
    - name: keywords
      content: 百度地图,瓦片下载,离线地图,OpenLayers,JSZip,矢量瓦片
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import BaiduMapTilesDownload from "./components/BaiduMapTilesDownload.vue"
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# 百度地图瓦片下载

<ClientOnly>
  <BaiduMapTilesDownload />
</ClientOnly>
