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

# Converter {{ $params.sourceLabel }} para {{ $params.targetLabel }}

## {{ sourceQuery }} para {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Converta em lote <strong>{{ $params.sourceLabel }}</strong> para <strong>{{ $params.targetLabel }}</strong> online gratuitamente, sem necessidade de instalar software, seguro e rápido</p>

<p class="page-desc">Converta em lote <strong>{{ sourceQuery }}</strong> para <strong>{{ $params.targetLabel }}</strong> online gratuitamente, sem necessidade de instalar software, seguro e rápido</p>

<Convert/>

### Sobre o formato {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Sobre o formato {{ $params.targetLabel }}

{{ $params.targetDesc }}
