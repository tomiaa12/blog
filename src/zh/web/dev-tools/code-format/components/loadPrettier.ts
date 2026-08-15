import { loadFirstAvailable } from "@/utils"

const VERSION = "3.4.2"

const STANDALONE = [
  `https://cdn.jsdelivr.net/npm/prettier@${VERSION}/standalone.mjs`,
  `https://unpkg.com/prettier@${VERSION}/standalone.mjs`,
]

const PLUGIN_NAMES = [
  "estree",
  "babel",
  "typescript",
  "html",
  "postcss",
  "markdown",
  "yaml",
] as const

export type PrettierApi = {
  format: (src: string, opts: Record<string, unknown>) => string | Promise<string>
}

export type PrettierBundle = {
  prettier: PrettierApi
  plugins: unknown[]
}

let bundle: PrettierBundle | null = null
let ready: Promise<PrettierBundle> | null = null

async function importEsm(url: string) {
  return import(/* @vite-ignore */ url)
}

export async function ensurePrettier() {
  if (bundle) return bundle
  if (ready) return ready
  ready = loadFirstAvailable(STANDALONE, async url => {
    const prettier = (await importEsm(url)) as PrettierApi
    if (typeof prettier.format !== "function") throw new Error("prettier")
    const base = url.replace(/standalone\.mjs$/i, "")
    const plugins = await Promise.all(
      PLUGIN_NAMES.map(async name => {
        const mod = await importEsm(`${base}plugins/${name}.mjs`)
        return (mod as { default?: unknown }).default ?? mod
      })
    )
    return { prettier, plugins }
  })
    .then(mod => {
      bundle = mod
      return mod
    })
    .catch(err => {
      ready = null
      bundle = null
      throw err
    })
  return ready
}
