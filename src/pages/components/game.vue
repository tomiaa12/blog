<template>
  <div class="game">
    <el-check-tag
      :checked="!curCategory"
      size="large"
      @click="curCategory = ''"
    >
      全部游戏
    </el-check-tag>
    <el-check-tag
      v-for="i of categorys"
      :checked="curCategory === i.id"
      size="large"
      @click="curCategory = i.id"
    >
      {{ i.name }}
    </el-check-tag>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { ref } from "vue"
import { NesVue } from "nes-vue"
import { categorys, roms } from "./game"

console.log(roms)
const curCategory = ref("")

const BASE_URL = "https://tomiaa12.github.io/nesRoms"
</script>
<style lang="scss">
.game {
  h1 {
    display: none;
  }
  .el-check-tag {
    margin: 0 1em 1em 0;
    cursor: pointer;
  }
}
</style>
