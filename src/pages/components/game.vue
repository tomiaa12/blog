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

            <p>玩家1</p>
            <div class="player-1">
              <img
                src="./game/img/fc.png"
                alt="FC P1 游戏键位"
              />
              <span class="up">W</span>
              <span class="down">S</span>
              <span class="left">A</span>
              <span class="right">D</span>
              <span class="a">K</span>
              <span class="b">J</span>
              <span class="c">I</span>
              <span class="d">U</span>
              <span class="select">2</span>
              <span class="start">1</span>
            </div>
            <p>玩家2</p>
            <div class="player-2">
              <img
                src="./game/img/fc.png"
                alt="FC P2 游戏键位"
              />
              <span class="up">up</span>
              <span class="down">down</span>
              <span class="left">left</span>
              <span class="right">right</span>
              <span class="a">Num2</span>
              <span class="b">Num1</span>
              <span class="c">Num5</span>
              <span class="d">Num4</span>
              <span class="select">2</span>
              <span class="start">1</span>
            </div>
          </div>
        </div>
        <PlayGame
          :cur-rom="curRom"
          :base-url="BASE_URL"
        />
        <ul>
          <li
            v-for="i of recommendList"
            @click="curRom = i"
          >
            <div class="img-box">
              <el-image
                class="image"
                alt="i.title"
                :src="BASE_URL + 'img/' + i.cover"
              >
                <template #placeholder>
                  <InnerLoading />
                </template>
              </el-image>
              <el-image
                class="hover-show"
                :src="BASE_URL + 'img/' + i.image"
              >
                <template #placeholder>
                  <InnerLoading />
                </template>
              </el-image>
            </div>
            {{ i.title }}
            <span class="publisher">{{ i.publisher }}</span>
          </li>
        </ul>
      </main>
    </template>
    <template v-else>
      <SearchCategory
        v-model="keyword"
        v-model:cate="curCategory"
        :data="categorysData"
        placeholder="输入搜索游戏名称"
      />

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
import { randomInteger } from "@tomiaa/utils"
import { categorys, roms } from "./game"
import GameList from "./game/GameList.vue"
import PlayGame from "./game/PlayGame.vue"
import InnerLoading from "./game/InnerLoading.vue"
import SearchCategory from "./common/SearchCategory.vue"

const curCategory = ref("")

const categorysData = categorys.map(i => ({ label: i.name, value: i.id }))

const BASE_URL = "https://tomiaa12.github.io/nesRoms/"

const keyword = ref("")

const curRom = ref()

const getCategory = (id: string) => categorys.find(i => i.id === id)?.name

const recommendList = ref<any[]>([])
// 随机推荐数量
const recommendListLength = 10
watch(curRom, () => {
  if (!curRom.value) {
    recommendList.value = []
    return
  }
  while (recommendList.value.length <= recommendListLength) {
    recommendList.value.push(roms[randomInteger(0, roms.length - 1)])
  }
})

watch(curCategory, () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  })
})
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
  .img-box {
    position: relative;
    min-height: 240px;
    max-width: 100%;
    border-radius: var(--el-card-border-radius);
    overflow: hidden;
    .el-image {
      width: 100%;
      min-height: inherit;
      height: 0;
    }
    &:hover {
      .hover-show {
        opacity: 1;
        z-index: 1;
      }
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
  }

  h1 {
    display: none;
  }
  h2 {
    border-top: none;
    margin-top: 0;
  }
  .el-space {
    width: 100%;
    .el-space__item {
      max-width: calc(50% - 8px);
    }
  }

  .back {
    margin-bottom: 1em;
  }
  main {
    display: flex;
    flex-wrap: wrap;
    .options {
      width: 25%;
      max-width: 400px;

      .player-1,
      .player-2 {
        width: 100%;
        position: relative;
        img {
          max-width: 100%;
        }
        span {
          position: absolute;
          min-width: 1.7em;
          line-height: 1.7em;
          padding: 0 0.2em;
          text-align: center;
          background-color: var(--vp-c-bg-elv);
          border: 1px solid var(--vp-c-gray);
          border-radius: 6px;
          box-shadow: var(--vp-shadow-5);
          &.up {
            left: 15.8%;
            top: 22%;
          }
          &.down {
            bottom: 10%;
            left: 15.8%;
          }
          &.left {
            left: 5%;
            top: 47.8%;
          }
          &.right {
            left: 23%;
            top: 47.8%;
          }
          &.select {
            left: 39%;
            bottom: 33%;
          }
          &.start {
            left: 52%;
            bottom: 33%;
          }
          &.a {
            right: 8.8%;
            bottom: 0;
          }
          &.b {
            right: 22.4%;
            bottom: 0;
          }
          &.c {
            right: 9%;
            top: 16%;
          }
          &.d {
            right: 22.8%;
            top: 16%;
          }
        }
      }
    }
    .play {
      margin: 0 1em;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      flex: 1;
      max-width: 350px;
      li {
        list-style: none;
        display: flex;
        background-color: var(--el-color-info-light-9);
        line-height: 1.8;
        cursor: pointer;
        width: 350px;
        &:hover {
          color: var(--el-color-primary);
        }
        .img-box {
          min-height: 64px;
          max-width: 64px;
          width: 64px;
          height: 64px;
          margin-right: 1em;
        }
        .publisher {
          align-self: end;
          margin: 0 0.5em 0 auto;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .el-space__item {
    max-width: 100% !important;
  }
}

@media screen and (max-width: 640px) {
  .game main {
    .options {
      order: 1;
    }
    ul {
      order: 2;
    }
    .options,
    ul {
      width: 90%;
      max-width: 90%;
    }
    .play {
      margin: 0;
    }
  }
}
@media screen and (max-width: 1600px) {
  .game main {
    .options {
      order: 1;
      width: unset;
    }
    ul {
      order: 2;
      min-width: 250px;
      max-width: unset;
      margin-left: 1em;
      li {
        margin: 0 1em 1em 0;
      }
    }
    .play {
      margin: 0;
    }
  }
}
</style>
