import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/js-beautify@1.15.4/js/lib/beautify.js",
  "https://unpkg.com/js-beautify@1.15.4/js/lib/beautify.js",
]

export type BeautifyOptions = {
  indent_size?: number
  indent_char?: string
  unescape_strings?: boolean
  wrap_line_length?: number
  preserve_newlines?: boolean
  max_preserve_newlines?: number
  end_with_newline?: boolean
}

export type BeautifyFn = (code: string, options?: BeautifyOptions) => string

let fn: BeautifyFn | null = null
let ready: Promise<BeautifyFn> | null = null

export async function ensureBeautify() {
  if (fn) return fn
  if (ready) return ready
  ready = loadFirstAvailable(CDN_LIST, async url => {
    const win = await loadScript(url)
    const pick = (win as Window & { js_beautify?: BeautifyFn }).js_beautify
    if (typeof pick !== "function") throw new Error("js_beautify")
    return pick
  })
    .then(pick => {
      fn = pick
      return pick
    })
    .catch(err => {
      ready = null
      fn = null
      throw err
    })
  return ready
}
