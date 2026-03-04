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

# {{ $params.sourceLabel }} to {{ $params.targetLabel }}

## {{ sourceQuery }} to {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Free online batch convert <strong>{{ $params.sourceLabel }}</strong> to <strong>{{ $params.targetLabel }}</strong> format, no software installation required, safe and fast</p>

<p class="page-desc">Free online batch convert <strong>{{ sourceQuery }}</strong> to <strong>{{ $params.targetLabel }}</strong> format, no software installation required, safe and fast</p>

<Convert/>

### About {{ sourceQuery || $params.sourceLabel }} Format

{{ $params.sourceDesc }}

### About {{ $params.targetLabel }} Format

{{ $params.targetDesc }}
