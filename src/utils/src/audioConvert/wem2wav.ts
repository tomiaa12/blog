/**
 * @example 基础用法
 * ```ts
 * import { convertWemToWav } from '@/utils'
 *
 * const results = await convertWemToWav([file1, file2, file3])
 * results.forEach(r => {
 *   console.log(r.filename) // "bgm_001.wav"
 *   console.log(r.url)      // Blob URL，可直接用于 <audio src> 或下载
 * })
 * ```
 *
 * @example 带每个文件的进度回调
 * ```ts
 * import { convertWemToWav } from '@/utils'
 *
 * const results = await convertWemToWav(files, (file, progress) => {
 *   console.log(`${file.name}: ${progress}%`)
 * })
 * ```
 *
 * @example 在 Vue 组件中使用
 * ```ts
 * import { convertWemToWav } from '@/utils'
 *
 * const progressMap = reactive<Record<string, number>>({})
 *
 * const results = await convertWemToWav(files, (file, progress) => {
 *   progressMap[file.name] = progress
 * })
 * ```
 */

/** 单个文件的转换结果 */
export interface WemConvertResult {
  /** 原始 WEM 文件对象 */
  file: File
  /** 转换后 WAV 的 Blob URL，可直接用于 <audio src> 或触发下载 */
  url: string
  /** 输出文件名，如 "bgm_001.wav" */
  filename: string
}

/**
 * 每个文件的进度回调
 * @param file     当前文件对象
 * @param progress 进度 0-100（为估算值，vgmstream 无原生进度事件）
 */
export type WemProgressCallback = (file: File, progress: number) => void

// ─── 内部单例 Worker ──────────────────────────────────────────────────────────

const WORKER_URL = '/wem2wav/cli-worker.js'

let _worker: Worker | null = null
let _readyPromise: Promise<void> | null = null

function getWorker(): { worker: Worker; ready: Promise<void> } {
  if (_worker && _readyPromise) {
    return { worker: _worker, ready: _readyPromise }
  }

  const worker = new Worker(WORKER_URL)

  const ready = new Promise<void>((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.subject === 'load') {
        worker.removeEventListener('message', onMessage)
        if (e.data.error) {
          _worker = null
          _readyPromise = null
          reject(new Error(`Worker 加载失败: ${e.data.error}`))
        } else {
          resolve()
        }
      }
    }
    worker.addEventListener('message', onMessage)
    worker.onerror = (e: ErrorEvent) => {
      _worker = null
      _readyPromise = null
      reject(new Error(`Worker 初始化错误: ${e.message}`))
    }
  })

  _worker = worker
  _readyPromise = ready
  return { worker, ready }
}

function sendToWorker(worker: Worker, subject: string, ...content: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const symbol = `${Date.now()}-${Math.random()}`

    const handler = (e: MessageEvent) => {
      if (e.data?.symbol !== symbol) return
      worker.removeEventListener('message', handler)
      if (e.data.error) {
        reject(Object.assign(new Error(e.data.error.message ?? String(e.data.error)), e.data.error))
      } else {
        resolve(e.data.content)
      }
    }

    worker.addEventListener('message', handler)
    worker.postMessage({ symbol, subject, content })
  })
}

// ─── 公开 API ─────────────────────────────────────────────────────────────────

/**
 * 批量将 WEM 文件转换为 WAV
 *
 * - Worker 和 WASM 在首次调用时懒加载，后续调用直接复用，无重复开销
 * - 文件逐个转换，每个文件有独立的进度回调
 * - 某个文件转换失败不影响其他文件，失败项不计入返回结果
 *
 * @param files      需要转换的 File 对象数组（.wem 文件）
 * @param onProgress 可选的进度回调，参数为 (file, progress: 0-100)
 * @returns          转换成功的结果数组，每项包含 url / filename / file
 *
 * @example
 * ```ts
 * // 基础
 * const results = await convertWemToWav([file1, file2])
 *
 * // 带进度
 * const results = await convertWemToWav(files, (file, progress) => {
 *   console.log(file.name, progress + '%')
 * })
 *
 * // 使用结果
 * results.forEach(({ url, filename }) => {
 *   const a = document.createElement('a')
 *   a.href = url
 *   a.download = filename
 *   a.click()
 * })
 * ```
 */
export async function convertWemToWav(
  files: File[],
  onProgress?: WemProgressCallback,
): Promise<WemConvertResult[]> {
  if (!files.length) return []

  if (typeof window === 'undefined') {
    throw new Error('convertWemToWav 只能在浏览器环境中使用')
  }

  // 首次调用时才创建 Worker，触发 WASM 下载
  const { worker, ready } = getWorker()
  await ready

  const results: WemConvertResult[] = []

  for (const file of files) {
    // 模拟进度（vgmstream 为同步执行，无原生进度事件）
    let progress = 0
    onProgress?.(file, 0)
    const timer = setInterval(() => {
      if (progress < 80) {
        progress = Math.min(80, progress + Math.floor(Math.random() * 12))
        onProgress?.(file, progress)
      }
    }, 200)

    try {
      const result = await sendToWorker(worker, 'convertDir', [file], file.name)

      clearInterval(timer)
      onProgress?.(file, 100)

      if (!result?.url) throw new Error('Worker 返回结果无效')

      results.push({
        file,
        url: result.url,
        filename: file.name.replace(/\.wem$/i, '.wav'),
      })
    } catch (err: any) {
      clearInterval(timer)
      console.error(`[wem2wav] 转换失败: ${file.name}`, err)
    }
  }

  return results
}
