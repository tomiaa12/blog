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

# Chuyển đổi {{ $params.sourceLabel }} sang {{ $params.targetLabel }}

## {{ sourceQuery }} sang {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Chuyển đổi hàng loạt <strong>{{ $params.sourceLabel }}</strong> sang <strong>{{ $params.targetLabel }}</strong> trực tuyến miễn phí, không cần cài đặt phần mềm, an toàn và nhanh chóng</p>

<p class="page-desc">Chuyển đổi hàng loạt <strong>{{ sourceQuery }}</strong> sang <strong>{{ $params.targetLabel }}</strong> trực tuyến miễn phí, không cần cài đặt phần mềm, an toàn và nhanh chóng</p>

<Convert/>

### Về định dạng {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Về định dạng {{ $params.targetLabel }}

{{ $params.targetDesc }}
