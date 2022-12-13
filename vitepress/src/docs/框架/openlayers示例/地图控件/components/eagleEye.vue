<template>
  <div class="map-example">
    <div
      ref="map"
      class="map"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import "ol/ol.css"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { OverviewMap, defaults } from "ol/control"

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
    controls: defaults(/* 地图默认控件 */).extend([
      new OverviewMap({
        collapsed: false, //初始为展开显示方式
        layers: [
          new TileLayer({
            // 创建一个使用Open Street Map地图源的瓦片图层
            source: new OSM(),
          }),
        ],
      }),
    ]),
    target: map.value,
  })
})
</script>

<style lang="scss" scoped>
.map-example {
  width: 100%;
  height: 80vh;
  position: relative;
  .map {
    width: 100%;
    height: 100%;
    border: 1px solid var(--c-brand);
  }
}
</style>
