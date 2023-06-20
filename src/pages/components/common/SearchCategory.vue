<template>
  <div class="fix">
    <el-input
      :model-value="modelValue"
      class="keyword-input"
      :placeholder="placeholder"
      clearable
      size="large"
      @update:model-value="emits('update:modelValue', $event)"
      @input="emits('update:cate', '')"
    />

    <div class="cate">
      <el-check-tag
        :checked="!cate"
        size="large"
        @click="emits('update:cate', '')"
      >
        全部
      </el-check-tag>
      <el-check-tag
        v-for="i of data"
        :checked="cate === i.value"
        size="large"
        @click="emits('update:cate', i.value)"
      >
        {{ i.label }}
      </el-check-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { ref } from "vue"
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  cate: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "输入搜索名称",
  },
  data: {
    type: Array as PropType<{ label: string; value: string }[]>,
    default: () => [],
  },
})
const emits = defineEmits(["update:modelValue", "update:cate"])
</script>
<style lang="scss" scoped>
.el-check-tag {
  margin: 0 1em 1em 0;
  cursor: pointer;
}
.fix {
  position: sticky;
  top: var(--vp-nav-height);
  z-index: 10;
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 2px 4px -3px rgb(0 0 0 / 0.1);
  border-bottom: 1px solid var(--vp-c-divider);
  padding-top: 1em;
  margin-bottom: 1em;
}
.keyword-input {
  margin-bottom: 24px;
  max-width: 768px;
  .el-input-group__append {
    --el-input-border-color: var(--el-color-primary);
    --el-button-hover-text-color: var(--el-color-white);
    --el-button-hover-bg-color: var(--el-color-primary-light-3);
    --el-button-active-text-color: var(--el-button-hover-text-color);
    --el-button-active-border-color: var(--el-color-primary-dark-2);
    --el-button-active-bg-color: var(--el-color-primary-dark-2);
    background: var(--el-color-primary);
    color: white;

    &:hover {
      --el-input-border-color: var(--el-color-primary-light-3);
      color: var(--el-button-hover-text-color);
      background-color: var(--el-button-hover-bg-color);
    }
    &:active {
      --el-input-border-color: var(--el-button-active-border-color);
      color: var(--el-button-active-text-color);
      background-color: var(--el-button-active-bg-color);
    }
  }
}
</style>
