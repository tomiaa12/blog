---
title: 在线音频格式转换器 - 免费批量转换 MP3、WAV、WEM 等格式
description: 免费在线音频格式转换，支持 MP3、WAV、WEM 等多种格式互转，无需安装软件，无需上传服务器，本地转换，安全私密，批量处理，极速高效。
keywords: 音频转换器,在线音频转换,MP3转换,WAV转换,WEM转换,免费音频转换,批量音频转换,在线音频格式转换,音频格式互转
head:
  - - meta
    - name: description
      content: 免费在线音频格式转换，支持 MP3、WAV、WEM 等多种格式互转，无需安装软件，无需上传服务器，本地转换，安全私密，批量处理，极速高效。
  - - meta
    - name: keywords
      content: 音频转换器,在线音频转换,MP3转换,WAV转换,WEM转换,免费音频转换,批量音频转换,在线音频格式转换,音频格式互转
  - - meta
    - property: og:title
      content: 在线音频格式转换器 - 免费批量转换 MP3、WAV、WEM 等格式
  - - meta
    - property: og:description
      content: 免费在线音频格式转换，支持 MP3、WAV、WEM 等多种格式互转，无需安装软件，无需上传服务器，本地转换，安全私密，批量处理，极速高效。
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

<script setup>
import routeConfig from './[source]-[target].paths'
import ConvertRouteList from '@/components/ConvertRouteList.vue'

const paths = routeConfig.paths()
</script>

# 在线音频格式转换器

<p class="page-desc">免费批量转换音频格式，支持 <strong>MP3</strong>、<strong>WAV</strong>、<strong>WEM</strong> 等多种格式互转，无需安装软件，本地转换，安全私密。</p>

<ConvertRouteList :paths="paths" base-path="/web/convert/audio" />
