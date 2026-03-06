---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<script setup>
import CardGroupList from '@/components/CardGroupList.vue'
import { getBase64Cards } from '@/zh/web/encode-decode/base64/base64-cards'

const base64Groups = getBase64Cards('sv')
</script>

<CardGroupList :items="base64Groups" />

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>
