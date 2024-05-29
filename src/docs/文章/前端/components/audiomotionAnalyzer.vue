<template>
  <div>
    <h3>音频</h3>
    <div class="audio-input">
      <audio ref="audio" src="" controls></audio>
      <input type="file" accept="audio/*" @change="audioChange">
      <el-button type="primary" @click="disconnect(audioSource)">断开音频流</el-button>
    </div>
    <h3>视频</h3>
    <div class="video-input">
      <video ref="video" src="" controls></video>
      <input type="file" accept="video/*" @change="videoChange">
      <el-button type="primary" @click="disconnect(videoSource)">断开视频流</el-button>
    </div>

    <h3>麦克风</h3>
    <el-button type="primary" @click="mic">链接麦克风</el-button>
    <el-button type="primary" @click="disconnect(micSource)">断开麦克风</el-button>

    <div ref="container" style="height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted } from 'vue'
import AudioMotionAnalyzer from "audiomotion-analyzer"

const props = defineProps({});
const emits = defineEmits([]);


const container = ref()
let audioMotion, audioSource, videoSource
onMounted(() => {
  // 初始化
  audioMotion = new AudioMotionAnalyzer(
    container.value,
    {
      alphaBars: false,
      ansiBands: false,
      barSpace: 0.25,
      bgAlpha: 0, // 背景透明度，overlay showBgColor 都为 true 时才能生效
      overlay: true,
      showBgColor: true,
      channelLayout: "single",
      colorMode: "bar-level",
      fadePeaks: false,
      fftSize: 8192,
      fillAlpha: 0.25,
      frequencyScale: "log",
      gradient: "prism",
      gravity: 3.8,
      ledBars: false,
      linearAmplitude: true,
      linearBoost: 1.6,
      lineWidth: 1.5,
      loRes: false,
      lumiBars: false,
      maxDecibels: -25,
      maxFPS: 0,
      maxFreq: 16000,
      minDecibels: -85,
      minFreq: 30,
      mirror: 0,
      mode: 2,
      noteLabels: false,
      outlineBars: false,
      peakFadeTime: 750,
      peakHoldTime: 500,
      peakLine: false,
      radial: false,
      radialInvert: false,
      radius: 0.3,
      reflexAlpha: 1,
      reflexBright: 1,
      reflexFit: true,
      reflexRatio: 0.5,
      roundBars: true,
      showFPS: false,
      showPeaks: false,
      showScaleX: false,
      showScaleY: false,
      smoothing: 0.7,
      spinSpeed: 0,
      splitGradient: false,
      trueLeds: false,
      useCanvas: true,
      volume: 1,
      weightingFilter: "D",
    }
  )

  // 链接到频谱分析仪，只需要链接一次
  audioSource = audioMotion.connectInput(audio.value)
  videoSource = audioMotion.connectInput(video.value)

})

// 音频
const audio = ref()
// 创建一个新的音频上下文对象
const audioChange = (e) => {
  const fileBlob = e.target.files[0];
  if (fileBlob) {
    // 播放
    audio.value.src = URL.createObjectURL(fileBlob);
    audio.value.play();
  }
}

// 视频
const video = ref()
const videoChange = (e) => {
  const fileBlob = e.target.files[0];
  if (fileBlob) {

    // 播放
    video.value.src = URL.createObjectURL(fileBlob);
    video.value.play();
  }
}

// 麦克风
let micSource
const mic = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  })

  // 将麦克风流连接到分析器
  micSource = audioMotion.connectInput(
    audioMotion.audioCtx.createMediaStreamSource(stream)
  )

  // 将输出静音，以防止来自扬声器的反馈回路
  audioMotion.volume = 0
}


// 断开并释放资源
const disconnect = (source) => {
  audioMotion.disconnectInput(source, true)

  console.log(audioMotion.connectedSources, '已连接的输入源')
}

</script>
<style lang="scss" scoped>
.audio-input,
.video-input {
  display: flex;
  align-items: center;

  video {
    max-width: 60%;
  }

  input {
    margin-left: 1em;
  }
}
</style>