<script setup lang="ts">
import { withBase, useData } from "vitepress"

defineProps<{
  src: string
  href?: string
}>()
</script>

<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noreferrer"
  >
    <img
      v-bind="$attrs"
      v-if="src"
      :src="withBase(src)"
      loading="lazy"
    />
  </a>
  <img
    v-bind="$attrs"
    v-else-if="src"
    :src="withBase(src)"
    loading="lazy"
  />
</template>

<style scoped>
img {
  display: inline-block;
  margin-right: 0.5em;
  transition: 0.3s;
}

a {

  &::after {
    display: none !important;
  }
  &:hover {
    img {
      transform: scale(1.05);
    }
  }
}
</style>
