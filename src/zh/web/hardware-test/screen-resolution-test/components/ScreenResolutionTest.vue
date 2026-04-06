<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const tick = ref(0)

function refresh() {
  tick.value += 1
}

const rows = computed(() => {
  void tick.value
  if (typeof window === "undefined") {
    return [
      { k: "row_screen", v: "—" },
      { k: "avail", v: "—" },
      { k: "inner", v: "—" },
      { k: "outer", v: "—" },
      { k: "dpr", v: "—" },
      { k: "orientation", v: "—" },
    ]
  }
  const s = window.screen
  const ori =
    typeof s.orientation?.type === "string" ? s.orientation.type : "—"
  return [
    { k: "row_screen", v: `${s.width} × ${s.height}` },
    { k: "avail", v: `${s.availWidth} × ${s.availHeight}` },
    { k: "inner", v: `${window.innerWidth} × ${window.innerHeight}` },
    { k: "outer", v: `${window.outerWidth} × ${window.outerHeight}` },
    { k: "dpr", v: String(window.devicePixelRatio ?? 1) },
    { k: "orientation", v: ori },
  ]
})

onMounted(() => {
  refresh()
  window.addEventListener("resize", refresh)
  window.addEventListener("orientationchange", refresh)
})

onUnmounted(() => {
  window.removeEventListener("resize", refresh)
  window.removeEventListener("orientationchange", refresh)
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <el-button
      class="mb"
      @click="refresh"
    >
      {{ t("refresh") }}
    </el-button>

    <div class="table">
      <div
        v-for="r in rows"
        :key="r.k"
        class="tr"
      >
        <span class="td k">{{ t(r.k) }}</span>
        <span class="td v mono">{{ r.v }}</span>
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

.mb {
  margin-bottom: 16px;
}

.table {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.tr {
  display: grid;
  grid-template-columns: minmax(120px, 40%) 1fr;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
}

.td.k {
  color: var(--vp-c-text-2);
}

.td.v {
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.mono {
  font-family: var(--vp-font-family-mono);
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "屏幕分辨率测试",
    "desc": "列出 screen 与 window 的常见尺寸字段及 devicePixelRatio，在调整窗口或旋转设备时会随 resize / orientationchange 更新（部分浏览器可能略有差异）。",
    "refresh": "手动刷新",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "en": {
    "title_page": "Screen Resolution Test",
    "desc": "Shows common screen and window dimensions and devicePixelRatio. Updates on resize and orientation change.",
    "refresh": "Refresh",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "ja": {
    "title_page": "画面解像度テスト",
    "desc": "screen / window の寸法と devicePixelRatio を表示します。",
    "refresh": "更新",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "ko": {
    "title_page": "화면 해상도 테스트",
    "desc": "screen, window 크기와 devicePixelRatio를 표시합니다.",
    "refresh": "새로고침",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "fr": {
    "title_page": "Test résolution",
    "desc": "Affiche les dimensions d'écran et de fenêtre et le devicePixelRatio.",
    "refresh": "Actualiser",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "de": {
    "title_page": "Auflösungstest",
    "desc": "Zeigt Bildschirm- und Fenstermaße sowie devicePixelRatio.",
    "refresh": "Aktualisieren",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "es": {
    "title_page": "Prueba de resolución",
    "desc": "Muestra dimensiones de pantalla y ventana y devicePixelRatio.",
    "refresh": "Actualizar",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "pt": {
    "title_page": "Teste de resolução",
    "desc": "Mostra dimensões do ecrã e da janela e devicePixelRatio.",
    "refresh": "Atualizar",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "ru": {
    "title_page": "Тест разрешения",
    "desc": "Размеры экрана, окна и devicePixelRatio.",
    "refresh": "Обновить",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "ar": {
    "title_page": "اختبار الدقة",
    "desc": "أبعاد الشاشة والنافذة و devicePixelRatio.",
    "refresh": "تحديث",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "hi": {
    "title_page": "स्क्रीन रिज़ॉल्यूशन टेस्ट",
    "desc": "स्क्रीन, विंडो आकार और devicePixelRatio।",
    "refresh": "रीफ़्रेश",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "it": {
    "title_page": "Test risoluzione",
    "desc": "Dimensioni schermo, finestra e devicePixelRatio.",
    "refresh": "Aggiorna",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "nl": {
    "title_page": "Resolutietest",
    "desc": "Scherm- en venstermaten en devicePixelRatio.",
    "refresh": "Vernieuwen",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "tr": {
    "title_page": "Çözünürlük testi",
    "desc": "Ekran, pencere boyutları ve devicePixelRatio.",
    "refresh": "Yenile",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "vi": {
    "title_page": "Kiểm tra độ phân giải",
    "desc": "Kích thước màn hình, cửa sổ và devicePixelRatio.",
    "refresh": "Làm mới",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "th": {
    "title_page": "ทดสอบความละเอียด",
    "desc": "ขนาดหน้าจอ หน้าต่าง และ devicePixelRatio",
    "refresh": "รีเฟรช",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "id": {
    "title_page": "Tes resolusi layar",
    "desc": "Ukuran layar, jendela, dan devicePixelRatio.",
    "refresh": "Segarkan",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "ms": {
    "title_page": "Ujian resolusi skrin",
    "desc": "Saiz skrin, tetingkap dan devicePixelRatio.",
    "refresh": "Muat semula",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "pl": {
    "title_page": "Test rozdzielczości",
    "desc": "Wymiary ekranu, okna i devicePixelRatio.",
    "refresh": "Odśwież",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  },
  "uk": {
    "title_page": "Тест роздільної здатності",
    "desc": "Розміри екрана, вікна та devicePixelRatio.",
    "refresh": "Оновити",
    "row_screen": "screen.width × height",
    "avail": "screen.availWidth × availHeight",
    "inner": "window.innerWidth × innerHeight",
    "outer": "window.outerWidth × outerHeight",
    "dpr": "window.devicePixelRatio",
    "orientation": "screen.orientation.type"
  }
}
</i18n>
