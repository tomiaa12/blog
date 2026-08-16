<template>
  <div
    class="pubg-map-wrap"
    :class="{ 'is-web-fullscreen': isWebFullScreen }"
  >
    <div
      ref="elMap"
      class="pubg-map-canvas"
    ></div>

    <MapSwitcher
      :model-value="currentMap"
      :items="switcherItems"
      @update:model-value="switchMap"
    />

    <MarkerFilter
      v-model="enabledTypeIds"
      :items="filterItems"
      class="pubg-filter"
      @change="onFilterChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import { useWebFullScreen } from "@/hooks/useWebFullScreen"
import MapSwitcher from "./map/MapSwitcher.vue"
import MarkerFilter from "./map/MarkerFilter.vue"
import type { MarkerFilterItem } from "./map/MarkerFilter.vue"
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
const { isWebFullScreen } = useWebFullScreen()
const currentMap = ref<MapId>("Erangel")
const markerTypes = ref<MarkerType[]>([])
const enabledTypeIds = ref<string[]>([])

const switcherItems = computed(() =>
  maps.map(item => ({
    id: item.id,
    name: item.name,
    preview: tileUrl(item.id, 0, 0, 0),
  }))
)

const filterItems = computed<MarkerFilterItem[]>(() =>
  markerTypes.value.map(item => ({
    id: item.id,
    name: item.name_zh,
    icon: markerIconUrl(item.icon_url),
    count: item.count,
  }))
)

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

function switchMap(id: string) {
  const mapId = id as MapId
  currentMap.value = mapId
  tileLayer?.setSource(createSource(mapId))
  overviewLayer?.setSource(createSource(mapId))
  nextTick(fitMap)
  loadMarkers(mapId)
}

function onResize() {
  olMap?.updateSize()
}

let resizeObserver: ResizeObserver | undefined

watch(isWebFullScreen, () => {
  nextTick(onResize)
})

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
  if (elMap.value) {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(elMap.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
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

  .VPDoc,
  .VPPage {
    padding: 0 !important;
  }

  &.vp-webfullscreen {
    height: 100vh;
    overflow: hidden;

    .VPContent,
    .VPPage {
      height: 100%;
      padding: 0 !important;
    }
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

  &.is-web-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
  }
}

.pubg-map-canvas {
  width: 100%;
  height: 100%;
}

.pubg-filter {
  position: absolute;
  top: 132px;
  left: 12px;
  z-index: 1;
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
  .pubg-filter {
    top: 112px;
  }
}
</style>
