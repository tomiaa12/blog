<template>
  <div class="chatGPT-container">
    <el-drawer
      v-model="drawer"
      v-if="isMobile"
      direction="ltr"
      :show-close="false"
      :with-header="false"
      class="drawer-chatgpt"
      size="auto"
      lock-scroll
    >
      <Aside
        v-show="drawer"
        v-model="currentChat"
        :chats="chats"
        :current-model="currentModel"
        @update:model-value="drawer = false"
        @saveChats="saveChats"
        @del-all="delAll"
      />
    </el-drawer>
    <Transition
      name="slideInOut"
      v-else
    >
      <Aside
        v-show="drawer"
        v-model="currentChat"
        :chats="chats"
        :current-model="currentModel"
        @saveChats="saveChats"
        @del-all="delAll"
      />
    </Transition>
    <Main
      v-model="currentChat"
      v-model:drawer="drawer"
      :chats="chats"
      :current-model="currentModel"
      @saveChats="saveChats"
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, provide, ref, watch } from "vue"
import Aside from "./ChatGPT/Aside.vue"
import Main from "./ChatGPT/Main.vue"
import { Chat } from "./ChatGPT/type"
import { inBrowser } from "vitepress"
import { copyToClipboard, isMobile } from "@/utils"

const chats = ref<Chat[]>(
  JSON.parse(localStorage.getItem("chatGPT-chats") as string) || []
)

const saveChats = () => {
  localStorage.setItem("chatGPT-chats", JSON.stringify(chats.value))
}

if (inBrowser)
  (window as any).copyToClip = function (button: any) {
    setTimeout(() => {
      const codeText = button.nextElementSibling.nextElementSibling.textContent
      copyToClipboard(codeText)
    }, 200)
  }

onUnmounted(() => {
  if (inBrowser) delete (window as any).copyToClip
})

provide("chats", chats)

const currentChat = ref<Chat>()
const currentModel = ref("gpt-3.5-turbo")

const delAll = () => {
  chats.value = []
  currentChat.value = undefined
}

const drawer = ref(!isMobile.value)
watch(isMobile, () => {
  drawer.value = true
})
</script>
<style lang="scss">
.chatGPT-container {
  height: calc(var(--vh) - var(--vp-nav-height));
  display: flex;
}

.Layout.chatGPT {
  .container,
  .content,
  .content-container {
    max-width: unset !important;
  }
  .VPDocFooter,
  .VPDocFooter + .vp-doc {
    padding-left: 20px;
  }
  .VPDoc {
    position: relative;
    padding: 0;
    .content {
      padding: 0;
    }
  }
  .page_pv {
    position: absolute;
    top: 0;
    right: 64px;
    z-index: 1;
  }
}

.slideInOut-enter-active,
.slideInOut-leave-active {
  transition: var(--el-transition-all);
  overflow: hidden;
}

.slideInOut-enter-from,
.slideInOut-leave-to {
  width: 0 !important;
}

.drawer-chatgpt {
  .el-drawer__body {
    --el-drawer-padding-primary: 0;
    padding: 0;
  }
}
</style>
