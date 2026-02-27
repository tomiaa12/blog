---
title: Online audioformaatconverter - Gratis batchconversie MP3, WAV, WEM
description: Converteer gratis audioformaten MP3, WAV, WEM en meer online. Geen software, geen serverupload, lokale conversie, veilig en privé, batchverwerking, ultranel.
keywords: audioconverter,online audioconversie,MP3 converteren,WAV converteren,WEM converteren,gratis audioconversie,batch audioconversie
head:
  - - meta
    - name: description
      content: Converteer gratis audioformaten MP3, WAV, WEM en meer online. Geen software, geen serverupload, lokale conversie, veilig en privé, batchverwerking, ultranel.
  - - meta
    - name: keywords
      content: audioconverter,online audioconversie,MP3 converteren,WAV converteren,WEM converteren,gratis audioconversie,batch audioconversie
  - - meta
    - property: og:title
      content: Online audioformaatconverter - Gratis batchconversie MP3, WAV, WEM
  - - meta
    - property: og:description
      content: Converteer gratis audioformaten MP3, WAV, WEM en meer online. Geen software, geen serverupload, lokale conversie, veilig en privé, batchverwerking, ultranel.
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

# Online audioformaatconverter

<p class="page-desc">Gratis batchconversie van audioformaten. Ondersteunt <strong>MP3</strong>, <strong>WAV</strong>, <strong>WEM</strong> en meer. Geen software, lokale conversie, veilig en privé.</p>

<ConvertRouteList :paths="paths" base-path="/web/convert/audio" />
