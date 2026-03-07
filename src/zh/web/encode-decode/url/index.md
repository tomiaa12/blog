---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { urlGroups } from './url-cards.ts'
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
