---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { base64Groups } from './base64-cards.ts'
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
