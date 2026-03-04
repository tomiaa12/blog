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

# Converti {{ $params.sourceLabel }} in {{ $params.targetLabel }}

## {{ sourceQuery }} in {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Converti in batch <strong>{{ $params.sourceLabel }}</strong> in <strong>{{ $params.targetLabel }}</strong> online gratuitamente, senza installare software, sicuro e veloce</p>

<p class="page-desc">Converti in batch <strong>{{ sourceQuery }}</strong> in <strong>{{ $params.targetLabel }}</strong> online gratuitamente, senza installare software, sicuro e veloce</p>

<Convert/>

### Informazioni sul formato {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Informazioni sul formato {{ $params.targetLabel }}

{{ $params.targetDesc }}
