<template>
  <div class="search-container">
    <div class="main">
      <div class="control">
        <el-button
          v-for="(item, i) of origins"
          text
          size="large"
          :bg="i === cur"
          :type="i === cur ? 'primary' : ''"
          @click="switchingEngines(i)"
        >
          {{ item.name }}
        </el-button>
      </div>
      <div class="search-content">
        <el-popover
          :visible="isFocus && !!getList.length"
          :teleported="false"
          :show-arrow="false"
          trigger="contextmenu"
          width="calc(100% - 48px)"
        >
          <template #reference>
            <el-input
              ref="inputRef"
              v-model="keyword"
              size="large"
              clearable
              @focus="focus"
              @blur="blur"
              @keydown="keydown"
              @keyup="keyup"
            >
              <template #append>
                <el-button
                  type="primary"
                  @click="openSearch"
                >
                  搜 索
                </el-button>
              </template>
            </el-input>
          </template>

          <a
            v-for="(name, i) of getList"
            :class="['list', active === i && 'active']"
            :href="origins[cur].link + name"
            :target="origins[cur].link + name"
            @mouseenter="mouseenter(i, name)"
            @click="listClick"
          >
            {{ name }}
          </a>
        </el-popover>
      </div>
    </div>
  </div>
  <div class="websites">
    <template v-for="i of list">
      <h2 :id="i.title">{{ i.title }}</h2>
      <el-space
        wrap
        size="large"
        alignment="stretch"
      >
        <a
          v-for="j of i.children"
          :href="j.url"
          :target="j.url"
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
              <span>
                {{ j.title }}
              </span>
            </template>
            <div class="info">
              <div class="desc">
                {{ j.desc }}
              </div>
            </div>
          </el-card>
        </a>
      </el-space>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import axios from "axios"

/* eslint-disable */
// @ts-ignore
import jsonpAdapter from "axios-jsonp"
/* eslint-enable */

import list from "./navigation"

let oAside: HTMLElement | null
const scroll = () => {
  if (!oAside) return
  oAside.style.opacity =
    +(
      document.documentElement.scrollTop > document.documentElement.clientHeight
    ) + ""
}

onMounted(() => {
  oAside = document.querySelector(".aside")
  if (!oAside) return

  window.addEventListener("scroll", scroll)
  scroll()
})

onBeforeUnmount(() => {
  oAside && (oAside.style.opacity = "1")
  window.removeEventListener("scroll", scroll)
})

const getList = computed(() => {
  return data.value.length ? data.value : cache ? [] : searchHistory.value
})

const baidu = async () => {
  const {
    data: { g = [] },
  } = await axios({
    url: "https://www.baidu.com/sugrec",
    adapter: jsonpAdapter,
    params: { prod: "pc", wd: keyword.value },
  })
  data.value = g.map((i: any) => i.q)
}

const bing = async () => {
  const {
    data: {
      AS: { Results = [] },
    },
  } = await axios({
    url: "https://api.bing.com/qsonhs.aspx",
    adapter: jsonpAdapter,
    callbackParamName: "cb",
    params: { type: "cb", q: keyword.value },
  })
  data.value = Results.map((i: any) => i.Suggests)
    .flat()
    .map((i: any) => i.Txt)
}

const google = async () => {
  const {
    data: [, list],
  } = await axios({
    url: "https://suggestqueries.google.com/complete/search",
    adapter: jsonpAdapter,
    params: {
      client: "youtube",
      q: keyword.value,
    },
  })
  data.value = list.map(([q]: any) => q)
}

const bilibili = async () => {
  const { data: res } = await axios({
    url: "/proxy/s.search.bilibili.com/main/suggest",
    params: {
      term: keyword.value,
      func: "suggest",
    },
  })
  data.value = Object.values(res).map(({ value }: any) => value)
}

const cur = ref(0)
const active = ref(-1)

const origins = [
  {
    name: "百 度",
    fn: baidu,
    link: "https://www.baidu.com/s?wd=",
  },
  {
    name: "必 应",
    fn: bing,
    link: "https://cn.bing.com/search?q=",
  },
  {
    name: "Google",
    fn: google,
    link: "https://www.google.com/search?q=",
  },
  {
    name: "Bilibili",
    fn: bilibili,
    link: "https://search.bilibili.com/all?keyword=",
  },
]

const keyword = ref()

// input change 搜索列表
const data = ref<string[]>([])
const getData = () => {
  if (!keyword.value) return (data.value = [])
  origins[cur.value].fn()
}

const keydown = (event: any) => {
  const { key } = event

  if (["Tab", "ArrowDown", "ArrowUp"].includes(key)) event.preventDefault()

  if (key === "ArrowUp") {
    --active.value < -1 &&
      (active.value = cache
        ? data.value.length - 1
        : searchHistory.value.length - 1)
    return
  }
  if (key === "ArrowDown") {
    ++active.value ===
      (cache ? data.value.length : searchHistory.value.length) &&
      (active.value = -1)
    return
  }

  if (key === "Enter") {
    return openSearch()
  }
}

let cache = ""

const keyup = (event: KeyboardEvent) => {
  const { key, shiftKey } = event

  // tab 或 shift + tab 切换搜索引擎
  if (key === "Tab") {
    if (shiftKey) {
      cur.value - 1 < 0 ? (cur.value = origins.length - 1) : cur.value--
    } else {
      cur.value + 1 >= origins.length ? (cur.value = 0) : cur.value++
    }
    active.value = -1
    getData()
    return
  }

  // 上下键时，当前项设为输入框的值，-1 时设为缓存值
  if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(key))
    return (keyword.value =
      (cache ? data.value[active.value] : searchHistory[active.value]) || cache)

  // 不是上下键时才做缓存
  if (!["ArrowDown", "ArrowUp"].includes(key)) {
    cache = keyword.value
  }

  active.value = -1
  getData()
}

const inputRef = ref()

// 切换搜索引擎
const switchingEngines = (i: number) => {
  cur.value = i
  data.value = []
  active.value = -1
  inputRef.value.focus()
  focus()
  getData()
}

// 焦点
const isFocus = ref(false)
const focus = () => (isFocus.value = true)
const blur = () => (isFocus.value = false)

const mouseenter = (i: number, name: string) => {
  active.value = i
  keyword.value = name
}

// 打开对应搜索结果页面
const openSearch = () => {
  const a = document.createElement("a")
  a.href = origins[cur.value].link + keyword.value
  a.target = a.href
  a.click()
  a.remove()
  savaSearchHistory()
}

const searchHistory = ref(
  JSON.parse(localStorage.getItem("searchHistory") as any) || []
)

// 保存搜索记录
const savaSearchHistory = () => {
  if (!keyword.value) return

  const hasIndex = searchHistory.value.indexOf(keyword.value)
  if (hasIndex > -1) searchHistory.value.splice(hasIndex, 1)

  searchHistory.value.unshift(keyword.value)
  keyword.value = ""
  data.value = []
  cache = ""
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value))
}

const listClick = () => {
  // 等待调转后再保存
  setTimeout(savaSearchHistory)
}
</script>
<style lang="scss">
.navigation {
  .container {
    max-width: unset !important;
    .content {
      max-width: unset !important;
      .content-container {
        max-width: unset !important;
      }
    }
    .aside {
      transition: all 0.3s;
    }
  }
  h1 {
    display: none;
  }
  .VPNav {
    background: transparent !important;
  }
  .VPContent {
    padding-top: 0;
  }

  .aside {
    position: fixed;
    right: 0;
    z-index: 10;
    top: var(--vp-nav-height-desktop);
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }

  .search-container {
    height: 100vh;
    position: relative;
    .main {
      position: absolute;
      left: 50%;
      top: 20%;
      transform: translate(-50%);
      width: 100%;
      max-width: 668px;
      padding: 32px 24px 96px;
      .control {
        button {
          margin: 0 12px 12px 0;
        }
      }
      .search-content {
        .el-popper {
          padding: 0.5em 0;
          a {
            color: inherit;
          }
        }
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

        .list {
          display: block;
          line-height: 2;
          padding: 0 1em;
          &.active {
            background: var(--vp-c-gray-light-5);
            cursor: pointer;
            color: var(--vp-c-brand);
          }
        }
      }
    }
  }

  .websites {
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
        display: flex;
        .desc {
          padding-left: 1em;
          color: var(--vp-c-black-mute);
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .websites {
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
