# JavaScript ES6 Promise
## Promise 状态
Promise 状态
- pending（进行中） ----> fulfilled/resolved（成功）
- pending（进行中） ----> rejected（失败）

只要处于 fulfilled/resolved [成功] 和 rejected [失败]，状态就不会再变。

1. 创建 Promise 参数内的函数会立即执行，并返回 Promise 对象
2. 两个参数代表状态，resolve 成功调用，reject 失败调用

```js
const p1 = new Promise((resolve,reject) =>{
  if(1){
    resolve('成功');
  }else{
    reject('失败');
  }
});
```

3. 返回 Pormise 对象调用 then 方法，第一个参数对象 resolve 成功后的回调，第二个参数对应 reject 失败时回调。then 方法也会返回 Promise 对象
```js
p1.then(value => {console.log(value)},err => {console.log(err)});
```
4. then 方法执行成功的回调时，如果发生错误，不会被第二个参数对应 reject 失败时回调捕捉到。
5. then 方法执行成功的回调发生错误是，链式调用 catch 方法可以捕捉前面 then 方法发生的错误

```js
p1.then(val => {代码块有发生错误}).catch(e => {console.log(e);})
```

## Promise.all()与Promise.race()

```js
Promise.all([Promise 对象,Promise 对象...]) // 批量执行
```

1. 传入数组中包含多个 Promise 实例，也可以是别的值，all 包装成一个新的 Promise
2. 全部都成功后，返回每个 Promise 成功的值 ["resolve 成功值 1", "resolve 成功值 1"]
3. 任何一个失败，返回第一个失败的 Promise 结果

```js
Promise.race([Promise 对象,Promise 对象...])
```
不管成功还是失败、哪个结果获得的快，就返回那个结果。
