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

# Convertir {{ $params.sourceLabel }} a {{ $params.targetLabel }}

## {{ sourceQuery }} a {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Convierte por lotes <strong>{{ $params.sourceLabel }}</strong> a <strong>{{ $params.targetLabel }}</strong> de forma gratuita en línea, sin necesidad de instalar software, de forma segura y rápida</p>

<p class="page-desc">Convierte por lotes <strong>{{ sourceQuery }}</strong> a <strong>{{ $params.targetLabel }}</strong> de forma gratuita en línea, sin necesidad de instalar software, de forma segura y rápida</p>

<Convert/>

### Acerca del formato {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Acerca del formato {{ $params.targetLabel }}

{{ $params.targetDesc }}
