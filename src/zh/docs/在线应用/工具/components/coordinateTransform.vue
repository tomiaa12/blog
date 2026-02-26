<template>
  <div>
    <el-select
      v-model="fun"
      filterable
      :class="w50"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="space">
      <div :class="w50">
        <p>输入坐标</p>
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
      <div :class="w50">
        <p>输出坐标</p>
        <el-input
          v-model="rest[0]"
          placeholder="x"
          clearable
        />
        <el-input
          v-model="rest[1]"
          placeholder="y"
          clearable
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { computed, ref, watch } from "vue"
import * as coordinateTransform from "@tomiaa/coordinate-transform"
import { isMobile } from "@/utils"

const coord = ref([])
const rest = ref([])
const fun = ref("mercator2WSG84")
const options = [
  {
    label: "墨卡托坐标（EPSG:3857）=> 地球坐标（EPSG:4326）",
    value: "mercator2WSG84",
  },
  {
    label: "地球坐标（EPSG:4326）=> 墨卡托坐标（EPSG:3857）",
    value: "WSG842Mercator",
  },
  {
    label: "墨卡托坐标（EPSG:3857）=> 天地图（EPSG:4490）",
    value: "mercator2CGCS2000",
  },
  {
    label: "地球坐标（EPSG:4326）=> 天地图（EPSG:4490）",
    value: "WSG842CGCS2000",
  },
  {
    label: "天地图（EPSG:4490）=> 墨卡托坐标（EPSG:3857）",
    value: "CGCS20002Mercator",
  },
  {
    label: "天地图（EPSG:4490）=> 地球坐标（EPSG:4326）",
    value: "CGCS20002WSG84",
  },
  {
    label: "火星坐标（GCJ02）=> 地球坐标（EPSG:4326）",
    value: "GCJ022WSG84",
  },
  {
    label: "地球坐标（EPSG:4326）=> 火星坐标（GCJ02）",
    value: "WSG842GCJ02",
  },
  {
    label: "墨卡托坐标（EPSG:3857）=> 火星坐标（GCJ02）",
    value: "mercator2GCJ02",
  },
  {
    label: "火星坐标（GCJ02）=> 墨卡托坐标（EPSG:3857）",
    value: "GCJ022Mercator",
  },
  {
    label: "墨卡托坐标（EPSG:3857）=> 百度墨卡托（baiduMercator）",
    value: "mercator2BaiduMercator",
  },
  {
    label: "百度墨卡托（baiduMercator）=> 墨卡托坐标（EPSG:3857）",
    value: "baiduMercator2Mercator",
  },
  {
    label: "地球坐标（EPSG:4326）=> 百度墨卡托（baiduMercator）",
    value: "WSG842BaiduMercator",
  },
  {
    label: "百度墨卡托（baiduMercator）=> 地球坐标（EPSG:4326）",
    value: "baiduMercator2WSG84",
  },
  {
    label: "地球坐标 => 百度坐标（BD:09）",
    value: "WSG842BD09",
  },
  {
    label: "百度坐标（BD:09）=> 地球坐标",
    value: "BD092WSG84",
  },
  {
    label: "百度坐标（BD:09）=> 墨卡托坐标（EPSG:3857）",
    value: "BD092Mercator",
  },
  {
    label: "百度坐标（BD:09）=> 墨卡托坐标（EPSG:3857）",
    value: "mercator2BD09",
  },
  {
    label: "百度墨卡托（baiduMercator）=> 百度坐标（BD:09）",
    value: "baiduMercator2BD09",
  },
  {
    label: "百度坐标（BD:09）=> 百度墨卡托（baiduMercator）",
    value: "BD092BaiduMercator",
  },
  {
    label: "百度坐标（BD:09）=> 火星坐标（GCJ02）",
    value: "BD092GCJ02",
  },
  {
    label: "火星坐标（GCJ02）=> 百度坐标（BD:09）",
    value: "GCJ022BD09",
  },
  {
    label: "百度坐标（BD:09）=> 天地图（EPSG:4490）",
    value: "BD092CGCS2000",
  },
  {
    label: "天地图（EPSG:4490）=> 百度坐标（BD:09）",
    value: "CGCS20002BD09",
  },
  {
    label: "火星坐标（GCJ02）=> 天地图（EPSG:4490）",
    value: "GCJ022CGC2000",
  },
  {
    label: "天地图（EPSG:4490）=> 火星坐标（GCJ02）",
    value: "CGCS20002GCJ02",
  },
  {
    label: "百度墨卡托 => 天地图（EPSG:4490）",
    value: "baiduMercator2CGC2000",
  },
  {
    label: "天地图（EPSG:4490）=> 百度墨卡托",
    value: "CGCS20002BaiduMercator",
  },
]
const w50 = computed(() => (!isMobile.value ? "w50" : "w100"))

watch(
  [coord,fun],
  () => {
    rest.value = (coordinateTransform as any)[fun.value]([+coord.value[0],+coord.value[1]])
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
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
