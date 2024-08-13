<template>
  <div
    ref="map"
    class="map-example"
  ></div>
  <div
    ref="position"
    class="position"
  ></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import "ol/ol.css"
import { Map, View, Feature } from "ol"
import TileLayer from "ol/layer/Tile"
import layerVector from "ol/layer/Vector"
import { defaults, MousePosition } from "ol/control"
import {
  addCoordinateTransforms,
  addProjection,
  Projection,
  transform,
} from "ol/proj"
import { TileImage, Vector } from "ol/source"
import TileGrid from "ol/tilegrid/TileGrid"
import { Style, Fill, Stroke, Circle } from "ol/style"
import { Point } from "ol/geom"
import { createStringXY } from "ol/coordinate"
// @ts-ignore
import projzh from "projzh"

const map = ref()
const position = ref()

/* 百度墨卡托坐标 */
const baiduMercator = new Projection({
  code: "baidu",
  extent: [-20022743.74356534, -12474104.1741364, 20022743.74356534, 12474104.1741364],
  // extent: [-20037726.37, -12474104.17, 20037726.37, 12474104.17],
  units: "m",
})
addProjection(baiduMercator)
addCoordinateTransforms(
  "EPSG:4326",
  baiduMercator,
  projzh.ll2bmerc,
  projzh.bmerc2ll
)
addCoordinateTransforms(
  "EPSG:3857",
  baiduMercator,
  projzh.smerc2bmerc,
  projzh.bmerc2smerc
)


/* 百度 BD:09 经纬度坐标 */
const BD09 = new Projection({
  code: "BD:09",
  units: "m",
  extent: [-179.86541124,-74, 179.86541124,74]
})
addProjection(BD09)
addCoordinateTransforms(
  "EPSG:4326",
  BD09,
  (coordinate) => {
    return projzh.datum.bd09.fromWGS84(coordinate)
  },
  (coordinate) => {
    return projzh.datum.bd09.toWGS84(coordinate)
  },
)
addCoordinateTransforms(
  "EPSG:3857",
  BD09,
  (coordinate) => {
    const WWGS84 = transform(coordinate, "EPSG:3857", "EPSG:4326")
    return projzh.datum.bd09.fromWGS84(WWGS84)
  },
  (coordinate) => {
    const WGS84 = projzh.datum.bd09.toWGS84(coordinate)
    return transform(WGS84, "EPSG:3857", "EPSG:4326")
  },
)

/* 百度墨卡托 BD:09 互转 */
addCoordinateTransforms(
  BD09,
  baiduMercator,
  (coordinate) => {
    const WGS84 = projzh.datum.bd09.toWGS84(coordinate) 
    return  projzh.ll2bmerc(WGS84)
  },
  (coordinate) => {
    const WGS84 = projzh.bmerc2ll(coordinate)
    return projzh.datum.bd09.fromWGS84(WGS84)
  },
)

onMounted(() => {
  // const center = transform([112.926305, 28.204233], "EPSG:4326", "baidu") // 坐标
  // const center = [112.926305, 28.204233] // 4326
  const center = [112.93816837836393,28.206985612845706] // bd:09

  const olMap = new Map({
    target: map.value,
    layers: [
      new TileLayer({
        source: new TileImage({
          projection: "baidu",
          // tilePixelRatio: 2,
          tileGrid: new TileGrid({
            origin: [0, 0],
            resolutions: Array.from({ length: 19 }).map((_, i) =>
              Math.pow(2, 18 - i)
            ),
          }),
          tileUrlFunction(tileCoord) {
            if (!tileCoord) return ""
            
            let z: string | number = tileCoord[0]
            let x: string | number = tileCoord[1]
            let y: string | number = -tileCoord[2] - 1

            if (x < 0) x = "M" + -x
            
            if (y < 0) y = "M" + -y

            /* 本地离线地图 */
            // return `/baidu_tiles/${z}/${x}/${y}.png`

            /* 在线地图 */
            // return (
            //   "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
            //   x +
            //   "&y=" +
            //   y +
            //   "&z=" +
            //   z +
            //   "&styles=pl&udt=20151021&scaler=1&p=1"
            // )

            return `https://maponline2.bdimg.com/tile/?qt=vtile&x=${x}&y=${y}&z=${z}&styles=pl&scaler=1&udt=20240805&from=jsapi2_0`
          },
        }),
      }),
    ],
    view: new View({
      // projection: "EPSG:4326",
      projection: "BD:09",
      center,
      zoom: 8,
      // constrainResolution: true,
    }),
    controls: defaults({
      attributionOptions: {
        collapsible: true, // 右下角详细信息默认收缩
      },
    }).extend([
      new MousePosition({
        coordinateFormat: createStringXY(6), // 保留 3 位小数
        projection: "BD:09", // 输出投影的坐标，默认3857
        target: position.value,
      }),
    ]),
  })

  //创建一个点
  const point = new Feature({
    geometry: new Point(center),
  })
  //设置点1的样式信息
  point.setStyle(
    new Style({
      //填充色
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      //边线颜色
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
      //形状
      image: new Circle({
        radius: 17,
        fill: new Fill({
          color: "#ffcc33",
        }),
      }),
    })
  )

  //实例化一个矢量图层Vector作为绘制层
  const source = new Vector({
    features: [point],
  })
  //创建一个图层
  const vector = new layerVector({
    source: source,
  })
  //将绘制层添加到地图容器中
  olMap.addLayer(vector)
})
</script>

<style lang="scss" scoped>
.map-example {
  width: 100%;
  height: 80vh;
}

.position {
  position: absolute;
  top: -50px;
  right: 0;
  white-space: nowrap;
}
</style>
