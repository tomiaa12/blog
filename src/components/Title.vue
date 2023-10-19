<template>
  <component :is="'h' + (level || 2)" :id="title" tabindex="-1">
    {{ title }}
    <a class="header-anchor" :href="`#${title}`" :aria-label="`Permalink to '${title}'`">&#8203;</a>
  </component>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  level?: number | string
}>();
</script>