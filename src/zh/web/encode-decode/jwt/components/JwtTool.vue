<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { fromBase64Url, utf8 } from "../../shared/bytes"

const { t } = useI18n()

const SAMPLE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const SAMPLE_SECRET = "secret"

const token = ref("")
const secret = ref("")
const headerText = ref("")
const payloadText = ref("")
const alg = ref("")
const sigStatus = ref<"none" | "ok" | "bad" | "skip" | "unsup">("none")
const claims = ref<{ key: string; raw: string; pretty: string }[]>([])
const running = ref(false)

const HS: Record<string, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
}

function decodeJson(part: string) {
  const bytes = fromBase64Url(part)
  const text = new TextDecoder().decode(bytes)
  return JSON.parse(text) as Record<string, unknown>
}

function pretty(obj: unknown) {
  return JSON.stringify(obj, null, 2)
}

function fmtTime(n: unknown) {
  if (typeof n !== "number" || !Number.isFinite(n)) return ""
  const d = new Date(n * 1000)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().replace("T", " ").replace(".000Z", " UTC")
}

function collectClaims(payload: Record<string, unknown>) {
  const now = Math.floor(Date.now() / 1000)
  const rows: { key: string; raw: string; pretty: string }[] = []
  for (const key of ["iat", "nbf", "exp"] as const) {
    if (!(key in payload)) continue
    const raw = String(payload[key])
    const time = fmtTime(payload[key])
    let extra = time
    if (key === "exp" && typeof payload.exp === "number") {
      extra = time + (payload.exp < now ? `  (${t("expired")})` : `  (${t("valid")})`)
    }
    if (key === "nbf" && typeof payload.nbf === "number" && payload.nbf > now) {
      extra = time + `  (${t("notYet")})`
    }
    rows.push({ key, raw, pretty: extra || raw })
  }
  return rows
}

async function verifyHs(raw: string, header: Record<string, unknown>, keyText: string) {
  const name = String(header.alg || "")
  const hash = HS[name]
  if (!hash) return "unsup" as const
  const parts = raw.split(".")
  const data = utf8(`${parts[0]}.${parts[1]}`)
  const sig = fromBase64Url(parts[2] || "")
  const key = await crypto.subtle.importKey("raw", utf8(keyText), { name: "HMAC", hash }, false, ["verify"])
  const ok = await crypto.subtle.verify("HMAC", key, sig, data)
  return ok ? ("ok" as const) : ("bad" as const)
}

async function parse() {
  const raw = token.value.trim()
  if (!raw) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  running.value = true
  headerText.value = ""
  payloadText.value = ""
  alg.value = ""
  claims.value = []
  sigStatus.value = "none"
  try {
    const parts = raw.split(".")
    if (parts.length !== 3) throw new Error("parts")
    const header = decodeJson(parts[0]!)
    const payload = decodeJson(parts[1]!)
    headerText.value = pretty(header)
    payloadText.value = pretty(payload)
    alg.value = String(header.alg || "")
    claims.value = collectClaims(payload)
    if (!secret.value) {
      sigStatus.value = alg.value in HS ? "skip" : header.alg ? "unsup" : "skip"
    } else {
      sigStatus.value = await verifyHs(raw, header, secret.value)
    }
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

async function copyText(text: string) {
  if (!text) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  await copyToClipboard(text)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function useSample() {
  token.value = SAMPLE_TOKEN
  secret.value = SAMPLE_SECRET
  headerText.value = ""
  payloadText.value = ""
  claims.value = []
  sigStatus.value = "none"
  alg.value = ""
}

function clearAll() {
  token.value = ""
  secret.value = ""
  headerText.value = ""
  payloadText.value = ""
  claims.value = []
  sigStatus.value = "none"
  alg.value = ""
}

const statusText = computed(() => {
  if (sigStatus.value === "ok") return t("sigOk")
  if (sigStatus.value === "bad") return t("sigBad")
  if (sigStatus.value === "skip") return t("sigSkip")
  if (sigStatus.value === "unsup") return t("sigUnsup", { alg: alg.value || "—" })
  return ""
})
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="pane-label">{{ t("tokenLabel") }}</div>
    <el-input
      v-model="token"
      type="textarea"
      :rows="6"
      :placeholder="t('tokenPh')"
      resize="vertical"
      class="code-area"
    />

    <div class="field">
      <div class="pane-label">{{ t("keyLabel") }}</div>
      <el-input
        v-model="secret"
        :placeholder="t('keyPh')"
        show-password
      />
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="parse"
      >
        {{ t("run") }}
      </el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <p
      v-if="statusText"
      class="sig"
      :class="sigStatus"
    >
      {{ statusText }}
    </p>

    <div
      v-if="claims.length"
      class="claims"
    >
      <div
        v-for="row in claims"
        :key="row.key"
        class="claim"
      >
        <span class="claim-k">{{ row.key }}</span>
        <span class="claim-v">{{ row.pretty }}</span>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="pane-head">
          <span class="pane-label">{{ t("headerLabel") }}</span>
          <el-button
            size="small"
            @click="copyText(headerText)"
          >
            {{ t("copy") }}
          </el-button>
        </div>
        <el-input
          v-model="headerText"
          type="textarea"
          :rows="10"
          readonly
          resize="vertical"
          class="code-area"
        />
      </div>
      <div>
        <div class="pane-head">
          <span class="pane-label">{{ t("payloadLabel") }}</span>
          <el-button
            size="small"
            @click="copyText(payloadText)"
          >
            {{ t("copy") }}
          </el-button>
        </div>
        <el-input
          v-model="payloadText"
          type="textarea"
          :rows="10"
          readonly
          resize="vertical"
          class="code-area"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-page {
  max-width: 1100px;
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

.field,
.actions {
  margin-top: 14px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.pane-label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;

  .pane-label {
    margin-bottom: 0;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.sig {
  margin: 0 0 14px;
  font-size: 0.92rem;

  &.ok {
    color: var(--vp-c-green-1, #10b981);
  }

  &.bad {
    color: var(--vp-c-danger-1, #ef4444);
  }

  &.skip,
  &.unsup {
    color: var(--vp-c-text-2);
  }
}

.claims {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.claim {
  display: flex;
  gap: 12px;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
}

.claim-k {
  min-width: 36px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.code-area :deep(textarea) {
  font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 0.88rem;
  line-height: 1.55;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "JWT 解析验证",
    "desc": "把 JWT 拆成 Header 和 Payload，查看 iat / nbf / exp。可选填密钥校验 HS256、HS384、HS512。解析在浏览器本地完成，令牌不会上传。RSA 与 ECDSA 签名只能查看，不能在本页验证。",
    "tokenLabel": "JWT",
    "tokenPh": "粘贴 header.payload.signature",
    "keyLabel": "密钥（可选，仅 HMAC）",
    "keyPh": "用于校验 HS256 / HS384 / HS512",
    "run": "解析",
    "sample": "示例",
    "clear": "清空",
    "copy": "复制",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "已复制",
    "msgEmpty": "请先粘贴 JWT。",
    "msgNoOut": "还没有可复制的内容。",
    "msgFail": "无法解析，请确认是三段式 JWS。",
    "sigOk": "签名有效。",
    "sigBad": "签名无效，或密钥不匹配。",
    "sigSkip": "未填写密钥，已跳过签名校验。",
    "sigUnsup": "算法 {alg} 不是 HMAC，本页无法验证签名。",
    "expired": "已过期",
    "valid": "未过期",
    "notYet": "尚未生效"
  },
  "zh-CN": {
    "title_page": "JWT 解析验证",
    "desc": "把 JWT 拆成 Header 和 Payload，查看 iat / nbf / exp。可选填密钥校验 HS256、HS384、HS512。解析在浏览器本地完成，令牌不会上传。RSA 与 ECDSA 签名只能查看，不能在本页验证。",
    "tokenLabel": "JWT",
    "tokenPh": "粘贴 header.payload.signature",
    "keyLabel": "密钥（可选，仅 HMAC）",
    "keyPh": "用于校验 HS256 / HS384 / HS512",
    "run": "解析",
    "sample": "示例",
    "clear": "清空",
    "copy": "复制",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "已复制",
    "msgEmpty": "请先粘贴 JWT。",
    "msgNoOut": "还没有可复制的内容。",
    "msgFail": "无法解析，请确认是三段式 JWS。",
    "sigOk": "签名有效。",
    "sigBad": "签名无效，或密钥不匹配。",
    "sigSkip": "未填写密钥，已跳过签名校验。",
    "sigUnsup": "算法 {alg} 不是 HMAC，本页无法验证签名。",
    "expired": "已过期",
    "valid": "未过期",
    "notYet": "尚未生效"
  },
  "en": {
    "title_page": "JWT Decode & Verify",
    "desc": "Split a JWT into Header and Payload and inspect iat / nbf / exp. Optionally verify HS256, HS384, or HS512 with a secret. Parsing stays in the browser. RSA and ECDSA signatures can be viewed but not verified here.",
    "tokenLabel": "JWT",
    "tokenPh": "Paste header.payload.signature",
    "keyLabel": "Secret (optional, HMAC only)",
    "keyPh": "Used to verify HS256 / HS384 / HS512",
    "run": "Parse",
    "sample": "Sample",
    "clear": "Clear",
    "copy": "Copy",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Copied",
    "msgEmpty": "Paste a JWT first.",
    "msgNoOut": "There is nothing to copy yet.",
    "msgFail": "Could not parse. Use a three-part JWS.",
    "sigOk": "Signature is valid.",
    "sigBad": "Signature is invalid or the secret does not match.",
    "sigSkip": "No secret entered, signature check skipped.",
    "sigUnsup": "Algorithm {alg} is not HMAC, so this page cannot verify it.",
    "expired": "expired",
    "valid": "not expired",
    "notYet": "not yet valid"
  },
  "ja": {
    "title_page": "JWT 解析と検証",
    "desc": "JWT を Header と Payload に分解し、iat / nbf / exp を確認します。任意で HS256 / HS384 / HS512 を検証。解析はブラウザ内。RSA / ECDSA は表示のみで検証できません。",
    "tokenLabel": "JWT",
    "tokenPh": "header.payload.signature を貼り付け",
    "keyLabel": "鍵（任意、HMAC のみ）",
    "keyPh": "HS256 / HS384 / HS512 の検証用",
    "run": "解析",
    "sample": "サンプル",
    "clear": "クリア",
    "copy": "コピー",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "コピーしました",
    "msgEmpty": "先に JWT を貼り付けてください。",
    "msgNoOut": "コピーできる内容がありません。",
    "msgFail": "解析できません。3 部構成の JWS を指定してください。",
    "sigOk": "署名は有効です。",
    "sigBad": "署名が無効、または鍵が一致しません。",
    "sigSkip": "鍵未入力のため署名検証をスキップしました。",
    "sigUnsup": "アルゴリズム {alg} は HMAC ではないため検証できません。",
    "expired": "期限切れ",
    "valid": "有効",
    "notYet": "未生效"
  },
  "ko": {
    "title_page": "JWT 파싱·검증",
    "desc": "JWT를 Header와 Payload로 나누고 iat / nbf / exp를 확인합니다. 선택적으로 HS256, HS384, HS512를 검증합니다. 파싱은 브라우저에서 이루어집니다. RSA와 ECDSA는 보기만 가능합니다.",
    "tokenLabel": "JWT",
    "tokenPh": "header.payload.signature 붙여넣기",
    "keyLabel": "비밀키 (선택, HMAC만)",
    "keyPh": "HS256 / HS384 / HS512 검증용",
    "run": "파싱",
    "sample": "예제",
    "clear": "지우기",
    "copy": "복사",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "복사됨",
    "msgEmpty": "먼저 JWT를 붙여넣으세요.",
    "msgNoOut": "복사할 내용이 없습니다.",
    "msgFail": "파싱할 수 없습니다. 세 부분 JWS를 사용하세요.",
    "sigOk": "서명이 유효합니다.",
    "sigBad": "서명이 잘못되었거나 키가 맞지 않습니다.",
    "sigSkip": "키를 넣지 않아 서명 검사를 건너뛰었습니다.",
    "sigUnsup": "알고리즘 {alg}은 HMAC가 아니라 검증할 수 없습니다.",
    "expired": "만료됨",
    "valid": "유효",
    "notYet": "아직 유효하지 않음"
  },
  "fr": {
    "title_page": "Analyse et vérification JWT",
    "desc": "Découpe un JWT en Header et Payload et affiche iat / nbf / exp. Vérification optionnelle HS256, HS384, HS512. Tout reste dans le navigateur. RSA et ECDSA : affichage seulement.",
    "tokenLabel": "JWT",
    "tokenPh": "Collez header.payload.signature",
    "keyLabel": "Secret (optionnel, HMAC)",
    "keyPh": "Pour vérifier HS256 / HS384 / HS512",
    "run": "Analyser",
    "sample": "Exemple",
    "clear": "Effacer",
    "copy": "Copier",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Copié",
    "msgEmpty": "Collez d’abord un JWT.",
    "msgNoOut": "Rien à copier.",
    "msgFail": "Analyse impossible. Utilisez un JWS en trois parties.",
    "sigOk": "Signature valide.",
    "sigBad": "Signature invalide ou secret incorrect.",
    "sigSkip": "Pas de secret, vérification ignorée.",
    "sigUnsup": "L’algorithme {alg} n’est pas HMAC, vérification impossible.",
    "expired": "expiré",
    "valid": "valide",
    "notYet": "pas encore valide"
  },
  "de": {
    "title_page": "JWT prüfen",
    "desc": "Zerlegt ein JWT in Header und Payload und zeigt iat / nbf / exp. Optional HS256, HS384, HS512 prüfen. Alles im Browser. RSA und ECDSA nur anzeigen.",
    "tokenLabel": "JWT",
    "tokenPh": "header.payload.signature einfügen",
    "keyLabel": "Geheimnis (optional, nur HMAC)",
    "keyPh": "Zur Prüfung von HS256 / HS384 / HS512",
    "run": "Parsen",
    "sample": "Beispiel",
    "clear": "Leeren",
    "copy": "Kopieren",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst ein JWT einfügen.",
    "msgNoOut": "Noch nichts zum Kopieren.",
    "msgFail": "Parsen fehlgeschlagen. Bitte ein dreiteiliges JWS verwenden.",
    "sigOk": "Signatur gültig.",
    "sigBad": "Signatur ungültig oder Geheimnis falsch.",
    "sigSkip": "Kein Geheimnis, Prüfung übersprungen.",
    "sigUnsup": "Algorithmus {alg} ist kein HMAC, Prüfung nicht möglich.",
    "expired": "abgelaufen",
    "valid": "gültig",
    "notYet": "noch nicht gültig"
  },
  "es": {
    "title_page": "Analizar y verificar JWT",
    "desc": "Separa un JWT en Header y Payload y muestra iat / nbf / exp. Verifica opcionalmente HS256, HS384 o HS512. Todo en el navegador. RSA y ECDSA solo se pueden ver.",
    "tokenLabel": "JWT",
    "tokenPh": "Pega header.payload.signature",
    "keyLabel": "Secreto (opcional, solo HMAC)",
    "keyPh": "Para verificar HS256 / HS384 / HS512",
    "run": "Analizar",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "copy": "Copiar",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Copiado",
    "msgEmpty": "Pega un JWT primero.",
    "msgNoOut": "Aún no hay nada que copiar.",
    "msgFail": "No se pudo analizar. Usa un JWS de tres partes.",
    "sigOk": "La firma es válida.",
    "sigBad": "Firma inválida o secreto incorrecto.",
    "sigSkip": "Sin secreto, se omitió la verificación.",
    "sigUnsup": "El algoritmo {alg} no es HMAC; no se puede verificar.",
    "expired": "caducado",
    "valid": "válido",
    "notYet": "aún no válido"
  },
  "pt": {
    "title_page": "Analisar e verificar JWT",
    "desc": "Separa um JWT em Header e Payload e mostra iat / nbf / exp. Verificação opcional de HS256, HS384 ou HS512. Tudo no navegador. RSA e ECDSA só podem ser vistos.",
    "tokenLabel": "JWT",
    "tokenPh": "Cole header.payload.signature",
    "keyLabel": "Segredo (opcional, só HMAC)",
    "keyPh": "Para verificar HS256 / HS384 / HS512",
    "run": "Analisar",
    "sample": "Exemplo",
    "clear": "Limpar",
    "copy": "Copiar",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Copiado",
    "msgEmpty": "Cole um JWT primeiro.",
    "msgNoOut": "Ainda não há o que copiar.",
    "msgFail": "Falha ao analisar. Use um JWS de três partes.",
    "sigOk": "Assinatura válida.",
    "sigBad": "Assinatura inválida ou segredo errado.",
    "sigSkip": "Sem segredo, verificação ignorada.",
    "sigUnsup": "O algoritmo {alg} não é HMAC; não dá para verificar.",
    "expired": "expirado",
    "valid": "válido",
    "notYet": "ainda não válido"
  },
  "ru": {
    "title_page": "Разбор и проверка JWT",
    "desc": "Разбирает JWT на Header и Payload, показывает iat / nbf / exp. По желанию проверяет HS256, HS384, HS512. Всё в браузере. RSA и ECDSA только просмотр.",
    "tokenLabel": "JWT",
    "tokenPh": "Вставьте header.payload.signature",
    "keyLabel": "Секрет (необязательно, только HMAC)",
    "keyPh": "Для проверки HS256 / HS384 / HS512",
    "run": "Разобрать",
    "sample": "Пример",
    "clear": "Очистить",
    "copy": "Копировать",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Скопировано",
    "msgEmpty": "Сначала вставьте JWT.",
    "msgNoOut": "Пока нечего копировать.",
    "msgFail": "Не удалось разобрать. Нужен трёхчастный JWS.",
    "sigOk": "Подпись верна.",
    "sigBad": "Подпись неверна или секрет не совпадает.",
    "sigSkip": "Секрет не указан, проверка пропущена.",
    "sigUnsup": "Алгоритм {alg} не HMAC, проверить нельзя.",
    "expired": "истёк",
    "valid": "действителен",
    "notYet": "ещё не действителен"
  },
  "ar": {
    "title_page": "تحليل JWT والتحقق",
    "desc": "افصل JWT إلى Header وPayload واعرض iat / nbf / exp. تحقق اختيارياً من HS256 وHS384 وHS512. التحليل محلي. RSA وECDSA للعرض فقط.",
    "tokenLabel": "JWT",
    "tokenPh": "الصق header.payload.signature",
    "keyLabel": "المفتاح (اختياري، HMAC فقط)",
    "keyPh": "للتحقق من HS256 / HS384 / HS512",
    "run": "تحليل",
    "sample": "مثال",
    "clear": "مسح",
    "copy": "نسخ",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "تم النسخ",
    "msgEmpty": "الصق JWT أولاً.",
    "msgNoOut": "لا شيء للنسخ بعد.",
    "msgFail": "تعذر التحليل. استخدم JWS من ثلاثة أجزاء.",
    "sigOk": "التوقيع صالح.",
    "sigBad": "التوقيع غير صالح أو المفتاح لا يطابق.",
    "sigSkip": "لم يُدخل مفتاح، تم تخطي التحقق.",
    "sigUnsup": "الخوارزمية {alg} ليست HMAC ولا يمكن التحقق منها.",
    "expired": "منتهٍ",
    "valid": "ساري",
    "notYet": "لم يسرِ بعد"
  },
  "hi": {
    "title_page": "JWT पार्स और जाँच",
    "desc": "JWT को Header और Payload में बाँटें, iat / nbf / exp देखें। चाहें तो HS256, HS384, HS512 जाँचें। पार्स ब्राउज़र में होता है। RSA और ECDSA केवल देखे जा सकते हैं।",
    "tokenLabel": "JWT",
    "tokenPh": "header.payload.signature चिपकाएँ",
    "keyLabel": "कुंजी (वैकल्पिक, केवल HMAC)",
    "keyPh": "HS256 / HS384 / HS512 जाँच के लिए",
    "run": "पार्स",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "copy": "कॉपी",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले JWT चिपकाएँ।",
    "msgNoOut": "कॉपी करने को कुछ नहीं।",
    "msgFail": "पार्स नहीं हुआ। तीन भाग वाला JWS दें।",
    "sigOk": "हस्ताक्षर सही है।",
    "sigBad": "हस्ताक्षर गलत है या कुंजी मेल नहीं खाती।",
    "sigSkip": "कुंजी नहीं दी, जाँच छोड़ी गई।",
    "sigUnsup": "एल्गोरिद्म {alg} HMAC नहीं, जाँच नहीं हो सकती।",
    "expired": "समाप्त",
    "valid": "मान्य",
    "notYet": "अभी मान्य नहीं"
  },
  "it": {
    "title_page": "Analisi e verifica JWT",
    "desc": "Divide un JWT in Header e Payload e mostra iat / nbf / exp. Verifica opzionale HS256, HS384, HS512. Tutto nel browser. RSA ed ECDSA solo visualizzazione.",
    "tokenLabel": "JWT",
    "tokenPh": "Incolla header.payload.signature",
    "keyLabel": "Segreto (opzionale, solo HMAC)",
    "keyPh": "Per verificare HS256 / HS384 / HS512",
    "run": "Analizza",
    "sample": "Esempio",
    "clear": "Svuota",
    "copy": "Copia",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Copiato",
    "msgEmpty": "Incolla prima un JWT.",
    "msgNoOut": "Non c’è ancora nulla da copiare.",
    "msgFail": "Analisi non riuscita. Usa un JWS in tre parti.",
    "sigOk": "Firma valida.",
    "sigBad": "Firma non valida o segreto errato.",
    "sigSkip": "Nessun segreto, verifica saltata.",
    "sigUnsup": "L’algoritmo {alg} non è HMAC, impossibile verificare.",
    "expired": "scaduto",
    "valid": "valido",
    "notYet": "non ancora valido"
  },
  "nl": {
    "title_page": "JWT ontleden en controleren",
    "desc": "Splitst een JWT in Header en Payload en toont iat / nbf / exp. Optioneel HS256, HS384 of HS512 controleren. Alles in de browser. RSA en ECDSA alleen bekijken.",
    "tokenLabel": "JWT",
    "tokenPh": "Plak header.payload.signature",
    "keyLabel": "Geheim (optioneel, alleen HMAC)",
    "keyPh": "Voor HS256 / HS384 / HS512",
    "run": "Ontleden",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Gekopieerd",
    "msgEmpty": "Plak eerst een JWT.",
    "msgNoOut": "Nog niets om te kopiëren.",
    "msgFail": "Ontleden mislukt. Gebruik een JWS in drie delen.",
    "sigOk": "Handtekening is geldig.",
    "sigBad": "Handtekening ongeldig of geheim klopt niet.",
    "sigSkip": "Geen geheim, controle overgeslagen.",
    "sigUnsup": "Algoritme {alg} is geen HMAC, kan niet controleren.",
    "expired": "verlopen",
    "valid": "geldig",
    "notYet": "nog niet geldig"
  },
  "tr": {
    "title_page": "JWT çözümleme ve doğrulama",
    "desc": "JWT’yi Header ve Payload olarak ayırır, iat / nbf / exp gösterir. İsteğe bağlı HS256, HS384, HS512. Hepsi tarayıcıda. RSA ve ECDSA yalnızca görüntülenir.",
    "tokenLabel": "JWT",
    "tokenPh": "header.payload.signature yapıştırın",
    "keyLabel": "Anahtar (isteğe bağlı, yalnızca HMAC)",
    "keyPh": "HS256 / HS384 / HS512 doğrulama",
    "run": "Çözümle",
    "sample": "Örnek",
    "clear": "Temizle",
    "copy": "Kopyala",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce bir JWT yapıştırın.",
    "msgNoOut": "Kopyalanacak bir şey yok.",
    "msgFail": "Çözümlenemedi. Üç parçalı JWS kullanın.",
    "sigOk": "İmza geçerli.",
    "sigBad": "İmza geçersiz veya anahtar uyuşmuyor.",
    "sigSkip": "Anahtar yok, doğrulama atlandı.",
    "sigUnsup": "{alg} HMAC değil, doğrulanamaz.",
    "expired": "süresi dolmuş",
    "valid": "geçerli",
    "notYet": "henüz geçerli değil"
  },
  "vi": {
    "title_page": "Phân tích và xác thực JWT",
    "desc": "Tách JWT thành Header và Payload, xem iat / nbf / exp. Tùy chọn xác thực HS256, HS384, HS512. Tất cả trong trình duyệt. RSA và ECDSA chỉ xem được.",
    "tokenLabel": "JWT",
    "tokenPh": "Dán header.payload.signature",
    "keyLabel": "Khóa (tuỳ chọn, chỉ HMAC)",
    "keyPh": "Để xác thực HS256 / HS384 / HS512",
    "run": "Phân tích",
    "sample": "Mẫu",
    "clear": "Xóa",
    "copy": "Sao chép",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy dán JWT trước.",
    "msgNoOut": "Chưa có gì để sao chép.",
    "msgFail": "Không phân tích được. Dùng JWS ba phần.",
    "sigOk": "Chữ ký hợp lệ.",
    "sigBad": "Chữ ký sai hoặc khóa không khớp.",
    "sigSkip": "Chưa nhập khóa, bỏ qua kiểm tra.",
    "sigUnsup": "Thuật toán {alg} không phải HMAC, không xác thực được.",
    "expired": "đã hết hạn",
    "valid": "còn hạn",
    "notYet": "chưa có hiệu lực"
  },
  "th": {
    "title_page": "ถอดและตรวจ JWT",
    "desc": "แยก JWT เป็น Header และ Payload ดู iat / nbf / exp ตรวจ HS256 HS384 HS512 ได้ถ้ามีคีย์ ทำในเบราว์เซอร์ RSA และ ECDSA ดูได้อย่างเดียว",
    "tokenLabel": "JWT",
    "tokenPh": "วาง header.payload.signature",
    "keyLabel": "คีย์ (ไม่บังคับ เฉพาะ HMAC)",
    "keyPh": "สำหรับตรวจ HS256 / HS384 / HS512",
    "run": "ถอดรหัส",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "วาง JWT ก่อน",
    "msgNoOut": "ยังไม่มีอะไรให้คัดลอก",
    "msgFail": "ถอดไม่ได้ ใช้ JWS สามส่วน",
    "sigOk": "ลายเซ็นถูกต้อง",
    "sigBad": "ลายเซ็นไม่ถูกต้องหรือคีย์ไม่ตรง",
    "sigSkip": "ไม่มีคีย์ ข้ามการตรวจ",
    "sigUnsup": "อัลกอริทึม {alg} ไม่ใช่ HMAC ตรวจไม่ได้",
    "expired": "หมดอายุ",
    "valid": "ยังไม่หมดอายุ",
    "notYet": "ยังไม่เริ่ม"
  },
  "id": {
    "title_page": "Urai dan verifikasi JWT",
    "desc": "Pisahkan JWT jadi Header dan Payload, lihat iat / nbf / exp. Verifikasi opsional HS256, HS384, HS512. Semua di browser. RSA dan ECDSA hanya bisa dilihat.",
    "tokenLabel": "JWT",
    "tokenPh": "Tempel header.payload.signature",
    "keyLabel": "Rahasia (opsional, hanya HMAC)",
    "keyPh": "Untuk verifikasi HS256 / HS384 / HS512",
    "run": "Urai",
    "sample": "Contoh",
    "clear": "Hapus",
    "copy": "Salin",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Disalin",
    "msgEmpty": "Tempel JWT dulu.",
    "msgNoOut": "Belum ada yang bisa disalin.",
    "msgFail": "Gagal mengurai. Pakai JWS tiga bagian.",
    "sigOk": "Tanda tangan valid.",
    "sigBad": "Tanda tangan tidak valid atau kunci salah.",
    "sigSkip": "Tidak ada kunci, verifikasi dilewati.",
    "sigUnsup": "Algoritma {alg} bukan HMAC, tidak bisa diverifikasi.",
    "expired": "kedaluwarsa",
    "valid": "berlaku",
    "notYet": "belum berlaku"
  },
  "ms": {
    "title_page": "Hurai dan sahkan JWT",
    "desc": "Asingkan JWT kepada Header dan Payload, lihat iat / nbf / exp. Pengesahan pilihan HS256, HS384, HS512. Semua dalam pelayar. RSA dan ECDSA hanya boleh dilihat.",
    "tokenLabel": "JWT",
    "tokenPh": "Tampal header.payload.signature",
    "keyLabel": "Rahsia (pilihan, HMAC sahaja)",
    "keyPh": "Untuk sahkan HS256 / HS384 / HS512",
    "run": "Hurai",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "copy": "Salin",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Disalin",
    "msgEmpty": "Tampal JWT dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin.",
    "msgFail": "Gagal dihurai. Guna JWS tiga bahagian.",
    "sigOk": "Tandatangan sah.",
    "sigBad": "Tandatangan tidak sah atau kunci tidak sepadan.",
    "sigSkip": "Tiada kunci, pengesahan dilangkau.",
    "sigUnsup": "Algoritma {alg} bukan HMAC, tidak boleh disahkan.",
    "expired": "tamat tempoh",
    "valid": "sah",
    "notYet": "belum sah"
  },
  "pl": {
    "title_page": "Analiza i weryfikacja JWT",
    "desc": "Dzieli JWT na Header i Payload, pokazuje iat / nbf / exp. Opcjonalnie sprawdza HS256, HS384, HS512. Wszystko w przeglądarce. RSA i ECDSA tylko do podglądu.",
    "tokenLabel": "JWT",
    "tokenPh": "Wklej header.payload.signature",
    "keyLabel": "Sekret (opcjonalnie, tylko HMAC)",
    "keyPh": "Do weryfikacji HS256 / HS384 / HS512",
    "run": "Analizuj",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wklej JWT.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania.",
    "msgFail": "Nie udało się sparsować. Użyj trójczęściowego JWS.",
    "sigOk": "Podpis jest poprawny.",
    "sigBad": "Podpis niepoprawny albo sekret się nie zgadza.",
    "sigSkip": "Brak sekretu, pominięto weryfikację.",
    "sigUnsup": "Algorytm {alg} to nie HMAC, nie da się zweryfikować.",
    "expired": "wygasł",
    "valid": "ważny",
    "notYet": "jeszcze nieważny"
  },
  "uk": {
    "title_page": "Розбір і перевірка JWT",
    "desc": "Ділить JWT на Header і Payload, показує iat / nbf / exp. За бажанням перевіряє HS256, HS384, HS512. Усе в браузері. RSA і ECDSA лише перегляд.",
    "tokenLabel": "JWT",
    "tokenPh": "Вставте header.payload.signature",
    "keyLabel": "Секрет (необов’язково, лише HMAC)",
    "keyPh": "Для перевірки HS256 / HS384 / HS512",
    "run": "Розібрати",
    "sample": "Приклад",
    "clear": "Очистити",
    "copy": "Копіювати",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку вставте JWT.",
    "msgNoOut": "Поки немає що копіювати.",
    "msgFail": "Не вдалося розібрати. Потрібен тричастинний JWS.",
    "sigOk": "Підпис чинний.",
    "sigBad": "Підпис нечинний або секрет не збігається.",
    "sigSkip": "Секрет не вказано, перевірку пропущено.",
    "sigUnsup": "Алгоритм {alg} не HMAC, перевірити не можна.",
    "expired": "прострочений",
    "valid": "чинний",
    "notYet": "ще не чинний"
  },
  "sv": {
    "title_page": "JWT-analys och verifiering",
    "desc": "Delar ett JWT i Header och Payload och visar iat / nbf / exp. Valfri kontroll av HS256, HS384, HS512. Allt i webbläsaren. RSA och ECDSA kan bara visas.",
    "tokenLabel": "JWT",
    "tokenPh": "Klistra in header.payload.signature",
    "keyLabel": "Hemlighet (valfritt, endast HMAC)",
    "keyPh": "För att verifiera HS256 / HS384 / HS512",
    "run": "Analysera",
    "sample": "Exempel",
    "clear": "Rensa",
    "copy": "Kopiera",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "Kopierat",
    "msgEmpty": "Klistra in ett JWT först.",
    "msgNoOut": "Inget att kopiera ännu.",
    "msgFail": "Kunde inte tolka. Använd ett JWS i tre delar.",
    "sigOk": "Signaturen är giltig.",
    "sigBad": "Ogiltig signatur eller fel hemlighet.",
    "sigSkip": "Ingen hemlighet, kontroll hoppades över.",
    "sigUnsup": "Algoritmen {alg} är inte HMAC och kan inte verifieras.",
    "expired": "utgånget",
    "valid": "giltigt",
    "notYet": "inte giltigt än"
  },
  "zh-TW": {
    "title_page": "JWT 解析驗證",
    "desc": "把 JWT 拆成 Header 和 Payload，查看 iat / nbf / exp。可選填金鑰校驗 HS256、HS384、HS512。解析在瀏覽器本機完成，權杖不會上傳。RSA 與 ECDSA 簽名只能查看，不能在本頁驗證。",
    "tokenLabel": "JWT",
    "tokenPh": "貼上 header.payload.signature",
    "keyLabel": "金鑰（可選，僅 HMAC）",
    "keyPh": "用於校驗 HS256 / HS384 / HS512",
    "run": "解析",
    "sample": "範例",
    "clear": "清空",
    "copy": "複製",
    "headerLabel": "Header",
    "payloadLabel": "Payload",
    "copied": "已複製",
    "msgEmpty": "請先貼上 JWT。",
    "msgNoOut": "還沒有可複製的內容。",
    "msgFail": "無法解析，請確認是三段式 JWS。",
    "sigOk": "簽名有效。",
    "sigBad": "簽名無效，或金鑰不匹配。",
    "sigSkip": "未填寫金鑰，已跳過簽名校驗。",
    "sigUnsup": "演算法 {alg} 不是 HMAC，本頁無法驗證簽名。",
    "expired": "已過期",
    "valid": "未過期",
    "notYet": "尚未生效"
  }
}
</i18n>
