# JavaScript video 视频 API

## 标签属性

- src：要播放的音频/视频的 URL。
- controls：显示音频/视频播放控件
- loop：音频/视频结束后重新播放 
- muted：音频/视频静音
- width：播放区宽度
- height：播放区高度
- poster：预览图片

## 属性

- audioTracks：返回可用音频轨道的 Audio TrackList 对象
- autoplay：设置/返回是否在加载完成后播放视频/音频
- buffered：返回音频/视频已缓存部分的timeRanges对象
- controller：返回音频/视频当前媒体控制器的MediaController对象
- controls：设置/返回音频/视频是否显示控件
- crossOrigin：设置/返回音频/视频的CORS设置
- curretSrc：返回当前音频/视频的URL
- currentTime：设置/返回音频/视频中当前播放位置（以秒）
- defaultMuted：设置/返回音频/视频默认是否静音
- defaultPlaybackRate：设置/返回音频/视频的默认播放速度
- duration：返回当前音频/视频的长度 s
- ended：返回音频/视频是否播放结束
- error：返回音频/视频发生错误状态的 MediaError 对象
- loop：设置/返回是否应在结束时重新播放
- mediaGroup：设置/返回音频/视频所属的组合
- muted：设置/返回是否静音
- networkState：返回当前音频/视频网络状态
- paused：设置/返回是否暂停
- playbackRate：设置/返回音频/视频播放速度
- palyed：返回音频/视频已播放部分 TimeRanges 对象
- repload：设置/返回是否在页面加载后加载
- readyState：返回音频/视频当前的就绪状态
- seekable：返回音频/视频可寻址部分的 TimeRanges 对象
- seeking：返回用户是否在音频/视频中进行查找
- src：设置/返回当前来源
- startDate：返回当前时间偏移的 date 对象
- textTracks：返回可用文本轨道的 TextTrackList 对象
- videoTracks:返回可用视频轨道的 VideoTrackList 对象
- volume:设置/返回音量

## 方法

- addTextTrack()：向音频/视频添加新的文本轨道
- canPlayType()：检测浏览器是够能播放指定的音频/视频类型
- load()：重新加载音频/视频
- play()：开始播放音频/视频
- pause()：暂停音频/视频

 

## 事件

- abort：当音频/视频的加载已放弃时触发
- canplay：当浏览器可以开始播放音频/视频时触发
- canplaythrough：当浏览器在不因缓冲而停顿的视口下进行播放时触发
- durationchange：音频/视频的时长发生改变时触发
- emptied：目前播放列表为空时触发
- ended：播放列表结束时触发
- error：音频/视频加载期间发生错误时触发
- loadeddata：当音频/视频已加载当前帧时触发
- loadedmetadata：当浏览器已加载音频/视频的元数据时触发
- loadstart：当浏览器开始查找音频/视频时触发
- pause：音频/视频暂停时触发
- play：音频/视频一开始或不在暂停时触发
- playing：音频/视频因缓冲而暂停或停止后已就绪时触发
- progress：当浏览器正在下载音频/视频时触发
- ratechange：音频/视频的播放速度已更改时触发
- seeked：用户开始移动/跳跃到音频/视频新的位置时触发
- seeking：开始移动到/跳跃到音频/视频新的位置时触发
- stalled：当浏览器尝试获取媒体数据，但数据不可用时触发
- suspend：浏览器刻意不获取媒体数据时触发
- timeupdate：当目前播放位置已更改时触发
- volumechange：当音量已更改时触发
- waiting：当视频由于需要缓冲下一帧而停止时触发