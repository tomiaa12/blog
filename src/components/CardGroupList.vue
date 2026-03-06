<template>
  <div class="cgl-wrap">
    <div
      v-for="(group, gIdx) in items"
      :key="gIdx"
      class="cgl-group"
    >
      <h2
        v-if="group.title"
        class="cgl-group-title"
      >
        {{ group.title }}
      </h2>

      <!-- 有 tabs 的分组 -->
      <template v-if="group.tabs && group.tabs.length">
        <el-tabs
          v-model="activeTabs[gIdx]"
          class="cgl-tabs"
        >
          <el-tab-pane
            v-for="(tab, tIdx) in group.tabs"
            :key="tIdx"
            :label="tab.label"
            :name="String(tIdx)"
          />
        </el-tabs>
        <TransitionGroup
          name="cgl-fade"
          tag="div"
          class="cgl-grid"
        >
          <a
            v-for="(card, cIdx) in getTabCards(group, gIdx)"
            :key="cIdx"
            :href="resolveHref(card.href)"
            :target="card.blank === false ? '_self' : '_blank'"
            :rel="card.blank === false ? undefined : 'noopener noreferrer'"
            class="cgl-card-link"
          >
            <el-card
              class="cgl-card"
              shadow="hover"
            >
              <div
                v-if="card.from || card.to"
                class="cgl-card-badges"
              >
                <template v-if="card.from && card.to">
                  <el-tag
                    type="info"
                    effect="plain"
                    size="small"
                    >{{ card.from }}</el-tag
                  >
                  <span class="cgl-arrow">→</span>
                  <el-tag
                    type="success"
                    effect="plain"
                    size="small"
                    >{{ card.to }}</el-tag
                  >
                </template>
                <template v-else-if="card.from">
                  <el-tag
                    type="info"
                    effect="plain"
                    size="small"
                    >{{ card.from }}</el-tag
                  >
                </template>
                <template v-else-if="card.to">
                  <el-tag
                    type="success"
                    effect="plain"
                    size="small"
                    >{{ card.to }}</el-tag
                  >
                </template>
              </div>
              <div class="cgl-card-title">{{ card.title }}</div>
              <p
                v-if="card.desc"
                class="cgl-card-desc"
              >
                {{ card.desc }}
              </p>
            </el-card>
          </a>
        </TransitionGroup>
      </template>

      <!-- 普通 children -->
      <TransitionGroup
        v-else
        name="cgl-fade"
        tag="div"
        class="cgl-grid"
      >
        <a
          v-for="(card, cIdx) in group.children ?? []"
          :key="cIdx"
          :href="resolveHref(card.href)"
          :target="card.blank === false ? '_self' : '_blank'"
          :rel="card.blank === false ? undefined : 'noopener noreferrer'"
          class="cgl-card-link"
        >
          <el-card
            class="cgl-card"
            shadow="hover"
          >
            <div
              v-if="card.from || card.to"
              class="cgl-card-badges"
            >
              <template v-if="card.from && card.to">
                <el-tag
                  type="info"
                  effect="plain"
                  size="small"
                  >{{ card.from }}</el-tag
                >
                <span class="cgl-arrow">→</span>
                <el-tag
                  type="success"
                  effect="plain"
                  size="small"
                  >{{ card.to }}</el-tag
                >
              </template>
              <template v-else-if="card.from">
                <el-tag
                  type="info"
                  effect="plain"
                  size="small"
                  >{{ card.from }}</el-tag
                >
              </template>
              <template v-else-if="card.to">
                <el-tag
                  type="success"
                  effect="plain"
                  size="small"
                  >{{ card.to }}</el-tag
                >
              </template>
            </div>
            <div class="cgl-card-title">{{ card.title }}</div>
            <p
              v-if="card.desc"
              class="cgl-card-desc"
            >
              {{ card.desc }}
            </p>
          </el-card>
        </a>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { withBase, useData } from "vitepress"

const { localeIndex } = useData()
const localePrefix = computed(() =>
  localeIndex.value === "root" ? "" : `/${localeIndex.value}`
)

function resolveHref(href: string) {
  if (/^https?:\/\//.test(href)) return href
  const path = href.startsWith("/") ? href : `/${href}`
  return withBase(`${localePrefix.value}${path}`)
}

export interface CardItem {
  /** 卡片标题 */
  title: string
  /** 卡片描述 */
  desc?: string
  /** 链接地址 */
  href: string
  /** 是否新窗口打开，默认 true */
  blank?: boolean
  /** from tag，存在才展示 */
  from?: string
  /** to tag，存在才展示 */
  to?: string
}

export interface TabGroup {
  label: string
  children: CardItem[]
}

export interface GroupItem {
  /** 分组标题 */
  title?: string
  /** 直接卡片列表（与 tabs 二选一） */
  children?: CardItem[]
  /** tab 分组（与 children 二选一） */
  tabs?: TabGroup[]
}

const props = defineProps<{
  items: GroupItem[]
}>()

const activeTabs = ref<Record<number, string>>({})

watch(
  () => props.items,
  val => {
    val.forEach((group, gIdx) => {
      if (group.tabs?.length && activeTabs.value[gIdx] === undefined) {
        activeTabs.value[gIdx] = "0"
      }
    })
  },
  { immediate: true }
)

function getTabCards(group: GroupItem, gIdx: number): CardItem[] {
  const active = activeTabs.value[gIdx] ?? "0"
  return group.tabs?.[Number(active)]?.children ?? []
}
</script>

<style lang="scss" scoped>
.cgl-wrap {
  margin-top: 24px;
}

.cgl-group {
  margin-bottom: 48px;
}

.cgl-group-title {
  margin: 0 0 20px;
  padding-top: 24px;
  padding-bottom: 12px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.cgl-tabs {
  margin-bottom: 16px;
}

.cgl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.cgl-card-link {
  text-decoration: none;
  display: block;

  &::after {
    display: none !important;
  }

  &:hover .cgl-card {
    border-color: var(--el-color-primary-light-3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.cgl-card {
  height: 100%;
  border-radius: 10px;
  transition: border-color 0.25s ease, transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
  }

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.cgl-card-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.cgl-arrow {
  color: var(--vp-c-text-3);
  font-weight: 600;
  font-size: 14px;
}

.cgl-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 6px;
  line-height: 1.4;
}

.cgl-card-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 列表进入/离开动画 */
.cgl-fade-enter-active,
.cgl-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cgl-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.cgl-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* tab 切换时保证布局稳定 */
.cgl-fade-move {
  transition: transform 0.3s ease;
}
</style>
