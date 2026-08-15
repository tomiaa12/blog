import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/javascript-obfuscator@4.1.1/dist/index.browser.js",
  "https://unpkg.com/javascript-obfuscator@4.1.1/dist/index.browser.js",
]

export type ObfuscatorOptions = {
  compact?: boolean
  controlFlowFlattening?: boolean
  controlFlowFlatteningThreshold?: number
  deadCodeInjection?: boolean
  deadCodeInjectionThreshold?: number
  debugProtection?: boolean
  disableConsoleOutput?: boolean
  identifierNamesGenerator?: "hexadecimal" | "mangled" | "mangled-shuffled"
  numbersToExpressions?: boolean
  renameGlobals?: boolean
  selfDefending?: boolean
  simplify?: boolean
  splitStrings?: boolean
  splitStringsChunkLength?: number
  stringArray?: boolean
  stringArrayEncoding?: Array<"none" | "base64" | "rc4">
  stringArrayThreshold?: number
  target?: "browser" | "browser-no-eval" | "node"
  unicodeEscapeSequence?: boolean
}

export type ObfuscatorLib = {
  obfuscate: (
    code: string,
    options?: ObfuscatorOptions
  ) => { getObfuscatedCode: () => string }
}

let lib: ObfuscatorLib | null = null
let ready: Promise<ObfuscatorLib> | null = null

export async function ensureObfuscator() {
  if (lib) return lib
  if (ready) return ready
  ready = loadFirstAvailable(CDN_LIST, async url => {
    const win = await loadScript(url)
    const mod = (win as Window & { JavaScriptObfuscator?: ObfuscatorLib }).JavaScriptObfuscator
    if (!mod || typeof mod.obfuscate !== "function") throw new Error("JavaScriptObfuscator")
    return mod
  })
    .then(mod => {
      lib = mod
      return mod
    })
    .catch(err => {
      ready = null
      lib = null
      throw err
    })
  return ready
}
