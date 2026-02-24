<template>
  <div
    ref="map"
    class="map-example"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import "ol/ol.css"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { ScaleLine, defaults } from "ol/control"

const map = ref()

onMounted(() => {
  new Map({
    view: new View({
      center: [12579156, 3274244], // 坐标
      zoom: 12, // 放大倍数
    }),
    layers: [
      new TileLayer({
        // 创建一个使用Open Street Map地图源的瓦片图层
        source: new OSM(),
      }),
    ],
    controls: defaults(/* 地图默认控件 */).extend([new ScaleLine()]),
    target: map.value,
  })
})
</script>

<style lang="scss" scoped>
.map-example {
  width: 100%;
  height: 80vh;
}
</style>
