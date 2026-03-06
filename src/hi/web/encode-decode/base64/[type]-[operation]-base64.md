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
import Base64Tool from '@/zh/web/encode-decode/base64/components/base64.vue'
import CardGroupList from '@/components/CardGroupList.vue'
import { getBase64Cards } from '@/zh/web/encode-decode/base64/base64-cards'
import { useData } from 'vitepress'

const { page } = useData()
const lang = page.value.relativePath.split('/')[0]
const allCards = [{ children: getBase64Cards(lang).flatMap(g => g.children) }]
</script>

# {{ $params.h1 }}

<p class="page-desc">{{ $params.description }}</p>

<Base64Tool :input-type="$params.type" :operation="$params.operation" />

## {{ $params.moreTools }}

<CardGroupList :items="allCards" />