# Vue filter 过滤器

1. 通过 | 竖线管道符 把前面的数据传入|右边的方法
2. 局部注册 filters :{方法名(val){}}
3. 全局注册 Vue.filter('方法名',(val) = > {})
4. golbal('参数')传入的参数, 方法内golbal(val,参数){} 接收形参第一个参数为 | 前面的值,第二个开始才是传进来的参数

```js
{{1+2 | fn1 | golbal('sss')}}
Vue.filter('golbal',(val,a) => val + a)// 全局注册
let vm = new Vue({
  el:'#box',
  filters:{
​    fn1 : (val) => val.toFixed(2) // 局部注册，可以多个
  }
})
```