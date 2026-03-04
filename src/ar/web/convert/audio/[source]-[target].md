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

# تحويل {{ $params.sourceLabel }} إلى {{ $params.targetLabel }}

## {{ sourceQuery }} إلى {{ $params.targetLabel }}

<p class="page-desc" style="display: none;">حوّل <strong>{{ $params.sourceLabel }}</strong> إلى <strong>{{ $params.targetLabel }}</strong> مجانًا عبر الإنترنت دفعةً واحدة، لا يتطلب تثبيت أي برنامج، آمن وسريع</p>

<p class="page-desc">حوّل <strong>{{ sourceQuery }}</strong> إلى <strong>{{ $params.targetLabel }}</strong> مجانًا عبر الإنترنت دفعةً واحدة، لا يتطلب تثبيت أي برنامج، آمن وسريع</p>

<Convert/>

### حول تنسيق {{ sourceQuery || $params.sourceLabel }}

{{ $params.sourceDesc }}

### حول تنسيق {{ $params.targetLabel }}

{{ $params.targetDesc }}
