<template>
  <div class="pubg-map-wrap">
    <div
      ref="elMap"
      class="pubg-map-canvas"
    ></div>

    <div class="map-switcher">
      <button
        v-for="item in maps"
        :key="item.id"
        type="button"
        class="map-item"
        :class="{ active: currentMap === item.id }"
        :title="item.name"
        @click="switchMap(item.id)"
      >
        <img
          :src="tileUrl(item.id, 0, 0, 0)"
          :alt="item.name"
        />
        <span>{{ item.name }}</span>
      </button>
    </div>

    <div
      v-if="markerTypes.length"
      class="marker-filter"
    >
      <el-checkbox-group
        v-model="enabledTypeIds"
        @change="onFilterChange"
      >
        <el-checkbox
          v-for="item in markerTypes"
          :key="item.id"
          class="filter-item"
          :label="item.id"
          :value="item.id"
        >
          <img
            :src="markerIconUrl(item.icon_url)"
            :alt="item.name_zh"
          />
          <span>{{ item.name_zh }} {{ item.count }}</span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue"
import "ol/ol.css"
import { Feature, Map as OlMap, View } from "ol"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import { defaults, OverviewMap } from "ol/control"
import { TileImage, Vector as VectorSource } from "ol/source"
import TileGrid from "ol/tilegrid/TileGrid"
import Projection from "ol/proj/Projection"
import { addProjection } from "ol/proj"
import { getTopLeft } from "ol/extent"
import { Point } from "ol/geom"
import { Icon, Style } from "ol/style"
import type { Extent } from "ol/extent"

const TILE_CDN = "https://cdn.jsdelivr.net/gh/tomiaa12/pubgmaptile@master"
const RAW_CDN = "https://raw.githubusercontent.com/tomiaa12/pubgmaptile/master"
const WORLD = 8192
const EXTENT: Extent = [0, -WORLD, WORLD, 0]
const RESOLUTIONS = [32, 16, 8, 4, 2, 1]
const MAX_ZOOM = 5
const TILE_SIZE = 256

const maps = [
  { id: "Erangel", name: "艾伦格" },
  { id: "Miramar", name: "米拉玛" },
  { id: "Vikendi", name: "维寒迪" },
  { id: "Taego", name: "泰戈" },
  { id: "Deston", name: "蒂斯顿" },
  { id: "Rondo", name: "荣都" },
] as const

type MapId = (typeof maps)[number]["id"]

type MarkerType = {
  id: string
  name: string
  name_zh: string
  icon_url: string
  count: number
}

type MarkerItem = {
  id: string
  type_id: string
  latlng: { coordinates: [number, number] }
  marker_type: {
    id: string
    name: string
    name_zh: string
    icon_url: string
  }
}

const elMap = ref<HTMLElement>()
const currentMap = ref<MapId>("Erangel")
const markerTypes = ref<MarkerType[]>([])
const enabledTypeIds = ref<string[]>([])

const projection = new Projection({
  code: "PUBG-MAP",
  units: "pixels",
  extent: EXTENT,
})
addProjection(projection)

let olMap: OlMap | null = null
let tileLayer: TileLayer<TileImage> | null = null
let overviewLayer: TileLayer<TileImage> | null = null
let markerLayer: VectorLayer<VectorSource> | null = null
let markerSource: VectorSource | null = null
let loadToken = 0
const markerCache = new window.Map<string, MarkerItem[]>()
const iconStyles = new window.Map<string, Style>()

function tileUrl(mapId: string, z: number, x: number, y: number) {
  return `${TILE_CDN}/${mapId}/${z}/${x}/${y}.webp`
}

function markerIconUrl(iconPath: string) {
  return `${TILE_CDN}/markers/${iconPath}`
}

function toMapCoord(lng: number, lat: number): [number, number] {
  const x = ((lng + 180) / 360) * WORLD
  const y = -((lat + 90) / 180) * WORLD
  return [x, y]
}

function createTileGrid() {
  return new TileGrid({
    extent: EXTENT,
    origin: getTopLeft(EXTENT),
    resolutions: RESOLUTIONS,
    tileSize: TILE_SIZE,
  })
}

function createSource(mapId: string) {
  return new TileImage({
    projection,
    tileGrid: createTileGrid(),
    crossOrigin: "anonymous",
    wrapX: false,
    tileUrlFunction(tileCoord) {
      if (!tileCoord) return undefined
      const z = tileCoord[0]
      const x = tileCoord[1]
      const xyzY = tileCoord[2]
      const max = (1 << z) - 1
      if (z < 0 || z > MAX_ZOOM || x < 0 || x > max || xyzY < 0 || xyzY > max) {
        return undefined
      }
      return tileUrl(mapId, z, x, max - xyzY)
    },
  })
}

function styleFor(iconPath: string) {
  let style = iconStyles.get(iconPath)
  if (!style) {
    style = new Style({
      image: new Icon({
        src: markerIconUrl(iconPath),
        anchor: [0.5, 1],
        scale: 1,
      }),
    })
    iconStyles.set(iconPath, style)
  }
  return style
}

function markerStyle(feature: Feature<Point>) {
  const typeId = feature.get("typeId") as string
  if (!enabledTypeIds.value.includes(typeId)) return
  return styleFor(feature.get("iconUrl") as string)
}

function fitMap() {
  if (!olMap) return
  olMap.updateSize()
  const size = olMap.getSize()
  if (!size || !size[0] || !size[1]) return
  olMap.getView().fit(EXTENT, { size, padding: [16, 16, 16, 16] })
}

async function fetchJson(urls: string[]) {
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (res.ok) return (await res.json()) as MarkerItem[]
    } catch {
      /* try next */
    }
  }
  throw new Error("markers load failed")
}

async function loadMarkers(mapId: MapId) {
  const token = ++loadToken
  if (!markerCache.has(mapId)) {
    const data = await fetchJson([
      `${TILE_CDN}/markers/${mapId}.json`,
      `${RAW_CDN}/markers/${mapId}.json`,
    ])
    markerCache.set(mapId, data)
  }
  if (token !== loadToken || !markerSource) return

  const data = markerCache.get(mapId) ?? []
  const typeMap = new window.Map<string, MarkerType>()
  const features = data.map(item => {
    const type = item.marker_type
    const rec = typeMap.get(type.id) ?? {
      id: type.id,
      name: type.name,
      name_zh: type.name_zh || type.name,
      icon_url: type.icon_url,
      count: 0,
    }
    rec.count += 1
    typeMap.set(type.id, rec)

    const raw = item.latlng.coordinates
    const feature = new Feature({
      geometry: new Point(toMapCoord(raw[0], raw[1])),
    })
    feature.setId(item.id)
    feature.set("typeId", type.id)
    feature.set("iconUrl", type.icon_url)
    feature.set("raw", raw)
    return feature
  })

  markerTypes.value = [...typeMap.values()].sort((a, b) =>
    a.name_zh.localeCompare(b.name_zh, "zh")
  )
  enabledTypeIds.value = markerTypes.value.map(item => item.id)
  markerSource.clear()
  markerSource.addFeatures(features)
  markerLayer?.changed()
}

function onFilterChange() {
  markerLayer?.changed()
}

function switchMap(id: MapId) {
  currentMap.value = id
  tileLayer?.setSource(createSource(id))
  overviewLayer?.setSource(createSource(id))
  nextTick(fitMap)
  loadMarkers(id)
}

function onResize() {
  olMap?.updateSize()
}

onMounted(() => {
  tileLayer = new TileLayer({
    source: createSource(currentMap.value),
  })
  overviewLayer = new TileLayer({
    source: createSource(currentMap.value),
  })
  markerSource = new VectorSource()
  markerLayer = new VectorLayer({
    source: markerSource,
    style: feature => markerStyle(feature as Feature<Point>),
    zIndex: 2,
  })

  olMap = new OlMap({
    target: elMap.value,
    layers: [tileLayer, markerLayer],
    view: new View({
      projection,
      center: [WORLD / 2, -WORLD / 2],
      zoom: 1,
      minZoom: 0,
      maxZoom: MAX_ZOOM,
      extent: EXTENT,
      showFullExtent: true,
      enableRotation: false,
    }),
    controls: defaults({
      attribution: false,
      rotate: false,
      zoomOptions: {
        zoomInTipLabel: "放大",
        zoomOutTipLabel: "缩小",
      },
    }).extend([
      new OverviewMap({
        collapsed: false,
        collapsible: false,
        layers: [overviewLayer],
      }),
    ]),
  })

  nextTick(fitMap)
  loadMarkers(currentMap.value)
  window.addEventListener("resize", onResize)
})

onUnmounted(() => {
  window.removeEventListener("resize", onResize)
  olMap?.setTarget(undefined)
  olMap = null
  tileLayer = null
  overviewLayer = null
  markerLayer = null
  markerSource = null
})
</script>

<style lang="scss">
.Layout.pubg-map {
  .VPContent {
    max-width: unset !important;
    padding: var(--vp-nav-height) 0 0 !important;
    margin: 0 !important;
  }

  .container,
  .content,
  .content-container {
    max-width: unset !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .VPDoc {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.pubg-map-wrap {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 100vh) - var(--vp-nav-height, 64px));
  overflow: hidden;
  background: #0b1220;
}

.pubg-map-canvas {
  width: 100%;
  height: 100%;
}

.map-switcher {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: min(720px, calc(100% - 72px));
}

.map-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 88px;
  padding: 6px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
  color: var(--vp-c-text-1);
  box-shadow: var(--el-box-shadow-light);
  cursor: pointer;

  img {
    width: 76px;
    height: 76px;
    object-fit: cover;
    border-radius: 6px;
  }

  span {
    font-size: 12px;
    line-height: 1.2;
  }

  &:hover,
  &.active {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}

.marker-filter {
  position: absolute;
  top: 132px;
  left: 12px;
  z-index: 1;
  min-width: 168px;
  padding: 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: var(--el-box-shadow-light);
}

.filter-item {
  display: flex;
  align-items: center;
  height: auto;
  margin: 0;
  padding: 4px 6px;
  border-radius: 8px;

  :deep(.el-checkbox__label) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
    color: var(--vp-c-text-1);
    font-size: 12px;
  }

  img {
    width: 22px;
    height: 22px;
  }

  &.is-checked :deep(.el-checkbox__label) {
    color: var(--vp-c-text-1);
  }

  &:not(.is-checked) {
    opacity: 0.45;

    :deep(.el-checkbox__label) {
      color: var(--vp-c-text-2);
    }
  }
}

:deep(.ol-zoom) {
  top: auto;
  bottom: 196px;
  left: auto;
  right: 12px;
}

:deep(.ol-overviewmap) {
  left: auto;
  right: 12px;
  bottom: 12px;
  top: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
}

:deep(.ol-overviewmap-map) {
  width: 160px;
  height: 160px;
  border: none;
  margin: 4px;
  border-radius: 8px;
}

:deep(.ol-overviewmap-box) {
  border: 2px solid var(--vp-c-brand-1);
}

:deep(.ol-control button) {
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  color: var(--vp-c-text-1);
}

:deep(.ol-control button:hover) {
  background: var(--vp-c-brand-1);
  color: #fff;
}

@media screen and (max-width: 768px) {
  .map-item {
    width: 68px;
    padding: 4px;

    img {
      width: 58px;
      height: 58px;
    }
  }

  .marker-filter {
    top: 112px;
  }
}
</style>
