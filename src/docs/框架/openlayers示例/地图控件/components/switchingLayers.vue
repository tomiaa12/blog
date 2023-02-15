<template>
  <div class="map-example">
    <div
      ref="map"
      class="map"
    >
      <div>
        <label
          v-for="(item, i) of layers"
          :key="i"
        >
          <input
            v-model="checkedList[i]"
            type="checkbox"
            :value="item.getVisible()"
            @change="item.setVisible(checkedList[i])"
          />
          {{ item.get("name") }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import "ol/ol.css"
import { Map, View } from "ol"

import TileLayer from "ol/layer/Tile"
import { OSM, XYZ } from "ol/source"

const layers = [
  new TileLayer({
    // 创建一个使用Open Street Map地图源的瓦片图层
    source: new OSM(),
    properties: {
      name: "矢量图层",
    },
  }),
  new TileLayer({
    source: new XYZ({
      url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
      crossOrigin: "anonymous", //跨域
    }),
    properties: {
      name: "卫星图",
    },
  }),
  new TileLayer({
    source: new XYZ({
      url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8`,
      crossOrigin: "anonymous", //跨域
    }),
    properties: {
      name: "影像路图",
    },
  }),
]
const map = ref()

const checkedList = ref([true, true, true])

onMounted(() => {
  new Map({
    view: new View({
      center: [12579156, 3274244], // 坐标
      zoom: 12, // 放大倍数
    }),
    layers,
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
    > div {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 10;
      label {
        color: white;
        display: block;
      }
    }
  }
}
</style>
