<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const COLOR_KEYS = ["c0", "c1", "c2", "c3", "c4"] as const
const HEX = ["#0d0d0d", "#f2f2f2", "#e53935", "#2e7d32", "#1565c0"] as const

const stageRef = ref<HTMLElement | null>(null)
const idx = ref(0)
const isFs = ref(false)

function onFsChange() {
  const el = stageRef.value
  isFs.value = !!(el && document.fullscreenElement === el)
}

function next() {
  idx.value = (idx.value + 1) % HEX.length
}

function prev() {
  idx.value = (idx.value - 1 + HEX.length) % HEX.length
}

async function enterFs() {
  const el = stageRef.value
  if (!el?.requestFullscreen) return
  await el.requestFullscreen()
}

async function exitFs() {
  if (document.fullscreenElement) await document.exitFullscreen()
}

function onKey(e: KeyboardEvent) {
  if (!isFs.value) return
  if (e.key === "ArrowRight" || e.key === " ") {
    e.preventDefault()
    next()
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault()
    prev()
  }
}

onMounted(() => {
  document.addEventListener("fullscreenchange", onFsChange)
  window.addEventListener("keydown", onKey)
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", onFsChange)
  window.removeEventListener("keydown", onKey)
  void exitFs()
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div
      ref="stageRef"
      class="stage"
      :style="{ backgroundColor: HEX[idx] }"
    >
      <div class="overlay">
        <p class="color-name">{{ t(COLOR_KEYS[idx]) }}</p>
        <div class="toolbar">
          <el-button
            v-if="!isFs"
            type="primary"
            @click="enterFs"
          >
            {{ t("enterFs") }}
          </el-button>
          <el-button
            v-if="isFs"
            @click="exitFs"
          >
            {{ t("exitFs") }}
          </el-button>
          <el-button @click="prev">{{ t("prev") }}</el-button>
          <el-button @click="next">{{ t("next") }}</el-button>
        </div>
        <p class="hint">{{ t("hintKeys") }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hw-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.page-desc {
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.stage {
  min-height: 280px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage:fullscreen {
  min-height: 100vh;
  border-radius: 0;
  border: none;
}

.overlay {
  padding: 20px;
  text-align: center;
}

.color-name {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  mix-blend-mode: difference;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 12px;
}

.hint {
  margin: 0;
  font-size: 0.82rem;
  color: #fff;
  mix-blend-mode: difference;
  opacity: 0.9;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.45;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "屏幕坏点测试",
    "desc": "使用纯色全屏观察液晶像素是否常亮、常灭或异色。建议在暗光环境下全屏切换黑、白、红、绿、蓝等颜色检查。",
    "enterFs": "全屏显示",
    "exitFs": "退出全屏",
    "prev": "上一色",
    "next": "下一色",
    "hintKeys": "全屏时可用 ← → 或空格切换颜色，Esc 退出全屏。",
    "c0": "黑",
    "c1": "白",
    "c2": "红",
    "c3": "绿",
    "c4": "蓝"
  },
  "en": {
    "title_page": "Dead Pixel Test",
    "desc": "Full-screen solid colors to spot stuck or dead pixels. Use in a dim room and switch colors.",
    "enterFs": "Enter fullscreen",
    "exitFs": "Exit fullscreen",
    "prev": "Previous",
    "next": "Next",
    "hintKeys": "In fullscreen use ← → or Space to change color; Esc exits.",
    "c0": "Black",
    "c1": "White",
    "c2": "Red",
    "c3": "Green",
    "c4": "Blue"
  },
  "ja": {
    "title_page": "ドット抜けテスト",
    "desc": "単色全画面で液晶のドット抜け・常点灯を確認します。",
    "enterFs": "全画面",
    "exitFs": "終了",
    "prev": "前の色",
    "next": "次の色",
    "hintKeys": "全画面時は ← → またはスペースで色切替、Esc で終了。",
    "c0": "黒",
    "c1": "白",
    "c2": "赤",
    "c3": "緑",
    "c4": "青"
  },
  "ko": {
    "title_page": "불량 화소 테스트",
    "desc": "단색 전체 화면으로 화소 불량을 확인합니다.",
    "enterFs": "전체 화면",
    "exitFs": "종료",
    "prev": "이전 색",
    "next": "다음 색",
    "hintKeys": "전체 화면에서 ← → 또는 스페이스, Esc로 종료.",
    "c0": "검정",
    "c1": "흰색",
    "c2": "빨강",
    "c3": "초록",
    "c4": "파랑"
  },
  "fr": {
    "title_page": "Test pixels morts",
    "desc": "Couleurs plein écran pour repérer les pixels défectueux.",
    "enterFs": "Plein écran",
    "exitFs": "Quitter",
    "prev": "Couleur préc.",
    "next": "Couleur suiv.",
    "hintKeys": "En plein écran : ← → ou Espace ; Échap pour quitter.",
    "c0": "Noir",
    "c1": "Blanc",
    "c2": "Rouge",
    "c3": "Vert",
    "c4": "Bleu"
  },
  "de": {
    "title_page": "Pixel-Test",
    "desc": "Vollbildfarben für defekte Pixel.",
    "enterFs": "Vollbild",
    "exitFs": "Beenden",
    "prev": "Zurück",
    "next": "Weiter",
    "hintKeys": "Im Vollbild: ← → oder Leertaste; Esc beendet.",
    "c0": "Schwarz",
    "c1": "Weiß",
    "c2": "Rot",
    "c3": "Grün",
    "c4": "Blau"
  },
  "es": {
    "title_page": "Test píxeles",
    "desc": "Colores a pantalla completa para ver píxeles defectuosos.",
    "enterFs": "Pantalla completa",
    "exitFs": "Salir",
    "prev": "Anterior",
    "next": "Siguiente",
    "hintKeys": "En pantalla completa: ← → o espacio; Esc salir.",
    "c0": "Negro",
    "c1": "Blanco",
    "c2": "Rojo",
    "c3": "Verde",
    "c4": "Azul"
  },
  "pt": {
    "title_page": "Teste de pixels",
    "desc": "Cores em ecrã inteiro para pixels com defeito.",
    "enterFs": "Ecrã inteiro",
    "exitFs": "Sair",
    "prev": "Anterior",
    "next": "Seguinte",
    "hintKeys": "Em ecrã inteiro: ← → ou espaço; Esc sai.",
    "c0": "Preto",
    "c1": "Branco",
    "c2": "Vermelho",
    "c3": "Verde",
    "c4": "Azul"
  },
  "ru": {
    "title_page": "Тест битых пикселей",
    "desc": "Полноэкранные цвета для поиска дефектных пикселей.",
    "enterFs": "Полный экран",
    "exitFs": "Выйти",
    "prev": "Назад",
    "next": "Далее",
    "hintKeys": "В полноэкранном: ← → или пробел; Esc — выход.",
    "c0": "Чёрный",
    "c1": "Белый",
    "c2": "Красный",
    "c3": "Зелёный",
    "c4": "Синий"
  },
  "ar": {
    "title_page": "اختبار البكسل",
    "desc": "ألوان ملء الشاشة للبحث عن بكسل معطوب.",
    "enterFs": "ملء الشاشة",
    "exitFs": "خروج",
    "prev": "السابق",
    "next": "التالي",
    "hintKeys": "في ملء الشاشة: ← → أو مسافة؛ Esc للخروج.",
    "c0": "أسود",
    "c1": "أبيض",
    "c2": "أحمر",
    "c3": "أخضر",
    "c4": "أزرق"
  },
  "hi": {
    "title_page": "डेड पिक्सेल टेस्ट",
    "desc": "पूर्ण स्क्रीन रंग से खराब पिक्सेल देखें।",
    "enterFs": "पूर्ण स्क्रीन",
    "exitFs": "बाहर",
    "prev": "पिछला",
    "next": "अगला",
    "hintKeys": "पूर्ण स्क्रीन में ← → या स्पेस; Esc बाहर।",
    "c0": "काला",
    "c1": "सफ़ेद",
    "c2": "लाल",
    "c3": "हरा",
    "c4": "नीला"
  },
  "it": {
    "title_page": "Test pixel",
    "desc": "Colori a schermo intero per pixel difettosi.",
    "enterFs": "Schermo intero",
    "exitFs": "Esci",
    "prev": "Precedente",
    "next": "Successivo",
    "hintKeys": "A schermo intero: ← → o spazio; Esc esce.",
    "c0": "Nero",
    "c1": "Bianco",
    "c2": "Rosso",
    "c3": "Verde",
    "c4": "Blu"
  },
  "nl": {
    "title_page": "Dode pixel test",
    "desc": "Volledig scherm kleuren voor defecte pixels.",
    "enterFs": "Volledig scherm",
    "exitFs": "Afsluiten",
    "prev": "Vorige",
    "next": "Volgende",
    "hintKeys": "Volledig scherm: ← → of spatie; Esc sluit af.",
    "c0": "Zwart",
    "c1": "Wit",
    "c2": "Rood",
    "c3": "Groen",
    "c4": "Blauw"
  },
  "tr": {
    "title_page": "Ölü piksel testi",
    "desc": "Tam ekran renklerle arızalı pikselleri kontrol edin.",
    "enterFs": "Tam ekran",
    "exitFs": "Çık",
    "prev": "Önceki",
    "next": "Sonraki",
    "hintKeys": "Tam ekranda: ← → veya boşluk; Esc çıkış.",
    "c0": "Siyah",
    "c1": "Beyaz",
    "c2": "Kırmızı",
    "c3": "Yeşil",
    "c4": "Mavi"
  },
  "vi": {
    "title_page": "Kiểm tra điểm ảnh",
    "desc": "Màu toàn màn hình để tìm điểm ảnh lỗi.",
    "enterFs": "Toàn màn hình",
    "exitFs": "Thoát",
    "prev": "Trước",
    "next": "Sau",
    "hintKeys": "Toàn màn hình: ← → hoặc cách; Esc thoát.",
    "c0": "Đen",
    "c1": "Trắng",
    "c2": "Đỏ",
    "c3": "Xanh lá",
    "c4": "Xanh dương"
  },
  "th": {
    "title_page": "ทดสอบพิกเซลเสีย",
    "desc": "สีเต็มหน้าจอเพื่อตรวจพิกเซล",
    "enterFs": "เต็มหน้าจอ",
    "exitFs": "ออก",
    "prev": "ก่อนหน้า",
    "next": "ถัดไป",
    "hintKeys": "เต็มหน้าจอ: ← → หรือเว้นวรรค; Esc ออก",
    "c0": "ดำ",
    "c1": "ขาว",
    "c2": "แดง",
    "c3": "เขียว",
    "c4": "น้ำเงิน"
  },
  "id": {
    "title_page": "Tes piksel mati",
    "desc": "Warna layar penuh untuk piksel rusak.",
    "enterFs": "Layar penuh",
    "exitFs": "Keluar",
    "prev": "Sebelum",
    "next": "Berikut",
    "hintKeys": "Layar penuh: ← → atau spasi; Esc keluar.",
    "c0": "Hitam",
    "c1": "Putih",
    "c2": "Merah",
    "c3": "Hijau",
    "c4": "Biru"
  },
  "ms": {
    "title_page": "Ujian piksel mati",
    "desc": "Warna skrin penuh untuk piksel rosak.",
    "enterFs": "Skrin penuh",
    "exitFs": "Keluar",
    "prev": "Sebelum",
    "next": "Seterusnya",
    "hintKeys": "Skrin penuh: ← → atau ruang; Esc keluar.",
    "c0": "Hitam",
    "c1": "Putih",
    "c2": "Merah",
    "c3": "Hijau",
    "c4": "Biru"
  },
  "pl": {
    "title_page": "Test martwych pikseli",
    "desc": "Pełnoekranowe kolory do wykrycia uszkodzonych pikseli.",
    "enterFs": "Pełny ekran",
    "exitFs": "Wyjście",
    "prev": "Poprzedni",
    "next": "Następny",
    "hintKeys": "Pełny ekran: ← → lub spacja; Esc wyjście.",
    "c0": "Czarny",
    "c1": "Biały",
    "c2": "Czerwony",
    "c3": "Zielony",
    "c4": "Niebieski"
  },
  "uk": {
    "title_page": "Тест битих пікселів",
    "desc": "Повноекранні кольори для пошуку дефектних пікселів.",
    "enterFs": "На весь екран",
    "exitFs": "Вийти",
    "prev": "Назад",
    "next": "Далі",
    "hintKeys": "На весь екран: ← → або пробіл; Esc — вихід.",
    "c0": "Чорний",
    "c1": "Білий",
    "c2": "Червоний",
    "c3": "Зелений",
    "c4": "Синій"
  }
}
</i18n>
