<template>
  <p></p>
  <div
    class="container"
    :class="isDragOver && 'is-dragover'"
    @dragover.prevent
    @drop.prevent="drag"
  >
    <el-input
      v-model="text"
      placeholder=""
      type="textarea"
      rows="8"
    >
    </el-input>
    <div
      class="tips"
      v-show="!text"
    >
      <el-icon class="el-icon--upload"><el-icon-upload-filled /></el-icon>
      <div class="el-upload__text">输入文本或拖拽文件到此</div>
    </div>
  </div>
  <div class="btns">
    <el-button
      bg
      text
      size="large"
      :disabled="!text"
      @click="encode"
    >
      编码
    </el-button>
    <el-button
      bg
      text
      size="large"
      :disabled="!text"
      @click="decode"
    >
      解码
    </el-button>
    <el-button
      bg
      text
      size="large"
      @click="answer = text = ''"
    >
      清空
    </el-button>
    <el-button
      bg
      text
      size="large"
      :disabled="!answer"
      @click="copy"
    >
      复制结果
    </el-button>

    <el-button
      bg
      text
      size="large"
      :disabled="!text"
      @click="save"
    >
      解码保存文件
    </el-button>
    <el-input
      class="filename"
      v-model="filename"
      placeholder="文件名"
      clearable
      size="large"
    ></el-input>
  </div>

  <el-input
    v-model="answer"
    placeholder="结果区域"
    type="textarea"
    rows="8"
  >
  </el-input>
</template>

<script setup lang="ts">
import { ref } from "vue"
import {
  base64Decode,
  base64Encode,
  file2Base64,
  saveBase64ToFile,
  getBase64MimeType,
  mimeToExt
} from '@tomiaa/utils'

import { copyToClipboard } from "@/utils"
import { ElMessage } from "element-plus"

const answer = ref()
const text = ref()
const filename = ref()
const isDragOver = ref(false)

const drag = async (e: DragEvent) => {
  const file = e.dataTransfer!.files[0]
  const data = await file2Base64(file)
  answer.value = data
  copy()
}

const encode = async () => {
  try {
    answer.value = await base64Encode(text.value)
    copy()
  } catch {
    answer.value = "出错了，请检查输入文本"
  }
}
const decode = async () => {
  try {
    answer.value = await base64Decode(text.value)
    copy()
  } catch {
    answer.value = "出错了，请检查输入文本"
  }
}

const copy = async () => {
  await copyToClipboard(answer.value)
  ElMessage.success("复制结果成功")
}

const save = () => {
  const mimetype = getBase64MimeType(text.value)!
  try{
    if(filename.value) {
      saveBase64ToFile(text.value, filename.value)
    }else{
      const ext = mimeToExt(mimetype)
      if(!ext) return ElMessage.error('没有识别到文件类型，请手动输入文件名')
      saveBase64ToFile(text.value, `解码文件${Date.now()}${ext}`)
    }
  }catch{
    answer.value = `出错了，请检查输入文本，文件的编码参考以下格式：

data:[mime类型];base64,编码，例如：

data:text/plain;base64,5L2g5Zyo6LWj56We6a2U

没有【data:[mime类型];base64,】时要手动填写文件名`
  }
  console.log()
}
</script>

<style lang="scss" scoped>
.el-textarea {
  position: relative;
  z-index: 1;
  :deep().el-textarea__inner {
    border: 1px dashed var(--el-border-color);
    box-shadow: none;
    background: transparent;
  }

  &.is-dragover {
    :deep().el-textarea__inner {
      border: 2px px dashed var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}
.container {
  position: relative;
  .tips {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.6;
  }
  .el-icon--upload {
    font-size: 67px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
    line-height: 50px;
    display: block;
    margin: auto;
  }
  .el-upload__text {
    color: var(--el-text-color-regular);
    font-size: 14px;
    text-align: center;
  }
}

.el-button {
  margin-top: 18px;
  margin-bottom: 18px;
}

.filename {
  width: unset;
  margin-left: 12px;
}
</style>
