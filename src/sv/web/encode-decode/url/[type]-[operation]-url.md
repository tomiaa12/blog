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
import UrlTool from '@/zh/web/encode-decode/url/components/url.vue'
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'
import { useData } from 'vitepress'

const { page } = useData()
const lang = page.value.relativePath.split('/')[0]
const allCards = [{ children: getUrlCards(lang).flatMap(g => g.children) }]
</script>

# {{ $params.h1 }}

<p class="page-desc">{{ $params.description }}</p>

<UrlTool :input-type="$params.type" :operation="$params.operation" />

## {{ $params.moreTools }}

<CardGroupList :items="allCards" />
