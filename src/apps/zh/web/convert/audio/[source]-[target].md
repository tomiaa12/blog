---
layout: page
---

<script setup>
import { useData } from 'vitepress'

const { params } = useData()
</script>

<div class="audio-convert-page">

<div class="page-hero">

# {{ $params.sourceLabel }} 转 {{ $params.targetLabel }}

<p class="page-desc">免费在线将 <strong>{{ $params.sourceLabel }}</strong> 格式转换为 <strong>{{ $params.targetLabel }}</strong> 格式，无需安装软件，安全快速</p>

</div>

<div class="convert-card">

## 关于 {{ $params.sourceLabel }} 格式

{{ $params.sourceDesc }}

## 关于 {{ $params.targetLabel }} 格式

{{ $params.targetDesc }}

## 为什么要将 {{ $params.sourceLabel }} 转换为 {{ $params.targetLabel }}？

将 **{{ $params.sourceLabel }}** 转换为 **{{ $params.targetLabel }}** 是常见的音频处理需求。不同的使用场景对音频格式有不同的要求，例如：

- **兼容性**：某些设备或平台只支持特定的音频格式
- **文件大小**：有损格式（如 MP3、AAC）比无损格式（如 WAV、FLAC）体积更小，便于传输和存储
- **音质需求**：专业录音制作通常需要无损格式以保留完整的音频细节
- **流媒体播放**：不同的流媒体平台有各自支持的格式标准

## 如何使用在线工具转换？

1. 点击上方"选择文件"按钮，上传你的 {{ $params.sourceLabel }} 文件
2. 确认目标格式为 **{{ $params.targetLabel }}**
3. 点击"开始转换"等待转换完成
4. 下载转换好的 {{ $params.targetLabel }} 文件

> 所有文件在浏览器本地处理，不会上传到服务器，保护你的隐私安全。

</div>

</div>

<style scoped>
.audio-convert-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-hero {
  text-align: center;
  padding: 2.5rem 1rem 2rem;
}

.page-hero h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.page-desc {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  max-width: 560px;
  margin: 0 auto;
}

.convert-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem 2.5rem;
  margin-top: 1.5rem;
  background: var(--vp-c-bg-soft);
}

.convert-card h2 {
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.convert-card h2:first-child {
  margin-top: 0;
}
</style>
