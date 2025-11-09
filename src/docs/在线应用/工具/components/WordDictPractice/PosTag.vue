<template>
  <el-tooltip
    :content="posDescription"
    placement="top"
    effect="dark"
    :show-after="200"
  >
    <span
      class="pos-tag"
      @click.stop
    >
      <slot>{{ pos }}</slot>
    </span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  pos?: string
}>()

// 词性映射表
const posMap: Record<string, string> = {
  'adj.': '形容词 (Adjective)',
  'adj': '形容词 (Adjective)',
  'adjective': '形容词 (Adjective)',
  'n.': '名词 (Noun)',
  'n': '名词 (Noun)',
  'noun': '名词 (Noun)',
  'v.': '动词 (Verb)',
  'v': '动词 (Verb)',
  'verb': '动词 (Verb)',
  'vi.': '不及物动词 (Intransitive Verb)',
  'vi': '不及物动词 (Intransitive Verb)',
  'intransitive verb': '不及物动词 (Intransitive Verb)',
  'vt.': '及物动词 (Transitive Verb)',
  'vt': '及物动词 (Transitive Verb)',
  'transitive verb': '及物动词 (Transitive Verb)',
  'adv.': '副词 (Adverb)',
  'adv': '副词 (Adverb)',
  'adverb': '副词 (Adverb)',
  'prep.': '介词 (Preposition)',
  'prep': '介词 (Preposition)',
  'preposition': '介词 (Preposition)',
  'conj.': '连词 (Conjunction)',
  'conj': '连词 (Conjunction)',
  'conjunction': '连词 (Conjunction)',
  'pron.': '代词 (Pronoun)',
  'pron': '代词 (Pronoun)',
  'pronoun': '代词 (Pronoun)',
  'art.': '冠词 (Article)',
  'art': '冠词 (Article)',
  'article': '冠词 (Article)',
  'num.': '数词 (Number)',
  'num': '数词 (Number)',
  'number': '数词 (Number)',
  'int.': '感叹词 (Interjection)',
  'int': '感叹词 (Interjection)',
  'interjection': '感叹词 (Interjection)',
  'aux.': '助动词 (Auxiliary)',
  'aux': '助动词 (Auxiliary)',
  'auxiliary': '助动词 (Auxiliary)',
  'modal.': '情态动词 (Modal Verb)',
  'modal': '情态动词 (Modal Verb)',
  'modal verb': '情态动词 (Modal Verb)',
  'det.': '限定词 (Determiner)',
  'det': '限定词 (Determiner)',
  'determiner': '限定词 (Determiner)',
  'excl.': '感叹词 (Exclamation)',
  'excl': '感叹词 (Exclamation)',
  'exclamation': '感叹词 (Exclamation)',
}

// 计算词性描述
const posDescription = computed(() => {
  const pos = props.pos || ''
  const normalizedPos = pos.trim().toLowerCase()
  return posMap[normalizedPos] || `${pos}（词性）`
})
</script>

<style lang="scss" scoped>
.pos-tag {
  color: var(--el-color-primary);
  cursor: help;
  font-weight: 500;
  user-select: none;
  white-space: nowrap;
  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}
</style>

