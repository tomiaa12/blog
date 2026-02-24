<template>
  <div class="map-example">
    <div
      ref="map"
      class="map"
    ></div>
    <div
      ref="position"
      class="position"
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
import { MousePosition, defaults } from "ol/control"
import { createStringXY } from "ol/coordinate"

const map = ref()
const position = ref()

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
    controls: defaults({
      /* 地图默认控件 */
      attributionOptions: {
        collapsible: true, // 右下角详细信息默认收缩
      },
    }).extend([
      new MousePosition({
        coordinateFormat: createStringXY(3), // 保留 3 位小数
        projection: "EPSG:4326", // 输出 4326 投影的坐标，默认3857
        target: position.value,
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
  .position {
    position: absolute;
    top: -50px;
    right: 0;
    white-space: nowrap;
  }
}
</style>
