<template>
  <el-space
    wrap
    size="small"
  >
    <el-button @click="bind">绑定事件</el-button>
    <el-button @click="remove">解除事件</el-button>

    <el-button @click="clear">清空画布</el-button>

    <el-button @click="toDataURL">获取base64数据</el-button>

    <el-button @click="toPicFile">获取img图片文件</el-button>

    <el-button @click="erase"> 橡皮擦 </el-button>

    <div>
      颜色：
      <el-color-picker
        v-model="color"
        show-alpha
        @change="colorChange"
      />
    </div>
    <div style="min-width: 200px; display: flex">
      <span style="white-space: nowrap">线宽：</span>
      <el-slider
        v-model="size"
        :min="1"
        :max="6"
        @change="sizeChange"
      />
    </div>

    <el-select
      v-model="tool"
      @change="toolChange"
    >
      <el-option
        v-for="item in CanvasGraffiti.toolList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="allowType"
      multiple
      style="min-width: 230px"
      @change="allowTypeChange"
    >
      <el-option
        v-for="item in CanvasGraffiti.allowTypes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-space>

  <canvas
    id="canvas"
    height="600"
    style="border: 2px solid #ccc"
  ></canvas>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { CanvasGraffiti, ToolType, AllowType } from "@tomiaa/canvas-graffiti"

let canvasGraffiti: CanvasGraffiti

const color = ref("#42b883")
const size = ref(3)
const tool = ref<ToolType>("Marker")
const allowType = ref<AllowType[]>(["mouse", "pen", "touch"])

onMounted(() => {
  canvasGraffiti = new CanvasGraffiti({
    el: "#canvas",
  })
  canvasGraffiti.ctx.canvas.width = canvasGraffiti.ctx.canvas.offsetWidth
  colorChange()
  sizeChange()
})

const bind = () => canvasGraffiti.bindCanvasEventListener()

const remove = () => canvasGraffiti.removeEventListener()

const clear = () => canvasGraffiti.clear()

const colorChange = () => (canvasGraffiti.color = color.value)

const sizeChange = () => (canvasGraffiti.lineWidth = size.value)

const toolChange = () => (canvasGraffiti.currentTool = tool.value)

const erase = () => {
  tool.value = "" as any
  canvasGraffiti.currentTool = "Erase"
}

const allowTypeChange = () => (canvasGraffiti.allowType = allowType.value)

const toPicFile = async () => {
  const file = await canvasGraffiti.toPicFile()
  console.log(file)
}
const toDataURL = () => {
  console.log(canvasGraffiti.toDataURL())
}
</script>

<style lang="scss" scoped>
:deep(.el-col) {
  margin-bottom: 0.8em;
}
canvas {
  width: 100%;
}
</style>
