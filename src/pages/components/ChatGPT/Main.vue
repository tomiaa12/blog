<template>
  <main>
    <ol
      v-if="modelValue"
      :key="modelValue.time"
      class="answers"
      ref="olRef"
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
              :loading="item.loading"
              @end="item.loading = false"
            />
            <div
              class="content"
              v-html="item.content"
              v-else
            ></div>
          </div>
        </li>
      </template>
    </ol>
    <div
      v-else
      class="welcome"
    >
      <h1>GPT</h1>
      <div class="list">
        <ul v-for="item of tempSend">
          <h2>{{ item.title }}</h2>
          <li v-for="i of item.children">
            <el-button
              text
              bg
              @click="selectText(i.value)"
            >
              {{ i.label }}
            </el-button>
          </li>
        </ul>
      </div>
    </div>

    <div class="input-container">
      <el-input
        v-model="text"
        ref="inputRef"
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

    <el-button
      v-if="modelValue"
      class="scroll-to-end"
      circle
      icon="el-icon-bottom"
      @click="scrollToEnd"
    ></el-button>

    <component
      :is="!isMobile ? 'el-tooltip' : 'span'"
      effect="dark"
      :content="drawer ? '关闭侧边栏' : '打开侧边栏'"
      placement="right"
    >
      <el-button
        bg
        text
        class="close-aside"
        @click="emits('update:drawer', !drawer)"
      >
        <asideIcon />
      </el-button>
    </component>
  </main>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue"
import { Chat, Message } from "./type"
import { Props, Emits } from "./Main/props"

import sendSvg from "@/assets/svg/send.svg"
import chatGPT from "@/assets/svg/chatGPT.svg?url"
import asideIcon from "@/assets/svg/aside.svg"
import avatar from "@/assets/img/avatar.png"

import Text from "@/components/Text.vue"
import getMsg from "./Main/getMsg"
import { isMobile } from "@/utils"

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const text = ref<string>("")

const send = async (event: any) => {
  if (event.ctrlKey || event.altKey || event.shiftKey) {
    const inputElement = inputRef.value.$el.querySelector("textarea")
    // 获取光标位置
    const startPos = inputElement.selectionStart
    const endPos = inputElement.selectionEnd

    // 在光标位置插入换行符
    text.value =
      text.value.substring(0, startPos) + "\n" + text.value.substring(endPos)

    // 更新光标位置
    const newCursorPos = startPos + 1
    await nextTick(() => {
      inputElement.setSelectionRange(newCursorPos, newCursorPos)
    })
    return
  }
  if (!text.value.trim().length) return
  const system: Message = {
    role: "system",
    content: `现在时间:${Date.now()}`,
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
    content: text.value.replace(/(\n)(?![^`]*```)/g, "\n\n"),
  })

  const message = props.modelValue!.message.slice(-3)
  // 添加 system
  message[0] !== props.modelValue!.message[0] &&
    message.unshift(props.modelValue!.message[0])

  const msg = ref<Message>({
    role: "assistant",
    content: "",
    loading: true,
  })
  props.modelValue!.message.push(msg.value)

  emits("saveChats")

  const inputVal = text.value.trim()
  text.value = ""
  try {
    await getMsg({
      inputVal,
      msg,
      props,
      emits,
      message,
    })
  } catch {
    msg.value.error = true
  } finally {
    msg.value.loading = false
    emits("saveChats")
  }
}

const inputRef = ref()

const selectText = (value: string) => {
  text.value = value
  inputRef.value.focus()
}

const olRef = ref()

const scrollToEnd = async () => {
  await nextTick()
  olRef.value?.scrollTo({
    top: olRef.value.scrollHeight,
    behavior: "smooth",
  })
}
watch(
  [() => props.modelValue?.time, () => props.modelValue?.message.length],
  scrollToEnd
)

const tempSend = [
  {
    title: "",
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
]
</script>
<style lang="scss" scoped>
main {
  position: relative;
  flex: 1;
}

.gpt-text{
  margin-left: 1em;
}

.close-aside {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 46px;
  height: 44px;
  font-size: 18px;
  z-index: 1;
  box-shadow: var(--el-box-shadow-light);
}

.scroll-to-end {
  position: absolute;
  left: 1em;
  bottom: 9em;
}

.input-container {
  width: 100%;
  position: absolute;
  bottom: 50px;
  max-width: 760px;
  left: 50.5%;
  transform: translateX(-50%);
  z-index: 1;
  padding: 0 1em;
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
    right: 2em;
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
  max-width: 100vw;
  height: 100%;
  overflow: auto;
  padding-bottom: 200px;
  h1 {
    text-align: center;
  }
  h4{
    text-align: center;
    color: var(--vp-c-text-3);
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
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 99%;

  h2 {
    border: none;
    font-size: 18px;
    text-align: center;
    margin-top: 0;
  }

  ul {
    margin-right: 1em;
    max-width: 50%;
    li {
      margin-bottom: 1em;
      .el-button {
        word-break: break-all;
        white-space: normal;
        width: auto;
        max-width: 230px;
        min-width: 100%;
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
  overflow: auto;
  height: 100%;
  padding-bottom: 150px;
  overflow: auto;

  li {
    border-bottom: 1px solid var(--el-border-color-light);
    margin: 0;
    max-width: 100vw;
    &.assistant {
      background-color: var(--el-color-info-light-8);
    }

    > div {
      max-width: 768px;
      margin: 0 auto;
      padding: 24px 0;

      .el-avatar {
        background-color: var(--el-color-white);
        float: left;
        margin: 0 1em;
      }

      .content {
        margin: 0 1em;
      }
    }
  }
}
</style>
