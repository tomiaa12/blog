<template>
  <div class="chatGPT-container">
    <Aside
      v-model="currentChat"
      :chats="chats"
      :current-model="currentModel"
    />
    <Main
      v-model="currentChat"
      :chats="chats"
      :current-model="currentModel"
    />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from "vue"
import Aside from "./ChatGPT/Aside.vue"
import Main from "./ChatGPT/Main.vue"
import { Chat } from "./ChatGPT/type"

const chats = ref<Chat[]>([
  {
    title: "1",
    time: Date.now(),
    model: "gpt-4",
    message: [
      {
        role: "user",
        content: "你是谁",
      },
      {
        role: "assistant",
        content: "gggpptt",
      },
    ],
  },
  {
    title: "1",
    time: new Date("2022-8-9 01:01:00").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-9 01:01:00").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
  {
    title: "1",
    time: new Date("2022-8-1").getTime(),
    model: "gpt-4",
    message: [],
  },
])

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
