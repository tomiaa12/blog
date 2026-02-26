# 前端加载Lottie动态图标

## 使用方法

```vue
<template>
  <span>
    <ComLottie :src="top" />
  </span>
</template>

<script setup>
import ComLottie from '../ComLottie/index.vue'
const top = require('@/assets/lottie/up-arrow.json')
</script>
```
## 代码

示例为 Vue 2.7 的语法


```vue
<template>
  <div :style="{ width: displayWidth, height: displayHeight }">
    <div ref="container" style="width:100%;height:100%"></div>
  </div>
</template>

<script setup>
/**
 * LottiePlayer (Vue 2.7 <script setup>)
 * - 推荐方案：SVG renderer 使用 DOM 覆盖颜色（轻量），非 SVG 使用 JSON 替换（可靠）
 * - 支持 loop: true|false|number, repeatDelay(ms), autoplay, color 动态切换
 * - 新增 size prop：优先于 width/height，同时控制宽高
 */

import { ref, watch, onMounted, onBeforeUnmount, defineProps, defineEmits, defineExpose, computed, getCurrentInstance } from 'vue'
import lottie from 'lottie-web'

/* ---------------- props / emits ---------------- */
const props = defineProps({
  animationData: { type: Object, default: null }, // 已解析的动画对象（优先使用，直接传 import/require 的 JSON）
  src: { type: [String, Object], default: '' }, // 动画资源：可传 require(...) 的对象、public 绝对路径('/...') 或资源字符串
  loop: { type: [Boolean, Number], default: true }, // 循环设置：true=无限，false/0=一次，number=指定循环次数
  repeatDelay: { type: Number, default: 0 }, // 每次播放完成到下一次播放的等待时长（毫秒）
  autoplay: { type: Boolean, default: true }, // 是否在加载后自动播放
  renderer: { type: String, default: 'svg' }, // 渲染器：'svg'（默认） / 'canvas' / 'html'
  width: { type: [String, Number], default: '1em' }, // 容器宽度，支持带单位字符串或数字（数字视为 px）
  height: { type: [String, Number], default: '1em' }, // 容器高度，支持带单位字符串或数字（数字视为 px）
  size: { type: [String, Number], default: null }, // 同时设置宽高，优先于 width/height；可传 '10px' 或 10（数字视为 px）
  speed: { type: Number, default: 1 }, // 初始播放速度（1 为正常，<1 慢，>1 快）
  color: { type: String, default: null } // 目标颜色（任意 CSS color 字符串），为 null 则不替换颜色
})

const emit = defineEmits(['complete', 'loopComplete'])

/* computed: display width/height（若传 size 则优先使用） */
const displayWidth = computed(() => {
  const s = props.size
  if (s !== null && s !== undefined && s !== '') return typeof s === 'number' ? `${s}px` : String(s)
  const w = props.width
  return typeof w === 'number' ? `${w}px` : String(w)
})
const displayHeight = computed(() => {
  const s = props.size
  if (s !== null && s !== undefined && s !== '') return typeof s === 'number' ? `${s}px` : String(s)
  const h = props.height
  return typeof h === 'number' ? `${h}px` : String(h)
})

/* ---------------- refs / state ---------------- */
const container = ref(null)
const anim = ref(null)
const timeoutId = ref(null)
const intendedLoops = ref(1)
const remainingLoops = ref(0)
const isPlayingSequence = ref(false)

/* ---------------- util: fetch / resolve ---------------- */
async function _fetchJson(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('fetch failed: ' + res.status)
    return await res.json()
  } catch (e) {
    console.error('[LottiePlayer] fetch error:', e)
    return null
  }
}

async function resolveDataFromSrc(s) {
  if (!s) return null
  if (typeof s === 'object') return s.default || s

  if (typeof s === 'string') {
    if (s.startsWith('/')) return await _fetchJson(s)

    try {
      // webpack 常见：:src="require('@/assets/xxx.json')"
      // eslint-disable-next-line
      const mod = require(s)
      if (mod) return mod.default || mod
    } catch (e) {}

    if (typeof import.meta !== 'undefined') {
      try {
        const url = new URL(s, import.meta.url).href
        return await _fetchJson(url)
      } catch (e) {}
    }

    try {
      const publicPath = s.replace(/^@/, '')
      return await _fetchJson(publicPath)
    } catch (e) {}
  }
  return null
}

/* ---------------- util: color parsing & JSON color replace ---------------- */
/* parse arbitrary CSS color into normalized [r,g,b] (0~1) */
function parseColorToRgbNormalized(colorStr) {
  if (!colorStr || typeof window === 'undefined') return null
  const s = String(colorStr).trim()
  try {
    const cvs = document.createElement('canvas')
    cvs.width = cvs.height = 1
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#000'
    ctx.fillStyle = s
    const computed = ctx.fillStyle
    if (computed.startsWith('rgba') || computed.startsWith('rgb')) {
      const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
      if (m) return [parseInt(m[1], 10) / 255, parseInt(m[2], 10) / 255, parseInt(m[3], 10) / 255]
    }
    if (computed.startsWith('#')) {
      let hex = computed.slice(1)
      if (hex.length === 3) hex = hex.split('').map(h => h + h).join('')
      const rr = parseInt(hex.slice(0, 2), 16)
      const gg = parseInt(hex.slice(2, 4), 16)
      const bb = parseInt(hex.slice(4, 6), 16)
      return [rr / 255, gg / 255, bb / 255]
    }
  } catch (e) {}
  return null
}
function rgbNormalizedToHex([r, g, b]) {
  const to255 = v => Math.round(Math.max(0, Math.min(1, v)) * 255)
  const rr = to255(r).toString(16).padStart(2, '0')
  const gg = to255(g).toString(16).padStart(2, '0')
  const bb = to255(b).toString(16).padStart(2, '0')
  return `#${rr}${gg}${bb}`
}

/* deep clone + replace colors in animation JSON */
function cloneAndReplaceColors(data, targetRgb) {
  const copy = JSON.parse(JSON.stringify(data))
  function isRgbArray(arr) {
    return Array.isArray(arr) && arr.length >= 3 && arr.slice(0, 3).every(v => typeof v === 'number')
  }
  function normalizeAndReplaceArray(arr) {
    const alpha = arr.length >= 4 ? arr[3] : undefined
    const result = targetRgb.slice()
    if (alpha !== undefined) result.push(alpha)
    return result
  }
  function walk(obj) {
    if (!obj || typeof obj !== 'object') return
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (key === 'c' && val && typeof val === 'object' && (Array.isArray(val.k) || typeof val.k === 'number')) {
        if (Array.isArray(val.k) && isRgbArray(val.k)) {
          val.k = normalizeAndReplaceArray(val.k)
        } else if (Array.isArray(val.k) && Array.isArray(val.k[0])) {
          val.k = val.k.map(item => isRgbArray(item) ? normalizeAndReplaceArray(item) : item)
        }
        walk(val.k)
        continue
      }
      if (isRgbArray(val)) {
        obj[key] = normalizeAndReplaceArray(val)
        continue
      }
      if (typeof val === 'object' && val !== null) {
        walk(val)
        continue
      }
      if (typeof val === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val)) {
        obj[key] = rgbNormalizedToHex(targetRgb)
        continue
      }
    }
  }
  walk(copy)
  return copy
}

/* ---------------- util: SVG DOM override (轻量实时覆盖) ---------------- */
/** 应用颜色到 SVG DOM：替换 fill/stroke/stop-color（保留 none） */
function applyColorToSvgDom(containerEl, colorStr) {
  if (!containerEl || !colorStr) return
  const svg = containerEl.querySelector('svg')
  if (!svg) return
  // 填充与描边
  svg.querySelectorAll('[fill]').forEach(el => {
    try {
      const cur = el.getAttribute('fill')
      if (cur && cur !== 'none') el.setAttribute('fill', colorStr)
    } catch (e) {}
  })
  svg.querySelectorAll('[stroke]').forEach(el => {
    try {
      const cur = el.getAttribute('stroke')
      if (cur && cur !== 'none') el.setAttribute('stroke', colorStr)
    } catch (e) {}
  })
  // 渐变 stop
  svg.querySelectorAll('stop').forEach(stop => {
    try {
      if (stop.hasAttribute('stop-color')) stop.setAttribute('stop-color', colorStr)
    } catch (e) {}
  })
}

/* try to apply svg override once SVG exists; fallback checks */
function tryApplySvgOverrideWhenReady(colorStr) {
  if (!container.value) return
  // fast try
  applyColorToSvgDom(container.value, colorStr)

  // if svg not ready, wait for DOMLoaded event if available, or poll a few times
  const MAX_TRIES = 10
  let tries = 0
  const poll = () => {
    tries++
    applyColorToSvgDom(container.value, colorStr)
    if (container.value && container.value.querySelector && container.value.querySelector('svg')) {
      // applied
      return
    }
    if (tries < MAX_TRIES) {
      setTimeout(poll, 120)
    }
  }
  setTimeout(poll, 120)
}

/* ---------------- loop/sequence 控制（之前逻辑） ---------------- */
function computeIntendedLoops() {
  if (props.loop === true) return Infinity
  if (typeof props.loop === 'number') {
    const n = Number(props.loop)
    return isNaN(n) ? 1 : Math.max(0, Math.floor(n))
  }
  return 1
}

function onAnimComplete() {
  emit('loopComplete')
  if (intendedLoops.value === Infinity) {
    scheduleNextPlay()
    return
  }
  remainingLoops.value -= 1
  if (remainingLoops.value > 0) {
    scheduleNextPlay()
  } else {
    emit('complete')
    isPlayingSequence.value = false
  }
}

function scheduleNextPlay() {
  clearTimeout(timeoutId.value)
  if (!container.value || !anim.value) return
  const delay = Math.max(0, Number(props.repeatDelay) || 0)
  if (delay <= 0) {
    try { anim.value.goToAndPlay(0, true) } catch (e) { try { anim.value.play() } catch (e2) {} }
  } else {
    timeoutId.value = setTimeout(() => {
      try { anim.value.goToAndPlay(0, true) } catch (e) { try { anim.value.play() } catch (e2) {} }
    }, delay)
  }
}

/* ---------------- load/init 主流程（区分 svg vs 非 svg 颜色处理） ---------------- */
async function loadAndInit() {
  if (!container.value) return

  // 清理旧实例
  if (anim.value) {
    try { anim.value.removeEventListener && anim.value.removeEventListener('complete', onAnimComplete) } catch (e) {}
    try { anim.value.destroy() } catch (e) {}
    anim.value = null
  }
  clearTimeout(timeoutId.value)
  timeoutId.value = null
  isPlayingSequence.value = false

  let data = props.animationData || null
  if (!data && props.src) data = await resolveDataFromSrc(props.src)
  if (!data) {
    console.warn('[LottiePlayer] no animationData found. 推荐：:src="require(\'@/assets/xxx.json\')" 或 :animationData="importedJson" 或 放到 public 并传入 /xxx.json"')
    return
  }

  // 计算播放次数
  intendedLoops.value = computeIntendedLoops()
  remainingLoops.value = (intendedLoops.value === Infinity) ? Infinity : intendedLoops.value

  // 如果目标是 svg renderer 且传入 color：优先用 DOM 覆盖（轻量）
  // 否则对非 svg（或无法 DOM 覆盖时）使用 JSON 替换
  let finalData = data
  const wantColor = !!props.color
  const isSvgRenderer = props.renderer === 'svg'

  if (wantColor && !isSvgRenderer) {
    // canvas 或其他：替换 JSON（保证颜色在渲染帧中生效）
    const rgb = parseColorToRgbNormalized(props.color)
    if (rgb) {
      try { finalData = cloneAndReplaceColors(data, rgb) } catch (e) { finalData = data }
    }
  } else {
    // 如果是 svg renderer，我们仍使用原始数据 and 在加载后用 DOM 覆盖
    finalData = data
  }

  // 加载 animation（把 lottie 内部 loop 设为 false，由我们管理）
  anim.value = lottie.loadAnimation({
    container: container.value,
    renderer: props.renderer,
    loop: false,
    autoplay: false,
    animationData: finalData
  })

  try { anim.value.setSpeed(props.speed) } catch (e) {}

  try {
    anim.value.addEventListener && anim.value.addEventListener('complete', onAnimComplete)
  } catch (e) {}

  // 如果 renderer 是 svg，优先使用 DOM 覆盖（轻量）；尝试绑定 DOMLoaded 以更快响应
  if (isSvgRenderer && wantColor) {
    try {
      anim.value.addEventListener && anim.value.addEventListener('DOMLoaded', () => {
        tryApplySvgOverrideWhenReady(props.color)
      })
    } catch (e) {}
    // 兜底：立即尝试一次（若 SVG 已就绪）
    tryApplySvgOverrideWhenReady(props.color)
  }

  // 启动序列（如果 autoplay）
  if (props.autoplay) startSequence()
}

/* ---------------- 播放控制等（与之前保持一致） ---------------- */
function startSequence() {
  intendedLoops.value = computeIntendedLoops()
  remainingLoops.value = (intendedLoops.value === Infinity) ? Infinity : intendedLoops.value
  isPlayingSequence.value = true
  try { anim.value && anim.value.goToAndPlay(0, true) } catch (e) { anim.value && anim.value.play() }
}

function play() {
  if (!anim.value) {
    loadAndInit()
    return
  }
  try { anim.value.play() } catch (e) {}
}

function playFromStartSequence() {
  if (!anim.value) {
    loadAndInit()
    return
  }
  startSequence()
}

function pause() {
  if (anim.value) try { anim.value.pause() } catch (e) {}
  clearTimeout(timeoutId.value)
}

function stop() {
  if (anim.value) try { anim.value.stop() } catch (e) {}
  try { anim.value && anim.value.goToAndStop(0, true) } catch (e) {}
  clearTimeout(timeoutId.value)
  isPlayingSequence.value = false
}

function setSpeed(n) { if (anim.value) try { anim.value.setSpeed(n) } catch (e) {} }
function setDirection(dir) { if (anim.value) try { anim.value.setDirection(dir) } catch (e) {} }
function goToAndStop(frame, isFrame = true) { if (anim.value) try { anim.value.goToAndStop(frame, isFrame) } catch (e) {} }
function goToAndPlay(frame, isFrame = true) { if (anim.value) try { anim.value.goToAndPlay(frame, isFrame) } catch (e) {} }

/* ---------------- watchers / lifecycle ---------------- */
watch(() => props.src, () => { loadAndInit() })
watch(() => props.animationData, () => { loadAndInit() })
watch(() => props.speed, (v) => { setSpeed(v) })

// color 变化：如果 svg renderer -> 直接覆盖 DOM；否则重新 load（用 JSON 替换）
watch(() => props.color, (newColor) => {
  if (!newColor) return
  if (props.renderer === 'svg') {
    tryApplySvgOverrideWhenReady(newColor)
  } else {
    // 非 svg 需要用 JSON 替换并重载
    loadAndInit()
  }
})

onMounted(() => { loadAndInit() })

onBeforeUnmount(() => {
  if (anim.value) {
    try { anim.value.removeEventListener && anim.value.removeEventListener('complete', onAnimComplete) } catch (e) {}
    try { anim.value.destroy() } catch (e) {}
    anim.value = null
  }
  clearTimeout(timeoutId.value)
})

/* ---------------- expose ---------------- */
defineExpose({
  play,
  pause,
  stop,
  playFromStartSequence,
  setSpeed,
  setDirection,
  goToAndStop,
  goToAndPlay
})
</script>
```
