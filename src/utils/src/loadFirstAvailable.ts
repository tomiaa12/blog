/**
 * 从多个候选地址中并发加载资源，优先返回最先成功的结果。
 *
 * 行为说明：
 * - 会并发尝试 `candidates` 中的所有地址，谁先成功就立即返回谁。
 * - 只有当所有候选地址都失败时，才会尝试 `fallback`。
 * - 若无候选且无 fallback，会直接抛错。
 *
 * @param candidates 候选地址列表（通常是多个 CDN）。
 * @param loader 实际加载函数，传入 url，返回加载结果（如 toBlobURL/fetch/json 等）。
 * @param fallback 候选全部失败后的兜底地址（如 public 静态资源路径）。
 *
 * @example
 * const coreURL = await loadFirstAvailable(
 *   [
 *     "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
 *     "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
 *   ],
 *   url => toBlobURL(url, "text/javascript"),
 *   "/ffmpeg/ffmpeg-core.js",
 * )
 *
 * @example
 * const data = await loadFirstAvailable(
 *   ["https://cdn-a.example.com/config.json", "https://cdn-b.example.com/config.json"],
 *   async url => (await fetch(url)).json(),
 *   "/config.json",
 * )
 */
export async function loadFirstAvailable<T>(
  candidates: string[],
  loader: (url: string) => Promise<T>,
  fallback?: string,
): Promise<T> {
  const errors: Error[] = []

  if (candidates.length === 0 && !fallback) {
    throw new Error("未提供可用的资源地址")
  }

  const tryLoad = async (url: string): Promise<T> => {
    try {
      return await loader(url)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      errors.push(new Error(`[${url}] ${err.message}`))
      throw err
    }
  }

  if (candidates.length > 0) {
    try {
      return await new Promise<T>((resolve, reject) => {
        let failedCount = 0

        for (const url of candidates) {
          void tryLoad(url)
            .then(resolve)
            .catch(() => {
              failedCount += 1
              if (failedCount === candidates.length) {
                reject(new Error("所有候选地址加载失败"))
              }
            })
        }
      })
    } catch {
      // 忽略并进入 fallback
    }
  }

  if (fallback) {
    return tryLoad(fallback)
  }

  const detail = errors.map(item => item.message).join(" | ")
  throw new Error(`资源加载失败: ${detail}`)
}
