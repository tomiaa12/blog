# 融云音视频会议与屏幕共享 Rtc 客户端

## 初始化 Rtc 客户端

```js
import { installer, RCRTCCode } from '@rongcloud/plugin-rtc'
methods: {
  data(){
    return{
      rtcClient: null,// rtc客户端
    }
  },
  start(){
    /* 
      im 客户端操作...
     */
    this.rtcInit(); // 初始化
    if (!this.rtcClient)
      return this.$message.error("rtc初始化失败，请刷新重试！"), false;
  },
  // 初始化 RCRTCClient，初始化过程推荐放在建立连接之前
  rtcInit() {
    this.loadingText = '正在连接房间';
    this.rtcClient = this.im.install(installer);
  },
}
```

## 加入房间

```js
import { installer, RCRTCCode } from '@rongcloud/plugin-rtc'
import {getUserInfoYJZH} from '@/api/index'; // '/user/info.json'
import qs from 'qs' // 引入qs模块，用来序列化post类型的数据

methods: {
  data(){
    remoteTracks: null, // 当前已发布至房间内的远端资源列表
    userIds: [], // 当前已加入房间的远端人员列表
    room: null, // 房间room实例
  },
  start(){
    const code = await this.joinRoom(); // 加入房间
    if (code) return ( this.$message.error("加入房间失败,请刷新后重试,错误代码:" + code),false );
  },
  // 加入普通音视频房间，从 5.0.7 开始增加返回 `tracks` 与 `userIds`
  async joinRoom() {
    // * userIds - 当前已加入房间的远端人员列表
    // * tracks  - 当前已发布至房间内的远端资源列表
    this.loadingText = '正在加入房间';
    const { code, room, userIds, tracks: remoteTracks } = await this.rtcClient.joinRTCRoom(this.form.roomId)

    // 若加入失败，则 room、userIds、tracks 值为 undefined
    if (code !== RCRTCCode.SUCCESS) {
      console.log('加入房间失败,错误代码:', code)
      return Promise.resolve(code)
    }

    this.room = room;

    /* 加入房间后返回房间内已存在的用户，获取用户信息 */
    userIds.forEach(async(userId) => {
      let userInfo = await this.getUserInfo(userId)
      // ...
    })
    this.remoteTracks = remoteTracks;
    return Promise.resolve(null); // 成功

  },
  // 获取用户信息
  async getUserInfo(userId){
    let {data:{data} } = await getUserInfoYJZH({
      headers: headers({
        appSecret: this.appSecret,
        appKey: this.appKey,
      }),
      data: qs.stringify({ userId })
    })
    let {code,...rest} = data;
    if(code === 200) return Promise.resolve(rest);
  },
}
```

## 注册房间监听

- html 模板参考，视频播放需要标签，设置 track.getTrackId 返回的 id 绑定是谁共享的屏幕，音频则不需要，js 创建 audio 播放即可
- 注意：浏览器限制，无法自动播放时开启声音，只有用户经常使用这个网站才能自动播放视频时开启声音。
``` html
<div class="video-content">
  <template v-for="track in localTracks">
    <div
      class="video-grid"
      :key="track.getTrackId()"
      :style="maxWidthAndHeight"
    >
      <video
        v-if="track.isVideoTrack()"
        class="video"
        :id="'rc-video-' + track.getTrackId()"
        :ref="'rc-video-' + track.getTrackId()"
        muted
        autoplay
      ></video>
    </div>
  </template>
  <template v-for="track in localVdeio">
    <div
      class="video-grid"
      :key="track.getTrackId()"
      :style="maxWidthAndHeight"
    >
      <video
        v-if="track.isVideoTrack()"
        class="video"
        :id="'rc-video-' + track.getTrackId()"
        :ref="'rc-video-' + track.getTrackId()"
        muted
        autoplay
      ></video>
    </div>
  </template>
  <template v-for="track in subscriptionTracks">
    <div
      class="video-grid"
      :style="maxWidthAndHeight"
      :key="track.getTrackId()"
    >
      <video
        v-if="track.isVideoTrack()"
        class="video"
        :id="'rc-video-' + track.getTrackId()"
        :ref="'rc-video-' + track.getTrackId()"
        muted
        autoplay
      ></video>
    </div>
  </template>
</div>
<div v-if="this.rtcClient && this.remoteTracks" class="btn-box">
  <div>
    <el-button
      type="primary"
      @click="
        !publishScreenTrack
          ? publishScreenShare()
          : unPublish('publishScreenTrack', publishScreenTrack)
      "
      class="bgc"
    >
      {{ !publishScreenTrack ? "共享屏幕" : "停止共享" }}
    </el-button>

    <el-button
      class="bgc"
      type="primary"
      @click="
        !publishMicrophoneAudioTrack
          ? publishMicrophoneAudio()
          : unPublish(
              'publishMicrophoneAudioTrack',
              publishMicrophoneAudioTrack
            )
      "
    >
      {{ !publishMicrophoneAudioTrack ? "打开麦克风" : "关闭麦克风" }}
    </el-button>

    <el-button
      class="bgc"
      type="primary"
      @click="
        !publishCameraVideoTrack
          ? publishCameraVideo()
          : unPublish('publishCameraVideoTrack', publishCameraVideoTrack)
      "
    >
      {{ !publishCameraVideoTrack ? "打开摄像头" : "关闭摄像头" }}
    </el-button>
  </div>
  <div>
    <el-button
      class="bgc"
      type="primary"
      @click.native="showUserIds = !showUserIds"
      id="userIds"
    >
      人员列表
    </el-button>
    <el-button class="bgc" type="primary" @click.native="exit">
      退出
    </el-button>
  </div>
</div>
```

```js
data(){
  return{
    subscriptionTracks: [], // 订阅的视频流
    localTracks: [], // 本地资源 共享屏幕
    localVdeio: [],  // 本地资源 视频摄像头
    publishScreenTrack: null, // 当前共享屏幕的资源
    publishMicrophoneAudioTrack: null, // 当前已发布麦克风资源
    publishCameraVideoTrack: null, // 当前已发布的摄像头资源
  }
},
methods:{
  start(){
    this.roomWatch(); // 房间监听
  },
  // 注册房间事件监听器，重复注册时，仅最后一次注册有效
  roomWatch() {
    this.loadingText = '加入成功,建立房间监听!';
    this.room.registerRoomEventListener({
      /**
       * 本端被踢出房间时触发
       * @description 被踢出房间可能是由于服务端超出一定时间未能收到 rtcPing 消息，所以认为己方离线。
       * 另一种可能是己方 rtcPing 失败次数超出上限，故而主动断线
       * @param byServer
       * 当值为 false 时，说明本端 rtcPing 超时
       * 当值为 true 时，说明本端收到被踢出房间通知
       */
      onKickOff(byServer) {
        if (byServer) {
          console.log('被踢出房间');
          this.exit();
        } else {
          console.log('房间连接超时');
        }
      },
      /**
       * 接收到房间信令时回调，用户可通过房间实例的 `sendMessage(name, content)` 接口发送信令
       * @param name 信令名 string
       * @param content 信令内容 any
       * @param senderUserId 发送者 Id string
       * @param messageUId 消息唯一标识 string
       */
      onMessageReceive(name, content, senderUserId, messageUId) {
      },
      /**
       * 监听房间属性变更通知
       * @param name string
       * @param content string
       */
      onRoomAttributeChange(name, content) {
        console.log(name, content, '监听房间属性变更通知');
      },
      /**
       * 发布者禁用/启用音频
       * @param audioTrack RCRemoteAudioTrack 类实例
       */
      onAudioMuteChange(audioTrack) {
        console.log(audioTrack, '发布者禁用/启用音频');
      },
      /**
       * 发布者禁用/启用视频
       * @param videoTrack RCRemoteVideoTrack 类实例对象
       */
      onVideoMuteChange(videoTrack) {
        console.log(videoTrack, '发布者禁用/启用视频');
      },
      /**
       * 房间内其他用户新发布资源时触发
       * 如需获取加入房间之前房间内某个用户发布的资源列表，可使用 room.getRemoteTracksByUserId('userId') 获取
       * @param tracks 新发布的音轨与视轨数据列表，包含新发布的 RCRemoteAudioTrack 与 RCRemoteVideoTrack 实例
       */
        onTrackPublish: async (tracks) => {
        // 按业务需求选择需要订阅资源，通过 room.subscribe 接口进行订阅
        console.log(tracks, 'tracks');
        if (!tracks?.length) return;
        const { code } = await this.room.subscribe(tracks)
        if (code !== RCRTCCode.SUCCESS) {
          console.log('资源订阅失败 ->', code)
        }
        console.log('资源订阅', code);
      },
      /**
       * 房间用户取消发布资源
       * @param tracks 被取消发布的音轨与视轨数据列表
       * @description 当资源被取消发布时，SDK 内部会取消对相关资源的订阅，业务层仅需处理 UI 业务
       */
      onTrackUnpublish: ([{_id:id}]) => {
        this.subscriptionTracks.forEach(({_id},index) => {

          console.log(id,_id);
          if(id === _id)
          this.subscriptionTracks.splice(index,1);
        })

        console.log('房间用户取消发布资源', id);
      },
      /**
       * 订阅的音视频流通道已建立, track 已可以进行播放
       * @param track RCRemoteTrack 类实例
       */
      onTrackReady: async (track) => {
        console.log(track, '订阅的音视频流通道已建立,track 已可以进行播放');
        // this.isSubscriptionTrack = true;
        await this.$nextTick();
        console.log(track, '已可以进行播放');
        if (track.isAudioTrack()) {
          // 音轨不需要传递播放控件
          track.play()
        } else {

          // 视轨需要一个 video 标签才可进行播放
          this.subscriptionTracks.push(track);
          await this.$nextTick();

          track.play(this.$refs['rc-video-' + track.getTrackId()][0])
        }
      },
      /**
       * 人员加入
       * @param userIds 加入的人员 id 列表
       */
      onUserJoin: async ([userId]) => {
        console.log('人员加入', userId);
      },
      /**
       * 人员退出
       * @param userIds
       */
      onUserLeave: ([userIds]) => {
        console.log('人员退出', userIds);
        console.log(this.subscriptionTracks);
      }
    })

    /**
     * 添加音量变化通知
     * @param handler 音量变化通知执行事件
     * @param gap 时间间隔，有效值为 300ms-1000ms，默认为 1000ms
     */
    this.room.onAudioLevelChange((audioLevelReportList) => {
      /* audioLevelReportList : { track: RCLocalAudioTrack | RCRemoteAudioTrack, audioLevel: number }[] */
      // console.log('添加音量变化通知', audioLevelReportList);

    }, 1000)
    this.loadingText = '完成';
    this.loading = false;
    console.log(' 监听完成');
  },
}
```

## 播放房间内已存在的音视频

remoteTracks：加入房间时返回的数组

```js

methods:{
  // 订阅 加入房间后，房间内可能已经存在其他参会者发布的音视轨数据
  async subscribe() {
    if (!this.remoteTracks.length) return;
    const { code } = await this.room.subscribe(this.remoteTracks)
  
    if (code !== RCRTCCode.SUCCESS) {
      console.log(`资源订阅失败 -> code: ${code}`)
    }
    console.log('订阅成功');
  },
}
```

## 共享屏幕
```js
// data 数据：publishScreenTrack: null, // 当前共享屏幕的资源
// 发布屏幕共享资源
async publishScreenShare() {
  if (!this.rtcClient || !this.room) {
    console.log('请确保已经初始化完 RTC，并已加入房间');
    return;
  }

  // 获取屏幕资源
  const { code, track } = await this.rtcClient.createScreenVideoTrack();
  if (code !== RCRTCCode.SUCCESS) {
    console.log(`获取资源失败: ${code}`);
    return this.$message.error(`获取资源失败: ${code}`);
  }

  // 发布（推流）
  const pubRes = await this.publishScreen([track]);
  if (pubRes !== RCRTCCode.SUCCESS) {
    console.log(`发布资源失败: ${code}`);
    return;
  }
  console.log('发布', track);
  this.publishScreenTrack = track;
  /* 当停止推流时触发方法 */
  track._msTrack.onended = () => {
    this.unPublish('publishScreenTrack',this.publishScreenTrack)
    console.log('本地推流停止');
  },
  // 发布屏幕共享
  async publishScreen(localTracks) {
    if (!localTracks.length) {
      return;
    }
    const { code } = await this.room.publish(localTracks);

    if (code === RCRTCCode.SUCCESS) {
      /**
       * 播放资源
       */
      this.localTracks = localTracks;
      // this.appendVideoEl(localTracks);

      console.log(localTracks, 'localTracks本地资源');
      await this.$nextTick();

      localTracks.forEach((track) => {
        this.playTrack(track, false);
      });

      return Promise.resolve(code);
    } else {
      console.log(`发布资源失败: ${code}`);
    }
  },
  /**
   * 播放资源
   * @param {window.RCRTC.RCTrack} track 音轨、视轨
   * @param {boolean} playAudio 是否播放音频，(本端发布的音频静音，值为 false)
   * @returns 
   */
  async playTrack(track, playAudio) {
    // 播放视频
    if (track.isVideoTrack()) {
      /* 传入 dom 元素 */
      track.play(this.$refs['rc-video-' + track.getTrackId()][0]);
      return;
    }
    // 播放音频
    if (playAudio) {
      track.play();
    }
  },
},
```

## 发布共享摄像头与麦克风

```js
/**
 * 播放资源
 * @param {window.RCRTC.RCTrack} track 音轨、视轨
 * @param {boolean} playAudio 是否播放音频，(本端发布的音频静音，值为 false)
 * @returns 
 */
async playTrack(track, playAudio) {
  // 播放视频
  if (track.isVideoTrack()) {
    track.play(this.$refs['rc-video-' + track.getTrackId()][0]);
    return;
  }
  // 播放音频
  if (playAudio) {
    track.play();
  }
},
// 发布麦克风
async publishMicrophoneAudio() {
  // 仅当 `code === RCRTCCode.SUCCESS` 时 audioTrack 有值
  // audioTrack 为 RCMicphoneAudioTrack 类型实例
  const { code, track } = await this.rtcClient.createMicrophoneAudioTrack()
  if (code !== RCRTCCode.SUCCESS) return this.$message.error(`获取麦克风失败: ${code}`)

  this.publishAudioOrVideo('publishMicrophoneAudioTrack',track);

},
// 发布摄像头
async publishCameraVideo() {
  // 仅当 `code === RCRTCCode.SUCCESS` 时 videoTrack 有值
  // videoTrack 为 RCCameraVideoTrack 类型实例
  // const { code, track } = await this.rtcClient.createCameraVideoTrack();
  this.rtcClient.createCameraVideoTrack().then(({ code, track }) => {
    if (code !== RCRTCCode.SUCCESS) return this.$message.error(`获取摄像头失败: ${code}`)

    this.publishAudioOrVideo('publishCameraVideoTrack',track);
  })

},
// 发布摄像头或麦克风
async publishAudioOrVideo(proptype,track) {

  const { code } = await this.room.publish([track])
  // 若资源发布失败
  if (code !== RCRTCCode.SUCCESS) return this.$message.error(`资源发布失败: ${code}`);

  this[proptype] = track;
  // 播放视频
  if (track.isVideoTrack()) {
    this.localVdeio = [track];

    await this.$nextTick();
    this.playTrack(track, false);
  }

  // if (code === RCRTCCode.SUCCESS) {
  //   /**
  //    * 播放资源
  //    */
  //   this.localTracks = localTracks;

  //   console.log(localTracks, 'localTracks本地资源');

  //   localTracks.forEach((track) => {
  //     this.playTrack(track, false);
  //   });

  //   return Promise.resolve(code);
  // } else {
  //   console.log(`发布资源失败: ${code}`);
  // }
},
```

## 停止共享资源

```js
// 停止发布本地资源
async unPublish(proptype,track) {
  /* track 为要停止的音视频轨道 */
  const { code } = await this.room.unpublish([track])

  if (code !== RCRTCCode.SUCCESS) {
    console.log('取消发布失败:', code)
  }
  track.destroy();

  /* 以下为销毁本地正在播放的音视频，参考 */
  this[proptype] = null;

  if(proptype === 'publishScreenTrack'){ //屏幕
    this.localTracks = [];
  }
  if(proptype === 'publishCameraVideoTrack'){ // 摄像头
    this.localVdeio = [];
  }
},
```

## 退出房间

unPublish：停止发布本地资源

```js
// 退出房间
async exit(){
  this.loading = true;
  this.loadingText = '正在退出';
  const { code } = await this.rtcClient.leaveRoom(this.form.roomId);
  if (code !== RCRTCCode.SUCCESS) return this.$message.error('退出失败!')

  this.$message.success('操作成功!');

  // this.form.name = ''; // 房间名
  this.form.roomId = ''; // 房间id
  this.subscriptionTracks = []; // 订阅视频流
  if(this.publishScreenTrack) {
    this.loadingText = '正在关闭屏幕共享';
    this.unPublish('publishScreenTrack', this.publishScreenTrack); // 停止屏幕共享
  }
  if(this.publishMicrophoneAudioTrack) {
    this.loadingText = '正在关闭麦克风';
    this.unPublish('publishMicrophoneAudioTrack', this.publishMicrophoneAudioTrack); // 停止音频推流
  }
  if(this.publishCameraVideoTrack) {
    this.loadingText = '正在关闭摄像头';
    this.unPublish('publishCameraVideoTrack', this.publishCameraVideoTrack); // 停止摄像头
  }
  this.loading = false;
  this.showForm = true;
},
```

## 踢人
```js
// 踢出别人
async kick(userId){
  let d = await kickYJZH({
    headers: headers({
      appSecret: this.appSecret,
      appKey: this.appKey,
    }),
    data: {
      roomId: this.form.roomId,
      userId,
    },
  })
},
```