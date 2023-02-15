# nuxt3 配置代理服务器

## 依赖

`npm i h3`

## 代理配置

```ts
// server\middleware\apiProxy.ts
import { defineMiddleware, useBody, useCookies, useMethod, useQuery } from "h3";

const API_BASE = "/api"; // 拦截客户端 api
const BACKEND_URL = "https://v1.hitokoto.cn"; // 指向了后端服务地址

// 拦截api操作，转发后端接口
export default defineMiddleware(async (e) => {
  if (e.req.url.startsWith(API_BASE)) {
    // const url = BACKEND_URL + e.req.url;
    const url = BACKEND_URL;
    const method = useMethod(e);
    const query = useQuery(e);
    const headers = e.req.headers as any;
    const cookies = useCookies(e);
    const token = cookies["token"];
    if (!token || !token.length) {
      delete headers["token"];
    }

    headers["token"] = cookies["token"];
    let body = null;

    if ("GET" !== method.toUpperCase()) {
      body = await useBody(e);
    }

    return $fetch(url, {
      method,
      params: query,
      // headers,
      // body,
    });
  }
});
```

`API_BASE`为拦截客户端的接口请求。判断为`API_BASE`开头在 nuxt 服务器拦截代理。

## 使用

pages 页面调用 localhost 即可，以`API_BASE`开头
```vue
<script setup>
const { pending, data, error } = useFetch("/api/getUser");
</script>
```
