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
import { provide, ref, watch } from "vue"
import Aside from "./ChatGPT/Aside.vue"
import Main from "./ChatGPT/Main.vue"
import { Chat } from "./ChatGPT/type"

const chats = ref<Chat[]>(JSON.parse(localStorage.getItem("chatGPT-chats") as string) || [
  {"model":"gpt-4","time":1693270357044,"title":"鲁迅与周树人是什么关系？","message":[{"role":"system","content":"用中文回答的精简一些，现在时间:1693270357044"},{"role":"user","content":"鲁迅与周树人是什么关系？"},{"role":"assistant","content":"鲁迅与周树人是中国现代文学界的两位重要作家。他们是同事和朋友，曾经共同参与过中国新文化运动和五四运动。他们在文学创作上有一定的合作关系，也有过一些争论和分歧。总体来说，他们都对中国社会和文化进行了深刻的批判和反思，为中国现代文学的发展做出了重要贡献。"},{"role":"assistant","content":"使用axios发送http请求非常简单。首先，确保你已经安装了axios，可以通过在终端中运行以下命令来进行安装：\n\n```\nnpm install axios\n```\n\n安装完成后，在你的代码中引入axios：\n\n```javascript\nimport axios from 'axios';\n```\n\n然后，你可以使用axios的各种方法来发送http请求。例如，发送一个GET请求：\n\n```javascript\naxios.get('https://api.example.com/data')\n  .then(response => {\n    console.log(response.data);\n  })\n  .catch(error => {\n    console.error(error);\n  });\n```\n\n发送一个POST请求：\n\n```javascript\naxios.post('https://api.example.com/data', { foo: 'bar' })\n  .then(response => {\n    console.log(response.data);\n  })\n  .catch(error => {\n    console.error(error);\n  });\n```\n\n这只是axios的一小部分功能，你还可以使用其他方法和配置来满足你的需求。详细的文档可以在axios的官方网站上找到。"}]},
  
])

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
