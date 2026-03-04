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

# Konvertera {{ $params.sourceLabel }} till {{ $params.targetLabel }}

## {{ sourceQuery }} till {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Gratis batchkonvertering online av <strong>{{ $params.sourceLabel }}</strong> till <strong>{{ $params.targetLabel }}</strong>, ingen programvaruinstallation krävs, säkert och snabbt</p>

<p class="page-desc">Gratis batchkonvertering online av <strong>{{ sourceQuery }}</strong> till <strong>{{ $params.targetLabel }}</strong>, ingen programvaruinstallation krävs, säkert och snabbt</p>

<Convert/>

### Om formatet {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Om formatet {{ $params.targetLabel }}

{{ $params.targetDesc }}
