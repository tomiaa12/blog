---
layout: home
class: home
hero:
  name: KYX Box
  image:
    src: /logo.webp
    alt: KYX Box
  text:
  tagline: 无需踏破铁鞋，在此寻得你想要
  actions:
    # - theme: brand
    #   text: 网址导航
    #   link: /pages/navigation
    # - theme: brand
    #   text: 软件下载
    #   link: /pages/software
    # - theme: brand
    #   text: 在线游戏
    #   link: /pages/game
features:
  - icon: ❤
    title: 循序渐进
    details: 纸上得来终觉浅，绝知此事要躬行。
  - icon: ✨
    title: 游戏与工具
    details: 游戏的尽头是怀旧，优化的尽头是默认。
  - icon: 🚶‍♂️
    title: 关于我
    details: 是个路人。
---

<script setup>
import GithubChart from './components/GithubChart.vue'
import SitePv from './components/SitePv.vue'
import ArticleCards from './components/ArticleCards.vue'
</script>

<ArticleCards />

<GithubChart />

<SitePv />
