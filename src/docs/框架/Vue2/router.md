# Vue router 路由
```sh
npm install vue-router -S
```
```js
router/index.js
// 引入依赖
import Vue from 'vue'
import Router from 'vue-router'
// 导出实例
export default new Router({
 routes: [
  {
   path: '/',
   name: 'HelloWorld/',
   component: HelloWorld
  }
 ]}
)
```

main.js
```js
import App from './App'
import router from './router' // 引入 router
new Vue({
 el: '#app',
 router, // 添加
 components: { App },
 template: '<App/>'
})

```
App.js

添加 router 视口
```vue
<router-view />
```

## 路由原理

路由原理：

1、hash路由 ==> location.hash 切换

  window.onhashchange 监听路径的切换

2、history路由==> history.pushState 切换

  window.onpopstate 监听路径的切换

## 路由表
```js

Vue.use(Router)
new Router({
 mode : 'history', // history模式
 base : 'vue', // 路由前缀  访问时地址自动添加base
 routes: [
  {
   path: '/',
   name: 'HelloWorld', // 路由命名
   components:{ // 视图命名
​     default : HelloWorld,
​     a : topbar,
​     b : shopcar
   },
   meta : { // 元信息
​    title :'HelloWorld'
   },
   alias : '/biemin', // 别名 访问/biemin会跳转到 path路径
   // 嵌套路由
​    children: [{
​    path: 'bar',
​    component: Bar,
​    meta: { requiresAuth: true }
​    }]
  }]
})
```
视图命名
```vue
<router-view /> 没有name默认default
<router-view name="a"></router-view>
<router-view name="b"></router-view>
components:{ // 视图命名
  default : HelloWorld,
  a : topbar,
  b : shopcar
}
```
## 重定向
```js
// 第一种处理404
{
 path : '',
 component : notFound
},

// 第二种404处理 重定向
{
 path : '',
 redirect : '/notFound'
},

// 上面没有匹配到 进入 再进入notFound
{
 path:'/notFound',
 component : notFound
}
```
## 声明式导航

1、默认渲染为a标签，tag设置渲染标签类型

2、to属性路由地址,可以是字符串,变量,对象{path:'地址'},{name:'命名路由'}(需要与router中name一致)

3、匹配的标签calss默认增加 router-link-exact-active完全匹配 与 router-link-active 局部匹配 [ / 也会匹配 ]

4、to='/' 会在其他路由中匹配,所以也会加上 router-link-active 

5、active-class="类名" 属性 自定义类名

6、replace 替换历史记录，点击后没有历史记录


```html
<router-link to="/" tag="span" replace>Go to home</router-link>
<router-link to="/topbar" active-class="activeBar">Go to topbar</router-link>
<router-link to="/shop" active-class="activeBar">Go to shopcar</router-link>
<router-link :to="{path : '/shop'}" >Go to shopcar</router-link>

<!-- 路由匹配到的组件将渲染在这里 -->
<router-view />
```

query 传参会显示在地址栏，刷新不会丢失。

params 传参需要用 name，且刷新会丢失。params 传参也可以使用动态路由显示在地址栏，如在 Router 表中定义 path: '/home/:id'

命名路由：
```js
<router-link :to="{name : 's'}" >Go to shopcar</router-link>
new Router({
  routes: [{
    path: '/shop',
    name: 's',
    component: s
  }]
})
```

## 编程式导航

replace 方法与 push 一样，但不会留下历史记录
```js
router.push('home')// 字符串
router.push({ path: 'home' })// 对象
router.push({ name: 'user', params: { userId: '123' }})// 命名的路由
router.push({ path: 'register', query: { plan: 'private' }})// 带查询参数，变成 /register?plan=private
router.go(n) // 历史记录不够用则失败
router.go(1)// 在浏览器记录中前进一步，等同于 history.forward()
router.go(-1)// 后退一步记录，等同于 history.back()
router.go(3)// 前进 3 步记录
router.go(n)// 执行浏览器的前进动作,n代表前进的步数，负数代表后退
router.back()// 执行浏览器的后退动作
router.forward()
```
### 重复导航当前路径报错问题

在 Router 暴露之前重写 push 方法
```js
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
```
## 动态路由

1、/detail/:变量名  设计路由

2、新页面  $route.params 接参 只有动态路由才有 params

3、$route.query 是 ? 后面的参数,每个页面都可以有 不需要改动路由表

```vue
<router-link to="/detail/cansu "></router-link>
```
路由设计
```js
{
  path : '/detail/:name',
  component : detail
}
```
## 解决首屏加载慢的问题
```js
import shopcar from '@/components/shopcar'
import notFound from '@/components/notFound' 
// 改为
const HelloWorld = () => import('@/components/HelloWorld')
const topbar = () => import('@/components/topbar')
```
## 路由守卫

to -- 要跳转到新的路由 router 对象

from -- 跳转之前的路由 router 对象

next -- 执行后续的中间件

 next(false) 中间当前的导航，并跳转到 from 对应的地址

 next('/地址') / next({path:'/地址'}) 跳转到指定的路径

全局守卫 -- 写在 router 全局
```js
router.beforeEach((to,from,next) => {}) // 进入之前
router.afterEach((to,from) => {}) // 离开之前
```

路由守卫 -- 写在路由表
```js
beforeEnter: (to, from, next) => {} 
```


组件守卫 -- 写在组件内
```js
beforeRouteEnter(to, from, next) {
 // 该组件对应的路由被确认之前调用
 // 不能使用 this，实例还未被创建
}
beforeRouteUpdata(to, from, next) {
 // 路由被改变,组件被复用时，可以访问 this
}
beforeRouteLeave (to, from, next) {
 // 离开该组件对应的路由 可以调用 this
}
```
## 嵌套路由
```js
{
 path: '/topbar',
 component: topbar,
 meta : {title :'topbar'},
 redirect : '/topbar/child1', // 打开 topbar 即重定向到 child1
 children : [ // path 开头不带 / 为从上一层 /topbar 链接的地址  ---> /topbar/child1。带/需要路径补充完整
  {path : 'child1',component:child1},
  {path : 'child2',component:child2},
  {path : 'child3',component:child3},
 ]
}
```