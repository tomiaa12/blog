<template>
  <InlineImg
    :src="`https://img.shields.io/github/stars/${username}/${repository}?style=social`"
    :href="`https://github.com/${username}/${repository}`"
    v-if="list.includes('stars') && !exclude.includes('stars')"
  />

  <InlineImg
    :src="`https://img.shields.io/github/release/${username}/${repository}`"
    :href="`https://github.com/${username}/${repository}/releases`"
    v-if="list.includes('release') && !exclude.includes('release')"
  />

  <InlineImg
    :src="`https://img.shields.io/github/issues/${username}/${repository}`"
    :href="`https://github.com/${username}/${repository}/issues`"
    v-if="list.includes('issues') && !exclude.includes('issues')"
  />

  <InlineImg
    :src="`https://img.shields.io/github/license/${username}/${repository}`"
    v-if="list.includes('license') && !exclude.includes('license')"
  />
</template>

<script setup lang="ts">
import InlineImg from "./InlineImg.vue"
withDefaults(defineProps<{
  username: string
  repository: string
  list?: ("stars" | "release" | "issues" | "license")[]
  exclude?: string[]
}>(), {
  list: () => ["stars", "release", "issues", "license"],
  exclude: () => []
})


</script>
<style lang="scss" scoped></style>
