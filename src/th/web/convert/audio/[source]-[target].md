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

# แปลง {{ $params.sourceLabel }} เป็น {{ $params.targetLabel }}

<p class="page-desc">แปลงไฟล์ <strong>{{ $params.sourceLabel }}</strong> เป็น <strong>{{ $params.targetLabel }}</strong> แบบกลุ่มออนไลน์ฟรี ไม่ต้องติดตั้งซอฟต์แวร์ ปลอดภัยและรวดเร็ว</p>

<Convert/>

### เกี่ยวกับรูปแบบ {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### เกี่ยวกับรูปแบบ {{ $params.targetLabel }}

{{ $params.targetDesc }}
