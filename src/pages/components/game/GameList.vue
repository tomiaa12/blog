<template>
  <div class="list">
    <h2>游戏列表（{{ filterRoms.length }}）</h2>
    <p
      v-if="!filterRoms.length"
      class="empty"
    >
      没有结果
    </p>
    <el-space
      wrap
      size="large"
      alignment="stretch"
    >
      <el-card
        v-for="i of filterRoms"
        class="box-card"
        shadow="hover"
        @click="emits('select', i)"
      >
        <div class="img-box">
          <el-image
            class="image"
            alt="i.title"
            :src="baseUrl + 'img/' + i.cover"
          >
            <template #placeholder>
              <InnerLoading />
            </template>
          </el-image>
          <el-image
            class="hover-show"
            :src="baseUrl + 'img/' + i.image"
          >
            <template #placeholder>
              <InnerLoading />
            </template>
          </el-image>
        </div>
        <p class="title">
          {{ i.title }}

          <el-tag>{{ i.type }}</el-tag>
        </p>
      </el-card>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue"
import { ref } from "vue"
import { roms } from "../game"

import InnerLoading from "./InnerLoading.vue"

const props = defineProps<{
  baseUrl: string
  keyword: string
  curCategory: string
}>()
const emits = defineEmits(["select"])

const filterRoms = computed(() => {
  if (props.keyword) return roms.filter(i => i.title.includes(props.keyword))
  return !props.curCategory
    ? roms
    : roms.filter(i => i.type === props.curCategory)
})
</script>
<style lang="scss">
.game {
  .box-card {
    cursor: pointer;
    .el-card__body {
      width: 256px;
      padding: 8px;
      box-sizing: content-box;
    }
    .img-box {
      position: relative;
      min-height: 240px;
      max-width: 100%;
      border-radius: var(--el-card-border-radius);
      overflow: hidden;
    }
    .hover-show {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: 0.3s;
    }

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &:hover {
      .hover-show {
        opacity: 1;
        z-index: 1;
      }
    }
  }

  .empty {
    text-align: center;
    color: var(--el-color-info);
  }
}
</style>
