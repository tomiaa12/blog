# Node.js FS 文件系统 (File System)

## 方法

```js
fs.existsSync(path);// 检查一个文件是否存在 返回 true/false 不能检查目录

fs.stat(path,(e,stat) => { // 是文件还是目录
  stat.size;// 文件大小
  stat.isFile();// 是否是文件
  stat.isDirectory();// 是否是目录
})

fs.readFileSync(path);// 读取文件  文件不存在会报错
fs.writeFileSync(path,'123');// 写入文件(覆盖) 返回 undefined 文件不存在会自动创建
fs.unlinkSync(path); // 删除文件  返回 undefined  不存在会报错
fs.readdirSync(path[, options]);// 读取目录下的所有文件名 返回数组
fs.truncateSync(path[, len])// 截断文件 把文件设为 3 个字节,后面的内容截断 不存在会报错

fs.mkdirSync(path[, options])// 新建文件夹 已存在会报错
fs.rmdirSync(path[, options])// 删除文件夹 文件夹内有文件会报错 不存在会报错
fs.renameSync(oldPath, newPath)// 重命名 文件/目录名 旧路径至新路径可以实现移动文件
```

监听文件
- filename：监听的文件名
- options：配置
  ​- interval：1000 每隔 1 秒监听一次
- listener 回调函数，当文件发生变化时，回调函数会执行，会有两个参数
  ​- curr 当前文件的状态
  - prev 修改前文件的状态
  ​- 这两个对象都是 stats 对象
```js
fs.watchFile(filename[, options], listener)
fs.watchFile('hello.txt',{interval : 1000},function(curr,prev){
  console.log('修改前文件大小' + prev.size);
  console.log('修改后文件大小' + curr.size);
})
```

## 流式文件读取

```js
let rs = fs.createReadStream(path);// 创建可读流
let ws = fs.createWriteStream(path);// 创建可写流
rs.pipe(ws);// 可读流传输到可写流
rs.on('open',() => {});// 可读流打开
rs.once('close',() => {}); // 可读流关闭 可读流关闭后 调用 rs.end() 
ws.on('open',() => {});// 可写流打开
ws.once('close', () => {});// 可写流关闭
rs.on('data',function(data){
  console.log(data.length);// 查看每次读取到的字节
  ws.write(data);// 写入读取到的 data
})
```

## flag操作符

- r：读取文件，文件不存在则出现异常
- r+：读写又件，又件不存在则出现异常
- rs：在同步模式下打开文件用于读取
- rs+：在同步模式下打开文件用于读写
- w：打开文件用于写操作如果不存在则创建，如果存在则酸断
- wx：打开文件用于写操作如果存在则打开失败
- w+：打开文件用于读写如果不存在则创如果存在则载断
- wx+：打开文件用于读写如果存在则打开失败
- a：打开丈件用于遍加如果不存在则创建
- ax：打开文件用于追加如果路径存在则失败
- a+：打开文件进行读取和追加如果不存在则创建该文件
- ax+：打开文件进行读取和追加如果路径存在则失败
