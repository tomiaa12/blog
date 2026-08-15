function coerce(raw: string): unknown {
  if (raw === "true") return true
  if (raw === "false") return false
  if (raw === "null") return null
  if (raw === "") return ""
  if (/^-?\d+$/.test(raw)) return Number(raw)
  if (/^-?\d+\.\d+$/.test(raw)) return Number(raw)
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1)
  }
  return raw
}

function quote(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "boolean" || typeof value === "number") return String(value)
  const text = String(value)
  if (/[\s#;='"]/.test(text) || text === "true" || text === "false" || text === "null") {
    return `"${text.replace(/"/g, '\\"')}"`
  }
  return text
}

function writeKey(lines: string[], key: string, value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item && typeof item === "object") {
        lines.push(`${key}=${JSON.stringify(item)}`)
      } else {
        lines.push(`${key}=${quote(item)}`)
      }
    }
    return
  }
  lines.push(`${key}=${quote(value)}`)
}

export function parseIni(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  let section: Record<string, unknown> = result

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith("#") || line.startsWith(";")) continue

    const sec = line.match(/^\[([^\]]+)]$/)
    if (sec) {
      const name = sec[1]!.trim()
      const next: Record<string, unknown> = {}
      result[name] = next
      section = next
      continue
    }

    const eq = line.indexOf("=")
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    if (!key) continue
    const value = coerce(line.slice(eq + 1).trim())
    if (key in section) {
      const prev = section[key]
      section[key] = Array.isArray(prev) ? [...prev, value] : [prev, value]
    } else {
      section[key] = value
    }
  }

  return result
}

export function stringifyIni(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value !== "object") return `value=${quote(value)}\n`

  const obj = value as Record<string, unknown>
  const lines: string[] = []
  const sections: [string, Record<string, unknown>][] = []

  for (const [key, item] of Object.entries(obj)) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      sections.push([key, item as Record<string, unknown>])
    } else {
      writeKey(lines, key, item)
    }
  }

  if (lines.length && sections.length) lines.push("")

  for (const [name, body] of sections) {
    lines.push(`[${name}]`)
    for (const [key, item] of Object.entries(body)) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        for (const [childKey, child] of Object.entries(item as Record<string, unknown>)) {
          writeKey(lines, `${key}.${childKey}`, child)
        }
      } else {
        writeKey(lines, key, item)
      }
    }
    lines.push("")
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`
}
