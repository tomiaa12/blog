---
title: Conversor de áudio online - Conversão em lote gratuita MP3, WAV, WEM
description: Converta áudio MP3, WAV, WEM e mais formatos online gratuitamente. Sem software, sem upload para servidor, conversão local, seguro e privado, processamento em lote, ultrarrápido.
keywords: conversor de áudio,conversão de áudio online,converter MP3,converter WAV,converter WEM,conversão de áudio gratuita,conversão de áudio em lote
head:
  - - meta
    - name: description
      content: Converta áudio MP3, WAV, WEM e mais formatos online gratuitamente. Sem software, sem upload para servidor, conversão local, seguro e privado, processamento em lote, ultrarrápido.
  - - meta
    - name: keywords
      content: conversor de áudio,conversão de áudio online,converter MP3,converter WAV,converter WEM,conversão de áudio gratuita,conversão de áudio em lote
  - - meta
    - property: og:title
      content: Conversor de áudio online - Conversão em lote gratuita MP3, WAV, WEM
  - - meta
    - property: og:description
      content: Converta áudio MP3, WAV, WEM e mais formatos online gratuitamente. Sem software, sem upload para servidor, conversão local, seguro e privado, processamento em lote, ultrarrápido.
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

# Conversor de áudio online

<p class="page-desc">Conversão em lote gratuita de formatos de áudio. Suporta <strong>MP3</strong>, <strong>WAV</strong>, <strong>WEM</strong> e mais. Sem software, conversão local, seguro e privado.</p>

<ConvertRouteList :paths="paths" base-path="/web/convert/audio" />
