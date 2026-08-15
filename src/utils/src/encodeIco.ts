/** 32 位 BMP（含 AND 掩码），用于 ICO 中小于 256 的尺寸；Windows 对小尺寸 PNG 嵌入常只认一张 */
export function canvasToIcoDib(canvas: HTMLCanvasElement): ArrayBuffer {
  const w = canvas.width
  const h = canvas.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return new ArrayBuffer(0)
  const { data } = ctx.getImageData(0, 0, w, h)
  const xorSize = w * h * 4
  const andRow = ((w + 31) >> 5) * 4
  const andSize = andRow * h
  const headerSize = 40
  const buf = new ArrayBuffer(headerSize + xorSize + andSize)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)

  view.setUint32(0, 40, true)
  view.setInt32(4, w, true)
  view.setInt32(8, h * 2, true)
  view.setUint16(12, 1, true)
  view.setUint16(14, 32, true)
  view.setUint32(16, 0, true)
  view.setUint32(20, xorSize + andSize, true)

  let p = headerSize
  for (let y = h - 1; y >= 0; y--) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      u8[p++] = data[i + 2]!
      u8[p++] = data[i + 1]!
      u8[p++] = data[i]!
      u8[p++] = data[i + 3]!
    }
  }
  return buf
}

function canvasToPngBuffer(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error("png"))
        return
      }
      void blob.arrayBuffer().then(resolve, reject)
    }, "image/png")
  })
}

/** 将多张画布打成 ICO：小于 256 用 BMP，256 用 PNG */
export async function encodeIcoFromCanvases(
  items: { size: number; canvas: HTMLCanvasElement }[]
): Promise<Blob> {
  const list: { size: number; bytes: ArrayBuffer }[] = []
  for (const item of items) {
    const bytes =
      item.size >= 256
        ? await canvasToPngBuffer(item.canvas)
        : canvasToIcoDib(item.canvas)
    if (bytes.byteLength) list.push({ size: item.size, bytes })
  }

  const count = list.length
  const header = 6 + 16 * count
  let offset = header
  const entries = list.map(item => {
    const entry = { size: item.size, length: item.bytes.byteLength, offset }
    offset += item.bytes.byteLength
    return entry
  })

  const buf = new ArrayBuffer(offset)
  const view = new DataView(buf)
  const out = new Uint8Array(buf)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, count, true)

  let pos = 6
  for (const e of entries) {
    view.setUint8(pos, e.size >= 256 ? 0 : e.size)
    view.setUint8(pos + 1, e.size >= 256 ? 0 : e.size)
    view.setUint8(pos + 2, 0)
    view.setUint8(pos + 3, 0)
    view.setUint16(pos + 4, 1, true)
    view.setUint16(pos + 6, 32, true)
    view.setUint32(pos + 8, e.length, true)
    view.setUint32(pos + 12, e.offset, true)
    pos += 16
  }

  list.forEach((item, i) => {
    out.set(new Uint8Array(item.bytes), entries[i]!.offset)
  })

  return new Blob([buf], { type: "image/x-icon" })
}

/** @deprecated 使用 encodeIcoFromCanvases */
export function encodeIco(images: { size: number; png: ArrayBuffer }[]): Blob {
  const list = images.filter(i => i.png.byteLength > 0)
  const count = list.length
  const header = 6 + 16 * count
  let offset = header
  const entries = list.map(item => {
    const entry = { size: item.size, bytes: item.png.byteLength, offset }
    offset += item.png.byteLength
    return entry
  })

  const buf = new ArrayBuffer(offset)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, count, true)

  let pos = 6
  for (const e of entries) {
    view.setUint8(pos, e.size >= 256 ? 0 : e.size)
    view.setUint8(pos + 1, e.size >= 256 ? 0 : e.size)
    view.setUint8(pos + 2, 0)
    view.setUint8(pos + 3, 0)
    view.setUint16(pos + 4, 1, true)
    view.setUint16(pos + 6, 32, true)
    view.setUint32(pos + 8, e.bytes, true)
    view.setUint32(pos + 12, e.offset, true)
    pos += 16
  }

  list.forEach((item, i) => {
    bytes.set(new Uint8Array(item.png), entries[i]!.offset)
  })

  return new Blob([buf], { type: "image/x-icon" })
}
