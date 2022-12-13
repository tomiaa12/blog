<template>
  <div class="map-example">
    <div
      ref="map1"
      class="map"
    ></div>
    <div
      ref="map2"
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
import XYZ from "ol/source/XYZ"

const map1 = ref()
const map2 = ref()

onMounted(() => {
  const map = new Map({
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
    target: map1.value,
  })
  new Map({
    view: map.getView(),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
          crossOrigin: "anonymous", //跨域
        }),
      }),
    ],
    target: map2.value,
  })
})
</script>

<style lang="scss" scoped>
.map-example {
  width: 100%;
  height: 80vh;
  position: relative;
  display: flex;
  .map {
    width: 100%;
    height: 100%;
    border: 1px solid #000;
  }
}
</style>
