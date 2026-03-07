import { getUrlRouteParams, type LangCode, type UrlRouteParams } from './[type]-[operation]-url.paths'

export interface UrlCardItem {
  title: string
  desc: string
  href: string
  from: string
  to: string
}

export interface UrlCardGroup {
  title: string
  children: UrlCardItem[]
}

const groupLabels: Record<LangCode, { text: string; component: string; query: string }> = {
  zh: { text: '整条 URL', component: 'URL 组件', query: 'Query 参数' },
  'zh-TW': { text: '整條 URL', component: 'URL 元件', query: 'Query 參數' },
  en: { text: 'Full URL', component: 'URL Component', query: 'Query Params' },
  ar: { text: 'URL كامل', component: 'مكوّن URL', query: 'معلمات Query' },
  de: { text: 'Vollständige URL', component: 'URL-Komponente', query: 'Query-Parameter' },
  es: { text: 'URL completa', component: 'Componente URL', query: 'Parámetros Query' },
  fr: { text: 'URL complète', component: 'Composant URL', query: 'Paramètres Query' },
  hi: { text: 'पूर्ण URL', component: 'URL कंपोनेंट', query: 'Query पैरामीटर' },
  id: { text: 'URL penuh', component: 'Komponen URL', query: 'Parameter Query' },
  it: { text: 'URL completa', component: 'Componente URL', query: 'Parametri Query' },
  ja: { text: '完全な URL', component: 'URL コンポーネント', query: 'Query パラメータ' },
  ko: { text: '전체 URL', component: 'URL 구성 요소', query: 'Query 파라미터' },
  nl: { text: 'Volledige URL', component: 'URL-component', query: 'Query-parameters' },
  pl: { text: 'Pełny URL', component: 'Komponent URL', query: 'Parametry Query' },
  pt: { text: 'URL completa', component: 'Componente URL', query: 'Parâmetros Query' },
  ru: { text: 'Полный URL', component: 'Компонент URL', query: 'Параметры Query' },
  sv: { text: 'Fullständig URL', component: 'URL-komponent', query: 'Query-parametrar' },
  th: { text: 'URL ทั้งเส้น', component: 'ส่วนประกอบ URL', query: 'พารามิเตอร์ Query' },
  tr: { text: 'Tam URL', component: 'URL Bileşeni', query: 'Query Parametreleri' },
  vi: { text: 'URL đầy đủ', component: 'Thành phần URL', query: 'Tham số Query' },
}

const routeLabels: Record<LangCode, {
  textInput: string
  textEncoded: string
  componentInput: string
  componentEncoded: string
  queryString: string
  keyValueList: string
}> = {
  zh: {
    textInput: 'URL / 文本',
    textEncoded: '已编码 URL',
    componentInput: '参数值 / 片段',
    componentEncoded: '已编码片段',
    queryString: '查询字符串',
    keyValueList: '键值列表',
  },
  'zh-TW': {
    textInput: 'URL / 文字',
    textEncoded: '已編碼 URL',
    componentInput: '參數值 / 片段',
    componentEncoded: '已編碼片段',
    queryString: '查詢字串',
    keyValueList: '鍵值列表',
  },
  en: {
    textInput: 'URL / Text',
    textEncoded: 'Encoded URL',
    componentInput: 'Value / Segment',
    componentEncoded: 'Encoded Segment',
    queryString: 'Query String',
    keyValueList: 'Key-Value List',
  },
  ar: {
    textInput: 'URL / نص',
    textEncoded: 'URL مشفر',
    componentInput: 'قيمة / جزء',
    componentEncoded: 'جزء مشفر',
    queryString: 'سلسلة Query',
    keyValueList: 'قائمة المفاتيح والقيم',
  },
  de: {
    textInput: 'URL / Text',
    textEncoded: 'Kodierte URL',
    componentInput: 'Wert / Segment',
    componentEncoded: 'Kodiertes Segment',
    queryString: 'Query-String',
    keyValueList: 'Schlüssel-Wert-Liste',
  },
  es: {
    textInput: 'URL / Texto',
    textEncoded: 'URL codificada',
    componentInput: 'Valor / Segmento',
    componentEncoded: 'Segmento codificado',
    queryString: 'Cadena Query',
    keyValueList: 'Lista clave-valor',
  },
  fr: {
    textInput: 'URL / Texte',
    textEncoded: 'URL encodée',
    componentInput: 'Valeur / Segment',
    componentEncoded: 'Segment encodé',
    queryString: 'Chaîne Query',
    keyValueList: 'Liste clé-valeur',
  },
  hi: {
    textInput: 'URL / टेक्स्ट',
    textEncoded: 'Encoded URL',
    componentInput: 'वैल्यू / सेगमेंट',
    componentEncoded: 'Encoded Segment',
    queryString: 'Query String',
    keyValueList: 'Key-Value List',
  },
  id: {
    textInput: 'URL / Teks',
    textEncoded: 'URL terenkripsi',
    componentInput: 'Nilai / Segmen',
    componentEncoded: 'Segmen terenkripsi',
    queryString: 'Query String',
    keyValueList: 'Daftar key-value',
  },
  it: {
    textInput: 'URL / Testo',
    textEncoded: 'URL codificato',
    componentInput: 'Valore / Segmento',
    componentEncoded: 'Segmento codificato',
    queryString: 'Query String',
    keyValueList: 'Elenco chiave-valore',
  },
  ja: {
    textInput: 'URL / テキスト',
    textEncoded: 'エンコード済み URL',
    componentInput: '値 / セグメント',
    componentEncoded: 'エンコード済みセグメント',
    queryString: 'Query 文字列',
    keyValueList: 'キーと値の一覧',
  },
  ko: {
    textInput: 'URL / 텍스트',
    textEncoded: '인코딩된 URL',
    componentInput: '값 / 세그먼트',
    componentEncoded: '인코딩된 세그먼트',
    queryString: 'Query 문자열',
    keyValueList: '키-값 목록',
  },
  nl: {
    textInput: 'URL / Tekst',
    textEncoded: 'Gecodeerde URL',
    componentInput: 'Waarde / Segment',
    componentEncoded: 'Gecodeerd segment',
    queryString: 'Querystring',
    keyValueList: 'Sleutel-waardelijst',
  },
  pl: {
    textInput: 'URL / Tekst',
    textEncoded: 'Zakodowany URL',
    componentInput: 'Wartość / Segment',
    componentEncoded: 'Zakodowany segment',
    queryString: 'Query string',
    keyValueList: 'Lista klucz-wartość',
  },
  pt: {
    textInput: 'URL / Texto',
    textEncoded: 'URL codificada',
    componentInput: 'Valor / Segmento',
    componentEncoded: 'Segmento codificado',
    queryString: 'Query String',
    keyValueList: 'Lista chave-valor',
  },
  ru: {
    textInput: 'URL / Текст',
    textEncoded: 'Закодированный URL',
    componentInput: 'Значение / Сегмент',
    componentEncoded: 'Закодированный сегмент',
    queryString: 'Query string',
    keyValueList: 'Список ключ-значение',
  },
  sv: {
    textInput: 'URL / Text',
    textEncoded: 'Kodad URL',
    componentInput: 'Värde / Segment',
    componentEncoded: 'Kodat segment',
    queryString: 'Query-sträng',
    keyValueList: 'Nyckel-värdelista',
  },
  th: {
    textInput: 'URL / ข้อความ',
    textEncoded: 'URL ที่เข้ารหัสแล้ว',
    componentInput: 'ค่า / เซกเมนต์',
    componentEncoded: 'เซกเมนต์ที่เข้ารหัสแล้ว',
    queryString: 'Query String',
    keyValueList: 'รายการคีย์-ค่า',
  },
  tr: {
    textInput: 'URL / Metin',
    textEncoded: 'Kodlanmış URL',
    componentInput: 'Değer / Segment',
    componentEncoded: 'Kodlanmış segment',
    queryString: 'Query String',
    keyValueList: 'Anahtar-değer listesi',
  },
  vi: {
    textInput: 'URL / Văn bản',
    textEncoded: 'URL đã mã hóa',
    componentInput: 'Giá trị / Đoạn',
    componentEncoded: 'Đoạn đã mã hóa',
    queryString: 'Chuỗi Query',
    keyValueList: 'Danh sách khóa-giá trị',
  },
}

function getItemFlow(lang: LangCode, item: UrlRouteParams) {
  const labels = routeLabels[lang]

  if (item.type === 'text' && item.operation === 'encode') {
    return { from: labels.textInput, to: labels.textEncoded }
  }
  if (item.type === 'text' && item.operation === 'decode') {
    return { from: labels.textEncoded, to: labels.textInput }
  }
  if (item.type === 'component' && item.operation === 'encode') {
    return { from: labels.componentInput, to: labels.componentEncoded }
  }
  if (item.type === 'component' && item.operation === 'decode') {
    return { from: labels.componentEncoded, to: labels.componentInput }
  }
  if (item.type === 'query' && item.operation === 'parse') {
    return { from: labels.queryString, to: labels.keyValueList }
  }

  return { from: labels.keyValueList, to: labels.queryString }
}

function createGroup(lang: LangCode, type: UrlRouteParams['type']): UrlCardGroup {
  const params = getUrlRouteParams(lang).filter(item => item.type === type)
  const title = groupLabels[lang][type]

  return {
    title,
    children: params.map(item => {
      const flow = getItemFlow(lang, item)
      return {
        title: item.h1,
        desc: item.description,
        href: `/web/encode-decode/url/${item.type}-${item.operation}-url`,
        from: flow.from,
        to: flow.to,
      }
    }),
  }
}

export function getUrlCards(lang: LangCode): UrlCardGroup[] {
  return [
    createGroup(lang, 'component'),
    createGroup(lang, 'query'),
  ]
}

export const urlGroups = getUrlCards('zh')

export const urlAllCards = [
  {
    children: urlGroups.flatMap(group => group.children),
  },
]
