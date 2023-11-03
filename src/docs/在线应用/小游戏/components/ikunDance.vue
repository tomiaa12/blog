<template>
  <div class="container">
    <div
      class="stage"
      ref="ikunDanceRef"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import IKun from "./ikunDance/ikun"

const props = withDefaults(
  defineProps<{
    volume?: number
  }>(),
  {
    volume: 50,
  }
)

const ikunDanceRef = ref()

let ikun: IKun
onMounted(() => {
  ikun = new IKun({
    container: ikunDanceRef.value,
    muted:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    volume: props.volume,
  })

  ikun.run()
})
watch(
  () => props.volume,
  () => {
    ikun.volume = props.volume
  }
)
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
}

.stage {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
