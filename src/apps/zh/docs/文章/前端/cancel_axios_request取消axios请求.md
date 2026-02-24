# cancel_axios_request 取消 axios 重复请求，路由跳转取消当前请求

## 安装

依赖`npm i axios`

```sh
npm i cancel_axios_request
```

## axios 封装中使用

```ts
import * as cancelRequest from "cancel_axios_request";

// 请求拦截器
axios.interceptors.request.use(
  (config: any) => {
    cancelRequest.remove(config); // 取消上一次当前路径的请求
    cancelRequest.add(config); // 添加这次路径的请求
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    cancelRequest.remove(response.config); // 成功后再取消一次
    return response;
  },
  (error) => {
    // cancelRequest 取消请求后会抛出 catch 错误
    // axios.isCancel(error) 判断是否为取消的请求
    return Promise.reject(error);
  }
);
```

## vue-router

```ts
import { removeAll } from 'cancel_axios_request'

// 路由离开页面时
router.beforeEach((to, from, next) => {
  removeAll() // 取消当前页面正在进行的请求
  next();
});
```
