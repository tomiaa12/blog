<template>
  <div class="resource-table-container">
    <!-- 标题和描述 -->
    <div
      v-if="config?.meta"
      class="resource-header"
    >
      <h1>{{ config.meta.title }}</h1>
      <p class="description">{{ config.meta.description }}</p>
    </div>

    <!-- 表格 -->
    <el-table
      :data="currentData"
      stripe
      border
      style="width: 100%"
      v-loading="loading"
    >
      <!-- 动态列 -->
      <el-table-column
        v-for="column in config?.columns || []"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align || 'left'"
      >
        <template #default="{ row }">
          <!-- 如果有自定义渲染函数 -->
          <span v-if="column.render">{{ column.render(row) }}</span>
          <!-- 否则直接显示值 -->
          <span v-else>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="config?.actions"
        :label="config.actions.label"
        :width="config.actions.width"
        :fixed="config.actions.fixed"
      >
        <template #default="{ row }">
          <el-button
            v-for="(btn, index) in config.actions.buttons"
            :key="index"
            :type="btn.type"
            :link="btn.link"
            size="small"
            @click="btn.handler(row)"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="1"
        :total="totalPages"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useRouter, useRoute } from "vitepress"
import {
  getResourceConfig,
  getPageData,
  getTotalPages,
} from "./resourceConfig.js"

const props = defineProps({
  // 资源类型，如 '开源项目收集'
  resourceType: {
    type: String,
    required: true,
  },
  // 初始页码（从路由参数中获取）
  initialPage: {
    type: Number,
    default: 1,
  },
})

const router = useRouter()
const route = useRoute()

// 当前页码
const currentPage = ref(props.initialPage)
// 加载状态
const loading = ref(false)
// 当前页数据
const currentData = ref([])
// 数据缓存：存储已加载的页面数据
const dataCache = ref({})

// 获取配置
const config = computed(() => getResourceConfig(props.resourceType))

// 总页数
const totalPages = computed(() => getTotalPages(props.resourceType))

/**
 * 加载指定页的数据（带缓存）
 */
async function loadPageData(page) {
  // 如果缓存中已有该页数据，直接使用缓存
  if (dataCache.value[page]) {
    currentData.value = dataCache.value[page]
    return
  }

  loading.value = true

  // 模拟异步加载（实际项目中可能是 API 请求）
  await new Promise(resolve => setTimeout(resolve, 300))

  // 从配置中获取数据
  const data = getPageData(props.resourceType, page)

  // 缓存数据
  dataCache.value[page] = data
  currentData.value = data

  loading.value = false
}

/**
 * 处理分页变化
 */
function handlePageChange(page) {
  // 更新 URL，但不刷新页面
  // 移除 .html 扩展名和最后的页码
  const basePath = route.path.replace(/\.html$/, "").replace(/\/\d+$/, "")
  router.go(`${basePath}/${page}`)

  // 加载新页面的数据
  loadPageData(page)

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// 监听路由变化
watch(
  () => route.path,
  newPath => {
    // 匹配路径中的页码，考虑可能有 .html 扩展名
    const match = newPath.replace(/\.html$/, "").match(/\/(\d+)$/)
    if (match) {
      const page = parseInt(match[1])
      if (page !== currentPage.value) {
        currentPage.value = page
        loadPageData(page)
      }
    }
  }
)

// 组件挂载时加载初始数据
onMounted(() => {
  loadPageData(currentPage.value)
})
</script>

<style scoped>
.resource-table-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.resource-header {
  margin-bottom: 24px;
}

.resource-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.resource-header .description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 20px 0;
}

/* 深色模式适配 */
.dark .resource-header h1 {
  color: var(--vp-c-text-1);
}

.dark .resource-header .description {
  color: var(--vp-c-text-2);
}

/* Element Plus 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
}

:deep(.el-table td),
:deep(.el-table th) {
  padding: 12px 0;
}

:deep(.el-pagination) {
  --el-pagination-button-color: var(--vp-c-text-1);
  --el-pagination-bg-color: var(--vp-c-bg);
  --el-pagination-hover-color: var(--vp-c-brand);
}
</style>
