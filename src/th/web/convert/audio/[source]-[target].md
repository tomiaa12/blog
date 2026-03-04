---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero audio-convert-page
---

<style lang="scss">
  @use '@/style/widescreen.scss';
  .audio-convert-page h1 { display: none; }
  .audio-convert-page h2 { text-align: center; }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import Convert from '@/zh/web/convert/audio/Convert/index.vue'

const { params } = useData()

const sourceQuery = ref('')
onMounted(() => {
  const search = new URLSearchParams(window.location.search)
  sourceQuery.value = search.get('source') ?? ''
})
</script>

# แปลง {{ $params.sourceLabel }} เป็น {{ $params.targetLabel }}

## {{ sourceQuery }} เป็น {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">แปลงไฟล์ <strong>{{ $params.sourceLabel }}</strong> เป็น <strong>{{ $params.targetLabel }}</strong> แบบกลุ่มออนไลน์ฟรี ไม่ต้องติดตั้งซอฟต์แวร์ ปลอดภัยและรวดเร็ว</p>

<p class="page-desc">แปลงไฟล์ <strong>{{ sourceQuery }}</strong> เป็น <strong>{{ $params.targetLabel }}</strong> แบบกลุ่มออนไลน์ฟรี ไม่ต้องติดตั้งซอฟต์แวร์ ปลอดภัยและรวดเร็ว</p>

<Convert/>

### เกี่ยวกับรูปแบบ {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### เกี่ยวกับรูปแบบ {{ $params.targetLabel }}

{{ $params.targetDesc }}
