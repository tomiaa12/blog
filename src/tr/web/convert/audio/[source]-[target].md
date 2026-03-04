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

# {{ $params.sourceLabel }} to {{ $params.targetLabel }} Dönüştürücü

## {{ sourceQuery }} to {{ $params.targetLabel }} Dönüştürücü

<p class="page-desc" style="display: none;"><strong>{{ $params.sourceLabel }}</strong> dosyalarını <strong>{{ $params.targetLabel }}</strong> formatına ücretsiz çevrimiçi toplu dönüştürme, yazılım kurulumu gerekmez, güvenli ve hızlı</p>

<p class="page-desc"><strong>{{ sourceQuery }}</strong> dosyalarını <strong>{{ $params.targetLabel }}</strong> formatına ücretsiz çevrimiçi toplu dönüştürme, yazılım kurulumu gerekmez, güvenli ve hızlı</p>

<Convert/>

### {{ sourceQuery || $params.sourceLabel }} Formatı Hakkında

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} Formatı Hakkında

{{ $params.targetDesc }}
