<template>
  <div>
    <p class="transform-title">{{ sourceLabel }} -> {{ targetLabel }}</p>

    <div class="space">
      <div :class="panelClass">
        <p>{{ uiCopy.inputLabel }}</p>
        <el-input
          v-model="coord[0]"
          placeholder="x"
          clearable
        />
        <el-input
          v-model="coord[1]"
          placeholder="y"
          clearable
        />
      </div>

      <div :class="panelClass">
        <p>{{ uiCopy.outputLabel }}</p>
        <el-input
          :model-value="result[0]"
          placeholder="x"
          readonly
        />
        <el-input
          :model-value="result[1]"
          placeholder="y"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import * as coordinateTransform from "@tomiaa/coordinate-transform"
import { isMobile } from "@/utils"
import {
  getMapCoordinateUiCopy,
  type LangCode,
  type TransformKey,
} from "../[source]-[target].paths"

const props = defineProps<{
  lang: LangCode
  transformKey: TransformKey
  sourceLabel: string
  targetLabel: string
}>()

type TransformFn = (coord: [number, number]) => [number, number]

const coord = ref<string[]>(["", ""])
const result = ref<string[]>(["", ""])

const panelClass = computed(() => (isMobile.value ? "w100" : "w50"))
const uiCopy = computed(() => getMapCoordinateUiCopy(props.lang))

function formatValue(value: number): string {
  return Number.isFinite(value) ? String(value) : ""
}

watch(
  [coord, () => props.transformKey],
  () => {
    const x = Number(coord.value[0])
    const y = Number(coord.value[1])

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      result.value = ["", ""]
      return
    }

    const transform = (coordinateTransform as Record<string, TransformFn>)[
      props.transformKey
    ]
    const [nextX, nextY] = transform([x, y])
    result.value = [formatValue(nextX), formatValue(nextY)]
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.transform-title {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
}

.w50 {
  width: 50%;
  padding: 1em;
}

.w100 {
  width: 100%;
}

.space {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.el-input {
  margin-bottom: 1em;
}
</style>
