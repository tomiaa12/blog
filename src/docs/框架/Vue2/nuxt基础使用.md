# nuxt 基础使用

安装

```sh
npx create-nuxt-app <项目名>
```

## 目录结构

└─my-nuxt-demo

├─.nuxt // Nuxt 自动生成，临时的用于编辑的文件，build

├─assets // 用于组织未编译的静态资源如 LESS、SASS 或 JavaScript,对于不需要通过 Webpack 处理的静态资源文件，可以放置在 static 目录中

├─components // 用于自己编写的 Vue 组件，比如日历组件、分页组件

├─layouts // 布局目录，用于组织应用的布局组件，不可更改 ⭐

├─middleware // 用于存放中间件

├─node_modules

├─pages // 用于组织应用的路由及视图,Nuxt.js 根据该目录结构自动生成对应的路由配置，文件名不可更改 ⭐

├─plugins // 用于组织那些需要在 根 vue.js 应用 实例化之前需要运行的 Javascript 插件。

├─static // 用于存放应用的静态文件，此类文件不会被 Nuxt.js 调用 Webpack 进行构建编译处理。 服务器启动的时候，该目录下的文件会映射至应用的根路径 / 下。文件夹名不可更改。⭐

└─store // 用于组织应用的 Vuex 状态管理。文件夹名不可更改。⭐

├─.editorconfig // 开发工具格式配置

├─.eslintrc.js // ESLint 的配置文件，用于检查代码格式

├─.gitignore // 配置 git 忽略文件

├─nuxt.config.js // 用于组织 Nuxt.js 应用的个性化配置，以便覆盖默认配置。文件名不可更改。⭐

├─package-lock.json // npm 自动生成，用于帮助 package 的统一设置的，yarn 也有相同的操作

├─package.json // npm 包管理配置文件

├─README\.md

## 页面及路由

└─pages

├─index.vue

└─user

├─index.vue

├─one.vue

nuxt 会自动生成路由, 访问/是 pages 下的 index.vue 访问/user 是 user 下的 index.vue 访问/user/one 也是

页面跳转

不要写 a 链接,因为是重新获取一个新的页面,而不是 SPA

```vue
<nuxt-link to="/users"></nuxt-link>
声明导航 this.$router.push('/users') 编程导航
```

动态路由

需要创建对应的以下划线作为前缀的 Vue 文件 或 目录。

验证动态路由参数, 返回 true 表示通过，false 会跳转到 404 页面

```js

export default {
  validate(data) {
​    cosole.log(data)
​    return true
  }
}
```

## 异步请求

```js
export default {
  async asyncData({ params, $http }) {
    const post = await $http.$get(`https://api.nuxtjs.dev/posts/${params.id}`)
    return { post }
  },
}
```

asyncData 在服务端发送请求不存在跨域

因为 created 会触发两次，mounted 只会在浏览器触发一次

## 自定义路由

nuxt.config.js

```js
router: {
  extendRoutes(routes) {
​    routes.push({
​      path: '/',
​      redirect: '/center'
​    })
  }
}
```
