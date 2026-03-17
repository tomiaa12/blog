<script setup lang="ts">
import ServiceOfflineNotice from "@/components/ServiceOfflineNotice.vue"
import jsQuestion from "./components/jsQuestion.vue"
</script>

<ClientOnly>
  <ServiceOfflineNotice />
  <jsQuestion />
</ClientOnly>
