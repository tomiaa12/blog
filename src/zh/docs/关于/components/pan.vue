<template>
  <iframe :src="`https://pan.kuangyx.cn#?isDark=${data.isDark.value}`" />
</template>

<script setup lang="ts">
import { useData } from "vitepress"
const data = useData()
</script>
