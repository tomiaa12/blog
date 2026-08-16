<template>
  <div
    class="gta-vc-map-wrap"
    :class="{ 'is-web-fullscreen': isWebFullScreen }"
  >
    <div
      ref="elMap"
      class="gta-vc-map-canvas"
    ></div>
    <div
      ref="elPopup"
      class="marker-popup"
      :class="{ hidden: !popup }"
    >
      <button
        type="button"
        class="popup-close"
        @click="closePopup"
      >
        ×
      </button>
      <div
        v-if="popup"
        class="popup-body"
      >
        <div class="popup-title">{{ popup.title }}</div>
        <div class="popup-meta">{{ popup.category }}</div>
        <p
          v-if="popup.desc"
          class="popup-desc"
        >
          {{ popup.desc }}
        </p>
      </div>
    </div>

    <MapSwitcher
      :model-value="currentLayer"
      :items="switcherItems"
      size="sm"
      style="--map-switcher-max-width: 320px"
      @update:model-value="switchLayer"
    />

    <div class="side-panel">
      <MarkerFilter
        v-model="enabledTypeIds"
        :groups="filterGroups"
        show-actions
        @change="onFilterChange"
      />
    </div>

    <div
      v-if="loadError"
      class="load-error"
    >
      {{ loadError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import { useWebFullScreen } from "@/hooks/useWebFullScreen"
import { useLang } from "@/hooks/useLang"
import MapSwitcher from "./map/MapSwitcher.vue"
import MarkerFilter from "./map/MarkerFilter.vue"
import namesZh from "./map/gtaVcNamesZh.json"
import type { MapSwitcherItem } from "./map/MapSwitcher.vue"
import type { MarkerFilterGroup } from "./map/MarkerFilter.vue"
import "ol/ol.css"
import { Feature, Map as OlMap, Overlay, View } from "ol"
import TileState from "ol/TileState"
import TileLayer from "ol/layer/Tile"
import VectorImageLayer from "ol/layer/VectorImage"
import { defaults, OverviewMap } from "ol/control"
import { XYZ, Vector as VectorSource } from "ol/source"
import { fromLonLat } from "ol/proj"
import { Point } from "ol/geom"
import { Circle, Fill, Stroke, Style, Text } from "ol/style"
import type { Extent } from "ol/extent"
import type { FeatureLike } from "ol/Feature"

const DATA_CDN =
  "https://cdn.jsdelivr.net/gh/tomiaa12/gta-vice-city-map-tile@master"
const DATA_RAW =
  "https://raw.githubusercontent.com/tomiaa12/gta-vice-city-map-tile/master"

const WORLD = 20037508.342789244
const Z9 = 512
const TILE_MIN = 254
const TILE_MAX_EXCL = 256
const EXTENT: Extent = [
  (TILE_MIN / Z9) * 2 * WORLD - WORLD,
  WORLD - (TILE_MAX_EXCL / Z9) * 2 * WORLD,
  (TILE_MAX_EXCL / Z9) * 2 * WORLD - WORLD,
  WORLD - (TILE_MIN / Z9) * 2 * WORLD,
]
const MIN_ZOOM = 9
const MAX_ZOOM = 13
const INIT_CENTER = fromLonLat([-0.8726546030835, 0.86445231859421])

const TILE_BOUNDS: Record<
  number,
  { minX: number; maxX: number; minY: number; maxY: number }
> = {
  9: { minX: 254, maxX: 255, minY: 254, maxY: 255 },
  10: { minX: 508, maxX: 511, minY: 508, maxY: 511 },
  11: { minX: 1016, maxX: 1023, minY: 1016, maxY: 1023 },
  12: { minX: 2032, maxX: 2047, minY: 2032, maxY: 2047 },
  13: { minX: 4064, maxX: 4095, minY: 4064, maxY: 4095 },
}

const LAYERS = [
  { id: "radar-v1", name: "雷达" },
  { id: "atlas-v1", name: "地图册" },
  { id: "classic-v1", name: "经典" },
] as const

type LayerId = (typeof LAYERS)[number]["id"]

const DEFAULT_ON = new Set([
  4274, 4275, 4282, 4267, 4268, 4290, 4263, 4265, 4273, 4272,
])

type CategoryGroup = {
  id: number
  title: string
  title_zh?: string
  color: string
  categories: CategoryItem[]
}

type CategoryItem = {
  id: number
  group_id: number
  title: string
  title_zh?: string
  display_type: string | null
  locations_count: number
  visible: boolean
}

type LocationItem = {
  id: number
  category_id: number
  title: string
  title_zh?: string
  description: string | null
  latitude: string
  longitude: string
}

type PopupInfo = {
  title: string
  category: string
  desc: string
}

const elMap = ref<HTMLElement>()
const elPopup = ref<HTMLElement>()
const { isWebFullScreen } = useWebFullScreen()
const { lang } = useLang()
const NAMES_ZH = namesZh as Record<string, string>
const currentLayer = ref<LayerId>("radar-v1")
const enabledTypeIds = ref<string[]>([])
const categoryGroups = ref<CategoryGroup[]>([])
const locationCounts = ref<Record<string, number>>({})
const loadError = ref("")
const popup = ref<PopupInfo | null>(null)

function useChinese() {
  const current = lang.value || "zh-CN"
  return current === "zh-CN" || current.startsWith("zh")
}

function displayName(en?: string, zh?: string) {
  if (!useChinese()) return en || ""
  return zh || (en && NAMES_ZH[en]) || en || ""
}

const switcherItems = computed<MapSwitcherItem[]>(() =>
  LAYERS.map(item => ({
    id: item.id,
    name: item.name,
    preview: `${DATA_RAW}/tiles/${item.id}/9/254/254.png`,
  }))
)

const filterGroups = computed<MarkerFilterGroup[]>(() =>
  categoryGroups.value.map(group => ({
    id: String(group.id),
    name: displayName(group.title, group.title_zh),
    items: group.categories.map(item => ({
      id: String(item.id),
      name: displayName(item.title, item.title_zh),
      icon: colorIcon(group.color),
      count: locationCounts.value[item.id] ?? item.locations_count,
    })),
  }))
)

let olMap: OlMap | null = null
let tileLayer: TileLayer<XYZ> | null = null
let overviewLayer: TileLayer<XYZ> | null = null
let markerLayer: VectorImageLayer<VectorSource> | null = null
let markerSource: VectorSource | null = null
let overlay: Overlay | null = null
const styleCache = new window.Map<string, Style[]>()

function tileUrl(base: string, layer: LayerId, z: number, x: number, y: number) {
  return `${base}/tiles/${layer}/${z}/${x}/${y}.png`
}

function colorIcon(color: string) {
  const fill = color.startsWith("#") ? color : `#${color}`
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="${fill}" stroke="#fff" stroke-width="2"/></svg>`
  )}`
}

function formatDesc(md: string) {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\([^)]+\)/g, "$1")
    .trim()
}

async function fetchJson<T>(path: string): Promise<T> {
  for (const base of [DATA_CDN, DATA_RAW]) {
    try {
      const res = await fetch(`${base}/${path}`)
      if (res.ok) return (await res.json()) as T
    } catch {
      /* try next */
    }
  }
  throw new Error(`${path} load failed`)
}

function createSource(layer: LayerId) {
  const source = new XYZ({
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    wrapX: false,
    crossOrigin: "anonymous",
    tileUrlFunction(tileCoord) {
      if (!tileCoord) return undefined
      const z = tileCoord[0]
      const x = tileCoord[1]
      const y = tileCoord[2]
      const bound = TILE_BOUNDS[z]
      if (
        !bound ||
        x < bound.minX ||
        x > bound.maxX ||
        y < bound.minY ||
        y > bound.maxY
      ) {
        return undefined
      }
      return tileUrl(DATA_CDN, layer, z, x, y)
    },
  })
  source.setTileLoadFunction((imageTile, src) => {
    const img = imageTile.getImage() as HTMLImageElement
    const load = (url: string, allowFallback: boolean) => {
      img.onload = () => {
        img.onload = null
        img.onerror = null
      }
      img.onerror = () => {
        img.onerror = null
        if (allowFallback && url.startsWith(DATA_CDN)) {
          load(url.replace(DATA_CDN, DATA_RAW), false)
          return
        }
        imageTile.setState(TileState.ERROR)
      }
      img.src = url
    }
    load(src, true)
  })
  return source
}

function categoryOf(id: number) {
  for (const group of categoryGroups.value) {
    const item = group.categories.find(cat => cat.id === id)
    if (item) return { group, item }
  }
  return null
}

function markerStyle(feature: FeatureLike) {
  const categoryId = Number(feature.get("categoryId"))
  if (!enabledTypeIds.value.includes(String(categoryId))) return
  const rec = categoryOf(categoryId)
  const color = rec?.group.color || "555ECB"
  const fill = color.startsWith("#") ? color : `#${color}`
  let styles = styleCache.get(fill)
  if (!styles) {
    styles = [
      new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: fill }),
          stroke: new Stroke({ color: "#fff", width: 1.5 }),
        }),
      }),
    ]
    styleCache.set(fill, styles)
  }
  const title = String(feature.get("title") || "")
  const zoom = olMap?.getView().getZoom() ?? MIN_ZOOM
  if (!title || zoom < 12) return styles
  return [
    ...styles,
    new Style({
      text: new Text({
        text: title,
        font: "12px sans-serif",
        fill: new Fill({ color: "#F7E9D4" }),
        stroke: new Stroke({ color: "#1A0A12", width: 3 }),
        offsetY: 12,
      }),
    }),
  ]
}

function closePopup() {
  popup.value = null
  overlay?.setPosition(undefined)
}

function onFilterChange() {
  closePopup()
  markerLayer?.changed()
}

function switchLayer(id: string) {
  const layerId = id as LayerId
  currentLayer.value = layerId
  tileLayer?.setSource(createSource(layerId))
  overviewLayer?.setSource(createSource(layerId))
}

function onResize() {
  olMap?.updateSize()
}

async function loadData() {
  try {
    const [groups, locations] = await Promise.all([
      fetchJson<CategoryGroup[]>("data/categories.json"),
      fetchJson<LocationItem[]>("data/locations.json"),
    ])
    categoryGroups.value = groups
    enabledTypeIds.value = groups.flatMap(group =>
      group.categories
        .filter(item => DEFAULT_ON.has(item.id))
        .map(item => String(item.id))
    )

    const counts: Record<string, number> = {}
    const features = locations.map(item => {
      counts[item.category_id] = (counts[item.category_id] || 0) + 1
      const rec = categoryOf(item.category_id)
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([Number(item.longitude), Number(item.latitude)])
        ),
      })
      feature.setId(item.id)
      feature.set("categoryId", item.category_id)
      feature.set("title", displayName(item.title, item.title_zh))
      feature.set("info", {
        title: displayName(item.title, item.title_zh),
        category: displayName(rec?.item.title, rec?.item.title_zh),
        desc: item.description ? formatDesc(item.description) : "",
      } satisfies PopupInfo)
      return feature
    })
    locationCounts.value = counts
    markerSource?.clear()
    markerSource?.addFeatures(features)
    markerLayer?.changed()
  } catch {
    loadError.value = "地图数据加载失败，请稍后重试"
  }
}

let resizeObserver: ResizeObserver | undefined

watch(isWebFullScreen, () => {
  nextTick(onResize)
})

onMounted(() => {
  tileLayer = new TileLayer({
    source: createSource(currentLayer.value),
  })
  overviewLayer = new TileLayer({
    source: createSource(currentLayer.value),
  })
  markerSource = new VectorSource()
  markerLayer = new VectorImageLayer({
    source: markerSource,
    style: markerStyle,
    zIndex: 2,
  })
  overlay = new Overlay({
    element: elPopup.value,
    positioning: "bottom-center",
    offset: [0, -10],
    stopEvent: true,
  })

  olMap = new OlMap({
    target: elMap.value,
    layers: [tileLayer, markerLayer],
    overlays: [overlay],
    view: new View({
      center: INIT_CENTER,
      zoom: 10,
      minZoom: MIN_ZOOM,
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
        view: new View({
          extent: EXTENT,
          showFullExtent: true,
          enableRotation: false,
          minZoom: MIN_ZOOM,
          maxZoom: MIN_ZOOM,
        }),
      }),
    ]),
  })

  olMap.on("singleclick", evt => {
    const feature = olMap?.forEachFeatureAtPixel(evt.pixel, hit => hit)
    if (feature) {
      popup.value = (feature.get("info") as PopupInfo) || null
      overlay?.setPosition((feature.getGeometry() as Point).getCoordinates())
      return
    }
    closePopup()
  })

  olMap.on("pointermove", evt => {
    const target = olMap?.getTargetElement()
    if (target) {
      target.style.cursor = olMap?.hasFeatureAtPixel(evt.pixel) ? "pointer" : ""
    }
  })

  olMap.getView().on("change:resolution", () => {
    markerLayer?.changed()
  })

  nextTick(onResize)
  loadData()
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
  overlay = null
})
</script>

<style lang="scss">
.Layout.gta-vc-map {
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
.gta-vc-map-wrap {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 100vh) - var(--vp-nav-height, 64px));
  overflow: hidden;
  background: #12080c;

  &.is-web-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
  }
}

.gta-vc-map-canvas {
  width: 100%;
  height: 100%;
}

.side-panel {
  position: absolute;
  top: 120px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(260px, calc(100% - 24px));
  max-height: calc(100% - 144px);

  :deep(.marker-filter) {
    min-width: 0;
    min-height: 0;
    flex: 1;
  }
}

.marker-popup {
  position: relative;
  min-width: 200px;
  max-width: 300px;
  padding: 12px 28px 12px 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 94%, transparent);
  box-shadow: var(--el-box-shadow);
  color: var(--vp-c-text-1);

  &.hidden {
    display: none;
  }
}

.popup-close {
  position: absolute;
  top: 4px;
  right: 8px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.popup-title {
  font-size: 14px;
  font-weight: 600;
}

.popup-meta {
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.popup-desc {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-line;
}

.load-error {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 1;
  padding: 8px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  color: var(--vp-c-text-1);
  font-size: 12px;
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
  background: #12080c;
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
  .side-panel {
    top: 112px;
    max-height: calc(100% - 240px);
  }
}
</style>
