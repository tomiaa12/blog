# axios 常用操作

全局配置
```js
axios.defaults.baseURL = 'https://some-domain.com/api/' // 配置全局前缀
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```
## 创建实例
```js
const instance = axios.create({
  // 公有前缀
  // baseURL: 'https://some-domain.com/api/',
  // 超时时间
  timeout: 1000,
  // 请求头
  // headers: {'X-Custom-Header': 'foobar'},

  // 跨域携带 cookie
  // withCredentials: true,
});
```

:::tip 注意
`withCredentials = true`时，后端返回的响应头`Access-Control-Allow-Origin`不能为`*`，需要指定`origin`。
:::

## 请求响应拦截
```js
// 请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  console.log('请求',config);
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 响应拦截器
axios.interceptors.response.use(response => {
  console.log('响应',response);
  // 对响应数据做点什么
  return response;
}, error => {
  // 对响应错误做点什么
  return Promise.reject(error);
});
```

## 并发
```js
function getUserAccount() {
 return axios.get('/user/12345');
}

function getUserPermissions() {
 return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
 .then(axios.spread((acct, perms) => {
 // 两个请求现在都执行完成
}));
```

## axios 封装

[点我查看](/docs/文章/前端/vue3中axios封装.md) 


## axios 防抖

[点我查看](/docs/文章/前端/axios防抖取消多次请求.md) 
