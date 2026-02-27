export interface AudioFormat {
  label: string
  desc: string

  /**
   * 当前格式允许转出的目标格式
   * 如果存在，则只能转到数组中的格式
   */
  canConvertTo?: string[]

  /**
   * 当前格式允许被哪些格式转入
   * 如果存在，则只能从数组中的格式转入
   */
  canConvertFrom?: string[]
}

export const audioFormats: Record<string, AudioFormat> = {
  // mp3: {
  //   label: 'MP3',
  //   desc: 'MP3（MPEG-1 Audio Layer III）是最流行的有损压缩音频格式，兼容性极强，适合日常音乐播放',
  // },
  wav: {
    label: 'WAV',
    desc: 'WAV 是微软开发的无损音频格式，音质完美无损，但文件体积较大，适合专业录音与编辑',
  },
  // ogg: {
  //   label: 'OGG',
  //   desc: 'OGG Vorbis 是完全免费开放的有损压缩格式，相同码率下音质优于 MP3，广泛用于游戏音效',
  // },
  // flac: {
  //   label: 'FLAC',
  //   desc: 'FLAC（Free Lossless Audio Codec）是最流行的无损压缩格式，音质与 WAV 完全一致但体积更小',
  // },
  // aac: {
  //   label: 'AAC',
  //   desc: 'AAC（Advanced Audio Coding）是 MP3 的继任者，相同码率下音质更优',
  // },
  // m4a: {
  //   label: 'M4A',
  //   desc: 'M4A 是苹果推出的音频容器格式，通常包含 AAC 编码音频',
  // },
  // wma: {
  //   label: 'WMA',
  //   desc: 'WMA（Windows Media Audio）是微软开发的专有音频格式',
  // },
  // opus: {
  //   label: 'Opus',
  //   desc: 'Opus 是新一代开放音频编解码格式，低码率下音质极佳',
  // },

  // ✅ 特殊单向格式
  wem: {
    label: 'WEM',
    desc: 'WEM 是游戏音频格式，常见于 Wwise 引擎',
    canConvertTo: ['wav'],     // 只能转成 wav
    canConvertFrom: [],        // 不允许任何格式转入
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

/**
 * 判断是否允许转换
 */
function canConvert(source: string, target: string): boolean {
  if (source === target) return false

  const src = audioFormats[source]
  const tgt = audioFormats[target]

  if (!src || !tgt) return false

  // source 转出限制
  if (src.canConvertTo) {
    if (!src.canConvertTo.includes(target)) return false
  }

  // target 转入限制
  if (tgt.canConvertFrom) {
    if (!tgt.canConvertFrom.includes(source)) return false
  }

  return true
}

/**
 * 生成所有合法的转换组合
 */
function generatePairs(): [string, string][] {
  const formats = Object.keys(audioFormats)
  const pairs: [string, string][] = []

  for (const source of formats) {
    for (const target of formats) {
      if (canConvert(source, target)) {
        pairs.push([source, target])
      }
    }
  }

  return pairs
}

const pairs = generatePairs()

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
  // 将 customAudioFormats 中的字段浅合并到对应格式，未传入的格式保持原样，
  // 已有字段（如 canConvertTo/canConvertFrom）不会被覆盖，除非显式传入
  const mergedFormats: Record<string, AudioFormat> = Object.fromEntries(
    Object.entries(audioFormats).map(([key, format]) => [
      key,
      { ...format, ...customAudioFormats?.[key] },
    ]),
  )

  return () =>
    pairs.map(([source, target]) => {
      const src = mergedFormats[source]
      const tgt = mergedFormats[target]

      const params: RouteParams = {
        source,
        target,
        sourceLabel: src.label,
        targetLabel: tgt.label,
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