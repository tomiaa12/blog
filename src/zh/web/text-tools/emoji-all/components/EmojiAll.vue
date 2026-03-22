<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { loadFirstAvailable } from "@/utils"

const { t } = useI18n()

// ── types ────────────────────────────────────────────────────
interface SkinVariation {
  unified: string
}
interface EmojiEntry {
  name: string
  unified: string
  short_name: string
  short_names: string[]
  category: string
  subcategory: string
  sort_order: number
  skin_variations?: Record<string, SkinVariation>
  has_img_apple: boolean
}

// ── load data ────────────────────────────────────────────────
const SKIN_TONES = ["", "1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]

let _emojiCache: EmojiEntry[] | null = null

async function loadEmojiData(): Promise<EmojiEntry[]> {
  if (_emojiCache) return _emojiCache
  _emojiCache = await loadFirstAvailable(
    [
      "https://cdn.jsdelivr.net/npm/emoji-datasource@16.0.0/emoji.json",
      "https://unpkg.com/emoji-datasource@16.0.0/emoji.json",
    ],
    async url => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<EmojiEntry[]>
    },
    () =>
      import("emoji-datasource/emoji.json").then(
        (m: any) => m.default as EmojiEntry[]
      )
  ).catch(e => {
    _emojiCache = null
    throw e
  })
  return _emojiCache!
}

function unifiedToEmoji(unified: string): string {
  return unified
    .split("-")
    .map(cp => String.fromCodePoint(parseInt(cp, 16)))
    .join("")
}

// ── state ────────────────────────────────────────────────────
const loading = ref(true)
const error = ref("")
const allEmoji = ref<EmojiEntry[]>([])
const searchQuery = ref("")
const activeCategory = ref("Smileys & Emotion")
const skinTone = ref("") // one of SKIN_TONES
const hoveredEmoji = ref<EmojiEntry | null>(null)

const EXCLUDED_CATEGORIES = new Set(["Component"])

const categories = computed(() => {
  const cats = [...new Set(allEmoji.value.map(e => e.category))].filter(
    c => !EXCLUDED_CATEGORIES.has(c)
  )
  return cats
})

const categoryIcons: Record<string, string> = {
  "Smileys & Emotion": "😀",
  "People & Body": "🧑",
  "Animals & Nature": "🐶",
  "Food & Drink": "🍎",
  "Travel & Places": "✈️",
  Activities: "⚽",
  Objects: "💡",
  Symbols: "❤️",
  Flags: "🏳️",
}

function getEmojiChar(entry: EmojiEntry): string {
  if (skinTone.value && entry.skin_variations?.[skinTone.value]) {
    return unifiedToEmoji(entry.skin_variations[skinTone.value].unified)
  }
  return unifiedToEmoji(entry.unified)
}

const displayedEmoji = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = allEmoji.value.filter(e => !EXCLUDED_CATEGORIES.has(e.category))

  if (q) {
    list = list.filter(
      e =>
        e.name.toLowerCase().includes(q) ||
        e.short_names.some(s => s.includes(q))
    )
    return list.slice(0, 300)
  }

  if (activeCategory.value !== "all") {
    list = list.filter(e => e.category === activeCategory.value)
  }
  return list
})

function copyEmoji(entry: EmojiEntry) {
  const char = getEmojiChar(entry)
  navigator.clipboard.writeText(char).then(() => {
    ElMessage({
      message: `${char}  ${t("copied")}`,
      type: "success",
      duration: 1500,
    })
  })
}

onMounted(async () => {
  try {
    allEmoji.value = await loadEmojiData()
  } catch (e) {
    error.value = t("loadError")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="emoji-all">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-state"
    >
      <div class="loading-spinner" />
      <p>{{ t("loading") }}</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="error-state"
    >
      <p>{{ error }}</p>
    </div>

    <!-- Main -->
    <template v-else>
      <!-- Search + skin tone -->
      <div class="toolbar">
        <el-input
          v-model="searchQuery"
          :placeholder="t('searchPlaceholder')"
          clearable
          class="search-input"
        >
          <template #prefix>🔍</template>
        </el-input>

        <div class="skin-tones">
          <button
            v-for="tone in SKIN_TONES"
            :key="tone"
            class="skin-btn"
            :class="{ active: skinTone === tone }"
            :title="t('skinTone')"
            @click="skinTone = tone"
          >
            {{ tone ? unifiedToEmoji("1F590-" + tone) : "✋" }}
          </button>
        </div>
      </div>

      <!-- Category tabs -->
      <div
        v-if="!searchQuery"
        class="category-tabs"
      >
        <button
          class="cat-tab"
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          {{ t("all") }}
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-tab"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ categoryIcons[cat] ?? "" }}
          {{ t("cat_" + cat.replace(/[^a-z]/gi, "_")) }}
        </button>
      </div>

      <!-- Count -->
      <div class="count-bar">
        {{ t("total") }}：{{ displayedEmoji.length.toLocaleString() }}
        <span
          v-if="searchQuery"
          class="search-hint"
          >{{ t("searchResult") }}</span
        >
      </div>

      <!-- Emoji grid -->
      <div class="emoji-grid">
        <button
          v-for="entry in displayedEmoji"
          :key="entry.unified"
          class="emoji-btn"
          :title="entry.short_name"
          @click="copyEmoji(entry)"
          @mouseenter="hoveredEmoji = entry"
          @mouseleave="hoveredEmoji = null"
        >
          {{ getEmojiChar(entry) }}
        </button>
      </div>

      <!-- Hover info bar -->
      <div
        class="info-bar"
        :class="{ visible: !!hoveredEmoji }"
      >
        <template v-if="hoveredEmoji">
          <span class="info-emoji">{{ getEmojiChar(hoveredEmoji) }}</span>
          <span class="info-name">{{ hoveredEmoji.name }}</span>
          <span class="info-short">:{{ hoveredEmoji.short_name }}:</span>
          <span class="info-hint">{{ t("clickToCopy") }}</span>
        </template>
        <template v-else>&nbsp;</template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.emoji-all {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

// Loading / Error
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 0;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Toolbar
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.skin-tones {
  display: flex;
  gap: 4px;
}

.skin-btn {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--vp-c-brand-1);
  }

  &.active {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}

// Category tabs
.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.cat-tab {
  padding: 5px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  &.active {
    background: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
    color: #fff;
  }
}

// Count
.count-bar {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
}

.search-hint {
  margin-left: 8px;
  color: var(--vp-c-brand-1);
}

// Emoji grid
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
  gap: 2px;
}

.emoji-btn {
  width: 46px;
  height: 46px;
  font-size: 1.6rem;
  line-height: 1;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s, border-color 0.1s;

  &:hover {
    background: var(--vp-c-bg-soft);
    border-color: var(--vp-c-divider);
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Info bar
.info-bar {
  position: sticky;
  bottom: 0;
  margin-top: 12px;
  padding: 10px 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  min-height: 44px;
  opacity: 0;
  transition: opacity 0.15s;

  &.visible {
    opacity: 1;
  }
}

.info-emoji {
  font-size: 1.8rem;
  line-height: 1;
}

.info-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: capitalize;
}

.info-short {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
}

.info-hint {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "Emoji 大全",
    "loading": "正在加载 Emoji 数据...",
    "loadError": "Emoji 数据加载失败，请刷新重试",
    "searchPlaceholder": "搜索 emoji 名称或关键词...",
    "skinTone": "肤色",
    "all": "全部",
    "total": "共",
    "searchResult": "（搜索结果，最多显示 300 个）",
    "clickToCopy": "点击复制",
    "copied": "已复制！",
    "cat_Smileys___Emotion": "表情",
    "cat_People___Body": "人物",
    "cat_Animals___Nature": "动物",
    "cat_Food___Drink": "食物",
    "cat_Travel___Places": "旅行",
    "cat_Activities": "活动",
    "cat_Objects": "物品",
    "cat_Symbols": "符号",
    "cat_Flags": "旗帜"
  },
  "en": {
    "title_page": "Emoji Collection",
    "loading": "Loading emoji data...",
    "loadError": "Failed to load emoji data, please refresh",
    "searchPlaceholder": "Search emoji by name or keyword...",
    "skinTone": "Skin tone",
    "all": "All",
    "total": "Total",
    "searchResult": "(search results, max 300)",
    "clickToCopy": "Click to copy",
    "copied": "Copied!",
    "cat_Smileys___Emotion": "Smileys",
    "cat_People___Body": "People",
    "cat_Animals___Nature": "Animals",
    "cat_Food___Drink": "Food",
    "cat_Travel___Places": "Travel",
    "cat_Activities": "Activities",
    "cat_Objects": "Objects",
    "cat_Symbols": "Symbols",
    "cat_Flags": "Flags"
  },
  "ja": {
    "title_page": "絵文字一覧",
    "loading": "絵文字データを読み込んでいます...",
    "loadError": "絵文字データの読み込みに失敗しました",
    "searchPlaceholder": "絵文字を検索...",
    "skinTone": "肌の色",
    "all": "すべて",
    "total": "合計",
    "searchResult": "（検索結果、最大300件）",
    "clickToCopy": "クリックしてコピー",
    "copied": "コピーしました",
    "cat_Smileys___Emotion": "顔文字",
    "cat_People___Body": "人物",
    "cat_Animals___Nature": "動物",
    "cat_Food___Drink": "食べ物",
    "cat_Travel___Places": "旅行",
    "cat_Activities": "アクティビティ",
    "cat_Objects": "物",
    "cat_Symbols": "記号",
    "cat_Flags": "旗"
  },
  "ko": {
    "title_page": "이모지 모음",
    "loading": "이모지 데이터 로딩 중...",
    "loadError": "이모지 데이터 로드 실패, 새로고침 해주세요",
    "searchPlaceholder": "이모지 검색...",
    "skinTone": "피부색",
    "all": "전체",
    "total": "총",
    "searchResult": "（검색 결과, 최대 300개）",
    "clickToCopy": "클릭하여 복사",
    "copied": "복사되었습니다!",
    "cat_Smileys___Emotion": "이모티콘",
    "cat_People___Body": "사람",
    "cat_Animals___Nature": "동물",
    "cat_Food___Drink": "음식",
    "cat_Travel___Places": "여행",
    "cat_Activities": "활동",
    "cat_Objects": "물건",
    "cat_Symbols": "기호",
    "cat_Flags": "국기"
  },
  "fr": {
    "title_page": "Collection d'emoji",
    "loading": "Chargement des emoji...",
    "loadError": "Échec du chargement des emoji, veuillez rafraîchir",
    "searchPlaceholder": "Rechercher des emoji...",
    "skinTone": "Teint",
    "all": "Tous",
    "total": "Total",
    "searchResult": "（résultats de recherche, max 300）",
    "clickToCopy": "Cliquer pour copier",
    "copied": "Copié !",
    "cat_Smileys___Emotion": "Émoticônes",
    "cat_People___Body": "Personnes",
    "cat_Animals___Nature": "Animaux",
    "cat_Food___Drink": "Nourriture",
    "cat_Travel___Places": "Voyages",
    "cat_Activities": "Activités",
    "cat_Objects": "Objets",
    "cat_Symbols": "Symboles",
    "cat_Flags": "Drapeaux"
  },
  "de": {
    "title_page": "Emoji-Sammlung",
    "loading": "Emoji-Daten werden geladen...",
    "loadError": "Emoji-Daten konnten nicht geladen werden",
    "searchPlaceholder": "Emoji suchen...",
    "skinTone": "Hautton",
    "all": "Alle",
    "total": "Gesamt",
    "searchResult": "（Suchergebnisse, max. 300）",
    "clickToCopy": "Klicken zum Kopieren",
    "copied": "Kopiert!",
    "cat_Smileys___Emotion": "Smileys",
    "cat_People___Body": "Personen",
    "cat_Animals___Nature": "Tiere",
    "cat_Food___Drink": "Essen",
    "cat_Travel___Places": "Reisen",
    "cat_Activities": "Aktivitäten",
    "cat_Objects": "Objekte",
    "cat_Symbols": "Symbole",
    "cat_Flags": "Flaggen"
  },
  "es": {
    "title_page": "Colección de emoji",
    "loading": "Cargando datos de emoji...",
    "loadError": "Error al cargar emoji, actualice la página",
    "searchPlaceholder": "Buscar emoji...",
    "skinTone": "Tono de piel",
    "all": "Todos",
    "total": "Total",
    "searchResult": "（resultados de búsqueda, máx. 300）",
    "clickToCopy": "Clic para copiar",
    "copied": "¡Copiado!",
    "cat_Smileys___Emotion": "Emoticonos",
    "cat_People___Body": "Personas",
    "cat_Animals___Nature": "Animales",
    "cat_Food___Drink": "Comida",
    "cat_Travel___Places": "Viajes",
    "cat_Activities": "Actividades",
    "cat_Objects": "Objetos",
    "cat_Symbols": "Símbolos",
    "cat_Flags": "Banderas"
  },
  "pt": {
    "title_page": "Coleção de emoji",
    "loading": "Carregando dados de emoji...",
    "loadError": "Falha ao carregar emoji, atualize a página",
    "searchPlaceholder": "Pesquisar emoji...",
    "skinTone": "Tom de pele",
    "all": "Todos",
    "total": "Total",
    "searchResult": "（resultados de pesquisa, máx. 300）",
    "clickToCopy": "Clique para copiar",
    "copied": "Copiado!",
    "cat_Smileys___Emotion": "Emoticons",
    "cat_People___Body": "Pessoas",
    "cat_Animals___Nature": "Animais",
    "cat_Food___Drink": "Comida",
    "cat_Travel___Places": "Viagens",
    "cat_Activities": "Atividades",
    "cat_Objects": "Objetos",
    "cat_Symbols": "Símbolos",
    "cat_Flags": "Bandeiras"
  },
  "ru": {
    "title_page": "Коллекция emoji",
    "loading": "Загрузка данных emoji...",
    "loadError": "Не удалось загрузить emoji, обновите страницу",
    "searchPlaceholder": "Поиск emoji...",
    "skinTone": "Тон кожи",
    "all": "Все",
    "total": "Всего",
    "searchResult": "（результаты поиска, макс. 300）",
    "clickToCopy": "Нажмите для копирования",
    "copied": "Скопировано!",
    "cat_Smileys___Emotion": "Смайлики",
    "cat_People___Body": "Люди",
    "cat_Animals___Nature": "Животные",
    "cat_Food___Drink": "Еда",
    "cat_Travel___Places": "Путешествия",
    "cat_Activities": "Активности",
    "cat_Objects": "Объекты",
    "cat_Symbols": "Символы",
    "cat_Flags": "Флаги"
  },
  "ar": {
    "title_page": "مجموعة الرموز التعبيرية",
    "loading": "جارٍ تحميل بيانات الإيموجي...",
    "loadError": "فشل تحميل الإيموجي، يرجى تحديث الصفحة",
    "searchPlaceholder": "البحث عن إيموجي...",
    "skinTone": "لون البشرة",
    "all": "الكل",
    "total": "المجموع",
    "searchResult": "（نتائج البحث، حد أقصى 300）",
    "clickToCopy": "انقر للنسخ",
    "copied": "تم النسخ!",
    "cat_Smileys___Emotion": "ابتسامات",
    "cat_People___Body": "أشخاص",
    "cat_Animals___Nature": "حيوانات",
    "cat_Food___Drink": "طعام",
    "cat_Travel___Places": "سفر",
    "cat_Activities": "أنشطة",
    "cat_Objects": "أشياء",
    "cat_Symbols": "رموز",
    "cat_Flags": "أعلام"
  },
  "hi": {
    "title_page": "इमोजी संग्रह",
    "loading": "इमोजी डेटा लोड हो रहा है...",
    "loadError": "इमोजी डेटा लोड करने में विफल, पृष्ठ रीफ्रेश करें",
    "searchPlaceholder": "इमोजी खोजें...",
    "skinTone": "त्वचा का रंग",
    "all": "सभी",
    "total": "कुल",
    "searchResult": "（खोज परिणाम, अधिकतम 300）",
    "clickToCopy": "कॉपी करने के लिए क्लिक करें",
    "copied": "कॉपी हो गया!",
    "cat_Smileys___Emotion": "स्माइली",
    "cat_People___Body": "लोग",
    "cat_Animals___Nature": "जानवर",
    "cat_Food___Drink": "खाना",
    "cat_Travel___Places": "यात्रा",
    "cat_Activities": "गतिविधियाँ",
    "cat_Objects": "वस्तुएँ",
    "cat_Symbols": "प्रतीक",
    "cat_Flags": "झंडे"
  },
  "it": {
    "title_page": "Raccolta emoji",
    "loading": "Caricamento dati emoji...",
    "loadError": "Impossibile caricare emoji, aggiorna la pagina",
    "searchPlaceholder": "Cerca emoji...",
    "skinTone": "Tono della pelle",
    "all": "Tutti",
    "total": "Totale",
    "searchResult": "（risultati di ricerca, max 300）",
    "clickToCopy": "Clic per copiare",
    "copied": "Copiato!",
    "cat_Smileys___Emotion": "Faccine",
    "cat_People___Body": "Persone",
    "cat_Animals___Nature": "Animali",
    "cat_Food___Drink": "Cibo",
    "cat_Travel___Places": "Viaggi",
    "cat_Activities": "Attività",
    "cat_Objects": "Oggetti",
    "cat_Symbols": "Simboli",
    "cat_Flags": "Bandiere"
  },
  "nl": {
    "title_page": "Emoji-verzameling",
    "loading": "Emoji-gegevens laden...",
    "loadError": "Emoji laden mislukt, vernieuw de pagina",
    "searchPlaceholder": "Emoji zoeken...",
    "skinTone": "Huidskleur",
    "all": "Alle",
    "total": "Totaal",
    "searchResult": "（zoekresultaten, max. 300）",
    "clickToCopy": "Klik om te kopiëren",
    "copied": "Gekopieerd!",
    "cat_Smileys___Emotion": "Smileys",
    "cat_People___Body": "Mensen",
    "cat_Animals___Nature": "Dieren",
    "cat_Food___Drink": "Eten",
    "cat_Travel___Places": "Reizen",
    "cat_Activities": "Activiteiten",
    "cat_Objects": "Objecten",
    "cat_Symbols": "Symbolen",
    "cat_Flags": "Vlaggen"
  },
  "tr": {
    "title_page": "Emoji Koleksiyonu",
    "loading": "Emoji verileri yükleniyor...",
    "loadError": "Emoji yüklenemedi, sayfayı yenileyin",
    "searchPlaceholder": "Emoji ara...",
    "skinTone": "Ten rengi",
    "all": "Tümü",
    "total": "Toplam",
    "searchResult": "（arama sonuçları, maks. 300）",
    "clickToCopy": "Kopyalamak için tıkla",
    "copied": "Kopyalandı!",
    "cat_Smileys___Emotion": "İfadeler",
    "cat_People___Body": "İnsanlar",
    "cat_Animals___Nature": "Hayvanlar",
    "cat_Food___Drink": "Yiyecek",
    "cat_Travel___Places": "Seyahat",
    "cat_Activities": "Aktiviteler",
    "cat_Objects": "Nesneler",
    "cat_Symbols": "Semboller",
    "cat_Flags": "Bayraklar"
  },
  "vi": {
    "title_page": "Bộ sưu tập Emoji",
    "loading": "Đang tải dữ liệu emoji...",
    "loadError": "Tải emoji thất bại, vui lòng làm mới trang",
    "searchPlaceholder": "Tìm kiếm emoji...",
    "skinTone": "Màu da",
    "all": "Tất cả",
    "total": "Tổng",
    "searchResult": "（kết quả tìm kiếm, tối đa 300）",
    "clickToCopy": "Nhấp để sao chép",
    "copied": "Đã sao chép!",
    "cat_Smileys___Emotion": "Biểu cảm",
    "cat_People___Body": "Con người",
    "cat_Animals___Nature": "Động vật",
    "cat_Food___Drink": "Thức ăn",
    "cat_Travel___Places": "Du lịch",
    "cat_Activities": "Hoạt động",
    "cat_Objects": "Đồ vật",
    "cat_Symbols": "Ký hiệu",
    "cat_Flags": "Cờ"
  },
  "th": {
    "title_page": "คอลเล็กชัน Emoji",
    "loading": "กำลังโหลดข้อมูล emoji...",
    "loadError": "โหลด emoji ล้มเหลว กรุณารีเฟรช",
    "searchPlaceholder": "ค้นหา emoji...",
    "skinTone": "โทนสีผิว",
    "all": "ทั้งหมด",
    "total": "รวม",
    "searchResult": "（ผลลัพธ์การค้นหา สูงสุด 300）",
    "clickToCopy": "คลิกเพื่อคัดลอก",
    "copied": "คัดลอกแล้ว!",
    "cat_Smileys___Emotion": "อิโมจิหน้า",
    "cat_People___Body": "คน",
    "cat_Animals___Nature": "สัตว์",
    "cat_Food___Drink": "อาหาร",
    "cat_Travel___Places": "ท่องเที่ยว",
    "cat_Activities": "กิจกรรม",
    "cat_Objects": "สิ่งของ",
    "cat_Symbols": "สัญลักษณ์",
    "cat_Flags": "ธง"
  },
  "id": {
    "title_page": "Koleksi Emoji",
    "loading": "Memuat data emoji...",
    "loadError": "Gagal memuat emoji, segarkan halaman",
    "searchPlaceholder": "Cari emoji...",
    "skinTone": "Warna kulit",
    "all": "Semua",
    "total": "Total",
    "searchResult": "（hasil pencarian, maks. 300）",
    "clickToCopy": "Klik untuk menyalin",
    "copied": "Disalin!",
    "cat_Smileys___Emotion": "Senyum",
    "cat_People___Body": "Orang",
    "cat_Animals___Nature": "Hewan",
    "cat_Food___Drink": "Makanan",
    "cat_Travel___Places": "Perjalanan",
    "cat_Activities": "Aktivitas",
    "cat_Objects": "Benda",
    "cat_Symbols": "Simbol",
    "cat_Flags": "Bendera"
  },
  "sv": {
    "title_page": "Emoji-samling",
    "loading": "Laddar emoji-data...",
    "loadError": "Det gick inte att ladda emoji, uppdatera sidan",
    "searchPlaceholder": "Sök emoji...",
    "skinTone": "Hudton",
    "all": "Alla",
    "total": "Totalt",
    "searchResult": "（sökresultat, max 300）",
    "clickToCopy": "Klicka för att kopiera",
    "copied": "Kopierat!",
    "cat_Smileys___Emotion": "Smileys",
    "cat_People___Body": "Människor",
    "cat_Animals___Nature": "Djur",
    "cat_Food___Drink": "Mat",
    "cat_Travel___Places": "Resor",
    "cat_Activities": "Aktiviteter",
    "cat_Objects": "Objekt",
    "cat_Symbols": "Symboler",
    "cat_Flags": "Flaggor"
  },
  "pl": {
    "title_page": "Kolekcja emoji",
    "loading": "Ładowanie danych emoji...",
    "loadError": "Nie udało się załadować emoji, odśwież stronę",
    "searchPlaceholder": "Szukaj emoji...",
    "skinTone": "Kolor skóry",
    "all": "Wszystkie",
    "total": "Łącznie",
    "searchResult": "（wyniki wyszukiwania, maks. 300）",
    "clickToCopy": "Kliknij, aby skopiować",
    "copied": "Skopiowano!",
    "cat_Smileys___Emotion": "Emotikony",
    "cat_People___Body": "Ludzie",
    "cat_Animals___Nature": "Zwierzęta",
    "cat_Food___Drink": "Jedzenie",
    "cat_Travel___Places": "Podróże",
    "cat_Activities": "Aktywności",
    "cat_Objects": "Przedmioty",
    "cat_Symbols": "Symbole",
    "cat_Flags": "Flagi"
  },
  "zh-TW": {
    "title_page": "Emoji 大全",
    "loading": "正在載入 Emoji 資料...",
    "loadError": "Emoji 資料載入失敗，請重新整理",
    "searchPlaceholder": "搜尋 emoji 名稱或關鍵字...",
    "skinTone": "膚色",
    "all": "全部",
    "total": "共",
    "searchResult": "（搜尋結果，最多顯示 300 個）",
    "clickToCopy": "點擊複製",
    "copied": "已複製！",
    "cat_Smileys___Emotion": "表情",
    "cat_People___Body": "人物",
    "cat_Animals___Nature": "動物",
    "cat_Food___Drink": "食物",
    "cat_Travel___Places": "旅行",
    "cat_Activities": "活動",
    "cat_Objects": "物品",
    "cat_Symbols": "符號",
    "cat_Flags": "旗幟"
  }
}
</i18n>
