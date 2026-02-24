# socket.io 利用 websocket 实施音视频（麦克风，摄像头）推流发送至后台

## 前提条件

- 高版本 chrome 获取麦克风，摄像头，屏幕等硬件需要 https 协议（localhost 与 127.0.0.1 不需要）。
- 旧版浏览器没有提供获取音视频的 api，早期提供的 api 在`navigator.getUserMedia`下，最新的则在`navigator.mediaDevices.getUserMedia`下。展开兼容 getUserMedia [点我](./兼容getUserMedia.md)
- 需要 websocket 链接地址与推流地址

## 安装依赖

```sh
npm i socket.io-client
```

## 获取麦克风/摄像头

```js
if(!isSecureContext) console.log('未处于安全上下文，无法获取。')
navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
  this.stream = stream;
}
```

## socket.io 初始化，连接 websocket

```js
import { io } from "socket.io-client";
socket = io('websocket地址');
socket.on("open", data => {
  if (data.status) {
    socket.emit("setRtmpUrl", '推流地址'); // setRtmpUrl 为后台相同监听名称
    startPush(); // 开始推流
  }
});
```

## 推流

```js
// 获取视频轨道
const videoStream = new MediaStream();
this.stream.getVideoTracks().forEach(track => {
  videoStream.addTrack(track);
})

// 获取音频轨道
const audioStream = new MediaStream();
this.stream.getAudioTracks().forEach(track => {
  audioStream.addTrack(track);
});

// 合并轨道数据
const outputStream = new MediaStream();
[audioStream, videoStream].forEach(s => {
  s.getTracks().forEach(t => {
    outputStream.addTrack(t)
  })
})

const mediaRecorderRef = new MediaRecorder(outputStream, { // 创建媒体记录
  mimeType: "video/webm",
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 300000,
})

mediaRecorderRef.addEventListener("dataavailable", (e) => { // 推流
  socket.emit("pushMediaStream", e.data);
})

mediaRecorderRef.addEventListener("stop", () => { // 停止推流
  socket.close();
  [audioStream, videoStream].forEach(s => {
    s.getTracks().forEach(t => {
      t.stop()
    })
  })
})
mediaRecorderRef.start(500);
```