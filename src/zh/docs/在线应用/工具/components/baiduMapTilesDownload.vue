<template>
  <div class="btns">
    <el-check-tag
      size="large"
      @click="drawRect"
    >
      画范围
    </el-check-tag>
    <el-check-tag
      size="large"
      @click="isShow = true"
      v-if="rect"
    >
      下载
    </el-check-tag>
    <div
      class="loading"
      v-show="isLoading"
    >
      下载进度：{{ process }}%
    </div>
  </div>
  <div
    ref="elMap"
    class="map-example"
  ></div>
  <div
    ref="position"
    class="position"
  ></div>
  <el-dialog
    v-model="isShow"
    title="下载地图瓦片"
    width="60%"
    append-to-body
  >
    <el-form label-width="100px">
      <el-form-item label="选中范围">
        <el-input
          :value="rectLngLat"
          readonly
        >
        </el-input>
      </el-form-item>
      <el-form-item label="中心点">
        <el-input
          :value="centerLnglat"
          readonly
        >
        </el-input>
      </el-form-item>
      <el-form-item label="路径规则">
        <el-input
          :value="rule"
          readonly
        >
        </el-input>
      </el-form-item>
    </el-form>
    <el-table
      v-if="rect && tableData"
      :data="tableData"
      height="400"
    >
      <el-table-column
        prop="level"
        label="缩放级别"
      ></el-table-column>
      <el-table-column
        prop="num"
        label="瓦片数量"
      ></el-table-column>
      <el-table-column label="选中">
        <template #default="scope">
          <input
            type="checkbox"
            v-if="scope.row"
            v-model="zoomMap[scope.row.level]"
          />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div style="text-align: right">
        <el-button
          type="primary"
          @click="download"
        >
          下载
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import "ol/ol.css"
import { Map, View, Feature } from "ol"
import TileLayer from "ol/layer/Tile"
import layerVector from "ol/layer/Vector"
import { defaults, MousePosition } from "ol/control"
import { TileImage, Vector } from "ol/source"
import TileGrid from "ol/tilegrid/TileGrid"
import { Style, Fill, Stroke, Circle } from "ol/style"
import { Point, Polygon } from "ol/geom"
import { createStringXY } from "ol/coordinate"
import { Draw, Modify } from "ol/interaction"
import '@/utils/src/openlayersProjDefs'
import { computed } from "vue"
import { toLonLat, transform } from "ol/proj"
import JSZip from "jszip"

import { ElMessage, ElMessageBox } from "element-plus"

const elMap = ref()
const position = ref()

onMounted(() => {
  initMap()
})

let map: Map
const initMap = () => {
  // const center = transform([112.926305, 28.204233], "EPSG:4326", "baidu") // 坐标
  // const center = [112.926305, 28.204233] // 4326
  const center = [112.93816837836393, 28.206985612845706] // bd:09

  map = new Map({
    target: elMap.value,
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
      // projection: "EPSG:4490",
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
  map.addLayer(vector)
}

const rect = ref()

let draw: Draw
// 绘画图层
let graphicsLayer = new layerVector({
  source: new Vector(),
})
// 矩形图层
let rectLayer = new layerVector({
  source: new Vector(),
  style: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255, 0, 0, 0.1)",
    }),
  }),
})

function drawRect() {
  map.addLayer(graphicsLayer)
  map.addLayer(rectLayer)
  draw = new Draw({
    source: graphicsLayer.getSource()!,
    type: "Polygon",
  })

  map.addInteraction(draw)

  draw.on("drawend", e => {
    rect.value = e.feature.getGeometry()!.getExtent()
    map.removeInteraction(draw)
    graphicsLayer.getSource()!.removeFeature(e.feature)
    rectLayer.getSource()!.addFeature(
      new Feature({
        geometry: new Polygon([
          [
            [rect.value[0], rect.value[1]],
            [rect.value[0], rect.value[3]],
            [rect.value[2], rect.value[3]],
            [rect.value[2], rect.value[1]],
            [rect.value[0], rect.value[1]],
          ],
        ]),
      })
    )
  })
}

/* 地图下载 */
const isShow = ref(false)
const isLoading = ref(false)
const process = ref("0")
const url = ref(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
)
const rule = ref("tiles/[z]/[y]/[x].png")

const rectLngLat = computed(() =>
  rect
    ? `左上角: ${toLonLat([
        rect.value[0],
        rect.value[3],
      ]).toString()} 右下角: ${toLonLat([
        rect.value[2],
        rect.value[1],
      ]).toString()}`
    : null
)

const centerLnglat = computed(() =>
  rect
    ? toLonLat([
        (rect.value[0] + rect.value[2]) / 2,
        (rect.value[1] + rect.value[3]) / 2,
      ]).toString()
    : ""
)

const zoomMap = ref<{ [prop: string]: number }>({})

const tableData = computed(() => {
  if (rect) {
    let list: { level: number; num: number }[] = []
    const zooms = [...Array(20).keys()].slice(0, 19)
    zooms.forEach(z => {
      list.push({ level: z, num: getTileCount(z) })
    })
    return list
  }
  return []
})

const lon2tile = (lon: number, zoom: number) =>
  Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))

const lat2tile = (lat: number, zoom: number) =>
  Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  )

// 瓦片数量
function getTileCount(z: number) {
  const latlngMin = toLonLat([rect.value[0], rect.value[3]])
  const latlngMax = toLonLat([rect.value[2], rect.value[1]])
  const xMin = lon2tile(latlngMin[0], z)
  const yMin = lat2tile(latlngMin[1], z)
  const xMax = lon2tile(latlngMax[0], z)
  const yMax = lat2tile(latlngMax[1], z)
  return (xMax - xMin + 1) * (yMax - yMin + 1)
}

function download() {
  const latlngMin = toLonLat([rect.value[0], rect.value[3]])
  const latlngMax = toLonLat([rect.value[2], rect.value[1]])

  const list: { x: number; y: number; z: number }[] = []
  for (let z = 0; z < 20; z++) {
    const xMin = lon2tile(latlngMin[0], z)
    const yMin = lat2tile(latlngMin[1], z)
    const xMax = lon2tile(latlngMax[0], z)
    const yMax = lat2tile(latlngMax[1], z)

    if (zoomMap.value[z]) {
      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          list.push({ x, y, z })
        }
      }
    }
  }
  console.log(list, "list")
  ElMessageBox.confirm(
    `确定下载选中的瓦片吗？共${list.length}个瓦片 
  大概需要${((list.length * 0.1) / 6).toFixed(2)}秒`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      downloadTiles(list)
    })
    .catch(() => {
      ElMessage.info("已取消下载")
    })
}

async function downloadTiles(list: { x: number; y: number; z: number }[]) {
  isLoading.value = true
  const total = list.length
  let count = 0
  let zip = new JSZip()
  for (let i = 0; i < list.length; i += 6) {
    let promises = []
    if (i + 6 > list.length) {
      promises = list.slice(i, list.length).map(async item => {
        const blob = await downloadTile(item.x, item.y, item.z)
        zip.file(`${item.z}/${item.y}/${item.x}.png`, blob)
        count++
        process.value = ((count / total) * 100).toFixed(2)
      })
    } else {
      promises = list.slice(i, i + 6).map(async item => {
        const blob = await downloadTile(item.x, item.y, item.z)
        zip.file(`${item.z}/${item.y}/${item.x}.png`, blob)
        count++
        process.value = ((count / total) * 100).toFixed(2)
      })
    }
    await Promise.all(promises)

    if (count === total) {
      isLoading.value = false
      zip.generateAsync({ type: "blob" }).then(content => {
        const url = URL.createObjectURL(content)
        const a = document.createElement("a")
        a.href = url
        a.download = "tiles.zip"
        a.click()
        URL.revokeObjectURL(url)
        isLoading.value = false
      })
    }
  }
}

function downloadTile(x: number, y: number, z: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    fetch(
      url.value
        .replace("{x}", x + "")
        .replace("{y}", y + "")
        .replace("{z}", z + "")
    )
      .then(res => res.blob())
      .then(blob => {
        resolve(blob)
      })
      .catch(err => {
        reject(err)
      })
  })
}
</script>

<style lang="scss" scoped>
.btns {
  padding: 10px 0;
}
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
