# JavaScript audio 音频 API

## 标签相关属性

- src：要播放的音频/视频的 URL
- controls：显示音频/视频播放控件
- loop：音频/视频结束后重新播放 
- muted：音频/视频静音

## 只读属性

- duration：文件的播放时长，单位 s，无法获取则 NaN，当触发 canplay 事件后可以获取
- paused：是否暂停，返回 true/false
- ended：是否播放完毕 true/false
- error：发现错误后返回错误代码
- currentSrc：返回字符串形式正在播放或已加载文件，对应浏览器 source 元素中选择的文件
- buffered：获取当前缓冲区大小，返回 TimeRanges 对象

## 可控制属性

- src：指定音频文件位置
- autoplay：是否自动播放
- preload：是否预加载
- loop：是否循环播放
- controls：显示/隐藏用户控制界面
- muted：设置是否静音
- volume：当前音量值，0-1 之间
- currentTime：返回/设置当前播放的时间，单位 s

## 方法

- load()：加载视频、音频软件
- play()：播放
- pause()：暂停
- canPlayType(obj)：测试播放后指定的 Mime 类型文件

## 事件

- loadstart：客户端开始请求数据
- progress：正在播放的时候不停触发，暂停不会触发，触发事件间隔较大
- play：play() 和 autoplay 时触发，类似 onplaying
- pause：pause() 方法时触发
- ended：结束播放时触发
- timeupdate：播放时间发生改变时触发，暂停不触发，触发事件间隔较小
- canplaythrough：歌曲载入完成
- canplay：缓存至可播放状态，类似事件 onloadedmetadata
- onloadedmetadata：当元数据（如分辨率和时长）被加载时触发