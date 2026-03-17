import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const KEEP_VERSIONS = 10
const file = resolve('src/zh/docs/关于/更新日志.md')
const content = readFileSync(file, 'utf-8')
const lines = content.split('\n')

// 找出每个版本标题的行索引（# 或 ## 开头后跟 [版本号]）
const versionLineIndexes = []
for (let i = 0; i < lines.length; i++) {
  if (/^#{1,2} \[/.test(lines[i])) {
    versionLineIndexes.push(i)
  }
}

if (versionLineIndexes.length <= KEEP_VERSIONS) {
  process.exit(0)
}

// 保留前 KEEP_VERSIONS 个版本，截断其余内容
const cutLine = versionLineIndexes[KEEP_VERSIONS]
const trimmed = lines.slice(0, cutLine).join('\n').trimEnd() + '\n'
writeFileSync(file, trimmed, 'utf-8')
console.log(`已截断：保留最近 ${KEEP_VERSIONS} 个版本（原 ${versionLineIndexes.length} 个）`)
