<template>
  <main>
    <div class="welcome">
      <h1>ChatGPT</h1>
      <el-button
        text
        bg
      >
        "猜奥特曼" →
      </el-button>
    </div>

    <div class="input-container">
      <el-input
        v-model="text"
        placeholder="发送一个消息"
      ></el-input>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { ref } from "vue"
// const props = defineProps({})
const emits = defineEmits([])

const text = ref()
</script>
<style lang="scss" scoped>
main {
  position: relative;
  flex: 1;
}
.input-container {
  width: 100%;
  position: absolute;
  bottom: 50px;
  max-width: 720px;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
}
.welcome {
  margin: 70px auto 0;
  max-width: 720px;
  h1 {
    text-align: center;
  }
  .el-button {
    --el-button-text-color: var(--el-text-color-primary);
    font-size: 20px;
    padding: 1em;
  }
}
</style>
