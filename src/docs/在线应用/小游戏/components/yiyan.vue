<template>
  <Text :api="hitokoto">
    <template #default="{ data }">
      <div class="left">『</div>
      <div class="word">
        {{ data.split("\n")[0] }}
      </div>
      <div class="right">』</div>
    </template>
    <template #content-after="{ data }">
      <div class="author">{{ data.split("\n")[1] }}</div>
    </template>
  </Text>
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { hitokoto } from "@/api"
</script>
<style lang="scss" scoped>
.left,
.right {
  position: absolute;
}
.left {
  left: 0;
  top: -10px;
}
.right {
  right: 0;
  bottom: -10px;
}
.word {
  text-align: center;
}
.author {
  padding-top: 20px;
  text-align: right;
  font-size: 20px;
}
</style>
