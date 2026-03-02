export interface AudioFormat {
  desc: string

  /**
   * 支持哪些解码器解码该格式（输入能力）
   */
  decoders?: Decoder[]

  /**
   * 支持哪些编码器编码该格式（输出能力）
   */
  encoders?: Encoder[]
}

export type Decoder = 'ffmpeg' | 'vgmstream'
export type Encoder = 'ffmpeg'

export type PipelineType = 'direct-ffmpeg' | 'vgmstream+ffmpeg'

export const audioFormats: Record<string, AudioFormat> = {
  wav: {
    desc: 'WAV 是微软开发的无损音频格式，音质完美无损，但文件体积较大，适合专业录音与编辑',
    decoders: ['ffmpeg'],
    encoders: ['ffmpeg'],
  },
  mp3: {
    desc: 'MP3（MPEG-1 Audio Layer III）是最流行的有损压缩音频格式，兼容性极强，适合日常音乐播放',
    decoders: ['ffmpeg'],
    encoders: ['ffmpeg'],
  },
  wem: {
    desc: 'WEM 是游戏音频格式，常见于 Wwise 引擎',
    decoders: ['vgmstream'],
  },
}

export interface RouteParams {
  source: string
  target: string
  sourceLabel: string
  targetLabel: string
  sourceDesc: string
  targetDesc: string
  title: string
  description: string
  keywords: string
}

export interface Pipeline {
  type: PipelineType
}

/**
 * 解析 source -> target 的转换管道
 */
export function resolvePipeline(
  source: string,
  target: string,
  formats: Record<string, AudioFormat> = audioFormats,
): Pipeline | null {
  if (source === target) return null

  const src = formats[source]
  const tgt = formats[target]

  if (!src || !tgt) return null

  // 1) ffmpeg 可直接解码 source 且可编码 target
  if (src.decoders?.includes('ffmpeg') && tgt.encoders?.includes('ffmpeg')) {
    return { type: 'direct-ffmpeg' }
  }

  // 2) source 只能由 vgmstream 解码，后续经 wav 用 ffmpeg 编码目标格式
  if (src.decoders?.includes('vgmstream') && tgt.encoders?.includes('ffmpeg')) {
    return { type: 'vgmstream+ffmpeg' }
  }

  return null
}

/**
 * 生成所有合法的转换组合
 */
function generatePairs(formatsMap: Record<string, AudioFormat>): [string, string][] {
  const formats = Object.keys(formatsMap)
  const pairs: [string, string][] = []

  for (const source of formats) {
    for (const target of formats) {
      if (resolvePipeline(source, target, formatsMap)) {
        pairs.push([source, target])
      }
    }
  }

  return pairs
}

/**
 * 生成 SEO 路由数据
 */

export const generateMeta = (source: string, target: string) => {
  const title = `免费在线批量 ${source} 转 ${target} - 极速转换，无需安装软件`

  const description = `在线将 ${source} 转为 ${target}，免费，无需下载软件，无需上传服务器，支持批量转换，极速处理，高质量音频直接下载，安全又私密。`
  const keywords = `${source}转${target},${source} to ${target},在线${source}转${target},免费音频转换器,批量${source}转${target},无需上传,高速转换,在线批量音频转换,安全私密音频转换`

  return {
    title,
    description,
    keywords,
  }
}
export function generateAudioRoutes(
  customMeta: (source: string, target: string) => { title: string; description: string; keywords: string },
  customAudioFormats?: Record<string, Partial<AudioFormat>>,
) {
  const mergedFormats: Record<string, AudioFormat> = { ...audioFormats }

  // 支持覆盖基础格式，也支持通过 customAudioFormats 新增格式
  if (customAudioFormats) {
    for (const [key, format] of Object.entries(customAudioFormats)) {
      mergedFormats[key] = { ...mergedFormats[key], ...format } as AudioFormat
    }
  }

  return () =>
    generatePairs(mergedFormats).map(([source, target]) => {
      const src = mergedFormats[source]
      const tgt = mergedFormats[target]

      const params: RouteParams = {
        source,
        target,
        sourceLabel: source,
        targetLabel: target,
        sourceDesc: src.desc,
        targetDesc: tgt.desc,
        ...customMeta(source, target),
      }
  
      return { params }
    })
}

export default {
  paths: generateAudioRoutes(generateMeta),
}