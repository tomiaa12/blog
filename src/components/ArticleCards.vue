<template>
  <div class="VPFeatures VPHomeFeatures">
    <div class="container">
      <div class="category-grid">

        <div
          v-for="category in categories"
          :key="category.name"
          class="category-card-container"
          :class="{
            'is-mobile': isMobile
          }"
        >
          <div class="category-card">
            <div class="card-header">
              <div class="card-icon">{{ category.icon }}</div>
              <h3 class="card-title">{{ category.name }}</h3>
            </div>
            <ul class="article-list">
              <li
                v-for="article in category.articles"
                :key="article.link"
              >
                <a
                  :href="article.link"
                  class="article-link"
                >
                  <span class="article-title">{{ article.title }}</span>
                  <span class="article-arrow">→</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isMobile } from "@/utils"
import { ref } from "vue"

interface Article {
  title: string
  link: string
}

interface Category {
  name: string
  icon: string
  articles: Article[]
}

const categories = ref<Category[]>([
  {
    name: "在线应用",
    icon: "🧰",
    articles: [
      { title: "FC 童年小霸王", link: "/pages/game" },
      { title: "Java 经典游戏", link: "/pages/javaGames" },
      // { title: "网址导航", link: "/pages/navigation" },
      { title: "在线默写单词", link: "/docs/在线应用/工具/在线默写单词" },
      { title: "软件下载", link: "/pages/software" },
      { title: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
    ],
  },
  {
    name: "精选文章",
    icon: "📚",
    articles: [
      { title: "Vue3 组件库", link: "/docs/文章/vue3组件/快速上手" },
      { title:"预览 Word 文件",link:"/docs/文章/前端/vue预览word文件docx",},
      { title:"预览 Excel 表格",link:"/docs/文章/前端/vue预览Excel表格",},
      { title:"资源收集",link:"/docs/资源收集/前端资源收集/UI库",},
      { title:"面试",link:"/docs/关于/面试",},
    ],
  },
  {
    name: "在线示例",
    icon: "🧪",
    articles: [
      { title: "Pixi.js", link: "/docs/框架/pixi.js/谷歌恐龙小游戏" },
      { title: "OpenLayers", link: "/docs/框架/openlayers示例/地图控件/导航控件" },
      { title: "Cesium", link: "/docs/进阶/Cesium/基础配置" },
      { title: "Three.js", link: "/docs/进阶/Three.js/07gsap处理动画.html" },
    ],
  },
])
</script>

<style scoped>
.container {
  padding: 24px 0 0 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  margin-bottom: 32px;
  text-align: center;
  background: linear-gradient(
    120deg,
    var(--vp-c-brand-1) 30%,
    var(--vp-c-brand-2)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.category-card-container {
  padding: 8px;
  width: 100%;
}
.category-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
}
@media (min-width: 768px) {
  .category-card-container {
      width: calc(100% / 3);
  }
}
.category-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 8px 16px ;
  border-bottom: 2px solid var(--vp-c-divider);
}

.card-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  flex-shrink: 0;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.article-list li {
  margin: 0;
}

.article-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: all 0.4s ease;
  gap: 8px;
}

.article-link:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}

.article-title {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-arrow {
  font-size: 16px;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transition: all 0.4s ease;
  flex-shrink: 0;
}

.article-link:hover .article-arrow {
  opacity: 1;
  transform: translateX(2px);
}
</style>
