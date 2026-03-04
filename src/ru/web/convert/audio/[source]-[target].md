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

# Конвертировать {{ $params.sourceLabel }} в {{ $params.targetLabel }}

## {{ sourceQuery }} в {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Бесплатно конвертируйте пакетно <strong>{{ $params.sourceLabel }}</strong> в <strong>{{ $params.targetLabel }}</strong> онлайн, без установки программ, безопасно и быстро</p>

<p class="page-desc">Бесплатно конвертируйте пакетно <strong>{{ sourceQuery }}</strong> в <strong>{{ $params.targetLabel }}</strong> онлайн, без установки программ, безопасно и быстро</p>

<Convert/>

### О формате {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### О формате {{ $params.targetLabel }}

{{ $params.targetDesc }}
