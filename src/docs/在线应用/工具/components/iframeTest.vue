<template>
  <div class="iframe-test-container">
    <div class="input-section">
      <el-input
        v-model="url"
        placeholder="请输入网址，例如: https://bilibili.com/"
        size="large"
        clearable
        @keyup.enter="loadUrl"
      >
        <template #prepend>
          <el-icon><el-icon-link /></el-icon>
        </template>
      </el-input>
      <el-button
        type="primary"
        size="large"
        @click="loadUrl"
        :disabled="!url"
        class="load-btn"
      >
        加载
      </el-button>
    </div>

    <div class="tips" v-if="!iframeUrl">
      <el-icon class="icon-globe"><el-icon-monitor /></el-icon>
      <div class="tips-text">请输入网址并点击加载按钮</div>
    </div>

    <div class="iframe-wrapper" v-if="iframeUrl">
      <iframe
        :key="iframeUrl"
        :src="iframeUrl"
        frameborder="0"
        class="preview-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"

const url = ref("https://bilibili.com/")
const iframeUrl = ref("")

const loadUrl = () => {
  if (!url.value) {
    ElMessage.warning("请输入网址")
    return
  }

  let finalUrl = url.value.trim()

  // 如果没有协议前缀，自动添加 https://
  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    finalUrl = "https://" + finalUrl
    url.value = finalUrl
  }

  // 验证URL格式
  try {
    new URL(finalUrl)
    iframeUrl.value = finalUrl
    ElMessage.success("开始加载网站")
  } catch (error) {
    ElMessage.error("网址格式不正确，请检查后重试")
  }
}
</script>

<style lang="scss" scoped>
.iframe-test-container {
  width: 100%;
  margin-top: 20px;
}

.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .el-input {
    flex: 1;
  }

  .load-btn {
    min-width: 100px;
  }
}

.tips {
  text-align: center;
  padding: 60px 20px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 2px dashed var(--el-border-color);

  .icon-globe {
    font-size: 80px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
  }

  .tips-text {
    color: var(--el-text-color-regular);
    font-size: 16px;
  }
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  background: white;

  .preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;

    .load-btn {
      width: 100%;
    }
  }

  .iframe-wrapper {
    height: 400px;
  }
}
</style>

