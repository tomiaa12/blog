import fs from "fs"
import { dirname, resolve } from "node:path"
import https from "https"
import { fileURLToPath } from "node:url"

const host = "kuangyx.cn"
const key = "b6f0e4c3d2"
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sitemapPath = resolve(rootDir, "kuangyx", "sitemap.xml")

const sitemap = fs.readFileSync(sitemapPath, "utf8")

const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(i => i[1])

console.log("检测到URL数量:", urls.length)

const data = JSON.stringify({
  host,
  key,
  urlList: urls
})

const req = https.request(
  "https://api.indexnow.org/indexnow",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  },
  res => {
    console.log("IndexNow 状态:", res.statusCode)
  }
)

req.write(data)
req.end()