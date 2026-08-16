<template>
  <div
    class="botw-map-wrap"
    :class="{ 'is-web-fullscreen': isWebFullScreen }"
  >
    <div
      ref="elMap"
      class="botw-map-canvas"
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
import MarkerFilter from "./map/MarkerFilter.vue"
import namesZh from "./map/botwNamesZh.json"
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
  "https://cdn.jsdelivr.net/gh/tomiaa12/zelda-botw-hyrule-map-tile@master"
const DATA_RAW =
  "https://raw.githubusercontent.com/tomiaa12/zelda-botw-hyrule-map-tile/master"

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
const MAX_ZOOM = 17
const INIT_CENTER = fromLonLat([-0.7335226638545, 0.74550224781725])

const TILE_BOUNDS: Record<
  number,
  { minX: number; maxX: number; minY: number; maxY: number }
> = {
  9: { minX: 254, maxX: 255, minY: 254, maxY: 255 },
  10: { minX: 508, maxX: 511, minY: 508, maxY: 511 },
  11: { minX: 1016, maxX: 1023, minY: 1016, maxY: 1023 },
  12: { minX: 2032, maxX: 2047, minY: 2032, maxY: 2047 },
  13: { minX: 4064, maxX: 4095, minY: 4064, maxY: 4095 },
  14: { minX: 8128, maxX: 8191, minY: 8128, maxY: 8191 },
  15: { minX: 16256, maxX: 16383, minY: 16256, maxY: 16383 },
  16: { minX: 32512, maxX: 32767, minY: 32512, maxY: 32767 },
  17: { minX: 65024, maxX: 65535, minY: 65024, maxY: 65535 },
}

const DEFAULT_ON = new Set([
  7840, 7839, 6821, 6819, 6820, 6815, 6816, 6817, 6824, 6818, 6823, 7843, 6838,
  6842, 6840, 6839, 6859, 6845, 6846, 6847,
])

const TEXT_MIN_ZOOM: Record<number, number> = {
  7847: 12,
  6812: 13,
  7840: 9,
  7839: 10,
}

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

function useChinese() {
  const current = lang.value || "zh-CN"
  return current === "zh-CN" || current.startsWith("zh")
}

function displayName(en?: string, zh?: string) {
  if (!useChinese()) return en || ""
  return zh || (en && (NAMES_ZH[en] || zhName(en))) || en || ""
}
const enabledTypeIds = ref<string[]>([])
const categoryGroups = ref<CategoryGroup[]>([])
const locationCounts = ref<Record<string, number>>({})
const loadError = ref("")
const popup = ref<PopupInfo | null>(null)

const filterGroups = computed<MarkerFilterGroup[]>(() =>
  categoryGroups.value.map(group => ({
    id: String(group.id),
    name: displayName(group.title, group.title_zh || zhName(group.title)),
    items: group.categories.map(item => ({
      id: String(item.id),
      name: displayName(item.title, item.title_zh || zhName(item.title)),
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

function tileUrl(base: string, z: number, x: number, y: number) {
  return `${base}/tiles/default-v1/${z}/${x}/${y}.jpg`
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

function createSource() {
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
      return tileUrl(DATA_CDN, z, x, y)
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
  const zoom = olMap?.getView().getZoom() ?? MIN_ZOOM
  const rec = categoryOf(categoryId)
  const display = rec?.item.display_type || "marker"
  const color = rec?.group.color || "A3954F"
  const fill = color.startsWith("#") ? color : `#${color}`
  const showText = display.includes("text") && zoom >= (TEXT_MIN_ZOOM[categoryId] ?? 12)
  const showMarker = display.includes("marker") || !display.includes("text")
  const key = `${fill}|${showMarker ? 1 : 0}|${showText ? 1 : 0}`
  let styles = styleCache.get(key)
  if (!styles) {
    styles = []
    if (showMarker) {
      styles.push(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: fill }),
            stroke: new Stroke({ color: "#fff", width: 1.5 }),
          }),
        })
      )
    }
    styleCache.set(key, styles)
  }
  if (!showText) return styles
  return [
    ...styles,
    new Style({
      text: new Text({
        text: String(feature.get("title") || ""),
        font: "12px sans-serif",
        fill: new Fill({ color: "#E4E0DD" }),
        stroke: new Stroke({ color: "#0A0201", width: 3 }),
        offsetY: showMarker ? 12 : 0,
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
      feature.set(
        "title",
        displayName(item.title, item.title_zh)
      )
      feature.set("info", {
        title: displayName(item.title, item.title_zh),
        category: displayName(
          rec?.item.title,
          rec?.item.title_zh || zhName(rec?.item.title || "")
        ),
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
    source: createSource(),
  })
  overviewLayer = new TileLayer({
    source: createSource(),
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
      zoom: 13,
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

function zhName(name: string) {
  return NAME_ZH[name] || name
}

const NAME_ZH: Record<string, string> = {
  Locations: "地点",
  Services: "服务",
  Collectibles: "收集品",
  Treasure: "宝物",
  Quests: "任务",
  Enemies: "敌人",
  Other: "其他",
  "Ore Deposits": "矿石",
  Materials: "材料",
  Creatures: "生物",
  Area: "地区",
  "Divine Beast": "神兽",
  "Goddess Statue": "女神像",
  "Great Fairy": "大精灵",
  Landmark: "地标",
  "Point of Interest": "兴趣点",
  Province: "省份",
  Raft: "木筏",
  Region: "区域",
  Settlement: "聚落",
  "Sheikah Tower": "希卡塔",
  Shrine: "神庙",
  "Tech Lab": "研究所",
  Village: "村庄",
  "Armor Shop": "防具店",
  "Dye Shop": "染色店",
  "Fang and Bone": "克尔顿的店",
  "General Store": "杂货店",
  Hestu: "阿沅",
  Inn: "旅馆",
  "Jewelry Shop": "珠宝店",
  "Mini-Game": "小游戏",
  Stable: "驿站",
  "Key Item": "关键道具",
  "Korok Seed": "克洛格种子",
  "Voice Memory": "语音记忆",
  Armor: "防具",
  "Arrow Chest": "箭矢箱",
  Blupee: "卢米",
  Gem: "宝石",
  Rupees: "卢比",
  Shield: "盾",
  "Treasure Chest": "宝箱",
  Weapon: "武器",
  "Main Quest": "主线任务",
  Memory: "记忆",
  "Shrine Quest": "神庙任务",
  "Side Quest": "支线任务",
  Dragon: "龙",
  "Enemy Camp": "敌人营地",
  Guardian: "守护者",
  Hinox: "西诺克斯",
  Lynel: "莱尼尔",
  Molduga: "莫尔德拉吉克",
  Stalnox: "骷髅西诺克斯",
  Talus: "石像怪",
  Wizzrobe: "法师",
  Yiga: "依盖队",
  "Cooking Pot": "烹饪锅",
  Journal: "日记",
  Miscellaneous: "杂项",
  NPC: "NPC",
  "Quest Objective": "任务目标",
  "Unique Horse": "特殊马匹",
  "Zora Monument": "卓拉石碑",
  "Luminous Stone": "夜光石矿",
  "Rare Ore Deposit": "稀有矿石",
  Acorn: "橡子",
  Ancient: "古代材料",
  Armoranth: "铠甲草",
  "Bird Egg": "鸟蛋",
  "Blue Nightshade": "夜光草",
  "Chickaloo Tree Nut": "小鸟的树果",
  Chillshroom: "冰冷蘑菇",
  "Cool Safflina": "冰冷香草",
  "Electric Safflina": "电气香草",
  "Endura Carrot": "精力胡萝卜",
  "Endura Shroom": "耐力蘑菇",
  Fairy: "妖精",
  "Fleet-Lotus Seeds": "速速莲蓬",
  "Hearty Durian": "生命榴莲",
  "Hearty Raddish": "生命小萝卜",
  "Hearty Truffle": "生命松露",
  Hydromelon: "含水蜜瓜",
  "Hylian Rice": "海利亚米",
  "Hylian Shroom": "海利亚蘑菇",
  "Hyrule Herb": "海拉鲁草",
  Ironshroom: "坚硬蘑菇",
  "Mighty Bananas": "力量香蕉",
  "Mighty Thistle": "力量蓟",
  "Palm Fruit": "椰子",
  Razorshroom: "锋利蘑菇",
  "Silent Princess": "宁静公主",
  "Silent Shroom": "寂静蘑菇",
  "Spicy Pepper": "辛辣胡椒",
  "Stamella Shroom": "精力蘑菇",
  Sunshroom: "暖暖蘑菇",
  "Swift Carrot": "速速胡萝卜",
  Voltfruit: "电气水果",
  "Warm Safflina": "暖暖香草",
  Wildberry: "野莓",
  Zapshroom: "电气蘑菇",
  "Armored Carp": "铠甲鲤鱼",
  "Armored Porgy": "铠甲鲷鱼",
  "Bladed Rhino Beetle": "刀刃犀金龟",
  "Blue-Winged Heron": "蓝翅鹭",
  "Bright-Chested Duck": "白胸鸭",
  "Bright-Eyed Crab": "亮眼蟹",
  "Bushy-Tailed Squirrel": "尾巴松鼠",
  "Chillfin Trout": "冰冷鳟鱼",
  "Cold Darner": "冰冷蜻蜓",
  Cucco: "咕咕鸡",
  Donkey: "驴",
  "Eldin Ostrich": "奥尔汀鸵鸟",
  "Electric Darner": "电气蜻蜓",
  "Energetic Rhino Beetle": "精力犀金龟",
  "Fireproof Lizard": "耐火蜥蜴",
  "Grassland Fox": "草原狐狸",
  "Great-Horned Rhinoceros": "大角犀牛",
  "Grizzlemaw Bear": "灰嘴熊",
  "Hateno Cow": "哈特诺牛",
  "Hearty Bass": "生命鲈鱼",
  "Hearty Blueshell Snail": "生命蓝壳蜗牛",
  "Hearty Lizard": "生命蜥蜴",
  "Hearty Salmon": "生命鲑鱼",
  "Highland Sheep": "高原绵羊",
  "Hightail Lizard": "速速蜥蜴",
  "Honeyvore Bear": "食蜜熊",
  Horse: "马",
  "Hot-Footed Frog": "速速青蛙",
  "Hylian Retriever": "海利亚猎犬",
  "Hyrule Bass": "海拉鲁鲈鱼",
  "Ironshell Crab": "坚硬蟹",
  "Maraudo Wolf": "荒野狼",
  "Mighty Carp": "力量鲤鱼",
  "Mighty Porgy": "力量鲷鱼",
  "Mountain Buck": "山鹿（公）",
  "Mountain Crow": "山乌鸦",
  "Mountain Doe": "山鹿（母）",
  "Mountain Goat": "山羊",
  "Pink Heron": "粉红鹭",
  "Rainbow Pigeon": "彩虹鸽",
  "Razorclaw Crab": "锋利蟹",
  "Red-Tusked Boar": "红牙野猪",
  "Restless Cricket": "精力蟋蟀",
  "Rugged Rhino Beetle": "坚硬犀金龟",
  "Sand Seal": "沙海象",
  "Sanke Carp": "三色鲤",
  Seagull: "海鸥",
  "Sneaky River Snail": "潜行河蜗牛",
  "Snowcoat Fox": "雪衣狐狸",
  Sparrow: "麻雀",
  "Sparrow (Blue)": "蓝麻雀",
  "Sparrow (Golden)": "金麻雀",
  "Sparrow (Rainbow)": "彩虹麻雀",
  "Sparrow (Red)": "红麻雀",
  "Staminoka Bass": "精力鲈鱼",
  "Summerwing Butterfly": "夏翅蝴蝶",
  "Sunset Firefly": "黄昏萤火虫",
  "Tabantha Moose": "塔邦挞麋鹿",
  "Thunderwing Butterfly": "雷翅蝴蝶",
  "Tireless Frog": "精力青蛙",
  "Voltfin Trout": "电气鳟鱼",
  "Warm Darner": "暖暖蜻蜓",
  "Wasteland Coyote": "荒野郊狼",
  "Water Buffalo": "水牛",
  "White Goat": "白山羊",
  "White Pigeon": "白鸽",
  "Winterwing Butterfly": "冬翅蝴蝶",
  "Wood Pigeon": "木鸽",
  "Woodland Boar": "森林野猪",
}
</script>

<style lang="scss">
.Layout.botw-map {
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
.botw-map-wrap {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 100vh) - var(--vp-nav-height, 64px));
  overflow: hidden;
  background: #0a0a0a;

  &.is-web-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
  }
}

.botw-map-canvas {
  width: 100%;
  height: 100%;
}

.side-panel {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(260px, calc(100% - 24px));
  max-height: calc(100% - 24px);

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
  background: #0a0a0a;
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
    top: 12px;
    max-height: calc(100% - 220px);
  }
}
</style>
