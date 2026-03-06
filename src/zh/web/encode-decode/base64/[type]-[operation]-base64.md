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
import Base64Tool from './components/base64.vue'
import CardGroupList from '@/components/CardGroupList.vue'
import { base64AllCards } from './base64-cards'
</script>

# {{ $params.h1 }}

<p class="page-desc">{{ $params.description }}</p>

<Base64Tool :input-type="$params.type" :operation="$params.operation" />

## {{ $params.moreTools }}

<CardGroupList :items="base64AllCards" />
