<template>
  <div
    class="map-switcher"
    :class="size"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="map-item"
      :class="{ active: modelValue === item.id }"
      :title="item.name"
      @click="emits('update:modelValue', item.id)"
    >
      <img
        :src="item.preview"
        :alt="item.name"
      />
      <span>{{ item.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export type MapSwitcherItem = {
  id: string
  name: string
  preview: string
}

withDefaults(
  defineProps<{
    items: MapSwitcherItem[]
    modelValue: string
    size?: "sm" | "md"
  }>(),
  { size: "md" }
)

const emits = defineEmits<{
  "update:modelValue": [string]
}>()
</script>

<style lang="scss" scoped>
.map-switcher {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: min(var(--map-switcher-max-width, 720px), calc(100% - 72px));
}

.map-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 88px;
  padding: 6px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
  color: var(--vp-c-text-1);
  box-shadow: var(--el-box-shadow-light);
  cursor: pointer;

  img {
    width: 76px;
    height: 76px;
    object-fit: cover;
    border-radius: 6px;
  }

  span {
    font-size: 12px;
    line-height: 1.2;
  }

  &:hover,
  &.active {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}

.sm .map-item {
  width: 76px;

  img {
    width: 64px;
    height: 64px;
  }
}

@media screen and (max-width: 768px) {
  .map-item {
    width: 68px;
    padding: 4px;

    img {
      width: 58px;
      height: 58px;
    }
  }

  .sm .map-item {
    width: 64px;

    img {
      width: 52px;
      height: 52px;
    }
  }
}
</style>
