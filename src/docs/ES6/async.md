# JavaScript ES6 async 函数

1. async 函数返回 Promise 对象，用同步流程来表达异步操作
2. 虽然返回的是 Promise 对象，但不能在 async 函数中调用 resolve，reject 函数
3. async 可以单独使用，await 只能在 async 函数中使用
4. 调用 async 函数会立即执行，遇到 await 关键字会暂停执行，await 后的指向完成后，async 函数接着执行。
5. 如果 await 后的异步需要时间，await 下一行会接着执行，导致 await 的结果比下一行代码后得到
6. 解决异步需要时间的问题，await 等待的是 Promise 的结果。所以 await 后面配合 Promise 执行异步函数，但 await 不能处理 Promise 失败后的结果
7. 解决失败结果方法一：await prm().catch(e => {}); 阅读不方便
8. 解决方法二 ： 在 prm() 结果中不管成功还是失败,都调用 resolve 方法,成功传[null,数据]，失败传 [err]; await 执行后 [e,d]=await prm(); 结构判断 e 是否出错

```js
async function fn(){
  let d = await 异步函数;
}

function ti(){
  setTimeout(() => {
    console.log('异步结果');
  },2000)
}

async function fn(){
  await ti();// 里面异步函数 2 秒后执行
  console.log('这里会比上面await先输出');
}

async function fn(){
  var [e,data] = await prm();
  if(e) return; // 发生了错误
  console.log(data,'promise执行完后才执行这行代码');
}

function prm(){
  return new Promise(resolve => {
    if('成功'){
      resolve([null,data]);
    }else{
      resolve(['失败了'])
    }
  })
}
```