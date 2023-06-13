<template>
  <div class="game">
    <div class="fix">
      <el-input
        v-model="keyword"
        class="keyword-input"
        placeholder="输入搜索游戏名称"
        clearable
        size="large"
        @input="curCategory = ''"
      />

      <div class="cate">
        <el-check-tag
          :checked="!curCategory"
          size="large"
          @click="curCategory = ''"
        >
          全部游戏
        </el-check-tag>
        <el-check-tag
          v-for="i of categorys"
          :checked="curCategory === i.id"
          size="large"
          @click="curCategory = i.id"
        >
          {{ i.name }}
        </el-check-tag>
      </div>
    </div>
    <NesVue
      v-if="src"
      :url="BASE_URL + 'roms/' + src"
    />
    <el-space wrap>
      <el-card
        v-for="i of filterRoms"
        class="box-card"
        shadow="hover"
        @click="src = i.url"
      >
        <div class="img-box">
          <el-image
            class="image"
            alt="i.title"
            :src="BASE_URL + 'img/' + i.cover"
          />
          <el-image
            class="hover-show"
            :src="BASE_URL + 'img/' + i.image"
          />
        </div>

        <div>
          {{ i.title }}
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue"
import { ref } from "vue"
import { NesVue } from "nes-vue"
import { categorys, roms } from "./game"

const curCategory = ref("")

const BASE_URL = "https://tomiaa12.github.io/nesRoms/"
console.log(roms)

const keyword = ref("")

const filterRoms = computed(() => {
  if (keyword.value) return roms.filter(i => i.title.includes(keyword.value))
  return !curCategory.value
    ? roms
    : roms.filter(i => i.type === curCategory.value)
})

const src = ref("")
</script>
<style lang="scss">
.Layout.game {
  .container,
  .content,
  .content-container {
    max-width: unset !important;
  }
}
.game {
  h1 {
    display: none;
  }
  .el-check-tag {
    margin: 0 1em 1em 0;
    cursor: pointer;
  }
  .el-space {
    .el-space__item {
      max-width: calc(50% - 8px);
    }
  }
  .box-card {
    cursor: pointer;
    .img-box {
      position: relative;
      width: 256px;
      max-width: 100%;
    }
    .hover-show {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .hover-show {
      opacity: 0;
      transition: 0.3s;
    }

    &:hover {
      .hover-show {
        opacity: 1;
        z-index: 1;
      }
    }
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
}
</style>
