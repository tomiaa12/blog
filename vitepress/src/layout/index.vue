<template>
  <defaultLayout :class="getCurClass">
    <template #doc-after>
      <Comment v-if="route.path !== '/'" />
    </template>
  </defaultLayout>
  <Comment
    v-if="route.path === '/'"
    class="home-comment"
  />
  <Live2D />
</template>

<script setup lang="ts">
import defaultLayout from "vitepress/dist/client/theme-default/Layout.vue"
import { useRoute, useData } from "vitepress"
import { computed } from "vue"
import Comment from "./Comment.vue"
import Live2D from "./Live2d.vue"
const route = useRoute()

const data = useData()

const getCurClass = computed(() => data.frontmatter.value.class)
</script>
<style lang="scss" scoped>
.home-comment {
  padding: 2em;
}
.el-backtop {
  z-index: 2001;
}
</style>
