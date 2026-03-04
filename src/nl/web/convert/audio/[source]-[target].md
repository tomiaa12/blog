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

# Converteer {{ $params.sourceLabel }} naar {{ $params.targetLabel }}

## {{ sourceQuery }} naar {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Gratis online batchconversie van <strong>{{ $params.sourceLabel }}</strong> naar <strong>{{ $params.targetLabel }}</strong>, geen softwareinstallatie vereist, veilig en snel</p>

<p class="page-desc">Gratis online batchconversie van <strong>{{ sourceQuery }}</strong> naar <strong>{{ $params.targetLabel }}</strong>, geen softwareinstallatie vereist, veilig en snel</p>

<Convert/>

### Over het formaat {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### Over het formaat {{ $params.targetLabel }}

{{ $params.targetDesc }}
