<template>
  <aside>
    <div class="new-chat">
      <el-button
        text
        icon="el-icon-plus"
        @click="emits('update:modelValue')"
      >
        新对话
      </el-button>
      <el-popconfirm title="删除全部对话?" @confirm="emits('delAll')">
        <template #reference>
          <el-button
            class="del-all"
            icon="el-icon-delete"
            text
          ></el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="list">
      <template v-for="(item, index) of chats">
        <time v-if="showTime(item.time, chats[index - 1]?.time) || index == 0">
          {{ formatYmd(item.time) }}
        </time>
        <ol>
          <li
            :class="item === modelValue ? 'active' : ''"
            @click="emits('update:modelValue', item)"
          >
            <el-icon><el-icon-chatSquare /></el-icon>
            <el-input
              v-if="item.isEditing"
              v-model="item.cacheTitle"
              size="small"
              autofocus
              @click.stop
              @keydown.enter="enter(item)"
            />
            <p
              v-else
              class="ellipsis"
              :title="item.title"
            >
              {{ item.title }}
            </p>

            <div
              class="control"
              @click.stop
            >
              <template v-if="item.isEditing">
                <el-icon><el-icon-select @click="enter(item)" /></el-icon>
                <el-icon
                  ><el-icon-close-bold @click="item.isEditing = false"
                /></el-icon>
              </template>
              <template v-else>
                <el-icon>
                  <el-icon-edit-pen @click="edit(item)" />
                </el-icon>
                <el-icon><el-icon-delete @click="del(index)" /></el-icon>
              </template>
            </div>
          </li>
        </ol>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { Chat } from "./type"

const props = defineProps({
  chats: {
    type: Array as PropType<Chat[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<Chat | undefined>,
  },
})
const emits = defineEmits(["update:modelValue", "saveChats", 'delAll'])

const del = (index: number) => {
  if (props.modelValue === props.chats[index]) emits("update:modelValue")
  props.chats.splice(index, 1)
  emits("saveChats")
}

const edit = (chat: Chat) => {
  chat.cacheTitle = chat.title
  chat.isEditing = true
}

const enter = (chat: Chat) => {
  chat.title = chat.cacheTitle
  chat.isEditing = false
  delete chat.cacheTitle
  emits("saveChats")
}

const showTime = (cur: number, prev: number) =>
  new Date(cur).getDate() - new Date(prev).getDate()

const formatYmd = (time: number) => {
  const y = new Date(time).getFullYear()
  const m = String(new Date(time).getMonth() + 1).padStart(2, "0")
  const d = String(new Date(time).getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
</script>
<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;
  background-color: #202123;
  padding: 8px 0;
  color: white;
  .list {
    flex: 1;
    overflow: auto;
    padding: 0 8px;
    &::-webkit-scrollbar-thumb {
      background-color: var(--el-color-info);
    }
  }

  .new-chat {
    display: flex;
    padding: 0 0.4em;
    .del-all {
      flex: 0;
    }
  }
  .el-button {
    --el-button-text-color: inherit;
    width: 192px;
    height: 44px;
    border: 1px solid #555659;
    justify-content: start;

    &.is-text:not(.is-disabled):hover,
    &.is-text:not(.is-disabled):focus,
    &.is-text:not(.is-disabled):active {
      background-color: hsla(240, 9%, 59%, 0.1);
    }
  }

  time {
    font-size: 12px;
    color: var(--el-color-info-light-9);
    display: block;
    padding: 10px 10px 4px;
  }

  li {
    height: 44px;
    display: flex;
    align-items: center;
    padding: 12px;
    cursor: pointer;
    transition: var(--el-transition-all);
    border-radius: var(--el-border-radius-base);

    &:hover {
      background-color: rgba(42, 43, 50);
      .control {
        opacity: 1;
        width: auto;
      }
    }

    &.active {
      background-color: rgba(52, 53, 65);
    }

    p {
      flex: 1;
    }

    .control {
      margin-left: 0.5em;
      display: flex;
      justify-content: center;
      opacity: 0;
      width: 0;
      overflow: hidden;
      transition: var(--el-transition-all);
    }

    .el-input {
      --el-input-bg-color: transparent;
      --el-input-text-color: var(--el-color-white);
    }
  }

  .el-icon {
    margin-right: 0.5em;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

ol,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.vp-doc li + li {
  margin: 0;
}
</style>
