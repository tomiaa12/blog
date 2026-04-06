<script setup lang="ts">
import { onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

let audioCtx: AudioContext | null = null
let osc: OscillatorNode | null = null
let gain: GainNode | null = null

function stopTone() {
  try {
    osc?.stop()
  } catch {
    /* already stopped */
  }
  osc = null
  gain = null
  if (audioCtx) {
    void audioCtx.close()
    audioCtx = null
  }
}

async function playTone(freq: number) {
  stopTone()
  try {
    const ctx = new AudioContext()
    audioCtx = ctx
    if (ctx.state === "suspended") await ctx.resume()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    g.gain.value = 0.12
    o.type = "sine"
    o.frequency.value = freq
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    osc = o
    gain = g
  } catch {
    ElMessage({ message: t("msgContext"), type: "warning" })
  }
}

onUnmounted(stopTone)
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-button
        type="primary"
        @click="playTone(220)"
      >
        {{ t("playLow") }}
      </el-button>
      <el-button
        type="primary"
        @click="playTone(1000)"
      >
        {{ t("playMid") }}
      </el-button>
      <el-button
        type="primary"
        @click="playTone(5000)"
      >
        {{ t("playHigh") }}
      </el-button>
      <el-button @click="stopTone">{{ t("stopSound") }}</el-button>
    </div>

    <p class="hint">{{ t("volumeHint") }}</p>
    <p class="hint muted">{{ t("warnContext") }}</p>
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
  margin-bottom: 16px;
}

.hint {
  margin: 14px 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;

  &.muted {
    color: var(--vp-c-text-3);
    margin-top: 8px;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "声音测试",
    "desc": "播放不同频率的正弦测试音，检查扬声器或耳机是否能正常出声。请先调低系统音量再试听。",
    "playLow": "低频 (220 Hz)",
    "playMid": "中频 (1 kHz)",
    "playHigh": "高频 (5 kHz)",
    "stopSound": "停止发声",
    "volumeHint": "若同时点击多个频率，会先停止上一段再播放新的。",
    "warnContext": "部分浏览器需您点击按钮后才会开始播放（音频上下文策略）。"
  },
  "en": {
    "title_page": "Speaker Test",
    "desc": "Play sine test tones at different frequencies. Lower system volume first.",
    "playLow": "Low (220 Hz)",
    "playMid": "Mid (1 kHz)",
    "playHigh": "High (5 kHz)",
    "stopSound": "Stop",
    "volumeHint": "Starting a new tone stops the previous one.",
    "warnContext": "Some browsers require a click before audio can play."
  },
  "ja": {
    "title_page": "スピーカーテスト",
    "desc": "異なる周波数のサイン波でスピーカーやヘッドホンを確認します。音量にご注意ください。",
    "playLow": "低音 220 Hz",
    "playMid": "中音 1 kHz",
    "playHigh": "高音 5 kHz",
    "stopSound": "停止",
    "volumeHint": "新しい音を再生すると前の音は止まります。",
    "warnContext": "クリック後に初めて音が鳴るブラウザがあります。"
  },
  "ko": {
    "title_page": "스피커 테스트",
    "desc": "서로 다른 주파수의 사인파로 스피커나 헤드폰을 확인합니다. 볼륨에 주의하세요.",
    "playLow": "저음 220 Hz",
    "playMid": "중음 1 kHz",
    "playHigh": "고음 5 kHz",
    "stopSound": "정지",
    "volumeHint": "새 음을 재생하면 이전 음이 멈춥니다.",
    "warnContext": "일부 브라우저는 클릭 후에만 소리가 납니다."
  },
  "fr": {
    "title_page": "Test haut-parleur",
    "desc": "Jouez des tonalités sinusoïdales pour vérifier les haut-parleurs ou le casque.",
    "playLow": "Grave (220 Hz)",
    "playMid": "Médium (1 kHz)",
    "playHigh": "Aigu (5 kHz)",
    "stopSound": "Arrêter",
    "volumeHint": "Un nouveau ton arrête le précédent.",
    "warnContext": "Un clic peut être nécessaire avant la lecture audio."
  },
  "de": {
    "title_page": "Lautsprechertest",
    "desc": "Sinustöne verschiedener Frequenzen zur Prüfung von Lautsprecher oder Kopfhörer.",
    "playLow": "Tief (220 Hz)",
    "playMid": "Mittel (1 kHz)",
    "playHigh": "Hoch (5 kHz)",
    "stopSound": "Stopp",
    "volumeHint": "Ein neuer Ton stoppt den vorherigen.",
    "warnContext": "Manche Browser benötigen einen Klick für Audio."
  },
  "es": {
    "title_page": "Prueba de altavoz",
    "desc": "Reproduce tonos sinusoidales para comprobar altavoces o auriculares.",
    "playLow": "Grave (220 Hz)",
    "playMid": "Medio (1 kHz)",
    "playHigh": "Agudo (5 kHz)",
    "stopSound": "Detener",
    "volumeHint": "Un tono nuevo detiene el anterior.",
    "warnContext": "Algunos navegadores requieren un clic para el audio."
  },
  "pt": {
    "title_page": "Teste de som",
    "desc": "Reproduza tons sinusoidais para testar altifalantes ou auscultadores.",
    "playLow": "Grave (220 Hz)",
    "playMid": "Médio (1 kHz)",
    "playHigh": "Agudo (5 kHz)",
    "stopSound": "Parar",
    "volumeHint": "Um novo tom para o anterior.",
    "warnContext": "Alguns navegadores exigem um clique para áudio."
  },
  "ru": {
    "title_page": "Тест динамика",
    "desc": "Синусоидальные сигналы для проверки динамика или наушников.",
    "playLow": "Низ (220 Гц)",
    "playMid": "Середина (1 кГц)",
    "playHigh": "Верх (5 кГц)",
    "stopSound": "Стоп",
    "volumeHint": "Новый тон останавливает предыдущий.",
    "warnContext": "В некоторых браузерах нужен клик для звука."
  },
  "ar": {
    "title_page": "اختبار الصوت",
    "desc": "تشغيل نغمات جيبية لاختبار السماعات أو سماعات الرأس.",
    "playLow": "منخفض (220 هرتز)",
    "playMid": "متوسط (1 كهرتز)",
    "playHigh": "عالٍ (5 كهرتز)",
    "stopSound": "إيقاف",
    "volumeHint": "النغمة الجديدة توقف السابقة.",
    "warnContext": "قد يتطلب المتصفح نقرة لبدء الصوت."
  },
  "hi": {
    "title_page": "स्पीकर टेस्ट",
    "desc": "विभिन्न आवृत्ति पर साइन टोन बजाकर स्पीकर जाँचें।",
    "playLow": "निम्न (220 Hz)",
    "playMid": "मध्य (1 kHz)",
    "playHigh": "उच्च (5 kHz)",
    "stopSound": "रोकें",
    "volumeHint": "नया टोन पुराने को रोक देता है।",
    "warnContext": "कुछ ब्राउज़र में क्लिक ज़रूरी हो सकता है।"
  },
  "it": {
    "title_page": "Test audio",
    "desc": "Riproduci toni sinusoidali per verificare altoparlanti o cuffie.",
    "playLow": "Grave (220 Hz)",
    "playMid": "Medio (1 kHz)",
    "playHigh": "Acuto (5 kHz)",
    "stopSound": "Stop",
    "volumeHint": "Un nuovo tono ferma il precedente.",
    "warnContext": "Alcuni browser richiedono un clic per l'audio."
  },
  "nl": {
    "title_page": "Speakertest",
    "desc": "Speel sinus tonen af om luidsprekers of koptelefoon te testen.",
    "playLow": "Laag (220 Hz)",
    "playMid": "Midden (1 kHz)",
    "playHigh": "Hoog (5 kHz)",
    "stopSound": "Stop",
    "volumeHint": "Een nieuwe toon stopt de vorige.",
    "warnContext": "Sommige browsers vereisen een klik voor audio."
  },
  "tr": {
    "title_page": "Ses testi",
    "desc": "Sinüs tonlarıyla hoparlör veya kulaklığı kontrol edin.",
    "playLow": "Düşük (220 Hz)",
    "playMid": "Orta (1 kHz)",
    "playHigh": "Yüksek (5 kHz)",
    "stopSound": "Durdur",
    "volumeHint": "Yeni ton öncekini durdurur.",
    "warnContext": "Bazı tarayıcılar ses için tıklama ister."
  },
  "vi": {
    "title_page": "Kiểm tra loa",
    "desc": "Phát âm sine ở các tần số để kiểm tra loa hoặc tai nghe.",
    "playLow": "Trầm (220 Hz)",
    "playMid": "Trung (1 kHz)",
    "playHigh": "Cao (5 kHz)",
    "stopSound": "Dừng",
    "volumeHint": "Âm mới sẽ dừng âm trước.",
    "warnContext": "Một số trình duyệt cần nhấp để phát âm thanh."
  },
  "th": {
    "title_page": "ทดสอบเสียง",
    "desc": "เล่นโทนซายน์หลายความถี่เพื่อทดสอบลำโพงหรือหูฟัง",
    "playLow": "เสียงต่ำ (220 Hz)",
    "playMid": "กลาง (1 kHz)",
    "playHigh": "สูง (5 kHz)",
    "stopSound": "หยุด",
    "volumeHint": "โทนใหม่จะหยุดโทนก่อนหน้า",
    "warnContext": "บางเบราว์เซอร์ต้องคลิกก่อนเล่นเสียง"
  },
  "id": {
    "title_page": "Tes speaker",
    "desc": "Putar nada sinus untuk memeriksa speaker atau headphone.",
    "playLow": "Rendah (220 Hz)",
    "playMid": "Sedang (1 kHz)",
    "playHigh": "Tinggi (5 kHz)",
    "stopSound": "Berhenti",
    "volumeHint": "Nada baru menghentikan yang sebelumnya.",
    "warnContext": "Beberapa browser memerlukan klik untuk audio."
  },
  "ms": {
    "title_page": "Ujian pembesar suara",
    "desc": "Mainkan nada sinus untuk uji pembesar suara atau fon kepala.",
    "playLow": "Rendah (220 Hz)",
    "playMid": "Sederhana (1 kHz)",
    "playHigh": "Tinggi (5 kHz)",
    "stopSound": "Henti",
    "volumeHint": "Nada baharu hentikan yang sebelumnya.",
    "warnContext": "Sesetengah pelayar perlukan klik untuk audio."
  },
  "pl": {
    "title_page": "Test głośnika",
    "desc": "Odtwarzaj tony sinusoidalne, aby sprawdzić głośniki lub słuchawki.",
    "playLow": "Niski (220 Hz)",
    "playMid": "Średni (1 kHz)",
    "playHigh": "Wysoki (5 kHz)",
    "stopSound": "Stop",
    "volumeHint": "Nowy ton zatrzymuje poprzedni.",
    "warnContext": "Niektóre przeglądarki wymagają kliknięcia."
  },
  "uk": {
    "title_page": "Тест динаміка",
    "desc": "Відтворення синусоїдальних тонів для перевірки динаміка чи навушників.",
    "playLow": "Низький (220 Гц)",
    "playMid": "Середній (1 кГц)",
    "playHigh": "Високий (5 кГц)",
    "stopSound": "Стоп",
    "volumeHint": "Новий тон зупиняє попередній.",
    "warnContext": "У деяких браузерах потрібен клік для звуку."
  }
}
</i18n>
