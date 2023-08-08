<template>
  <div class="chatGPT-container">
    <Aside />
    <Main />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import Aside from "./ChatGPT/Aside.vue"
import Main from "./ChatGPT/Main.vue"
</script>
<style lang="scss">
.chatGPT-container {
  height: calc(100vh - var(--vp-nav-height));
  display: flex;
}

.Layout.chatGPT {
  .container,
  .content,
  .content-container {
    max-width: unset !important;
  }
  .VPDocFooter,
  .VPDocFooter + .vp-doc {
    padding-left: 20px;
  }
  .VPDoc {
    position: relative;
    padding: 0;
    .content {
      padding: 0;
    }
  }
  .page_pv {
    position: absolute;
    top: 0;
    right: 64px;
    z-index: 1;
  }
}
</style>
