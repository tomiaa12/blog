<template>
  <div>
    <canvas
      id="canvas"
      width="800"
      height="800"
      style="border: 2px solid #ccc"
    ></canvas>
    <div class="control">
      <el-button @click="bind">绑定事件</el-button>
      <el-button @click="remove">解除事件</el-button>
      <el-button
        style="margin-right: 1em"
        @click="clear"
        >清空画布</el-button
      >
      <el-color-picker
        v-model="color"
        show-alpha
        @change="colorChange"
      />
      <el-slider
        v-model="size"
        :max="10"
        @change="sizeChange"
      />
      <el-select v-model="tool">
        <el-option
          v-for="item in toolOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { CanvasGraffiti } from "@tomiaa/library/src"

let canvasGraffiti: CanvasGraffiti
const color = ref("rgba(255, 69, 0, 1)")
const size = ref(3)
const tool = ref("Marker")

onMounted(() => {
  canvasGraffiti = new CanvasGraffiti({
    el: "#canvas",
  })
  colorChange()
  sizeChange()
})

const bind = () => canvasGraffiti.bindCanvasEventListener()

const remove = () => canvasGraffiti.removeEventListener()

const clear = () => canvasGraffiti.clear()

const colorChange = () => (canvasGraffiti.color = color.value)

const sizeChange = () => (canvasGraffiti.lineWidth = size.value)

const toolOptions = [
  {
    label: "记号笔",
    value: "Marker",
  },
]
</script>

<style lang="scss" scoped>
.control {
  display: flex;
  :deep(.el-slider) {
    max-width: 300px;
    padding: 0 1em;
  }
}
</style>
