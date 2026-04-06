<script setup lang="ts">
import { ref, onUnmounted, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const audioRef = ref<HTMLAudioElement | null>(null)
const objectUrl = ref<string | null>(null)
const fileName = ref("")
const statusText = ref<"idle" | "ready" | "error">("idle")

function revoke() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = null
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  revoke()
  fileName.value = ""
  statusText.value = "idle"
  if (!file) return
  if (!file.type.startsWith("audio/")) {
    ElMessage({ message: t("badType"), type: "warning" })
    input.value = ""
    return
  }
  objectUrl.value = URL.createObjectURL(file)
  fileName.value = file.name
  statusText.value = "ready"
  await nextTick()
  try {
    audioRef.value?.load()
  } catch {
    statusText.value = "error"
    ElMessage({ message: t("loadError"), type: "error" })
  }
}

function onPlayError() {
  statusText.value = "error"
  ElMessage({ message: t("playError"), type: "error" })
}

onUnmounted(revoke)
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="row">
      <label class="file-label">
        <span>{{ t("pickFile") }}</span>
        <input
          type="file"
          accept="audio/*"
          class="file-input"
          @change="onFileChange"
        />
      </label>
    </div>

    <p
      v-if="fileName"
      class="fname"
    >
      {{ fileName }}
    </p>

    <audio
      v-if="objectUrl"
      ref="audioRef"
      class="audio-el"
      controls
      :src="objectUrl"
      @error="onPlayError"
    />

    <p
      v-else
      class="no-file"
    >
      {{ t("noFile") }}
    </p>

    <p
      v-if="statusText === 'ready'"
      class="hint"
    >
      {{ t("readyHint") }}
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
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.row {
  margin-bottom: 12px;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.file-input {
  max-width: 220px;
}

.fname {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  word-break: break-all;
  margin: 0 0 12px;
}

.audio-el {
  width: 100%;
  margin-top: 8px;
}

.no-file {
  margin: 16px 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.hint {
  margin-top: 14px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "音频播放测试",
    "desc": "从本机选择音频文件，使用浏览器内置控件播放，用于检测解码与扬声器链路。文件仅在本地处理，不会上传。",
    "pickFile": "选择音频文件",
    "noFile": "尚未选择文件。",
    "readyHint": "若无法播放，可能是格式不受支持，可尝试 MP3、OGG、WAV 等常见格式。",
    "badType": "请选择音频类型文件。",
    "loadError": "无法加载该音频。",
    "playError": "播放出错，可能是不支持的编码。"
  },
  "en": {
    "title_page": "Audio Playback Test",
    "desc": "Pick a local audio file and play it with the browser player. Nothing is uploaded.",
    "pickFile": "Choose audio file",
    "noFile": "No file selected.",
    "readyHint": "If playback fails, try common formats like MP3, OGG, or WAV.",
    "badType": "Please choose an audio file.",
    "loadError": "Could not load this audio.",
    "playError": "Playback failed; codec may be unsupported."
  },
  "ja": {
    "title_page": "音声再生テスト",
    "desc": "ローカルの音声ファイルを選び、ブラウザで再生してデコードと出力を確認します。アップロードはありません。",
    "pickFile": "音声ファイルを選択",
    "noFile": "ファイルが選ばれていません。",
    "readyHint": "再生できない場合は MP3 / OGG / WAV などを試してください。",
    "badType": "音声ファイルを選んでください。",
    "loadError": "読み込みに失敗しました。",
    "playError": "再生エラー。コーデックが非対応の可能性があります。"
  },
  "ko": {
    "title_page": "오디오 재생 테스트",
    "desc": "로컬 오디오 파일을 선택해 브라우저에서 재생합니다. 업로드되지 않습니다.",
    "pickFile": "오디오 파일 선택",
    "noFile": "선택된 파일이 없습니다.",
    "readyHint": "재생이 안 되면 MP3, OGG, WAV 등을 시도하세요.",
    "badType": "오디오 파일을 선택하세요.",
    "loadError": "로드할 수 없습니다.",
    "playError": "재생 오류. 코덱 미지원일 수 있습니다."
  },
  "fr": {
    "title_page": "Test lecture audio",
    "desc": "Choisissez un fichier audio local et lisez-le dans le navigateur. Aucun envoi.",
    "pickFile": "Choisir un fichier audio",
    "noFile": "Aucun fichier sélectionné.",
    "readyHint": "Essayez MP3, OGG ou WAV si la lecture échoue.",
    "badType": "Veuillez choisir un fichier audio.",
    "loadError": "Impossible de charger l'audio.",
    "playError": "Erreur de lecture ; codec peut-être non pris en charge."
  },
  "de": {
    "title_page": "Audio-Wiedergabetest",
    "desc": "Wählen Sie eine lokale Audiodatei und spielen Sie sie im Browser ab. Kein Upload.",
    "pickFile": "Audiodatei wählen",
    "noFile": "Keine Datei ausgewählt.",
    "readyHint": "Bei Problemen MP3, OGG oder WAV versuchen.",
    "badType": "Bitte eine Audiodatei wählen.",
    "loadError": "Audio konnte nicht geladen werden.",
    "playError": "Wiedergabefehler; Codec evtl. nicht unterstützt."
  },
  "es": {
    "title_page": "Prueba de reproducción de audio",
    "desc": "Elige un archivo de audio local y reprodúcelo en el navegador. Sin subidas.",
    "pickFile": "Elegir archivo de audio",
    "noFile": "Ningún archivo seleccionado.",
    "readyHint": "Prueba MP3, OGG o WAV si falla.",
    "badType": "Elige un archivo de audio.",
    "loadError": "No se pudo cargar el audio.",
    "playError": "Error de reproducción; códec no soportado."
  },
  "pt": {
    "title_page": "Teste de reprodução de áudio",
    "desc": "Escolha um ficheiro de áudio local e reproduza no navegador. Sem envio.",
    "pickFile": "Escolher ficheiro de áudio",
    "noFile": "Nenhum ficheiro selecionado.",
    "readyHint": "Tente MP3, OGG ou WAV se falhar.",
    "badType": "Escolha um ficheiro de áudio.",
    "loadError": "Não foi possível carregar o áudio.",
    "playError": "Erro de reprodução; codec pode não ser suportado."
  },
  "ru": {
    "title_page": "Тест воспроизведения аудио",
    "desc": "Выберите локальный аудиофайл и воспроизведите в браузере. Без загрузки на сервер.",
    "pickFile": "Выбрать аудиофайл",
    "noFile": "Файл не выбран.",
    "readyHint": "При ошибке попробуйте MP3, OGG или WAV.",
    "badType": "Выберите аудиофайл.",
    "loadError": "Не удалось загрузить аудио.",
    "playError": "Ошибка воспроизведения; кодек может не поддерживаться."
  },
  "ar": {
    "title_page": "اختبار تشغيل الصوت",
    "desc": "اختر ملف صوت محلي وشغّله في المتصفح. لا يتم الرفع.",
    "pickFile": "اختر ملف صوت",
    "noFile": "لم يُحدد ملف.",
    "readyHint": "جرّب MP3 أو OGG أو WAV إذا فشل التشغيل.",
    "badType": "يرجى اختيار ملف صوت.",
    "loadError": "تعذر تحميل الصوت.",
    "playError": "خطأ في التشغيل؛ قد لا يكون الترميز مدعومًا."
  },
  "hi": {
    "title_page": "ऑडियो प्लेबैक टेस्ट",
    "desc": "स्थानीय ऑडियो फ़ाइल चुनकर ब्राउज़र में चलाएँ। अपलोड नहीं।",
    "pickFile": "ऑडियो फ़ाइल चुनें",
    "noFile": "कोई फ़ाइल नहीं चुनी।",
    "readyHint": "समस्या हो तो MP3, OGG, WAV आज़माएँ।",
    "badType": "कृपया ऑडियो फ़ाइल चुनें।",
    "loadError": "लोड नहीं हो सका।",
    "playError": "चलाने में त्रुटि।"
  },
  "it": {
    "title_page": "Test riproduzione audio",
    "desc": "Scegli un file audio locale e riproducilo nel browser. Nessun upload.",
    "pickFile": "Scegli file audio",
    "noFile": "Nessun file selezionato.",
    "readyHint": "Prova MP3, OGG o WAV se fallisce.",
    "badType": "Seleziona un file audio.",
    "loadError": "Impossibile caricare l'audio.",
    "playError": "Errore di riproduzione; codec non supportato."
  },
  "nl": {
    "title_page": "Audio-afspeeltest",
    "desc": "Kies een lokaal audiobestand en speel het af in de browser. Geen upload.",
    "pickFile": "Kies audiobestand",
    "noFile": "Geen bestand gekozen.",
    "readyHint": "Probeer MP3, OGG of WAV bij problemen.",
    "badType": "Kies een audiobestand.",
    "loadError": "Audio laden mislukt.",
    "playError": "Afspeelfout; codec mogelijk niet ondersteund."
  },
  "tr": {
    "title_page": "Ses oynatma testi",
    "desc": "Yerel bir ses dosyası seçin ve tarayıcıda çalın. Yükleme yok.",
    "pickFile": "Ses dosyası seç",
    "noFile": "Dosya seçilmedi.",
    "readyHint": "Sorun olursa MP3, OGG veya WAV deneyin.",
    "badType": "Lütfen ses dosyası seçin.",
    "loadError": "Ses yüklenemedi.",
    "playError": "Oynatma hatası; codec desteklenmiyor olabilir."
  },
  "vi": {
    "title_page": "Kiểm tra phát âm thanh",
    "desc": "Chọn tệp âm thanh cục bộ và phát trong trình duyệt. Không tải lên.",
    "pickFile": "Chọn tệp âm thanh",
    "noFile": "Chưa chọn tệp.",
    "readyHint": "Thử MP3, OGG hoặc WAV nếu lỗi.",
    "badType": "Hãy chọn tệp âm thanh.",
    "loadError": "Không tải được âm thanh.",
    "playError": "Lỗi phát; codec có thể không hỗ trợ."
  },
  "th": {
    "title_page": "ทดสอบเล่นเสียง",
    "desc": "เลือกไฟล์เสียงในเครื่องแล้วเล่นในเบราว์เซอร์ ไม่อัปโหลด",
    "pickFile": "เลือกไฟล์เสียง",
    "noFile": "ยังไม่ได้เลือกไฟล์",
    "readyHint": "ลอง MP3, OGG หรือ WAV หากเล่นไม่ได้",
    "badType": "โปรดเลือกไฟล์เสียง",
    "loadError": "โหลดเสียงไม่ได้",
    "playError": "เล่นไม่ได้ อาจไม่รองรับ codec"
  },
  "id": {
    "title_page": "Tes pemutaran audio",
    "desc": "Pilih file audio lokal dan putar di browser. Tidak diunggah.",
    "pickFile": "Pilih file audio",
    "noFile": "Belum ada file dipilih.",
    "readyHint": "Coba MP3, OGG, atau WAV jika gagal.",
    "badType": "Pilih file audio.",
    "loadError": "Gagal memuat audio.",
    "playError": "Gagal memutar; codec mungkin tidak didukung."
  },
  "ms": {
    "title_page": "Ujian main balik audio",
    "desc": "Pilih fail audio tempatan dan main dalam pelayar. Tiada muat naik.",
    "pickFile": "Pilih fail audio",
    "noFile": "Tiada fail dipilih.",
    "readyHint": "Cuba MP3, OGG atau WAV jika gagal.",
    "badType": "Sila pilih fail audio.",
    "loadError": "Gagal memuatkan audio.",
    "playError": "Ralat main; codec mungkin tidak disokong."
  },
  "pl": {
    "title_page": "Test odtwarzania audio",
    "desc": "Wybierz lokalny plik audio i odtwórz w przeglądarce. Bez wysyłania.",
    "pickFile": "Wybierz plik audio",
    "noFile": "Nie wybrano pliku.",
    "readyHint": "Spróbuj MP3, OGG lub WAV przy błędzie.",
    "badType": "Wybierz plik audio.",
    "loadError": "Nie udało się załadować audio.",
    "playError": "Błąd odtwarzania; kodek może być nieobsługiwany."
  },
  "uk": {
    "title_page": "Тест відтворення аудіо",
    "desc": "Виберіть локальний аудіофайл і відтворіть у браузері. Без завантаження.",
    "pickFile": "Вибрати аудіофайл",
    "noFile": "Файл не вибрано.",
    "readyHint": "Спробуйте MP3, OGG або WAV, якщо не працює.",
    "badType": "Виберіть аудіофайл.",
    "loadError": "Не вдалося завантажити аудіо.",
    "playError": "Помилка відтворення; кодек може не підтримуватися."
  }
}
</i18n>
