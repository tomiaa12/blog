<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

type Mode = "draw" | "grid"
type TPoint = {
  id: number
  x: number
  y: number
  color: string
  radius: number
  force: number
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#84cc16",
  "#6366f1",
]

const CELL_TARGET = 44

const stageRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const mode = ref<Mode>("draw")
const isFs = ref(false)
const points = ref<TPoint[]>([])
const maxSimul = ref(0)
const totalTaps = ref(0)
const drew = ref(false)
const stageW = ref(320)
const stageH = ref(420)
const hitMap = reactive<Record<string, boolean>>({})

const activeMap = new Map<number, TPoint>()
let ctx: CanvasRenderingContext2D | null = null
let ro: ResizeObserver | null = null

const cols = computed(() => Math.max(6, Math.round(stageW.value / CELL_TARGET)))
const rows = computed(() => Math.max(8, Math.round(stageH.value / CELL_TARGET)))
const cellCount = computed(() => cols.value * rows.value)
const hitCount = computed(() => Object.keys(hitMap).length)
const showHint = computed(
  () => !points.value.length && !drew.value && hitCount.value === 0,
)

function colorFor(id: number) {
  return COLORS[Math.abs(id) % COLORS.length]
}

function pointerRadius(e: PointerEvent) {
  const w = e.width || 0
  const h = e.height || 0
  if (w > 0 || h > 0) return Math.round((w + h) / 4)
  return 0
}

function rel(e: PointerEvent) {
  const el = stageRef.value
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

function publish() {
  points.value = [...activeMap.values()]
}

function markGrid(x: number, y: number) {
  if (mode.value !== "grid") return
  const c = cols.value
  const rws = rows.value
  if (c <= 0 || rws <= 0 || stageW.value <= 0 || stageH.value <= 0) return
  const col = Math.min(c - 1, Math.max(0, Math.floor((x / stageW.value) * c)))
  const row = Math.min(rws - 1, Math.max(0, Math.floor((y / stageH.value) * rws)))
  hitMap[`${row},${col}`] = true
}

function isHit(index1: number) {
  const idx = index1 - 1
  const c = cols.value
  const row = Math.floor(idx / c)
  const col = idx % c
  return !!hitMap[`${row},${col}`]
}

function setupCanvas() {
  const canvas = canvasRef.value
  const stage = stageRef.value
  if (!canvas || !stage) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = stage.clientWidth
  const h = stage.clientHeight
  const nextW = Math.max(1, Math.floor(w * dpr))
  const nextH = Math.max(1, Math.floor(h * dpr))
  stageW.value = w
  stageH.value = h
  if (canvas.width === nextW && canvas.height === nextH) return
  canvas.width = nextW
  canvas.height = nextH
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = 3.5
  }
}

function clearHits() {
  for (const k of Object.keys(hitMap)) delete hitMap[k]
}

function clearAll() {
  activeMap.clear()
  points.value = []
  maxSimul.value = 0
  totalTaps.value = 0
  drew.value = false
  clearHits()
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, stageW.value, stageH.value)
  }
}

function onDown(e: PointerEvent) {
  const pos = rel(e)
  if (!pos) return
  try {
    stageRef.value?.setPointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
  const p: TPoint = {
    id: e.pointerId,
    x: pos.x,
    y: pos.y,
    color: colorFor(e.pointerId),
    radius: pointerRadius(e),
    force: e.pressure ?? 0,
  }
  activeMap.set(e.pointerId, p)
  totalTaps.value += 1
  if (activeMap.size > maxSimul.value) maxSimul.value = activeMap.size
  markGrid(pos.x, pos.y)
  publish()
}

function onMove(e: PointerEvent) {
  const prev = activeMap.get(e.pointerId)
  if (!prev) return
  const pos = rel(e)
  if (!pos) return
  if (mode.value === "draw" && ctx) {
    ctx.strokeStyle = prev.color
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    drew.value = true
  }
  prev.x = pos.x
  prev.y = pos.y
  prev.radius = pointerRadius(e)
  prev.force = e.pressure ?? 0
  markGrid(pos.x, pos.y)
  publish()
}

function onUp(e: PointerEvent) {
  activeMap.delete(e.pointerId)
  publish()
}

function onFsChange() {
  const el = stageRef.value
  isFs.value = !!(el && document.fullscreenElement === el)
  requestAnimationFrame(setupCanvas)
}

async function enterFs() {
  const el = stageRef.value
  if (!el?.requestFullscreen) return
  await el.requestFullscreen()
}

async function exitFs() {
  if (document.fullscreenElement) await document.exitFullscreen()
}

watch([cols, rows], (next, prev) => {
  if (!prev || next[0] !== prev[0] || next[1] !== prev[1]) clearHits()
})

onMounted(() => {
  setupCanvas()
  document.addEventListener("fullscreenchange", onFsChange)
  const el = stageRef.value
  if (el && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => setupCanvas())
    ro.observe(el)
  }
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", onFsChange)
  ro?.disconnect()
  void exitFs()
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-radio-group v-model="mode">
        <el-radio-button value="draw">{{ t("modeDraw") }}</el-radio-button>
        <el-radio-button value="grid">{{ t("modeGrid") }}</el-radio-button>
      </el-radio-group>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
      <el-button
        v-if="!isFs"
        type="primary"
        @click="enterFs"
      >
        {{ t("enterFs") }}
      </el-button>
    </div>

    <div class="stats">
      <span>{{ t("statCurrent", { n: points.length }) }}</span>
      <span>{{ t("statMax", { n: maxSimul }) }}</span>
      <span>{{ t("statTotal", { n: totalTaps }) }}</span>
      <span v-if="mode === 'grid'">{{
        t("gridCovered", { n: hitCount, total: cellCount })
      }}</span>
    </div>

    <div
      ref="stageRef"
      class="stage"
      @pointerdown.prevent="onDown"
      @pointermove.prevent="onMove"
      @pointerup.prevent="onUp"
      @pointercancel.prevent="onUp"
      @contextmenu.prevent
    >
      <canvas
        ref="canvasRef"
        class="layer-canvas"
        :class="{ hidden: mode === 'grid' }"
      />
      <div
        v-if="mode === 'grid'"
        class="grid"
        :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }"
      >
        <div
          v-for="i in cellCount"
          :key="i"
          class="cell"
          :class="{ hit: isHit(i) }"
        />
      </div>
      <div
        v-for="p in points"
        :key="p.id"
        class="dot"
        :style="{
          left: `${p.x}px`,
          top: `${p.y}px`,
          '--c': p.color,
          borderColor: p.color,
        }"
      >
        <span>{{ p.id }}</span>
      </div>
      <p
        v-if="showHint"
        class="panel-hint"
      >
        {{ t("panelHint") }}
      </p>
      <div
        v-if="isFs"
        class="fs-bar"
        @pointerdown.stop
      >
        <el-radio-group v-model="mode">
          <el-radio-button value="draw">{{ t("modeDraw") }}</el-radio-button>
          <el-radio-button value="grid">{{ t("modeGrid") }}</el-radio-button>
        </el-radio-group>
        <el-button @click="clearAll">{{ t("clear") }}</el-button>
        <el-button @click="exitFs">{{ t("exitFs") }}</el-button>
        <span class="fs-stat">{{ t("statCurrent", { n: points.length }) }}</span>
      </div>
    </div>

    <template v-if="points.length">
      <h2 class="sub">{{ t("touchListTitle") }}</h2>
      <ul class="list">
        <li
          v-for="p in points"
          :key="p.id"
          class="item"
        >
          <i
            class="swatch"
            :style="{ background: p.color }"
          />
          <span class="mono">{{ t("colId") }} {{ p.id }}</span>
          <span class="mono">{{ t("colPos") }} {{ Math.round(p.x) }}, {{ Math.round(p.y) }}</span>
          <span class="mono">{{ t("colRadius") }} {{ p.radius || "—" }}</span>
          <span class="mono">{{ t("colForce") }} {{ p.force ? p.force.toFixed(2) : "—" }}</span>
        </li>
      </ul>
    </template>
    <p
      v-else
      class="empty"
    >
      {{ t("noTouches") }}
    </p>
    <p class="hint">{{ t("hint") }}</p>
  </div>
</template>

<style lang="scss" scoped>
.hw-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.page-desc {
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 12px;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
}

.stage {
  position: relative;
  height: min(62vh, 560px);
  min-height: 320px;
  border-radius: 12px;
  border: 2px dashed var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  touch-action: none;
  user-select: none;
  margin-bottom: 16px;
}

.stage:fullscreen {
  height: 100vh;
  min-height: 100vh;
  border-radius: 0;
  border: none;
  background: #111;
}

.layer-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;

  &.hidden {
    visibility: hidden;
  }
}

.grid {
  position: absolute;
  inset: 0;
  display: grid;
  pointer-events: none;
}

.cell {
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  box-sizing: border-box;

  &.hit {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-1);
  }
}

.stage:fullscreen .cell {
  border-color: rgba(255, 255, 255, 0.12);

  &.hit {
    background: color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
    border-color: var(--vp-c-brand-1);
  }
}

.dot {
  position: absolute;
  width: 46px;
  height: 46px;
  border: 3px solid;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--c) 22%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 40%, transparent);
  z-index: 2;
}

.stage:fullscreen .dot {
  color: #fff;
}

.panel-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 16px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
  pointer-events: none;
  z-index: 1;
}

.stage:fullscreen .panel-hint {
  color: rgba(255, 255, 255, 0.55);
}

.fs-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.fs-stat {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.sub {
  font-size: 1rem;
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}

.item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 0.88rem;
}

.swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: 0 0 auto;
}

.mono {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}

.empty {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
  margin: 0 0 12px;
}

.hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "触摸屏测试",
    "desc": "在下方区域用单指或多指滑动，可画轨迹、查看每个触点的坐标与压力，或切换网格模式检查有无触摸死区。建议全屏后覆盖整块屏幕。",
    "modeDraw": "轨迹",
    "modeGrid": "网格死区",
    "clear": "清除",
    "enterFs": "全屏测试",
    "exitFs": "退出全屏",
    "statCurrent": "当前 {n} 点",
    "statMax": "最多同时 {n} 点",
    "statTotal": "累计 {n} 次",
    "gridCovered": "已覆盖 {n} / {total} 格",
    "panelHint": "在此区域触摸或按住拖动（支持多点）…",
    "touchListTitle": "当前触点",
    "noTouches": "当前无触点。请在上方区域触摸屏幕。",
    "colId": "id",
    "colPos": "坐标",
    "colRadius": "半径",
    "colForce": "压力",
    "hint": "电脑可用鼠标在区域内拖动预览；手机和平板可多指同时按下检测多点触控。全屏时按 Esc 退出。"
  },
  "en": {
    "title_page": "Touch Screen Test",
    "desc": "Draw with one or more fingers, inspect coordinates and pressure, or use grid mode to find dead zones. Fullscreen helps cover the whole panel.",
    "modeDraw": "Trail",
    "modeGrid": "Dead-zone grid",
    "clear": "Clear",
    "enterFs": "Fullscreen",
    "exitFs": "Exit fullscreen",
    "statCurrent": "{n} active",
    "statMax": "max {n} at once",
    "statTotal": "{n} taps",
    "gridCovered": "covered {n} / {total}",
    "panelHint": "Touch or drag here (multi-touch supported)…",
    "touchListTitle": "Active touches",
    "noTouches": "No active touches. Touch the area above.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "radius",
    "colForce": "pressure",
    "hint": "On a computer you can drag with the mouse. On phones and tablets, press with several fingers to test multi-touch. Esc exits fullscreen."
  },
  "ja": {
    "title_page": "タッチスクリーンテスト",
    "desc": "指で軌跡を描き、座標や圧力を確認。グリッドで死角を探せます。全画面推奨。",
    "modeDraw": "軌跡",
    "modeGrid": "死角グリッド",
    "clear": "クリア",
    "enterFs": "全画面",
    "exitFs": "終了",
    "statCurrent": "現在 {n} 点",
    "statMax": "同時最大 {n}",
    "statTotal": "累計 {n}",
    "gridCovered": "カバー {n} / {total}",
    "panelHint": "ここをタッチまたはドラッグ（マルチタッチ可）…",
    "touchListTitle": "現在のタッチ",
    "noTouches": "タッチがありません。上の枠に触れてください。",
    "colId": "id",
    "colPos": "座標",
    "colRadius": "半径",
    "colForce": "圧力",
    "hint": "PC ではマウスドラッグ、スマホでは複数指でマルチタッチを確認。Esc で全画面終了。"
  },
  "ko": {
    "title_page": "터치 스크린 테스트",
    "desc": "손가락으로 궤적을 그리고 좌표·압력을 확인하거나, 격자로 터치 사각지대를 찾습니다. 전체 화면을 권장합니다.",
    "modeDraw": "궤적",
    "modeGrid": "사각 격자",
    "clear": "지우기",
    "enterFs": "전체 화면",
    "exitFs": "종료",
    "statCurrent": "현재 {n}점",
    "statMax": "최대 동시 {n}",
    "statTotal": "누적 {n}",
    "gridCovered": "덮음 {n} / {total}",
    "panelHint": "여기를 터치하거나 드래그하세요 (멀티터치)…",
    "touchListTitle": "활성 터치",
    "noTouches": "터치가 없습니다. 위 영역을 터치하세요.",
    "colId": "id",
    "colPos": "좌표",
    "colRadius": "반경",
    "colForce": "압력",
    "hint": "PC에서는 마우스로 드래그할 수 있습니다. 휴대폰에서는 여러 손가락으로 멀티터치를 확인하세요. Esc로 전체 화면 종료."
  },
  "fr": {
    "title_page": "Test écran tactile",
    "desc": "Dessinez avec un ou plusieurs doigts, voyez coordonnées et pression, ou cherchez les zones mortes en grille. Plein écran conseillé.",
    "modeDraw": "Trace",
    "modeGrid": "Grille zones mortes",
    "clear": "Effacer",
    "enterFs": "Plein écran",
    "exitFs": "Quitter",
    "statCurrent": "{n} actifs",
    "statMax": "max {n} à la fois",
    "statTotal": "{n} appuis",
    "gridCovered": "couvert {n} / {total}",
    "panelHint": "Touchez ou glissez ici (multi-touch)…",
    "touchListTitle": "Touches actives",
    "noTouches": "Aucun toucher. Touchez la zone ci-dessus.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "rayon",
    "colForce": "pression",
    "hint": "Sur ordinateur, glissez avec la souris. Sur mobile, plusieurs doigts pour le multi-touch. Échap quitte le plein écran."
  },
  "de": {
    "title_page": "Touchscreen-Test",
    "desc": "Mit einem oder mehreren Fingern zeichnen, Koordinaten und Druck prüfen oder tote Zonen im Raster finden. Vollbild empfohlen.",
    "modeDraw": "Spur",
    "modeGrid": "Totzonen-Raster",
    "clear": "Löschen",
    "enterFs": "Vollbild",
    "exitFs": "Beenden",
    "statCurrent": "{n} aktiv",
    "statMax": "max. {n} gleichzeitig",
    "statTotal": "{n} Tipps",
    "gridCovered": "abgedeckt {n} / {total}",
    "panelHint": "Hier berühren oder ziehen (Multi-Touch)…",
    "touchListTitle": "Aktive Berührungen",
    "noTouches": "Keine Berührung. Bereich oben berühren.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "radius",
    "colForce": "druck",
    "hint": "Am PC mit der Maus ziehen. Am Handy mehrere Finger für Multi-Touch. Esc beendet Vollbild."
  },
  "es": {
    "title_page": "Prueba de pantalla táctil",
    "desc": "Dibuja con uno o más dedos, mira coordenadas y presión, o usa la cuadrícula para zonas muertas. Mejor a pantalla completa.",
    "modeDraw": "Trazo",
    "modeGrid": "Rejilla zonas muertas",
    "clear": "Borrar",
    "enterFs": "Pantalla completa",
    "exitFs": "Salir",
    "statCurrent": "{n} activos",
    "statMax": "máx. {n} a la vez",
    "statTotal": "{n} toques",
    "gridCovered": "cubierto {n} / {total}",
    "panelHint": "Toca o arrastra aquí (multitáctil)…",
    "touchListTitle": "Toques activos",
    "noTouches": "Sin toques. Toca el área de arriba.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "radio",
    "colForce": "presión",
    "hint": "En el ordenador puedes arrastrar con el ratón. En el móvil, varios dedos para multitáctil. Esc sale de pantalla completa."
  },
  "pt": {
    "title_page": "Teste de ecrã tátil",
    "desc": "Desenhe com um ou mais dedos, veja coordenadas e pressão, ou use a grelha para zonas mortas. Ecrã inteiro recomendado.",
    "modeDraw": "Traço",
    "modeGrid": "Grelha zonas mortas",
    "clear": "Limpar",
    "enterFs": "Ecrã inteiro",
    "exitFs": "Sair",
    "statCurrent": "{n} ativos",
    "statMax": "máx. {n} de uma vez",
    "statTotal": "{n} toques",
    "gridCovered": "coberto {n} / {total}",
    "panelHint": "Toque ou arraste aqui (multi-toque)…",
    "touchListTitle": "Toques ativos",
    "noTouches": "Sem toques. Toque na área acima.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "raio",
    "colForce": "pressão",
    "hint": "No computador, arraste com o rato. No telemóvel, vários dedos para multi-toque. Esc sai do ecrã inteiro."
  },
  "ru": {
    "title_page": "Тест сенсорного экрана",
    "desc": "Рисуйте одним или несколькими пальцами, смотрите координаты и силу нажатия или ищите мёртвые зоны сеткой. Лучше на весь экран.",
    "modeDraw": "След",
    "modeGrid": "Сетка мёртвых зон",
    "clear": "Очистить",
    "enterFs": "Полный экран",
    "exitFs": "Выйти",
    "statCurrent": "сейчас {n}",
    "statMax": "макс. сразу {n}",
    "statTotal": "всего {n}",
    "gridCovered": "покрыто {n} / {total}",
    "panelHint": "Коснитесь или проведите здесь (мультитач)…",
    "touchListTitle": "Активные касания",
    "noTouches": "Нет касаний. Коснитесь области выше.",
    "colId": "id",
    "colPos": "поз.",
    "colRadius": "радиус",
    "colForce": "сила",
    "hint": "На компьютере можно вести мышью. На телефоне несколько пальцев проверяют мультитач. Esc выходит из полного экрана."
  },
  "ar": {
    "title_page": "اختبار الشاشة اللمسية",
    "desc": "ارسم بإصبع أو أكثر، اعرض الإحداثيات والضغط، أو استخدم الشبكة للبحث عن مناطق ميتة. يُفضل ملء الشاشة.",
    "modeDraw": "أثر",
    "modeGrid": "شبكة المناطق الميتة",
    "clear": "مسح",
    "enterFs": "ملء الشاشة",
    "exitFs": "خروج",
    "statCurrent": "{n} نشط",
    "statMax": "أقصى {n} معاً",
    "statTotal": "{n} لمسة",
    "gridCovered": "مغطى {n} / {total}",
    "panelHint": "المس أو اسحب هنا (لمس متعدد)…",
    "touchListTitle": "اللمسات النشطة",
    "noTouches": "لا توجد لمسات. المس المنطقة أعلاه.",
    "colId": "id",
    "colPos": "موضع",
    "colRadius": "نصف قطر",
    "colForce": "ضغط",
    "hint": "على الحاسوب يمكن السحب بالفأرة. على الهاتف استخدم عدة أصابع. Esc للخروج من ملء الشاشة."
  },
  "hi": {
    "title_page": "टच स्क्रीन टेस्ट",
    "desc": "एक या अधिक उंगलियों से रेखा खींचें, निर्देशांक और दबाव देखें, या ग्रिड से डेड ज़ोन खोजें। फ़ुल स्क्रीन बेहतर है।",
    "modeDraw": "रेखा",
    "modeGrid": "डेड-ज़ोन ग्रिड",
    "clear": "साफ़",
    "enterFs": "पूर्ण स्क्रीन",
    "exitFs": "बाहर",
    "statCurrent": "अभी {n}",
    "statMax": "एक साथ अधिकतम {n}",
    "statTotal": "कुल {n}",
    "gridCovered": "ढका {n} / {total}",
    "panelHint": "यहाँ छुएँ या खींचें (मल्टी-टच)…",
    "touchListTitle": "सक्रिय स्पर्श",
    "noTouches": "कोई स्पर्श नहीं। ऊपर के क्षेत्र को छुएँ।",
    "colId": "id",
    "colPos": "स्थिति",
    "colRadius": "त्रिज्या",
    "colForce": "दबाव",
    "hint": "कंप्यूटर पर माउस से खींच सकते हैं। फ़ोन पर कई उंगलियों से मल्टी-टच जाँचें। Esc से फ़ुल स्क्रीन बंद।"
  },
  "it": {
    "title_page": "Test touch screen",
    "desc": "Disegna con una o più dita, vedi coordinate e pressione, o usa la griglia per le zone morte. Meglio a schermo intero.",
    "modeDraw": "Traccia",
    "modeGrid": "Griglia zone morte",
    "clear": "Cancella",
    "enterFs": "Schermo intero",
    "exitFs": "Esci",
    "statCurrent": "{n} attivi",
    "statMax": "max {n} insieme",
    "statTotal": "{n} tocchi",
    "gridCovered": "coperto {n} / {total}",
    "panelHint": "Tocca o trascina qui (multi-touch)…",
    "touchListTitle": "Tocchi attivi",
    "noTouches": "Nessun tocco. Tocca l'area sopra.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "raggio",
    "colForce": "pressione",
    "hint": "Sul computer puoi trascinare con il mouse. Sul telefono più dita per il multi-touch. Esc esce dallo schermo intero."
  },
  "nl": {
    "title_page": "Touchscreen test",
    "desc": "Teken met één of meer vingers, zie coördinaten en druk, of zoek dode zones in het raster. Volledig scherm aangeraden.",
    "modeDraw": "Spoor",
    "modeGrid": "Dode-zone raster",
    "clear": "Wissen",
    "enterFs": "Volledig scherm",
    "exitFs": "Afsluiten",
    "statCurrent": "{n} actief",
    "statMax": "max {n} tegelijk",
    "statTotal": "{n} tikken",
    "gridCovered": "bedekt {n} / {total}",
    "panelHint": "Raak hier aan of sleep (multi-touch)…",
    "touchListTitle": "Actieve aanrakingen",
    "noTouches": "Geen aanraking. Raak het gebied hierboven aan.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "straal",
    "colForce": "druk",
    "hint": "Op de pc kun je met de muis slepen. Op de telefoon meerdere vingers voor multi-touch. Esc sluit volledig scherm."
  },
  "tr": {
    "title_page": "Dokunmatik ekran testi",
    "desc": "Bir veya daha fazla parmakla çizin, koordinat ve basıncı görün veya ızgarayla ölü bölgeleri bulun. Tam ekran önerilir.",
    "modeDraw": "İz",
    "modeGrid": "Ölü bölge ızgarası",
    "clear": "Temizle",
    "enterFs": "Tam ekran",
    "exitFs": "Çık",
    "statCurrent": "{n} aktif",
    "statMax": "en fazla {n} aynı anda",
    "statTotal": "{n} dokunuş",
    "gridCovered": "kaplanan {n} / {total}",
    "panelHint": "Buraya dokunun veya sürükleyin (çoklu dokunma)…",
    "touchListTitle": "Aktif dokunuşlar",
    "noTouches": "Dokunuş yok. Yukarıdaki alana dokunun.",
    "colId": "id",
    "colPos": "konum",
    "colRadius": "yarıçap",
    "colForce": "basınç",
    "hint": "Bilgisayarda fareyle sürükleyebilirsiniz. Telefonda çoklu dokunma için birkaç parmak kullanın. Esc tam ekrandan çıkar."
  },
  "vi": {
    "title_page": "Kiểm tra cảm ứng",
    "desc": "Vẽ bằng một hoặc nhiều ngón, xem tọa độ và lực nhấn, hoặc dùng lưới tìm vùng chết. Nên dùng toàn màn hình.",
    "modeDraw": "Vệt",
    "modeGrid": "Lưới vùng chết",
    "clear": "Xóa",
    "enterFs": "Toàn màn hình",
    "exitFs": "Thoát",
    "statCurrent": "{n} điểm",
    "statMax": "tối đa {n} cùng lúc",
    "statTotal": "{n} lần chạm",
    "gridCovered": "đã phủ {n} / {total}",
    "panelHint": "Chạm hoặc kéo tại đây (đa điểm)…",
    "touchListTitle": "Điểm chạm đang hoạt động",
    "noTouches": "Chưa có điểm chạm. Chạm vùng phía trên.",
    "colId": "id",
    "colPos": "tọa độ",
    "colRadius": "bán kính",
    "colForce": "lực",
    "hint": "Trên máy tính có thể kéo chuột. Trên điện thoại dùng nhiều ngón để thử đa điểm. Esc thoát toàn màn hình."
  },
  "th": {
    "title_page": "ทดสอบหน้าจอสัมผัส",
    "desc": "วาดด้วยนิ้วหนึ่งหรือหลายนิ้ว ดูพิกัดและความดัน หรือใช้ตารางหาจุดตาย แนะนำเต็มหน้าจอ",
    "modeDraw": "เส้นทาง",
    "modeGrid": "ตารางจุดตาย",
    "clear": "ล้าง",
    "enterFs": "เต็มหน้าจอ",
    "exitFs": "ออก",
    "statCurrent": "ปัจจุบัน {n} จุด",
    "statMax": "พร้อมกันสูงสุด {n}",
    "statTotal": "รวม {n} ครั้ง",
    "gridCovered": "ครอบคลุม {n} / {total}",
    "panelHint": "สัมผัสหรือลากที่นี่ (หลายจุด)…",
    "touchListTitle": "จุดสัมผัสที่ใช้งาน",
    "noTouches": "ยังไม่มีการสัมผัส แตะพื้นที่ด้านบน",
    "colId": "id",
    "colPos": "พิกัด",
    "colRadius": "รัศมี",
    "colForce": "แรงกด",
    "hint": "บนคอมพิวเตอร์ลากด้วยเมาส์ได้ บนมือถือใช้หลายนิ้วทดสอบมัลติทัช Esc ออกจากเต็มหน้าจอ"
  },
  "id": {
    "title_page": "Tes layar sentuh",
    "desc": "Gambar dengan satu atau lebih jari, lihat koordinat dan tekanan, atau cari zona mati dengan kisi. Layar penuh disarankan.",
    "modeDraw": "Jejak",
    "modeGrid": "Kisi zona mati",
    "clear": "Hapus",
    "enterFs": "Layar penuh",
    "exitFs": "Keluar",
    "statCurrent": "{n} aktif",
    "statMax": "maks {n} sekaligus",
    "statTotal": "{n} ketukan",
    "gridCovered": "tercakup {n} / {total}",
    "panelHint": "Sentuh atau seret di sini (multi-touch)…",
    "touchListTitle": "Sentuhan aktif",
    "noTouches": "Tidak ada sentuhan. Sentuh area di atas.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "radius",
    "colForce": "tekanan",
    "hint": "Di komputer bisa menyeret dengan mouse. Di ponsel, beberapa jari untuk multi-touch. Esc keluar dari layar penuh."
  },
  "ms": {
    "title_page": "Ujian skrin sentuh",
    "desc": "Lukis dengan satu atau lebih jari, lihat koordinat dan tekanan, atau cari zon mati dengan grid. Skrin penuh digalakkan.",
    "modeDraw": "Jejak",
    "modeGrid": "Grid zon mati",
    "clear": "Padam",
    "enterFs": "Skrin penuh",
    "exitFs": "Keluar",
    "statCurrent": "{n} aktif",
    "statMax": "maks {n} sekali gus",
    "statTotal": "{n} ketukan",
    "gridCovered": "diliputi {n} / {total}",
    "panelHint": "Sentuh atau seret di sini (multi-sentuh)…",
    "touchListTitle": "Sentuhan aktif",
    "noTouches": "Tiada sentuhan. Sentuh kawasan di atas.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "jejari",
    "colForce": "tekanan",
    "hint": "Di komputer boleh seret dengan tetikus. Di telefon, beberapa jari untuk multi-sentuh. Esc keluar skrin penuh."
  },
  "pl": {
    "title_page": "Test ekranu dotykowego",
    "desc": "Rysuj jednym lub wieloma palcami, sprawdzaj współrzędne i nacisk albo szukaj martwych stref w siatce. Pełny ekran pomaga.",
    "modeDraw": "Ślad",
    "modeGrid": "Siatka martwych stref",
    "clear": "Wyczyść",
    "enterFs": "Pełny ekran",
    "exitFs": "Wyjście",
    "statCurrent": "{n} aktywnych",
    "statMax": "maks. {n} naraz",
    "statTotal": "{n} tapnięć",
    "gridCovered": "pokryte {n} / {total}",
    "panelHint": "Dotknij lub przeciągnij tutaj (multi-touch)…",
    "touchListTitle": "Aktywne dotknięcia",
    "noTouches": "Brak dotknięć. Dotknij obszaru powyżej.",
    "colId": "id",
    "colPos": "poz.",
    "colRadius": "promień",
    "colForce": "nacisk",
    "hint": "Na komputerze możesz przeciągać myszą. Na telefonie kilka palców sprawdzi multi-touch. Esc zamyka pełny ekran."
  },
  "uk": {
    "title_page": "Тест сенсорного екрана",
    "desc": "Малюйте одним або кількома пальцями, дивіться координати й тиск або шукайте мертві зони сіткою. Краще на весь екран.",
    "modeDraw": "Слід",
    "modeGrid": "Сітка мертвих зон",
    "clear": "Очистити",
    "enterFs": "На весь екран",
    "exitFs": "Вийти",
    "statCurrent": "зараз {n}",
    "statMax": "макс. разом {n}",
    "statTotal": "усього {n}",
    "gridCovered": "покрито {n} / {total}",
    "panelHint": "Торкніться або проведіть тут (мультитач)…",
    "touchListTitle": "Активні дотики",
    "noTouches": "Немає дотиків. Торкніться області вище.",
    "colId": "id",
    "colPos": "поз.",
    "colRadius": "радіус",
    "colForce": "тиск",
    "hint": "На комп’ютері можна вести мишею. На телефоні кілька пальців перевіряють мультитач. Esc виходить з повного екрана."
  },
  "sv": {
    "title_page": "Pekskärmstest",
    "desc": "Rita med ett eller flera fingrar, se koordinater och tryck, eller hitta döda zoner i rutnätet. Helskärm rekommenderas.",
    "modeDraw": "Spår",
    "modeGrid": "Dödzonsrutnät",
    "clear": "Rensa",
    "enterFs": "Helskärm",
    "exitFs": "Avsluta",
    "statCurrent": "{n} aktiva",
    "statMax": "max {n} samtidigt",
    "statTotal": "{n} tryck",
    "gridCovered": "täckt {n} / {total}",
    "panelHint": "Peka eller dra här (multitouch)…",
    "touchListTitle": "Aktiva beröringar",
    "noTouches": "Inga beröringar. Peka på området ovan.",
    "colId": "id",
    "colPos": "pos",
    "colRadius": "radie",
    "colForce": "tryck",
    "hint": "På datorn kan du dra med musen. På telefonen flera fingrar för multitouch. Esc lämnar helskärm."
  },
  "zh-TW": {
    "title_page": "觸控螢幕測試",
    "desc": "在下方區域用單指或多指滑動，可畫軌跡、查看每個觸點的座標與壓力，或切換網格模式檢查有無觸控死區。建議全螢幕後覆蓋整塊螢幕。",
    "modeDraw": "軌跡",
    "modeGrid": "網格死區",
    "clear": "清除",
    "enterFs": "全螢幕測試",
    "exitFs": "退出全螢幕",
    "statCurrent": "目前 {n} 點",
    "statMax": "最多同時 {n} 點",
    "statTotal": "累計 {n} 次",
    "gridCovered": "已覆蓋 {n} / {total} 格",
    "panelHint": "在此區域觸控或按住拖曳（支援多點）…",
    "touchListTitle": "目前觸點",
    "noTouches": "目前無觸點。請在上方區域觸控螢幕。",
    "colId": "id",
    "colPos": "座標",
    "colRadius": "半徑",
    "colForce": "壓力",
    "hint": "電腦可用滑鼠在區域內拖曳預覽；手機和平板可多指同時按下檢測多點觸控。全螢幕時按 Esc 退出。"
  }
}
</i18n>
