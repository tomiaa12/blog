<template>
  <div class="game">
    <template v-if="curRom">
      <el-button
        class="back"
        text
        icon="el-icon-arrow-left"
        @click="curRom = null"
      >
        返回游戏列表
      </el-button>
      <main>
        <PlayGame
          :cur-rom="curRom"
          :base-url="BASE_URL"
        />
        <div class="options">
          <div class="desc">
            <el-descriptions
              :title="curRom.title"
              :column="2"
              border
            >
              <el-descriptions-item label="发行">
                {{ curRom.publisher }}
              </el-descriptions-item>
              <el-descriptions-item label="发布">
                {{ curRom.source }}
              </el-descriptions-item>
              <el-descriptions-item label="容量">
                {{ (Number(curRom.size ?? 0) / 1024).toFixed(2) }}KB
              </el-descriptions-item>
              <el-descriptions-item label="类型">
                <el-tag size="large">
                  {{ curRom.type }} - {{ getCategory(curRom.type) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="备注">
                {{ curRom.comment }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </main>
    </template>
    <template v-else>
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

      <GameList
        :base-url="BASE_URL"
        :keyword="keyword"
        :cur-category="curCategory"
        @select="curRom = $event"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onBeforeUnmount, onMounted, watch } from "vue"
import { ref } from "vue"
import { categorys } from "./game"
import GameList from "./game/GameList.vue"
import PlayGame from "./game/PlayGame.vue"

const curCategory = ref("")

const BASE_URL = "https://tomiaa12.github.io/nesRoms/"

const keyword = ref("")

const curRom = ref()

const getCategory = (id: string) => categorys.find(i => i.id === id)?.name
</script>
<style lang="scss">
@font-face {
  font-family: zpix;
  src: url("/fonts/zpix.woff2");
}

.Layout.game {
  .container,
  .content,
  .content-container {
    max-width: unset !important;
  }
}

.game {
  font-family: zpix;
  h1 {
    display: none;
  }
  h2 {
    border-top: none;
    margin-top: 0;
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

  .back {
    margin-bottom: 1em;
  }
}

main {
  display: flex;
  flex-wrap: wrap;
}
</style>
