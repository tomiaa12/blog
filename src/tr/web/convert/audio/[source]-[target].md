---
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
import { useData } from 'vitepress'
import Convert from '@/zh/web/convert/audio/Convert/index.vue'

const { params } = useData()
</script>

# {{ $params.sourceLabel }} to {{ $params.targetLabel }} Dönüştürücü

<p class="page-desc"><strong>{{ $params.sourceLabel }}</strong> dosyalarını <strong>{{ $params.targetLabel }}</strong> formatına ücretsiz çevrimiçi toplu dönüştürme, yazılım kurulumu gerekmez, güvenli ve hızlı</p>

<Convert/>

### {{ $params.sourceLabel }} Formatı Hakkında

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} Formatı Hakkında

{{ $params.targetDesc }}
