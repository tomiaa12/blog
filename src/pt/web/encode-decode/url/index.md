---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getUrlCards } from '@/zh/web/encode-decode/url/url-cards'

const urlGroups = getUrlCards('pt')
</script>

<CardGroupList :items="urlGroups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
