import type { LangCode } from '../../../../types/i18n'
export type { LangCode } from '../../../../types/i18n'

export type InputType = 'component' | 'query'
export type Operation = 'encode' | 'decode' | 'parse' | 'build'

interface SeoTemplate {
  title: string
  description: string
  keywords: string
}

export interface UrlRouteParams extends SeoTemplate {
  type: InputType
  operation: Operation
  h1: string
  moreTools: string
}

type PageCopy = Omit<UrlRouteParams, 'type' | 'operation' | 'moreTools'>

interface LocaleCopy {
  moreTools: string
  pages: {
    componentEncode: PageCopy
    componentDecode: PageCopy
    queryParse: PageCopy
    queryBuild: PageCopy
  }
}

type ParamsItem = { params: UrlRouteParams }

const allLangCopy: Record<LangCode, LocaleCopy> = {
  zh: {
    moreTools: '更多 URL 工具',
    pages: {
      componentEncode: {
        h1: 'URL 编码（url-encode）',
        title: '在线 URL 编码 - 免费 url-encode 编码工具',
        description: '免费在线对单个 URL 参数值、路径片段或 hash 内容进行编码，会编码 / ? & = # 等保留字符，适合 url-encode 场景。',
        keywords: 'url组件编码,url-encode,参数值编码,路径片段编码,query参数编码,url参数转码',
      },
      componentDecode: {
        h1: 'URL 解码（url-decode）',
        title: '在线 URL 解码 - 免费 url-decode 解码工具',
        description: '免费在线对单个 URL 参数值或路径片段进行解码，还原被 url-encode 处理过的内容，适合 query 参数与片段还原。',
        keywords: 'url组件解码,url-decode,参数值解码,路径片段解码,query参数解码,url参数解码',
      },
      queryParse: {
        h1: 'Query 参数解析',
        title: '在线 Query 参数解析 - 免费 URL 查询字符串解析工具',
        description: '免费在线解析 URL 查询字符串，支持直接输入完整链接或 a=1&b=2 形式的 query，自动拆分为键值列表并解码显示。',
        keywords: 'query解析,url参数解析,query string parser,在线解析url参数,URLSearchParams,查询字符串解析',
      },
      queryBuild: {
        h1: 'Query 参数生成',
        title: '在线 Query 参数生成 - 免费查询字符串构建工具',
        description: '免费在线根据键值对生成 URL 查询字符串，支持重复参数、自动编码参数值，适合拼接 query、分享链接与接口调试。',
        keywords: 'query生成,url参数生成,查询字符串构建,在线拼接query,URLSearchParams builder,参数构造工具',
      },
    },
  },
  'zh-TW': {
    moreTools: '更多 URL 工具',
    pages: {
      componentEncode: {
        h1: 'URL 編碼（url-encode）',
        title: '線上 URL 編碼 - 免費 url-encode 編碼工具',
        description: '免費線上對單個 URL 參數值、路徑片段或 hash 內容進行編碼，會編碼 / ? & = # 等保留字元，適合 url-encode 場景。',
        keywords: 'url元件編碼,url-encode,參數值編碼,路徑片段編碼,query參數編碼,url參數轉碼',
      },
      componentDecode: {
        h1: 'URL 解碼（url-decode）',
        title: '線上 URL 解碼 - 免費 url-decode 解碼工具',
        description: '免費線上對單個 URL 參數值或路徑片段進行解碼，還原被 url-encode 處理過的內容，適合 query 參數與片段還原。',
        keywords: 'url元件解碼,url-decode,參數值解碼,路徑片段解碼,query參數解碼,url參數解碼',
      },
      queryParse: {
        h1: 'Query 參數解析',
        title: '線上 Query 參數解析 - 免費 URL 查詢字串解析工具',
        description: '免費線上解析 URL 查詢字串，支援直接輸入完整連結或 a=1&b=2 形式的 query，自動拆分為鍵值列表並解碼顯示。',
        keywords: 'query解析,url參數解析,query string parser,線上解析url參數,URLSearchParams,查詢字串解析',
      },
      queryBuild: {
        h1: 'Query 參數產生',
        title: '線上 Query 參數產生 - 免費查詢字串建立工具',
        description: '免費線上根據鍵值對產生 URL 查詢字串，支援重複參數、自動編碼參數值，適合拼接 query、分享連結與 API 測試。',
        keywords: 'query生成,url參數生成,查詢字串建立,線上拼接query,URLSearchParams builder,參數構造工具',
      },
    },
  },
  en: {
    moreTools: 'More URL Tools',
    pages: {
      componentEncode: {
        h1: 'URL Encode (url-encode)',
        title: 'Online URL Encoder - Free url-encode Tool',
        description: 'Free online tool to encode a single query value, path segment, or hash fragment. It encodes reserved characters like / ? & = # and is ideal for url-encode.',
        keywords: 'url component encode,url-encode,parameter value encoding,path segment encoding,query value encoder',
      },
      componentDecode: {
        h1: 'URL Decode (url-decode)',
        title: 'Online URL Decoder - Free url-decode Tool',
        description: 'Free online tool to decode a single query value or path segment previously encoded with url-encode. Great for restoring parameter and fragment content.',
        keywords: 'url component decode,url-decode,parameter value decode,path segment decode,query value decoder',
      },
      queryParse: {
        h1: 'Query Parser',
        title: 'Online Query Parser - Free URL Query String Parser',
        description: 'Free online tool to parse URL query strings. Paste a full URL or raw query like a=1&b=2, and it will split and decode the key-value pairs for you.',
        keywords: 'query parser,url query parser,parse query string,URLSearchParams,online url params parser,query string tool',
      },
      queryBuild: {
        h1: 'Query Builder',
        title: 'Online Query Builder - Free Query String Generator',
        description: 'Free online tool to build URL query strings from key-value pairs with automatic encoding and duplicate key support. Great for link sharing and API testing.',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,build query string,online query tool',
      },
    },
  },
  ar: {
    moreTools: 'المزيد من أدوات URL',
    pages: {
      componentEncode: {
        h1: 'ترميز URL (url-encode)',
        title: 'تشفير URL عبر الإنترنت - أداة url-encode مجانية',
        description: 'أداة مجانية عبر الإنترنت لترميز قيمة معلمة واحدة أو جزء من المسار أو جزء الهاش، مع ترميز الأحرف المحجوزة مثل / ? & = #. مناسبة لـ url-encode.',
        keywords: 'ترميز مكون url,url-encode,ترميز قيمة معلمة,ترميز جزء المسار,ترميز query',
      },
      componentDecode: {
        h1: 'فك ترميز URL (url-decode)',
        title: 'فك تشفير URL عبر الإنترنت - أداة url-decode مجانية',
        description: 'أداة مجانية عبر الإنترنت لفك ترميز قيمة معلمة واحدة أو جزء من المسار تم ترميزه سابقاً بواسطة url-encode.',
        keywords: 'فك ترميز مكون url,url-decode,فك قيمة معلمة,فك جزء المسار,فك query',
      },
      queryParse: {
        h1: 'تحليل Query',
        title: 'محلل Query عبر الإنترنت - أداة مجانية لتحليل معلمات URL',
        description: 'أداة مجانية عبر الإنترنت لتحليل سلسلة استعلام URL. الصق رابطاً كاملاً أو query خام مثل a=1&b=2 وسيتم تقسيمه وفك ترميزه إلى أزواج مفتاح وقيمة.',
        keywords: 'تحليل query,تحليل معلمات url,query string parser,URLSearchParams,محلل url',
      },
      queryBuild: {
        h1: 'إنشاء Query',
        title: 'منشئ Query عبر الإنترنت - أداة مجانية لإنشاء query string',
        description: 'أداة مجانية عبر الإنترنت لإنشاء سلسلة استعلام URL من أزواج المفتاح والقيمة مع ترميز تلقائي ودعم المفاتيح المكررة.',
        keywords: 'إنشاء query,منشئ query string,منشئ معلمات url,URLSearchParams builder,أداة query',
      },
    },
  },
  de: {
    moreTools: 'Weitere URL-Tools',
    pages: {
      componentEncode: {
        h1: 'URL kodieren (url-encode)',
        title: 'Online URL Encoder - Kostenloses url-encode-Tool',
        description: 'Kostenloses Online-Tool zum Kodieren einzelner Query-Werte, Pfadsegmente oder Hash-Fragmente. Reservierte Zeichen wie / ? & = # werden kodiert. Ideal für url-encode.',
        keywords: 'url komponente kodieren,url-encode,parameterwert kodieren,pfadsegment kodieren,query wert',
      },
      componentDecode: {
        h1: 'URL dekodieren (url-decode)',
        title: 'Online URL Decoder - Kostenloses url-decode-Tool',
        description: 'Kostenloses Online-Tool zum Dekodieren einzelner Query-Werte oder Pfadsegmente, die zuvor mit url-encode kodiert wurden.',
        keywords: 'url komponente dekodieren,url-decode,parameterwert dekodieren,pfadsegment dekodieren,query wert',
      },
      queryParse: {
        h1: 'Query Parser',
        title: 'Online Query Parser - Kostenloses Tool für URL-Parameter',
        description: 'Kostenloses Online-Tool zum Parsen von URL-Query-Strings. Fügen Sie eine vollständige URL oder eine Query wie a=1&b=2 ein, um dekodierte Schlüssel-Wert-Paare zu erhalten.',
        keywords: 'query parser,url parameter parser,query string parser,URLSearchParams,online url parser',
      },
      queryBuild: {
        h1: 'Query Builder',
        title: 'Online Query Builder - Kostenloser Query-String-Generator',
        description: 'Kostenloses Online-Tool zum Erstellen von URL-Query-Strings aus Schlüssel-Wert-Paaren mit automatischer Kodierung und Unterstützung für doppelte Schlüssel.',
        keywords: 'query builder,query string generator,url parameter builder,URLSearchParams builder,online query tool',
      },
    },
  },
  es: {
    moreTools: 'Más herramientas URL',
    pages: {
      componentEncode: {
        h1: 'Codificar URL (url-encode)',
        title: 'Codificador URL Online - Herramienta gratuita de url-encode',
        description: 'Herramienta gratuita online para codificar un valor de parámetro, segmento de ruta o fragmento hash. Codifica caracteres reservados como / ? & = #. Ideal para url-encode.',
        keywords: 'codificar componente url,url-encode,codificar valor de parámetro,codificar segmento de ruta,query value',
      },
      componentDecode: {
        h1: 'Decodificar URL (url-decode)',
        title: 'Decodificador URL Online - Herramienta gratuita de url-decode',
        description: 'Herramienta gratuita online para decodificar un valor de parámetro o segmento de ruta codificado previamente con url-encode.',
        keywords: 'decodificar componente url,url-decode,decodificar valor de parámetro,segmento de ruta,query value',
      },
      queryParse: {
        h1: 'Analizador Query',
        title: 'Analizador Query Online - Herramienta gratuita para parámetros URL',
        description: 'Herramienta gratuita online para analizar cadenas query de URL. Pega una URL completa o una query como a=1&b=2 y obtén pares clave-valor decodificados.',
        keywords: 'analizador query,analizar parámetros url,query string parser,URLSearchParams,analizador url',
      },
      queryBuild: {
        h1: 'Generador Query',
        title: 'Generador Query Online - Herramienta gratuita para query string',
        description: 'Herramienta gratuita online para generar cadenas query de URL a partir de pares clave-valor con codificación automática y soporte para claves repetidas.',
        keywords: 'generador query,query string generator,generar parámetros url,URLSearchParams builder,herramienta query',
      },
    },
  },
  fr: {
    moreTools: "Plus d'outils URL",
    pages: {
      componentEncode: {
        h1: 'Encoder URL (url-encode)',
        title: 'Encodeur URL en ligne - Outil gratuit url-encode',
        description: 'Outil gratuit en ligne pour encoder une valeur de paramètre, un segment de chemin ou un fragment hash. Encode aussi / ? & = #. Idéal pour url-encode.',
        keywords: 'composant url encoder,url-encode,valeur de paramètre,segment de chemin,query value',
      },
      componentDecode: {
        h1: 'Décoder URL (url-decode)',
        title: 'Décodeur URL en ligne - Outil gratuit url-decode',
        description: 'Outil gratuit en ligne pour décoder une valeur de paramètre ou un segment de chemin précédemment encodé avec url-encode.',
        keywords: 'composant url décoder,url-decode,valeur de paramètre,segment de chemin,query value',
      },
      queryParse: {
        h1: 'Analyseur Query',
        title: 'Analyseur Query en ligne - Outil gratuit pour paramètres URL',
        description: 'Outil gratuit en ligne pour analyser une query URL. Collez une URL complète ou une query brute comme a=1&b=2 pour obtenir les paires clé-valeur décodées.',
        keywords: 'analyseur query,paramètres url,query string parser,URLSearchParams,outil url',
      },
      queryBuild: {
        h1: 'Générateur Query',
        title: 'Générateur Query en ligne - Outil gratuit pour query string',
        description: 'Outil gratuit en ligne pour générer une query URL à partir de paires clé-valeur avec encodage automatique et prise en charge des clés dupliquées.',
        keywords: 'générateur query,query string generator,paramètres url,URLSearchParams builder,outil query',
      },
    },
  },
  hi: {
    moreTools: 'और URL टूल',
    pages: {
      componentEncode: {
        h1: 'URL एन्कोड (url-encode)',
        title: 'ऑनलाइन URL एन्कोडर - मुफ्त url-encode टूल',
        description: 'एक single query value, path segment या hash fragment को एन्कोड करें। / ? & = # जैसे reserved characters भी एन्कोड होंगे। url-encode के लिए उपयुक्त।',
        keywords: 'url component encode,url-encode,parameter value encode,path segment encode,query value',
      },
      componentDecode: {
        h1: 'URL डिकोड (url-decode)',
        title: 'ऑनलाइन URL डिकोडर - मुफ्त url-decode टूल',
        description: 'url-encode से पहले एन्कोड की गई single parameter value या path segment को डिकोड करें।',
        keywords: 'url component decode,url-decode,parameter value decode,path segment decode,query value',
      },
      queryParse: {
        h1: 'Query Parser',
        title: 'ऑनलाइन Query Parser - URL पैरामीटर के लिए मुफ्त टूल',
        description: 'पूरी URL या a=1&b=2 जैसी raw query को parse करें और decoded key-value pairs प्राप्त करें।',
        keywords: 'query parser,url params parser,query string parser,URLSearchParams,url tool',
      },
      queryBuild: {
        h1: 'Query Builder',
        title: 'ऑनलाइन Query Builder - query string बनाने का मुफ्त टूल',
        description: 'key-value pairs से URL query string बनाएँ, auto encoding और duplicate key support के साथ।',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  id: {
    moreTools: 'Alat URL Lainnya',
    pages: {
      componentEncode: {
        h1: 'Encode URL (url-encode)',
        title: 'Encoder URL Online - Alat gratis url-encode',
        description: 'Alat gratis online untuk meng-encode satu nilai query, segmen path, atau fragmen hash. Karakter reservasi seperti / ? & = # juga akan di-encode. Cocok untuk url-encode.',
        keywords: 'encode komponen url,url-encode,nilai parameter,path segment,query value',
      },
      componentDecode: {
        h1: 'Decode URL (url-decode)',
        title: 'Decoder URL Online - Alat gratis url-decode',
        description: 'Alat gratis online untuk mendekode satu nilai parameter atau segmen path yang sebelumnya di-encode dengan url-encode.',
        keywords: 'decode komponen url,url-decode,nilai parameter,path segment,query value',
      },
      queryParse: {
        h1: 'Parser Query',
        title: 'Parser Query Online - Alat gratis untuk parameter URL',
        description: 'Alat gratis online untuk mem-parsing query URL. Tempel URL lengkap atau query mentah seperti a=1&b=2 untuk mendapatkan pasangan key-value yang sudah didekode.',
        keywords: 'parser query,parameter url,query string parser,URLSearchParams,alat url',
      },
      queryBuild: {
        h1: 'Builder Query',
        title: 'Builder Query Online - Alat gratis pembuat query string',
        description: 'Alat gratis online untuk membuat query string URL dari pasangan key-value dengan encoding otomatis dan dukungan key duplikat.',
        keywords: 'builder query,pembuat query string,parameter url,URLSearchParams builder,alat query',
      },
    },
  },
  it: {
    moreTools: 'Altri strumenti URL',
    pages: {
      componentEncode: {
        h1: 'Codifica URL (url-encode)',
        title: 'Encoder URL online - Strumento gratuito url-encode',
        description: 'Strumento gratuito online per codificare un singolo valore query, segmento di percorso o frammento hash. Codifica anche / ? & = #. Ideale per url-encode.',
        keywords: 'codifica componente url,url-encode,valore parametro,segmento percorso,query value',
      },
      componentDecode: {
        h1: 'Decodifica URL (url-decode)',
        title: 'Decoder URL online - Strumento gratuito url-decode',
        description: 'Strumento gratuito online per decodificare un singolo valore di parametro o segmento di percorso codificato in precedenza con url-encode.',
        keywords: 'decodifica componente url,url-decode,valore parametro,segmento percorso,query value',
      },
      queryParse: {
        h1: 'Parser Query',
        title: 'Parser Query online - Strumento gratuito per parametri URL',
        description: 'Strumento gratuito online per analizzare query URL. Incolla un URL completo o una query grezza come a=1&b=2 per ottenere coppie chiave-valore decodificate.',
        keywords: 'parser query,parametri url,query string parser,URLSearchParams,strumento url',
      },
      queryBuild: {
        h1: 'Builder Query',
        title: 'Builder Query online - Strumento gratuito per query string',
        description: 'Strumento gratuito online per creare query URL da coppie chiave-valore con codifica automatica e supporto per chiavi duplicate.',
        keywords: 'builder query,query string generator,parametri url,URLSearchParams builder,strumento query',
      },
    },
  },
  ja: {
    moreTools: 'その他の URL ツール',
    pages: {
      componentEncode: {
        h1: 'URL エンコード（url-encode）',
        title: 'オンライン URL エンコーダー - 無料 url-encode ツール',
        description: '単一の query 値、パスセグメント、hash フラグメントをエンコードする無料オンラインツールです。/ ? & = # もエンコードされます。url-encode 向け。',
        keywords: 'url component encode,url-encode,パラメータ値,パスセグメント,query value',
      },
      componentDecode: {
        h1: 'URL デコード（url-decode）',
        title: 'オンライン URL デコーダー - 無料 url-decode ツール',
        description: 'url-encode で処理された単一のパラメータ値やパスセグメントをデコードする無料オンラインツールです。',
        keywords: 'url component decode,url-decode,パラメータ値,パスセグメント,query value',
      },
      queryParse: {
        h1: 'Query パーサー',
        title: 'オンライン Query パーサー - URL パラメータ解析の無料ツール',
        description: '完全な URL または a=1&b=2 のような生の query を解析し、デコード済みのキーと値を取得できる無料オンラインツールです。',
        keywords: 'query parser,url parameters,query string parser,URLSearchParams,URL ツール',
      },
      queryBuild: {
        h1: 'Query ビルダー',
        title: 'オンライン Query ビルダー - query string 作成の無料ツール',
        description: 'キーと値のペアから URL query string を作成できる無料オンラインツールです。自動エンコードと重複キーに対応します。',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  ko: {
    moreTools: '더 많은 URL 도구',
    pages: {
      componentEncode: {
        h1: 'URL 인코딩 (url-encode)',
        title: '온라인 URL 인코더 - 무료 url-encode 도구',
        description: '단일 query 값, 경로 세그먼트 또는 hash 조각을 인코딩하는 무료 온라인 도구입니다. / ? & = # 같은 예약 문자도 인코딩됩니다. url-encode에 적합합니다.',
        keywords: 'url component encode,url-encode,파라미터 값,경로 세그먼트,query value',
      },
      componentDecode: {
        h1: 'URL 디코딩 (url-decode)',
        title: '온라인 URL 디코더 - 무료 url-decode 도구',
        description: 'url-encode로 처리된 단일 파라미터 값 또는 경로 세그먼트를 디코딩하는 무료 온라인 도구입니다.',
        keywords: 'url component decode,url-decode,파라미터 값,경로 세그먼트,query value',
      },
      queryParse: {
        h1: 'Query 파서',
        title: '온라인 Query 파서 - URL 파라미터 분석 무료 도구',
        description: '전체 URL 또는 a=1&b=2 같은 raw query를 분석해 디코딩된 키-값 쌍을 보여주는 무료 온라인 도구입니다.',
        keywords: 'query parser,url params parser,query string parser,URLSearchParams,URL 도구',
      },
      queryBuild: {
        h1: 'Query 빌더',
        title: '온라인 Query 빌더 - query string 생성 무료 도구',
        description: '키-값 쌍으로 URL query string을 생성하는 무료 온라인 도구입니다. 자동 인코딩과 중복 키를 지원합니다.',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  nl: {
    moreTools: 'Meer URL-tools',
    pages: {
      componentEncode: {
        h1: 'URL coderen (url-encode)',
        title: 'Online url-encoder - Gratis url-encode-tool',
        description: 'Gratis online tool om één querywaarde, padsegment of hash-fragment te coderen. Gereserveerde tekens zoals / ? & = # worden ook gecodeerd. Ideaal voor url-encode.',
        keywords: 'url component coderen,url-encode,parameterwaarde,padsegment,query value',
      },
      componentDecode: {
        h1: 'URL decoderen (url-decode)',
        title: 'Online URL-decoder - Gratis url-decode-tool',
        description: 'Gratis online tool om één parameterwaarde of padsegment te decoderen dat eerder met url-encode is gecodeerd.',
        keywords: 'url component decoderen,url-decode,parameterwaarde,padsegment,query value',
      },
      queryParse: {
        h1: 'Query parser',
        title: 'Online Query parser - Gratis tool voor URL-parameters',
        description: 'Gratis online tool om URL-querystrings te parseren. Plak een volledige URL of een ruwe query zoals a=1&b=2 en krijg gedecodeerde sleutel-waardeparen.',
        keywords: 'query parser,url parameters,query string parser,URLSearchParams,url tool',
      },
      queryBuild: {
        h1: 'Query builder',
        title: 'Online Query builder - Gratis querystring-generator',
        description: 'Gratis online tool om URL-querystrings te bouwen uit sleutel-waardeparen met automatische codering en ondersteuning voor dubbele sleutels.',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  pl: {
    moreTools: 'Więcej narzędzi URL',
    pages: {
      componentEncode: {
        h1: 'Kodowanie URL (url-encode)',
        title: 'Online URL Encoder - Darmowe narzędzie url-encode',
        description: 'Darmowe narzędzie online do kodowania pojedynczej wartości query, segmentu ścieżki lub fragmentu hash. Koduje także / ? & = #. Idealne dla url-encode.',
        keywords: 'komponent url encode,url-encode,wartość parametru,segment ścieżki,query value',
      },
      componentDecode: {
        h1: 'Dekodowanie URL (url-decode)',
        title: 'Online URL Decoder - Darmowe narzędzie url-decode',
        description: 'Darmowe narzędzie online do dekodowania pojedynczej wartości parametru lub segmentu ścieżki wcześniej zakodowanego przez url-encode.',
        keywords: 'komponent url decode,url-decode,wartość parametru,segment ścieżki,query value',
      },
      queryParse: {
        h1: 'Parser Query',
        title: 'Online Query Parser - Darmowe narzędzie do parametrów URL',
        description: 'Darmowe narzędzie online do parsowania query URL. Wklej pełny URL lub surowe query jak a=1&b=2, aby otrzymać zdekodowane pary klucz-wartość.',
        keywords: 'query parser,parametry url,query string parser,URLSearchParams,narzędzie url',
      },
      queryBuild: {
        h1: 'Builder Query',
        title: 'Online Query Builder - Darmowy generator query string',
        description: 'Darmowe narzędzie online do budowania query URL z par klucz-wartość z automatycznym kodowaniem i obsługą zduplikowanych kluczy.',
        keywords: 'query builder,query string generator,parametry url,URLSearchParams builder,query tool',
      },
    },
  },
  pt: {
    moreTools: 'Mais ferramentas de URL',
    pages: {
      componentEncode: {
        h1: 'Codificar URL (url-encode)',
        title: 'Codificador de URL Online - Ferramenta gratuita de url-encode',
        description: 'Ferramenta gratuita online para codificar um único valor de query, segmento de caminho ou fragmento hash. Também codifica / ? & = #. Ideal para url-encode.',
        keywords: 'componente url encode,url-encode,valor de parâmetro,segmento de caminho,query value',
      },
      componentDecode: {
        h1: 'Decodificar URL (url-decode)',
        title: 'Decodificador de URL Online - Ferramenta gratuita de url-decode',
        description: 'Ferramenta gratuita online para decodificar um único valor de parâmetro ou segmento de caminho codificado anteriormente com url-encode.',
        keywords: 'componente url decode,url-decode,valor de parâmetro,segmento de caminho,query value',
      },
      queryParse: {
        h1: 'Parser de Query',
        title: 'Parser de Query Online - Ferramenta gratuita para parâmetros URL',
        description: 'Ferramenta gratuita online para analisar query strings de URL. Cole uma URL completa ou query bruta como a=1&b=2 e obtenha pares chave-valor decodificados.',
        keywords: 'parser de query,parâmetros url,query string parser,URLSearchParams,ferramenta url',
      },
      queryBuild: {
        h1: 'Builder de Query',
        title: 'Builder de Query Online - Gerador gratuito de query string',
        description: 'Ferramenta gratuita online para gerar query strings de URL a partir de pares chave-valor com codificação automática e suporte a chaves duplicadas.',
        keywords: 'builder de query,query string generator,parâmetros url,URLSearchParams builder,query tool',
      },
    },
  },
  ru: {
    moreTools: 'Другие URL-инструменты',
    pages: {
      componentEncode: {
        h1: 'Кодирование URL (url-encode)',
        title: 'Онлайн URL Encoder - Бесплатный инструмент url-encode',
        description: 'Бесплатный онлайн-инструмент для кодирования одного query-значения, сегмента пути или hash-фрагмента. Кодирует также / ? & = #. Подходит для url-encode.',
        keywords: 'url component encode,url-encode,значение параметра,сегмент пути,query value',
      },
      componentDecode: {
        h1: 'Декодирование URL (url-decode)',
        title: 'Онлайн URL Decoder - Бесплатный инструмент url-decode',
        description: 'Бесплатный онлайн-инструмент для декодирования одного значения параметра или сегмента пути, ранее закодированного с помощью url-encode.',
        keywords: 'url component decode,url-decode,значение параметра,сегмент пути,query value',
      },
      queryParse: {
        h1: 'Query Parser',
        title: 'Онлайн Query Parser - Бесплатный инструмент для параметров URL',
        description: 'Бесплатный онлайн-инструмент для разбора URL query. Вставьте полный URL или сырую query вроде a=1&b=2, чтобы получить декодированные пары ключ-значение.',
        keywords: 'query parser,параметры url,query string parser,URLSearchParams,инструмент url',
      },
      queryBuild: {
        h1: 'Query Builder',
        title: 'Онлайн Query Builder - Бесплатный генератор query string',
        description: 'Бесплатный онлайн-инструмент для создания URL query из пар ключ-значение с автоматическим кодированием и поддержкой повторяющихся ключей.',
        keywords: 'query builder,query string generator,параметры url,URLSearchParams builder,query tool',
      },
    },
  },
  sv: {
    moreTools: 'Fler URL-verktyg',
    pages: {
      componentEncode: {
        h1: 'URL-kodning (url-encode)',
        title: 'Online url-encoder - Gratis url-encode-verktyg',
        description: 'Gratis onlineverktyg för att koda ett enskilt query-värde, sökvägssegment eller hash-fragment. Reserverade tecken som / ? & = # kodas också. Perfekt för url-encode.',
        keywords: 'url component encode,url-encode,parametervärde,sökvägssegment,query value',
      },
      componentDecode: {
        h1: 'URL-avkodning (url-decode)',
        title: 'Online URL-decoder - Gratis url-decode-verktyg',
        description: 'Gratis onlineverktyg för att avkoda ett enskilt parametervärde eller sökvägssegment som tidigare kodats med url-encode.',
        keywords: 'url component decode,url-decode,parametervärde,sökvägssegment,query value',
      },
      queryParse: {
        h1: 'Query-parser',
        title: 'Online Query-parser - Gratis verktyg för URL-parametrar',
        description: 'Gratis onlineverktyg för att tolka URL-querysträngar. Klistra in en fullständig URL eller en rå query som a=1&b=2 för att få avkodade nyckel-värdepar.',
        keywords: 'query parser,url parametrar,query string parser,URLSearchParams,url verktyg',
      },
      queryBuild: {
        h1: 'Query-byggare',
        title: 'Online Query-byggare - Gratis generator för query string',
        description: 'Gratis onlineverktyg för att bygga URL-querysträngar från nyckel-värdepar med automatisk kodning och stöd för dubbla nycklar.',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  th: {
    moreTools: 'เครื่องมือ URL เพิ่มเติม',
    pages: {
      componentEncode: {
        h1: 'เข้ารหัส URL (url-encode)',
        title: 'ตัวเข้ารหัส URL ออนไลน์ - เครื่องมือ url-encode ฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับเข้ารหัสค่า query เดี่ยว ส่วนของ path หรือ hash fragment โดยจะเข้ารหัส / ? & = # ด้วย เหมาะสำหรับ url-encode',
        keywords: 'url component encode,url-encode,parameter value,path segment,query value',
      },
      componentDecode: {
        h1: 'ถอดรหัส URL (url-decode)',
        title: 'ตัวถอดรหัส URL ออนไลน์ - เครื่องมือ url-decode ฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับถอดรหัสค่า parameter เดี่ยวหรือ path segment ที่เคยเข้ารหัสด้วย url-encode',
        keywords: 'url component decode,url-decode,parameter value,path segment,query value',
      },
      queryParse: {
        h1: 'ตัวแยก Query',
        title: 'ตัวแยก Query ออนไลน์ - เครื่องมือฟรีสำหรับพารามิเตอร์ URL',
        description: 'เครื่องมือฟรีออนไลน์สำหรับแยก query ของ URL วาง URL เต็มหรือ query แบบ a=1&b=2 เพื่อดูคู่คีย์-ค่าที่ถอดรหัสแล้ว',
        keywords: 'query parser,url params parser,query string parser,URLSearchParams,url tool',
      },
      queryBuild: {
        h1: 'ตัวสร้าง Query',
        title: 'ตัวสร้าง Query ออนไลน์ - เครื่องมือฟรีสำหรับสร้าง query string',
        description: 'เครื่องมือฟรีออนไลน์สำหรับสร้าง query string ของ URL จากคู่คีย์-ค่า พร้อมเข้ารหัสอัตโนมัติและรองรับคีย์ซ้ำ',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  tr: {
    moreTools: 'Daha fazla URL aracı',
    pages: {
      componentEncode: {
        h1: 'URL Kodlama (url-encode)',
        title: 'Online URL Encoder - Ücretsiz url-encode aracı',
        description: 'Tek bir query değeri, path segmenti veya hash fragmentini kodlayan ücretsiz online araç. / ? & = # gibi karakterleri de kodlar. url-encode için uygundur.',
        keywords: 'url component encode,url-encode,parametre değeri,path segment,query value',
      },
      componentDecode: {
        h1: 'URL Çözme (url-decode)',
        title: 'Online URL Decoder - Ücretsiz url-decode aracı',
        description: 'Daha önce url-encode ile kodlanmış tek bir parametre değeri veya path segmentini çözen ücretsiz online araç.',
        keywords: 'url component decode,url-decode,parametre değeri,path segment,query value',
      },
      queryParse: {
        h1: 'Query Ayrıştırıcı',
        title: 'Online Query ayrıştırıcı - URL parametreleri için ücretsiz araç',
        description: 'URL query stringlerini ayrıştıran ücretsiz online araç. Tam bir URL veya a=1&b=2 gibi raw query girin, decoded anahtar-değer çiftlerini görün.',
        keywords: 'query parser,url params parser,query string parser,URLSearchParams,url aracı',
      },
      queryBuild: {
        h1: 'Query Oluşturucu',
        title: 'Online Query oluşturucu - Ücretsiz query string üretici',
        description: 'Anahtar-değer çiftlerinden otomatik kodlama ve tekrar eden anahtar desteğiyle URL query string oluşturan ücretsiz online araç.',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
  vi: {
    moreTools: 'Các công cụ URL khác',
    pages: {
      componentEncode: {
        h1: 'Mã hóa URL (url-encode)',
        title: 'Trình mã hóa URL trực tuyến - Công cụ url-encode miễn phí',
        description: 'Công cụ miễn phí trực tuyến để mã hóa một giá trị query, đoạn path hoặc hash fragment. Các ký tự / ? & = # cũng sẽ được mã hóa. Phù hợp với url-encode.',
        keywords: 'url component encode,url-encode,giá trị tham số,path segment,query value',
      },
      componentDecode: {
        h1: 'Giải mã URL (url-decode)',
        title: 'Trình giải mã URL trực tuyến - Công cụ url-decode miễn phí',
        description: 'Công cụ miễn phí trực tuyến để giải mã một giá trị tham số hoặc đoạn path đã được mã hóa trước đó bằng url-encode.',
        keywords: 'url component decode,url-decode,giá trị tham số,path segment,query value',
      },
      queryParse: {
        h1: 'Trình phân tích Query',
        title: 'Trình phân tích Query trực tuyến - Công cụ miễn phí cho tham số URL',
        description: 'Công cụ miễn phí trực tuyến để phân tích query của URL. Dán URL đầy đủ hoặc query thô như a=1&b=2 để nhận các cặp khóa-giá trị đã giải mã.',
        keywords: 'query parser,url params parser,query string parser,URLSearchParams,công cụ url',
      },
      queryBuild: {
        h1: 'Trình tạo Query',
        title: 'Trình tạo Query trực tuyến - Công cụ miễn phí tạo query string',
        description: 'Công cụ miễn phí trực tuyến để tạo URL query string từ các cặp khóa-giá trị với mã hóa tự động và hỗ trợ khóa trùng lặp.',
        keywords: 'query builder,query string generator,url params builder,URLSearchParams builder,query tool',
      },
    },
  },
}

export function getUrlRouteParams(lang: LangCode): UrlRouteParams[] {
  const { moreTools, pages } = allLangCopy[lang]

  return [
    { type: 'component', operation: 'encode', moreTools, ...pages.componentEncode },
    { type: 'component', operation: 'decode', moreTools, ...pages.componentDecode },
    { type: 'query', operation: 'parse', moreTools, ...pages.queryParse },
    { type: 'query', operation: 'build', moreTools, ...pages.queryBuild },
  ]
}

export function getUrlPaths(lang: LangCode): { paths: () => ParamsItem[] } {
  return {
    paths: () => getUrlRouteParams(lang).map(params => ({ params })),
  }
}

export default getUrlPaths('zh')
