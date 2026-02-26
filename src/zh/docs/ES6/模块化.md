# JavaScript ES6 模块化

1. es6 模块语法无法在浏览器，vscode 直接运行。
2. 需要安装 npm 包：babel 将 es6 语法转换成 es5。browserify 后台代码编译成前端 [npm 包](../服务端/Node.js/npm)

单个暴露

```js
export let/var 属性名=属性值
export function 方法名(){ }
```

批量暴露

```js
let/var 属性名=值
function 方法名(){}
export {属性名，属性名 as 别名，方法名}
```

暴露所有

```js
export default {}
```

使用模块：导入单个对应 export

```js
import {属性名，方法名，属性名 as 别名} from '模块文件名'
```

引入所有：对应 export default

```js
import 名字  from 路径
```
