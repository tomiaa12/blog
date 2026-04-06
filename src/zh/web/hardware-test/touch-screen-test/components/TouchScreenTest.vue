<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

type TPoint = { id: number; x: number; y: number }
const points = ref<TPoint[]>([])

function sync(e: TouchEvent) {
  points.value = Array.from(e.touches).map(touch => ({
    id: touch.identifier,
    x: Math.round(touch.clientX),
    y: Math.round(touch.clientY),
  }))
}

function clear() {
  points.value = []
}
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div
      class="panel"
      style="touch-action: none"
      @touchstart.prevent="sync"
      @touchmove.prevent="sync"
      @touchend.prevent="sync"
      @touchcancel.prevent="clear"
    >
      {{ t("panelHint") }}
    </div>

    <template v-if="points.length">
      <h2 class="sub">{{ t("touchListTitle") }}</h2>
      <ul class="list">
        <li
          v-for="p in points"
          :key="p.id"
          class="item"
        >
          <span class="mono">id={{ p.id }}</span>
          <span class="mono">client {{ p.x }}, {{ p.y }}</span>
        </li>
      </ul>
    </template>
    <p
      v-else
      class="empty"
    >
      {{ t("noTouches") }}
    </p>
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

.panel {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  border-radius: 10px;
  border: 2px dashed var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.sub {
  font-size: 1rem;
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 0.9rem;
}

.mono {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}

.empty {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "触摸屏测试",
    "desc": "在下方区域用单指或多指触摸，可查看每个触点的 identifier 与 client 坐标。需支持触控的屏幕或设备。",
    "panelHint": "在此区域触摸（可多点）…",
    "touchListTitle": "当前触点",
    "noTouches": "当前无触点。请在上方区域触摸屏幕。"
  },
  "en": {
    "title_page": "Touch Screen Test",
    "desc": "Touch with one or more fingers in the area below to see identifiers and client coordinates.",
    "panelHint": "Touch here (multi-touch supported)…",
    "touchListTitle": "Active touches",
    "noTouches": "No active touches. Touch the area above."
  },
  "ja": {
    "title_page": "タッチスクリーンテスト",
    "desc": "枠内を指で触れ、識別子と座標を確認します。タッチ対応端末が必要です。",
    "panelHint": "ここをタッチ（マルチタッチ可）…",
    "touchListTitle": "現在のタッチ",
    "noTouches": "タッチがありません。上の枠に触れてください。"
  },
  "ko": {
    "title_page": "터치 스크린 테스트",
    "desc": "영역에 손가락으로 터치하면 식별자와 좌표가 표시됩니다.",
    "panelHint": "여기를 터치하세요 (멀티터치)…",
    "touchListTitle": "활성 터치",
    "noTouches": "터치가 없습니다. 위 영역을 터치하세요."
  },
  "fr": {
    "title_page": "Test écran tactile",
    "desc": "Touchez la zone avec un ou plusieurs doigts pour voir les identifiants et coordonnées.",
    "panelHint": "Touchez ici (multi-touch)…",
    "touchListTitle": "Touches actives",
    "noTouches": "Aucun toucher. Touchez la zone ci-dessus."
  },
  "de": {
    "title_page": "Touchscreen-Test",
    "desc": "Berühren Sie den Bereich mit einem oder mehreren Fingern.",
    "panelHint": "Hier berühren (Multi-Touch)…",
    "touchListTitle": "Aktive Berührungen",
    "noTouches": "Keine Berührung. Bereich oben berühren."
  },
  "es": {
    "title_page": "Prueba de pantalla táctil",
    "desc": "Toca el área con uno o más dedos para ver identificadores y coordenadas.",
    "panelHint": "Toca aquí (multitáctil)…",
    "touchListTitle": "Toques activos",
    "noTouches": "Sin toques. Toca el área de arriba."
  },
  "pt": {
    "title_page": "Teste de ecrã tátil",
    "desc": "Toque na área com um ou mais dedos para ver identificadores e coordenadas.",
    "panelHint": "Toque aqui (multi-toque)…",
    "touchListTitle": "Toques ativos",
    "noTouches": "Sem toques. Toque na área acima."
  },
  "ru": {
    "title_page": "Тест сенсорного экрана",
    "desc": "Касайтесь области одним или несколькими пальцами.",
    "panelHint": "Коснитесь здесь (мультитач)…",
    "touchListTitle": "Активные касания",
    "noTouches": "Нет касаний. Коснитесь области выше."
  },
  "ar": {
    "title_page": "اختبار الشاشة اللمسية",
    "desc": "المس المنطقة بإصبع أو أكثر لرؤية المعرفات والإحداثيات.",
    "panelHint": "المس هنا (لمس متعدد)…",
    "touchListTitle": "اللمسات النشطة",
    "noTouches": "لا توجد لمسات. المس المنطقة أعلاه."
  },
  "hi": {
    "title_page": "टच स्क्रीन टेस्ट",
    "desc": "क्षेत्र को छुएँ, पहचान और निर्देशांक देखें।",
    "panelHint": "यहाँ छुएँ (मल्टी-टच)…",
    "touchListTitle": "सक्रिय स्पर्श",
    "noTouches": "कोई स्पर्श नहीं। ऊपर के क्षेत्र को छुएँ।"
  },
  "it": {
    "title_page": "Test touch screen",
    "desc": "Tocca l'area con una o più dita per vedere ID e coordinate.",
    "panelHint": "Tocca qui (multi-touch)…",
    "touchListTitle": "Tocchi attivi",
    "noTouches": "Nessun tocco. Tocca l'area sopra."
  },
  "nl": {
    "title_page": "Touchscreen test",
    "desc": "Raak het gebied aan met één of meer vingers.",
    "panelHint": "Raak hier aan (multi-touch)…",
    "touchListTitle": "Actieve aanrakingen",
    "noTouches": "Geen aanraking. Raak het gebied hierboven aan."
  },
  "tr": {
    "title_page": "Dokunmatik ekran testi",
    "desc": "Alana bir veya daha fazla parmakla dokunun.",
    "panelHint": "Buraya dokunun (çoklu dokunma)…",
    "touchListTitle": "Aktif dokunuşlar",
    "noTouches": "Dokunuş yok. Yukarıdaki alana dokunun."
  },
  "vi": {
    "title_page": "Kiểm tra cảm ứng",
    "desc": "Chạm vào vùng bằng một hoặc nhiều ngón tay.",
    "panelHint": "Chạm vào đây (đa điểm)…",
    "touchListTitle": "Điểm chạm đang hoạt động",
    "noTouches": "Chưa có điểm chạm. Chạm vùng phía trên."
  },
  "th": {
    "title_page": "ทดสอบหน้าจอสัมผัส",
    "desc": "สัมผัสพื้นที่ด้วยนิ้วหนึ่งหรือหลายนิ้ว",
    "panelHint": "สัมผัสที่นี่ (หลายจุด)…",
    "touchListTitle": "จุดสัมผัสที่ใช้งาน",
    "noTouches": "ยังไม่มีการสัมผัส แตะพื้นที่ด้านบน"
  },
  "id": {
    "title_page": "Tes layar sentuh",
    "desc": "Sentuh area dengan satu atau lebih jari.",
    "panelHint": "Sentuh di sini (multi-touch)…",
    "touchListTitle": "Sentuhan aktif",
    "noTouches": "Tidak ada sentuhan. Sentuh area di atas."
  },
  "ms": {
    "title_page": "Ujian skrin sentuh",
    "desc": "Sentuh kawasan dengan satu atau lebih jari.",
    "panelHint": "Sentuh di sini (multi-sentuh)…",
    "touchListTitle": "Sentuhan aktif",
    "noTouches": "Tiada sentuhan. Sentuh kawasan di atas."
  },
  "pl": {
    "title_page": "Test ekranu dotykowego",
    "desc": "Dotknij obszaru jednym lub większą liczbą palców.",
    "panelHint": "Dotknij tutaj (multi-touch)…",
    "touchListTitle": "Aktywne dotknięcia",
    "noTouches": "Brak dotknięć. Dotknij obszaru powyżej."
  },
  "uk": {
    "title_page": "Тест сенсорного екрана",
    "desc": "Торкніться області одним або кількома пальцями.",
    "panelHint": "Торкніться тут (мультитач)…",
    "touchListTitle": "Активні дотики",
    "noTouches": "Немає дотиків. Торкніться області вище."
  }
}
</i18n>
