import { convertWemToWav } from '@/utils/src/audioConvert/wem2wav'

export interface ConvertParams {
  file: File
  sourceFormat: string
  targetFormat: string
  onProgress?: (progress: number) => void
}

export function convertFile(params: ConvertParams): Promise<Blob> {
  const { file, sourceFormat, targetFormat, onProgress } = params

  if (sourceFormat === 'wem' && targetFormat === 'wav') {
    return convertWemToWav([file], (_f, p) => onProgress?.(p)).then(results => {
      if (!results.length) throw new Error('转换失败')
      return fetch(results[0].url).then(r => r.blob())
    })
  }

  return Promise.reject(new Error(`不支持的转换: ${sourceFormat} → ${targetFormat}`))
}
