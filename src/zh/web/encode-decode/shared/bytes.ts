export function utf8(text: string) {
  return new TextEncoder().encode(text)
}

export function toHex(buf: ArrayBuffer | Uint8Array) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let out = ""
  for (let i = 0; i < u8.length; i++) out += u8[i]!.toString(16).padStart(2, "0")
  return out
}

export function fromHex(hex: string) {
  const clean = hex.replace(/\s+/g, "")
  if (clean.length % 2) throw new Error("hex")
  const u8 = new Uint8Array(clean.length / 2)
  for (let i = 0; i < u8.length; i++) {
    const n = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16)
    if (Number.isNaN(n)) throw new Error("hex")
    u8[i] = n
  }
  return u8
}

export function toBase64(buf: ArrayBuffer | Uint8Array) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let bin = ""
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]!)
  return btoa(bin)
}

export function fromBase64(text: string) {
  const bin = atob(text.replace(/\s+/g, ""))
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
  return u8
}

export function toBase64Url(buf: ArrayBuffer | Uint8Array) {
  return toBase64(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function fromBase64Url(text: string) {
  const pad = text.length % 4
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + (pad ? "=".repeat(4 - pad) : "")
  return fromBase64(b64)
}

export function concatBytes(...parts: Uint8Array[]) {
  const len = parts.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(len)
  let off = 0
  for (const p of parts) {
    out.set(p, off)
    off += p.length
  }
  return out
}
