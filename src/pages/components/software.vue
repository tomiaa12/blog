<template>
  <div class="list-content">
    <SearchCategory
      v-model="keyword"
      v-model:cate="cate"
      :data="data"
      placeholder="输入搜索软件名称"
    />
    <template v-for="i of filterList">
      <h2
        v-if="i.children.length"
        :id="i.title"
      >
        {{ i.title }}
      </h2>
      <el-space
        wrap
        size="large"
        alignment="stretch"
      >
        <a
          v-for="j of i.children"
          :href="j.download[0].url"
          :target="j.download[0].url"
          rel="noopener noreferrer"
        >
          <el-card
            shadow="hover"
            class="box-card"
          >
            <template #header>
              <img
                :src="j.icon"
                :alt="'图标' + j.title"
              />
              <span> {{ j.title }}</span>
            </template>
            <div class="info">
              <p>
                {{ j.desc }}
              </p>
              <p v-for="k of j.download">
                <el-button
                  link
                  @click.prevent="open(k)"
                >
                  <span>
                    {{ k.name }}
                  </span>
                  <span v-if="k.code">密码：{{ k.code }} </span>
                </el-button>
              </p>
            </div>
          </el-card>
        </a>
      </el-space>
    </template>
    <span v-if="!filterList.length">未搜索到软件</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import SearchCategory from "./common/SearchCategory.vue"
import list from "./software"

const data = list.map(i => ({ label: i.title, value: i.title }))

const open = (item: any) => window.open(item.url)

const keyword = ref()
const cate = ref()

const filterList = computed(() => {
  const temp = JSON.parse(JSON.stringify(list))
  return temp.filter((i: any) => {
    if (cate.value) return i.title === cate.value
    if (keyword.value)
      i.children = i.children.filter((i: any) => {
        if (i.title.includes(keyword.value) || i.desc?.includes(keyword.value))
          return i
      })
    return i
  })
})
</script>
<style lang="scss">
.software {
  h1 {
    display: none;
  }
  .container {
    max-width: unset !important;
    .content {
      max-width: unset !important;
      .content-container {
        max-width: unset !important;
      }
    }
  }
  .aside {
    position: fixed;
    right: 0;
    top: var(--vp-nav-height-desktop);
    z-index: 10;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
  .list-content {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin: auto;
    max-width: 1000px;
    padding: 32px 24px 96px;
    .box-card {
      width: 222px;
      height: 100%;
      word-break: break-all;
      .el-card__header {
        display: flex;
        align-items: center;
        span {
          padding-left: 1em;
        }
        img {
          width: 1.5em;
          height: 1.5em;
          border-radius: 4px;
        }
      }
      .info {
        p {
          color: var(--vp-c-black-mute);
          margin-top: 0;
          &:last-child {
            margin-bottom: 0;
          }
        }
        button > span {
          flex-wrap: wrap;
          span {
            margin-bottom: 0.5em;
          }
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .list-content {
      padding: 0;
    }
    .el-space__item {
      max-width: calc(50% - 16px);
      > a,
      .box-card {
        max-width: 100%;
      }
    }
  }
}
</style>
