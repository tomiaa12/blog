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

# {{ $params.sourceLabel }} से {{ $params.targetLabel }} रूपांतरण

## {{ sourceQuery }} से {{ $params.targetLabel }} रूपांतरण

<p class="page-desc" style="display: none;"><strong>{{ $params.sourceLabel }}</strong> को <strong>{{ $params.targetLabel }}</strong> में मुफ्त में ऑनलाइन बैच रूपांतरित करें, कोई सॉफ्टवेयर इंस्टॉलेशन आवश्यक नहीं, सुरक्षित और तेज़</p>

<p class="page-desc"><strong>{{ sourceQuery }}</strong> को <strong>{{ $params.targetLabel }}</strong> में मुफ्त में ऑनलाइन बैच रूपांतरित करें, कोई सॉफ्टवेयर इंस्टॉलेशन आवश्यक नहीं, सुरक्षित और तेज़</p>

<Convert/>

### {{ sourceQuery || $params.sourceLabel }} फ़ॉर्मेट के बारे में

{{ $params.sourceDesc }}

### {{ $params.targetLabel }} फ़ॉर्मेट के बारे में

{{ $params.targetDesc }}
