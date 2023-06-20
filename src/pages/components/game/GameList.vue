<template>
  <div
    v-infinite-scroll="loadMore"
    :infinite-scroll-distance="400"
    class="list"
  >
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
      <template v-for="(i, index) of filterRoms">
        <el-card
          v-if="showMax > index"
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
      </template>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
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

const showMax = ref(30)

const loadMore = () => (showMax.value += 10)

watch(
  () => filterRoms.value.length,
  () => (showMax.value = 30)
)
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

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .empty {
    text-align: center;
    color: var(--el-color-info);
  }
}
</style>
