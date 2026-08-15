export type ArcadeCoreId = "fbneo" | "mame2003_plus"

export type ArcadeSystemId = "neogeo" | "cps1" | "cps2" | "arcade"

export type ArcadeCoreOption = {
  id: ArcadeCoreId
  label: string
  hint: string
}

export type ArcadeSystemOption = {
  id: ArcadeSystemId
  label: string
  hint: string
  needsBios: boolean
  biosName?: string
}

export const ARCADE_SYSTEMS: ArcadeSystemOption[] = [
  {
    id: "neogeo",
    label: "Neo Geo",
    hint: "拳皇、合金弹头等。需要自备 neogeo.zip",
    needsBios: true,
    biosName: "neogeo.zip",
  },
  {
    id: "cps1",
    label: "CPS1",
    hint: "街霸 2、恐龙快打、三国志 II 等",
    needsBios: false,
  },
  {
    id: "cps2",
    label: "CPS2",
    hint: "街霸 Alpha、超级街霸 II X 等",
    needsBios: false,
  },
  {
    id: "arcade",
    label: "街机",
    hint: "其他兼容的街机 ROM",
    needsBios: false,
  },
]

export const ARCADE_CORES: ArcadeCoreOption[] = [
  { id: "fbneo", label: "街机", hint: "默认模拟器" },
  { id: "mame2003_plus", label: "街机（备用）", hint: "默认无法运行时再试" },
]

export const CORE_PRIORITY: Record<ArcadeSystemId, ArcadeCoreId[]> = {
  arcade: ["fbneo", "mame2003_plus"],
  neogeo: ["fbneo", "mame2003_plus"],
  cps1: ["fbneo", "mame2003_plus"],
  cps2: ["fbneo", "mame2003_plus"],
}

const LEGACY_CORE_TO_SYSTEM: Record<string, ArcadeSystemId> = {
  fbalpha2012_neogeo: "neogeo",
  fbalpha2012_cps1: "cps1",
  fbalpha2012_cps2: "cps2",
  fbalpha2012: "arcade",
  mame2003_plus: "arcade",
  mame2003: "arcade",
  mame: "arcade",
  fbneo: "arcade",
  arcade: "arcade",
}

export function getSystemOption(id?: string) {
  return ARCADE_SYSTEMS.find(item => item.id === id)
}

export function getCoreOption(id?: string) {
  return ARCADE_CORES.find(item => item.id === id)
}

export function normalizeCoreId(id?: string): ArcadeCoreId {
  if (id === "mame2003_plus" || id === "mame2003" || id === "mame") {
    return "mame2003_plus"
  }
  return "fbneo"
}

export function inferSystemFromLegacy(core?: string, fileName?: string): ArcadeSystemId {
  const name = (fileName || "").toLowerCase()
  if (name === "neogeo.zip" || name.startsWith("neogeo")) return "neogeo"
  if (core === "fbalpha2012_neogeo") return "neogeo"
  if (core === "fbalpha2012_cps2") return "cps2"
  if (core === "fbalpha2012_cps1") return "cps1"
  return LEGACY_CORE_TO_SYSTEM[core || ""] || "arcade"
}

export function resolveCores(system: ArcadeSystemId, preferred?: string): ArcadeCoreId[] {
  const list = CORE_PRIORITY[system] || CORE_PRIORITY.arcade
  const first = normalizeCoreId(preferred)
  return [first, ...list.filter(id => id !== first)].slice(0, 2)
}

export function inferBiosSystem(fileName: string): ArcadeSystemId | undefined {
  const name = fileName.trim().split(/[/\\]/).pop()?.toLowerCase() || ""
  if (name === "neogeo.zip") return "neogeo"
  return undefined
}

export { buildEjsControllers as getEjsDefaultControls } from "./controls"
