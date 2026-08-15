import { parseIni, stringifyIni } from "./ini"
import { ensureToml } from "./loadToml"
import { ensureXml } from "./loadXml"
import { ensureYaml } from "./loadYaml"

export const FORMATS = ["json", "yaml", "toml", "xml", "ini"] as const
export type Format = (typeof FORMATS)[number]
export type SourceFormat = Format | "auto"

export function isLibError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  return /jsyaml|smol-toml|fast-xml-parser|资源|加载/.test(msg)
}

function normalize(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (typeof value === "bigint") return value.toString()
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "object") {
    const maybeIso = value as { toISOString?: () => string }
    if (
      Object.prototype.toString.call(value) !== "[object Object]" &&
      !Array.isArray(value) &&
      typeof maybeIso.toISOString === "function"
    ) {
      return maybeIso.toISOString()
    }
    if (Array.isArray(value)) return value.map(normalize)
    const out: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item === undefined) continue
      out[key] = normalize(item)
    }
    return out
  }
  return value
}

function asObject(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) return { items: value }
  if (value && typeof value === "object") return value as Record<string, unknown>
  return { value }
}

function xmlPayload(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) return { root: { item: value } }
  if (value && typeof value === "object") {
    const keys = Object.keys(value as object)
    if (keys.length === 1 && /^[A-Za-z_][\w.-]*$/.test(keys[0]!)) {
      return value as Record<string, unknown>
    }
    return { root: value as Record<string, unknown> }
  }
  return { root: { value } }
}

export function detectFormat(text: string): Format {
  const s = text.trim()
  if (!s) return "json"
  if (s.startsWith("<") || s.startsWith("<?xml")) return "xml"
  if (s.startsWith("{") || s.startsWith("[")) return "json"

  const lines = s
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#") && !line.startsWith(";"))
  const first = lines[0] ?? ""
  const hasEquals = lines.some(line => /^[^=:\s][^=]*\s*=\s*/.test(line))
  const hasColon = lines.some(line => /^[\w.-]+\s*:/.test(line))
  const hasTable = /^\[.+]$/.test(first) || lines.some(line => /^\[.+]$/.test(line))

  if (hasEquals && !hasColon) {
    if (lines.some(line => /=\s*(\{|\[|true|false|\d)/.test(line))) return "toml"
    return hasTable ? "ini" : "toml"
  }
  if (hasColon) return "yaml"
  if (hasTable) return "ini"
  return "yaml"
}

export function formatFromName(name: string): Format | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "json") return "json"
  if (ext === "yaml" || ext === "yml") return "yaml"
  if (ext === "toml") return "toml"
  if (ext === "xml") return "xml"
  if (ext === "ini" || ext === "cfg" || ext === "conf" || ext === "properties") return "ini"
  return null
}

export async function parseConfig(text: string, format: Format): Promise<unknown> {
  const src = text.replace(/^\uFEFF/, "")
  if (format === "json") return JSON.parse(src)
  if (format === "yaml") {
    const yaml = await ensureYaml()
    return normalize(yaml.load(src) ?? {})
  }
  if (format === "toml") {
    const toml = await ensureToml()
    return normalize(toml.parse(src))
  }
  if (format === "xml") {
    const { XMLParser } = await ensureXml()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      allowBooleanAttributes: true,
      ignoreDeclaration: true,
      ignorePiTags: true,
      trimValues: true,
    })
    return normalize(parser.parse(src))
  }
  return parseIni(src)
}

export async function parseAuto(text: string): Promise<{ format: Format; value: unknown }> {
  const guessed = detectFormat(text)
  const order: Format[] = [guessed, ...FORMATS.filter(item => item !== guessed)]
  let last: unknown
  for (const format of order) {
    try {
      return { format, value: await parseConfig(text, format) }
    } catch (err) {
      last = err
    }
  }
  throw last instanceof Error ? last : new Error(String(last))
}

export async function stringifyConfig(
  value: unknown,
  format: Format,
  indent: string | number
): Promise<string> {
  const data = normalize(value)
  if (format === "json") {
    return `${JSON.stringify(data, null, indent)}\n`
  }
  if (format === "yaml") {
    const yaml = await ensureYaml()
    return yaml.dump(data, {
      indent: typeof indent === "number" ? indent : 2,
      lineWidth: -1,
      noRefs: true,
      skipInvalid: true,
    })
  }
  if (format === "toml") {
    const toml = await ensureToml()
    return `${toml.stringify(asObject(data))}\n`
  }
  if (format === "xml") {
    const { XMLBuilder } = await ensureXml()
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      format: true,
      indentBy: typeof indent === "number" ? " ".repeat(indent) : "\t",
      suppressEmptyNode: true,
    })
    const body = String(builder.build(xmlPayload(data))).trim()
    return `<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`
  }
  return stringifyIni(asObject(data))
}

export const EXT: Record<Format, string> = {
  json: "json",
  yaml: "yaml",
  toml: "toml",
  xml: "xml",
  ini: "ini",
}

export const MIME: Record<Format, string> = {
  json: "application/json;charset=utf-8",
  yaml: "text/yaml;charset=utf-8",
  toml: "application/toml;charset=utf-8",
  xml: "application/xml;charset=utf-8",
  ini: "text/plain;charset=utf-8",
}

export const SAMPLES: Record<Format, string> = {
  json: `{
  "app": {
    "name": "demo",
    "version": "1.0.0",
    "debug": true
  },
  "server": {
    "host": "127.0.0.1",
    "port": 8080
  },
  "features": ["cache", "auth"]
}
`,
  yaml: `app:
  name: demo
  version: 1.0.0
  debug: true
server:
  host: 127.0.0.1
  port: 8080
features:
  - cache
  - auth
`,
  toml: `features = ["cache", "auth"]

[app]
name = "demo"
version = "1.0.0"
debug = true

[server]
host = "127.0.0.1"
port = 8080
`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <app>
    <name>demo</name>
    <version>1.0.0</version>
    <debug>true</debug>
  </app>
  <server>
    <host>127.0.0.1</host>
    <port>8080</port>
  </server>
  <features>cache</features>
  <features>auth</features>
</root>
`,
  ini: `[app]
name=demo
version=1.0.0
debug=true

[server]
host=127.0.0.1
port=8080

features=cache
features=auth
`,
}
