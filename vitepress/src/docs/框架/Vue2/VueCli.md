# VueCli 脚手架

## 安装创建

- cnpm i @vue/cli -g 安装新版
- cnpm I @vue/cli-init -g 安装旧版
- npm r vue-cli 卸载旧版
- where vue 查看老版本位置
- vue -V 查看安装版本
- vue init webpack 项目名  老版本创建项目
- vue create 项目名  --- 选择vue 2或3的语法

```
Project description A Vue.js project 项目描述
Author tomiaa <1178852449@qq.com>  邮箱
Vue build (Use arrow keys) 
Vue build standalone  独立生产环境
Install vue-router? Yes 安装路由
Use ESLint to lint your code? No 代码规范
Set up unit tests No  是否单元测试
Setup e2e tests with Nightwatch? No  测试
Should we run `npm install` for you after the project has been created? (recommended) npm 下载方式
```
## 全局使用包

需要在 main.js 在 Vue 的原型上添加
```js
import Vue from 'vue'
import $ from 'jquery';
Vue.prototype.bus = new Vue();
Vue.prototype.$ = $;
```