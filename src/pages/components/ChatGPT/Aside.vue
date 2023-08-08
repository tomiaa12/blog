<template>
  <aside>
    <div class="new-chat">
      <el-button
        text
        icon="el-icon-plus"
        @click="add"
      >
        新对话
      </el-button>
    </div>
    <time>今天</time>
    <ol>
      <li class="active">
        <el-icon><el-icon-chatSquare /></el-icon>
        <!-- <p class="ellipsis">ChatGpt 接收ChatGpt 接收ChatGpt 接收ChatGpt 接收</p> -->
        <el-input size="small"></el-input>

        <div class="control">
          <!-- <el-icon><el-icon-edit-pen /></el-icon>
          <el-icon><el-icon-delete /></el-icon> -->
          <el-icon><el-icon-select /></el-icon>
          <el-icon><el-icon-close-bold /></el-icon>
        </div>
      </li>
      <li>
        <el-icon><el-icon-chatSquare /></el-icon>
        <p>ChatGpt 接收</p>
      </li>
    </ol>
  </aside>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { ref } from "vue"
// const props = defineProps({})
const emits = defineEmits([])

const add = () => {}
</script>
<style lang="scss" scoped>
aside {
  width: 240px;
  height: 100%;
  background-color: #202123;
  padding: 8px;
  color: white;
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
    }

    .el-input {
      --el-input-bg-color: transparent;
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
