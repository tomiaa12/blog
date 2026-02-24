# Node.js path 路径

```js
const path = require('path');
path.extname('javascript.min.js');// .js 获取文件名后缀

// 多个路径拼接成完整的绝对路径
path.resolve('a/b','he/','index.js')
// 将多个路径合并为一个
// e:\Web\a\b\he\index.js
path.resolve('a/b','../','index.js');
// ../会返回上一目录
// e:\Web\a\index.js

path.resolve('a/b','/cc','index.js');
// /开头会从根目录开始
// e:\cc\index.js

// 多个路径拼接成绝对路径,根据当前系统使用分隔符 window使用 /分隔 Linux使用\分隔
path.join('a/b','c/d/index.js')
// a\b\c\d\index.js

path.join('a/b','/ad','index.js')
// a\b\ad\index.js
```