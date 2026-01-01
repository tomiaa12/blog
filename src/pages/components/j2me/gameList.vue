<template>
  <div class="j2me-game-list">
    <div class="list-header">
      <div class="title-section">
        <h3 class="title">{{ title }}</h3>
        <span
          v-if="filteredItems.length"
          class="count"
          >{{ filteredItems.length }} 个</span
        >
        <el-input
          v-if="showSearch"
          v-model="searchKeyword"
          placeholder="搜索游戏名称"
          clearable
          class="search-input"
        />
        <div class="header-actions">
          <slot name="header-actions" />
        </div>
      </div>
    </div>

    <div
      v-if="items.length"
      class="game-list"
    >
      <div
        v-for="g in paginatedItems"
        :key="g.key"
        class="game-item-wrapper"
      >
        <span
          v-if="g.installed"
          class="installed-tag"
        >
          已安装
        </span>
        <a
          class="game-item"
          :class="{ downloading: g.downloading }"
          href="javascript:void(0)"
          @click="emit('run', g)"
          @auxclick.prevent="handleAuxClick($event, g)"
        >
          <div class="thumb-container">
            <img
              v-if="g.picPath"
              :src="g.picPath"
              class="thumb-img"
              :alt="g.name"
              loading="lazy"
            />
            <div
              v-else
              class="thumb-fallback"
            >
              JAR
            </div>
            <div
              v-if="g.downloading"
              class="download-overlay"
            >
              <div class="progress-circle">
                <svg
                  viewBox="0 0 100 100"
                  class="progress-svg"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    class="progress-bg"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    class="progress-bar"
                    :style="{
                      strokeDashoffset:
                        283 - (283 * (g.downloadProgress || 0)) / 100,
                    }"
                  />
                </svg>
                <span class="progress-text"
                  >{{ g.downloadProgress || 0 }}%</span
                >
              </div>
            </div>
          </div>
          <div class="game-info">
            <span class="name">{{ g.name }}</span>
          </div>
        </a>
        <button
          v-if="showDelete"
          class="delete-btn"
          title="卸载"
          @click.stop="emit('delete', g)"
        >
          ×
        </button>
      </div>
    </div>

    <div
      v-else
      class="empty"
    >
      暂无游戏
    </div>
    <div
      v-if="filteredItems.length > pageSize"
      class="pagination-container"
    >
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredItems.length"
        layout="prev, pager, next, jumper"
        background
        small
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

export type GameListItem = {
  key: string
  name: string
  jarName: string
  midletClassName?: string
  picPath?: string
  isLocalJar: boolean
  downloading?: boolean
  downloadProgress?: number
  installed?: boolean
  tag?: string
}

const props = defineProps<{
  title: string
  items: GameListItem[]
  showDelete?: boolean
  showSearch?: boolean
}>()

const emit = defineEmits<{
  (e: "run", item: GameListItem): void
  (e: "delete", item: GameListItem): void
}>()

// 搜索关键词
const searchKeyword = ref("")

// 分页相关
const currentPage = ref(1)
const pageSize = ref(55)

// 过滤后的数据（先搜索过滤）
const filteredItems = computed(() => {
  if (!props.showSearch || !searchKeyword.value.trim()) {
    return props.items
  }
  const keyword = searchKeyword.value.trim().toLowerCase()
  return props.items.filter(item => item.name.toLowerCase().includes(keyword))
})

// 计算分页后的数据
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// 当过滤结果改变时，如果当前页超出范围，重置到第一页
watch(
  () => filteredItems.value.length,
  () => {
    const maxPage = Math.ceil(filteredItems.value.length / pageSize.value)
    if (currentPage.value > maxPage && maxPage > 0) {
      currentPage.value = 1
    }
  }
)

// 处理鼠标中键点击
function handleAuxClick(event: MouseEvent, g: GameListItem) {
  // button === 1 表示鼠标中键
  if (event.button === 1) {
    emit("run", g)
  }
}
</script>

<style lang="scss" scoped>
.j2me-game-list {
  margin-bottom: 24px;

  .list-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--vp-c-divider, #e4e7ed);

    .title-section {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--vp-c-text-1, #303133);
    }

    .count {
      font-size: 14px;
      color: var(--vp-c-text-2, #606266);
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .search-input {
      max-width: 300px;
    }
  }

  .game-list {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    align-items: stretch;
  }

  .game-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .game-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: inherit;
    background: var(--vp-c-bg-soft, #f5f7fa);
    border: 1px solid var(--vp-c-divider, #e4e7ed);
    border-radius: 8px;
    padding: 12px;
    transition: all 0.2s;
    cursor: pointer;
    position: relative;
    height: 100%;

    &:hover {
      border-color: var(--vp-c-brand, #409eff);
      box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.15);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &.downloading {
      pointer-events: none;
      opacity: 0.8;
    }
  }

  .delete-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--vp-c-danger, #f56c6c);
    color: white;
    border: 2px solid white;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 0;

    &:hover {
      background: var(--vp-c-danger-dark, #f04848);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .thumb-container {
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .download-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .progress-circle {
    position: relative;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 4;
  }

  .progress-bar {
    fill: none;
    stroke: var(--vp-c-brand, #409eff);
    stroke-width: 4;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.3s ease;
  }

  .progress-text {
    position: relative;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .thumb-img {
    width: 64px;
    height: 64px;
    object-fit: cover;
  }

  .thumb-fallback {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg, #ffffff);
    border: 1px dashed var(--vp-c-divider, #e4e7ed);
    border-radius: 4px;
    color: var(--vp-c-text-3, #909399);
    font-size: 12px;
    font-weight: 500;
  }

  .game-info {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .name {
    display: block;
    font-size: 13px;
    line-height: 1.4;
    color: var(--vp-c-text-1, #303133);
    // 预留两行高度，避免一行/两行名称导致卡片高度不一致
    min-height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  .installed-tag {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(20%, -50%);
    padding: 2px 8px;
    font-size: 11px;
    line-height: 1.2;
    color: white;
    background: var(--vp-c-success-3);
    border-radius: 10px;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .empty {
    text-align: center;
    padding: 32px;
    color: var(--vp-c-text-3, #909399);
    font-size: 14px;
    background: var(--vp-c-bg-soft, #f5f7fa);
    border-radius: 8px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding-top: 16px;
  }
}

@media screen and (min-width: 768px) {
  .j2me-game-list {
    .game-list {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
}

@media screen and (max-width: 640px) {
  .j2me-game-list {
    .list-header {
      .title {
        font-size: 16px;
      }

      .count {
        font-size: 13px;
      }
    }

    .game-list {
      gap: 12px;
    }

    .name {
      font-size: 12px;
    }
  }
}
</style>
