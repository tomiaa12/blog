<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  tsLabel?: string
  goLabel?: string
}>()
</script>

<template>
  <section class="syntax-compare">
    <div class="syntax-compare__header">
      <h3 :id="title">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>

    <div class="syntax-compare__grid">
      <div class="syntax-compare__panel">
        <div class="syntax-compare__label">{{ tsLabel ?? "TypeScript" }}</div>
        <slot name="ts" />
      </div>

      <div class="syntax-compare__panel">
        <div class="syntax-compare__label">{{ goLabel ?? "Go" }}</div>
        <slot name="go" />
      </div>
    </div>

    <div v-if="$slots.notes" class="syntax-compare__notes">
      <slot name="notes" />
    </div>
  </section>
</template>

<style scoped>
.syntax-compare {
  margin: 32px 0;
}

.syntax-compare__header h3 {
  margin-top: 0;
}

.syntax-compare__header p {
  margin: 8px 0 16px;
  color: var(--vp-c-text-2);
}

.syntax-compare__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.syntax-compare__panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-code-block-bg);
  overflow: hidden;
}

.syntax-compare__label {
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
}

.syntax-compare__panel :deep(.language-ts),
.syntax-compare__panel :deep(.language-go) {
  flex: 1;
  margin: 0;
  border-radius: 0;
}

.syntax-compare__panel :deep(pre) {
  height: 100%;
}

.syntax-compare__notes {
  margin-top: 12px;
  padding: 12px 16px;
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.syntax-compare__notes :deep(ul) {
  margin: 0;
}

@media (max-width: 768px) {
  .syntax-compare__grid {
    grid-template-columns: 1fr;
  }
}
</style>
