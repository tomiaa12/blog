<template>
  <div class="content">
    <div ref="hitokotoContentRef"></div>
  </div>
  <el-button @click="refresh">刷新一言</el-button>
  <el-button @click="like">喜欢</el-button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Hitokoto } from "@tomiaa/hitokoto"

const hitokotoContentRef = ref()

let hitokoto: Hitokoto

onMounted(() => {
  hitokoto = new Hitokoto({
    el: hitokotoContentRef.value,
  })
})

const refresh = () => hitokoto.getData()
const like = () => hitokoto.like()
</script>
<style lang="scss" scoped>
// ref="hitokotoContentRef" 会 position: absolute;
.content {
  position: relative;
  height: 200px;
}
</style>
