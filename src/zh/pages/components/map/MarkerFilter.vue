<template>
  <div
    v-if="visibleGroups.length"
    class="marker-filter"
  >
    <div
      v-if="showActions"
      class="filter-actions"
    >
      <button
        type="button"
        @click="setAll(true)"
      >
        显示全部
      </button>
      <button
        type="button"
        @click="setAll(false)"
      >
        隐藏全部
      </button>
    </div>
    <el-checkbox-group
      :model-value="modelValue"
      @change="onChange"
    >
      <template
        v-for="group in visibleGroups"
        :key="group.id"
      >
        <div
          v-if="group.name"
          class="filter-group-title"
        >
          {{ group.name }}
        </div>
        <el-checkbox
          v-for="item in group.items"
          :key="item.id"
          class="filter-item"
          :label="item.id"
          :value="item.id"
        >
          <img
            :src="item.icon"
            :alt="item.name"
          />
          <span class="filter-text">
            <span class="filter-name">{{ item.name }}</span>
            <span
              v-if="item.count != null"
              class="filter-count"
            >{{ item.count }}</span>
          </span>
        </el-checkbox>
      </template>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

export type MarkerFilterItem = {
  id: string
  name: string
  icon: string
  count?: number
}

export type MarkerFilterGroup = {
  id: string
  name?: string
  items: MarkerFilterItem[]
}

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    groups?: MarkerFilterGroup[]
    items?: MarkerFilterItem[]
    showActions?: boolean
  }>(),
  {
    groups: () => [],
    items: () => [],
    showActions: false,
  }
)

const emits = defineEmits<{
  "update:modelValue": [string[]]
  change: [string[]]
}>()

const visibleGroups = computed<MarkerFilterGroup[]>(() => {
  if (props.groups.length) return props.groups
  if (props.items.length) return [{ id: "all", items: props.items }]
  return []
})

function onChange(val: string | number | boolean | (string | number | boolean)[]) {
  const ids = (Array.isArray(val) ? val : [val]).map(String)
  emits("update:modelValue", ids)
  emits("change", ids)
}

function setAll(on: boolean) {
  const ids = on
    ? visibleGroups.value.flatMap(group => group.items.map(item => item.id))
    : []
  onChange(ids)
}
</script>

<style lang="scss" scoped>
.marker-filter {
  min-width: 168px;
  padding: 8px;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: var(--el-box-shadow-light);
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;

  button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--vp-c-brand-1);
    font-size: 12px;
    cursor: pointer;
  }
}

.filter-group-title {
  margin: 8px 6px 4px;
  color: var(--vp-c-text-2);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.filter-item {
  display: flex;
  align-items: center;
  height: auto;
  margin: 0;
  padding: 4px 6px;
  border-radius: 8px;

  :deep(.el-checkbox__label) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
    color: var(--vp-c-text-1);
    font-size: 12px;
  }

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    transition: opacity 0.25s ease;
  }

  .filter-text {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }

  .filter-name {
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 0;
      height: 1px;
      background: currentColor;
      transform: translateY(-50%);
      transform-origin: left center;
      pointer-events: none;
      transition: width 0.28s ease;
    }
  }

  &.is-checked :deep(.el-checkbox__label) {
    color: var(--vp-c-text-1);
  }

  &:not(.is-checked) {
    :deep(.el-checkbox__label) {
      color: var(--vp-c-text-2);
    }

    img {
      opacity: 0.7;
    }

    .filter-name::after {
      width: 100%;
    }
  }
}
</style>
