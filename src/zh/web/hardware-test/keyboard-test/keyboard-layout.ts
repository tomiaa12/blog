/** US 104-key style physical layout; matching uses KeyboardEvent.code */

export type KeyCap = {
  codes: string[]
  label: string
  flex?: number
  /** Empty cell for alignment (navigation cluster) */
  spacer?: boolean
}

const f = (w: number) => ({ flex: w } as const)

export const KEYBOARD_ROW_F: KeyCap[] = [
  { codes: ["Escape"], label: "Esc", ...f(1) },
  { codes: ["F1"], label: "F1", ...f(0.7) },
  { codes: ["F2"], label: "F2", ...f(0.7) },
  { codes: ["F3"], label: "F3", ...f(0.7) },
  { codes: ["F4"], label: "F4", ...f(0.7) },
  { codes: ["F5"], label: "F5", ...f(0.7) },
  { codes: ["F6"], label: "F6", ...f(0.7) },
  { codes: ["F7"], label: "F7", ...f(0.7) },
  { codes: ["F8"], label: "F8", ...f(0.7) },
  { codes: ["F9"], label: "F9", ...f(0.7) },
  { codes: ["F10"], label: "F10", ...f(0.7) },
  { codes: ["F11"], label: "F11", ...f(0.7) },
  { codes: ["F12"], label: "F12", ...f(0.7) },
  { codes: [], label: "", spacer: true, flex: 0.35 },
  { codes: ["PrintScreen"], label: "PrtSc", ...f(0.85) },
  { codes: ["ScrollLock"], label: "ScrLk", ...f(0.85) },
  { codes: ["Pause"], label: "Pause", ...f(0.85) },
]

export const KEYBOARD_MAIN_ROWS: KeyCap[][] = [
  [
    { codes: ["Backquote"], label: "` ~", ...f(0.7) },
    { codes: ["Digit1"], label: "1", ...f(0.65) },
    { codes: ["Digit2"], label: "2", ...f(0.65) },
    { codes: ["Digit3"], label: "3", ...f(0.65) },
    { codes: ["Digit4"], label: "4", ...f(0.65) },
    { codes: ["Digit5"], label: "5", ...f(0.65) },
    { codes: ["Digit6"], label: "6", ...f(0.65) },
    { codes: ["Digit7"], label: "7", ...f(0.65) },
    { codes: ["Digit8"], label: "8", ...f(0.65) },
    { codes: ["Digit9"], label: "9", ...f(0.65) },
    { codes: ["Digit0"], label: "0", ...f(0.65) },
    { codes: ["Minus"], label: "- _", ...f(0.65) },
    { codes: ["Equal"], label: "= +", ...f(0.65) },
    { codes: ["Backspace"], label: "Backspace", ...f(1.8) },
  ],
  [
    { codes: ["Tab"], label: "Tab", ...f(1.2) },
    { codes: ["KeyQ"], label: "Q", ...f(0.65) },
    { codes: ["KeyW"], label: "W", ...f(0.65) },
    { codes: ["KeyE"], label: "E", ...f(0.65) },
    { codes: ["KeyR"], label: "R", ...f(0.65) },
    { codes: ["KeyT"], label: "T", ...f(0.65) },
    { codes: ["KeyY"], label: "Y", ...f(0.65) },
    { codes: ["KeyU"], label: "U", ...f(0.65) },
    { codes: ["KeyI"], label: "I", ...f(0.65) },
    { codes: ["KeyO"], label: "O", ...f(0.65) },
    { codes: ["KeyP"], label: "P", ...f(0.65) },
    { codes: ["BracketLeft"], label: "[ {", ...f(0.65) },
    { codes: ["BracketRight"], label: "] }", ...f(0.65) },
    { codes: ["Backslash"], label: "\\ |", ...f(1) },
  ],
  [
    { codes: ["CapsLock"], label: "Caps", ...f(1.35) },
    { codes: ["KeyA"], label: "A", ...f(0.65) },
    { codes: ["KeyS"], label: "S", ...f(0.65) },
    { codes: ["KeyD"], label: "D", ...f(0.65) },
    { codes: ["KeyF"], label: "F", ...f(0.65) },
    { codes: ["KeyG"], label: "G", ...f(0.65) },
    { codes: ["KeyH"], label: "H", ...f(0.65) },
    { codes: ["KeyJ"], label: "J", ...f(0.65) },
    { codes: ["KeyK"], label: "K", ...f(0.65) },
    { codes: ["KeyL"], label: "L", ...f(0.65) },
    { codes: ["Semicolon"], label: "; :", ...f(0.65) },
    { codes: ["Quote"], label: "' \"", ...f(0.65) },
    { codes: ["Enter"], label: "Enter", ...f(1.6) },
  ],
  [
    { codes: ["ShiftLeft"], label: "Shift", ...f(1.6) },
    { codes: ["KeyZ"], label: "Z", ...f(0.65) },
    { codes: ["KeyX"], label: "X", ...f(0.65) },
    { codes: ["KeyC"], label: "C", ...f(0.65) },
    { codes: ["KeyV"], label: "V", ...f(0.65) },
    { codes: ["KeyB"], label: "B", ...f(0.65) },
    { codes: ["KeyN"], label: "N", ...f(0.65) },
    { codes: ["KeyM"], label: "M", ...f(0.65) },
    { codes: ["Comma"], label: ", <", ...f(0.65) },
    { codes: ["Period"], label: ". >", ...f(0.65) },
    { codes: ["Slash"], label: "/ ?", ...f(0.65) },
    { codes: ["ShiftRight"], label: "Shift", ...f(1.6) },
  ],
  [
    { codes: ["ControlLeft"], label: "Ctrl", ...f(1) },
    { codes: ["MetaLeft"], label: "Win", ...f(0.9) },
    { codes: ["AltLeft"], label: "Alt", ...f(0.9) },
    { codes: ["Space"], label: "Space", ...f(5) },
    { codes: ["AltRight"], label: "Alt", ...f(0.9) },
    { codes: ["ContextMenu"], label: "Menu", ...f(0.9) },
    { codes: ["ControlRight"], label: "Ctrl", ...f(1) },
  ],
]

/** Insert / Home / arrows block (to the left of numpad) */
export const KEYBOARD_NAV_ROWS: KeyCap[][] = [
  [
    { codes: ["Insert"], label: "Ins", ...f(1) },
    { codes: ["Home"], label: "Home", ...f(1) },
    { codes: ["PageUp"], label: "PgUp", ...f(1) },
  ],
  [
    { codes: ["Delete"], label: "Del", ...f(1) },
    { codes: ["End"], label: "End", ...f(1) },
    { codes: ["PageDown"], label: "PgDn", ...f(1) },
  ],
  [
    { codes: [], label: "", spacer: true, flex: 1 },
    { codes: ["ArrowUp"], label: "↑", ...f(1) },
    { codes: [], label: "", spacer: true, flex: 1 },
  ],
  [
    { codes: ["ArrowLeft"], label: "←", ...f(1) },
    { codes: ["ArrowDown"], label: "↓", ...f(1) },
    { codes: ["ArrowRight"], label: "→", ...f(1) },
  ],
]

/** CSS grid placement on a 4×5 numpad (line indices 1-based) */
export const NUMPAD_PLACEMENTS: { cap: KeyCap; gridColumn: string; gridRow: string }[] = [
  { cap: { codes: ["NumLock"], label: "Num\nLock" }, gridColumn: "1", gridRow: "1" },
  { cap: { codes: ["NumpadDivide"], label: "/" }, gridColumn: "2", gridRow: "1" },
  { cap: { codes: ["NumpadMultiply"], label: "*" }, gridColumn: "3", gridRow: "1" },
  { cap: { codes: ["NumpadSubtract"], label: "-" }, gridColumn: "4", gridRow: "1" },
  { cap: { codes: ["Numpad7"], label: "7\nHome" }, gridColumn: "1", gridRow: "2" },
  { cap: { codes: ["Numpad8"], label: "8\n↑" }, gridColumn: "2", gridRow: "2" },
  { cap: { codes: ["Numpad9"], label: "9\nPgUp" }, gridColumn: "3", gridRow: "2" },
  {
    cap: { codes: ["NumpadAdd"], label: "+" },
    gridColumn: "4",
    gridRow: "2 / 4",
  },
  { cap: { codes: ["Numpad4"], label: "4\n←" }, gridColumn: "1", gridRow: "3" },
  { cap: { codes: ["Numpad5"], label: "5" }, gridColumn: "2", gridRow: "3" },
  { cap: { codes: ["Numpad6"], label: "6\n→" }, gridColumn: "3", gridRow: "3" },
  { cap: { codes: ["Numpad1"], label: "1\nEnd" }, gridColumn: "1", gridRow: "4" },
  { cap: { codes: ["Numpad2"], label: "2\n↓" }, gridColumn: "2", gridRow: "4" },
  { cap: { codes: ["Numpad3"], label: "3\nPgDn" }, gridColumn: "3", gridRow: "4" },
  {
    cap: { codes: ["NumpadEnter"], label: "Enter" },
    gridColumn: "4",
    gridRow: "4 / 6",
  },
  { cap: { codes: ["Numpad0"], label: "0\nIns" }, gridColumn: "1 / 3", gridRow: "5" },
  { cap: { codes: ["NumpadDecimal"], label: ".\nDel" }, gridColumn: "3", gridRow: "5" },
]

export function isAnyCodeDown(
  down: Record<string, boolean>,
  codes: string[]
): boolean {
  if (!codes.length) return false
  return codes.some(c => down[c])
}

export function isAnyCodeTouched(
  touched: Record<string, boolean>,
  codes: string[]
): boolean {
  if (!codes.length) return false
  return codes.some(c => touched[c])
}
