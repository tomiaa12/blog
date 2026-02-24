# vue3 中 axios class 封装

```js
import axios from 'axios'
import qs from 'qs'

export const stringify = data => qs.stringify(data); // 序列化
import {ref} from 'vue'
export class Http {
  constructor(baseURL = '/api') {
    this.instance = axios.create({
      baseURL,
      withCredentials: true, // 跨域携带 cookie
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded;', // 序列化格式
        // 'Content-Type': 'application/json', // json 格式
      },
      timeout: 12000,
    })
    this.interceptors()
    
  }

  interceptors(){
    this.instance.interceptors.request.use(config => {
      // 按需求携带请求头
      // if (sessionStorage.getItem('token')) {
      //   config.headers.Authorization = sessionStorage.getItem('token')
      // }

      return config
    }, error => Promise.reject(error) )

    // 响应拦截器
    this.instance.interceptors.response.use( 
      response => response.data,
      error => ( errTip(error), Promise.reject(error) )
    )
  }

  get(url,params = {},config = {}){
    return this.request({
      method: 'get',
      url,
      params,
      ...config
    })
  }

  post(url,data = {},config = {}){
    return this.request({
      method: 'post',
      url,
      data,
      ...config
    })
  }

  json(url,data = {},config = {}){
    return this.request({
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    })
  }

  request(options){
    const loading = ref(true)
    const res = ref(null)
    const errMsg = ref(null)
    this.instance(options).then(response => {
      res.value = response;
    }).catch(e => {
      errMsg.value = e.message || '未知错误'
    }).finally(() => {
      loading.value = false
    })
    return{
      loading,
      res,
      errMsg,
    }
  }

}

function errTip(error,msg = '未知错误'){
  const tip = {
    400:'请求错误',
    401:'未授权，请登录',
    403:'拒绝访问',
    404:`请求地址出错${error?.response?.config?.url}`,
    405:`请求方式不允许`,
    408:'请求超时',
    500:'服务器内部错误',
    501:'服务未实现',
    502:'网关错误',
    503:'服务不可用',
    504:'网关超时',
    505:'HTTP版本不受支持',
  }
  console.log(tip[error?.response?.status] || msg);
}

export default new Http()
```