<template>
  <!-- SEO 友好：静态内容，对用户隐藏，对搜索引擎可见 -->
  <div
    class="seo-content"
    style="display: none"
    aria-hidden="true"
  >
    <table>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.prop"
          >
            {{ col.label }}
          </th>
          <th v-if="showUrl">链接</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          :key="item.id"
        >
          <td
            v-for="col in columns"
            :key="col.prop"
          >
            <template v-if="col.render">
              {{ col.render(item) }}
            </template>
            <template v-else>
              {{ item[col.prop] }}
            </template>
          </td>
          <td v-if="showUrl && item.url">
            <a :href="item.url">{{ item.url }}</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 结构化数据 (JSON-LD for SEO) -->
    <script
      type="application/ld+json"
      v-if="structuredData"
    >
      {{ JSON.stringify(structuredData) }}
    </script>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  // 数据
  data: {
    type: Array,
    required: true,
  },
  // 列配置
  columns: {
    type: Array,
    required: true,
  },
  // 是否显示 URL 列
  showUrl: {
    type: Boolean,
    default: true,
  },
  // 资源类型（用于结构化数据）
  resourceType: {
    type: String,
    default: "",
  },
})

// 生成结构化数据 (JSON-LD)
const structuredData = computed(() => {
  if (!props.data || props.data.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: props.resourceType,
    itemListElement: props.data.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: item.name,
        description: item.description,
        url: item.url,
        applicationCategory: item.category,
      },
    })),
  }
})
</script>

<style scoped>
/* 确保 SEO 内容对用户完全隐藏，但对搜索引擎可见 */
.seo-content {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
