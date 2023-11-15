<template>
  <el-image
    ref="imgRef"
    fit="cover"
    @load="setZoom"
  >
    <template #placeholder>
      <div class="image-slot">
        <p>图片加载中...</p>
      </div>
    </template>
    <template #error>
      <div class="image-slot">
        <p>图片加载失败...</p>
      </div>
    </template>
  </el-image>
</template>

<script setup lang="ts">
import mediumZoom from "medium-zoom"
import { nextTick, ref, withDefaults } from "vue"

const props = withDefaults(
  defineProps<{
    zoom: boolean
  }>(),
  { zoom: true }
)

const imgRef = ref()
const setZoom = async () => {
  if (!props.zoom) return
  await nextTick()
  const zoom = mediumZoom(imgRef.value.$el.children[0])
  zoom.update({ background: "var(--el-color-info-light-9)" })
}
</script>
<style lang="scss" scoped>
.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: inherit;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>
