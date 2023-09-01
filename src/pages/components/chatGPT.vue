<template>
  <div class="chatGPT-container">
    <Aside
      v-model="currentChat"
      :chats="chats"
      :current-model="currentModel"
      @saveChats="saveChats"
    />
    <Main
      v-model="currentChat"
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
import { copyToClipboard } from "@/utils"

const chats = ref<Chat[]>(
  JSON.parse(localStorage.getItem("chatGPT-chats") as string) || []
)

const saveChats = () => {
  localStorage.setItem("chatGPT-chats", JSON.stringify(chats.value))
}

if (inBrowser) (window as any).copyToClipboard = function (event: Event) {
  copyToClipboard((event.target as any).dataset.code)
}

onUnmounted(() => {
  if (inBrowser) delete (window as any).copyToClipboard
})

watch(
  chats,
  () => {
    console.log(chats.value)
  },
  {
    deep: true,
  }
)

provide("chats", chats)

const currentChat = ref<Chat>()
const currentModel = ref("gpt-4")
</script>
<style lang="scss">
.chatGPT-container {
  height: calc(100vh - var(--vp-nav-height));
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
</style>
