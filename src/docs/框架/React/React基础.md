# React 基础库

React 核心库

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
```

React 操作 DOM 库

```html
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

jsx

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

jsx 需要添加属性 type="text/babel" 

```html
<script type="text/babel"></script>
```

// 渲染 DOM 方法 ReactDOM.render(要渲染的元素,要渲染的位置)
// 创建 DOM 方法 React.createElement(标签名,标签属性,标签内容)

```js
ReactDOM.render(
  React.createElement('mark',null,'内容'),
  document.getElementById('app')
)

let p = 'p';
let pAttr = {className: 'p1 p2',title: '22'}
let oP = React.createElement(p,pAttr,'content')
let root = document.getElementById('app')
ReactDOM.render(oP,root)
```

## 脚手架

安装脚手架 

```sh
cnpm i -g create-react-app
```

创建项目  
```sh
create-react-app demo
```
```js
import logo from './logo.svg'; // 引入图片
import './App.css'; // 引入 css
```