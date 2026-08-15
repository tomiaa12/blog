import { reactive } from "vue"

export type ArcadeAction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "b1"
  | "b2"
  | "b3"
  | "b4"
  | "b5"
  | "b6"
  | "coin"
  | "start"

export type PlayerKeymap = Record<ArcadeAction, string>

export type EjsPlayerControls = Record<number, { value: string; value2?: string }>
export type EjsControllers = Record<0 | 1 | 2 | 3, EjsPlayerControls>

export const ACTION_META: {
  id: ArcadeAction
  label: string
  group: "move" | "btn" | "sys"
  index: number
  value2: string
}[] = [
  { id: "up", label: "上", group: "move", index: 4, value2: "DPAD_UP" },
  { id: "down", label: "下", group: "move", index: 5, value2: "DPAD_DOWN" },
  { id: "left", label: "左", group: "move", index: 6, value2: "DPAD_LEFT" },
  { id: "right", label: "右", group: "move", index: 7, value2: "DPAD_RIGHT" },
  { id: "b1", label: "按钮 1", group: "btn", index: 0, value2: "BUTTON_2" },
  { id: "b2", label: "按钮 2", group: "btn", index: 8, value2: "BUTTON_1" },
  { id: "b3", label: "按钮 3", group: "btn", index: 1, value2: "BUTTON_4" },
  { id: "b4", label: "按钮 4", group: "btn", index: 9, value2: "BUTTON_3" },
  { id: "b5", label: "按钮 5", group: "btn", index: 10, value2: "LEFT_TOP_SHOULDER" },
  { id: "b6", label: "按钮 6", group: "btn", index: 11, value2: "RIGHT_TOP_SHOULDER" },
  { id: "coin", label: "投币", group: "sys", index: 2, value2: "SELECT" },
  { id: "start", label: "开始", group: "sys", index: 3, value2: "START" },
]

const EJS_KEY_BY_CODE: Record<number, string> = {
  8: "backspace",
  9: "tab",
  13: "enter",
  16: "shift",
  17: "ctrl",
  18: "alt",
  19: "pause/break",
  20: "caps lock",
  27: "escape",
  32: "space",
  33: "page up",
  34: "page down",
  35: "end",
  36: "home",
  37: "left arrow",
  38: "up arrow",
  39: "right arrow",
  40: "down arrow",
  45: "insert",
  46: "delete",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  65: "a",
  66: "b",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z",
  96: "numpad 0",
  97: "numpad 1",
  98: "numpad 2",
  99: "numpad 3",
  100: "numpad 4",
  101: "numpad 5",
  102: "numpad 6",
  103: "numpad 7",
  104: "numpad 8",
  105: "numpad 9",
  106: "multiply",
  107: "add",
  109: "subtract",
  110: "decimal point",
  111: "divide",
  186: "semi-colon",
  187: "equal sign",
  188: "comma",
  189: "dash",
  190: "period",
  191: "forward slash",
  192: "grave accent",
  219: "open bracket",
  220: "back slash",
  221: "close braket",
  222: "single quote",
}

const KEY_LABEL: Record<string, string> = {
  "up arrow": "↑",
  "down arrow": "↓",
  "left arrow": "←",
  "right arrow": "→",
  space: "空格",
  enter: "回车",
  shift: "Shift",
  ctrl: "Ctrl",
  alt: "Alt",
  tab: "Tab",
  backspace: "退格",
  delete: "Del",
  insert: "Ins",
  home: "Home",
  end: "End",
  "page up": "PgUp",
  "page down": "PgDn",
  comma: ",",
  period: ".",
  dash: "-",
  "forward slash": "/",
  "semi-colon": ";",
  "equal sign": "=",
  "grave accent": "`",
  "open bracket": "[",
  "close braket": "]",
  "back slash": "\\",
  "single quote": "'",
  add: "小键盘+",
  subtract: "小键盘-",
  multiply: "小键盘*",
  divide: "小键盘/",
  "decimal point": "小键盘.",
  "numpad 0": "小键盘0",
  "numpad 1": "小键盘1",
  "numpad 2": "小键盘2",
  "numpad 3": "小键盘3",
  "numpad 4": "小键盘4",
  "numpad 5": "小键盘5",
  "numpad 6": "小键盘6",
  "numpad 7": "小键盘7",
  "numpad 8": "小键盘8",
  "numpad 9": "小键盘9",
}

const STORAGE_KEY = "kyx-arcade-controls-v1"

export const DEFAULT_PLAYER_MAPS: PlayerKeymap[] = [
  {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    b1: "j",
    b2: "k",
    b3: "u",
    b4: "i",
    b5: "o",
    b6: "l",
    coin: "5",
    start: "1",
  },
  {
    up: "up arrow",
    down: "down arrow",
    left: "left arrow",
    right: "right arrow",
    b1: "numpad 1",
    b2: "numpad 2",
    b3: "numpad 3",
    b4: "numpad 4",
    b5: "numpad 5",
    b6: "numpad 6",
    coin: "6",
    start: "2",
  },
  {
    up: "t",
    down: "g",
    left: "f",
    right: "h",
    b1: "r",
    b2: "y",
    b3: "c",
    b4: "v",
    b5: "b",
    b6: "n",
    coin: "7",
    start: "3",
  },
  {
    up: "i",
    down: "k",
    left: "j",
    right: "l",
    b1: "z",
    b2: "x",
    b3: "q",
    b4: "e",
    b5: "comma",
    b6: "period",
    coin: "8",
    start: "4",
  },
]

function cloneMaps(maps = DEFAULT_PLAYER_MAPS): PlayerKeymap[] {
  return maps.map(item => ({ ...item }))
}

function normalizeCount(value: unknown) {
  const n = Number(value)
  if (n === 3 || n === 4) return n
  return 2
}

function loadStored() {
  if (typeof window === "undefined") {
    return { playerCount: 2, maps: cloneMaps() }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { playerCount: 2, maps: cloneMaps() }
    const parsed = JSON.parse(raw) as { playerCount?: number; maps?: PlayerKeymap[] }
    const maps = cloneMaps()
    parsed.maps?.slice(0, 4).forEach((item, index) => {
      if (!item) return
      maps[index] = { ...maps[index], ...item }
    })
    return { playerCount: normalizeCount(parsed.playerCount), maps }
  } catch {
    return { playerCount: 2, maps: cloneMaps() }
  }
}

const stored = loadStored()

export const arcadeControls = reactive({
  playerCount: stored.playerCount,
  maps: stored.maps,
  listening: null as { player: number; action: ArcadeAction } | null,
})

function persist() {
  if (typeof window === "undefined") return
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      playerCount: arcadeControls.playerCount,
      maps: arcadeControls.maps,
    })
  )
}

export function keyLabel(key: string) {
  if (!key) return "未设置"
  return KEY_LABEL[key] || key.toUpperCase()
}

export function eventToEjsKey(e: KeyboardEvent) {
  if (e.key === "Escape") return null
  return EJS_KEY_BY_CODE[e.keyCode] || null
}

export function buildEjsControllers(
  maps = arcadeControls.maps,
  playerCount = arcadeControls.playerCount
): EjsControllers {
  const next = { 0: {}, 1: {}, 2: {}, 3: {} } as EjsControllers
  for (let i = 0; i < playerCount; i++) {
    const map = maps[i]
    const player = {} as EjsPlayerControls
    for (const action of ACTION_META) {
      const value = map?.[action.id]
      if (!value) continue
      player[action.index] = { value, value2: action.value2 }
    }
    next[i as 0 | 1 | 2 | 3] = player
  }
  return next
}

export function findKeyConflicts(playerCount = arcadeControls.playerCount) {
  const used = new Map<string, string[]>()
  for (let i = 0; i < playerCount; i++) {
    const map = arcadeControls.maps[i]
    for (const action of ACTION_META) {
      const key = map[action.id]
      if (!key) continue
      const label = `P${i + 1} ${action.label}`
      const list = used.get(key) || []
      list.push(label)
      used.set(key, list)
    }
  }
  return [...used.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([key, list]) => ({ key, list }))
}

export function setPlayerCount(count: number) {
  arcadeControls.playerCount = normalizeCount(count)
  persist()
}

export function addPlayer() {
  if (arcadeControls.playerCount >= 4) return
  arcadeControls.playerCount += 1
  persist()
}

export function removePlayer(index: number) {
  if (index < 2 || arcadeControls.playerCount <= 2) return
  if (index !== arcadeControls.playerCount - 1) return
  arcadeControls.playerCount -= 1
  persist()
}

export function setPlayerKey(player: number, action: ArcadeAction, key: string) {
  if (!arcadeControls.maps[player]) return
  arcadeControls.maps[player][action] = key
  persist()
}

export function resetArcadeControls() {
  arcadeControls.playerCount = 2
  arcadeControls.maps = cloneMaps()
  arcadeControls.listening = null
  persist()
}

export function startListen(player: number, action: ArcadeAction) {
  arcadeControls.listening = { player, action }
}

export function cancelListen() {
  arcadeControls.listening = null
}

export function applyListenKey(e: KeyboardEvent) {
  const current = arcadeControls.listening
  if (!current) return false
  if (e.key === "Escape") {
    cancelListen()
    return true
  }
  const key = eventToEjsKey(e)
  if (!key) return true
  setPlayerKey(current.player, current.action, key)
  cancelListen()
  return true
}
