import { loadFirstAvailable, loadScript } from "@/utils"

const CDN_LIST = [
  "https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js",
  "https://unpkg.com/spark-md5@3.0.2/spark-md5.min.js",
]

type SparkMd5Api = {
  hash: (str: string) => string
  ArrayBuffer: new () => {
    append: (arr: ArrayBuffer) => void
    end: () => string
  }
}

let lib: SparkMd5Api | null = null

export async function ensureSparkMd5() {
  if (lib) return lib
  try {
    lib = await loadFirstAvailable(CDN_LIST, async url => {
      const win = await loadScript(url)
      const SparkMD5 = (win as any).SparkMD5 as SparkMd5Api | undefined
      if (!SparkMD5 || typeof SparkMD5.hash !== "function") throw new Error("SparkMD5")
      return SparkMD5
    })
    return lib
  } catch (err) {
    lib = null
    throw err
  }
}
