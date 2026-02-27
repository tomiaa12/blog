---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

<script setup>
import { useData } from 'vitepress'
import Convert from '@/zh/web/convert/audio/Convert/index.vue'

const { params } = useData()
</script>

# Chuyển đổi {{ $params.sourceLabel }} sang {{ $params.targetLabel }}

<p class="page-desc">Chuyển đổi hàng loạt <strong>{{ $params.sourceLabel }}</strong> sang <strong>{{ $params.targetLabel }}</strong> trực tuyến miễn phí, không cần cài đặt phần mềm, an toàn và nhanh chóng</p>

<Convert/>

### Về định dạng {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Về định dạng {{ $params.targetLabel }}

{{ $params.targetDesc }}
