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

# تحويل {{ $params.sourceLabel }} إلى {{ $params.targetLabel }}

<p class="page-desc">حوّل <strong>{{ $params.sourceLabel }}</strong> إلى <strong>{{ $params.targetLabel }}</strong> مجانًا عبر الإنترنت دفعةً واحدة، لا يتطلب تثبيت أي برنامج، آمن وسريع</p>

<Convert/>

### حول تنسيق {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### حول تنسيق {{ $params.targetLabel }}

{{ $params.targetDesc }}
