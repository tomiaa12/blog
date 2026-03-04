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

# Konwertuj {{ $params.sourceLabel }} do {{ $params.targetLabel }}

## {{ sourceQuery }} do {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Bezpłatna konwersja wsadowa online z <strong>{{ $params.sourceLabel }}</strong> do <strong>{{ $params.targetLabel }}</strong>, bez instalacji oprogramowania, bezpiecznie i szybko</p>

<p class="page-desc">Bezpłatna konwersja wsadowa online z <strong>{{ sourceQuery }}</strong> do <strong>{{ $params.targetLabel }}</strong>, bez instalacji oprogramowania, bezpiecznie i szybko</p>

<Convert/>

### O formacie {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### O formacie {{ $params.targetLabel }}

{{ $params.targetDesc }}
