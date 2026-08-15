<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"

export type CropRect = {
  x: number
  y: number
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    src: string
    /** 宽/高，传 null 为自由比例。默认 1（正方形） */
    aspectRatio?: number | null
    /** 裁切框最小边长（原图像素） */
    minCrop?: number
  }>(),
  {
    aspectRatio: 1,
    minCrop: 16,
  }
)

const emit = defineEmits<{
  change: [rect: CropRect]
  load: [size: { width: number; height: number }]
}>()

const stageRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const natural = ref({ w: 0, h: 0 })
const view = ref({ w: 0, h: 0, left: 0, top: 0, scale: 1 })
/** 裁切框：舞台像素，不随背景缩放 */
const frame = ref<CropRect>({ x: 0, y: 0, width: 0, height: 0 })
const spaceDown = ref(false)
const panning = ref(false)
const hovered = ref(false)

type Handle = "move" | "nw" | "ne" | "sw" | "se"
let drag: {
  handle: Handle
  startX: number
  startY: number
  startFrame: CropRect
} | null = null
let pan: {
  startX: number
  startY: number
  startLeft: number
  startTop: number
} | null = null
let fitScale = 1
let ro: ResizeObserver | null = null

const MIN_ZOOM = 0.2
const MAX_ZOOM = 32

const stageCursor = computed(() => {
  if (panning.value) return "grabbing"
  if (spaceDown.value) return "grab"
  return "default"
})

const boxStyle = computed(() => {
  const f = frame.value
  return {
    left: `${f.x}px`,
    top: `${f.y}px`,
    width: `${f.width}px`,
    height: `${f.height}px`,
  }
})

function stageSize() {
  const stage = stageRef.value
  return {
    w: stage?.clientWidth ?? 0,
    h: stage?.clientHeight ?? 0,
  }
}

function imageBox() {
  const { left, top, scale } = view.value
  return {
    left,
    top,
    right: left + natural.value.w * scale,
    bottom: top + natural.value.h * scale,
    w: natural.value.w * scale,
    h: natural.value.h * scale,
  }
}

/** 裁切框必须落在「舞台 ∩ 背景图」内 */
function frameLimit() {
  const { w: sw, h: sh } = stageSize()
  const img = imageBox()
  return {
    left: Math.max(0, img.left),
    top: Math.max(0, img.top),
    right: Math.min(sw, img.right),
    bottom: Math.min(sh, img.bottom),
  }
}

function minFrameSize(limitW: number, limitH: number) {
  const scale = view.value.scale || 1
  const minImg = Math.min(props.minCrop, natural.value.w, natural.value.h)
  let minW = Math.min(limitW, Math.max(16, minImg * scale))
  let minH = Math.min(limitH, Math.max(16, minImg * scale))
  const ratio = props.aspectRatio
  if (ratio && ratio > 0) {
    if (minW / minH > ratio) minW = minH * ratio
    else minH = minW / ratio
    if (minW > limitW) {
      minW = limitW
      minH = minW / ratio
    }
    if (minH > limitH) {
      minH = limitH
      minW = minH * ratio
    }
  }
  return { minW, minH }
}

function clampFrame(next: CropRect): CropRect {
  const limit = frameLimit()
  const maxW = Math.max(0, limit.right - limit.left)
  const maxH = Math.max(0, limit.bottom - limit.top)
  if (maxW < 1 || maxH < 1) return { ...frame.value }

  const ratio = props.aspectRatio
  const { minW, minH } = minFrameSize(maxW, maxH)
  let { x, y, width, height } = next

  if (ratio && ratio > 0) {
    width = Math.min(maxW, Math.max(minW, width))
    height = width / ratio
    if (height > maxH) {
      height = maxH
      width = height * ratio
    }
    if (height < minH) {
      height = minH
      width = height * ratio
      if (width > maxW) {
        width = maxW
        height = width / ratio
      }
    }
  } else {
    width = Math.min(maxW, Math.max(minW, width))
    height = Math.min(maxH, Math.max(minH, height))
  }

  x = Math.min(Math.max(limit.left, x), limit.right - width)
  y = Math.min(Math.max(limit.top, y), limit.bottom - height)
  return { x, y, width, height }
}

function imageCropFromFrame(f = frame.value): CropRect {
  const s = view.value.scale || 1
  const { w, h } = natural.value
  let x = (f.x - view.value.left) / s
  let y = (f.y - view.value.top) / s
  let width = f.width / s
  let height = f.height / s
  x = Math.min(Math.max(0, x), Math.max(0, w - width))
  y = Math.min(Math.max(0, y), Math.max(0, h - height))
  width = Math.min(width, w - x)
  height = Math.min(height, h - y)
  return { x, y, width, height }
}

function emitCrop() {
  emit("change", imageCropFromFrame())
}

function applyView() {
  const img = imgRef.value
  if (!img || !natural.value.w) return
  const { left, top, scale } = view.value
  const nw = natural.value.w
  const nh = natural.value.h
  view.value.w = nw * scale
  view.value.h = nh * scale
  img.style.width = `${nw}px`
  img.style.height = `${nh}px`
  img.style.left = `${left}px`
  img.style.top = `${top}px`
  img.style.transformOrigin = "0 0"
  img.style.transform = `scale(${scale})`
}

/** 背景图必须盖住裁切框；图比框小时缩小裁切框 */
function keepFrameOnImage() {
  const img = imageBox()
  const f = frame.value
  if (img.w + 0.5 < f.width || img.h + 0.5 < f.height) {
    frame.value = clampFrame({
      x: img.left,
      y: img.top,
      width: img.w,
      height: img.h,
    })
  }
  const box = frame.value
  let left = view.value.left
  let top = view.value.top
  const imgW = natural.value.w * view.value.scale
  const imgH = natural.value.h * view.value.scale
  if (imgW >= box.width) {
    if (left > box.x) left = box.x
    if (left + imgW < box.x + box.width) left = box.x + box.width - imgW
  }
  if (imgH >= box.height) {
    if (top > box.y) top = box.y
    if (top + imgH < box.y + box.height) top = box.y + box.height - imgH
  }
  view.value.left = left
  view.value.top = top
  applyView()
  frame.value = clampFrame(frame.value)
}

function setView(scale: number, left: number, top: number) {
  const min = fitScale * MIN_ZOOM
  const max = fitScale * MAX_ZOOM
  view.value.scale = Math.min(max, Math.max(min, scale))
  view.value.left = left
  view.value.top = top
  applyView()
  keepFrameOnImage()
  emitCrop()
}

function fitView() {
  const { w: sw, h: sh } = stageSize()
  if (!sw || !natural.value.w) return
  const scale = Math.min(sw / natural.value.w, sh / natural.value.h) || 1
  fitScale = scale
  view.value = {
    w: natural.value.w * scale,
    h: natural.value.h * scale,
    left: (sw - natural.value.w * scale) / 2,
    top: (sh - natural.value.h * scale) / 2,
    scale,
  }
  applyView()
}

function initFrame() {
  const img = imageBox()
  const ratio = props.aspectRatio
  let width = img.w
  let height = img.h
  if (ratio && ratio > 0) {
    if (img.w / img.h > ratio) {
      height = img.h
      width = height * ratio
    } else {
      width = img.w
      height = width / ratio
    }
  }
  frame.value = clampFrame({
    x: img.left + (img.w - width) / 2,
    y: img.top + (img.h - height) / 2,
    width,
    height,
  })
  emitCrop()
}

function layout() {
  const { w: sw, h: sh } = stageSize()
  if (!sw || !natural.value.w) return
  const oldFit = fitScale
  const oldScale = view.value.scale
  const cx = sw / 2
  const cy = sh / 2
  const imgX = oldScale ? (cx - view.value.left) / oldScale : natural.value.w / 2
  const imgY = oldScale ? (cy - view.value.top) / oldScale : natural.value.h / 2
  fitScale = Math.min(sw / natural.value.w, sh / natural.value.h) || 1
  const zoom = oldFit ? oldScale / oldFit : 1
  const next = fitScale * zoom
  setView(next, cx - imgX * next, cy - imgY * next)
}

function onImgLoad() {
  const img = imgRef.value
  if (!img) return
  natural.value = { w: img.naturalWidth, h: img.naturalHeight }
  emit("load", { width: img.naturalWidth, height: img.naturalHeight })
  fitView()
  initFrame()
}

function startPan(e: PointerEvent) {
  panning.value = true
  pan = {
    startX: e.clientX,
    startY: e.clientY,
    startLeft: view.value.left,
    startTop: view.value.top,
  }
  stageRef.value?.setPointerCapture?.(e.pointerId)
}

function shouldPan(e: PointerEvent) {
  return e.button === 1 || spaceDown.value
}

function onStageMouseDown(e: MouseEvent) {
  if (e.button === 1) e.preventDefault()
}

function onStagePointerDown(e: PointerEvent) {
  if (!shouldPan(e)) return
  e.preventDefault()
  startPan(e)
}

function onPointerDown(e: PointerEvent, handle: Handle) {
  if (shouldPan(e)) {
    e.preventDefault()
    e.stopPropagation()
    startPan(e)
    return
  }
  e.preventDefault()
  e.stopPropagation()
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  drag = {
    handle,
    startX: e.clientX,
    startY: e.clientY,
    startFrame: { ...frame.value },
  }
}

function onPointerMove(e: PointerEvent) {
  if (pan) {
    view.value.left = pan.startLeft + (e.clientX - pan.startX)
    view.value.top = pan.startTop + (e.clientY - pan.startY)
    applyView()
    keepFrameOnImage()
    emitCrop()
    return
  }
  if (!drag) return
  const dx = e.clientX - drag.startX
  const dy = e.clientY - drag.startY
  const s = drag.startFrame
  const ratio = props.aspectRatio

  if (drag.handle === "move") {
    frame.value = clampFrame({
      ...s,
      x: s.x + dx,
      y: s.y + dy,
    })
  } else {
    let x = s.x
    let y = s.y
    let width = s.width
    let height = s.height
    const fromW = drag.handle.includes("w")
    const fromN = drag.handle.includes("n")
    const fromE = drag.handle.includes("e")
    const fromS = drag.handle.includes("s")

    if (ratio && ratio > 0) {
      let nextW = width
      if (fromE) nextW = s.width + dx
      if (fromW) nextW = s.width - dx
      if (fromS) nextW = (s.height + dy) * ratio
      if (fromN) nextW = (s.height - dy) * ratio
      if ((fromE || fromW) && (fromN || fromS)) {
        nextW = fromE ? s.width + dx : s.width - dx
      }
      width = nextW
      height = width / ratio
      if (fromW) x = s.x + s.width - width
      if (fromN) y = s.y + s.height - height
    } else {
      if (fromE) width = s.width + dx
      if (fromW) {
        width = s.width - dx
        x = s.x + dx
      }
      if (fromS) height = s.height + dy
      if (fromN) {
        height = s.height - dy
        y = s.y + dy
      }
    }
    frame.value = clampFrame({ x, y, width, height })
  }
  emitCrop()
}

function onPointerUp() {
  drag = null
  pan = null
  panning.value = false
}

function onWheel(e: WheelEvent) {
  if (!natural.value.w || !stageRef.value) return
  e.preventDefault()
  const factor = e.deltaY > 0 ? 1 / 1.12 : 1.12
  const next = view.value.scale * factor
  const r = stageRef.value.getBoundingClientRect()
  const mx = e.clientX - r.left
  const my = e.clientY - r.top
  const imgX = (mx - view.value.left) / view.value.scale
  const imgY = (my - view.value.top) / view.value.scale
  const scale = Math.min(fitScale * MAX_ZOOM, Math.max(fitScale * MIN_ZOOM, next))
  setView(scale, mx - imgX * scale, my - imgY * scale)
}

function spaceTargetOk(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement | null)?.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false
  return hovered.value || spaceDown.value || document.activeElement === stageRef.value
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code !== "Space") return
  if (!spaceTargetOk(e)) return
  e.preventDefault()
  if (!e.repeat) spaceDown.value = true
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code !== "Space") return
  if (spaceDown.value) e.preventDefault()
  spaceDown.value = false
  if (!pan) panning.value = false
}

function getCropRect(): CropRect {
  return imageCropFromFrame()
}

function getCroppedCanvas(size?: number): HTMLCanvasElement | null {
  const img = imgRef.value
  const { x, y, width, height } = imageCropFromFrame()
  if (!img || !width) return null
  const out = document.createElement("canvas")
  const w = size ?? Math.round(width)
  const h = size ? Math.round(size * (height / width)) : Math.round(height)
  out.width = Math.max(1, w)
  out.height = Math.max(1, h)
  const ctx = out.getContext("2d")
  if (!ctx) return null
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(img, x, y, width, height, 0, 0, out.width, out.height)
  return out
}

function getCroppedBlob(size?: number, type = "image/png", quality?: number) {
  return new Promise<Blob | null>(resolve => {
    const canvas = getCroppedCanvas(size)
    if (!canvas) {
      resolve(null)
      return
    }
    canvas.toBlob(b => resolve(b), type, quality)
  })
}

watch(
  () => props.src,
  () => {
    frame.value = { x: 0, y: 0, width: 0, height: 0 }
  }
)

watch(
  () => props.aspectRatio,
  () => {
    if (natural.value.w) initFrame()
  }
)

onMounted(() => {
  const el = stageRef.value
  if (el && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => layout())
    ro.observe(el)
  }
  el?.addEventListener("wheel", onWheel, { passive: false })
  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerUp)
  window.addEventListener("keydown", onKeyDown, { capture: true })
  window.addEventListener("keyup", onKeyUp, { capture: true })
})

onUnmounted(() => {
  ro?.disconnect()
  stageRef.value?.removeEventListener("wheel", onWheel)
  window.removeEventListener("pointermove", onPointerMove)
  window.removeEventListener("pointerup", onPointerUp)
  window.removeEventListener("pointercancel", onPointerUp)
  window.removeEventListener("keydown", onKeyDown, { capture: true })
  window.removeEventListener("keyup", onKeyUp, { capture: true })
})

defineExpose({ getCropRect, getCroppedCanvas, getCroppedBlob })
</script>

<template>
  <div
    ref="stageRef"
    class="crop-stage"
    tabindex="0"
    :class="{ grab: spaceDown, grabbing: panning }"
    :style="{ cursor: stageCursor }"
    @pointerdown="onStagePointerDown"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
    @mousedown="onStageMouseDown"
    @auxclick.prevent
  >
    <img
      ref="imgRef"
      class="crop-img"
      :src="src"
      alt=""
      draggable="false"
      @load="onImgLoad"
    />
    <div
      v-if="frame.width"
      class="crop-box"
      :style="boxStyle"
      @pointerdown="onPointerDown($event, 'move')"
    >
      <i
        class="h nw"
        @pointerdown="onPointerDown($event, 'nw')"
      />
      <i
        class="h ne"
        @pointerdown="onPointerDown($event, 'ne')"
      />
      <i
        class="h sw"
        @pointerdown="onPointerDown($event, 'sw')"
      />
      <i
        class="h se"
        @pointerdown="onPointerDown($event, 'se')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.crop-stage {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  background:
    linear-gradient(45deg, var(--vp-c-bg-soft) 25%, transparent 25%) 0 0 / 16px 16px,
    linear-gradient(-45deg, var(--vp-c-bg-soft) 25%, transparent 25%) 0 8px / 16px 16px,
    linear-gradient(45deg, transparent 75%, var(--vp-c-bg-soft) 75%) 8px -8px / 16px 16px,
    linear-gradient(-45deg, transparent 75%, var(--vp-c-bg-soft) 75%) -8px 0 / 16px 16px;
  background-color: var(--vp-c-bg);
}

.crop-img {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  pointer-events: none;
  max-width: none !important;
  max-height: none !important;
  object-fit: fill;
}

.crop-stage.grab .crop-box,
.crop-stage.grabbing .crop-box {
  cursor: inherit;
}

.crop-box {
  position: absolute;
  box-sizing: border-box;
  border: 2px solid var(--vp-c-brand-1);
  cursor: move;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.35) inset,
    0 0 0 9999px rgba(0, 0, 0, 0.45);
}

.h {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
  box-sizing: border-box;

  &.nw {
    left: 0;
    top: 0;
    cursor: nwse-resize;
  }

  &.ne {
    right: 0;
    top: 0;
    cursor: nesw-resize;
  }

  &.sw {
    left: 0;
    bottom: 0;
    cursor: nesw-resize;
  }

  &.se {
    right: 0;
    bottom: 0;
    cursor: nwse-resize;
  }
}
</style>
