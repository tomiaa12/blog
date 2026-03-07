---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<style lang="scss">
  @use '@/style/widescreen.scss';
</style>

<script setup>
import UrlTool from './components/url.vue'
import CardGroupList from '@/components/CardGroupList.vue'
import { urlAllCards } from './url-cards'
</script>

# {{ $params.h1 }}

<p class="page-desc">{{ $params.description }}</p>

<UrlTool :input-type="$params.type" :operation="$params.operation" />

## {{ $params.moreTools }}

<CardGroupList :items="urlAllCards" />
