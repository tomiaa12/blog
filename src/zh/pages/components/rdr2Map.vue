<template>
  <div
    class="rdr2-map-wrap"
    :class="{ 'is-web-fullscreen': isWebFullScreen }"
  >
    <div
      ref="elMap"
      class="rdr2-map-canvas"
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
        <div class="popup-meta">{{ popup.category }} · {{ popup.cycle }}</div>
        <p
          v-if="popup.desc"
          class="popup-desc"
        >
          {{ popup.desc }}
        </p>
        <p
          v-if="popup.tool"
          class="popup-tool"
        >
          {{ popup.tool }}
        </p>
        <div
          v-if="popup.video || popup.videoZh || popup.pinId"
          class="popup-links"
        >
          <a
            v-if="popup.video"
            :href="popup.video"
            target="_blank"
            rel="noreferrer"
          >YouTube</a>
          <a
            v-if="popup.videoZh"
            :href="popup.videoZh"
            target="_blank"
            rel="noreferrer"
          >哔哩哔哩</a>
          <button
            v-if="popup.pinId"
            type="button"
            class="popup-delete"
            @click="removePin(popup.pinId)"
          >
            删除图钉
          </button>
        </div>
      </div>
    </div>

    <MapSwitcher
      :model-value="currentLayer"
      :items="switcherItems"
      size="sm"
      style="--map-switcher-max-width: 420px"
      @update:model-value="switchLayer"
    />

    <div class="side-panel">
      <div class="cycle-bar">
        <div class="cycle-date">{{ cycleLabel }}</div>
        <el-select
          v-model="cycleMode"
          size="small"
          @change="rebuildMarkers"
        >
          <el-option
            label="今日周期"
            value="today"
          />
          <el-option
            v-for="day in 6"
            :key="day"
            :label="`周期 ${day}`"
            :value="String(day)"
          />
        </el-select>
        <button
          type="button"
          class="pin-toggle"
          :class="{ active: pinMode }"
          @click="pinMode = !pinMode"
        >
          {{ pinMode ? "点击地图放置图钉" : "自定义图钉" }}
        </button>
      </div>

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
import MapSwitcher from "./map/MapSwitcher.vue"
import MarkerFilter from "./map/MarkerFilter.vue"
import type { MarkerFilterGroup } from "./map/MarkerFilter.vue"
import "ol/ol.css"
import { Feature, Map as OlMap, Overlay, View } from "ol"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorImageLayer from "ol/layer/VectorImage"
import { defaults, OverviewMap } from "ol/control"
import { TileImage, Vector as VectorSource } from "ol/source"
import TileGrid from "ol/tilegrid/TileGrid"
import Projection from "ol/proj/Projection"
import { addProjection } from "ol/proj"
import { getTopLeft } from "ol/extent"
import { Point } from "ol/geom"
import { Circle, Fill, Icon, Stroke, Style } from "ol/style"
import type { Extent } from "ol/extent"

const DATA_CDN = "https://cdn.jsdelivr.net/gh/jeanropke/RDR2CollectorsMap@master"
const DATA_RAW = "https://raw.githubusercontent.com/jeanropke/RDR2CollectorsMap/master"
const RDO_CDN = "https://cdn.jsdelivr.net/gh/tomiaa12/RDOMap@master"
const RDO_RAW = "https://raw.githubusercontent.com/tomiaa12/RDOMap/master"
const TILE_CDN = "https://map-tiles.b-cdn.net/assets/rdr3/webp"
const OFFICIAL_TILE = "https://s.rsg.sc/sc/images/games/RDR2/map/game"
const NAZAR_API = "https://pepegapi.jeanropke.net/v2/rdo/nazar"
const PIN_KEY = "rdr2-map-user-pins"

const EXTENT: Extent = [0, -144, 176, 0]
const RESOLUTIONS = [1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125]
const MIN_ZOOM = 2
const MAX_ZOOM = 7
const TILE_SIZE = 256

const layers = [
  { id: "official", name: "官方" },
  { id: "detailed", name: "详细" },
  { id: "dark", name: "暗色" },
  { id: "black", name: "黑色" },
] as const

type LayerId = (typeof layers)[number]["id"]

const COLLECTIBLE_IDS = [
  "coastal",
  "oceanic",
  "megafauna",
  "flower",
  "cups",
  "swords",
  "wands",
  "pentacles",
  "bracelet",
  "earring",
  "necklace",
  "ring",
  "bottle",
  "egg",
  "arrowhead",
  "heirlooms",
  "coin",
  "random",
] as const

const UTILITY_IDS = [
  "nazar",
  "fast_travel",
  "user_pins",
  "random_encounter",
  "treasure",
  "legendary_animals",
] as const

const RDO_LAYER_IDS = [
  "plants",
  "shops",
  "campfires",
  "boats",
  "trains",
  "hideouts",
  "dynamic_bounties",
  "gfh",
  "bounties",
  "camps",
  "sightseeing",
  "daily_locations",
  "harrietum_animals",
  "singleplayer",
  "animal_spawns",
] as const

const RDO_ITEM_KEYS = [
  "campfires",
  "boats",
  "trains",
  "hideouts",
  "dynamic_bounties",
  "sightseeing",
  "daily_locations",
  "harrietum_animals",
] as const

const CYCLE_FIELD: Record<string, string> = {
  flower: "flower",
  bottle: "bottle",
  arrowhead: "arrowhead",
  egg: "egg",
  coin: "coin",
  heirlooms: "heirlooms",
  cups: "tarot_cards",
  pentacles: "tarot_cards",
  swords: "tarot_cards",
  wands: "tarot_cards",
  jewelry_random: "lost_jewelry",
  bracelet: "lost_jewelry",
  earring: "lost_jewelry",
  necklace: "lost_jewelry",
  ring: "lost_jewelry",
  fossils_random: "fossils",
  random: "random",
}

const CATEGORY_FALLBACK: Record<string, string> = {
  coastal: "海岸化石",
  oceanic: "海洋化石",
  megafauna: "大型动物化石",
  flower: "美洲野花",
  bottle: "古董酒",
  arrowhead: "箭头",
  egg: "鸟蛋",
  coin: "硬币",
  heirlooms: "传家宝",
  cups: "圣杯牌组塔罗牌",
  pentacles: "星币牌组塔罗牌",
  swords: "宝剑牌组塔罗牌",
  wands: "权杖牌组塔罗牌",
  bracelet: "遗失珠宝手镯",
  earring: "遗失珠宝耳环",
  necklace: "遗失珠宝项链",
  ring: "遗失珠宝戒指",
  random: "随机收藏品地点",
  fast_travel: "快速旅行",
  treasure: "藏宝图",
  nazar: "纳扎尔夫人",
  user_pins: "自定义坐标点",
  random_encounter: "随机遭遇任务点",
  legendary_animals: "传说动物",
  plants: "植物",
  shops: "商店",
  campfires: "营火",
  boats: "船",
  trains: "火车",
  hideouts: "藏身处",
  dynamic_bounties: "动态赏金",
  gfh: "自由模式任务",
  bounties: "赏金",
  camps: "玩家营地",
  sightseeing: "观景台",
  daily_locations: "每日挑战地点",
  harrietum_animals: "哈莉特动物",
  singleplayer: "故事模式",
  animal_spawns: "动物",
}

const MENU_ICON: Record<string, string> = {
  user_pins: "pins",
  random_encounter: "random_encounter",
  treasure: "treasure",
  plants: "plants",
  shops: "general_store",
  gfh: "gfh",
  bounties: "bounty",
  camps: "camps",
  daily_locations: "daily_locations",
  harrietum_animals: "harrietum_animals",
  singleplayer: "singleplayer",
  animal_spawns: "animal",
}

const RDO_ICON_IDS = new Set<string>([
  ...RDO_LAYER_IDS,
  "general_store",
  "bounty",
  "plants",
  "gfh",
  "camps",
  "daily_locations",
  "harrietum_animals",
  "singleplayer",
  "sightseeing",
  "dynamic_bounties",
  "campfires",
  "boats",
  "trains",
  "hideouts",
  "animal",
])

const NAZAR_LOCATIONS = [
  { key: "MPSW_LOCATION_00", lat: -123.9039, lng: 34.8213 },
  { key: "MPSW_LOCATION_01", lat: -100.0742, lng: 49.0765 },
  { key: "MPSW_LOCATION_02", lat: -104.7679, lng: 85.7222 },
  { key: "MPSW_LOCATION_03", lat: -84.2973, lng: 82.4512 },
  { key: "MPSW_LOCATION_04", lat: -56.1619, lng: 78.5 },
  { key: "MPSW_LOCATION_05", lat: -60.9622, lng: 130.6067 },
  { key: "MPSW_LOCATION_06", lat: -63.8927, lng: 105.3496 },
  { key: "MPSW_LOCATION_07", lat: -43.1046, lng: 132.8263 },
  { key: "MPSW_LOCATION_08", lat: -90.0802, lng: 135.6969 },
  { key: "MPSW_LOCATION_09", lat: -65.9688, lng: 150.4468 },
  { key: "MPSW_LOCATION_10", lat: -40.7817, lng: 109.4863 },
  { key: "MPSW_LOCATION_11", lat: -36.5097, lng: 154.1859 },
]

type CycleRow = Record<string, number | string> & { date: string }
type LangMap = Record<string, string>
type ItemSpot = {
  text: string
  lat: number
  lng: number
  tool?: number
  video?: string
  "video_zh-Hans"?: string
}
type ItemsData = Record<string, Record<string, ItemSpot[]>>
type FastTravel = { text: string; x: number; y: number }
type Treasure = {
  text: string
  x: number
  y: number
  locations: { x: number; y: number }[]
}
type Legendary = {
  text: string
  x: number
  y: number
  animal_name?: string
  preferred_weather?: string
  spawn_time?: number[][]
  locations: { text: string; x: number; y: number }[]
}
type EncounterGroup = {
  key: string
  locations: { text?: string; x: number; y: number; locations?: { x: number; y: number }[] }[]
}
type AnimalSpawnPoint = { x: number; y: number; start?: number; end?: number }
type AnimalSpawnsData = Record<string, AnimalSpawnPoint[]>
type UserPin = { id: string; lat: number; lng: number; title: string }
type MenuItem = { id: string; name: string; count: number; icon: string }
type MenuGroup = { id: string; name: string; items: MenuItem[] }
type PopupInfo = {
  title: string
  category: string
  cycle: string
  desc: string
  tool: string
  video: string
  videoZh: string
  pinId?: string
}

const elMap = ref<HTMLElement>()
const { isWebFullScreen } = useWebFullScreen()
const elPopup = ref<HTMLElement>()
const currentLayer = ref<LayerId>("detailed")
const cycleMode = ref("today")
const cycleDate = ref("")
const menuGroups = ref<MenuGroup[]>([])
const enabledTypeIds = ref<string[]>([...COLLECTIBLE_IDS, ...UTILITY_IDS])
const popup = ref<PopupInfo | null>(null)
const loadError = ref("")
const pinMode = ref(false)
const userPins = ref<UserPin[]>(loadPins())

const cycleLabel = computed(() =>
  cycleDate.value ? `周期数据 ${cycleDate.value}` : "周期数据加载中"
)

const switcherItems = computed(() =>
  layers.map(item => ({
    id: item.id,
    name: item.name,
    preview: previewUrl(item.id),
  }))
)

const filterGroups = computed<MarkerFilterGroup[]>(() =>
  menuGroups.value.map(group => ({
    id: group.id,
    name: group.name,
    items: group.items.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
      icon: iconUrl(item.icon),
    })),
  }))
)

const projection = new Projection({
  code: "RDR2-MAP",
  units: "pixels",
  extent: EXTENT,
})
addProjection(projection)

let olMap: OlMap | null = null
let tileLayer: TileLayer<TileImage> | null = null
let overviewLayer: TileLayer<TileImage> | null = null
let markerLayer: VectorLayer<VectorSource> | null = null
let markerSource: VectorSource | null = null
let animalSpawnLayer: VectorImageLayer<VectorSource> | null = null
let animalSpawnSource: VectorSource | null = null
let overlay: Overlay | null = null
const animalSpawnStyle = new Style({
  image: new Circle({
    radius: 3,
    fill: new Fill({ color: "rgba(180, 90, 40, 0.8)" }),
    stroke: new Stroke({ color: "rgba(80, 40, 20, 0.95)", width: 1 }),
  }),
})

const iconStyles = new window.Map<string, Style>()
let lang: LangMap = {}
let rdoLang: LangMap = {}
let items: ItemsData = {}
let cycles: CycleRow[] = []
let fastTravels: FastTravel[] = []
let treasures: Treasure[] = []
let legendaries: Legendary[] = []
let encounters: EncounterGroup[] = []
let rdoItems: EncounterGroup[] = []
let plants: EncounterGroup[] = []
let shops: EncounterGroup[] = []
let bounties: EncounterGroup[] = []
let gfh: EncounterGroup[] = []
let camps: EncounterGroup[] = []
let singleplayer: EncounterGroup[] = []
let nazarKey = ""
let animalSpawnCount = 0
let animalSpawnsLoaded = false
let animalSpawnsLoading = false

function loadPins(): UserPin[] {
  try {
    const raw = localStorage.getItem(PIN_KEY)
    return raw ? (JSON.parse(raw) as UserPin[]) : []
  } catch {
    return []
  }
}

function savePins() {
  localStorage.setItem(PIN_KEY, JSON.stringify(userPins.value))
}

function iconUrl(id: string) {
  const base = RDO_ICON_IDS.has(id) ? RDO_CDN : DATA_CDN
  return `${base}/assets/images/icons/${id}.png`
}

function previewUrl(id: LayerId) {
  if (id === "official") return `${OFFICIAL_TILE}/2/1/1.jpg`
  const folder = id === "detailed" ? "detailed" : id === "dark" ? "darkmode" : "black"
  return `${TILE_CDN}/${folder}/2/1_1.webp`
}

function tileUrl(layerId: LayerId, z: number, x: number, y: number) {
  if (layerId === "official") return `${OFFICIAL_TILE}/${z}/${x}/${y}.jpg`
  const folder =
    layerId === "detailed" ? "detailed" : layerId === "dark" ? "darkmode" : "black"
  return `${TILE_CDN}/${folder}/${z}/${x}_${y}.webp`
}

function maxTile(z: number, size: number) {
  return Math.ceil((size * 2 ** z) / TILE_SIZE) - 1
}

function createTileGrid(minZoom = 0) {
  return new TileGrid({
    extent: EXTENT,
    origin: getTopLeft(EXTENT),
    resolutions: RESOLUTIONS,
    minZoom,
    tileSize: TILE_SIZE,
  })
}

function createSource(layerId: LayerId) {
  // 主图 minZoom=2，但右下角缩略图需要更小级别：官方有 0 级，自定义瓦片从 1 级开始
  const gridMinZoom = layerId === "official" ? 0 : 1
  return new TileImage({
    projection,
    tileGrid: createTileGrid(gridMinZoom),
    wrapX: false,
    tileUrlFunction(tileCoord) {
      if (!tileCoord) return undefined
      const z = tileCoord[0]
      const x = tileCoord[1]
      const y = tileCoord[2]
      if (z < gridMinZoom || z > MAX_ZOOM) return undefined
      if (x < 0 || x > maxTile(z, 176) || y < 0 || y > maxTile(z, 144)) {
        return undefined
      }
      return tileUrl(layerId, z, x, y)
    },
  })
}

function resolveCategoryName(id: string) {
  const key =
    id === "nazar"
      ? "menu.madam_nazar"
      : id === "treasure"
        ? "menu.treasures"
        : id === "random"
          ? "menu.random_spots"
          : id === "random_encounter"
            ? "menu.random_encounters"
            : id === "user_pins"
              ? "menu.user_pins"
              : id === "daily_locations"
                ? "menu.daily_locations.name"
                : id === "animal_spawns"
                  ? "menu.animals"
                  : `menu.${id}`
  return lang[key] || rdoLang[key] || rdoLang[`menu.${id}.name`] || CATEGORY_FALLBACK[id] || id
}

function itemName(text: string, category: string) {
  const itemId = text.replace(/_\d+$/, "")
  return (
    lang[`${itemId}.name`] ||
    lang[`${text}.name`] ||
    lang[text] ||
    rdoLang[`map.${category}.name`] ||
    rdoLang[`menu.${category}`] ||
    resolveCategoryName(category)
  )
}

function itemDesc(text: string, cycle: string) {
  return lang[`${text}_${cycle}.desc`] || lang[`${text}.desc`] || ""
}

function toolLabel(tool?: number) {
  if (tool === 1) return "工具：铁锹"
  if (tool === 2) return "工具：金属探测器"
  return ""
}

function spawnTimeLabel(ranges?: number[][]) {
  if (!ranges?.length) return ""
  return `偏好时间：${ranges
    .map(
      ([start, end]) =>
        `${String(start).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`
    )
    .join("、")}`
}

function styleFor(icon: string) {
  let style = iconStyles.get(icon)
  if (!style) {
    style = new Style({
      image: new Icon({
        src: iconUrl(icon),
        anchor: [0.5, 1],
        width: 28,
        height: 28,
      }),
    })
    iconStyles.set(icon, style)
  }
  return style
}

function isTypeVisible(typeId: string) {
  if (typeId === "fossils_random") {
    return ["coastal", "oceanic", "megafauna"].some(id =>
      enabledTypeIds.value.includes(id)
    )
  }
  if (typeId === "jewelry_random") {
    return ["bracelet", "earring", "necklace", "ring"].some(id =>
      enabledTypeIds.value.includes(id)
    )
  }
  return enabledTypeIds.value.includes(typeId)
}

function markerStyle(feature: Feature<Point>) {
  const typeId = feature.get("typeId") as string
  if (!isTypeVisible(typeId)) return
  return styleFor((feature.get("icon") as string) || typeId)
}

function fitMap() {
  if (!olMap) return
  olMap.updateSize()
  const size = olMap.getSize()
  if (!size || !size[0] || !size[1]) return
  olMap.getView().fit(EXTENT, { size, padding: [16, 16, 16, 16] })
}

async function fetchJson<T>(urls: string[]) {
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (res.ok) return (await res.json()) as T
    } catch {
      /* try next */
    }
  }
  throw new Error("data load failed")
}

function dataUrls(path: string) {
  return [`${DATA_CDN}/${path}`, `${DATA_RAW}/${path}`]
}

function rdoUrls(path: string) {
  return [`${RDO_CDN}/${path}`, `${RDO_RAW}/${path}`]
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10)
}

function currentCycles(): CycleRow {
  const fallback: CycleRow = {
    date: todayUtc(),
    flower: 1,
    bottle: 1,
    arrowhead: 1,
    egg: 1,
    coin: 1,
    heirlooms: 1,
    lost_jewelry: 1,
    random: 1,
    tarot_cards: 1,
    fossils: 1,
  }
  const today = todayUtc()
  return cycles.find(row => row.date === today) || cycles.at(-1) || fallback
}

function cycleFor(category: string) {
  if (cycleMode.value !== "today") return cycleMode.value
  const field = CYCLE_FIELD[category]
  if (!field) return "1"
  return String(currentCycles()[field] || 1)
}

function addFeature(
  features: Feature<Point>[],
  counts: window.Map<string, number>,
  opts: {
    id: string
    typeId: string
    icon?: string
    lng: number
    lat: number
    title: string
    desc?: string
    tool?: string
    video?: string
    videoZh?: string
    cycle?: string
    pinId?: string
    countAs?: string[]
  }
) {
  for (const key of opts.countAs || [opts.typeId]) {
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  const feature = new Feature({
    geometry: new Point([opts.lng, opts.lat]),
  })
  feature.setId(opts.id)
  feature.set("typeId", opts.typeId)
  feature.set("icon", opts.icon || opts.typeId)
  feature.set("info", {
    title: opts.title,
    category: resolveCategoryName(opts.typeId),
    cycle: opts.cycle ? `周期 ${opts.cycle}` : resolveCategoryName(opts.typeId),
    desc: opts.desc || "",
    tool: opts.tool || "",
    video: opts.video || "",
    videoZh: opts.videoZh || "",
    pinId: opts.pinId,
  } satisfies PopupInfo)
  features.push(feature)
}

function addLocationGroups(
  features: Feature<Point>[],
  counts: window.Map<string, number>,
  groups: EncounterGroup[],
  typeId: string,
  icon = typeId
) {
  for (const group of groups) {
    const title =
      rdoLang[`map.${group.key}.name`] ||
      rdoLang[`menu.${group.key}`] ||
      rdoLang[`${group.key}.name`] ||
      resolveCategoryName(typeId)
    const desc = rdoLang[`map.${group.key}.desc`] || rdoLang[`${group.key}.desc`] || ""
    for (const [index, point] of (group.locations || []).entries()) {
      const nested = point.locations?.length ? point.locations : [point]
      nested.forEach((spot, spotIndex) => {
        addFeature(features, counts, {
          id: `${typeId}_${group.key}_${point.text || index}_${spotIndex}`,
          typeId,
          icon,
          lng: spot.y,
          lat: spot.x,
          title: point.text
            ? rdoLang[`${point.text}.name`] || rdoLang[point.text] || title
            : title,
          desc,
        })
      })
    }
  }
}

function rebuildMarkers() {
  if (!markerSource) return
  const row = currentCycles()
  cycleDate.value = row.date
  const counts = new window.Map<string, number>()
  const features: Feature<Point>[] = []

  for (const category of Object.keys(items)) {
    const day = cycleFor(category)
    const spots = items[category]?.[day] || []
    const countAs =
      category === "fossils_random"
        ? ["coastal", "oceanic", "megafauna"]
        : category === "jewelry_random"
          ? ["bracelet", "earring", "necklace", "ring"]
          : [category]
    for (const spot of spots) {
      addFeature(features, counts, {
        id: `${spot.text}_${day}`,
        typeId: category,
        lng: spot.lng,
        lat: spot.lat,
        title: itemName(spot.text, category),
        desc: itemDesc(spot.text, day),
        tool: toolLabel(spot.tool),
        video: spot.video,
        videoZh: spot["video_zh-Hans"],
        cycle: day,
        countAs,
      })
    }
  }

  for (const item of fastTravels) {
    addFeature(features, counts, {
      id: item.text,
      typeId: "fast_travel",
      lng: item.y,
      lat: item.x,
      title: lang[`${item.text}.name`] || item.text,
    })
  }

  for (const item of treasures) {
    const title = lang[item.text] || item.text
    const points = item.locations?.length ? item.locations : [{ x: item.x, y: item.y }]
    points.forEach((point, index) => {
      addFeature(features, counts, {
        id: `${item.text}_${index}`,
        typeId: "treasure",
        lng: point.y,
        lat: point.x,
        title,
        desc: lang[`${item.text}.desc`] || "",
      })
    })
  }

  const nazar = NAZAR_LOCATIONS.find(item => item.key === nazarKey)
  if (nazar) {
    addFeature(features, counts, {
      id: "nazar",
      typeId: "nazar",
      lng: nazar.lng,
      lat: nazar.lat,
      title: lang["menu.madam_nazar"] || "纳扎尔夫人",
      desc: lang["map.madam_nazar.desc"] || "",
    })
  }

  for (const animal of legendaries) {
    const title = lang[animal.text] || animal.animal_name || animal.text
    const weather = animal.preferred_weather
      ? lang[`map.weather.${animal.preferred_weather}`] || animal.preferred_weather
      : ""
    const desc = [
      lang[`${animal.text}.desc`] || "",
      weather ? `偏好天气：${weather}` : "",
      spawnTimeLabel(animal.spawn_time),
    ]
      .filter(Boolean)
      .join("\n")
    const points = animal.locations?.length
      ? animal.locations
      : [{ text: animal.text, x: animal.x, y: animal.y }]
    points.forEach((point, index) => {
      addFeature(features, counts, {
        id: `${animal.text}_${index}`,
        typeId: "legendary_animals",
        lng: point.y,
        lat: point.x,
        title,
        desc,
      })
    })
  }

  addLocationGroups(features, counts, encounters, "random_encounter", "random_encounter")
  addLocationGroups(features, counts, plants, "plants", "plants")
  addLocationGroups(features, counts, shops, "shops", "general_store")
  addLocationGroups(features, counts, bounties, "bounties", "bounty")
  addLocationGroups(features, counts, gfh, "gfh", "gfh")
  addLocationGroups(features, counts, camps, "camps", "camps")
  addLocationGroups(features, counts, singleplayer, "singleplayer", "singleplayer")

  for (const key of RDO_ITEM_KEYS) {
    addLocationGroups(
      features,
      counts,
      rdoItems.filter(item => item.key === key),
      key,
      key
    )
  }

  for (const pin of userPins.value) {
    addFeature(features, counts, {
      id: pin.id,
      typeId: "user_pins",
      icon: "pins",
      lng: pin.lng,
      lat: pin.lat,
      title: pin.title,
      pinId: pin.id,
    })
  }

  const toMenuItem = (id: string): MenuItem => ({
    id,
    name: resolveCategoryName(id),
    count: id === "animal_spawns" ? animalSpawnCount : counts.get(id) || 0,
    icon: MENU_ICON[id] || id,
  })

  menuGroups.value = [
    {
      id: "collectibles",
      name: "收藏品",
      items: COLLECTIBLE_IDS.map(toMenuItem),
    },
    {
      id: "utilities",
      name: "实用工具",
      items: UTILITY_IDS.map(toMenuItem),
    },
    {
      id: "rdo",
      name: "线上地图",
      items: RDO_LAYER_IDS.map(toMenuItem),
    },
  ]

  markerSource.clear()
  markerSource.addFeatures(features)
  markerLayer?.changed()
}

async function loadData() {
  const [
    itemsData,
    cyclesData,
    langData,
    travelData,
    treasureData,
    legendaryData,
    encounterData,
    rdoLangData,
    rdoItemsData,
    plantsData,
    shopsData,
    bountiesData,
    gfhData,
    campsData,
    singleplayerData,
  ] = await Promise.all([
    fetchJson<ItemsData>(dataUrls("data/items.json")),
    fetchJson<CycleRow[]>(dataUrls("data/cycles.json")),
    fetchJson<LangMap>(dataUrls("langs/zh_Hans.json")),
    fetchJson<FastTravel[]>(dataUrls("data/fasttravels.json")),
    fetchJson<Treasure[]>(dataUrls("data/treasures.json")),
    fetchJson<Legendary[]>(dataUrls("data/animal_legendary.json")),
    fetchJson<EncounterGroup[]>(rdoUrls("data/encounters.json")).catch(() => []),
    fetchJson<LangMap>(rdoUrls("langs/zh_Hans.json")).catch(() => ({})),
    fetchJson<EncounterGroup[]>(rdoUrls("data/items.json")).catch(() => []),
    fetchJson<EncounterGroup[]>(rdoUrls("data/plants.json")).catch(() => []),
    fetchJson<EncounterGroup[]>(rdoUrls("data/shops.json")).catch(() => []),
    fetchJson<EncounterGroup[]>(rdoUrls("data/bounties.json")).catch(() => []),
    fetchJson<EncounterGroup[]>(rdoUrls("data/gfh.json")).catch(() => []),
    fetchJson<EncounterGroup[]>(rdoUrls("data/camps.json")).catch(() => []),
    fetchJson<EncounterGroup[]>(rdoUrls("data/singleplayer.json")).catch(() => []),
  ])
  items = itemsData
  cycles = cyclesData
  lang = langData
  fastTravels = travelData
  treasures = treasureData
  legendaries = legendaryData
  encounters = encounterData
  rdoLang = rdoLangData
  rdoItems = rdoItemsData
  plants = plantsData
  shops = shopsData
  bounties = bountiesData
  gfh = gfhData
  camps = campsData
  singleplayer = singleplayerData

  try {
    const nazar = await fetchJson<{ nazar?: string }>([NAZAR_API])
    nazarKey = nazar.nazar || ""
  } catch {
    nazarKey = ""
  }

  rebuildMarkers()
}

function animalSpawnName(groupKey: string) {
  const raw = groupKey.replace(/^ANIMALS?_/, "").toLowerCase()
  const keys = [
    `menu.cmpndm.animal_${raw}`,
    `menu.cmpndm.animal_${raw.replace(/s$/, "")}`,
    `menu.cmpndm.${raw}`,
  ]
  for (const key of keys) {
    if (rdoLang[key]) return rdoLang[key]
  }
  return raw.replace(/_/g, " ")
}

function animalSpawnTitle(name: string) {
  return (rdoLang["map.animal_spawns.name"] || "{animal} 刷出位置").replace("{animal}", name)
}

function animalSpawnDesc(name: string, point: AnimalSpawnPoint) {
  if (point.start != null && point.end != null) {
    return (rdoLang["map.animal_spawns_timed.desc"] || "这是一个{animal}的固定刷新点。只在 {start} 到 {end} 期间刷新，但不保证一定会出现。")
      .replace("{animal}", name)
      .replace("{start}", `${String(point.start).padStart(2, "0")}:00`)
      .replace("{end}", `${String(point.end).padStart(2, "0")}:00`)
  }
  return (rdoLang["map.animal_spawns.desc"] || "这是一个{animal}的固定刷新点。全天候都会刷新，但不保证一定会出现。").replace(
    "{animal}",
    name
  )
}

function syncAnimalSpawnLayer() {
  const visible = enabledTypeIds.value.includes("animal_spawns")
  animalSpawnLayer?.setVisible(visible)
  if (visible) void ensureAnimalSpawns()
}

async function ensureAnimalSpawns() {
  if (animalSpawnsLoaded || animalSpawnsLoading || !animalSpawnSource) return
  animalSpawnsLoading = true
  try {
    const data = await fetchJson<AnimalSpawnsData>(rdoUrls("data/animal_spawns.json"))
    const features: Feature<Point>[] = []
    let count = 0
    for (const [key, points] of Object.entries(data)) {
      const name = animalSpawnName(key)
      const title = animalSpawnTitle(name)
      for (const [index, point] of (points || []).entries()) {
        const feature = new Feature({
          geometry: new Point([point.y, point.x]),
        })
        feature.setId(`animal_spawns_${key}_${index}`)
        feature.set("typeId", "animal_spawns")
        feature.set("info", {
          title,
          category: resolveCategoryName("animal_spawns"),
          cycle: name,
          desc: animalSpawnDesc(name, point),
          tool: "",
          video: "",
          videoZh: "",
        } satisfies PopupInfo)
        features.push(feature)
        count++
      }
    }
    animalSpawnSource.clear()
    animalSpawnSource.addFeatures(features)
    animalSpawnCount = count
    animalSpawnsLoaded = true
    const group = menuGroups.value.find(item => item.id === "rdo")
    const item = group?.items.find(entry => entry.id === "animal_spawns")
    if (item) item.count = count
  } catch {
    loadError.value = "动物刷新点加载失败"
  } finally {
    animalSpawnsLoading = false
  }
}

function onFilterChange() {
  markerLayer?.changed()
  syncAnimalSpawnLayer()
}

function switchLayer(id: string) {
  const layerId = id as LayerId
  currentLayer.value = layerId
  tileLayer?.setSource(createSource(layerId))
  overviewLayer?.setSource(createSource(layerId))
}

function closePopup() {
  popup.value = null
  overlay?.setPosition(undefined)
}

function addPin(lng: number, lat: number) {
  const pin: UserPin = {
    id: `pin_${Date.now()}`,
    lat,
    lng,
    title: `图钉 ${userPins.value.length + 1}`,
  }
  userPins.value = [...userPins.value, pin]
  savePins()
  rebuildMarkers()
  if (!enabledTypeIds.value.includes("user_pins")) {
    enabledTypeIds.value = [...enabledTypeIds.value, "user_pins"]
  }
}

function removePin(id: string) {
  userPins.value = userPins.value.filter(item => item.id !== id)
  savePins()
  closePopup()
  rebuildMarkers()
}

function onResize() {
  olMap?.updateSize()
}

let resizeObserver: ResizeObserver | undefined

watch(isWebFullScreen, () => {
  nextTick(onResize)
})

onMounted(async () => {
  tileLayer = new TileLayer({
    source: createSource(currentLayer.value),
  })
  overviewLayer = new TileLayer({
    source: createSource(currentLayer.value),
  })
  markerSource = new VectorSource()
  markerLayer = new VectorLayer({
    source: markerSource,
    style: feature => markerStyle(feature as Feature<Point>),
    zIndex: 2,
  })
  animalSpawnSource = new VectorSource()
  animalSpawnLayer = new VectorImageLayer({
    source: animalSpawnSource,
    style: animalSpawnStyle,
    visible: false,
    zIndex: 1,
  })
  overlay = new Overlay({
    element: elPopup.value,
    positioning: "bottom-center",
    offset: [0, -16],
    stopEvent: true,
  })

  olMap = new OlMap({
    target: elMap.value,
    layers: [tileLayer, animalSpawnLayer, markerLayer],
    overlays: [overlay],
    view: new View({
      projection,
      center: [88, -72],
      zoom: 3,
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
          projection,
          extent: EXTENT,
          showFullExtent: true,
          enableRotation: false,
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
    if (pinMode.value) {
      addPin(evt.coordinate[0], evt.coordinate[1])
      return
    }
    closePopup()
  })

  olMap.on("pointermove", evt => {
    const hit = olMap?.hasFeatureAtPixel(evt.pixel)
    const target = olMap?.getTargetElement()
    if (target) {
      target.style.cursor = hit || pinMode.value ? "pointer" : ""
    }
  })

  nextTick(fitMap)
  window.addEventListener("resize", onResize)
  if (elMap.value) {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(elMap.value)
  }

  try {
    await loadData()
  } catch {
    loadError.value = "点位数据加载失败，底图仍可浏览"
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
  animalSpawnLayer = null
  animalSpawnSource = null
  overlay = null
})
</script>

<style lang="scss">
.Layout.rdr2-map {
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
.rdr2-map-wrap {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 100vh) - var(--vp-nav-height, 64px));
  overflow: hidden;
  background: #d2b790;

  &.is-web-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
  }
}

.rdr2-map-canvas {
  width: 100%;
  height: 100%;
}

.side-panel {
  position: absolute;
  top: 132px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(260px, calc(100% - 24px));
  max-height: calc(100% - 160px);

  :deep(.marker-filter) {
    min-width: 0;
    min-height: 0;
    flex: 1;
  }
}

.cycle-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: var(--el-box-shadow-light);
}

.cycle-date {
  color: var(--vp-c-text-1);
  font-size: 12px;
}

.pin-toggle {
  padding: 6px 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;

  &.active {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}

.marker-popup {
  position: relative;
  min-width: 200px;
  max-width: 280px;
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

.popup-meta,
.popup-tool {
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

.popup-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;

  a {
    color: var(--vp-c-brand-1);
  }
}

.popup-delete {
  padding: 0;
  border: 0;
  background: none;
  color: var(--vp-c-danger-1, #f56c6c);
  font-size: 12px;
  cursor: pointer;
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
  background: #d2b790;
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
    max-height: calc(100% - 280px);
  }
}
</style>
