export interface Base64CardItem {
  title: string
  desc: string
  href: string
  from: string
  to: string
}

export interface Base64CardGroup {
  title: string
  children: Base64CardItem[]
}

type LangCode =
  | 'zh' | 'en' | 'ar' | 'de' | 'es' | 'fr' | 'hi' | 'id'
  | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sv'
  | 'th' | 'tr' | 'vi' | 'zh-TW'

const allLangCards: Record<LangCode, Base64CardGroup[]> = {
  zh: [
    {
      title: '文本',
      children: [
        {
          title: '文字 Base64 编码',
          desc: '在线将文字/文本转换为 Base64 字符串，即时处理，一键复制',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: '文字',
          to: 'Base64',
        },
        {
          title: '文字 Base64 解码',
          desc: '在线将 Base64 字符串解码还原为原始文字，即时处理，一键复制',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: '文字',
        },
      ],
    },
    {
      title: '图片',
      children: [
        {
          title: '图片 Base64 编码',
          desc: '在线将图片转换为 Base64 字符串，支持 PNG、JPG、GIF、WebP 等格式',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: '图片',
          to: 'Base64',
        },
        {
          title: '图片 Base64 解码',
          desc: '在线将 Base64 字符串解码还原为图片并预览/下载',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: '图片',
        },
      ],
    },
    {
      title: '文件',
      children: [
        {
          title: '文件 Base64 编码',
          desc: '在线将任意文件转换为 Base64 字符串，支持拖拽上传',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: '文件',
          to: 'Base64',
        },
        {
          title: '文件 Base64 解码',
          desc: '在线将 Base64 字符串解码还原为原始文件并下载',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: '文件',
        },
      ],
    },
  ],

  'zh-TW': [
    {
      title: '文字',
      children: [
        {
          title: '文字 Base64 編碼',
          desc: '線上將文字/文本轉換為 Base64 字串，即時處理，一鍵複製',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: '文字',
          to: 'Base64',
        },
        {
          title: '文字 Base64 解碼',
          desc: '線上將 Base64 字串解碼還原為原始文字，即時處理，一鍵複製',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: '文字',
        },
      ],
    },
    {
      title: '圖片',
      children: [
        {
          title: '圖片 Base64 編碼',
          desc: '線上將圖片轉換為 Base64 字串，支援 PNG、JPG、GIF、WebP 等格式',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: '圖片',
          to: 'Base64',
        },
        {
          title: '圖片 Base64 解碼',
          desc: '線上將 Base64 字串解碼還原為圖片並預覽/下載',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: '圖片',
        },
      ],
    },
    {
      title: '檔案',
      children: [
        {
          title: '檔案 Base64 編碼',
          desc: '線上將任意檔案轉換為 Base64 字串，支援拖曳上傳',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: '檔案',
          to: 'Base64',
        },
        {
          title: '檔案 Base64 解碼',
          desc: '線上將 Base64 字串解碼還原為原始檔案並下載',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: '檔案',
        },
      ],
    },
  ],

  en: [
    {
      title: 'Text',
      children: [
        {
          title: 'Text Base64 Encode',
          desc: 'Online convert text to Base64 string, instant processing, one-click copy',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Text',
          to: 'Base64',
        },
        {
          title: 'Text Base64 Decode',
          desc: 'Online decode Base64 string back to original text, instant processing, one-click copy',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Text',
        },
      ],
    },
    {
      title: 'Image',
      children: [
        {
          title: 'Image Base64 Encode',
          desc: 'Online convert image to Base64 string, supports PNG, JPG, GIF, WebP formats',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Image',
          to: 'Base64',
        },
        {
          title: 'Image Base64 Decode',
          desc: 'Online decode Base64 string back to image with preview and download',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Image',
        },
      ],
    },
    {
      title: 'File',
      children: [
        {
          title: 'File Base64 Encode',
          desc: 'Online convert any file to Base64 string, supports drag and drop upload',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'File',
          to: 'Base64',
        },
        {
          title: 'File Base64 Decode',
          desc: 'Online decode Base64 string back to original file and download',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'File',
        },
      ],
    },
  ],

  ar: [
    {
      title: 'نص',
      children: [
        {
          title: 'ترميز النص Base64',
          desc: 'تحويل النص إلى سلسلة Base64 عبر الإنترنت، معالجة فورية، نسخ بنقرة',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'نص',
          to: 'Base64',
        },
        {
          title: 'فك ترميز النص Base64',
          desc: 'فك تشفير سلسلة Base64 إلى نص أصلي عبر الإنترنت، معالجة فورية، نسخ بنقرة',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'نص',
        },
      ],
    },
    {
      title: 'صورة',
      children: [
        {
          title: 'ترميز الصورة Base64',
          desc: 'تحويل الصورة إلى سلسلة Base64، يدعم PNG وJPG وGIF وWebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'صورة',
          to: 'Base64',
        },
        {
          title: 'فك ترميز الصورة Base64',
          desc: 'فك تشفير سلسلة Base64 إلى صورة مع معاينة وتنزيل',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'صورة',
        },
      ],
    },
    {
      title: 'ملف',
      children: [
        {
          title: 'ترميز الملف Base64',
          desc: 'تحويل أي ملف إلى سلسلة Base64، يدعم السحب والإفلات',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'ملف',
          to: 'Base64',
        },
        {
          title: 'فك ترميز الملف Base64',
          desc: 'فك تشفير سلسلة Base64 إلى ملف أصلي وتنزيله',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'ملف',
        },
      ],
    },
  ],

  de: [
    {
      title: 'Text',
      children: [
        {
          title: 'Text Base64 kodieren',
          desc: 'Text online in Base64-String konvertieren, sofortige Verarbeitung, Ein-Klick-Kopieren',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Text',
          to: 'Base64',
        },
        {
          title: 'Text Base64 dekodieren',
          desc: 'Base64-String online in Originaltext dekodieren, sofortige Verarbeitung, Ein-Klick-Kopieren',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Text',
        },
      ],
    },
    {
      title: 'Bild',
      children: [
        {
          title: 'Bild Base64 kodieren',
          desc: 'Bild online in Base64-String konvertieren, unterstützt PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Bild',
          to: 'Base64',
        },
        {
          title: 'Bild Base64 dekodieren',
          desc: 'Base64-String online in Bild mit Vorschau und Download dekodieren',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Bild',
        },
      ],
    },
    {
      title: 'Datei',
      children: [
        {
          title: 'Datei Base64 kodieren',
          desc: 'Beliebige Datei online in Base64-String konvertieren, Drag & Drop unterstützt',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Datei',
          to: 'Base64',
        },
        {
          title: 'Datei Base64 dekodieren',
          desc: 'Base64-String online in Originaldatei dekodieren und herunterladen',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Datei',
        },
      ],
    },
  ],

  es: [
    {
      title: 'Texto',
      children: [
        {
          title: 'Codificar Texto en Base64',
          desc: 'Convertir texto a cadena Base64 en línea, procesamiento instantáneo, copiar con un clic',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Texto',
          to: 'Base64',
        },
        {
          title: 'Decodificar Texto Base64',
          desc: 'Decodificar cadena Base64 a texto original en línea, procesamiento instantáneo, copiar con un clic',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Texto',
        },
      ],
    },
    {
      title: 'Imagen',
      children: [
        {
          title: 'Codificar Imagen en Base64',
          desc: 'Convertir imagen a cadena Base64 en línea, compatible con PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Imagen',
          to: 'Base64',
        },
        {
          title: 'Decodificar Imagen Base64',
          desc: 'Decodificar cadena Base64 a imagen con vista previa y descarga en línea',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Imagen',
        },
      ],
    },
    {
      title: 'Archivo',
      children: [
        {
          title: 'Codificar Archivo en Base64',
          desc: 'Convertir cualquier archivo a cadena Base64 en línea, compatible con arrastrar y soltar',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Archivo',
          to: 'Base64',
        },
        {
          title: 'Decodificar Archivo Base64',
          desc: 'Decodificar cadena Base64 a archivo original y descargar en línea',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Archivo',
        },
      ],
    },
  ],

  fr: [
    {
      title: 'Texte',
      children: [
        {
          title: 'Encoder du Texte en Base64',
          desc: 'Convertir du texte en chaîne Base64 en ligne, traitement instantané, copie en un clic',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Texte',
          to: 'Base64',
        },
        {
          title: 'Décoder du Texte Base64',
          desc: 'Décoder une chaîne Base64 en texte original en ligne, traitement instantané, copie en un clic',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Texte',
        },
      ],
    },
    {
      title: 'Image',
      children: [
        {
          title: "Encoder une Image en Base64",
          desc: "Convertir une image en chaîne Base64 en ligne, supporte PNG, JPG, GIF, WebP",
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Image',
          to: 'Base64',
        },
        {
          title: 'Décoder une Image Base64',
          desc: 'Décoder une chaîne Base64 en image avec aperçu et téléchargement en ligne',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Image',
        },
      ],
    },
    {
      title: 'Fichier',
      children: [
        {
          title: 'Encoder un Fichier en Base64',
          desc: 'Convertir tout fichier en chaîne Base64 en ligne, glisser-déposer supporté',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Fichier',
          to: 'Base64',
        },
        {
          title: 'Décoder un Fichier Base64',
          desc: 'Décoder une chaîne Base64 en fichier original et télécharger en ligne',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Fichier',
        },
      ],
    },
  ],

  hi: [
    {
      title: 'टेक्स्ट',
      children: [
        {
          title: 'टेक्स्ट Base64 एन्कोड',
          desc: 'टेक्स्ट को ऑनलाइन Base64 स्ट्रिंग में बदलें, तत्काल प्रोसेसिंग, एक क्लिक में कॉपी',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'टेक्स्ट',
          to: 'Base64',
        },
        {
          title: 'टेक्स्ट Base64 डिकोड',
          desc: 'ऑनलाइन Base64 स्ट्रिंग को मूल टेक्स्ट में डिकोड करें, तत्काल प्रोसेसिंग, एक क्लिक में कॉपी',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'टेक्स्ट',
        },
      ],
    },
    {
      title: 'इमेज',
      children: [
        {
          title: 'इमेज Base64 एन्कोड',
          desc: 'ऑनलाइन इमेज को Base64 स्ट्रिंग में बदलें, PNG, JPG, GIF, WebP सपोर्ट',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'इमेज',
          to: 'Base64',
        },
        {
          title: 'इमेज Base64 डिकोड',
          desc: 'ऑनलाइन Base64 स्ट्रिंग को इमेज में डिकोड करें, प्रीव्यू और डाउनलोड के साथ',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'इमेज',
        },
      ],
    },
    {
      title: 'फाइल',
      children: [
        {
          title: 'फाइल Base64 एन्कोड',
          desc: 'ऑनलाइन किसी भी फाइल को Base64 स्ट्रिंग में बदलें, ड्रैग एंड ड्रॉप सपोर्ट',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'फाइल',
          to: 'Base64',
        },
        {
          title: 'फाइल Base64 डिकोड',
          desc: 'ऑनलाइन Base64 स्ट्रिंग को मूल फाइल में डिकोड करें और डाउनलोड करें',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'फाइल',
        },
      ],
    },
  ],

  id: [
    {
      title: 'Teks',
      children: [
        {
          title: 'Encode Teks ke Base64',
          desc: 'Konversi teks ke string Base64 secara online, pemrosesan instan, salin satu klik',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Teks',
          to: 'Base64',
        },
        {
          title: 'Decode Teks Base64',
          desc: 'Dekode string Base64 ke teks asli secara online, pemrosesan instan, salin satu klik',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Teks',
        },
      ],
    },
    {
      title: 'Gambar',
      children: [
        {
          title: 'Encode Gambar ke Base64',
          desc: 'Konversi gambar ke string Base64 secara online, mendukung PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Gambar',
          to: 'Base64',
        },
        {
          title: 'Decode Gambar Base64',
          desc: 'Dekode string Base64 ke gambar dengan pratinjau dan unduhan secara online',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Gambar',
        },
      ],
    },
    {
      title: 'File',
      children: [
        {
          title: 'Encode File ke Base64',
          desc: 'Konversi file apapun ke string Base64 secara online, mendukung drag and drop',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'File',
          to: 'Base64',
        },
        {
          title: 'Decode File Base64',
          desc: 'Dekode string Base64 ke file asli dan unduh secara online',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'File',
        },
      ],
    },
  ],

  it: [
    {
      title: 'Testo',
      children: [
        {
          title: 'Codifica Testo in Base64',
          desc: 'Converti testo in stringa Base64 online, elaborazione istantanea, copia con un clic',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Testo',
          to: 'Base64',
        },
        {
          title: 'Decodifica Testo Base64',
          desc: 'Decodifica stringa Base64 in testo originale online, elaborazione istantanea, copia con un clic',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Testo',
        },
      ],
    },
    {
      title: 'Immagine',
      children: [
        {
          title: "Codifica Immagine in Base64",
          desc: "Converti immagine in stringa Base64 online, supporta PNG, JPG, GIF, WebP",
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Immagine',
          to: 'Base64',
        },
        {
          title: 'Decodifica Immagine Base64',
          desc: 'Decodifica stringa Base64 in immagine con anteprima e download online',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Immagine',
        },
      ],
    },
    {
      title: 'File',
      children: [
        {
          title: 'Codifica File in Base64',
          desc: 'Converti qualsiasi file in stringa Base64 online, supporta drag and drop',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'File',
          to: 'Base64',
        },
        {
          title: 'Decodifica File Base64',
          desc: 'Decodifica stringa Base64 in file originale e scarica online',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'File',
        },
      ],
    },
  ],

  ja: [
    {
      title: 'テキスト',
      children: [
        {
          title: 'テキスト Base64 エンコード',
          desc: 'テキストをオンラインで Base64 文字列に変換、即時処理、ワンクリックコピー',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'テキスト',
          to: 'Base64',
        },
        {
          title: 'テキスト Base64 デコード',
          desc: 'Base64 文字列をオンラインで元のテキストにデコード、即時処理、ワンクリックコピー',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'テキスト',
        },
      ],
    },
    {
      title: '画像',
      children: [
        {
          title: '画像 Base64 エンコード',
          desc: '画像をオンラインで Base64 文字列に変換、PNG、JPG、GIF、WebP 対応',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: '画像',
          to: 'Base64',
        },
        {
          title: '画像 Base64 デコード',
          desc: 'Base64 文字列をオンラインで画像にデコード、プレビューとダウンロード付き',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: '画像',
        },
      ],
    },
    {
      title: 'ファイル',
      children: [
        {
          title: 'ファイル Base64 エンコード',
          desc: '任意のファイルをオンラインで Base64 文字列に変換、ドラッグ＆ドロップ対応',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'ファイル',
          to: 'Base64',
        },
        {
          title: 'ファイル Base64 デコード',
          desc: 'Base64 文字列をオンラインで元のファイルにデコードしてダウンロード',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'ファイル',
        },
      ],
    },
  ],

  ko: [
    {
      title: '텍스트',
      children: [
        {
          title: '텍스트 Base64 인코딩',
          desc: '텍스트를 온라인으로 Base64 문자열로 변환, 즉시 처리, 원클릭 복사',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: '텍스트',
          to: 'Base64',
        },
        {
          title: '텍스트 Base64 디코딩',
          desc: 'Base64 문자열을 온라인으로 원본 텍스트로 디코딩, 즉시 처리, 원클릭 복사',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: '텍스트',
        },
      ],
    },
    {
      title: '이미지',
      children: [
        {
          title: '이미지 Base64 인코딩',
          desc: '이미지를 온라인으로 Base64 문자열로 변환, PNG, JPG, GIF, WebP 지원',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: '이미지',
          to: 'Base64',
        },
        {
          title: '이미지 Base64 디코딩',
          desc: 'Base64 문자열을 온라인으로 이미지로 디코딩, 미리보기 및 다운로드 포함',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: '이미지',
        },
      ],
    },
    {
      title: '파일',
      children: [
        {
          title: '파일 Base64 인코딩',
          desc: '모든 파일을 온라인으로 Base64 문자열로 변환, 드래그 앤 드롭 지원',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: '파일',
          to: 'Base64',
        },
        {
          title: '파일 Base64 디코딩',
          desc: 'Base64 문자열을 온라인으로 원본 파일로 디코딩하여 다운로드',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: '파일',
        },
      ],
    },
  ],

  nl: [
    {
      title: 'Tekst',
      children: [
        {
          title: 'Tekst Base64 Coderen',
          desc: 'Tekst online converteren naar Base64-string, onmiddellijke verwerking, één klik kopiëren',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Tekst',
          to: 'Base64',
        },
        {
          title: 'Tekst Base64 Decoderen',
          desc: 'Base64-string online decoderen naar originele tekst, onmiddellijke verwerking, één klik kopiëren',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Tekst',
        },
      ],
    },
    {
      title: 'Afbeelding',
      children: [
        {
          title: 'Afbeelding Base64 Coderen',
          desc: 'Afbeelding online converteren naar Base64-string, ondersteunt PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Afbeelding',
          to: 'Base64',
        },
        {
          title: 'Afbeelding Base64 Decoderen',
          desc: 'Base64-string online decoderen naar afbeelding met voorbeeld en download',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Afbeelding',
        },
      ],
    },
    {
      title: 'Bestand',
      children: [
        {
          title: 'Bestand Base64 Coderen',
          desc: 'Elk bestand online converteren naar Base64-string, slepen en neerzetten ondersteund',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Bestand',
          to: 'Base64',
        },
        {
          title: 'Bestand Base64 Decoderen',
          desc: 'Base64-string online decoderen naar origineel bestand en downloaden',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Bestand',
        },
      ],
    },
  ],

  pl: [
    {
      title: 'Tekst',
      children: [
        {
          title: 'Kodowanie Tekstu Base64',
          desc: 'Konwertuj tekst online na ciąg Base64, natychmiastowe przetwarzanie, kopiowanie jednym kliknięciem',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Tekst',
          to: 'Base64',
        },
        {
          title: 'Dekodowanie Tekstu Base64',
          desc: 'Dekoduj ciąg Base64 do oryginalnego tekstu online, natychmiastowe przetwarzanie, kopiowanie jednym kliknięciem',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Tekst',
        },
      ],
    },
    {
      title: 'Obraz',
      children: [
        {
          title: 'Kodowanie Obrazu Base64',
          desc: 'Konwertuj obraz online na ciąg Base64, obsługuje PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Obraz',
          to: 'Base64',
        },
        {
          title: 'Dekodowanie Obrazu Base64',
          desc: 'Dekoduj ciąg Base64 do obrazu z podglądem i pobieraniem online',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Obraz',
        },
      ],
    },
    {
      title: 'Plik',
      children: [
        {
          title: 'Kodowanie Pliku Base64',
          desc: 'Konwertuj dowolny plik online na ciąg Base64, obsługuje przeciągnij i upuść',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Plik',
          to: 'Base64',
        },
        {
          title: 'Dekodowanie Pliku Base64',
          desc: 'Dekoduj ciąg Base64 do oryginalnego pliku i pobieraj online',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Plik',
        },
      ],
    },
  ],

  pt: [
    {
      title: 'Texto',
      children: [
        {
          title: 'Codificar Texto em Base64',
          desc: 'Converter texto para string Base64 online, processamento instantâneo, copiar com um clique',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Texto',
          to: 'Base64',
        },
        {
          title: 'Decodificar Texto Base64',
          desc: 'Decodificar string Base64 para texto original online, processamento instantâneo, copiar com um clique',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Texto',
        },
      ],
    },
    {
      title: 'Imagem',
      children: [
        {
          title: 'Codificar Imagem em Base64',
          desc: 'Converter imagem para string Base64 online, suporta PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Imagem',
          to: 'Base64',
        },
        {
          title: 'Decodificar Imagem Base64',
          desc: 'Decodificar string Base64 para imagem com visualização e download online',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Imagem',
        },
      ],
    },
    {
      title: 'Arquivo',
      children: [
        {
          title: 'Codificar Arquivo em Base64',
          desc: 'Converter qualquer arquivo para string Base64 online, suporta arrastar e soltar',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Arquivo',
          to: 'Base64',
        },
        {
          title: 'Decodificar Arquivo Base64',
          desc: 'Decodificar string Base64 para arquivo original e baixar online',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Arquivo',
        },
      ],
    },
  ],

  ru: [
    {
      title: 'Текст',
      children: [
        {
          title: 'Кодирование текста в Base64',
          desc: 'Конвертируйте текст в строку Base64 онлайн, мгновенная обработка, копирование одним кликом',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Текст',
          to: 'Base64',
        },
        {
          title: 'Декодирование текста Base64',
          desc: 'Декодируйте строку Base64 в исходный текст онлайн, мгновенная обработка, копирование одним кликом',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Текст',
        },
      ],
    },
    {
      title: 'Изображение',
      children: [
        {
          title: 'Кодирование изображения в Base64',
          desc: 'Конвертируйте изображение в строку Base64 онлайн, поддерживает PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Изображение',
          to: 'Base64',
        },
        {
          title: 'Декодирование изображения Base64',
          desc: 'Декодируйте строку Base64 в изображение с предпросмотром и скачиванием онлайн',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Изображение',
        },
      ],
    },
    {
      title: 'Файл',
      children: [
        {
          title: 'Кодирование файла в Base64',
          desc: 'Конвертируйте любой файл в строку Base64 онлайн, поддерживает перетаскивание',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Файл',
          to: 'Base64',
        },
        {
          title: 'Декодирование файла Base64',
          desc: 'Декодируйте строку Base64 в исходный файл и скачайте онлайн',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Файл',
        },
      ],
    },
  ],

  sv: [
    {
      title: 'Text',
      children: [
        {
          title: 'Koda Text till Base64',
          desc: 'Konvertera text online till Base64-sträng, omedelbar bearbetning, ett-klicks kopiering',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Text',
          to: 'Base64',
        },
        {
          title: 'Avkoda Text Base64',
          desc: 'Avkoda Base64-sträng till originaltext online, omedelbar bearbetning, ett-klicks kopiering',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Text',
        },
      ],
    },
    {
      title: 'Bild',
      children: [
        {
          title: 'Koda Bild till Base64',
          desc: 'Konvertera bild online till Base64-sträng, stöder PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Bild',
          to: 'Base64',
        },
        {
          title: 'Avkoda Bild Base64',
          desc: 'Avkoda Base64-sträng till bild med förhandsgranskning och nedladdning online',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Bild',
        },
      ],
    },
    {
      title: 'Fil',
      children: [
        {
          title: 'Koda Fil till Base64',
          desc: 'Konvertera valfri fil online till Base64-sträng, dra och släpp stöds',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Fil',
          to: 'Base64',
        },
        {
          title: 'Avkoda Fil Base64',
          desc: 'Avkoda Base64-sträng till originalfil och ladda ner online',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Fil',
        },
      ],
    },
  ],

  th: [
    {
      title: 'ข้อความ',
      children: [
        {
          title: 'เข้ารหัสข้อความ Base64',
          desc: 'แปลงข้อความเป็น Base64 string ออนไลน์ ประมวลผลทันที คัดลอกด้วยคลิกเดียว',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'ข้อความ',
          to: 'Base64',
        },
        {
          title: 'ถอดรหัสข้อความ Base64',
          desc: 'ถอดรหัส Base64 string เป็นข้อความต้นฉบับออนไลน์ ประมวลผลทันที คัดลอกด้วยคลิกเดียว',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'ข้อความ',
        },
      ],
    },
    {
      title: 'รูปภาพ',
      children: [
        {
          title: 'เข้ารหัสรูปภาพ Base64',
          desc: 'แปลงรูปภาพเป็น Base64 string ออนไลน์ รองรับ PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'รูปภาพ',
          to: 'Base64',
        },
        {
          title: 'ถอดรหัสรูปภาพ Base64',
          desc: 'ถอดรหัส Base64 string เป็นรูปภาพพร้อมดูตัวอย่างและดาวน์โหลดออนไลน์',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'รูปภาพ',
        },
      ],
    },
    {
      title: 'ไฟล์',
      children: [
        {
          title: 'เข้ารหัสไฟล์ Base64',
          desc: 'แปลงไฟล์ใดก็ได้เป็น Base64 string ออนไลน์ รองรับการลากและวาง',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'ไฟล์',
          to: 'Base64',
        },
        {
          title: 'ถอดรหัสไฟล์ Base64',
          desc: 'ถอดรหัส Base64 string เป็นไฟล์ต้นฉบับและดาวน์โหลดออนไลน์',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'ไฟล์',
        },
      ],
    },
  ],

  tr: [
    {
      title: 'Metin',
      children: [
        {
          title: 'Metin Base64 Kodlama',
          desc: 'Metni çevrimiçi olarak Base64 dizisine dönüştür, anında işlem, tek tıkla kopyala',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Metin',
          to: 'Base64',
        },
        {
          title: 'Metin Base64 Çözme',
          desc: 'Base64 dizisini çevrimiçi olarak orijinal metne dönüştür, anında işlem, tek tıkla kopyala',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Metin',
        },
      ],
    },
    {
      title: 'Görüntü',
      children: [
        {
          title: 'Görüntü Base64 Kodlama',
          desc: 'Görüntüyü çevrimiçi olarak Base64 dizisine dönüştür, PNG, JPG, GIF, WebP destekler',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Görüntü',
          to: 'Base64',
        },
        {
          title: 'Görüntü Base64 Çözme',
          desc: 'Base64 dizisini çevrimiçi olarak önizleme ve indirme ile görüntüye dönüştür',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Görüntü',
        },
      ],
    },
    {
      title: 'Dosya',
      children: [
        {
          title: 'Dosya Base64 Kodlama',
          desc: 'Herhangi bir dosyayı çevrimiçi olarak Base64 dizisine dönüştür, sürükle ve bırak destekler',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Dosya',
          to: 'Base64',
        },
        {
          title: 'Dosya Base64 Çözme',
          desc: 'Base64 dizisini çevrimiçi olarak orijinal dosyaya dönüştür ve indir',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Dosya',
        },
      ],
    },
  ],

  vi: [
    {
      title: 'Văn bản',
      children: [
        {
          title: 'Mã hóa Văn bản Base64',
          desc: 'Chuyển đổi văn bản thành chuỗi Base64 trực tuyến, xử lý tức thì, sao chép một cú nhấp',
          href: '/web/encode-decode/base64/text-encode-base64',
          from: 'Văn bản',
          to: 'Base64',
        },
        {
          title: 'Giải mã Văn bản Base64',
          desc: 'Giải mã chuỗi Base64 thành văn bản gốc trực tuyến, xử lý tức thì, sao chép một cú nhấp',
          href: '/web/encode-decode/base64/text-decode-base64',
          from: 'Base64',
          to: 'Văn bản',
        },
      ],
    },
    {
      title: 'Hình ảnh',
      children: [
        {
          title: 'Mã hóa Hình ảnh Base64',
          desc: 'Chuyển đổi hình ảnh thành chuỗi Base64 trực tuyến, hỗ trợ PNG, JPG, GIF, WebP',
          href: '/web/encode-decode/base64/image-encode-base64',
          from: 'Hình ảnh',
          to: 'Base64',
        },
        {
          title: 'Giải mã Hình ảnh Base64',
          desc: 'Giải mã chuỗi Base64 thành hình ảnh với xem trước và tải xuống trực tuyến',
          href: '/web/encode-decode/base64/image-decode-base64',
          from: 'Base64',
          to: 'Hình ảnh',
        },
      ],
    },
    {
      title: 'Tệp',
      children: [
        {
          title: 'Mã hóa Tệp Base64',
          desc: 'Chuyển đổi bất kỳ tệp nào thành chuỗi Base64 trực tuyến, hỗ trợ kéo và thả',
          href: '/web/encode-decode/base64/file-encode-base64',
          from: 'Tệp',
          to: 'Base64',
        },
        {
          title: 'Giải mã Tệp Base64',
          desc: 'Giải mã chuỗi Base64 thành tệp gốc và tải xuống trực tuyến',
          href: '/web/encode-decode/base64/file-decode-base64',
          from: 'Base64',
          to: 'Tệp',
        },
      ],
    },
  ],
}

export function getBase64Cards(lang: LangCode): Base64CardGroup[] {
  return allLangCards[lang]
}

export const base64Groups = allLangCards['zh']

export const base64AllCards = [
  {
    children: base64Groups.flatMap(g => g.children),
  },
]
