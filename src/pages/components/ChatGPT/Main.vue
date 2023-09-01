<template>
  <main>
    <ol
      v-if="modelValue"
      class="answers"
    >
      <template v-for="item of modelValue.message">
        <li
          v-if="item.role !== 'system'"
          :class="item.role"
        >
          <div>
            <el-avatar
              :src="item.role === 'assistant' ? chatGPT : avatar"
              shape="square"
              :size="24"
            />
            <Text
              v-if="item.role === 'assistant'"
              :text="item.content"
              :error="item.error"
              loading
            />
            <div
              class="content"
              v-else
            >
              {{ item.content }}
            </div>
          </div>
        </li>
      </template>
    </ol>
    <div
      v-else
      class="welcome"
    >
      <h1>ChatGPT</h1>
      <div class="list">
        <ul v-for="item of tempSend">
          <h2>{{ item.title }}</h2>
          <li v-for="i of item.children">
            <el-button
              text
              bg
              @click="text = i.value"
            >
              {{ i.label }}
            </el-button>
          </li>
        </ul>
      </div>
    </div>

    <div class="input-container backdrop-filter">
      <el-input
        v-model="text"
        type="textarea"
        resize="none"
        :autosize="{ minRows: 1, maxRows: 8 }"
        placeholder="发送一个消息"
        @keydown.enter.prevent="send"
      ></el-input>
      <el-button
        type="primary"
        :icon="sendSvg"
        :disabled="!text"
        @click="send"
      ></el-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { ref, nextTick } from "vue"
import { OpenAIStream } from "./Main/openAIStream"

import sendSvg from "@/assets/svg/send.svg"
import chatGPT from "@/assets/svg/chatGPT.svg?url"
import { Chat, Message } from "./type"
import avatar from "@/assets/img/avatar.png"

import Text from "./Main/Text.vue"

const props = defineProps({
  chats: {
    type: Array as PropType<Chat[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<Chat | undefined>,
    required: true,
  },
  currentModel: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(["update:modelValue", "saveChats"])

const text = ref<string>("")

const send = async () => {
  const system: Message = {
    role: "system",
    content: `用中文回答的精简一些，现在时间:${Date.now()}`,
  }

  // 开启新对话
  if (!props.modelValue) {
    const temp: Chat = {
      model: props.currentModel,
      time: Date.now(),
      title: text.value.slice(0, 15),
      message: [system],
    }
    props.chats.unshift(temp)
    emits("update:modelValue", temp)
    await nextTick()
  }

  props.modelValue?.message.push({
    role: "user",
    content: text.value,
  })

  text.value = ""
  const message = props.modelValue!.message.slice(-3)
  // 添加 system
  message[0] !== props.modelValue!.message[0] &&
    message.unshift(props.modelValue!.message[0])

  const msg = ref<Message>({
    role: "assistant",
    content: "",
  })
  props.modelValue!.message.push(msg.value)

  emits("saveChats")

  /* 数据流 */
  try{
    const stream = await OpenAIStream(
      "https://kuangyx.cn/api/openai",
      message,
      "",
      props.modelValue!.model
    )
  
    const reader = stream.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        emits("saveChats")
        break
      }
      msg.value.content += value
    }
  }catch{
    msg.value.error = true
    emits("saveChats")
  }
  /* 数据流 --- end */
}

const tempSend = [
  {
    title: "场景",
    children: [
      {
        label: '"舔狗日记" →',
        value: "舔狗日记",
      },
      {
        label: '"网易云热评" →',
        value: "网易云热评",
      },
      {
        label: '"彩虹屁" →',
        value: "彩虹屁",
      },
      {
        label: '"毒鸡汤" →',
        value: "毒鸡汤",
      },
      {
        label: '"一句" →',
        value: "一句",
      },
      {
        label: '"一言" →',
        value: "一言",
      },
    ],
  },
  {
    title: "提问",
    children: [
      {
        label: '"用简单的术语解释一下量子计算" →',
        value: "用简单的术语解释一下量子计算",
      },
      {
        label: '"使用axios发送http请求" →',
        value: "使用axios发送http请求",
      },
      {
        label: '"鲁迅与周树人是什么关系？" →',
        value: "鲁迅与周树人是什么关系？",
      },
    ],
  },
  {
    title: "猜一猜（游戏）",
    children: [
      {
        label: '"猜奥特曼" →',
        value: "猜奥特曼",
      },
    ],
  },
]
</script>
<style lang="scss" scoped>
main {
  position: relative;
  flex: 1;
}

.input-container {
  width: 100%;
  position: absolute;
  bottom: 50px;
  max-width: 760px;
  left: 50.5%;
  transform: translateX(-50%);
  z-index: 1;

  .el-textarea {
    --el-input-border-radius: 12px;
    --el-input-bg-color: transparent;
    --el-input-text-color: var(--el-color-black);
    box-shadow: var(--el-box-shadow-light);
    border-radius: var(--el-input-border-radius);

    :deep().el-textarea__inner {
      min-height: 60px !important;
      padding: 16px 48px 16px 16px;
      line-height: 28px;
      background: var(--el-bg-color);
    }
  }

  .el-button {
    --el-button-disabled-bg-color: transparent;
    --el-button-disabled-border-color: transparent;
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 8px;

    :deep()svg:hover {
      color: inherit;
    }

    &.is-disabled {
      color: var(--el-color-info-light-5);
    }
  }
}

.welcome {
  margin: 70px auto 0;
  max-width: 720px;

  h1 {
    text-align: center;
  }

  .el-button {
    --el-button-text-color: var(--el-text-color-primary);
    font-size: 20px;
    padding: 1em;
  }
}

ul,
ol,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list {
  display: flex;
  justify-content: center;

  h2 {
    border: none;
    font-size: 18px;
    text-align: center;
  }

  ul {
    margin-right: 1em;

    li {
      margin-bottom: 1em;

      .el-button {
        word-break: break-all;
        white-space: wrap;
        width: 100%;
        max-width: 230px;
        margin-left: 0;
        line-height: 1.2;
        height: auto;
        padding: 12px;
        font-size: 14px;
      }
    }
  }
}

.answers {
  overflow-y: auto;
  height: 100%;
  padding-bottom: 150px;
  li {
    border-bottom: 1px solid var(--el-border-color-light);
    margin: 0;

    &.assistant {
      background-color: var(--el-color-info-light-9);
    }

    > div {
      display: flex;
      max-width: 768px;
      margin: 0 auto;
      padding: 24px 0;

      .el-avatar {
        background-color: var(--el-color-white);
        flex-shrink: 0;
      }

      .content {
        margin: 0 1em;
      }
    }
  }
}
</style>
