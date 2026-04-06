<script setup lang="ts">
import { ref, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const running = ref(false)
const fps = ref(0)
let raf = 0
let frames = 0
let last = performance.now()

function tick(now: number) {
  if (!running.value) return
  frames += 1
  const elapsed = now - last
  if (elapsed >= 500) {
    fps.value = Math.round((frames * 1000) / elapsed)
    frames = 0
    last = now
  }
  raf = requestAnimationFrame(tick)
}

function start() {
  if (running.value) return
  running.value = true
  frames = 0
  last = performance.now()
  raf = requestAnimationFrame(tick)
}

function stop() {
  running.value = false
  cancelAnimationFrame(raf)
  fps.value = 0
}

onUnmounted(stop)
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-button
        type="primary"
        :disabled="running"
        @click="start"
      >
        {{ t("start") }}
      </el-button>
      <el-button
        :disabled="!running"
        @click="stop"
      >
        {{ t("stop") }}
      </el-button>
    </div>

    <div
      class="fps-display"
      :data-on="running"
    >
      <span class="fps-num">{{ running ? fps : "—" }}</span>
      <span class="fps-unit">FPS</span>
    </div>

    <p class="hint">{{ t("hint") }}</p>
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
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.fps-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  margin-bottom: 16px;

  &[data-on="true"] .fps-num {
    color: var(--vp-c-brand-1);
  }
}

.fps-num {
  font-size: 3rem;
  font-weight: 800;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  line-height: 1;
}

.fps-unit {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

.hint {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "FPS 测试",
    "desc": "通过 requestAnimationFrame 估算当前标签页的动画帧率，数值会随页面负载与显示器刷新率变化，仅供参考。",
    "start": "开始统计",
    "stop": "停止",
    "hint": "与独占全屏游戏内的 FPS 不同；省电模式或后台标签会降低帧率。"
  },
  "en": {
    "title_page": "FPS Test",
    "desc": "Estimates animation FPS via requestAnimationFrame. Values vary with load and display refresh.",
    "start": "Start",
    "stop": "Stop",
    "hint": "This is not the same as in-game FPS; background tabs or power saving may lower it."
  },
  "ja": {
    "title_page": "FPS テスト",
    "desc": "requestAnimationFrame でフレームレートを推定します。負荷やディスプレイに依存します。",
    "start": "開始",
    "stop": "停止",
    "hint": "ゲーム内 FPS とは異なります。省電力で下がることがあります。"
  },
  "ko": {
    "title_page": "FPS 테스트",
    "desc": "requestAnimationFrame으로 프레임 속도를 추정합니다.",
    "start": "시작",
    "stop": "중지",
    "hint": "게임 내 FPS와 다를 수 있습니다."
  },
  "fr": {
    "title_page": "Test FPS",
    "desc": "Estime les FPS via requestAnimationFrame.",
    "start": "Démarrer",
    "stop": "Arrêter",
    "hint": "Différent du FPS en jeu plein écran."
  },
  "de": {
    "title_page": "FPS-Test",
    "desc": "Schätzt die FPS über requestAnimationFrame.",
    "start": "Start",
    "stop": "Stopp",
    "hint": "Nicht gleich Ingame-FPS."
  },
  "es": {
    "title_page": "Prueba FPS",
    "desc": "Estima FPS con requestAnimationFrame.",
    "start": "Iniciar",
    "stop": "Detener",
    "hint": "No es lo mismo que FPS en juego."
  },
  "pt": {
    "title_page": "Teste FPS",
    "desc": "Estima FPS via requestAnimationFrame.",
    "start": "Iniciar",
    "stop": "Parar",
    "hint": "Diferente do FPS em jogo."
  },
  "ru": {
    "title_page": "Тест FPS",
    "desc": "Оценка FPS через requestAnimationFrame.",
    "start": "Старт",
    "stop": "Стоп",
    "hint": "Не то же самое, что FPS в игре."
  },
  "ar": {
    "title_page": "اختبار FPS",
    "desc": "تقدير معدل الإطارات عبر requestAnimationFrame.",
    "start": "بدء",
    "stop": "إيقاف",
    "hint": "ليس مثل FPS داخل اللعبة."
  },
  "hi": {
    "title_page": "FPS टेस्ट",
    "desc": "requestAnimationFrame से FPS अनुमान।",
    "start": "शुरू",
    "stop": "रोकें",
    "hint": "गेम FPS जैसा नहीं।"
  },
  "it": {
    "title_page": "Test FPS",
    "desc": "Stima gli FPS con requestAnimationFrame.",
    "start": "Avvia",
    "stop": "Stop",
    "hint": "Non è come gli FPS in gioco."
  },
  "nl": {
    "title_page": "FPS-test",
    "desc": "Schat FPS via requestAnimationFrame.",
    "start": "Start",
    "stop": "Stop",
    "hint": "Niet hetzelfde als in-game FPS."
  },
  "tr": {
    "title_page": "FPS testi",
    "desc": "requestAnimationFrame ile FPS tahmini.",
    "start": "Başlat",
    "stop": "Durdur",
    "hint": "Oyun içi FPS ile aynı değil."
  },
  "vi": {
    "title_page": "Kiểm tra FPS",
    "desc": "Ước lượng FPS qua requestAnimationFrame.",
    "start": "Bắt đầu",
    "stop": "Dừng",
    "hint": "Khác FPS trong game."
  },
  "th": {
    "title_page": "ทดสอบ FPS",
    "desc": "ประมาณ FPS ด้วย requestAnimationFrame",
    "start": "เริ่ม",
    "stop": "หยุด",
    "hint": "ไม่เหมือน FPS ในเกม"
  },
  "id": {
    "title_page": "Tes FPS",
    "desc": "Perkiraan FPS lewat requestAnimationFrame.",
    "start": "Mulai",
    "stop": "Berhenti",
    "hint": "Bukan FPS dalam game."
  },
  "ms": {
    "title_page": "Ujian FPS",
    "desc": "Anggaran FPS melalui requestAnimationFrame.",
    "start": "Mula",
    "stop": "Henti",
    "hint": "Bukan FPS dalam permainan."
  },
  "pl": {
    "title_page": "Test FPS",
    "desc": "Szacuje FPS przez requestAnimationFrame.",
    "start": "Start",
    "stop": "Stop",
    "hint": "To nie to samo co FPS w grze."
  },
  "uk": {
    "title_page": "Тест FPS",
    "desc": "Оцінка FPS через requestAnimationFrame.",
    "start": "Почати",
    "stop": "Зупинити",
    "hint": "Не те саме, що FPS у грі."
  }
}
</i18n>
