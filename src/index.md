---
layout: home
class: home
hero:
  name: web技术学习
  image:
    src: /logo.png
    alt: web技术学习
  text: 
  tagline: 无需踏破铁鞋，在此寻得你想要
  actions:
    - theme: brand
      text: 网址导航
      link: /pages/navigation
    - theme: brand
      text: 软件下载
      link: /pages/software
    - theme: brand
      text: 在线游戏
      link: /pages/game
    - theme: brand
      text: 资源收集
      link: /docs/资源收集/介绍
    - theme: alt
      text: 更新日志
      link: /docs/关于/更新日志
    - theme: alt
      text: 支持我
      link: /docs/关于/支持我
    - theme: alt
      text: 交流群
      link: /docs/关于/交流群
features:
  - icon: ❤
    title: 循序渐进
    details: 纸上得来终觉浅，绝知此事要躬行。
  - icon: ✨
    title: 导航与软件
    details: 游戏的尽头是怀旧，优化的尽头是默认。
  - icon: 🚶‍♂️
    title: 关于我
    details: 是个路人。
---

<script setup>
import GithubChart from './components/GithubChart.vue'
import SitePv from './components/SitePv.vue'
</script>

<GithubChart />

<SitePv />

