export type RGBA = { r: number; g: number; b: number; a: number }

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function round(n: number, d = 0) {
  const p = 10 ** d
  return Math.round(n * p) / p
}

export function rgbToHex({ r, g, b, a }: RGBA, withAlpha = a < 1) {
  const h = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")
  return `#${h(r)}${h(g)}${h(b)}${withAlpha ? h(a * 255) : ""}`
}

export function hexToRgb(input: string): RGBA | null {
  let s = input.trim().replace(/^#/, "")
  if (/^[0-9a-f]{3}$/i.test(s)) {
    s = s
      .split("")
      .map(c => c + c)
      .join("")
  }
  if (/^[0-9a-f]{4}$/i.test(s)) {
    s = s
      .split("")
      .map(c => c + c)
      .join("")
  }
  if (/^[0-9a-f]{6}$/i.test(s)) {
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16),
      a: 1,
    }
  }
  if (/^[0-9a-f]{8}$/i.test(s)) {
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16),
      a: parseInt(s.slice(6, 8), 16) / 255,
    }
  }
  return null
}

export function rgbToHsl({ r, g, b, a }: RGBA) {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === R) h = (G - B) / d + (G < B ? 6 : 0)
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h *= 60
  }
  return { h, s: s * 100, l: l * 100, a }
}

export function hslToRgb(h: number, s: number, l: number, a = 1): RGBA {
  const S = clamp(s, 0, 100) / 100
  const L = clamp(l, 0, 100) / 100
  const C = (1 - Math.abs(2 * L - 1)) * S
  const Hp = (((h % 360) + 360) % 360) / 60
  const X = C * (1 - Math.abs((Hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (Hp < 1) [r, g, b] = [C, X, 0]
  else if (Hp < 2) [r, g, b] = [X, C, 0]
  else if (Hp < 3) [r, g, b] = [0, C, X]
  else if (Hp < 4) [r, g, b] = [0, X, C]
  else if (Hp < 5) [r, g, b] = [X, 0, C]
  else [r, g, b] = [C, 0, X]
  const m = L - C / 2
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a }
}

export function rgbToHsv({ r, g, b, a }: RGBA) {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const d = max - min
  let h = 0
  if (d) {
    if (max === R) h = (G - B) / d + (G < B ? 6 : 0)
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h *= 60
  }
  return { h, s: max ? (d / max) * 100 : 0, v: max * 100, a }
}

export function hsvToRgb(h: number, s: number, v: number, a = 1): RGBA {
  const S = clamp(s, 0, 100) / 100
  const V = clamp(v, 0, 100) / 100
  const C = V * S
  const Hp = (((h % 360) + 360) % 360) / 60
  const X = C * (1 - Math.abs((Hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (Hp < 1) [r, g, b] = [C, X, 0]
  else if (Hp < 2) [r, g, b] = [X, C, 0]
  else if (Hp < 3) [r, g, b] = [0, C, X]
  else if (Hp < 4) [r, g, b] = [0, X, C]
  else if (Hp < 5) [r, g, b] = [X, 0, C]
  else [r, g, b] = [C, 0, X]
  const m = V - C
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a }
}

export function rgbToHwb({ r, g, b, a }: RGBA) {
  const hsv = rgbToHsv({ r, g, b, a })
  const w = ((1 - hsv.s / 100) * hsv.v) / 1
  const bk = 100 - hsv.v
  return { h: hsv.h, w, b: bk, a }
}

export function hwbToRgb(h: number, w: number, bk: number, a = 1): RGBA {
  const W = clamp(w, 0, 100) / 100
  const B = clamp(bk, 0, 100) / 100
  const sum = W + B
  const ww = sum > 1 ? W / sum : W
  const bb = sum > 1 ? B / sum : B
  const rgb = hsvToRgb(h, 100, 100, a)
  return {
    r: rgb.r * (1 - ww - bb) + ww * 255,
    g: rgb.g * (1 - ww - bb) + ww * 255,
    b: rgb.b * (1 - ww - bb) + ww * 255,
    a,
  }
}

export function rgbToCmyk({ r, g, b, a }: RGBA) {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const k = 1 - Math.max(R, G, B)
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100, a }
  return {
    c: ((1 - R - k) / (1 - k)) * 100,
    m: ((1 - G - k) / (1 - k)) * 100,
    y: ((1 - B - k) / (1 - k)) * 100,
    k: k * 100,
    a,
  }
}

export function cmykToRgb(c: number, m: number, y: number, k: number, a = 1): RGBA {
  const C = clamp(c, 0, 100) / 100
  const M = clamp(m, 0, 100) / 100
  const Y = clamp(y, 0, 100) / 100
  const K = clamp(k, 0, 100) / 100
  return {
    r: 255 * (1 - C) * (1 - K),
    g: 255 * (1 - M) * (1 - K),
    b: 255 * (1 - Y) * (1 - K),
    a,
  }
}

const NAMES: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  orange: "#ffa500",
  purple: "#800080",
  pink: "#ffc0cb",
  brown: "#a52a2a",
  gray: "#808080",
  grey: "#808080",
  navy: "#000080",
  teal: "#008080",
  olive: "#808000",
  maroon: "#800000",
  lime: "#00ff00",
  aqua: "#00ffff",
  silver: "#c0c0c0",
  gold: "#ffd700",
  coral: "#ff7f50",
  tomato: "#ff6347",
  salmon: "#fa8072",
  khaki: "#f0e68c",
  violet: "#ee82ee",
  indigo: "#4b0082",
  turquoise: "#40e0d0",
  skyblue: "#87ceeb",
  steelblue: "#4682b4",
  royalblue: "#4169e1",
  dodgerblue: "#1e90ff",
  deepskyblue: "#00bfff",
  hotpink: "#ff69b4",
  deeppink: "#ff1493",
  crimson: "#dc143c",
  chocolate: "#d2691e",
  peru: "#cd853f",
  tan: "#d2b48c",
  beige: "#f5f5dc",
  ivory: "#fffff0",
  snow: "#fffafa",
  azure: "#f0ffff",
  aliceblue: "#f0f8ff",
  mintcream: "#f5fffa",
  lavender: "#e6e6fa",
  plum: "#dda0dd",
  orchid: "#da70d6",
  thistle: "#d8bfd8",
}

export function nameToRgb(name: string): RGBA | null {
  const hex = NAMES[name.trim().toLowerCase().replace(/\s+/g, "")]
  return hex ? hexToRgb(hex) : null
}

function num(v: string) {
  const s = v.trim()
  if (s.endsWith("%")) return parseFloat(s)
  return parseFloat(s)
}

export function parseColor(raw: string): RGBA | null {
  const text = raw.trim()
  if (!text) return null
  const named = nameToRgb(text)
  if (named) return named
  const hex = hexToRgb(text)
  if (hex) return hex
  if (/^0x[0-9a-f]{6,8}$/i.test(text)) return hexToRgb(text.slice(2))

  const fn = text.match(/^([a-z]+)\((.+)\)$/i)
  if (fn) {
    const kind = fn[1]!.toLowerCase()
    const parts = fn[2]!.split(/[\s,/]+/).filter(Boolean)
    if ((kind === "rgb" || kind === "rgba") && parts.length >= 3) {
      const r = parts[0]!.endsWith("%") ? (num(parts[0]!) / 100) * 255 : num(parts[0]!)
      const g = parts[1]!.endsWith("%") ? (num(parts[1]!) / 100) * 255 : num(parts[1]!)
      const b = parts[2]!.endsWith("%") ? (num(parts[2]!) / 100) * 255 : num(parts[2]!)
      const a = parts[3] !== undefined ? num(parts[3]!) : 1
      return { r, g, b, a: a > 1 ? a / 255 : a }
    }
    if ((kind === "hsl" || kind === "hsla") && parts.length >= 3) {
      return hslToRgb(num(parts[0]!), num(parts[1]!), num(parts[2]!), parts[3] !== undefined ? num(parts[3]!) : 1)
    }
    if ((kind === "hsv" || kind === "hsb") && parts.length >= 3) {
      return hsvToRgb(num(parts[0]!), num(parts[1]!), num(parts[2]!), parts[3] !== undefined ? num(parts[3]!) : 1)
    }
    if (kind === "hwb" && parts.length >= 3) {
      return hwbToRgb(num(parts[0]!), num(parts[1]!), num(parts[2]!), parts[3] !== undefined ? num(parts[3]!) : 1)
    }
    if (kind === "cmyk" && parts.length >= 4) {
      return cmykToRgb(num(parts[0]!), num(parts[1]!), num(parts[2]!), num(parts[3]!))
    }
  }

  const csv = text.split(/[\s,]+/).filter(Boolean)
  if (csv.length === 3 && csv.every(x => /^-?\d+(\.\d+)?%?$/.test(x))) {
    return {
      r: csv[0]!.endsWith("%") ? (num(csv[0]!) / 100) * 255 : num(csv[0]!),
      g: csv[1]!.endsWith("%") ? (num(csv[1]!) / 100) * 255 : num(csv[1]!),
      b: csv[2]!.endsWith("%") ? (num(csv[2]!) / 100) * 255 : num(csv[2]!),
      a: 1,
    }
  }
  return null
}

export function formatAll(c: RGBA) {
  const r = clamp(Math.round(c.r), 0, 255)
  const g = clamp(Math.round(c.g), 0, 255)
  const b = clamp(Math.round(c.b), 0, 255)
  const a = clamp(c.a, 0, 1)
  const base = { r, g, b, a }
  const hsl = rgbToHsl(base)
  const hsv = rgbToHsv(base)
  const hwb = rgbToHwb(base)
  const cmyk = rgbToCmyk(base)
  const hex = rgbToHex(base, false)
  const hexa = rgbToHex(base, true)
  const aStr = a < 1 ? `, ${round(a, 3)}` : ""
  return {
    hex,
    hexa,
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${round(a, 3)})`,
    hsl: `hsl(${round(hsl.h)} ${round(hsl.s)}% ${round(hsl.l)}%)`,
    hsla: `hsla(${round(hsl.h)}, ${round(hsl.s)}%, ${round(hsl.l)}%${aStr})`,
    hsv: `hsv(${round(hsv.h)}, ${round(hsv.s)}%, ${round(hsv.v)}%)`,
    hsb: `hsb(${round(hsv.h)}, ${round(hsv.s)}%, ${round(hsv.v)}%)`,
    hwb: `hwb(${round(hwb.h)} ${round(hwb.w)}% ${round(hwb.b)}%)`,
    cmyk: `cmyk(${round(cmyk.c)}%, ${round(cmyk.m)}%, ${round(cmyk.y)}%, ${round(cmyk.k)}%)`,
    dec: `0x${hex.slice(1).toUpperCase()}`,
    css: a < 1 ? `rgba(${r}, ${g}, ${b}, ${round(a, 3)})` : hex,
    r,
    g,
    b,
    a,
    hh: round(hsl.h),
    hs: round(hsl.s),
    hl: round(hsl.l),
    vh: round(hsv.h),
    vs: round(hsv.s),
    vv: round(hsv.v),
  }
}
