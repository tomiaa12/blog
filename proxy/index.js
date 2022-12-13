import http from "http"
import httpProxy from "http-proxy"
const server = http.createServer() // 创建服务器
const proxy = httpProxy.createProxyServer({})

server
  .on("request", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    const origin = req.url.match(/(?<=\/proxy\/)[^/]+/)?.[0]
    if (origin) {
      const url = req.url.replace("/proxy/", "")
      proxy.web(req, res, {
        target: `https://${url}`,
        changeOrigin: true,
      })
    } else {
      res.end()
    }
  })
  .listen(8888)
