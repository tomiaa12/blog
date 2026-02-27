---
footer: false
editLink: false
aside: false
sidebar: false
pageClass: widescreen page-hero
---

<style lang="scss">
  @use '@/style/widescreen.scss'
</style>

<script setup>
import { useData } from 'vitepress'
import Convert from '@/zh/web/convert/audio/Convert/index.vue'

const { params } = useData()
</script>

# Converteer {{ $params.sourceLabel }} naar {{ $params.targetLabel }}

<p class="page-desc">Gratis online batchconversie van <strong>{{ $params.sourceLabel }}</strong> naar <strong>{{ $params.targetLabel }}</strong>, geen softwareinstallatie vereist, veilig en snel</p>

<Convert/>

### Over het formaat {{ $params.sourceLabel }}

{{ $params.sourceDesc }}

### Over het formaat {{ $params.targetLabel }}

{{ $params.targetDesc }}
