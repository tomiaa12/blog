<template>
  <p>点击按钮就会发出只因声，喜欢的话可以分享给身边的ikun！</p>
  <audio
    ref="audioRef"
    :src="src"
    ontrolslist="nodownload"
    oncontextmenu="return false"
    preload="auto"
    @canplay="canplay"
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

      <el-slider
        v-model="volume"
        :step="1"
        label="音量"
        @change="volumeChange"
      />
    </div>
    <li>
      <el-button
        v-for="i of list1"
        bg
        text
        size="large"
        :loading="curPlay === i.m && loading"
        :type="curPlay === i.m ? 'primary' : ''"
        @click="play(i.m)"
      >
        <waveLeft v-if="curPlay === i.m" />
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
        :loading="curPlay === i.m && loading"
        @click="play(i.m)"
        :type="curPlay === i.m ? 'primary' : ''"
      >
        <waveLeft v-if="curPlay === i.m" />
        {{ i.text }}
      </el-button>
    </li>
    <div class="gongneng"><span>视频区域</span></div>
    <li>
      <el-button
        v-for="i of list3"
        bg
        text
        size="large"
        :loading="iframeSrc === i.url && loading"
        @click="playVideo(i.url)"
        :type="iframeSrc === i.url ? 'primary' : ''"
      >
        <waveLeft v-if="iframeSrc === i.url" />
        {{ i.name }}
      </el-button>
    </li>
  </ul>

  <iframe
    v-if="iframeSrc"
    :src="'//player.bilibili.com/player.html?' + iframeSrc"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    allowfullscreen="true"
  >
  </iframe>

  <ikunDance :volume="volume" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import img from "./ikunMusic/ji.png"
import ikunDance from "./ikunDance.vue"
import waveLeft from "@/assets/svg/waveLeft.svg"

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

const list3 = [
  {
    name: "幻昼DJ",
    url: "aid=689055884&bvid=BV1Sm4y1A7G6&cid=863014700&p=1",
  },
  {
    name: "科目鸡",
    url: "aid=321465073&bvid=BV1Yw411Y7CK&cid=1280938071&p=1",
  },
  {
    name: "坐杀博徒",
    url: "aid=833342106&bvid=BV1rg4y1973A&cid=1329256263&p=1",
  },
  {
    name: "鸡克逊",
    url: "aid=470813223&bvid=BV1oT411E76C&cid=769507949&p=1",
  },
  {
    name: "鸡 元 甲",
    url: "aid=216071808&bvid=BV1ja411M7PA&cid=777251343&p=1",
  },
  {
    name: "奇只因再现",
    url: "aid=519370246&bvid=BV1bg41147ao&cid=940527979&p=1",
  },
  {
    name: "少萝の小曲",
    url: "aid=451317326&bvid=BV1yj41177hH&cid=1343762623&p=1",
  },
  {
    name: "电鸡之王",
    url: "aid=770817891&bvid=BV1tr4y1E7dF&cid=770743081&p=1",
  },
  {
    name: "超级马里坤",
    url: "aid=58437416&bvid=BV1P4411c7Bf&cid=102144804&p=1",
  },
  {
    name: "江南鸡太美",
    url: "aid=339556400&bvid=BV16R4y1G7G6&cid=544657773&p=1",
  },
  {
    name: "仙剑鸡侠传",
    url: "aid=86208216&bvid=BV1k7411x7gA&cid=147347434&p=1",
  },
  {
    name: "鸡大侠",
    url: "aid=415867007&bvid=BV19V411b7u4&cid=270163008&p=1",
  },
  {
    name: "西游鸡",
    url: "aid=282485055&bvid=BV1mc411y78E&cid=1372074436&p=1",
  },
  {
    name: "天 鸡 预 报",
    url: "aid=525380383&bvid=BV1zM411x7pM&cid=1037429011&p=1",
  },
  {
    name: "坤 坤 演 唱 会",
    url: "aid=310559190&bvid=BV1HN411c7nx&cid=1041717857&p=1",
  },
  {
    name: "坤夸",
    url: "aid=783764244&bvid=BV1o24y1K768&cid=1134940286&p=1",
  },
  {
    name: "挪威的坤坤",
    url: "aid=403600781&bvid=BV1uV411K75z&cid=1200301342&p=1",
  },
  {
    name: "本草鸡目",
    url: "aid=983574668&bvid=BV13t4y157KU&cid=775766085&p=1",
  },
  {
    name: "鸡真可爱",
    url: "aid=571993812&bvid=BV1Zz4y1q7Ae&cid=1153511642&p=1",
  },
]

const curPlay = ref("")
const iframeSrc = ref("")
const loading = ref(false)

const play = async (m: string) => {
  iframeSrc.value = ''
  curPlay.value = m
  loading.value = true
  const module = await musics["./ikunMusic/" + m + ".mp3"]()
  audioRef.value.src = (module as any).default
  audioRef.value.play()
}

const playVideo = (url:string) => {
  curPlay.value = ''
  audioRef.value.src = ''
  iframeSrc.value = url
}

const canplay = () => {
  loading.value = false
}

const restart = () => {
  audioRef.value.currentTime = 0
}

const stop = () => {
  audioRef.value.pause()
}

const volume = ref(50)

onMounted(() => {
  volume.value = audioRef.value.volume * 100
})

const volumeChange = () => {
  audioRef.value.volume = volume.value / 100
}
</script>
<style lang="scss" scoped>
.gongneng {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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

.el-slider {
  max-width: 300px;
  margin-left: 14px;
}

.el-button svg {
  margin-right: 0.2em;
}

iframe {
  height: 500px;
}
</style>
