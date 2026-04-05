<template>
  <div class="btns">
    <el-button
      type="primary"
      size="large"
      @click="drawRect"
    >
      画范围
    </el-button>
    <el-button
      type="primary"
      size="large"
      v-if="rect"
      @click="isShow = true"
    >
      下载
    </el-button>
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
          :model-value="rectLngLat ?? ''"
          readonly
        />
      </el-form-item>
      <el-form-item label="中心点">
        <el-input
          :model-value="centerLnglat"
          readonly
        />
      </el-form-item>
      <el-form-item label="路径规则">
        <el-input
          model-value="tiles/[z]/[x]/[y].png（百度矢量瓦片 x/y 与在线地址一致）"
          readonly
        />
      </el-form-item>
    </el-form>
    <el-table
      v-if="rect && tableData.length"
      :data="tableData"
      height="400"
    >
      <el-table-column
        prop="level"
        label="缩放级别"
      />
      <el-table-column
        prop="num"
        label="瓦片数量"
      />
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
import { computed, nextTick, onMounted, ref, watch } from "vue"
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
import { Draw } from "ol/interaction"
import { transform, transformExtent } from "ol/proj"
import JSZip from "jszip"
import "@/utils/src/openlayersProjDefs"
import { ElLoading, ElMessage, ElMessageBox } from "element-plus"
import type { Extent } from "ol/extent"

const elMap = ref<HTMLElement>()
const position = ref<HTMLElement>()

function createBaiduTileGrid() {
  return new TileGrid({
    origin: [0, 0],
    resolutions: Array.from({ length: 19 }).map((_, i) => Math.pow(2, 18 - i)),
  })
}

function baiduTileUrl(tileCoord: [number, number, number]) {
  const z = tileCoord[0]
  let x: string | number = tileCoord[1]
  let y: string | number = -tileCoord[2] - 1
  if (x < 0) x = "M" + -x
  if (y < 0) y = "M" + -y
  return `https://maponline2.bdimg.com/tile/?qt=vtile&x=${x}&y=${y}&z=${z}&styles=pl&scaler=1&udt=20240805&from=jsapi2_0`
}

let map: Map
let baiduTileGrid: TileGrid

const initMap = () => {
  baiduTileGrid = createBaiduTileGrid()
  const center = [112.93816837836393, 28.206985612845706]

  map = new Map({
    target: elMap.value!,
    layers: [
      new TileLayer({
        source: new TileImage({
          projection: "baidu",
          tileGrid: baiduTileGrid,
          tileUrlFunction(tileCoord) {
            if (!tileCoord) return ""
            return baiduTileUrl(tileCoord as [number, number, number])
          },
        }),
      }),
    ],
    view: new View({
      projection: "BD:09",
      center,
      zoom: 8,
    }),
    controls: defaults({
      attributionOptions: {
        collapsible: true,
      },
    }).extend([
      new MousePosition({
        coordinateFormat: createStringXY(6),
        projection: "BD:09",
        target: position.value,
      }),
    ]),
  })

  const point = new Feature({
    geometry: new Point(center),
  })
  point.setStyle(
    new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
      image: new Circle({
        radius: 17,
        fill: new Fill({
          color: "#ffcc33",
        }),
      }),
    })
  )

  const source = new Vector({
    features: [point],
  })
  const vector = new layerVector({
    source,
  })
  map.addLayer(vector)
}

onMounted(() => {
  initMap()
})

const rect = ref<Extent | null>(null)

let draw: Draw
const graphicsLayer = new layerVector({
  source: new Vector(),
})
const rectLayer = new layerVector({
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
    const extent = e.feature.getGeometry()!.getExtent()
    rect.value = extent
    map.removeInteraction(draw)
    graphicsLayer.getSource()!.removeFeature(e.feature)
    rectLayer.getSource()!.addFeature(
      new Feature({
        geometry: new Polygon([
          [
            [extent[0], extent[1]],
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]],
          ],
        ]),
      })
    )
  })
}

const isShow = ref(false)
const isLoading = ref(false)
const process = ref("0")
const zoomMap = ref<Record<number, boolean>>({})

watch(
  () => [isShow.value, rect.value] as const,
  () => {
    if (isShow.value && rect.value) {
      for (let z = 0; z < 19; z++) {
        if (!(z in zoomMap.value)) zoomMap.value[z] = false
      }
    }
  },
  { immediate: true }
)

const rectLngLat = computed(() => {
  if (!rect.value) return null
  const [minX, minY, maxX, maxY] = rect.value
  const topLeft = transform([minX, maxY], "BD:09", "EPSG:4326")
  const bottomRight = transform([maxX, minY], "BD:09", "EPSG:4326")
  return `左上角: ${topLeft[0]}, ${topLeft[1]} 右下角: ${bottomRight[0]}, ${bottomRight[1]}`
})

const centerLnglat = computed(() => {
  if (!rect.value) return ""
  const [minX, minY, maxX, maxY] = rect.value
  return transform(
    [(minX + maxX) / 2, (minY + maxY) / 2],
    "BD:09",
    "EPSG:4326"
  ).toString()
})

function getTileCount(z: number) {
  if (!rect.value) return 0
  const baiduExtent = transformExtent(rect.value, "BD:09", "baidu")
  const tileRange = baiduTileGrid.getTileRangeForExtentAndZ(baiduExtent, z)
  if (!tileRange) return 0
  return (tileRange.maxX - tileRange.minX + 1) * (tileRange.maxY - tileRange.minY + 1)
}

const tableData = computed(() => {
  if (!rect.value) return []
  const list: { level: number; num: number }[] = []
  for (let z = 0; z < 19; z++) {
    list.push({ level: z, num: getTileCount(z) })
  }
  return list
})

function download() {
  if (!rect.value) return
  const baiduExtent = transformExtent(rect.value, "BD:09", "baidu")
  const list: [number, number, number][] = []
  for (let z = 0; z < 19; z++) {
    if (!zoomMap.value[z]) continue
    baiduTileGrid.forEachTileCoord(baiduExtent, z, tc => {
      list.push(tc as [number, number, number])
    })
  }
  if (list.length === 0) {
    ElMessage.warning("请至少勾选一个缩放级别")
    return
  }
  ElMessageBox.confirm(
    `确定下载选中的瓦片吗？共 ${list.length} 个瓦片（百度服务器，请遵守其使用条款）`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      isShow.value = false
      await nextTick()
      await downloadTiles(list)
    })
    .catch(() => {
      ElMessage.info("已取消下载")
    })
}

async function downloadTiles(list: [number, number, number][]) {
  const loading = ElLoading.service({
    lock: true,
    text: "准备下载…",
    background: "rgba(0, 0, 0, 0.35)",
  })

  isLoading.value = true
  process.value = "0"
  const total = list.length
  let count = 0
  const zip = new JSZip()
  const batch = 6

  const setLoadingText = (text: string) => {
    loading.setText(text)
  }

  try {
    for (let i = 0; i < list.length; i += batch) {
      const chunk = list.slice(i, i + batch)
      await Promise.all(
        chunk.map(async tileCoord => {
          const blob = await downloadTile(tileCoord)
          const z = tileCoord[0]
          const x = tileCoord[1]
          const y = -tileCoord[2] - 1
          zip.file(`${z}/${x}/${y}.png`, blob)
          count++
          const pct = ((count / total) * 100).toFixed(1)
          process.value = pct
          setLoadingText(`正在下载瓦片 ${count} / ${total}（${pct}%）`)
        })
      )
    }

    setLoadingText("正在打包 ZIP（文件多时可能较慢）…")
    const content = await zip.generateAsync({ type: "blob" }, meta => {
      if (meta.percent != null) {
        setLoadingText(`正在打包 ZIP ${Number(meta.percent).toFixed(0)}%`)
      }
    })
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = "baidu-tiles.zip"
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success("已开始保存 baidu-tiles.zip")
  } catch (e) {
    console.error(e)
    ElMessage.error(e instanceof Error ? e.message : "下载失败")
  } finally {
    loading.close()
    isLoading.value = false
    process.value = "0"
  }
}

function downloadTile(tileCoord: [number, number, number]): Promise<Blob> {
  return fetch(baiduTileUrl(tileCoord), {
    mode: "cors",
    referrerPolicy: "no-referrer",
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.blob()
  })
}
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
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
