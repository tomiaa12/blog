<template>
  <div class="crl-wrap">
    <el-input
      v-model="searchQuery"
      class="crl-search"
      :placeholder="t('searchPlaceholder')"
      clearable
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <el-empty
      v-if="!filteredGroups.length"
      :description="t('noResults')"
    />

    <div
      v-for="group in filteredGroups"
      :key="group.source"
      class="crl-group"
    >
      <div class="crl-group-header">
        <el-tag
          type="primary"
          effect="dark"
          size="large"
          class="crl-source-tag"
        >
          {{ group.sourceLabel }}
        </el-tag>
        <span class="crl-group-desc">{{ group.sourceDesc }}</span>
      </div>

      <div class="crl-grid">
        <a
          v-for="item in group.targets"
          :key="item.target"
          :href="
            withBase(
              `${localePrefix}${basePath}/${group.source}-${item.target}`
            )
          "
          class="crl-card-link"
        >
          <el-card
            class="crl-card"
            shadow="hover"
          >
            <div class="crl-card-badges">
              <el-tag
                type="info"
                effect="plain"
                size="small"
                >{{ group.sourceLabel }}</el-tag
              >
              <span class="crl-arrow">→</span>
              <el-tag
                type="success"
                effect="plain"
                size="small"
                >{{ item.targetLabel }}</el-tag
              >
            </div>
            <div class="crl-card-title">
              {{ group.sourceLabel }} {{ t("to") }} {{ item.targetLabel }}
            </div>
            <p class="crl-card-desc">{{ item.description }}</p>
          </el-card>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { withBase, useData } from "vitepress"
import { useI18n } from "vue-i18n"
import { Search } from "@element-plus/icons-vue"

const { localeIndex } = useData()
const localePrefix = computed(() =>
  localeIndex.value === "root" ? "" : `/${localeIndex.value}`
)

export interface ConvertRouteParams {
  source: string
  target: string
  sourceLabel: string
  targetLabel: string
  sourceDesc: string
  description: string
  [key: string]: unknown
}

export interface ConvertRouteItem {
  params: ConvertRouteParams
}

const props = defineProps<{
  /** routeConfig.paths() 的返回值 */
  paths: ConvertRouteItem[]
  /** 路由基础路径，例如 /web/convert/audio */
  basePath: string
}>()

const { t } = useI18n({ useScope: "local" })

interface TargetItem {
  target: string
  targetLabel: string
  description: string
}

interface GroupItem {
  source: string
  sourceLabel: string
  sourceDesc: string
  targets: TargetItem[]
}

const groups = computed<GroupItem[]>(() => {
  const map = new Map<string, GroupItem>()
  for (const { params } of props.paths) {
    if (!map.has(params.source)) {
      map.set(params.source, {
        source: params.source,
        sourceLabel: params.sourceLabel,
        sourceDesc: params.sourceDesc,
        targets: [],
      })
    }
    map.get(params.source)!.targets.push({
      target: params.target,
      targetLabel: params.targetLabel,
      description: params.description,
    })
  }
  return [...map.values()]
})

const searchQuery = ref("")

const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return groups.value
  return groups.value.filter(
    g =>
      g.source.toLowerCase().includes(q) ||
      g.sourceLabel.toLowerCase().includes(q)
  )
})
</script>

<style lang="scss" scoped>
.crl-wrap {
  margin-top: 24px;
}

.crl-search {
  margin-bottom: 32px;
  max-width: 400px;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}

.crl-group {
  margin-bottom: 40px;
}

.crl-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.crl-source-tag {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.crl-group-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.crl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.crl-card-link {
  text-decoration: none;
  display: block;

  &:hover .crl-card {
    border-color: var(--el-color-primary-light-3);
  }
}

.crl-card {
  height: 100%;
  border-radius: 10px;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.crl-card-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.crl-arrow {
  color: var(--vp-c-text-3);
  font-weight: 600;
  font-size: 14px;
}

.crl-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.crl-card-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<i18n lang="json">
{
  "zh-CN": {
    "searchPlaceholder": "搜索格式，例如 mp3",
    "noResults": "未找到匹配的格式",
    "to": "转"
  },
  "en": {
    "searchPlaceholder": "Search format, e.g. mp3",
    "noResults": "No matching formats found",
    "to": "to"
  },
  "zh-TW": {
    "searchPlaceholder": "搜尋格式，例如 mp3",
    "noResults": "未找到匹配的格式",
    "to": "轉"
  },
  "ja": {
    "searchPlaceholder": "形式を検索、例：mp3",
    "noResults": "一致する形式が見つかりません",
    "to": "→"
  },
  "ko": {
    "searchPlaceholder": "형식 검색, 예: mp3",
    "noResults": "일치하는 형식이 없습니다",
    "to": "→"
  },
  "fr": {
    "searchPlaceholder": "Rechercher un format, ex: mp3",
    "noResults": "Aucun format correspondant",
    "to": "vers"
  },
  "de": {
    "searchPlaceholder": "Format suchen, z.B. mp3",
    "noResults": "Kein passendes Format gefunden",
    "to": "zu"
  },
  "es": {
    "searchPlaceholder": "Buscar formato, ej: mp3",
    "noResults": "No se encontraron formatos",
    "to": "a"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar formato, ex: mp3",
    "noResults": "Nenhum formato encontrado",
    "to": "para"
  },
  "ru": {
    "searchPlaceholder": "Поиск формата, напр. mp3",
    "noResults": "Форматы не найдены",
    "to": "в"
  },
  "ar": {
    "searchPlaceholder": "ابحث عن صيغة، مثال: mp3",
    "noResults": "لم يتم العثور على صيغ مطابقة",
    "to": "إلى"
  },
  "hi": {
    "searchPlaceholder": "फ़ॉर्मेट खोजें, जैसे mp3",
    "noResults": "कोई मेल खाता फ़ॉर्मेट नहीं मिला",
    "to": "से"
  },
  "it": {
    "searchPlaceholder": "Cerca formato, es. mp3",
    "noResults": "Nessun formato trovato",
    "to": "in"
  },
  "nl": {
    "searchPlaceholder": "Zoek formaat, bijv. mp3",
    "noResults": "Geen overeenkomende formaten",
    "to": "naar"
  },
  "tr": {
    "searchPlaceholder": "Format ara, örn. mp3",
    "noResults": "Eşleşen format bulunamadı",
    "to": "için"
  },
  "vi": {
    "searchPlaceholder": "Tìm định dạng, ví dụ: mp3",
    "noResults": "Không tìm thấy định dạng phù hợp",
    "to": "sang"
  },
  "th": {
    "searchPlaceholder": "ค้นหารูปแบบ เช่น mp3",
    "noResults": "ไม่พบรูปแบบที่ตรงกัน",
    "to": "เป็น"
  },
  "id": {
    "searchPlaceholder": "Cari format, misal mp3",
    "noResults": "Format tidak ditemukan",
    "to": "ke"
  },
  "pl": {
    "searchPlaceholder": "Szukaj formatu, np. mp3",
    "noResults": "Nie znaleziono pasujących formatów",
    "to": "na"
  },
  "sv": {
    "searchPlaceholder": "Sök format, t.ex. mp3",
    "noResults": "Inga matchande format hittades",
    "to": "till"
  }
}
</i18n>
