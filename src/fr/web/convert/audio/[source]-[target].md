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

# Convertir {{ $params.sourceLabel }} en {{ $params.targetLabel }}

## {{ sourceQuery }} en {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">Conversion par lots gratuite en ligne de <strong>{{ $params.sourceLabel }}</strong> en <strong>{{ $params.targetLabel }}</strong>, aucune installation de logiciel requise, sécurisé et rapide</p>

<p class="page-desc">Conversion par lots gratuite en ligne de <strong>{{ sourceQuery }}</strong> en <strong>{{ $params.targetLabel }}</strong>, aucune installation de logiciel requise, sécurisé et rapide</p>

<Convert/>

### À propos du format {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### À propos du format {{ $params.targetLabel }}

{{ $params.targetDesc }}
