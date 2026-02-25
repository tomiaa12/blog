import { computed } from "vue"
import { useData } from "vitepress"

export function useLang() {
  const { lang } = useData()

  const isZhCN = computed(() => lang.value === "zh-CN")

  return {
    lang,
    isZhCN,
  }
}
