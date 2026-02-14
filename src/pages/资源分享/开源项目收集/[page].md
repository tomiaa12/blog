---
layout: page
title: 开源项目收集
---

<script setup>
import { useData } from 'vitepress'
import ResourceTable from '../common/ResourceTable.vue'
import SeoContent from '../common/SeoContent.vue'
import { getPageData, getResourceConfig } from '../common/resourceConfig.js'

const { params } = useData()

// 从路由参数中获取页码
const currentPage = parseInt(params.value.page) || 1

// 获取当前页的数据（用于 SEO）
const pageData = getPageData('开源项目收集', currentPage)

// 获取配置
const config = getResourceConfig('开源项目收集')
</script>

<!-- SEO 友好：静态内容（搜索引擎可见） -->

<SeoContent 
  :data="pageData"
  :columns="config?.columns || []"
  resource-type="开源项目收集"
/>

<!-- 用户可见：交互式表格 -->

<ResourceTable 
  resource-type="开源项目收集" 
  :initial-page="currentPage"
/>
