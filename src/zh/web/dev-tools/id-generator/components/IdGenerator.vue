<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { ensureUlid } from "./loadUlid"

const { t } = useI18n()

type Kind = "uuid" | "ulid" | "token"
type UuidVer = "v4" | "v7"
type TokenSet = "hex" | "base64url" | "alnum" | "digits" | "custom"

const HEX = "0123456789abcdef"
const BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
const ALNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const DIGITS = "0123456789"

const kind = ref<Kind>("uuid")
const count = ref(10)
const uuidVer = ref<UuidVer>("v4")
const uuidUpper = ref(false)
const uuidHyphen = ref(true)
const ulidMono = ref(true)
const tokenLen = ref(32)
const tokenSet = ref<TokenSet>("hex")
const customAlpha = ref("ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789")
const lines = ref<string[]>([])
const running = ref(false)

const text = computed(() => lines.value.join("\n"))

function randBytes(n: number) {
  const bytes = new Uint8Array(n)
  crypto.getRandomValues(bytes)
  return bytes
}

function pick(alphabet: string, len: number) {
  const bytes = randBytes(len)
  let out = ""
  for (let i = 0; i < len; i++) out += alphabet[bytes[i]! % alphabet.length]
  return out
}

function uuidV4() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
  const b = randBytes(16)
  b[6] = (b[6]! & 0x0f) | 0x40
  b[8] = (b[8]! & 0x3f) | 0x80
  const h = [...b].map(x => x.toString(16).padStart(2, "0")).join("")
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

function uuidV7() {
  const b = randBytes(16)
  const ms = BigInt(Date.now())
  b[0] = Number((ms >> 40n) & 0xffn)
  b[1] = Number((ms >> 32n) & 0xffn)
  b[2] = Number((ms >> 24n) & 0xffn)
  b[3] = Number((ms >> 16n) & 0xffn)
  b[4] = Number((ms >> 8n) & 0xffn)
  b[5] = Number(ms & 0xffn)
  b[6] = (b[6]! & 0x0f) | 0x70
  b[8] = (b[8]! & 0x3f) | 0x80
  const h = [...b].map(x => x.toString(16).padStart(2, "0")).join("")
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

function formatUuid(id: string) {
  let out = uuidHyphen.value ? id : id.replace(/-/g, "")
  if (uuidUpper.value) out = out.toUpperCase()
  return out
}

function tokenAlphabet() {
  if (tokenSet.value === "hex") return HEX
  if (tokenSet.value === "base64url") return BASE64URL
  if (tokenSet.value === "alnum") return ALNUM
  if (tokenSet.value === "digits") return DIGITS
  return customAlpha.value.replace(/\s/g, "")
}

async function generate() {
  const n = Math.min(500, Math.max(1, Math.round(count.value) || 1))
  count.value = n
  running.value = true
  try {
    const out: string[] = []
    if (kind.value === "uuid") {
      for (let i = 0; i < n; i++) {
        out.push(formatUuid(uuidVer.value === "v7" ? uuidV7() : uuidV4()))
      }
    } else if (kind.value === "ulid") {
      const lib = await ensureUlid()
      const next = ulidMono.value ? lib.monotonicFactory() : lib.ulid
      for (let i = 0; i < n; i++) out.push(next())
    } else {
      const alpha = tokenAlphabet()
      if (alpha.length < 2) {
        ElMessage({ message: t("msgAlpha"), type: "warning" })
        return
      }
      const len = Math.min(256, Math.max(4, Math.round(tokenLen.value) || 32))
      tokenLen.value = len
      for (let i = 0; i < n; i++) out.push(pick(alpha, len))
    }
    lines.value = out
  } catch {
    ElMessage({
      message: kind.value === "ulid" ? t("msgLib") : t("msgFail"),
      type: "error",
    })
  } finally {
    running.value = false
  }
}

async function copyAll() {
  if (!text.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  await copyToClipboard(text.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

async function copyOne(id: string) {
  await copyToClipboard(id)
  ElMessage({ message: t("copied"), type: "success", duration: 1200 })
}

function download() {
  if (!text.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([text.value], { type: "text/plain;charset=utf-8" }))
  a.download = `${kind.value}s.txt`
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

function clearAll() {
  lines.value = []
}

void generate()
</script>

<template>
  <div class="id-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-radio-group v-model="kind">
        <el-radio-button value="uuid">UUID</el-radio-button>
        <el-radio-button value="ulid">ULID</el-radio-button>
        <el-radio-button value="token">Token</el-radio-button>
      </el-radio-group>
      <span class="opt-label">{{ t("count") }}</span>
      <el-input-number
        v-model="count"
        :min="1"
        :max="500"
        :step="1"
        controls-position="right"
      />
    </div>

    <div
      v-if="kind === 'uuid'"
      class="toolbar"
    >
      <el-radio-group v-model="uuidVer">
        <el-radio-button value="v4">UUID v4</el-radio-button>
        <el-radio-button value="v7">UUID v7</el-radio-button>
      </el-radio-group>
      <el-checkbox v-model="uuidHyphen">{{ t("hyphen") }}</el-checkbox>
      <el-checkbox v-model="uuidUpper">{{ t("upper") }}</el-checkbox>
    </div>

    <div
      v-else-if="kind === 'ulid'"
      class="toolbar"
    >
      <el-checkbox v-model="ulidMono">{{ t("mono") }}</el-checkbox>
      <span class="hint">{{ t("ulidHint") }}</span>
    </div>

    <div
      v-else
      class="toolbar token-bar"
    >
      <span class="opt-label">{{ t("length") }}</span>
      <el-input-number
        v-model="tokenLen"
        :min="4"
        :max="256"
        :step="1"
        controls-position="right"
      />
      <el-radio-group v-model="tokenSet">
        <el-radio-button value="hex">Hex</el-radio-button>
        <el-radio-button value="base64url">Base64URL</el-radio-button>
        <el-radio-button value="alnum">{{ t("alnum") }}</el-radio-button>
        <el-radio-button value="digits">{{ t("digits") }}</el-radio-button>
        <el-radio-button value="custom">{{ t("custom") }}</el-radio-button>
      </el-radio-group>
      <el-input
        v-if="tokenSet === 'custom'"
        v-model="customAlpha"
        class="alpha"
        :placeholder="t('alphaPh')"
      />
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="generate"
      >
        {{ t("generate") }}
      </el-button>
      <el-button @click="copyAll">{{ t("copy") }}</el-button>
      <el-button @click="download">{{ t("download") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
      <span class="meta">{{ t("ready", { n: lines.length }) }}</span>
    </div>

    <el-input
      :model-value="text"
      type="textarea"
      :rows="14"
      readonly
      class="code-area"
      :placeholder="t('placeholder')"
    />

    <div
      v-if="lines.length && lines.length <= 40"
      class="chips"
    >
      <button
        v-for="(id, i) in lines"
        :key="i"
        type="button"
        class="chip"
        @click="copyOne(id)"
      >
        {{ id }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.id-page {
  max-width: 960px;
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  padding: 24px 16px 48px;
  box-sizing: border-box;
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

.toolbar,
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.token-bar {
  align-items: flex-start;
}

.opt-label,
.meta,
.hint {
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
}

.alpha {
  min-width: 260px;
  flex: 1;
}

.code-area {
  max-width: 100%;
  min-width: 0;

  :deep(textarea) {
    font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
    font-size: 0.88rem;
    line-height: 1.55;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.chip {
  max-width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  word-break: break-all;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "UUID / ULID / Token 生成器",
    "desc": "批量生成 UUID、ULID 或随机 Token。UUID 与 Token 用浏览器加密接口，ULID 首次从 CDN 加载。全部在本地完成。",
    "count": "数量",
    "hyphen": "带连字符",
    "upper": "大写",
    "mono": "单调递增",
    "ulidHint": "同一毫秒内也保持可排序。首次会加载 ulid 库。",
    "length": "长度",
    "alnum": "字母数字",
    "digits": "纯数字",
    "custom": "自定义字符",
    "alphaPh": "用作随机源的字符",
    "generate": "生成",
    "copy": "复制全部",
    "download": "下载",
    "clear": "清空",
    "ready": "已生成 {n} 条",
    "placeholder": "点击「生成」后显示结果",
    "copied": "已复制",
    "msgEmpty": "还没有可复制的结果。",
    "msgFail": "生成失败。",
    "msgLib": "ULID 库加载失败，请检查网络后重试。",
    "msgAlpha": "自定义字符至少需要 2 个。"
  },
  "zh-CN": {
    "title_page": "UUID / ULID / Token 生成器",
    "desc": "批量生成 UUID、ULID 或随机 Token。UUID 与 Token 用浏览器加密接口，ULID 首次从 CDN 加载。全部在本地完成。",
    "count": "数量",
    "hyphen": "带连字符",
    "upper": "大写",
    "mono": "单调递增",
    "ulidHint": "同一毫秒内也保持可排序。首次会加载 ulid 库。",
    "length": "长度",
    "alnum": "字母数字",
    "digits": "纯数字",
    "custom": "自定义字符",
    "alphaPh": "用作随机源的字符",
    "generate": "生成",
    "copy": "复制全部",
    "download": "下载",
    "clear": "清空",
    "ready": "已生成 {n} 条",
    "placeholder": "点击「生成」后显示结果",
    "copied": "已复制",
    "msgEmpty": "还没有可复制的结果。",
    "msgFail": "生成失败。",
    "msgLib": "ULID 库加载失败，请检查网络后重试。",
    "msgAlpha": "自定义字符至少需要 2 个。"
  },
  "en": {
    "title_page": "UUID / ULID / Token generator",
    "desc": "Generate UUIDs, ULIDs, or random tokens in bulk. UUID and tokens use the Web Crypto API. ULID loads from a CDN on first use. Everything stays local.",
    "count": "Count",
    "hyphen": "Hyphens",
    "upper": "Uppercase",
    "mono": "Monotonic",
    "ulidHint": "Stays sortable even in the same millisecond. Loads the ulid library first.",
    "length": "Length",
    "alnum": "Alphanumeric",
    "digits": "Digits",
    "custom": "Custom chars",
    "alphaPh": "Characters to sample from",
    "generate": "Generate",
    "copy": "Copy all",
    "download": "Download",
    "clear": "Clear",
    "ready": "{n} generated",
    "placeholder": "Results appear after Generate",
    "copied": "Copied",
    "msgEmpty": "Nothing to copy yet.",
    "msgFail": "Could not generate IDs.",
    "msgLib": "Could not load the ULID library. Check your network and retry.",
    "msgAlpha": "Custom alphabet needs at least 2 characters."
  },
  "ja": {
    "title_page": "UUID / ULID / Token 生成",
    "desc": "UUID・ULID・ランダム Token を一括生成。UUID と Token は Web Crypto、ULID は初回 CDN 読み込み。すべて端末内です。",
    "count": "件数",
    "hyphen": "ハイフン",
    "upper": "大文字",
    "mono": "単調増加",
    "ulidHint": "同一ミリ秒でも並び順を保ちます。初回は ulid を読み込みます。",
    "length": "長さ",
    "alnum": "英数字",
    "digits": "数字のみ",
    "custom": "任意文字",
    "alphaPh": "抽選する文字",
    "generate": "生成",
    "copy": "すべてコピー",
    "download": "保存",
    "clear": "クリア",
    "ready": "{n} 件生成",
    "placeholder": "「生成」後に表示されます",
    "copied": "コピーしました",
    "msgEmpty": "コピーできる結果がありません。",
    "msgFail": "生成に失敗しました。",
    "msgLib": "ULID の読み込みに失敗しました。通信を確認して再試行してください。",
    "msgAlpha": "任意文字は 2 文字以上必要です。"
  },
  "ko": {
    "title_page": "UUID / ULID / Token 생성기",
    "desc": "UUID, ULID, 무작위 Token을 한꺼번에 만듭니다. UUID와 Token은 Web Crypto를 쓰고, ULID는 처음 CDN에서 불러옵니다. 모두 로컬입니다.",
    "count": "개수",
    "hyphen": "하이픈",
    "upper": "대문자",
    "mono": "단조 증가",
    "ulidHint": "같은 밀리초에도 정렬됩니다. 처음 ulid 라이브러리를 불러옵니다.",
    "length": "길이",
    "alnum": "영숫자",
    "digits": "숫자만",
    "custom": "사용자 문자",
    "alphaPh": "뽑을 문자",
    "generate": "생성",
    "copy": "모두 복사",
    "download": "다운로드",
    "clear": "지우기",
    "ready": "{n}개 생성됨",
    "placeholder": "생성 후 결과가 나타납니다",
    "copied": "복사됨",
    "msgEmpty": "복사할 결과가 없습니다.",
    "msgFail": "생성에 실패했습니다.",
    "msgLib": "ULID 라이브러리를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도하세요.",
    "msgAlpha": "사용자 문자는 2자 이상이어야 합니다."
  },
  "fr": {
    "title_page": "Générateur UUID / ULID / Token",
    "desc": "Générez des UUID, ULID ou jetons aléatoires. UUID et jetons via Web Crypto. ULID se charge depuis un CDN. Tout reste local.",
    "count": "Nombre",
    "hyphen": "Tirets",
    "upper": "Majuscules",
    "mono": "Monotone",
    "ulidHint": "Reste triable dans la même milliseconde. Charge ulid au premier usage.",
    "length": "Longueur",
    "alnum": "Alphanumérique",
    "digits": "Chiffres",
    "custom": "Caractères perso",
    "alphaPh": "Caractères à tirer",
    "generate": "Générer",
    "copy": "Tout copier",
    "download": "Télécharger",
    "clear": "Effacer",
    "ready": "{n} générés",
    "placeholder": "Les résultats apparaissent après Générer",
    "copied": "Copié",
    "msgEmpty": "Rien à copier pour l’instant.",
    "msgFail": "Échec de la génération.",
    "msgLib": "Impossible de charger ULID. Vérifiez le réseau et réessayez.",
    "msgAlpha": "L’alphabet perso doit avoir au moins 2 caractères."
  },
  "de": {
    "title_page": "UUID- / ULID- / Token-Generator",
    "desc": "UUIDs, ULIDs oder Zufallstoken stapelweise erzeugen. UUID und Token per Web Crypto. ULID kommt beim ersten Mal vom CDN. Alles lokal.",
    "count": "Anzahl",
    "hyphen": "Bindestriche",
    "upper": "Großbuchstaben",
    "mono": "Monoton",
    "ulidHint": "Bleibt auch in derselben Millisekunde sortierbar. Lädt ulid zuerst.",
    "length": "Länge",
    "alnum": "Alphanumerisch",
    "digits": "Ziffern",
    "custom": "Eigene Zeichen",
    "alphaPh": "Zeichen zum Ziehen",
    "generate": "Erzeugen",
    "copy": "Alle kopieren",
    "download": "Download",
    "clear": "Leeren",
    "ready": "{n} erzeugt",
    "placeholder": "Ergebnis nach Erzeugen",
    "copied": "Kopiert",
    "msgEmpty": "Noch nichts zum Kopieren.",
    "msgFail": "Erzeugen fehlgeschlagen.",
    "msgLib": "ULID-Bibliothek konnte nicht geladen werden. Netzwerk prüfen und erneut versuchen.",
    "msgAlpha": "Eigenes Alphabet braucht mindestens 2 Zeichen."
  },
  "es": {
    "title_page": "Generador UUID / ULID / Token",
    "desc": "Genera UUID, ULID o tokens aleatorios. UUID y tokens usan Web Crypto. ULID se carga desde un CDN. Todo es local.",
    "count": "Cantidad",
    "hyphen": "Guiones",
    "upper": "Mayúsculas",
    "mono": "Monótono",
    "ulidHint": "Sigue siendo ordenable en el mismo milisegundo. Carga ulid la primera vez.",
    "length": "Longitud",
    "alnum": "Alfanumérico",
    "digits": "Dígitos",
    "custom": "Caracteres propios",
    "alphaPh": "Caracteres a muestrear",
    "generate": "Generar",
    "copy": "Copiar todo",
    "download": "Descargar",
    "clear": "Vaciar",
    "ready": "{n} generados",
    "placeholder": "El resultado aparece tras Generar",
    "copied": "Copiado",
    "msgEmpty": "Aún no hay nada que copiar.",
    "msgFail": "Error al generar.",
    "msgLib": "No se pudo cargar ULID. Revisa la red e inténtalo de nuevo.",
    "msgAlpha": "El alfabeto propio necesita al menos 2 caracteres."
  },
  "pt": {
    "title_page": "Gerador UUID / ULID / Token",
    "desc": "Gere UUIDs, ULIDs ou tokens aleatórios. UUID e tokens usam Web Crypto. ULID vem de um CDN. Tudo fica no dispositivo.",
    "count": "Quantidade",
    "hyphen": "Hífens",
    "upper": "Maiúsculas",
    "mono": "Monotônico",
    "ulidHint": "Continua ordenável no mesmo milissegundo. Carrega ulid na primeira vez.",
    "length": "Comprimento",
    "alnum": "Alfanumérico",
    "digits": "Dígitos",
    "custom": "Caracteres próprios",
    "alphaPh": "Caracteres para sortear",
    "generate": "Gerar",
    "copy": "Copiar tudo",
    "download": "Baixar",
    "clear": "Limpar",
    "ready": "{n} gerados",
    "placeholder": "O resultado aparece após Gerar",
    "copied": "Copiado",
    "msgEmpty": "Ainda não há o que copiar.",
    "msgFail": "Falha ao gerar.",
    "msgLib": "Não foi possível carregar o ULID. Verifique a rede e tente de novo.",
    "msgAlpha": "O alfabeto próprio precisa de pelo menos 2 caracteres."
  },
  "ru": {
    "title_page": "Генератор UUID / ULID / Token",
    "desc": "Пакетно создавайте UUID, ULID или случайные токены. UUID и токены — Web Crypto. ULID с CDN при первом запуске. Всё локально.",
    "count": "Количество",
    "hyphen": "Дефисы",
    "upper": "Прописные",
    "mono": "Монотонный",
    "ulidHint": "Остаётся сортируемым в ту же миллисекунду. Сначала загружается ulid.",
    "length": "Длина",
    "alnum": "Буквы и цифры",
    "digits": "Только цифры",
    "custom": "Свои символы",
    "alphaPh": "Символы для выборки",
    "generate": "Сгенерировать",
    "copy": "Копировать всё",
    "download": "Скачать",
    "clear": "Очистить",
    "ready": "Создано {n}",
    "placeholder": "Результат появится после генерации",
    "copied": "Скопировано",
    "msgEmpty": "Пока нечего копировать.",
    "msgFail": "Ошибка генерации.",
    "msgLib": "Не удалось загрузить ULID. Проверьте сеть и повторите.",
    "msgAlpha": "Свой алфавит должен содержать хотя бы 2 символа."
  },
  "ar": {
    "title_page": "مولّد UUID / ULID / Token",
    "desc": "ولّد UUID أو ULID أو رموزًا عشوائية دفعة واحدة. UUID والرموز عبر Web Crypto. يُحمَّل ULID من CDN أول مرة. كل شيء محلي.",
    "count": "العدد",
    "hyphen": "شرطات",
    "upper": "أحرف كبيرة",
    "mono": "رتيب",
    "ulidHint": "يبقى قابلاً للترتيب في نفس المللي ثانية. يحمّل ulid أولاً.",
    "length": "الطول",
    "alnum": "أحرف وأرقام",
    "digits": "أرقام فقط",
    "custom": "أحرف مخصصة",
    "alphaPh": "الأحرف للاختيار منها",
    "generate": "توليد",
    "copy": "نسخ الكل",
    "download": "تنزيل",
    "clear": "مسح",
    "ready": "تم توليد {n}",
    "placeholder": "تظهر النتائج بعد التوليد",
    "copied": "تم النسخ",
    "msgEmpty": "لا يوجد ما يُنسخ بعد.",
    "msgFail": "فشل التوليد.",
    "msgLib": "تعذر تحميل ULID. تحقق من الشبكة ثم أعد المحاولة.",
    "msgAlpha": "الأحرف المخصصة تحتاج حرفين على الأقل."
  },
  "hi": {
    "title_page": "UUID / ULID / Token जनरेटर",
    "desc": "UUID, ULID या यादृच्छिक Token एक साथ बनाएँ। UUID और Token Web Crypto से, ULID पहली बार CDN से। सब स्थानीय रहता है।",
    "count": "संख्या",
    "hyphen": "हाइफ़न",
    "upper": "बड़े अक्षर",
    "mono": "मोनोटोनिक",
    "ulidHint": "उसी मिलीसेकंड में भी क्रमबद्ध रहता है। पहले ulid लोड होता है।",
    "length": "लंबाई",
    "alnum": "अक्षर-अंक",
    "digits": "केवल अंक",
    "custom": "कस्टम अक्षर",
    "alphaPh": "चुनने के अक्षर",
    "generate": "बनाएँ",
    "copy": "सब कॉपी",
    "download": "डाउनलोड",
    "clear": "साफ़",
    "ready": "{n} बने",
    "placeholder": "बनाने के बाद परिणाम दिखेगा",
    "copied": "कॉपी हो गया",
    "msgEmpty": "अभी कॉपी करने को कुछ नहीं।",
    "msgFail": "बनाना असफल।",
    "msgLib": "ULID लोड नहीं हुआ। नेटवर्क जाँचकर पुनः प्रयास करें।",
    "msgAlpha": "कस्टम वर्णमाला में कम से कम 2 अक्षर हों।"
  },
  "it": {
    "title_page": "Generatore UUID / ULID / Token",
    "desc": "Genera UUID, ULID o token casuali. UUID e token usano Web Crypto. ULID si carica da un CDN. Tutto resta in locale.",
    "count": "Quantità",
    "hyphen": "Trattini",
    "upper": "Maiuscole",
    "mono": "Monotono",
    "ulidHint": "Resta ordinabile nello stesso millisecondo. Carica ulid al primo uso.",
    "length": "Lunghezza",
    "alnum": "Alfanumerico",
    "digits": "Cifre",
    "custom": "Caratteri propri",
    "alphaPh": "Caratteri da campionare",
    "generate": "Genera",
    "copy": "Copia tutto",
    "download": "Scarica",
    "clear": "Svuota",
    "ready": "{n} generati",
    "placeholder": "Il risultato appare dopo Genera",
    "copied": "Copiato",
    "msgEmpty": "Non c’è ancora nulla da copiare.",
    "msgFail": "Generazione non riuscita.",
    "msgLib": "Impossibile caricare ULID. Controlla la rete e riprova.",
    "msgAlpha": "L’alfabeto personalizzato richiede almeno 2 caratteri."
  },
  "nl": {
    "title_page": "UUID- / ULID- / Tokengenerator",
    "desc": "Genereer UUIDs, ULIDs of willekeurige tokens. UUID en tokens via Web Crypto. ULID komt van een CDN. Alles blijft lokaal.",
    "count": "Aantal",
    "hyphen": "Koppeltekens",
    "upper": "Hoofdletters",
    "mono": "Monotoon",
    "ulidHint": "Blijft sorteerbaar in dezelfde milliseconde. Laadt ulid eerst.",
    "length": "Lengte",
    "alnum": "Alfanumeriek",
    "digits": "Cijfers",
    "custom": "Eigen tekens",
    "alphaPh": "Tekens om uit te kiezen",
    "generate": "Genereren",
    "copy": "Alles kopiëren",
    "download": "Downloaden",
    "clear": "Wissen",
    "ready": "{n} gegenereerd",
    "placeholder": "Resultaat na Genereren",
    "copied": "Gekopieerd",
    "msgEmpty": "Nog niets om te kopiëren.",
    "msgFail": "Genereren mislukt.",
    "msgLib": "ULID kon niet worden geladen. Controleer het netwerk en probeer opnieuw.",
    "msgAlpha": "Eigen alfabet heeft minstens 2 tekens nodig."
  },
  "tr": {
    "title_page": "UUID / ULID / Token üreteci",
    "desc": "Toplu UUID, ULID veya rastgele token üretin. UUID ve token Web Crypto kullanır. ULID ilk seferde CDN’den gelir. Hepsi yerelde kalır.",
    "count": "Adet",
    "hyphen": "Tire",
    "upper": "Büyük harf",
    "mono": "Monoton",
    "ulidHint": "Aynı milisaniyede de sıralanabilir. İlk kullanımda ulid yüklenir.",
    "length": "Uzunluk",
    "alnum": "Harf-rakam",
    "digits": "Yalnız rakam",
    "custom": "Özel karakterler",
    "alphaPh": "Örnekleme karakterleri",
    "generate": "Üret",
    "copy": "Tümünü kopyala",
    "download": "İndir",
    "clear": "Temizle",
    "ready": "{n} üretildi",
    "placeholder": "Sonuç Üret sonrası görünür",
    "copied": "Kopyalandı",
    "msgEmpty": "Kopyalanacak bir şey yok.",
    "msgFail": "Üretim başarısız.",
    "msgLib": "ULID yüklenemedi. Ağı kontrol edip tekrar deneyin.",
    "msgAlpha": "Özel alfabe en az 2 karakter olmalı."
  },
  "vi": {
    "title_page": "Trình tạo UUID / ULID / Token",
    "desc": "Tạo hàng loạt UUID, ULID hoặc token ngẫu nhiên. UUID và token dùng Web Crypto. ULID tải từ CDN lần đầu. Tất cả xử lý cục bộ.",
    "count": "Số lượng",
    "hyphen": "Gạch nối",
    "upper": "Chữ hoa",
    "mono": "Đơn điệu",
    "ulidHint": "Vẫn sắp xếp được trong cùng mili giây. Tải ulid lần đầu.",
    "length": "Độ dài",
    "alnum": "Chữ và số",
    "digits": "Chỉ số",
    "custom": "Ký tự tùy chọn",
    "alphaPh": "Ký tự để lấy mẫu",
    "generate": "Tạo",
    "copy": "Sao chép tất cả",
    "download": "Tải xuống",
    "clear": "Xóa",
    "ready": "Đã tạo {n}",
    "placeholder": "Kết quả hiện sau khi Tạo",
    "copied": "Đã sao chép",
    "msgEmpty": "Chưa có gì để sao chép.",
    "msgFail": "Tạo thất bại.",
    "msgLib": "Không tải được ULID. Kiểm tra mạng rồi thử lại.",
    "msgAlpha": "Bảng chữ tùy chọn cần ít nhất 2 ký tự."
  },
  "th": {
    "title_page": "ตัวสร้าง UUID / ULID / Token",
    "desc": "สร้าง UUID ULID หรือโทเคนสุ่มเป็นชุด UUID กับโทเคนใช้ Web Crypto ULID โหลดจาก CDN ครั้งแรก ทำทั้งหมดในเครื่อง",
    "count": "จำนวน",
    "hyphen": "ยัติภังค์",
    "upper": "ตัวพิมพ์ใหญ่",
    "mono": "เพิ่มทางเดียว",
    "ulidHint": "เรียงได้แม้ในมิลลิวินาทีเดียวกัน โหลด ulid ครั้งแรก",
    "length": "ความยาว",
    "alnum": "ตัวอักษรและตัวเลข",
    "digits": "ตัวเลขอย่างเดียว",
    "custom": "อักขระกำหนดเอง",
    "alphaPh": "อักขระที่ใช้สุ่ม",
    "generate": "สร้าง",
    "copy": "คัดลอกทั้งหมด",
    "download": "ดาวน์โหลด",
    "clear": "ล้าง",
    "ready": "สร้างแล้ว {n} รายการ",
    "placeholder": "ผลลัพธ์หลังกดสร้าง",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "ยังไม่มีผลลัพธ์ให้คัดลอก",
    "msgFail": "สร้างไม่สำเร็จ",
    "msgLib": "โหลด ULID ไม่สำเร็จ ตรวจเครือข่ายแล้วลองใหม่",
    "msgAlpha": "อักขระกำหนดเองต้องมีอย่างน้อย 2 ตัว"
  },
  "id": {
    "title_page": "Pembuat UUID / ULID / Token",
    "desc": "Buat UUID, ULID, atau token acak sekaligus. UUID dan token memakai Web Crypto. ULID dari CDN saat pertama. Semuanya lokal.",
    "count": "Jumlah",
    "hyphen": "Tanda hubung",
    "upper": "Huruf besar",
    "mono": "Monoton",
    "ulidHint": "Tetap bisa diurutkan dalam milidetik yang sama. Memuat ulid dulu.",
    "length": "Panjang",
    "alnum": "Huruf-angka",
    "digits": "Angka saja",
    "custom": "Karakter kustom",
    "alphaPh": "Karakter untuk diambil",
    "generate": "Buat",
    "copy": "Salin semua",
    "download": "Unduh",
    "clear": "Hapus",
    "ready": "{n} dibuat",
    "placeholder": "Hasil muncul setelah Buat",
    "copied": "Tersalin",
    "msgEmpty": "Belum ada yang bisa disalin.",
    "msgFail": "Gagal membuat.",
    "msgLib": "Gagal memuat ULID. Periksa jaringan lalu coba lagi.",
    "msgAlpha": "Alfabet kustom butuh minimal 2 karakter."
  },
  "ms": {
    "title_page": "Penjana UUID / ULID / Token",
    "desc": "Jana UUID, ULID atau token rawak secara pukal. UUID dan token guna Web Crypto. ULID dari CDN pada kali pertama. Semua kekal setempat.",
    "count": "Bilangan",
    "hyphen": "Sempang",
    "upper": "Huruf besar",
    "mono": "Monoton",
    "ulidHint": "Masih boleh diisih dalam milisaat yang sama. Memuatkan ulid dahulu.",
    "length": "Panjang",
    "alnum": "Huruf-nombor",
    "digits": "Nombor sahaja",
    "custom": "Aksara tersuai",
    "alphaPh": "Aksara untuk disampel",
    "generate": "Jana",
    "copy": "Salin semua",
    "download": "Muat turun",
    "clear": "Kosongkan",
    "ready": "{n} dijana",
    "placeholder": "Hasil muncul selepas Jana",
    "copied": "Disalin",
    "msgEmpty": "Belum ada yang boleh disalin.",
    "msgFail": "Gagal menjana.",
    "msgLib": "Tidak dapat memuatkan ULID. Semak rangkaian dan cuba lagi.",
    "msgAlpha": "Abjad tersuai perlukan sekurang-kurangnya 2 aksara."
  },
  "pl": {
    "title_page": "Generator UUID / ULID / Token",
    "desc": "Generuj UUID, ULID lub losowe tokeny. UUID i tokeny przez Web Crypto. ULID z CDN przy pierwszym użyciu. Wszystko lokalnie.",
    "count": "Liczba",
    "hyphen": "Myślniki",
    "upper": "Wielkie litery",
    "mono": "Monotoniczny",
    "ulidHint": "Pozostaje sortowalny w tej samej milisekundzie. Najpierw ładuje ulid.",
    "length": "Długość",
    "alnum": "Alfanumeryczne",
    "digits": "Tylko cyfry",
    "custom": "Własne znaki",
    "alphaPh": "Znaki do losowania",
    "generate": "Generuj",
    "copy": "Kopiuj wszystko",
    "download": "Pobierz",
    "clear": "Wyczyść",
    "ready": "Wygenerowano {n}",
    "placeholder": "Wynik po Generuj",
    "copied": "Skopiowano",
    "msgEmpty": "Nie ma jeszcze nic do skopiowania.",
    "msgFail": "Generowanie nie powiodło się.",
    "msgLib": "Nie udało się wczytać ULID. Sprawdź sieć i spróbuj ponownie.",
    "msgAlpha": "Własny alfabet musi mieć co najmniej 2 znaki."
  },
  "uk": {
    "title_page": "Генератор UUID / ULID / Token",
    "desc": "Пакетно створюйте UUID, ULID або випадкові токени. UUID і токени — Web Crypto. ULID з CDN при першому запуску. Усе локально.",
    "count": "Кількість",
    "hyphen": "Дефіси",
    "upper": "Великі літери",
    "mono": "Монотонний",
    "ulidHint": "Залишається сортованим у ту саму мілісекунду. Спочатку завантажується ulid.",
    "length": "Довжина",
    "alnum": "Літери й цифри",
    "digits": "Лише цифри",
    "custom": "Свої символи",
    "alphaPh": "Символи для вибірки",
    "generate": "Згенерувати",
    "copy": "Копіювати все",
    "download": "Завантажити",
    "clear": "Очистити",
    "ready": "Створено {n}",
    "placeholder": "Результат з’явиться після генерації",
    "copied": "Скопійовано",
    "msgEmpty": "Поки нічого копіювати.",
    "msgFail": "Помилка генерації.",
    "msgLib": "Не вдалося завантажити ULID. Перевірте мережу й повторіть.",
    "msgAlpha": "Власний алфавіт має містити щонайменше 2 символи."
  },
  "sv": {
    "title_page": "UUID- / ULID- / Tokengenerator",
    "desc": "Skapa UUID, ULID eller slumpmässiga token. UUID och token via Web Crypto. ULID hämtas från CDN första gången. Allt stannar lokalt.",
    "count": "Antal",
    "hyphen": "Bindestreck",
    "upper": "Versaler",
    "mono": "Monoton",
    "ulidHint": "Förblir sorterbar i samma millisekund. Laddar ulid först.",
    "length": "Längd",
    "alnum": "Alfanumeriskt",
    "digits": "Endast siffror",
    "custom": "Egna tecken",
    "alphaPh": "Tecken att välja bland",
    "generate": "Generera",
    "copy": "Kopiera alla",
    "download": "Ladda ner",
    "clear": "Rensa",
    "ready": "{n} genererade",
    "placeholder": "Resultat efter Generera",
    "copied": "Kopierat",
    "msgEmpty": "Inget att kopiera ännu.",
    "msgFail": "Kunde inte generera.",
    "msgLib": "Kunde inte ladda ULID. Kontrollera nätverket och försök igen.",
    "msgAlpha": "Eget alfabet behöver minst 2 tecken."
  },
  "zh-TW": {
    "title_page": "UUID / ULID / Token 產生器",
    "desc": "批次產生 UUID、ULID 或隨機 Token。UUID 與 Token 用瀏覽器加密介面，ULID 首次從 CDN 載入。全部在本機完成。",
    "count": "數量",
    "hyphen": "帶連字號",
    "upper": "大寫",
    "mono": "單調遞增",
    "ulidHint": "同一毫秒內也保持可排序。首次會載入 ulid 函式庫。",
    "length": "長度",
    "alnum": "字母數字",
    "digits": "純數字",
    "custom": "自訂字元",
    "alphaPh": "用作隨機來源的字元",
    "generate": "產生",
    "copy": "複製全部",
    "download": "下載",
    "clear": "清空",
    "ready": "已產生 {n} 筆",
    "placeholder": "點「產生」後顯示結果",
    "copied": "已複製",
    "msgEmpty": "還沒有可複製的結果。",
    "msgFail": "產生失敗。",
    "msgLib": "ULID 函式庫載入失敗，請檢查網路後重試。",
    "msgAlpha": "自訂字元至少需要 2 個。"
  }
}
</i18n>
