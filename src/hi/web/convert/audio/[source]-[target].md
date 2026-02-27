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

# {{ $params.sourceLabel }} से {{ $params.targetLabel }} रूपांतरण

<p class="page-desc"><strong>{{ $params.sourceLabel }}</strong> को <strong>{{ $params.targetLabel }}</strong> में मुफ्त में ऑनलाइन बैच रूपांतरित करें, कोई सॉफ्टवेयर इंस्टॉलेशन आवश्यक नहीं, सुरक्षित और तेज़</p>

<Convert/>

### {{ $params.sourceLabel }} फ़ॉर्मेट के बारे में

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} फ़ॉर्मेट के बारे में

{{ $params.targetDesc }}
