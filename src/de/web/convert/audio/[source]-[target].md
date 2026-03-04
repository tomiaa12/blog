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

# {{ $params.sourceLabel }} in {{ $params.targetLabel }} konvertieren

## {{ sourceQuery }} in {{ $params.targetLabel }} konvertieren

<p class="page-desc" style="display: none;">Kostenlose Online-Batch-Konvertierung von <strong>{{ $params.sourceLabel }}</strong> in <strong>{{ $params.targetLabel }}</strong>, keine Softwareinstallation erforderlich, sicher und schnell</p>

<p class="page-desc">Kostenlose Online-Batch-Konvertierung von <strong>{{ sourceQuery }}</strong> in <strong>{{ $params.targetLabel }}</strong>, keine Softwareinstallation erforderlich, sicher und schnell</p>

<Convert/>

### Über das Format {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Über das Format {{ $params.targetLabel }}

{{ $params.targetDesc }}
