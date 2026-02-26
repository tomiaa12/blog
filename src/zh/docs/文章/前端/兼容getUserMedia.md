# js 兼容旧的浏览器 getUserMedia 获取摄像头，麦克风 

新版媒体 API 在`navigator.mediaDevices.getUserMedia`下，在这之前也可能在`navigator.getUserMedia`下获取。

新版的浏览器想要获取用户硬件设备（如摄像头、麦克风、屏幕共享），网站必须得是安全协议才行，也就是 https。

检查网站是否处于安全协议中`window.isSecureContext`，本地`localhost`与`127.0.0.1`也会返回 true。

## 兼容方法
```js
// 老的浏览器可能根本没有实现 mediaDevices
!navigator.mediaDevices && (navigator.mediaDevices = {});

// 新版的浏览器存在 mediaDevices.getUserMedia，不能直接重写方法
// 在没有 getUserMedia 方法时重写 getUserMedia
if (!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia = constraints => {

    // 如果有 navigator.getUserMedia 的话，就直接用
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // 更旧的浏览器根本没有这个方法 - 返回reject来触发catch方法
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // navigator.getUserMedia 方法包裹一个Promise
    return new Promise((res, rej) => {
      getUserMedia.call(navigator, constraints, res, rej);
    });
  }
}
```

有`babel`编译的话可以使用链式语法
```js
if (!navigator?.mediaDevices?.getUserMedia) {
  navigator.mediaDevices = {}
  navigator.mediaDevices.getUserMedia = constraints => {

    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // 更旧的浏览器根本没有这个方法 - 返回reject来触发catch方法
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // navigator.getUserMedia 方法包裹一个Promise
    return new Promise((res, rej) => {
      getUserMedia.call(navigator, constraints, res, rej);
    });
  }
}
```

## 使用
```js
navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
  console.log(stream);
}).catch(e => {
  console.log('未获取到设备')
})
```

