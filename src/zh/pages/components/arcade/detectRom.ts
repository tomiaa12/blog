import {
  normalizeCoreId,
  type ArcadeCoreId,
  type ArcadeSystemId,
} from "./cores"

const BIOS_NAMES = new Set(["neogeo.zip", "qsound.zip", "pgm.zip", "skns.zip"])

const NEOGEO_EXACT = [
  "kof94", "kof95", "kof96", "kof97", "kof98", "kof99", "kof2000", "kof2001",
  "kof2002", "kof2003", "mslug", "mslug2", "mslug3", "mslug4", "mslug5", "mslugx",
  "lastblad", "lastbld2", "samsho", "samsho2", "samsho3", "samsho4", "samsho5",
  "samsh5sp", "fatfury", "fatfury2", "fatfury3", "fatfursp", "garou", "rbff1",
  "rbff2", "rbffspec", "whp", "aof", "aof2", "aof3", "kotm", "kotm2", "sengoku",
  "sengoku2", "sengoku3", "viewpoin", "pulstar", "blazstar", "sonicwi2", "sonicwi3",
  "magdrop2", "magdrop3", "lbowling", "neobombe", "zedblade", "spinmast",
  "tophuntr", "crsword", "ncombat", "ncommand", "alpham2", "androdun", "bjourney",
  "cyberlip", "lresort", "mutnat", "nam1975", "ridhero", "trally", "twinspri",
  "wakuwak7", "breakers", "breakrev", "doubledr", "gowcaizr", "kabukikl", "kizuna",
  "neodrift", "overtop", "panicbom", "pbobblen", "pbobbl2n", "preisle2",
  "ragnagrd", "rotd", "s1945p", "savagere", "shocktr2", "shocktro", "socbrawl",
  "ssideki", "ssideki2", "ssideki3", "stakwin", "stakwin2", "strhoop", "ganryu",
  "bangbead", "popbounc", "zupapa", "ironclad", "pnyaa",
]

const CPS1_EXACT = [
  "sf2", "sf2ce", "sf2hf", "dino", "knights", "wof", "captcomm", "punisher",
  "ffight", "3wonders", "megaman", "strider", "ghouls", "cawing", "unsquad",
  "varth", "1941", "dynwar", "forgottn", "willow", "mercs", "mtwins", "nemo",
  "slammast", "mbomber", "pang3", "area88", "kod", "sfzch", "pnickj",
]

const CPS2_EXACT = [
  "sfa", "sfa2", "sfa3", "sfz", "sfz2", "sfz3", "ssf2", "ssf2t", "ssf2x",
  "msh", "mshvsf", "mvsc", "vsav", "vsav2", "vhunt", "vhunt2", "xmcota",
  "xmvsf", "19xx", "ddsom", "ddtod", "avsp", "spf2t", "armwar", "batcir",
  "csclub", "cybots", "dimahoo", "dstlk", "ecofghtr", "gigawing", "hsf2",
  "megaman2", "nwarr", "progear", "sgemf", "1944", "pzloop2", "ringdest",
]

const NEOGEO_PREFIX = [
  "kof", "mslug", "samsho", "samsh", "lastbl", "rbff", "fatfur", "garou",
  "aof", "sengoku", "pbobble",
]
const CPS1_PREFIX = ["sf2", "dino", "knights", "wof", "captcom", "punish", "ffight"]
const CPS2_PREFIX = [
  "sfa", "sfz", "ssf2", "msh", "mvsc", "vsav", "vhunt", "xmcota", "xmvsf",
  "ddsom", "ddtod", "avsp", "hsf2",
]
const ARCADE_EXACT = [
  "orlegend", "orlegende", "orlegendc", "kov", "kovplus",
  "kov2", "kov2p", "kovshp", "dmnfrnt", "theglad", "killbld", "olds", "drgw2",
  "photoy2k", "ket", "ddp2", "espgal", "esprade", "guwange",
]
const ARCADE_PREFIX = ["orlegend", "kov", "dmnfrnt", "theglad", "killbld", "olds", "drgw"]

const PGM2_EXACT = [
  "orleg2", "kov2nl", "kov3", "ddpdoj", "ddpdojt", "kof98umh",
]
const PGM2_PREFIX = ["orleg2", "kov2nl", "kov3", "ddpdoj"]
const PGM2_HINT =
  "这是 IGS PGM2（西游释厄传 2 / 三国战纪 2 乱世枭雄 / 三国战纪 3 等），网页街机目前无法运行。请换 CPS、Neo Geo，或一代西游 orlegend.zip、三国战纪 kov.zip / kov2.zip"

const DOC_EXT = /\.(txt|md|nfo|url|html?|jpg|jpeg|png|gif|webp|pdf|exe|doc|xls)$/i
const ROM_CHIP =
  /(\.(p[0-9]|s[0-9]|m[0-9]|v[0-9]|c[0-9]|bin|rom|key|ic[0-9]+|\d{2}[a-z]?|u\d+|igs\w*))$/i

export type RomInspect =
  | { ok: false; reason: string }
  | {
      ok: true
      system: ArcadeSystemId
      core: ArcadeCoreId
      fallbackCore: ArcadeCoreId
      setName: string
      displayName: string
      cloneOf?: string
    }

const NEO_CHIP_CODE: Record<string, string> = {
  "201": "mslug",
  "241": "mslug2",
  "256": "mslug3",
  "263": "mslug4",
  "268": "mslug5",
  "250": "mslugx",
  "232": "kof97",
  "242": "kof98",
  "251": "kof99",
  "257": "kof2000",
  "262": "kof2001",
  "265": "kof2002",
  "271": "kof2003",
  "055": "kof94",
  "084": "kof95",
  "214": "kof96",
  "019": "samsho",
  "063": "samsho2",
  "087": "samsho3",
  "222": "samsho4",
  "270": "samsho5",
  "234": "lastblad",
  "243": "lastbld2",
  "253": "garou",
}

function setNameOf(fileName: string) {
  return fileName.trim().split(/[/\\]/).pop()?.replace(/\.zip$/i, "").toLowerCase() || ""
}

export function isRomsetId(name: string) {
  return /^[a-z0-9][a-z0-9_]*$/.test(name) && name.length >= 2 && name.length <= 20
}

export function romsetZipName(setName: string) {
  return `${setName.replace(/\.zip$/i, "")}.zip`
}

export const ROMSET_NAME_HINT =
  "无法识别游戏编号。请把 zip 改成官方短文件名后再拖入，例如 kof97.zip、mslug.zip、sf2.zip"

function entryBase(name: string) {
  return name.replace(/\\/g, "/").split("/").pop()?.toLowerCase() || ""
}

export function resolveRomsetName(fileName: string, entryNames: string[] = []) {
  const fromFile = setNameOf(fileName)
  if (isRomsetId(fromFile) && detectSystemBySetName(fromFile)) return fromFile

  const bases = entryNames.map(entryBase).filter(Boolean)
  const innerZip = bases.find(n => {
    const set = n.replace(/\.zip$/, "")
    return n.endsWith(".zip") && isRomsetId(set) && !BIOS_NAMES.has(n)
  })
  if (innerZip) return innerZip.replace(/\.zip$/, "")

  for (const name of bases) {
    const neo = name.match(/^(\d{3})-/)
    if (neo && NEO_CHIP_CODE[neo[1]]) return NEO_CHIP_CODE[neo[1]]
    const chip = name.match(/^([a-z][a-z0-9]*)\.(p|s|m|v|c)\d/i)
    if (chip && isRomsetId(chip[1]) && detectSystemBySetName(chip[1])) return chip[1]
    const stem = name.replace(/\.[^.]+$/, "")
    const prefix = stem.match(/^([a-z0-9]+)/)
    if (prefix && isRomsetId(prefix[1]) && detectSystemBySetName(prefix[1])) {
      return prefix[1]
    }
  }

  if (isRomsetId(fromFile)) return fromFile
  return fromFile
}

function matchExact(name: string, list: string[]) {
  return list.includes(name) || list.some(item => name.startsWith(item) && name.length <= item.length + 4)
}

function matchPrefix(name: string, list: string[]) {
  return list.some(item => name === item || name.startsWith(item))
}

export function detectSystemBySetName(setName: string): ArcadeSystemId | undefined {
  if (matchExact(setName, NEOGEO_EXACT) || matchPrefix(setName, NEOGEO_PREFIX)) {
    return "neogeo"
  }
  if (matchExact(setName, CPS2_EXACT) || matchPrefix(setName, CPS2_PREFIX)) {
    return "cps2"
  }
  if (matchExact(setName, CPS1_EXACT) || matchPrefix(setName, CPS1_PREFIX)) {
    return "cps1"
  }
  if (matchExact(setName, ARCADE_EXACT) || matchPrefix(setName, ARCADE_PREFIX)) {
    return "arcade"
  }
  return undefined
}

function isPgm2Set(setName: string) {
  return (
    PGM2_EXACT.includes(setName) ||
    PGM2_PREFIX.some(item => setName === item || setName.startsWith(item))
  )
}

function looksLikePgm2(names: string[]) {
  const base = names.map(n => n.replace(/\\/g, "/").split("/").pop()!.toLowerCase())
  return base.some(
    n =>
      n.includes("igs036") ||
      n.startsWith("ig-a3_") ||
      n.startsWith("xyj2_") ||
      n.startsWith("kov3_") ||
      n.startsWith("gsyx_")
  )
}

function detectSystemByEntries(names: string[]): ArcadeSystemId | undefined {
  const base = names.map(n => n.replace(/\\/g, "/").split("/").pop()!.toLowerCase())
  if (base.some(n => n.endsWith(".key"))) return "cps2"
  const neo = base.filter(
    n =>
      /\.(p[12]|s1|m1|v[12]|c[1-8])$/.test(n) ||
      /-[psmvc][0-9]/.test(n)
  )
  if (neo.length >= 2) return "neogeo"
  const cpsNum = base.filter(n => /\.\d{2}[a-z]?$/.test(n)).length
  if (cpsNum >= 3) return "cps1"
  if (base.some(n => /\.igs\w*$/.test(n) || n.startsWith("ig-a_") || n.includes("pgm"))) {
    return "arcade"
  }
  return undefined
}

function looksLikeArcadeRom(names: string[]) {
  const base = names.map(n => n.replace(/\\/g, "/").split("/").pop()!.toLowerCase())
  if (!base.length) return false
  if (base.some(n => n.endsWith(".zip") && isRomsetId(n.replace(/\.zip$/, "")))) {
    return true
  }
  if (base.some(n => {
    const neo = n.match(/^(\d{3})-/)
    return Boolean(neo && NEO_CHIP_CODE[neo[1]])
  })) {
    return true
  }
  const docs = base.filter(n => DOC_EXT.test(n)).length
  const chips = base.filter(n => ROM_CHIP.test(n) || !n.includes(".")).length
  const others = base.length - docs
  return (chips >= 1 || others >= 2) && others > docs
}

function guessCloneParent(setName: string) {
  const hit = setName.match(/^(.*?)(h|ha|hdr|pls)$/)
  if (!hit) return
  const parent = hit[1]
  if (
    NEOGEO_EXACT.includes(parent) ||
    CPS1_EXACT.includes(parent) ||
    CPS2_EXACT.includes(parent) ||
    ARCADE_EXACT.includes(parent)
  ) {
    return parent
  }
}

async function listZipNames(file: File) {
  const mod = await import("jszip")
  const JSZip = (mod as any).default || mod
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  return Object.values(zip.files)
    .filter((f: any) => !f.dir)
    .map((f: any) => String(f.name))
}

export async function inspectArcadeRom(file: File): Promise<RomInspect> {
  const setName = setNameOf(file.name)
  if (!setName) return { ok: false, reason: "文件名无效" }
  if (BIOS_NAMES.has(`${setName}.zip`)) {
    return { ok: false, reason: "这是 Neo Geo 需要的 neogeo.zip，请和游戏一起拖进来" }
  }
  const unsupported = getUnsupportedReason(setName)
  if (unsupported) return { ok: false, reason: unsupported }

  let names: string[] = []
  try {
    names = await listZipNames(file)
  } catch {
    return { ok: false, reason: "不是有效的 zip，或文件已损坏" }
  }
  if (!names.length) return { ok: false, reason: "压缩包是空的" }
  if (looksLikePgm2(names)) return { ok: false, reason: PGM2_HINT }
  if (!looksLikeArcadeRom(names)) {
    return {
      ok: false,
      reason: "无法识别这个 ROM。可能不完整、格式不支持，或不是街机 ROM 包",
    }
  }

  const resolved = resolveRomsetName(file.name, names)
  if (!isRomsetId(resolved)) {
    return { ok: false, reason: ROMSET_NAME_HINT }
  }
  const unsupportedResolved = getUnsupportedReason(resolved)
  if (unsupportedResolved) return { ok: false, reason: unsupportedResolved }

  const system =
    detectSystemBySetName(resolved) || detectSystemByEntries(names) || "arcade"
  return {
    ok: true,
    system,
    core: normalizeCoreId("fbneo"),
    fallbackCore: "mame2003_plus",
    setName: resolved,
    displayName: setNameOf(file.name) || resolved,
    cloneOf: guessCloneParent(resolved),
  }
}

export async function resolveRecordSetName(fileName: string, data: ArrayBuffer) {
  let names: string[] = []
  try {
    names = await listZipNames(new File([data], fileName, { type: "application/zip" }))
  } catch {
    names = []
  }
  return resolveRomsetName(fileName, names)
}

export function getUnsupportedReason(fileName: string) {
  const setName = setNameOf(fileName)
  if (isPgm2Set(setName)) return PGM2_HINT
  return undefined
}

export function guessParentRomId(fileName: string) {
  const parent = guessCloneParent(setNameOf(fileName))
  return parent ? `${parent}.zip` : undefined
}
