<template>
  <p>点击按钮就会发出只因声，喜欢的话可以分享给身边的ikun！</p>
  <audio
    ref="audioRef"
    :src="src"
    ontrolslist="nodownload"
    oncontextmenu="return false"
    preload="auto"
  ></audio>

  <el-image
    :src="img"
    fit="fill"
    :lazy="true"
    style="width: 350px; margin: auto; display: block"
  ></el-image>

  <ul>
    <div class="gongneng">
      <span>音效区域</span>

      <el-button
        type="primary"
        @click="restart"
      >
        重播
      </el-button>
      <el-button
        type="primary"
        @click="stop"
      >
        停止
      </el-button>
    </div>
    <li>
      <el-button
        v-for="i of list1"
        bg
        text
        size="large"
        @click="play(i.m)"
      >
        {{ i.text }}
      </el-button>
    </li>
    <div class="gongneng"><span>音乐区域</span></div>
    <li>
      <el-button
        v-for="i of list2"
        bg
        text
        size="large"
        @click="play(i.m)"
      >
        {{ i.text }}
      </el-button>
    </li>
  </ul>

  <ikunDance />
</template>

<script setup lang="ts">
import { ref } from "vue"
import img from "./ikunMusic/ji.png"
import ikunDance from './ikunDance.vue'


const musics = import.meta.glob("./ikunMusic/*.mp3")

const audioRef = ref()
const src = ref("")

const list1 = [
  { m: "j", text: "鸡" },
  { m: "n", text: "你" },
  { m: "t", text: "太" },
  { m: "m", text: "美" },
  { m: "唱", text: "唱" },
  { m: "跳", text: "跳" },
  { m: "rp", text: "rap" },
  { m: "lq", text: "篮球" },
  { m: "哇真的是你", text: "真的是你" },
  { m: "哎呀", text: "哎呀" },
  { m: "哈哈哈", text: "哈哈哈" },
  { m: "ma", text: "ma～" },
  { m: "mck", text: "music" },
  { m: "啊～", text: "啊～" },
  { m: "哇呵呵", text: "哇呵呵" },
  { m: "喜欢", text: "喜欢" },
  { m: "qm", text: "制作人" },
  { m: "djh", text: "大家好" },
  { m: "ws", text: "我是" },
  { m: "坤坤", text: "鲲鲲" },
  { m: "ngm", text: "你干嘛~" },
  { m: "hh", text: "哈哈" },
  { m: "ay", text: "哎哟" },
  { m: "nhf", text: "你好烦~" },
  { m: "jntm", text: "开始吟唱" },
  { m: "ngmhhy", text: "你干嘛哈哈哟" },
  { m: "yhhmgn", text: " 哟哈哈嘛干你" },
]
const list2 = [
  { m: "esj", text: "二手鸡" },
  { m: "rup", text: "rap鸡" },
  { m: "djj", text: "DJ鸡" },
  { m: "xxj", text: "谢谢鸡" },
  { m: "jhj", text: "惊魂鸡" },
  { m: "xjj", text: "仙剑鸡" },
  { m: "xnj", text: "新年鸡" },
  { m: "zdj", text: "战斗鸡" },
  { m: "thj", text: "桃花鸡" },
  { m: "mrj", text: "某人鸡" },
  { m: "jnj", text: "江南鸡" },
  { m: "jjj", text: "尖叫鸡" },
  { m: "bbj", text: "baby鸡" },
  { m: "hxj", text: "欢喜鸡" },
  { m: "yyj", text: "耶耶鸡" },
  { m: "jtm", text: "鸡太美" },
  { m: "大悲鸡", text: "大悲鸡" },
  { m: "果宝鸡", text: "果宝鸡" },
  { m: "狂放鸡", text: "狂放鸡" },
  { m: "起鲲了", text: "起鲲了" },
  { m: "青蛙鸡", text: "青蛙鸡" },
  { m: "三国鸡", text: "三国鸡" },
  { m: "小母鸡", text: "小母鸡" },
  { m: "新闻鸡", text: "新闻鸡" },
  { m: "印度鸡", text: "印度鸡" },
  { m: "各种鸡", text: "各种鸡" },
  { m: "卡点鸡", text: "卡点鸡" },
  { m: "听鸡话", text: "听鸡话" },
  { m: "祝福鸡", text: "祝福鸡" },
  { m: "好运鸡", text: "好运鸡" },
  { m: "春节鸡", text: "春节鸡" },
  { m: "圣诞鸡", text: "圣诞鸡" },
]

const play = async (m: string) => {
  const module = await musics["./ikunMusic/" + m + ".mp3"]()
  audioRef.value.src = (module as any).default
  audioRef.value.play()
}

const restart = () => {
  audioRef.value.currentTime = 0
}

const stop = () => {
  audioRef.value.pause()
}
</script>
<style lang="scss" scoped>
.gongneng {
  display: flex;
  align-items: center;
  margin: 15px 0;
  span {
    margin-right: 24px;
    font-weight: bold;
  }
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: -12px;
}
li .el-button {
  margin-bottom: 10px;
  &:first-child {
    margin-left: 12px;
  }
}
</style>
