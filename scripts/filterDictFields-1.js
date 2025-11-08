import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputFile = resolveFromArgs(
  2,
  path.resolve(__dirname, "../src/public/dicts/merged-words-basic.json")
)
const outputFile = resolveFromArgs(
  3,
  path.resolve(path.dirname(inputFile), "merged-words-basic-1.json")
)

function resolveFromArgs(index, fallback) {
  const userValue = process.argv[index]
  return userValue ? path.resolve(process.cwd(), userValue) : fallback
}

function pickFields(entry) {
  if (!entry || typeof entry !== "object") return null

  const result = {}
  const fields = ["word"]

  for (const field of fields) {
    if (
      Object.prototype.hasOwnProperty.call(entry, field) &&
      entry[field] != null
    ) {
      result[field] = entry[field]
    }
  }

  return Object.keys(result).length ? result : null
}

async function main() {
  console.time("总耗时")
  const raw = await fs.readFile(inputFile, "utf8")
  const data = JSON.parse(raw)

  if (!Array.isArray(data)) {
    throw new TypeError("输入 JSON 顶层应为数组")
  }

  const filtered = data
    .map(pickFields)
    .filter(item => item && typeof item.word === "string" && item.word.trim()).map(i => i.word)

  await fs.writeFile(outputFile, JSON.stringify(filtered, null, 2), "utf8")

  console.log(`源文件: ${inputFile}`)
  console.log(`输出文件: ${outputFile}`)
  console.log(`记录总数: ${filtered.length}`)
  console.timeEnd("总耗时")
}

main().catch(error => {
  console.error("执行失败:")
  console.error(error)
  process.exit(1)
})
