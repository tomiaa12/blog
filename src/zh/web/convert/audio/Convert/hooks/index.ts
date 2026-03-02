import { vgmstreamConvert } from '@/utils/src/audioConvert/vgmstreamConvert'
import { loadFirstAvailable } from '@/utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { audioFormats, resolvePipeline } from '../../[source]-[target].paths'

export interface ConvertParams {
  file: File
  sourceFormat: string
  targetFormat: string
  onProgress?: (progress: number) => void
}

const MIME_BY_FORMAT: Record<string, string> = {
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
  flac: 'audio/flac',
  ogg: 'audio/ogg',
}

let _ffmpeg: FFmpeg | null = null
let _ffmpegReady: Promise<FFmpeg> | null = null

const FFMPEG_CORE_JS_CDN_LIST = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
  'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
]

const FFMPEG_CORE_WASM_CDN_LIST = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
  'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
]

async function getFFmpeg(): Promise<FFmpeg> {
  if (_ffmpeg && _ffmpegReady) return _ffmpegReady
  if (_ffmpegReady) return _ffmpegReady

  const ffmpeg = new FFmpeg()
  _ffmpeg = ffmpeg

  _ffmpegReady = (async () => {
    const coreURL = await loadFirstAvailable(
      FFMPEG_CORE_JS_CDN_LIST,
      url => toBlobURL(url, 'text/javascript'),
      '/ffmpeg/ffmpeg-core.js',
    )
    const wasmURL = await loadFirstAvailable(
      FFMPEG_CORE_WASM_CDN_LIST,
      url => toBlobURL(url, 'application/wasm'),
      '/ffmpeg/ffmpeg-core.wasm',
    )
    await ffmpeg.load({ coreURL, wasmURL })
    return ffmpeg
  })().catch(err => {
    _ffmpeg = null
    _ffmpegReady = null
    throw err
  })

  return _ffmpegReady
}

async function ffmpegConvertBlob(
  inputBlob: Blob,
  inputExt: string,
  outputExt: string,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  const inputName = `input.${inputExt}`
  const outputName = `output.${outputExt}`

  const progressHandler = ({ progress }: { progress: number }) => {
    onProgress?.(Math.round(progress * 100))
  }

  ffmpeg.on('progress', progressHandler)
  try {
    await ffmpeg.writeFile(inputName, await fetchFile(inputBlob))
    await ffmpeg.exec(['-i', inputName, outputName])
    const out = await ffmpeg.readFile(outputName)
    if (!(out instanceof Uint8Array)) {
      throw new Error('ffmpeg 输出数据格式异常')
    }
    // 转为新的 Uint8Array，避免 ArrayBufferLike 与 BlobPart 类型不兼容
    const bytes = new Uint8Array(out)
    return new Blob([bytes], { type: MIME_BY_FORMAT[outputExt] ?? 'application/octet-stream' })
  } finally {
    ffmpeg.off('progress', progressHandler)
    await Promise.allSettled([ffmpeg.deleteFile(inputName), ffmpeg.deleteFile(outputName)])
  }
}

export async function convertFile(params: ConvertParams): Promise<Blob> {
  const { file, sourceFormat, targetFormat, onProgress } = params

  const pipeline = resolvePipeline(sourceFormat, targetFormat, audioFormats)
  if (!pipeline) {
    console.log(`不支持的转换: ${sourceFormat} → ${targetFormat}`)
    throw new Error(`不支持的转换: ${sourceFormat} → ${targetFormat}`)
  }

  if (pipeline.type === 'direct-ffmpeg') {
    onProgress?.(0)
    return ffmpegConvertBlob(file, sourceFormat, targetFormat, onProgress)
  }

  const vgmResults = await vgmstreamConvert([file], (_f, p) => onProgress?.(Math.round(p * 0.6)))
  if (!vgmResults.length) throw new Error('vgmstream 转换失败')

  const wavBlob = await fetch(vgmResults[0].url).then(r => r.blob())
  if (targetFormat === 'wav') {
    onProgress?.(100)
    return wavBlob
  }

  return ffmpegConvertBlob(wavBlob, 'wav', targetFormat, p => {
    // vgmstream 阶段占 60%，ffmpeg 阶段占 40%
    onProgress?.(60 + Math.round(p * 0.4))
  })
}
