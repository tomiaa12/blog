---
title: 百度地圖瓦片下載 - 線上框選下載
description: 在地圖上框選範圍，依縮放級別批次下載百度地圖矢量瓦片為 ZIP。請遵守百度地圖服務條款。
keywords: 百度地圖,瓦片下載,離線地圖,OpenLayers,JSZip
head:
  - - meta
    - name: description
      content: 在地圖上框選範圍，依縮放級別批次下載百度地圖矢量瓦片為 ZIP。請遵守百度地圖服務條款。
  - - meta
    - name: keywords
      content: 百度地圖,瓦片下載,離線地圖,OpenLayers,JSZip
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import BaiduMapTilesDownload from '@/zh/web/dev-tools/baidu-map-tiles-download/components/BaiduMapTilesDownload.vue'
</script>

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

# 百度地圖瓦片下載

<ClientOnly>
  <BaiduMapTilesDownload />
</ClientOnly>

