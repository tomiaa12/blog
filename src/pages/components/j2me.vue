<template>
  <div
    class="j2me-page"
    :class="{
      'is-mobile': isMobile,
    }"
  >
    <Config />
    <GameList
      title="已安装游戏："
      :items="localGameItems"
      :show-delete="true"
      :show-search="true"
      @run="g => openJar(g.jarName, g.midletClassName || '', g.isLocalJar)"
      @delete="handleDeleteGame"
    >
      <template #header-actions>
        <el-button
          type="primary"
          size="small"
          @click="triggerPickLocalJar"
        >
          安装本地文件
        </el-button>
      </template>
    </GameList>
    <el-alert
      type="warning"
      :closable="false"
      show-icon
      style="margin-bottom: 16px; "
    >
      <template #title>
        <span>
          游戏资源托管在 GitHub，国内访问可能需要科学上网或配置代理。如下载失败，请检查网络环境。
          由于网页模拟器兼容性问题，部分游戏可能会导致无法运行。
        </span>
      </template>
    </el-alert>
    <SearchCategory
      v-model="searchKeyword"
      v-model:cate="searchTag"
      placeholder="搜索游戏名称"
      :data="tagOptions"
    />

    <GameList
      title="在线游戏（点击下载安装）："
      :items="filteredRemoteGameItems"
      @run="handleRemoteGameRun"
    >
    </GameList>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import Config from "./j2me/config.vue"
import GameList, { type GameListItem } from "./j2me/gameList.vue"
import SearchCategory from "./common/SearchCategory.vue"
import {
  canvasSizeIndex,
  canvasSizeOptions,
  clampLocalJarIndex,
  gamepadSizeIndex,
  gamepadSizeOptions,
  gameresizeIndex,
  gameresizeOptions,
  loadConfigFromSession,
  saveConfigToSession,
} from "./j2me/hooks/useConfig"
import {
  buildOpenJarHref,
  listLocalJarInfos,
  type LocalJarInfo,
  downloadAndInstallJar,
  inferJarNameFromUrl,
  getLocalJarByName,
  deleteLocalJarFromDB,
  installJarFile,
} from "./j2me/hooks/utils"
import { isMobile } from "@/utils"
import { J2MEArchive1 } from "./j2me/gameList"

type RemoteGameItem = {
  name: string
  jarUrl: string
  midletClassName?: string
  tag?: string
  picPath: string
}

// 远程游戏列表（完整URL）
const remoteGames = ref<RemoteGameItem[]>([...J2MEArchive1])

// 跟踪每个远程游戏的下载状态
const downloadingGames = ref<Map<string, number>>(new Map())

const localJars = ref<string[]>([])
const localJarInfos = ref<LocalJarInfo[]>([])

// 搜索与分类
const searchKeyword = ref("")
const searchTag = ref("")

// 从远程游戏列表中提取所有唯一标签
const tagOptions = computed(() => {
  const tags = new Set<string>()
  remoteGames.value.forEach(g => {
    if (g.tag) tags.add(g.tag)
  })
  return Array.from(tags)
    .sort()
    .map(tag => ({ label: tag, value: tag }))
})

const remoteGameItems = computed<GameListItem[]>(() =>
  remoteGames.value.map(g => {
    const downloading = downloadingGames.value.has(g.jarUrl)
    const downloadProgress = downloadingGames.value.get(g.jarUrl) || 0
    // 检查是否已安装：从URL推断jar名，检查本地列表
    const jarName = inferJarNameFromUrl(g.jarUrl)
    const installed = localJars.value.includes(jarName)
    return {
      key: "remote:" + g.jarUrl,
      name: g.name,
      jarName: g.jarUrl, // 这里存URL供后续下载用
      midletClassName: g.midletClassName,
      picPath: g.picPath,
      isLocalJar: false, // 点击时会先下载安装
      downloading,
      downloadProgress,
      installed,
      tag: g.tag,
    }
  })
)

// 过滤后的在线游戏列表（基于搜索关键词和标签）
const filteredRemoteGameItems = computed<GameListItem[]>(() => {
  let items = remoteGameItems.value

  // 按标签过滤
  if (searchTag.value) {
    items = items.filter(item => item.tag === searchTag.value)
  }

  // 按关键词过滤（游戏名称）
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    items = items.filter(item => item.name.toLowerCase().includes(keyword))
  }

  return items
})

const localGameItems = computed<GameListItem[]>(() =>
  localJarInfos.value
    .slice()
    .sort((a, b) => {
      const at = a.installedAt || 0
      const bt = b.installedAt || 0
      if (bt !== at) return bt - at
      return (a.jarName || "").localeCompare(b.jarName || "")
    })
    .map(jar => ({
      key: "local:" + jar.jarName,
      name: jar.displayName || jar.jarName,
      jarName: jar.jarName,
      midletClassName: jar.midletClassName,
      picPath: jar.iconUrl,
      isLocalJar: true,
    }))
)

function openJar(
  jarName: string,
  midletClassName: string,
  isLocalJar: boolean
) {
  const canvasValue = canvasSizeOptions[canvasSizeIndex.value]?.value
  const gamepadValue = gamepadSizeOptions[gamepadSizeIndex.value]?.value
  const resizeValue = gameresizeOptions[gameresizeIndex.value]?.value
  const href = buildOpenJarHref({
    jarName,
    midletClassName,
    isLocalJar,
    canvasSize: canvasValue,
    gamepadSize: gamepadValue,
    gamepad: gamepadSizeIndex.value === 0 ? "0" : "1",
    gameresize: resizeValue,
  })

  saveConfigToSession()
  window.open(href, "_blank")
}

async function refreshLocalJars() {
  try {
    const infos = await listLocalJarInfos()
    localJarInfos.value = infos
    localJars.value = infos.map(i => i.jarName)
    clampLocalJarIndex(localJars.value.length)
  } catch (err) {
    // 在 SSR/不支持 indexedDB 的环境下不阻塞页面渲染
    console.warn(err)
    localJars.value = []
    localJarInfos.value = []
  }
}

async function handleRemoteGameRun(g: GameListItem) {
  const jarUrl = g.jarName // 远程游戏列表里存的是完整URL
  const midletClassName = g.midletClassName || ""

  // 如果正在下载，忽略点击
  if (downloadingGames.value.has(jarUrl)) {
    return
  }

  try {
    // 1. 从URL推断本地jar名
    const jarName = inferJarNameFromUrl(jarUrl)

    // 2. 检查本地是否已存在
    const existingJar = await getLocalJarByName(jarName)

    if (existingJar) {
      // 已存在，直接运行
      console.log(`${g.name} 已在本地，直接运行`)
      openJar(jarName, midletClassName, true)
      return
    }

    // 3. 不存在，下载安装
    // 设置下载状态
    downloadingGames.value.set(jarUrl, 0)

    try {
      await downloadAndInstallJar(jarUrl, progress => {
        downloadingGames.value.set(jarUrl, progress)
      })

      // 下载完成，移除状态
      downloadingGames.value.delete(jarUrl)

      // 刷新本地列表
      await refreshLocalJars()

      // 提示已安装，不自动运行
      ElMessage.success(`${g.name} 已安装完成！可在"已安装游戏"列表中运行`)
    } catch (err) {
      // 下载失败，移除状态
      downloadingGames.value.delete(jarUrl)
      throw err
    }
  } catch (err) {
    console.error(err)
    ElMessage.error(`${g.name} 下载安装失败：${err}`)
  }
}

const jarFileInputRef = ref<HTMLInputElement | null>(null)

function triggerPickLocalJar() {
  jarFileInputRef.value?.click()
}

async function handleUploadFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.name.toLowerCase().endsWith(".jar")) {
    ElMessage.error("只能上传 JAR 格式文件！")
    input.value = ""
    return
  }

  try {
    const jarName = await installJarFile(file)
    ElMessage.success(`${jarName} 安装成功！`)
    await refreshLocalJars()
    clampLocalJarIndex(localJars.value.length)
  } catch (err) {
    console.error(err)
    ElMessage.error(`${file.name} 安装失败！`)
  } finally {
    input.value = ""
  }
}

async function handleDeleteGame(g: GameListItem) {
  try {
    await ElMessageBox.confirm(`确定要卸载 ${g.name} 吗？`, "确认卸载", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    await deleteLocalJarFromDB(g.jarName)
    ElMessage.success(`${g.name} 已卸载！`)
    await refreshLocalJars()
    clampLocalJarIndex(localJars.value.length)
  } catch (err) {
    if (err === "cancel") return
    console.error(err)
    ElMessage.error(`${g.name} 卸载失败！`)
  }
}

onMounted(async () => {
  loadConfigFromSession()
  await refreshLocalJars()
  saveConfigToSession()
})
</script>

<style lang="scss" scoped>
.j2me-page {
  width: 100%;
  padding: 20px;
  padding-top: 16px;
  &.is-mobile {
    padding: 20px;
  }
  .back-home {
    margin: 0 0 12px;
    a {
      font-weight: bold;
      color: inherit;
      text-decoration: none;
    }
    h3 {
      margin: 0;
      display: inline-block;
    }
  }

  // 去掉搜索组件的底部边框和阴影
  :deep(.fix) {
    border-bottom: none;
    box-shadow: none;
  }
}

@media screen and (min-width: 1080px) {
  .j2me-page {
    margin: 0 auto;
  }
}
</style>
