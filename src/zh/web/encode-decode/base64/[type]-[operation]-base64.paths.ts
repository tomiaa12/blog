export type InputType = 'text' | 'image' | 'file'
export type Operation = 'encode' | 'decode'

export interface Base64RouteParams {
  type: InputType
  operation: Operation
  title: string
  description: string
  keywords: string
  h1: string
  moreTools: string
}

type LangCode =
  | 'zh' | 'en' | 'ar' | 'de' | 'es' | 'fr' | 'hi' | 'id'
  | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sv'
  | 'th' | 'tr' | 'vi' | 'zh-TW'

type ParamsItem = { params: Base64RouteParams }

const allLangParams: Record<LangCode, ParamsItem[]> = {
  zh: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: '文字 Base64 编码',
        title: '在线文字 Base64 编码 - 免费文本转 Base64 工具',
        description: '免费在线将文字/文本转换为 Base64 编码，无需上传，即时处理，一键复制结果，安全私密。',
        keywords: '文字base64编码,文本转base64,在线base64编码,base64 encode,文字转base64,base64编码工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: '文字 Base64 解码',
        title: '在线文字 Base64 解码 - 免费 Base64 转文本工具',
        description: '免费在线将 Base64 字符串解码为原始文字/文本，无需上传，即时处理，一键复制结果，安全私密。',
        keywords: 'base64解码,base64转文字,在线base64解码,base64 decode,base64转文本,base64解码工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: '图片 Base64 编码',
        title: '在线图片 Base64 编码 - 免费图片转 Base64 工具',
        description: '免费在线将图片转换为 Base64 字符串，支持 PNG、JPG、GIF、WebP 等格式，无需上传服务器，即时输出，安全私密。',
        keywords: '图片base64编码,图片转base64,在线图片转base64,image to base64,base64图片编码,图片base64工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: '图片 Base64 解码',
        title: '在线图片 Base64 解码 - 免费 Base64 转图片工具',
        description: '免费在线将 Base64 字符串还原为图片并预览/下载，支持 PNG、JPG、GIF、WebP 等格式，无需上传，安全私密。',
        keywords: 'base64转图片,图片base64解码,在线base64转图片,base64 to image,base64图片预览,base64图片工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: '文件 Base64 编码',
        title: '在线文件 Base64 编码 - 免费文件转 Base64 工具',
        description: '免费在线将任意文件转换为 Base64 字符串，支持拖拽上传，无需上传服务器，即时输出，安全私密。',
        keywords: '文件base64编码,文件转base64,在线文件转base64,file to base64,base64文件编码,base64文件工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: '文件 Base64 解码',
        title: '在线文件 Base64 解码 - 免费 Base64 转文件工具',
        description: '免费在线将 Base64 字符串解码还原为原始文件并下载，无需上传服务器，即时处理，安全私密。',
        keywords: 'base64转文件,文件base64解码,在线base64转文件,base64 to file,base64文件解码,base64文件工具',
        moreTools: '更多 Base64 工具',
      },
    },
  ],

  'zh-TW': [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: '文字 Base64 編碼',
        title: '線上文字 Base64 編碼 - 免費文字轉 Base64 工具',
        description: '免費線上將文字/文本轉換為 Base64 編碼，無需上傳，即時處理，一鍵複製結果，安全私密。',
        keywords: '文字base64編碼,文字轉base64,線上base64編碼,base64 encode,base64編碼工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: '文字 Base64 解碼',
        title: '線上文字 Base64 解碼 - 免費 Base64 轉文字工具',
        description: '免費線上將 Base64 字串解碼為原始文字/文本，無需上傳，即時處理，一鍵複製結果，安全私密。',
        keywords: 'base64解碼,base64轉文字,線上base64解碼,base64 decode,base64解碼工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: '圖片 Base64 編碼',
        title: '線上圖片 Base64 編碼 - 免費圖片轉 Base64 工具',
        description: '免費線上將圖片轉換為 Base64 字串，支援 PNG、JPG、GIF、WebP 等格式，無需上傳伺服器，即時輸出，安全私密。',
        keywords: '圖片base64編碼,圖片轉base64,線上圖片轉base64,image to base64,base64圖片工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: '圖片 Base64 解碼',
        title: '線上圖片 Base64 解碼 - 免費 Base64 轉圖片工具',
        description: '免費線上將 Base64 字串還原為圖片並預覽/下載，支援 PNG、JPG、GIF、WebP 等格式，無需上傳，安全私密。',
        keywords: 'base64轉圖片,圖片base64解碼,線上base64轉圖片,base64 to image,base64圖片工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: '檔案 Base64 編碼',
        title: '線上檔案 Base64 編碼 - 免費檔案轉 Base64 工具',
        description: '免費線上將任意檔案轉換為 Base64 字串，支援拖曳上傳，無需上傳伺服器，即時輸出，安全私密。',
        keywords: '檔案base64編碼,檔案轉base64,線上檔案轉base64,file to base64,base64檔案工具',
        moreTools: '更多 Base64 工具',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: '檔案 Base64 解碼',
        title: '線上檔案 Base64 解碼 - 免費 Base64 轉檔案工具',
        description: '免費線上將 Base64 字串解碼還原為原始檔案並下載，無需上傳伺服器，即時處理，安全私密。',
        keywords: 'base64轉檔案,檔案base64解碼,線上base64轉檔案,base64 to file,base64檔案工具',
        moreTools: '更多 Base64 工具',
      },
    },
  ],

  en: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Text Base64 Encode',
        title: 'Online Text to Base64 Encoder - Free Base64 Encoding Tool',
        description: 'Free online tool to encode text/strings to Base64. No upload needed, instant processing, one-click copy, safe and private.',
        keywords: 'text to base64,base64 encode,online base64 encoder,base64 encoding tool,string to base64',
        moreTools: 'More Base64 Tools',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Text Base64 Decode',
        title: 'Online Base64 to Text Decoder - Free Base64 Decoding Tool',
        description: 'Free online tool to decode Base64 strings back to plain text. No upload needed, instant processing, one-click copy, safe and private.',
        keywords: 'base64 to text,base64 decode,online base64 decoder,base64 decoding tool,decode base64',
        moreTools: 'More Base64 Tools',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Image Base64 Encode',
        title: 'Online Image to Base64 Encoder - Free Image Base64 Tool',
        description: 'Free online tool to convert images to Base64 strings. Supports PNG, JPG, GIF, WebP and more. No server upload, instant output, safe and private.',
        keywords: 'image to base64,base64 encode image,online image base64,convert image to base64,base64 image tool',
        moreTools: 'More Base64 Tools',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Image Base64 Decode',
        title: 'Online Base64 to Image Decoder - Free Base64 Image Tool',
        description: 'Free online tool to decode Base64 strings back to images with preview and download. Supports PNG, JPG, GIF, WebP. No upload needed, safe and private.',
        keywords: 'base64 to image,decode base64 image,online base64 image,base64 image preview,base64 image tool',
        moreTools: 'More Base64 Tools',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'File Base64 Encode',
        title: 'Online File to Base64 Encoder - Free File Base64 Tool',
        description: 'Free online tool to convert any file to a Base64 string. Supports drag and drop. No server upload, instant output, safe and private.',
        keywords: 'file to base64,base64 encode file,online file base64,convert file to base64,base64 file tool',
        moreTools: 'More Base64 Tools',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'File Base64 Decode',
        title: 'Online Base64 to File Decoder - Free Base64 File Tool',
        description: 'Free online tool to decode Base64 strings back to original files and download. No server upload, instant processing, safe and private.',
        keywords: 'base64 to file,decode base64 file,online base64 file,base64 file download,base64 file tool',
        moreTools: 'More Base64 Tools',
      },
    },
  ],

  ar: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'ترميز النص Base64',
        title: 'تشفير النص إلى Base64 عبر الإنترنت - أداة مجانية',
        description: 'أداة مجانية عبر الإنترنت لتشفير النص/السلاسل إلى Base64. بدون رفع، معالجة فورية، نسخ بنقرة واحدة، آمن وخاص.',
        keywords: 'تشفير base64,نص إلى base64,أداة base64,ترميز base64,تحويل نص',
        moreTools: 'المزيد من أدوات Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'فك ترميز النص Base64',
        title: 'فك تشفير Base64 إلى نص عبر الإنترنت - أداة مجانية',
        description: 'أداة مجانية عبر الإنترنت لفك تشفير Base64 إلى نص عادي. بدون رفع، معالجة فورية، نسخ بنقرة واحدة، آمن وخاص.',
        keywords: 'فك تشفير base64,base64 إلى نص,فك ترميز base64,أداة فك تشفير',
        moreTools: 'المزيد من أدوات Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'ترميز الصورة Base64',
        title: 'تحويل الصورة إلى Base64 عبر الإنترنت - أداة مجانية',
        description: 'أداة مجانية عبر الإنترنت لتحويل الصور إلى سلاسل Base64. يدعم PNG وJPG وGIF وWebP. بدون رفع، آمن وخاص.',
        keywords: 'صورة إلى base64,تشفير صورة base64,تحويل صورة,أداة صورة base64',
        moreTools: 'المزيد من أدوات Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'فك ترميز الصورة Base64',
        title: 'فك تشفير Base64 إلى صورة عبر الإنترنت - أداة مجانية',
        description: 'أداة مجانية عبر الإنترنت لفك تشفير Base64 إلى صور مع معاينة وتنزيل. يدعم PNG وJPG وGIF وWebP. بدون رفع.',
        keywords: 'base64 إلى صورة,فك تشفير صورة base64,معاينة صورة base64,أداة صورة base64',
        moreTools: 'المزيد من أدوات Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'ترميز الملف Base64',
        title: 'تحويل الملف إلى Base64 عبر الإنترنت - أداة مجانية',
        description: 'أداة مجانية عبر الإنترنت لتحويل أي ملف إلى سلسلة Base64. يدعم السحب والإفلات. بدون رفع، آمن وخاص.',
        keywords: 'ملف إلى base64,تشفير ملف base64,تحويل ملف,أداة ملف base64',
        moreTools: 'المزيد من أدوات Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'فك ترميز الملف Base64',
        title: 'فك تشفير Base64 إلى ملف عبر الإنترنت - أداة مجانية',
        description: 'أداة مجانية عبر الإنترنت لفك تشفير Base64 إلى ملفات أصلية وتنزيلها. بدون رفع، معالجة فورية، آمن وخاص.',
        keywords: 'base64 إلى ملف,فك تشفير ملف base64,تنزيل ملف base64,أداة ملف base64',
        moreTools: 'المزيد من أدوات Base64',
      },
    },
  ],

  de: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Text Base64 kodieren',
        title: 'Online Text zu Base64 Encoder - Kostenfreies Base64 Tool',
        description: 'Kostenfreies Online-Tool zum Kodieren von Text in Base64. Kein Upload nötig, sofortige Verarbeitung, Ein-Klick-Kopieren, sicher und privat.',
        keywords: 'text zu base64,base64 encode,online base64 encoder,base64 kodierung,string zu base64',
        moreTools: 'Weitere Base64 Tools',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Text Base64 dekodieren',
        title: 'Online Base64 zu Text Decoder - Kostenfreies Base64 Tool',
        description: 'Kostenfreies Online-Tool zum Dekodieren von Base64 zurück in Klartext. Kein Upload nötig, sofortige Verarbeitung, Ein-Klick-Kopieren, sicher und privat.',
        keywords: 'base64 zu text,base64 decode,online base64 decoder,base64 dekodierung,base64 entschlüsseln',
        moreTools: 'Weitere Base64 Tools',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Bild Base64 kodieren',
        title: 'Online Bild zu Base64 Encoder - Kostenfreies Tool',
        description: 'Kostenfreies Online-Tool zum Konvertieren von Bildern in Base64. Unterstützt PNG, JPG, GIF, WebP. Kein Server-Upload, sofortige Ausgabe.',
        keywords: 'bild zu base64,base64 bild encode,online bild base64,bild in base64 konvertieren',
        moreTools: 'Weitere Base64 Tools',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Bild Base64 dekodieren',
        title: 'Online Base64 zu Bild Decoder - Kostenfreies Tool',
        description: 'Kostenfreies Online-Tool zum Dekodieren von Base64 zurück in Bilder mit Vorschau und Download. Unterstützt PNG, JPG, GIF, WebP.',
        keywords: 'base64 zu bild,base64 bild decode,base64 bild vorschau,base64 bild tool',
        moreTools: 'Weitere Base64 Tools',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Datei Base64 kodieren',
        title: 'Online Datei zu Base64 Encoder - Kostenfreies Tool',
        description: 'Kostenfreies Online-Tool zum Konvertieren beliebiger Dateien in Base64. Drag & Drop unterstützt, kein Server-Upload, sofortige Ausgabe.',
        keywords: 'datei zu base64,base64 datei encode,online datei base64,datei in base64 konvertieren',
        moreTools: 'Weitere Base64 Tools',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Datei Base64 dekodieren',
        title: 'Online Base64 zu Datei Decoder - Kostenfreies Tool',
        description: 'Kostenfreies Online-Tool zum Dekodieren von Base64 zurück in Originaldateien zum Download. Kein Server-Upload, sofortige Verarbeitung.',
        keywords: 'base64 zu datei,base64 datei decode,base64 datei download,base64 datei tool',
        moreTools: 'Weitere Base64 Tools',
      },
    },
  ],

  es: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Codificar Texto en Base64',
        title: 'Codificador de Texto a Base64 Online - Herramienta Gratuita',
        description: 'Herramienta gratuita online para codificar texto en Base64. Sin carga, procesamiento instantáneo, copiar con un clic, seguro y privado.',
        keywords: 'texto a base64,codificar base64,codificador base64 online,herramienta base64,cifrar base64',
        moreTools: 'Más herramientas Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Decodificar Texto Base64',
        title: 'Decodificador de Base64 a Texto Online - Herramienta Gratuita',
        description: 'Herramienta gratuita online para decodificar Base64 a texto plano. Sin carga, procesamiento instantáneo, copiar con un clic, seguro y privado.',
        keywords: 'base64 a texto,decodificar base64,decodificador base64 online,herramienta base64,descifrar base64',
        moreTools: 'Más herramientas Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Codificar Imagen en Base64',
        title: 'Convertir Imagen a Base64 Online - Herramienta Gratuita',
        description: 'Herramienta gratuita online para convertir imágenes a Base64. Compatible con PNG, JPG, GIF, WebP. Sin carga al servidor, seguro y privado.',
        keywords: 'imagen a base64,codificar imagen base64,convertir imagen base64,herramienta imagen base64',
        moreTools: 'Más herramientas Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Decodificar Imagen Base64',
        title: 'Convertir Base64 a Imagen Online - Herramienta Gratuita',
        description: 'Herramienta gratuita online para decodificar Base64 a imágenes con vista previa y descarga. Compatible con PNG, JPG, GIF, WebP.',
        keywords: 'base64 a imagen,decodificar imagen base64,vista previa imagen base64,herramienta imagen base64',
        moreTools: 'Más herramientas Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Codificar Archivo en Base64',
        title: 'Convertir Archivo a Base64 Online - Herramienta Gratuita',
        description: 'Herramienta gratuita online para convertir cualquier archivo a Base64. Compatible con arrastrar y soltar. Sin carga al servidor, seguro y privado.',
        keywords: 'archivo a base64,codificar archivo base64,convertir archivo base64,herramienta archivo base64',
        moreTools: 'Más herramientas Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Decodificar Archivo Base64',
        title: 'Convertir Base64 a Archivo Online - Herramienta Gratuita',
        description: 'Herramienta gratuita online para decodificar Base64 a archivos originales y descargarlos. Sin carga al servidor, procesamiento instantáneo.',
        keywords: 'base64 a archivo,decodificar archivo base64,descargar archivo base64,herramienta archivo base64',
        moreTools: 'Más herramientas Base64',
      },
    },
  ],

  fr: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Encoder du Texte en Base64',
        title: 'Encodeur Texte vers Base64 en Ligne - Outil Gratuit',
        description: 'Outil gratuit en ligne pour encoder du texte en Base64. Pas de téléchargement nécessaire, traitement instantané, copie en un clic, sécurisé et privé.',
        keywords: 'texte en base64,encoder base64,encodeur base64 en ligne,outil base64,convertir texte base64',
        moreTools: "Plus d'outils Base64",
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Décoder du Texte Base64',
        title: 'Décodeur Base64 vers Texte en Ligne - Outil Gratuit',
        description: 'Outil gratuit en ligne pour décoder Base64 en texte brut. Pas de téléchargement nécessaire, traitement instantané, copie en un clic, sécurisé et privé.',
        keywords: 'base64 en texte,décoder base64,décodeur base64 en ligne,outil base64,déchiffrer base64',
        moreTools: "Plus d'outils Base64",
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: "Encoder une Image en Base64",
        title: 'Convertir Image en Base64 en Ligne - Outil Gratuit',
        description: 'Outil gratuit en ligne pour convertir des images en Base64. Prend en charge PNG, JPG, GIF, WebP. Pas de téléchargement serveur, sécurisé et privé.',
        keywords: 'image en base64,encoder image base64,convertir image base64,outil image base64',
        moreTools: "Plus d'outils Base64",
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Décoder une Image Base64',
        title: 'Convertir Base64 en Image en Ligne - Outil Gratuit',
        description: 'Outil gratuit en ligne pour décoder Base64 en images avec aperçu et téléchargement. Prend en charge PNG, JPG, GIF, WebP.',
        keywords: 'base64 en image,décoder image base64,aperçu image base64,outil image base64',
        moreTools: "Plus d'outils Base64",
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Encoder un Fichier en Base64',
        title: 'Convertir Fichier en Base64 en Ligne - Outil Gratuit',
        description: 'Outil gratuit en ligne pour convertir tout fichier en Base64. Glisser-déposer supporté. Pas de téléchargement serveur, sécurisé et privé.',
        keywords: 'fichier en base64,encoder fichier base64,convertir fichier base64,outil fichier base64',
        moreTools: "Plus d'outils Base64",
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Décoder un Fichier Base64',
        title: 'Convertir Base64 en Fichier en Ligne - Outil Gratuit',
        description: 'Outil gratuit en ligne pour décoder Base64 en fichiers originaux et les télécharger. Pas de téléchargement serveur, traitement instantané.',
        keywords: 'base64 en fichier,décoder fichier base64,télécharger fichier base64,outil fichier base64',
        moreTools: "Plus d'outils Base64",
      },
    },
  ],

  hi: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'टेक्स्ट Base64 एन्कोड',
        title: 'ऑनलाइन टेक्स्ट से Base64 एन्कोडर - मुफ्त टूल',
        description: 'मुफ्त ऑनलाइन टूल टेक्स्ट को Base64 में एन्कोड करने के लिए। अपलोड की जरूरत नहीं, तत्काल प्रोसेसिंग, एक क्लिक में कॉपी, सुरक्षित और निजी।',
        keywords: 'टेक्स्ट से base64,base64 एन्कोड,ऑनलाइन base64 एन्कोडर,base64 टूल',
        moreTools: 'और Base64 टूल',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'टेक्स्ट Base64 डिकोड',
        title: 'ऑनलाइन Base64 से टेक्स्ट डिकोडर - मुफ्त टूल',
        description: 'मुफ्त ऑनलाइन टूल Base64 को टेक्स्ट में डिकोड करने के लिए। अपलोड की जरूरत नहीं, तत्काल प्रोसेसिंग, एक क्लिक में कॉपी, सुरक्षित और निजी।',
        keywords: 'base64 से टेक्स्ट,base64 डिकोड,ऑनलाइन base64 डिकोडर,base64 टूल',
        moreTools: 'और Base64 टूल',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'इमेज Base64 एन्कोड',
        title: 'ऑनलाइन इमेज से Base64 एन्कोडर - मुफ्त टूल',
        description: 'मुफ्त ऑनलाइन टूल इमेज को Base64 में बदलने के लिए। PNG, JPG, GIF, WebP सपोर्ट। सर्वर अपलोड नहीं, सुरक्षित और निजी।',
        keywords: 'इमेज से base64,इमेज base64 एन्कोड,ऑनलाइन इमेज base64,base64 इमेज टूल',
        moreTools: 'और Base64 टूल',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'इमेज Base64 डिकोड',
        title: 'ऑनलाइन Base64 से इमेज डिकोडर - मुफ्त टूल',
        description: 'मुफ्त ऑनलाइन टूल Base64 को इमेज में बदलने के लिए, प्रीव्यू और डाउनलोड के साथ। PNG, JPG, GIF, WebP सपोर्ट।',
        keywords: 'base64 से इमेज,इमेज base64 डिकोड,base64 इमेज प्रीव्यू,base64 इमेज टूल',
        moreTools: 'और Base64 टूल',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'फाइल Base64 एन्कोड',
        title: 'ऑनलाइन फाइल से Base64 एन्कोडर - मुफ्त टूल',
        description: 'मुफ्त ऑनलाइन टूल किसी भी फाइल को Base64 में बदलने के लिए। ड्रैग एंड ड्रॉप सपोर्ट। सर्वर अपलोड नहीं, सुरक्षित और निजी।',
        keywords: 'फाइल से base64,फाइल base64 एन्कोड,ऑनलाइन फाइल base64,base64 फाइल टूल',
        moreTools: 'और Base64 टूल',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'फाइल Base64 डिकोड',
        title: 'ऑनलाइन Base64 से फाइल डिकोडर - मुफ्त टूल',
        description: 'मुफ्त ऑनलाइन टूल Base64 को मूल फाइल में बदलकर डाउनलोड करने के लिए। सर्वर अपलोड नहीं, तत्काल प्रोसेसिंग।',
        keywords: 'base64 से फाइल,फाइल base64 डिकोड,base64 फाइल डाउनलोड,base64 फाइल टूल',
        moreTools: 'और Base64 टूल',
      },
    },
  ],

  id: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Encode Teks ke Base64',
        title: 'Encoder Teks ke Base64 Online - Alat Gratis',
        description: 'Alat gratis online untuk mengkodekan teks ke Base64. Tidak perlu upload, pemrosesan instan, salin satu klik, aman dan privat.',
        keywords: 'teks ke base64,encode base64,encoder base64 online,alat base64,konversi teks base64',
        moreTools: 'Alat Base64 Lainnya',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Decode Teks Base64',
        title: 'Decoder Base64 ke Teks Online - Alat Gratis',
        description: 'Alat gratis online untuk mendekode Base64 ke teks biasa. Tidak perlu upload, pemrosesan instan, salin satu klik, aman dan privat.',
        keywords: 'base64 ke teks,decode base64,decoder base64 online,alat base64,dekode base64',
        moreTools: 'Alat Base64 Lainnya',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Encode Gambar ke Base64',
        title: 'Konversi Gambar ke Base64 Online - Alat Gratis',
        description: 'Alat gratis online untuk mengkonversi gambar ke Base64. Mendukung PNG, JPG, GIF, WebP. Tidak ada upload server, aman dan privat.',
        keywords: 'gambar ke base64,encode gambar base64,konversi gambar base64,alat gambar base64',
        moreTools: 'Alat Base64 Lainnya',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Decode Gambar Base64',
        title: 'Konversi Base64 ke Gambar Online - Alat Gratis',
        description: 'Alat gratis online untuk mendekode Base64 ke gambar dengan pratinjau dan unduhan. Mendukung PNG, JPG, GIF, WebP.',
        keywords: 'base64 ke gambar,decode gambar base64,pratinjau gambar base64,alat gambar base64',
        moreTools: 'Alat Base64 Lainnya',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Encode File ke Base64',
        title: 'Konversi File ke Base64 Online - Alat Gratis',
        description: 'Alat gratis online untuk mengkonversi file apapun ke Base64. Mendukung drag and drop. Tidak ada upload server, aman dan privat.',
        keywords: 'file ke base64,encode file base64,konversi file base64,alat file base64',
        moreTools: 'Alat Base64 Lainnya',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Decode File Base64',
        title: 'Konversi Base64 ke File Online - Alat Gratis',
        description: 'Alat gratis online untuk mendekode Base64 ke file asli dan mengunduhnya. Tidak ada upload server, pemrosesan instan.',
        keywords: 'base64 ke file,decode file base64,unduh file base64,alat file base64',
        moreTools: 'Alat Base64 Lainnya',
      },
    },
  ],

  it: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Codifica Testo in Base64',
        title: 'Codificatore Testo in Base64 Online - Strumento Gratuito',
        description: 'Strumento gratuito online per codificare testo in Base64. Nessun caricamento necessario, elaborazione istantanea, copia con un clic, sicuro e privato.',
        keywords: 'testo in base64,codifica base64,codificatore base64 online,strumento base64,converti testo base64',
        moreTools: 'Altri strumenti Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Decodifica Testo Base64',
        title: 'Decodificatore Base64 in Testo Online - Strumento Gratuito',
        description: 'Strumento gratuito online per decodificare Base64 in testo normale. Nessun caricamento necessario, elaborazione istantanea, copia con un clic, sicuro e privato.',
        keywords: 'base64 in testo,decodifica base64,decodificatore base64 online,strumento base64,decifrare base64',
        moreTools: 'Altri strumenti Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: "Codifica Immagine in Base64",
        title: "Converti Immagine in Base64 Online - Strumento Gratuito",
        description: 'Strumento gratuito online per convertire immagini in Base64. Supporta PNG, JPG, GIF, WebP. Nessun upload al server, sicuro e privato.',
        keywords: 'immagine in base64,codifica immagine base64,converti immagine base64,strumento immagine base64',
        moreTools: 'Altri strumenti Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Decodifica Immagine Base64',
        title: 'Converti Base64 in Immagine Online - Strumento Gratuito',
        description: 'Strumento gratuito online per decodificare Base64 in immagini con anteprima e download. Supporta PNG, JPG, GIF, WebP.',
        keywords: 'base64 in immagine,decodifica immagine base64,anteprima immagine base64,strumento immagine base64',
        moreTools: 'Altri strumenti Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Codifica File in Base64',
        title: 'Converti File in Base64 Online - Strumento Gratuito',
        description: 'Strumento gratuito online per convertire qualsiasi file in Base64. Supporta drag and drop. Nessun upload al server, sicuro e privato.',
        keywords: 'file in base64,codifica file base64,converti file base64,strumento file base64',
        moreTools: 'Altri strumenti Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Decodifica File Base64',
        title: 'Converti Base64 in File Online - Strumento Gratuito',
        description: 'Strumento gratuito online per decodificare Base64 in file originali e scaricarli. Nessun upload al server, elaborazione istantanea.',
        keywords: 'base64 in file,decodifica file base64,scarica file base64,strumento file base64',
        moreTools: 'Altri strumenti Base64',
      },
    },
  ],

  ja: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'テキスト Base64 エンコード',
        title: 'オンライン テキスト Base64 エンコーダー - 無料ツール',
        description: '無料オンラインツールでテキストを Base64 にエンコードします。アップロード不要、即時処理、ワンクリックコピー、安全でプライベート。',
        keywords: 'テキスト base64,base64 エンコード,オンライン base64 エンコーダー,base64 ツール,文字列 base64',
        moreTools: 'その他の Base64 ツール',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'テキスト Base64 デコード',
        title: 'オンライン Base64 テキスト デコーダー - 無料ツール',
        description: '無料オンラインツールで Base64 をテキストにデコードします。アップロード不要、即時処理、ワンクリックコピー、安全でプライベート。',
        keywords: 'base64 テキスト,base64 デコード,オンライン base64 デコーダー,base64 ツール,base64 解読',
        moreTools: 'その他の Base64 ツール',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: '画像 Base64 エンコード',
        title: 'オンライン 画像 Base64 エンコーダー - 無料ツール',
        description: '無料オンラインツールで画像を Base64 に変換します。PNG、JPG、GIF、WebP 対応。サーバーアップロード不要、安全でプライベート。',
        keywords: '画像 base64,画像 base64 エンコード,オンライン画像 base64,base64 画像ツール',
        moreTools: 'その他の Base64 ツール',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: '画像 Base64 デコード',
        title: 'オンライン Base64 画像 デコーダー - 無料ツール',
        description: '無料オンラインツールで Base64 を画像にデコードし、プレビューとダウンロードができます。PNG、JPG、GIF、WebP 対応。',
        keywords: 'base64 画像,画像 base64 デコード,base64 画像プレビュー,base64 画像ツール',
        moreTools: 'その他の Base64 ツール',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'ファイル Base64 エンコード',
        title: 'オンライン ファイル Base64 エンコーダー - 無料ツール',
        description: '無料オンラインツールで任意のファイルを Base64 に変換します。ドラッグ＆ドロップ対応。サーバーアップロード不要、安全でプライベート。',
        keywords: 'ファイル base64,ファイル base64 エンコード,オンラインファイル base64,base64 ファイルツール',
        moreTools: 'その他の Base64 ツール',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'ファイル Base64 デコード',
        title: 'オンライン Base64 ファイル デコーダー - 無料ツール',
        description: '無料オンラインツールで Base64 を元のファイルにデコードしてダウンロードします。サーバーアップロード不要、即時処理。',
        keywords: 'base64 ファイル,ファイル base64 デコード,base64 ファイルダウンロード,base64 ファイルツール',
        moreTools: 'その他の Base64 ツール',
      },
    },
  ],

  ko: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: '텍스트 Base64 인코딩',
        title: '온라인 텍스트 Base64 인코더 - 무료 도구',
        description: '무료 온라인 도구로 텍스트를 Base64로 인코딩합니다. 업로드 불필요, 즉시 처리, 원클릭 복사, 안전하고 프라이빗.',
        keywords: '텍스트 base64,base64 인코딩,온라인 base64 인코더,base64 도구,문자열 base64',
        moreTools: '더 많은 Base64 도구',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: '텍스트 Base64 디코딩',
        title: '온라인 Base64 텍스트 디코더 - 무료 도구',
        description: '무료 온라인 도구로 Base64를 텍스트로 디코딩합니다. 업로드 불필요, 즉시 처리, 원클릭 복사, 안전하고 프라이빗.',
        keywords: 'base64 텍스트,base64 디코딩,온라인 base64 디코더,base64 도구,base64 해독',
        moreTools: '더 많은 Base64 도구',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: '이미지 Base64 인코딩',
        title: '온라인 이미지 Base64 인코더 - 무료 도구',
        description: '무료 온라인 도구로 이미지를 Base64로 변환합니다. PNG, JPG, GIF, WebP 지원. 서버 업로드 없이, 안전하고 프라이빗.',
        keywords: '이미지 base64,이미지 base64 인코딩,온라인 이미지 base64,base64 이미지 도구',
        moreTools: '더 많은 Base64 도구',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: '이미지 Base64 디코딩',
        title: '온라인 Base64 이미지 디코더 - 무료 도구',
        description: '무료 온라인 도구로 Base64를 이미지로 디코딩하여 미리보기 및 다운로드합니다. PNG, JPG, GIF, WebP 지원.',
        keywords: 'base64 이미지,이미지 base64 디코딩,base64 이미지 미리보기,base64 이미지 도구',
        moreTools: '더 많은 Base64 도구',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: '파일 Base64 인코딩',
        title: '온라인 파일 Base64 인코더 - 무료 도구',
        description: '무료 온라인 도구로 모든 파일을 Base64로 변환합니다. 드래그 앤 드롭 지원. 서버 업로드 없이, 안전하고 프라이빗.',
        keywords: '파일 base64,파일 base64 인코딩,온라인 파일 base64,base64 파일 도구',
        moreTools: '더 많은 Base64 도구',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: '파일 Base64 디코딩',
        title: '온라인 Base64 파일 디코더 - 무료 도구',
        description: '무료 온라인 도구로 Base64를 원본 파일로 디코딩하여 다운로드합니다. 서버 업로드 없이, 즉시 처리.',
        keywords: 'base64 파일,파일 base64 디코딩,base64 파일 다운로드,base64 파일 도구',
        moreTools: '더 많은 Base64 도구',
      },
    },
  ],

  nl: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Tekst Base64 Coderen',
        title: 'Online Tekst naar Base64 Encoder - Gratis Tool',
        description: 'Gratis online tool om tekst te coderen naar Base64. Geen upload nodig, onmiddellijke verwerking, één klik kopiëren, veilig en privé.',
        keywords: 'tekst naar base64,base64 coderen,online base64 encoder,base64 tool,tekst base64',
        moreTools: 'Meer Base64 Tools',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Tekst Base64 Decoderen',
        title: 'Online Base64 naar Tekst Decoder - Gratis Tool',
        description: 'Gratis online tool om Base64 te decoderen naar platte tekst. Geen upload nodig, onmiddellijke verwerking, één klik kopiëren, veilig en privé.',
        keywords: 'base64 naar tekst,base64 decoderen,online base64 decoder,base64 tool,base64 ontcijferen',
        moreTools: 'Meer Base64 Tools',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Afbeelding Base64 Coderen',
        title: 'Online Afbeelding naar Base64 Encoder - Gratis Tool',
        description: 'Gratis online tool om afbeeldingen te converteren naar Base64. Ondersteunt PNG, JPG, GIF, WebP. Geen server upload, veilig en privé.',
        keywords: 'afbeelding naar base64,afbeelding base64 coderen,online afbeelding base64,base64 afbeelding tool',
        moreTools: 'Meer Base64 Tools',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Afbeelding Base64 Decoderen',
        title: 'Online Base64 naar Afbeelding Decoder - Gratis Tool',
        description: 'Gratis online tool om Base64 te decoderen naar afbeeldingen met voorbeeld en download. Ondersteunt PNG, JPG, GIF, WebP.',
        keywords: 'base64 naar afbeelding,afbeelding base64 decoderen,base64 afbeelding voorbeeld,base64 afbeelding tool',
        moreTools: 'Meer Base64 Tools',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Bestand Base64 Coderen',
        title: 'Online Bestand naar Base64 Encoder - Gratis Tool',
        description: 'Gratis online tool om elk bestand te converteren naar Base64. Ondersteunt slepen en neerzetten. Geen server upload, veilig en privé.',
        keywords: 'bestand naar base64,bestand base64 coderen,online bestand base64,base64 bestand tool',
        moreTools: 'Meer Base64 Tools',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Bestand Base64 Decoderen',
        title: 'Online Base64 naar Bestand Decoder - Gratis Tool',
        description: 'Gratis online tool om Base64 te decoderen naar originele bestanden en te downloaden. Geen server upload, onmiddellijke verwerking.',
        keywords: 'base64 naar bestand,bestand base64 decoderen,base64 bestand downloaden,base64 bestand tool',
        moreTools: 'Meer Base64 Tools',
      },
    },
  ],

  pl: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Kodowanie Tekstu Base64',
        title: 'Online Koder Tekstu do Base64 - Darmowe Narzędzie',
        description: 'Darmowe narzędzie online do kodowania tekstu w Base64. Bez przesyłania, natychmiastowe przetwarzanie, kopiowanie jednym kliknięciem, bezpieczne i prywatne.',
        keywords: 'tekst do base64,kodowanie base64,koder base64 online,narzędzie base64,konwersja tekstu base64',
        moreTools: 'Więcej narzędzi Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Dekodowanie Tekstu Base64',
        title: 'Online Dekoder Base64 do Tekstu - Darmowe Narzędzie',
        description: 'Darmowe narzędzie online do dekodowania Base64 do zwykłego tekstu. Bez przesyłania, natychmiastowe przetwarzanie, kopiowanie jednym kliknięciem.',
        keywords: 'base64 do tekstu,dekodowanie base64,dekoder base64 online,narzędzie base64,odszyfruj base64',
        moreTools: 'Więcej narzędzi Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Kodowanie Obrazu Base64',
        title: 'Online Koder Obrazu do Base64 - Darmowe Narzędzie',
        description: 'Darmowe narzędzie online do konwersji obrazów do Base64. Obsługuje PNG, JPG, GIF, WebP. Bez przesyłania na serwer, bezpieczne i prywatne.',
        keywords: 'obraz do base64,kodowanie obrazu base64,konwersja obrazu base64,narzędzie obraz base64',
        moreTools: 'Więcej narzędzi Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Dekodowanie Obrazu Base64',
        title: 'Online Dekoder Base64 do Obrazu - Darmowe Narzędzie',
        description: 'Darmowe narzędzie online do dekodowania Base64 do obrazów z podglądem i pobieraniem. Obsługuje PNG, JPG, GIF, WebP.',
        keywords: 'base64 do obrazu,dekodowanie obrazu base64,podgląd obrazu base64,narzędzie obraz base64',
        moreTools: 'Więcej narzędzi Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Kodowanie Pliku Base64',
        title: 'Online Koder Pliku do Base64 - Darmowe Narzędzie',
        description: 'Darmowe narzędzie online do konwersji dowolnego pliku do Base64. Obsługuje przeciągnij i upuść. Bez przesyłania na serwer, bezpieczne i prywatne.',
        keywords: 'plik do base64,kodowanie pliku base64,konwersja pliku base64,narzędzie plik base64',
        moreTools: 'Więcej narzędzi Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Dekodowanie Pliku Base64',
        title: 'Online Dekoder Base64 do Pliku - Darmowe Narzędzie',
        description: 'Darmowe narzędzie online do dekodowania Base64 do oryginalnych plików i pobierania. Bez przesyłania na serwer, natychmiastowe przetwarzanie.',
        keywords: 'base64 do pliku,dekodowanie pliku base64,pobieranie pliku base64,narzędzie plik base64',
        moreTools: 'Więcej narzędzi Base64',
      },
    },
  ],

  pt: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Codificar Texto em Base64',
        title: 'Codificador de Texto para Base64 Online - Ferramenta Gratuita',
        description: 'Ferramenta gratuita online para codificar texto em Base64. Sem upload necessário, processamento instantâneo, copiar com um clique, seguro e privado.',
        keywords: 'texto para base64,codificar base64,codificador base64 online,ferramenta base64,converter texto base64',
        moreTools: 'Mais ferramentas Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Decodificar Texto Base64',
        title: 'Decodificador de Base64 para Texto Online - Ferramenta Gratuita',
        description: 'Ferramenta gratuita online para decodificar Base64 em texto simples. Sem upload necessário, processamento instantâneo, copiar com um clique.',
        keywords: 'base64 para texto,decodificar base64,decodificador base64 online,ferramenta base64,decifrar base64',
        moreTools: 'Mais ferramentas Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Codificar Imagem em Base64',
        title: 'Converter Imagem para Base64 Online - Ferramenta Gratuita',
        description: 'Ferramenta gratuita online para converter imagens em Base64. Suporta PNG, JPG, GIF, WebP. Sem upload para servidor, seguro e privado.',
        keywords: 'imagem para base64,codificar imagem base64,converter imagem base64,ferramenta imagem base64',
        moreTools: 'Mais ferramentas Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Decodificar Imagem Base64',
        title: 'Converter Base64 para Imagem Online - Ferramenta Gratuita',
        description: 'Ferramenta gratuita online para decodificar Base64 em imagens com visualização e download. Suporta PNG, JPG, GIF, WebP.',
        keywords: 'base64 para imagem,decodificar imagem base64,visualizar imagem base64,ferramenta imagem base64',
        moreTools: 'Mais ferramentas Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Codificar Arquivo em Base64',
        title: 'Converter Arquivo para Base64 Online - Ferramenta Gratuita',
        description: 'Ferramenta gratuita online para converter qualquer arquivo em Base64. Suporta arrastar e soltar. Sem upload para servidor, seguro e privado.',
        keywords: 'arquivo para base64,codificar arquivo base64,converter arquivo base64,ferramenta arquivo base64',
        moreTools: 'Mais ferramentas Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Decodificar Arquivo Base64',
        title: 'Converter Base64 para Arquivo Online - Ferramenta Gratuita',
        description: 'Ferramenta gratuita online para decodificar Base64 em arquivos originais e baixar. Sem upload para servidor, processamento instantâneo.',
        keywords: 'base64 para arquivo,decodificar arquivo base64,baixar arquivo base64,ferramenta arquivo base64',
        moreTools: 'Mais ferramentas Base64',
      },
    },
  ],

  ru: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Кодирование текста в Base64',
        title: 'Онлайн кодировщик текста в Base64 - Бесплатный инструмент',
        description: 'Бесплатный онлайн инструмент для кодирования текста в Base64. Без загрузки, мгновенная обработка, копирование одним кликом, безопасно и конфиденциально.',
        keywords: 'текст в base64,кодирование base64,онлайн кодировщик base64,инструмент base64,конвертер текста base64',
        moreTools: 'Другие инструменты Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Декодирование текста Base64',
        title: 'Онлайн декодировщик Base64 в текст - Бесплатный инструмент',
        description: 'Бесплатный онлайн инструмент для декодирования Base64 в обычный текст. Без загрузки, мгновенная обработка, копирование одним кликом.',
        keywords: 'base64 в текст,декодирование base64,онлайн декодировщик base64,инструмент base64,расшифровка base64',
        moreTools: 'Другие инструменты Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Кодирование изображения в Base64',
        title: 'Онлайн конвертер изображений в Base64 - Бесплатный инструмент',
        description: 'Бесплатный онлайн инструмент для конвертации изображений в Base64. Поддерживает PNG, JPG, GIF, WebP. Без загрузки на сервер, безопасно и конфиденциально.',
        keywords: 'изображение в base64,кодирование изображения base64,конвертер изображения base64,инструмент изображения base64',
        moreTools: 'Другие инструменты Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Декодирование изображения Base64',
        title: 'Онлайн декодировщик Base64 в изображение - Бесплатный инструмент',
        description: 'Бесплатный онлайн инструмент для декодирования Base64 в изображения с предпросмотром и скачиванием. Поддерживает PNG, JPG, GIF, WebP.',
        keywords: 'base64 в изображение,декодирование изображения base64,предпросмотр изображения base64,инструмент изображения base64',
        moreTools: 'Другие инструменты Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Кодирование файла в Base64',
        title: 'Онлайн конвертер файлов в Base64 - Бесплатный инструмент',
        description: 'Бесплатный онлайн инструмент для конвертации любых файлов в Base64. Поддерживает перетаскивание. Без загрузки на сервер, безопасно и конфиденциально.',
        keywords: 'файл в base64,кодирование файла base64,конвертер файла base64,инструмент файла base64',
        moreTools: 'Другие инструменты Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Декодирование файла Base64',
        title: 'Онлайн декодировщик Base64 в файл - Бесплатный инструмент',
        description: 'Бесплатный онлайн инструмент для декодирования Base64 в исходные файлы и их скачивания. Без загрузки на сервер, мгновенная обработка.',
        keywords: 'base64 в файл,декодирование файла base64,скачать файл base64,инструмент файла base64',
        moreTools: 'Другие инструменты Base64',
      },
    },
  ],

  sv: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Koda Text till Base64',
        title: 'Online Text till Base64 Kodare - Gratis Verktyg',
        description: 'Gratis onlineverktyg för att koda text till Base64. Ingen uppladdning behövs, omedelbar bearbetning, ett-klicks kopiering, säkert och privat.',
        keywords: 'text till base64,koda base64,online base64 kodare,base64 verktyg,konvertera text base64',
        moreTools: 'Fler Base64 Verktyg',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Avkoda Text Base64',
        title: 'Online Base64 till Text Avkodare - Gratis Verktyg',
        description: 'Gratis onlineverktyg för att avkoda Base64 till vanlig text. Ingen uppladdning behövs, omedelbar bearbetning, ett-klicks kopiering.',
        keywords: 'base64 till text,avkoda base64,online base64 avkodare,base64 verktyg,dechiffrera base64',
        moreTools: 'Fler Base64 Verktyg',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Koda Bild till Base64',
        title: 'Online Bild till Base64 Kodare - Gratis Verktyg',
        description: 'Gratis onlineverktyg för att konvertera bilder till Base64. Stöder PNG, JPG, GIF, WebP. Ingen serveruppladdning, säkert och privat.',
        keywords: 'bild till base64,bild base64 koda,online bild base64,base64 bild verktyg',
        moreTools: 'Fler Base64 Verktyg',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Avkoda Bild Base64',
        title: 'Online Base64 till Bild Avkodare - Gratis Verktyg',
        description: 'Gratis onlineverktyg för att avkoda Base64 till bilder med förhandsgranskning och nedladdning. Stöder PNG, JPG, GIF, WebP.',
        keywords: 'base64 till bild,bild base64 avkoda,base64 bild förhandsvisning,base64 bild verktyg',
        moreTools: 'Fler Base64 Verktyg',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Koda Fil till Base64',
        title: 'Online Fil till Base64 Kodare - Gratis Verktyg',
        description: 'Gratis onlineverktyg för att konvertera valfri fil till Base64. Stöder dra och släpp. Ingen serveruppladdning, säkert och privat.',
        keywords: 'fil till base64,fil base64 koda,online fil base64,base64 fil verktyg',
        moreTools: 'Fler Base64 Verktyg',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Avkoda Fil Base64',
        title: 'Online Base64 till Fil Avkodare - Gratis Verktyg',
        description: 'Gratis onlineverktyg för att avkoda Base64 till originalfiler och ladda ner dem. Ingen serveruppladdning, omedelbar bearbetning.',
        keywords: 'base64 till fil,fil base64 avkoda,base64 fil nedladdning,base64 fil verktyg',
        moreTools: 'Fler Base64 Verktyg',
      },
    },
  ],

  th: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'เข้ารหัสข้อความ Base64',
        title: 'เข้ารหัสข้อความเป็น Base64 ออนไลน์ - เครื่องมือฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับเข้ารหัสข้อความเป็น Base64 ไม่ต้องอัปโหลด ประมวลผลทันที คัดลอกด้วยคลิกเดียว ปลอดภัยและเป็นส่วนตัว',
        keywords: 'ข้อความเป็น base64,เข้ารหัส base64,เครื่องมือ base64 ออนไลน์,แปลงข้อความ base64',
        moreTools: 'เครื่องมือ Base64 เพิ่มเติม',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'ถอดรหัสข้อความ Base64',
        title: 'ถอดรหัส Base64 เป็นข้อความ ออนไลน์ - เครื่องมือฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับถอดรหัส Base64 เป็นข้อความธรรมดา ไม่ต้องอัปโหลด ประมวลผลทันที คัดลอกด้วยคลิกเดียว',
        keywords: 'base64 เป็นข้อความ,ถอดรหัส base64,เครื่องมือ base64 ออนไลน์,ถอดรหัส base64',
        moreTools: 'เครื่องมือ Base64 เพิ่มเติม',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'เข้ารหัสรูปภาพ Base64',
        title: 'แปลงรูปภาพเป็น Base64 ออนไลน์ - เครื่องมือฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับแปลงรูปภาพเป็น Base64 รองรับ PNG, JPG, GIF, WebP ไม่ต้องอัปโหลดเซิร์ฟเวอร์ ปลอดภัยและเป็นส่วนตัว',
        keywords: 'รูปภาพเป็น base64,เข้ารหัสรูปภาพ base64,แปลงรูปภาพ base64,เครื่องมือรูปภาพ base64',
        moreTools: 'เครื่องมือ Base64 เพิ่มเติม',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'ถอดรหัสรูปภาพ Base64',
        title: 'แปลง Base64 เป็นรูปภาพ ออนไลน์ - เครื่องมือฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับถอดรหัส Base64 เป็นรูปภาพพร้อมดูตัวอย่างและดาวน์โหลด รองรับ PNG, JPG, GIF, WebP',
        keywords: 'base64 เป็นรูปภาพ,ถอดรหัสรูปภาพ base64,ดูตัวอย่างรูปภาพ base64,เครื่องมือรูปภาพ base64',
        moreTools: 'เครื่องมือ Base64 เพิ่มเติม',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'เข้ารหัสไฟล์ Base64',
        title: 'แปลงไฟล์เป็น Base64 ออนไลน์ - เครื่องมือฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับแปลงไฟล์ใดก็ได้เป็น Base64 รองรับการลากและวาง ไม่ต้องอัปโหลดเซิร์ฟเวอร์ ปลอดภัยและเป็นส่วนตัว',
        keywords: 'ไฟล์เป็น base64,เข้ารหัสไฟล์ base64,แปลงไฟล์ base64,เครื่องมือไฟล์ base64',
        moreTools: 'เครื่องมือ Base64 เพิ่มเติม',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'ถอดรหัสไฟล์ Base64',
        title: 'แปลง Base64 เป็นไฟล์ ออนไลน์ - เครื่องมือฟรี',
        description: 'เครื่องมือฟรีออนไลน์สำหรับถอดรหัส Base64 เป็นไฟล์ต้นฉบับและดาวน์โหลด ไม่ต้องอัปโหลดเซิร์ฟเวอร์ ประมวลผลทันที',
        keywords: 'base64 เป็นไฟล์,ถอดรหัสไฟล์ base64,ดาวน์โหลดไฟล์ base64,เครื่องมือไฟล์ base64',
        moreTools: 'เครื่องมือ Base64 เพิ่มเติม',
      },
    },
  ],

  tr: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Metin Base64 Kodlama',
        title: 'Online Metin Base64 Kodlayıcı - Ücretsiz Araç',
        description: 'Metni Base64 olarak kodlamak için ücretsiz online araç. Yükleme gerekmez, anında işlem, tek tıkla kopyalama, güvenli ve gizli.',
        keywords: 'metin base64,base64 kodlama,online base64 kodlayıcı,base64 aracı,metin base64 dönüştür',
        moreTools: 'Daha Fazla Base64 Aracı',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Metin Base64 Çözme',
        title: 'Online Base64 Metin Çözücü - Ücretsiz Araç',
        description: 'Base64\'ü düz metne çözmek için ücretsiz online araç. Yükleme gerekmez, anında işlem, tek tıkla kopyalama.',
        keywords: 'base64 metin,base64 çözme,online base64 çözücü,base64 aracı,base64 deşifre',
        moreTools: 'Daha Fazla Base64 Aracı',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Görüntü Base64 Kodlama',
        title: 'Online Görüntü Base64 Kodlayıcı - Ücretsiz Araç',
        description: 'Görüntüleri Base64\'e dönüştürmek için ücretsiz online araç. PNG, JPG, GIF, WebP destekler. Sunucu yüklemesi yok, güvenli ve gizli.',
        keywords: 'görüntü base64,görüntü base64 kodla,online görüntü base64,base64 görüntü aracı',
        moreTools: 'Daha Fazla Base64 Aracı',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Görüntü Base64 Çözme',
        title: 'Online Base64 Görüntü Çözücü - Ücretsiz Araç',
        description: 'Base64\'ü önizleme ve indirme ile görüntülere çözmek için ücretsiz online araç. PNG, JPG, GIF, WebP destekler.',
        keywords: 'base64 görüntü,görüntü base64 çöz,base64 görüntü önizleme,base64 görüntü aracı',
        moreTools: 'Daha Fazla Base64 Aracı',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Dosya Base64 Kodlama',
        title: 'Online Dosya Base64 Kodlayıcı - Ücretsiz Araç',
        description: 'Herhangi bir dosyayı Base64\'e dönüştürmek için ücretsiz online araç. Sürükle ve bırak destekler. Sunucu yüklemesi yok, güvenli ve gizli.',
        keywords: 'dosya base64,dosya base64 kodla,online dosya base64,base64 dosya aracı',
        moreTools: 'Daha Fazla Base64 Aracı',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Dosya Base64 Çözme',
        title: 'Online Base64 Dosya Çözücü - Ücretsiz Araç',
        description: 'Base64\'ü orijinal dosyalara çözüp indirmek için ücretsiz online araç. Sunucu yüklemesi yok, anında işlem.',
        keywords: 'base64 dosya,dosya base64 çöz,base64 dosya indir,base64 dosya aracı',
        moreTools: 'Daha Fazla Base64 Aracı',
      },
    },
  ],

  vi: [
    {
      params: {
        type: 'text',
        operation: 'encode',
        h1: 'Mã hóa Văn bản Base64',
        title: 'Bộ mã hóa Văn bản sang Base64 Trực tuyến - Công cụ Miễn phí',
        description: 'Công cụ miễn phí trực tuyến để mã hóa văn bản sang Base64. Không cần tải lên, xử lý tức thì, sao chép một cú nhấp, an toàn và riêng tư.',
        keywords: 'văn bản sang base64,mã hóa base64,bộ mã hóa base64 trực tuyến,công cụ base64,chuyển đổi văn bản base64',
        moreTools: 'Thêm Công cụ Base64',
      },
    },
    {
      params: {
        type: 'text',
        operation: 'decode',
        h1: 'Giải mã Văn bản Base64',
        title: 'Bộ giải mã Base64 sang Văn bản Trực tuyến - Công cụ Miễn phí',
        description: 'Công cụ miễn phí trực tuyến để giải mã Base64 sang văn bản thuần. Không cần tải lên, xử lý tức thì, sao chép một cú nhấp.',
        keywords: 'base64 sang văn bản,giải mã base64,bộ giải mã base64 trực tuyến,công cụ base64,giải mã base64',
        moreTools: 'Thêm Công cụ Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'encode',
        h1: 'Mã hóa Hình ảnh Base64',
        title: 'Chuyển đổi Hình ảnh sang Base64 Trực tuyến - Công cụ Miễn phí',
        description: 'Công cụ miễn phí trực tuyến để chuyển đổi hình ảnh sang Base64. Hỗ trợ PNG, JPG, GIF, WebP. Không tải lên máy chủ, an toàn và riêng tư.',
        keywords: 'hình ảnh sang base64,mã hóa hình ảnh base64,chuyển đổi hình ảnh base64,công cụ hình ảnh base64',
        moreTools: 'Thêm Công cụ Base64',
      },
    },
    {
      params: {
        type: 'image',
        operation: 'decode',
        h1: 'Giải mã Hình ảnh Base64',
        title: 'Chuyển đổi Base64 sang Hình ảnh Trực tuyến - Công cụ Miễn phí',
        description: 'Công cụ miễn phí trực tuyến để giải mã Base64 sang hình ảnh với xem trước và tải xuống. Hỗ trợ PNG, JPG, GIF, WebP.',
        keywords: 'base64 sang hình ảnh,giải mã hình ảnh base64,xem trước hình ảnh base64,công cụ hình ảnh base64',
        moreTools: 'Thêm Công cụ Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'encode',
        h1: 'Mã hóa Tệp Base64',
        title: 'Chuyển đổi Tệp sang Base64 Trực tuyến - Công cụ Miễn phí',
        description: 'Công cụ miễn phí trực tuyến để chuyển đổi bất kỳ tệp nào sang Base64. Hỗ trợ kéo và thả. Không tải lên máy chủ, an toàn và riêng tư.',
        keywords: 'tệp sang base64,mã hóa tệp base64,chuyển đổi tệp base64,công cụ tệp base64',
        moreTools: 'Thêm Công cụ Base64',
      },
    },
    {
      params: {
        type: 'file',
        operation: 'decode',
        h1: 'Giải mã Tệp Base64',
        title: 'Chuyển đổi Base64 sang Tệp Trực tuyến - Công cụ Miễn phí',
        description: 'Công cụ miễn phí trực tuyến để giải mã Base64 sang tệp gốc và tải xuống. Không tải lên máy chủ, xử lý tức thì.',
        keywords: 'base64 sang tệp,giải mã tệp base64,tải xuống tệp base64,công cụ tệp base64',
        moreTools: 'Thêm Công cụ Base64',
      },
    },
  ],
}

export function getBase64Paths(lang: LangCode): { paths: () => ParamsItem[] } {
  return {
    paths: () => allLangParams[lang],
  }
}

export default getBase64Paths('zh')
