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

# Konversi {{ $params.sourceLabel }} ke {{ $params.targetLabel }}

## {{ sourceQuery }} ke {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Konversi batch <strong>{{ $params.sourceLabel }}</strong> ke <strong>{{ $params.targetLabel }}</strong> secara online gratis, tidak perlu menginstal perangkat lunak, aman dan cepat</p>

<p class="page-desc">Konversi batch <strong>{{ sourceQuery }}</strong> ke <strong>{{ $params.targetLabel }}</strong> secara online gratis, tidak perlu menginstal perangkat lunak, aman dan cepat</p>

<Convert/>

### Tentang format {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Tentang format {{ $params.targetLabel }}

{{ $params.targetDesc }}
