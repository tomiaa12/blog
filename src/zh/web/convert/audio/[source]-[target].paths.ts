export type LangCode = 'zh' | 'en' | 'fr' | 'es' | 'de' | 'ja' | 'ko' | 'zh-TW' | 'ar' | 'ru' | 'pt' | 'it' | 'nl' | 'pl' | 'sv' | 'tr' | 'vi' | 'id' | 'hi' | 'th'
type I18nString = Record<LangCode, string>

export interface AudioFormat {
  desc: I18nString

  /**
   * 支持哪些解码器解码该格式（输入能力）
   */
  decoders?: Decoder[]

  /**
   * 支持哪些编码器编码该格式（输出能力）
   */
  encoders?: Encoder[]
}

export type Decoder = 'ffmpeg' | 'vgmstream'
export type Encoder = 'ffmpeg'

export type PipelineType = 'direct-ffmpeg' | 'vgmstream+ffmpeg'

const groupedAudioSourceFormats: { id: string; ext: string[]; desc: I18nString }[] = [
  {
    "id": "g01",
    "ext": [/* ".14", ".208", ".21", ".26", */ ".2dx", ".2dx9", /* ".31", */ ".3do", ".3ds", /* ".4", ".800", */ ".9tav"],
    "desc": { zh: "零散游戏资源、音频相关后缀，多见于老式/定制游戏文件", en: "Miscellaneous game resource suffixes, common in legacy/custom game files", fr: "Suffixes de ressources de jeux divers, courants dans les fichiers de jeux anciens/personnalisés", es: "Sufijos de recursos de juego variados, comunes en archivos de juegos antiguos/personalizados", de: "Diverse Spielressource-Suffixe, häufig in veralteten/benutzerdefinierten Spieledateien", ja: "様々なゲームリソースのサフィックス、レガシー/カスタムゲームファイルに多い", ko: "다양한 게임 리소스 접미사, 레거시/커스텀 게임 파일에서 흔히 사용", "zh-TW": "零散遊戲資源、音訊相關後綴，多見於老式/定製遊戲檔案", ar: "لاحقات موارد الألعاب المتنوعة، شائعة في ملفات الألعاب القديمة/المخصصة", ru: "Разнообразные суффиксы игровых ресурсов, характерные для устаревших/пользовательских игровых файлов", pt: "Sufixos de recursos de jogos diversos, comuns em arquivos de jogos legados/personalizados", it: "Suffissi di risorse di gioco vari, comuni nei file di giochi legacy/personalizzati", nl: "Diverse spelresource-achtervoegsels, veelvoorkomend in legacy/aangepaste spelbestanden", pl: "Różne przyrostki zasobów gier, powszechne w starszych/niestandardowych plikach gier", sv: "Diverse spelresurssuffix, vanliga i äldre/anpassade spelfiler", tr: "Çeşitli oyun kaynağı son ekleri, eski/özel oyun dosyalarında yaygın", vi: "Các hậu tố tài nguyên game đa dạng, phổ biến trong các file game cũ/tùy chỉnh", id: "Sufiks sumber daya game beragam, umum dalam file game lama/kustom", hi: "विविध गेम संसाधन प्रत्यय, पुरानी/कस्टम गेम फ़ाइलों में सामान्य", th: "ส่วนต่อท้ายทรัพยากรเกมที่หลากหลาย พบบ่อยในไฟล์เกมเก่า/กำหนดเอง" }
  },
  {
    "id": "g02",
    "ext": [".aac", ".aax", ".adp", ".adpcm", ".adpcmx", ".adx", ".afc", ".afs2", ".agsc", ".ahv", ".ahx", ".aif", ".aifc", ".aiff", ".aix", ".akb", ".amb", ".amx", ".an2", /* ".ao", ".ap", */ ".apc", ".apm"],
    "desc": { zh: "主机/街机/手游通用音频格式，包含ADPCM、ADX等压缩音频", en: "Universal audio formats for consoles/arcades/mobile games, including ADPCM, ADX and other compressed audio", fr: "Formats audio universels pour consoles/arcades/jeux mobiles, incluant ADPCM, ADX et d'autres compressions", es: "Formatos de audio universales para consolas/arcades/juegos móviles, incluidos ADPCM, ADX y otros comprimidos", de: "Universelle Audioformate für Konsolen/Arcade/Mobile-Spiele, einschließlich ADPCM, ADX und andere komprimierte Audiodaten", ja: "コンソール/アーケード/モバイルゲーム用の汎用オーディオフォーマット、ADPCM、ADXなどの圧縮音声を含む", ko: "콘솔/아케이드/모바일 게임용 범용 오디오 포맷, ADPCM, ADX 등 압축 오디오 포함", "zh-TW": "主機/街機/手遊通用音訊格式，包含ADPCM、ADX等壓縮音訊", ar: "تنسيقات صوتية عامة لوحدات التحكم/أماكن الألعاب/الألعاب المحمولة، تشمل ADPCM وADX وغيرها من الصوت المضغوط", ru: "Универсальные аудиоформаты для консолей/аркад/мобильных игр, включая ADPCM, ADX и другое сжатое аудио", pt: "Formatos de áudio universais para consoles/arcades/jogos mobile, incluindo ADPCM, ADX e outros comprimidos", it: "Formati audio universali per console/arcade/giochi mobile, inclusi ADPCM, ADX e altri compressi", nl: "Universele audioformaten voor consoles/arcade/mobiele games, inclusief ADPCM, ADX en andere gecomprimeerde audio", pl: "Uniwersalne formaty audio dla konsol/arkad/gier mobilnych, w tym ADPCM, ADX i inne skompresowane", sv: "Universella ljudformat för konsoler/arkader/mobilspel, inklusive ADPCM, ADX och annat komprimerat ljud", tr: "Konsol/arcade/mobil oyunlar için evrensel ses formatları, ADPCM, ADX ve diğer sıkıştırılmış ses dahil", vi: "Định dạng âm thanh chung cho máy console/arcade/game di động, bao gồm ADPCM, ADX và âm thanh nén khác", id: "Format audio universal untuk konsol/arkade/game mobile, termasuk ADPCM, ADX dan audio terkompresi lainnya", hi: "कंसोल/आर्केड/मोबाइल गेम के लिए सार्वभौमिक ऑडियो प्रारूप, ADPCM, ADX और अन्य संपीड़ित ऑडियो सहित", th: "รูปแบบเสียงสากลสำหรับคอนโซล/อาร์เคด/เกมมือถือ รวมถึง ADPCM, ADX และเสียงบีบอัดอื่นๆ" }
  },
  {
    "id": "g03",
    "ext": [".as4", ".asbin", ".asd", ".asf", ".asr", ".asrc", ".asset", ".ast", ".at3", ".at9", ".atsl", ".atsl3", ".atsl4", ".atslx", ".atx", ".aud", ".audio_data", ".audiopkg", ".aus", ".awb", ".awc", ".awd", ".awx"],
    "desc": { zh: "索尼系、任天堂系游戏音频流与资源包格式", en: "Sony/Nintendo game audio stream and resource package formats", fr: "Formats de flux audio et de paquets de ressources pour jeux Sony/Nintendo", es: "Formatos de flujo de audio y paquetes de recursos de juegos Sony/Nintendo", de: "Sony/Nintendo-Spielaudio-Stream- und Ressourcenpaketformate", ja: "Sony/Nintendoゲームのオーディオストリームとリソースパッケージフォーマット", ko: "Sony/Nintendo 게임 오디오 스트림 및 리소스 패키지 포맷", "zh-TW": "索尼系、任天堂系遊戲音訊流與資源包格式", ar: "تنسيقات تدفق الصوت وحزم الموارد لألعاب Sony وNintendo", ru: "Форматы аудиопотоков и пакетов ресурсов игр Sony/Nintendo", pt: "Formatos de fluxo de áudio e pacotes de recursos de jogos Sony/Nintendo", it: "Formati di flusso audio e pacchetti di risorse per giochi Sony/Nintendo", nl: "Sony/Nintendo-spel audiostream- en resourcepakketformaten", pl: "Formaty strumienia audio i pakietów zasobów gier Sony/Nintendo", sv: "Sony/Nintendo-spel ljudström och resurspaketformat", tr: "Sony/Nintendo oyun ses akışı ve kaynak paketi formatları", vi: "Định dạng luồng âm thanh và gói tài nguyên game Sony/Nintendo", id: "Format streaming audio dan paket sumber daya game Sony/Nintendo", hi: "Sony/Nintendo गेम ऑडियो स्ट्रीम और संसाधन पैकेज प्रारूप", th: "รูปแบบสตรีมเสียงและแพ็คเกจทรัพยากรเกม Sony/Nintendo" }
  },
  {
    "id": "g04",
    "ext": [".baa", ".baf", ".baka", ".bank", ".bao", ".bar", ".bcstm", ".bcwav", /* ".bd", */ ".bd3", ".bfstm", ".bfwav", ".bg00", ".bgm", ".bgw", ".bigrp", ".bik", ".bika", ".bin", ".binka", ".bk2", ".bkd", ".bkh", ".blk", ".bmdx", ".bms", ".bnh", ".bnk", ".bnm", ".bns", ".bnsf", ".bo2", ".box", ".brstm", ".brstmspm", ".brwav", ".brwsd", ".bsf", ".bsnd", ".btsnd", ".bvg", ".bwav", /* ".bx", */],
    "desc": { zh: "Wwise、Unity、3DS、Wii、Switch等平台音频bank与流文件", en: "Wwise, Unity, 3DS, Wii, Switch platform audio bank and stream files", fr: "Fichiers de banque audio et de flux pour les plateformes Wwise, Unity, 3DS, Wii, Switch", es: "Archivos de banco de audio y flujo para plataformas Wwise, Unity, 3DS, Wii, Switch", de: "Wwise, Unity, 3DS, Wii, Switch Plattform-Audiobank- und Stream-Dateien", ja: "Wwise、Unity、3DS、Wii、Switchプラットフォームのオーディオバンクとストリームファイル", ko: "Wwise, Unity, 3DS, Wii, Switch 플랫폼 오디오 뱅크 및 스트림 파일", "zh-TW": "Wwise、Unity、3DS、Wii、Switch等平台音訊bank與串流檔案", ar: "ملفات بنك الصوت والتدفق لمنصات Wwise وUnity و3DS وWii وSwitch", ru: "Файлы банков аудио и потоков для платформ Wwise, Unity, 3DS, Wii, Switch", pt: "Arquivos de banco de áudio e streaming para plataformas Wwise, Unity, 3DS, Wii, Switch", it: "File di banco audio e streaming per piattaforme Wwise, Unity, 3DS, Wii, Switch", nl: "Wwise, Unity, 3DS, Wii, Switch platform audiobank- en streambestanden", pl: "Pliki banku audio i strumienia dla platform Wwise, Unity, 3DS, Wii, Switch", sv: "Wwise, Unity, 3DS, Wii, Switch plattform ljudbank och ström filer", tr: "Wwise, Unity, 3DS, Wii, Switch platformları için ses bankası ve akış dosyaları", vi: "File ngân hàng âm thanh và luồng cho nền tảng Wwise, Unity, 3DS, Wii, Switch", id: "File bank audio dan streaming platform Wwise, Unity, 3DS, Wii, Switch", hi: "Wwise, Unity, 3DS, Wii, Switch प्लेटफ़ॉर्म ऑडियो बैंक और स्ट्रीम फ़ाइलें", th: "ไฟล์แบงก์เสียงและสตรีมสำหรับแพลตฟอร์ม Wwise, Unity, 3DS, Wii, Switch" }
  },
  {
    "id": "g05",
    "ext": [/* ".c", */ ".cads", ".caf", ".cat", ".cbd2", ".cbx", /* ".cd", */ ".cfn", ".chk", ".ckb", ".ckd", ".cks", ".cnk", ".cpk", ".cps", ".crd", ".csb", ".csmp", ".cwav", ".cxb", ".cxs"],
    "desc": { zh: "CPK打包、任天堂CWAV、各引擎音频容器与配置", en: "CPK packed, Nintendo CWAV, various engine audio containers and configs", fr: "CPK empaqueté, Nintendo CWAV, conteneurs audio et configurations pour divers moteurs", es: "Empaquetado CPK, Nintendo CWAV, contenedores y configuraciones de audio para varios motores", de: "CPK-gepackt, Nintendo CWAV, verschiedene Engine-Audio-Container und Konfigurationen", ja: "CPKパック、Nintendo CWAV、各エンジンのオーディオコンテナと設定", ko: "CPK 패키징, Nintendo CWAV, 각종 엔진 오디오 컨테이너 및 설정", "zh-TW": "CPK打包、任天堂CWAV、各引擎音訊容器與配置", ar: "CPK المضغوطة وNintendo CWAV وحاويات الصوت وإعدادات المحركات المختلفة", ru: "Упакованный CPK, Nintendo CWAV, различные контейнеры аудио и конфигурации движков", pt: "Empacotado CPK, Nintendo CWAV, contêineres de áudio e configurações para vários motores", it: "CPK impacchettato, Nintendo CWAV, contenitori audio e configurazioni per vari engine", nl: "CPK-verpakt, Nintendo CWAV, diverse engine-audiocontainers en configuraties", pl: "Spakowane CPK, Nintendo CWAV, różne kontenery audio i konfiguracje silników", sv: "CPK-paketerat, Nintendo CWAV, olika motorljudcontainrar och konfigurationer", tr: "CPK paketlenmiş, Nintendo CWAV, çeşitli motor ses konteynerleri ve yapılandırmaları", vi: "Đóng gói CPK, Nintendo CWAV, container âm thanh và cấu hình cho các engine khác nhau", id: "CPK terpak, Nintendo CWAV, kontainer audio dan konfigurasi berbagai engine", hi: "CPK पैक्ड, Nintendo CWAV, विभिन्न इंजन ऑडियो कंटेनर और कॉन्फ़िगरेशन", th: "CPK บรรจุ, Nintendo CWAV, คอนเทนเนอร์เสียงและการกำหนดค่าสำหรับเอนจิ้นต่างๆ" }
  },
  {
    "id": "g06",
    "ext": [/* ".da", */ ".dat", ".data", ".dax", ".dbm", ".dcs", ".dct", ".ddsp", ".de2", ".dec", ".dic", ".diva", ".dmsg", ".ds2", ".dsb", ".dsf", ".dsp", ".dspw", ".dtk", ".dty", ".dvi"],
    "desc": { zh: "老式主机DSP/ADPCM音频、数据封装、音游/定制音频格式", en: "Legacy console DSP/ADPCM audio, data containers, rhythm game/custom audio formats", fr: "Audio DSP/ADPCM de consoles anciennes, conteneurs de données, formats de jeux rythmiques/personnalisés", es: "Audio DSP/ADPCM de consolas antiguas, contenedores de datos, formatos de juego rítmico/personalizados", de: "Legacy-Konsolen DSP/ADPCM-Audio, Datencontainer, Rhythmusspiel/benutzerdefinierte Audioformate", ja: "レガシーコンソールのDSP/ADPCMオーディオ、データコンテナ、音楽ゲーム/カスタムオーディオフォーマット", ko: "레거시 콘솔 DSP/ADPCM 오디오, 데이터 컨테이너, 리듬 게임/커스텀 오디오 포맷", "zh-TW": "老式主機DSP/ADPCM音訊、資料封裝、音遊/定製音訊格式", ar: "صوت DSP/ADPCM لوحدات التحكم القديمة وحاويات البيانات وتنسيقات ألعاب الإيقاع/المخصصة", ru: "Аудио DSP/ADPCM для устаревших консолей, контейнеры данных, форматы ритм-игр/пользовательских аудио", pt: "Áudio DSP/ADPCM de consoles legados, contêineres de dados, formatos de áudio para jogos rítmicos/personalizados", it: "Audio DSP/ADPCM legacy per console, contenitori di dati, formati audio per giochi ritmici/personalizzati", nl: "Legacy console DSP/ADPCM-audio, datacontainers, ritme-/aangepaste audioformaten", pl: "Starsze konsole DSP/ADPCM audio, kontenery danych, formaty audio gier rytmicznych/niestandardowych", sv: "Äldre konsol DSP/ADPCM-ljud, databehållare, rytmspel/anpassade ljudformat", tr: "Eski konsol DSP/ADPCM sesi, veri konteynerleri, ritim oyunu/özel ses formatları", vi: "Âm thanh DSP/ADPCM máy console cũ, container dữ liệu, định dạng âm thanh game nhịp điệu/tùy chỉnh", id: "Audio DSP/ADPCM konsol lama, kontainer data, format audio game ritme/kustom", hi: "पुराने कंसोल DSP/ADPCM ऑडियो, डेटा कंटेनर, रिदम गेम/कस्टम ऑडियो प्रारूप", th: "เสียง DSP/ADPCM ของคอนโซลเก่า, คอนเทนเนอร์ข้อมูล, รูปแบบเสียงเกมจังหวะ/กำหนดเอง" }
  },
  {
    "id": "g07",
    "ext": [".e4x", ".eam", ".eas", ".emff", ".enm", ".eno", ".ens", ".esf", ".exa", ".ezw"],
    "desc": { zh: "定制引擎音频、音效资源与加密音频格式", en: "Custom engine audio, sound effect resources and encrypted audio formats", fr: "Audio de moteur personnalisé, ressources d'effets sonores et formats audio chiffrés", es: "Audio de motor personalizado, recursos de efectos de sonido y formatos de audio cifrados", de: "Benutzerdefiniertes Engine-Audio, Soundeffekt-Ressourcen und verschlüsselte Audioformate", ja: "カスタムエンジンオーディオ、効果音リソースと暗号化オーディオフォーマット", ko: "커스텀 엔진 오디오, 효과음 리소스 및 암호화된 오디오 포맷", "zh-TW": "定製引擎音訊、音效資源與加密音訊格式", ar: "صوت المحرك المخصص وموارد المؤثرات الصوتية والتنسيقات المشفرة", ru: "Аудио пользовательского движка, ресурсы звуковых эффектов и зашифрованные аудиоформаты", pt: "Áudio de motor personalizado, recursos de efeitos sonoros e formatos de áudio criptografados", it: "Audio engine personalizzato, risorse effetti sonori e formati audio cifrati", nl: "Aangepast engine-audio, geluidseffectbronnen en versleutelde audioformaten", pl: "Niestandardowe audio silnika, zasoby efektów dźwiękowych i zaszyfrowane formaty audio", sv: "Anpassad motorljud, ljudeffektsresurser och krypterade ljudformat", tr: "Özel motor sesi, ses efekti kaynakları ve şifreli ses formatları", vi: "Âm thanh engine tùy chỉnh, tài nguyên hiệu ứng âm thanh và định dạng âm thanh mã hóa", id: "Audio engine kustom, sumber daya efek suara dan format audio terenkripsi", hi: "कस्टम इंजन ऑडियो, साउंड इफेक्ट संसाधन और एन्क्रिप्टेड ऑडियो प्रारूप", th: "เสียงเอนจิ้นกำหนดเอง, ทรัพยากรเอฟเฟกต์เสียง และรูปแบบเสียงที่เข้ารหัส" }
  },
  {
    "id": "g08",
    "ext": [".fag", ".fda", ".fil", ".fish", ".flx", ".fsb", ".fsv", ".fwav", ".fwse"],
    "desc": { zh: "FMOD音频、FSB音效包、多平台专用音频", en: "FMOD audio, FSB sound pack, multi-platform proprietary audio", fr: "Audio FMOD, pack sonore FSB, audio propriétaire multi-plateforme", es: "Audio FMOD, paquete de sonido FSB, audio propietario multiplataforma", de: "FMOD-Audio, FSB-Soundpaket, plattformübergreifendes proprietäres Audio", ja: "FMODオーディオ、FSBサウンドパック、マルチプラットフォーム専用オーディオ", ko: "FMOD 오디오, FSB 사운드 팩, 멀티 플랫폼 전용 오디오", "zh-TW": "FMOD音訊、FSB音效包、多平台專用音訊", ar: "صوت FMOD وحزمة FSB وصوت خاص متعدد المنصات", ru: "FMOD-аудио, FSB-пакет звуков, многоплатформенный проприетарный звук", pt: "Áudio FMOD, pacote de som FSB, áudio proprietário multiplataforma", it: "Audio FMOD, pacchetto sonoro FSB, audio proprietario multipiattaforma", nl: "FMOD-audio, FSB-geluidspakket, multi-platform eigen audio", pl: "Audio FMOD, pakiet dźwięków FSB, audio własne dla wielu platform", sv: "FMOD-ljud, FSB-ljudpaket, plattformsoberoende proprietärt ljud", tr: "FMOD sesi, FSB ses paketi, çok platformlu tescilli ses", vi: "Âm thanh FMOD, gói âm thanh FSB, âm thanh độc quyền đa nền tảng", id: "Audio FMOD, paket suara FSB, audio proprietary multi-platform", hi: "FMOD ऑडियो, FSB साउंड पैक, मल्टी-प्लेटफ़ॉर्म प्रोपराइटरी ऑडियो", th: "เสียง FMOD, แพ็คเกจเสียง FSB, เสียงเฉพาะหลายแพลตฟอร์ม" }
  },
  {
    "id": "g09",
    "ext": [".g1l", ".gbts", ".gca", ".gcm", ".gcub", ".gcw", ".ged", ".gin", ".gms", ".grn", ".gsb", ".gsf", ".gsp", ".gtd", ".gwb", ".gwd", ".gwm"],
    "desc": { zh: "NGC、Wii、各类定制引擎音频与音效", en: "NGC, Wii, various custom engine audio and sound effects", fr: "NGC, Wii, divers effets sonores et audio de moteurs personnalisés", es: "NGC, Wii, varios efectos de sonido y audio de motores personalizados", de: "NGC, Wii, diverse benutzerdefinierte Engine-Audio und Soundeffekte", ja: "NGC、Wii、各種カスタムエンジンのオーディオとサウンドエフェクト", ko: "NGC, Wii, 다양한 커스텀 엔진 오디오 및 효과음", "zh-TW": "NGC、Wii、各類定製引擎音訊與音效", ar: "NGC وWii ومختلف المؤثرات الصوتية والصوت لمحركات مخصصة", ru: "NGC, Wii, различные звуки и аудио пользовательских движков", pt: "NGC, Wii, vários áudios e efeitos sonoros de engines personalizadas", it: "NGC, Wii, vari audio ed effetti sonori di engine personalizzati", nl: "NGC, Wii, diverse aangepaste engine-audio en geluidseffecten", pl: "NGC, Wii, różne efekty dźwiękowe i audio niestandardowych silników", sv: "NGC, Wii, diverse anpassade motorljud och ljudeffekter", tr: "NGC, Wii, çeşitli özel motor sesi ve ses efektleri", vi: "NGC, Wii, các âm thanh và hiệu ứng âm thanh engine tùy chỉnh", id: "NGC, Wii, berbagai audio dan efek suara engine kustom", hi: "NGC, Wii, विभिन्न कस्टम इंजन ऑडियो और साउंड इफेक्ट", th: "NGC, Wii, เสียงและเอฟเฟกต์เสียงเอนจิ้นกำหนดเองต่างๆ" }
  },
  {
    "id": "g10",
    "ext": [".h4m", ".hab", ".hbd", ".hca", /* ".hd", */ ".hd2", ".hd3", ".hdr", ".hdt", ".his", ".hps", ".hsf", ".hvqm", ".hwas", ".hwb", ".hwd", ".hx2", ".hx3", ".hxc", ".hxd", ".hxg", ".hxx"],
    "desc": { zh: "HCA高压缩手游音频、老式主机视频音频复合格式", en: "HCA high-compression mobile audio, legacy console composite video/audio formats", fr: "Audio mobile HCA à haute compression, formats composites vidéo/audio de consoles anciennes", es: "Audio móvil HCA de alta compresión, formatos de video/audio compuestos de consolas antiguas", de: "HCA hochkomprimiertes Mobile-Audio, ältere Konsolen-Video/Audio-Verbundformate", ja: "HCA高圧縮モバイルオーディオ、レガシーコンソールの複合ビデオ/オーディオフォーマット", ko: "HCA 고압축 모바일 오디오, 레거시 콘솔 복합 비디오/오디오 포맷", "zh-TW": "HCA高壓縮手遊音訊、老式主機影音複合格式", ar: "صوت HCA عالي الضغط للهاتف المحمول وتنسيقات الفيديو/الصوت المركبة لوحدات التحكم القديمة", ru: "HCA высококомпрессионный мобильный звук, составные видео/аудиоформаты старых консолей", pt: "Áudio móvel de alta compressão HCA, formatos compostos de vídeo/áudio para consoles legados", it: "Audio mobile HCA ad alta compressione, formati compositi video/audio per console legacy", nl: "HCA hoge compressie mobiele audio, legacy console composite video/audio formats", pl: "HCA wysokiej kompresji audio mobilne, starsze formaty kompozytowe wideo/audio dla konsol", sv: "HCA hög-kompresserat mobilljud, äldre konsolsammansatta video/ljudformat", tr: "HCA yüksek sıkıştırmalı mobil ses, eski konsol bileşik video/ses formatları", vi: "Âm thanh di động nén cao HCA, định dạng video/âm thanh tổng hợp của máy console cũ", id: "Audio mobile kompresi tinggi HCA, format komposit video/audio konsol lama", hi: "HCA उच्च-संपीड़न मोबाइल ऑडियो, पुराने कंसोल कंपोजिट वीडियो/ऑडियो प्रारूप", th: "เสียงมือถือ HCA บีบอัดสูง, รูปแบบวิดีโอ/เสียงรวมของคอนโซลเก่า" }
  },
  {
    "id": "g11",
    "ext": [".iab", ".iadp", ".idmsf", ".idsp", ".idwav", ".idxma", ".ifs", ".ikm", ".ild", ".ima", ".imc", ".imf", ".imx", ".int", ".int_cp3", ".is14", ".isb", ".isd", ".ish", ".isws", ".itl", ".ivag", ".ivaud", ".ivb", ".ixa"],
    "desc": { zh: "IMA-ADPCM、PS系/手游专用音频与资源", en: "IMA-ADPCM, PlayStation/mobile game dedicated audio and resources", fr: "IMA-ADPCM, audio et ressources dédiés aux jeux PlayStation/mobiles", es: "IMA-ADPCM, audio y recursos dedicados para juegos PlayStation/móviles", de: "IMA-ADPCM, PlayStation/Mobile-Spiel dediziertes Audio und Ressourcen", ja: "IMA-ADPCM、PlayStation/モバイルゲーム専用オーディオとリソース", ko: "IMA-ADPCM, PlayStation/모바일 게임 전용 오디오 및 리소스", "zh-TW": "IMA-ADPCM、PS系/手遊專用音訊與資源", ar: "IMA-ADPCM وصوت موارد مخصصة لألعاب PlayStation/المحمول", ru: "IMA-ADPCM, специализированный звук и ресурсы для PlayStation/мобильных игр", pt: "IMA-ADPCM, áudio e recursos dedicados para jogos PlayStation/mobile", it: "IMA-ADPCM, audio e risorse dedicati per giochi PlayStation/mobile", nl: "IMA-ADPCM, PlayStation/mobiele game-specifieke audio en bronnen", pl: "IMA-ADPCM, dedykowane audio i zasoby dla gier PlayStation/mobilnych", sv: "IMA-ADPCM, PlayStation/mobila spel dedikerat ljud och resurser", tr: "IMA-ADPCM, PlayStation/mobil oyunlara özel ses ve kaynaklar", vi: "IMA-ADPCM, âm thanh và tài nguyên dành riêng cho PlayStation/game di động", id: "IMA-ADPCM, audio dan sumber daya khusus PlayStation/game mobile", hi: "IMA-ADPCM, PlayStation/मोबाइल गेम समर्पित ऑडियो और संसाधन", th: "IMA-ADPCM, เสียงและทรัพยากรเฉพาะสำหรับเกม PlayStation/มือถือ" }
  },
  {
    "id": "g12",
    "ext": [".joe", ".jstm", ".k2sb", ".ka1a", ".kat", ".kcey", ".km9", ".kmx", ".kno", ".kns", ".koe", ".kovs", ".kraw", ".ktac", ".ktsl2asbin", ".ktss", ".kvs", ".kwa"],
    "desc": { zh: "日系音游、街机、定制厂商音频格式", en: "Japanese rhythm games, arcades, custom vendor audio formats", fr: "Formats audio de jeux de rythme japonais, arcades et fournisseurs personnalisés", es: "Formatos de audio de juegos de ritmo japoneses, arcades y proveedores personalizados", de: "Japanische Rhythmusspiele, Arcade- und benutzerdefinierte Anbieter-Audioformate", ja: "日本の音楽ゲーム、アーケード、カスタムベンダーのオーディオフォーマット", ko: "일본 리듬 게임, 아케이드, 커스텀 벤더 오디오 포맷", "zh-TW": "日系音遊、街機、定製廠商音訊格式", ar: "تنسيقات صوتية لألعاب الإيقاع اليابانية والأركيد والموردين المخصصين", ru: "Японские ритм-игры, аркадные и пользовательские форматы от вендоров", pt: "Formatos de áudio de jogos de ritmo japoneses, arcades e fornecedores personalizados", it: "Formati audio per giochi ritmici giapponesi, arcade e fornitori personalizzati", nl: "Japanse ritmespellen, arcades, aangepaste leverancier-audioformaten", pl: "Japońskie gry rytmiczne, automaty do gier, niestandardowe formaty audio od dostawców", sv: "Japanska rytmspel, arkadmaskiner, anpassade leverantörens ljudformat", tr: "Japon ritim oyunları, arcadeler, özel satıcı ses formatları", vi: "Định dạng âm thanh game nhịp điệu Nhật, arcade và nhà cung cấp tùy chỉnh", id: "Format audio game ritme Jepang, arcade, vendor kustom", hi: "जापानी रिदम गेम्स, आर्केड, कस्टम वेंडर ऑडियो प्रारूप", th: "รูปแบบเสียงเกมจังหวะญี่ปุ่น, อาร์เคด, ผู้จำหน่ายกำหนดเอง" }
  },
  {
    "id": "g13",
    "ext": [/* ".l", */ ".laac", ".ladpcm", ".laif", ".laifc", ".laiff", ".lasf", ".lbin", ".ldat", ".ldt", ".lep", ".lin", ".lm0", ".lm1", ".lm2", ".lm3", ".lm4", ".lm5", ".lm6", ".lm7", ".lmp2", ".lmp3", ".lmp4", ".lmpc", ".logg", ".lopus", /* ".lp", */ ".lpcm", ".lpk", ".lps", ".lrmb", ".lrmh", ".lse", ".lsf", ".lstm", ".lwav", ".lwd", ".lwma"],
    "desc": { zh: "带前缀变种音频（OGG、OPUS、WAV）、低延迟/封装音频", en: "Prefixed variant audio (OGG, OPUS, WAV), low-latency/wrapped audio", fr: "Audio variante avec préfixe (OGG, OPUS, WAV), audio à faible latence/encapsulé", es: "Audio variante con prefijo (OGG, OPUS, WAV), audio de baja latencia/encapsulado", de: "Präfixvarianten-Audio (OGG, OPUS, WAV), Low-Latency/verpacktes Audio", ja: "プレフィックス付きバリアントオーディオ（OGG、OPUS、WAV）、低遅延/ラップされたオーディオ", ko: "접두사 변형 오디오(OGG, OPUS, WAV), 저지연/래핑 오디오", "zh-TW": "帶前綴變種音訊（OGG、OPUS、WAV）、低延遲/封裝音訊", ar: "صوت متغير مع بادئة (OGG وOPUS وWAV) وصوت منخفض الكمون/ملفوف", ru: "Аудио с префиксом-вариантом (OGG, OPUS, WAV), низко-латентное/обёрнутое аудио", pt: "Áudio variante com prefixo (OGG, OPUS, WAV), áudio de baixa latência/encapsulado", it: "Audio variante con prefisso (OGG, OPUS, WAV), audio a bassa latenza/incapsulato", nl: "Prefix-variante audio (OGG, OPUS, WAV), lage latentie/ingepakt audio", pl: "Audio z prefiksem-wariantem (OGG, OPUS, WAV), audio o niskiej latencji/opakowane", sv: "Prefix-variant ljud (OGG, OPUS, WAV), låg-latens/inpackat ljud", tr: "Önekli varyant ses (OGG, OPUS, WAV), düşük gecikmeli/sarılmış ses", vi: "Âm thanh biến thể có tiền tố (OGG, OPUS, WAV), âm thanh độ trễ thấp/được bọc", id: "Audio varian berprefix (OGG, OPUS, WAV), audio latensi rendah/dibungkus", hi: "प्रीफिक्स वेरिएंट ऑडियो (OGG, OPUS, WAV), कम-विलंबता/रैप्ड ऑडियो", th: "เสียงตัวแปรพร้อมคำนำหน้า (OGG, OPUS, WAV), เสียงความหน่วงต่ำ/ห่อหุ้ม" }
  },
  {
    "id": "g14",
    "ext": [".m4a", ".m4v", ".mab", ".mad", ".map", ".mc3", ".mca", ".mcadpcm", ".mds", ".mdsp", ".med", ".mhk", ".mib", ".mic", ".mih", ".mio", ".mjb", ".mjh", ".mogg", ".mon", ".mov", ".move", ".mp2", ".mp4", ".mpc", ".mpdsp", ".mpf", /* ".ms", */ ".msa", ".msb", ".msd", ".mse", ".msf", ".msh", ".mss", ".msv", ".msvp", ".msx", ".mta2", ".mtaf", ".mul", ".mups", ".mus", ".musc", ".musx", ".mwv", ".mxst", ".myspd"],
    "desc": { zh: "通用音视频+多平台游戏音频、PSO/网游/单机音效", en: "General audio/video + multi-platform game audio, PSO/online/offline SFX", fr: "Audio/vidéo général + audio de jeux multi-plateforme, effets sonores PSO/en ligne/hors ligne", es: "Audio/vídeo general + audio de juegos multiplataforma, efectos de sonido PSO/en línea/sin conexión", de: "Allgemeines Audio/Video + Multi-Plattform-Spielaudio, PSO/Online/Offline-Soundeffekte", ja: "汎用音声/動画＋マルチプラットフォームゲームオーディオ、PSO/オンライン/オフラインSFX", ko: "일반 오디오/비디오 + 멀티 플랫폼 게임 오디오, PSO/온라인/오프라인 효과음", "zh-TW": "通用音視頻+多平台遊戲音訊、PSO/網遊/單機音效", ar: "صوت/فيديو عام + صوت ألعاب متعدد المنصات ومؤثرات PSO/أونلاين/أوفلاين", ru: "Универсальное аудио/видео + многоплатформенный звук, PSO/онлайн/офлайн звуковые эффекты", pt: "Áudio/vídeo geral + áudio de jogos multiplataforma, efeitos sonoros PSO/online/offline", it: "Audio/video generale + audio di giochi multipiattaforma, effetti sonori PSO/online/offline", nl: "Algemeen audio/video + multi-platform gameaudio, PSO/online/offline geluidseffecten", pl: "Ogólne audio/wideo + audio gier wieloplatformowych, efekty dźwiękowe PSO/online/offline", sv: "Allmänt ljud/video + multi-plattform spelljud, PSO/online/offline ljudeffekter", tr: "Genel ses/video + çok platformlu oyun sesi, PSO/çevrimiçi/çevrimdışı efektler", vi: "Âm thanh/video tổng hợp + âm thanh game đa nền tảng, hiệu ứng PSO/online/offline", id: "Audio/video umum + audio game multi-platform, SFX PSO/online/offline", hi: "सामान्य ऑडियो/वीडियो + मल्टी-प्लेटफ़ॉर्म गेम ऑडियो, PSO/ऑनलाइन/ऑफलाइन SFX", th: "เสียง/วิดีโอทั่วไป + เสียงเกมหลายแพลตฟอร์ม, SFX PSO/ออนไลน์/ออฟไลน์" }
  },
  {
    "id": "g15",
    "ext": [".n64", ".naac", ".ndp", ".nds", ".nfx", ".nlsd", /* ".no", */ ".nop", ".nps", ".npsf", ".nsa", ".nsopus", ".nst", ".nub", ".nub2", ".nus3audio", ".nus3bank", ".nusnub", ".nwa", ".nwav", ".nxa", ".nxopus"],
    "desc": { zh: "N64、NDS、Switch任天堂系音频与OPUS变种", en: "N64, NDS, Switch Nintendo audio and OPUS variants", fr: "Audio Nintendo N64, NDS, Switch et variantes OPUS", es: "Audio Nintendo N64, NDS, Switch y variantes OPUS", de: "N64, NDS, Switch Nintendo-Audio und OPUS-Varianten", ja: "N64、NDS、Switch 任天堂系オーディオとOPUSバリアント", ko: "N64, NDS, Switch 닌텐도 오디오 및 OPUS 변형", "zh-TW": "N64、NDS、Switch任天堂系音訊與OPUS變種", ar: "صوت Nintendo N64 وNDS وSwitch وتنويعات OPUS", ru: "N64, NDS, Switch аудио Nintendo и варианты OPUS", pt: "Áudio Nintendo N64, NDS, Switch e variantes OPUS", it: "Audio Nintendo N64, NDS, Switch e varianti OPUS", nl: "N64, NDS, Switch Nintendo-audio en OPUS-varianten", pl: "Audio Nintendo N64, NDS, Switch i warianty OPUS", sv: "N64, NDS, Switch Nintendo-ljud och OPUS-varianter", tr: "N64, NDS, Switch Nintendo sesi ve OPUS varyantları", vi: "Âm thanh Nintendo N64, NDS, Switch và các biến thể OPUS", id: "Audio Nintendo N64, NDS, Switch dan varian OPUS", hi: "N64, NDS, Switch Nintendo ऑडियो और OPUS वेरिएंट", th: "เสียง Nintendo N64, NDS, Switch และตัวแปร OPUS" }
  },
  {
    "id": "g16",
    "ext": [".oga", ".ogl", ".ogs", ".ogv", ".omu", ".oor", ".opu", ".opus", ".opusnx", ".opusx", ".osb", ".owp"],
    "desc": { zh: "OGG/OPUS开源音频，手游/跨平台游戏标配", en: "OGG/OPUS open-source audio, standard for mobile/cross-platform games", fr: "Audio open-source OGG/OPUS, standard pour les jeux mobiles/multi-plateforme", es: "Audio open-source OGG/OPUS, estándar para juegos móviles/multiplataforma", de: "OGG/OPUS Open-Source-Audio, Standard für Mobile/Cross-Platform-Spiele", ja: "OGG/OPUSオープンソースオーディオ、モバイル/クロスプラットフォームゲームの標準", ko: "OGG/OPUS 오픈소스 오디오, 모바일/크로스 플랫폼 게임의 표준", "zh-TW": "OGG/OPUS開源音訊，手遊/跨平台遊戲標配", ar: "صوت مفتوح المصدر OGG/OPUS، معيار الألعاب المحمولة/متعددة المنصات", ru: "OGG/OPUS аудио с открытым исходным кодом, стандарт для мобильных/кроссплатформенных игр", pt: "Áudio open-source OGG/OPUS, padrão para jogos mobile/multiplataforma", it: "Audio open-source OGG/OPUS, standard per giochi mobile/multipiattaforma", nl: "OGG/OPUS open-source audio, standaard voor mobiele/cross-platform games", pl: "OGG/OPUS open-source audio, standard dla gier mobilnych/wieloplatformowych", sv: "OGG/OPUS öppen källkod ljud, standard för mobila/plattformsoberoende spel", tr: "OGG/OPUS açık kaynak ses, mobil/çoklu platform oyunların standardı", vi: "Âm thanh mã nguồn mở OGG/OPUS, tiêu chuẩn cho game di động/đa nền tảng", id: "Audio open-source OGG/OPUS, standar untuk game mobile/lintas platform", hi: "OGG/OPUS ओपन-सोर्स ऑडियो, मोबाइल/क्रॉस-प्लेटफ़ॉर्म गेम का मानक", th: "เสียงโอเพ่นซอร์ส OGG/OPUS มาตรฐานสำหรับเกมมือถือ/ข้ามแพลตฟอร์ม" }
  },
  {
    "id": "g17",
    "ext": [".p1d", ".p2bt", ".p3d", ".paf", ".past", ".patch3audio", ".pbd", ".pcm", ".pdt", ".phd", /* ".pk", */ ".pona", ".pos", ".ps3", ".psb", ".psf", ".psh", ".psi", ".psn", ".ptd", ".pth", ".pwb", ".pxa"],
    "desc": { zh: "PCM原始音频、PS3/主机补丁音频、资源包", en: "PCM raw audio, PS3/console patch audio, resource packages", fr: "Audio brut PCM, audio de patch PS3/console, paquets de ressources", es: "Audio PCM sin procesar, audio de parche PS3/consola, paquetes de recursos", de: "PCM-Rohaudio, PS3/Konsolen-Patch-Audio, Ressourcenpakete", ja: "PCMローオーディオ、PS3/コンソールパッチオーディオ、リソースパッケージ", ko: "PCM 원시 오디오, PS3/콘솔 패치 오디오, 리소스 패키지", "zh-TW": "PCM原始音訊、PS3/主機補丁音訊、資源包", ar: "صوت PCM الخام وصوت تصحيح PS3/وحدة التحكم وحزم الموارد", ru: "PCM необработанный звук, патч-аудио PS3/консоли, пакеты ресурсов", pt: "Áudio PCM bruto, áudio de patch PS3/console, pacotes de recursos", it: "Audio PCM grezzo, audio patch PS3/console, pacchetti di risorse", nl: "PCM rauwe audio, PS3/console patch audio, resourcepakketten", pl: "PCM surowe audio, audio patchu PS3/konsoli, pakiety zasobów", sv: "PCM rå ljud, PS3/konsol patch ljud, resurspaket", tr: "PCM ham ses, PS3/konsol yama sesi, kaynak paketleri", vi: "Âm thanh PCM thô, âm thanh vá lỗi PS3/console, gói tài nguyên", id: "Audio mentah PCM, audio patch PS3/konsol, paket sumber daya", hi: "PCM कच्चा ऑडियो, PS3/कंसोल पैच ऑडियो, संसाधन पैकेज", th: "เสียง PCM ดิบ, เสียงแพตช์ PS3/คอนโซล, แพ็คเกจทรัพยากร" }
  },
  {
    "id": "g18",
    "ext": [/* ".r", */ ".rad", ".rak", ".ras", ".raw", ".rkv", ".rof", ".rpgmvo", ".rrds", ".rsd", ".rsf", ".rsm", ".rsnd", ".rsp", ".rstm", ".rwar", ".rwav", ".rws", ".rwsd", ".rwx"],
    "desc": { zh: "RAW原始音频、Wii/Wii U音频RSTM/RWAV系列", en: "RAW raw audio, Wii/Wii U RSTM/RWAV series audio", fr: "Audio brut RAW, audio de la série RSTM/RWAV pour Wii/Wii U", es: "Audio crudo RAW, audio de la serie RSTM/RWAV para Wii/Wii U", de: "RAW-Rohaudio, Wii/Wii U RSTM/RWAV-Serie Audio", ja: "RAWローオーディオ、Wii/Wii U RSTM/RWAVシリーズオーディオ", ko: "RAW 원시 오디오, Wii/Wii U RSTM/RWAV 시리즈 오디오", "zh-TW": "RAW原始音訊、Wii/Wii U音訊RSTM/RWAV系列", ar: "صوت RAW الخام وصوت Wii/Wii U من سلسلة RSTM/RWAV", ru: "RAW необработанный звук, аудио серии RSTM/RWAV для Wii/Wii U", pt: "Áudio bruto RAW, áudio da série RSTM/RWAV para Wii/Wii U", it: "Audio grezzo RAW, audio della serie RSTM/RWAV per Wii/Wii U", nl: "RAW rauwe audio, Wii/Wii U RSTM/RWAV serie audio", pl: "RAW surowe audio, audio serii RSTM/RWAV dla Wii/Wii U", sv: "RAW råljud, Wii/Wii U RSTM/RWAV serie ljud", tr: "RAW ham ses, Wii/Wii U RSTM/RWAV serisi sesi", vi: "Âm thanh thô RAW, âm thanh series RSTM/RWAV cho Wii/Wii U", id: "Audio mentah RAW, audio seri RSTM/RWAV untuk Wii/Wii U", hi: "RAW कच्चा ऑडियो, Wii/Wii U RSTM/RWAV श्रृंखला ऑडियो", th: "เสียง RAW ดิบ, เสียงซีรีส์ RSTM/RWAV สำหรับ Wii/Wii U" }
  },
  {
    "id": "g19",
    "ext": [".s14", ".s3v", ".sab", ".sad", ".saf", ".sap", ".sb0", ".sb1", ".sb2", ".sb3", ".sb4", ".sb5", ".sb6", ".sb7", ".sbao", ".sbin", ".sbk", ".sbr", ".sbs", ".sbv", /* ".sc", */ ".scd", ".sch", ".sd9", ".sdd", ".sdf", ".sdl", ".sdt", /* ".se", */ ".seb", ".sed", ".seg", ".sf0", ".sfa", ".sfl", ".sfs", ".sfx", ".sgb", ".sgd", ".sgh", ".sgt", ".shaa", ".shsa", ".skx", ".sli", ".sm0", ".sm1", ".sm2", ".sm3", ".sm4", ".sm5", ".sm6", ".sm7", ".smc", ".smh", ".smk", ".smp", ".smv", ".sn0", ".snb", ".snd", ".sng", ".sngw", ".snr", ".sns", ".snu", ".sob", ".sod", ".son", ".sounds", ".spc", ".spd", ".sph", ".spk", ".spm", ".sps", ".spsd", ".spsis14", ".spsis22", ".spt", ".spw", ".srcd", ".sre", ".srsa", ".ss2", ".ssf", ".ssm", ".ssp", ".sspr", ".sss", ".ste", ".ster", ".sth", ".stm", ".str", ".stream", ".strm", ".sts", ".sts_cp3", ".stx", ".svag", ".svg", ".svs", ".swag", ".swar", ".swav", ".swd", ".switch_audio", /* ".sx", */ ".sxd", ".sxd1", ".sxd2", ".sxd3", ".szd", ".szd1", ".szd2", ".szd3"],
    "desc": { zh: "超大量主机/手游音频：SPC、SND、SWAV、SVAG、流音频与音效资源", en: "Vast console/mobile game audio: SPC, SND, SWAV, SVAG, streaming and SFX resources", fr: "Vaste collection audio console/mobile : SPC, SND, SWAV, SVAG, streaming et ressources SFX", es: "Amplia colección de audio de consola/móvil: SPC, SND, SWAV, SVAG, streaming y recursos SFX", de: "Umfangreiche Konsolen/Mobile-Spielaudio: SPC, SND, SWAV, SVAG, Streaming und SFX-Ressourcen", ja: "大量のコンソール/モバイルゲームオーディオ：SPC、SND、SWAV、SVAG、ストリーミングとSFXリソース", ko: "방대한 콘솔/모바일 게임 오디오: SPC, SND, SWAV, SVAG, 스트리밍 및 SFX 리소스", "zh-TW": "超大量主機/手遊音訊：SPC、SND、SWAV、SVAG、串流音訊與音效資源", ar: "صوت ضخم لوحدات التحكم/الألعاب المحمولة: SPC وSND وSWAV وSVAG وموارد البث وSFX", ru: "Обширный звук консолей/мобильных игр: SPC, SND, SWAV, SVAG, стриминг и SFX ресурсы", pt: "Vasto áudio de consoles/jogos mobile: SPC, SND, SWAV, SVAG, streaming e recursos SFX", it: "Vastissimo audio console/giochi mobile: SPC, SND, SWAV, SVAG, streaming e risorse SFX", nl: "Uitgebreide console/mobiel spel audio: SPC, SND, SWAV, SVAG, streaming en SFX bronnen", pl: "Rozległe audio konsol/gier mobilnych: SPC, SND, SWAV, SVAG, streaming i zasoby SFX", sv: "Riklig konsol/mobilspel ljud: SPC, SND, SWAV, SVAG, streaming och SFX resurser", tr: "Geniş konsol/mobil oyun sesi: SPC, SND, SWAV, SVAG, akış ve SFX kaynakları", vi: "Kho âm thanh khổng lồ cho console/game di động: SPC, SND, SWAV, SVAG, streaming và tài nguyên SFX", id: "Audio konsol/game mobile yang sangat banyak: SPC, SND, SWAV, SVAG, streaming dan sumber daya SFX", hi: "विशाल कंसोल/मोबाइल गेम ऑडियो: SPC, SND, SWAV, SVAG, स्ट्रीमिंग और SFX संसाधन", th: "เสียงคอนโซล/เกมมือถือจำนวนมาก: SPC, SND, SWAV, SVAG, สตรีมมิ่งและทรัพยากร SFX" }
  },
  {
    "id": "g20",
    "ext": [".tad", ".tbl", ".tgq", ".tgv", ".thp", ".tmx", ".trk", ".tun", ".txth"],
    "desc": { zh: "视频音频复合、音轨、TXTH音频配置", en: "Video/audio composite, audio tracks, TXTH audio configuration", fr: "Composite vidéo/audio, pistes audio, configuration audio TXTH", es: "Compuesto de vídeo/audio, pistas de audio, configuración de audio TXTH", de: "Video/Audio-Verbund, Audiospuren, TXTH-Audiokonfiguration", ja: "ビデオ/オーディオ複合、オーディオトラック、TXTHオーディオ設定", ko: "비디오/오디오 복합, 오디오 트랙, TXTH 오디오 구성", "zh-TW": "影音複合、音軌、TXTH音訊配置", ar: "صوت/فيديو مركب ومسارات الصوت وإعداد الصوت TXTH", ru: "Видео/аудио композит, аудиодорожки, конфигурация TXTH-аудио", pt: "Composto de vídeo/áudio, faixas de áudio, configuração de áudio TXTH", it: "Composito video/audio, tracce audio, configurazione audio TXTH", nl: "Video/audio composiet, audiotracks, TXTH audio configuratie", pl: "Kompozyt wideo/audio, ścieżki audio, konfiguracja audio TXTH", sv: "Video/ljud komposit, ljudspår, TXTH ljudkonfiguration", tr: "Video/ses bileşik, ses parçaları, TXTH ses yapılandırması", vi: "Tổng hợp video/âm thanh, bản nhạc, cấu hình âm thanh TXTH", id: "Komposit video/audio, trek audio, konfigurasi audio TXTH", hi: "वीडियो/ऑडियो कंपोजिट, ऑडियो ट्रैक, TXTH ऑडियो कॉन्फ़िगरेशन", th: "คอมโพสิตวิดีโอ/เสียง, แทร็กเสียง, การกำหนดค่าเสียง TXTH" }
  },
  {
    "id": "g21",
    "ext": [".u0", ".ue4opus", ".ueba", ".um3", ".utk", /* ".uv", */],
    "desc": { zh: "UE4/UE5引擎音频、OPUS与定制封装", en: "UE4/UE5 engine audio, OPUS and custom containers", fr: "Audio de moteur UE4/UE5, OPUS et conteneurs personnalisés", es: "Audio de motor UE4/UE5, OPUS y contenedores personalizados", de: "UE4/UE5 Engine-Audio, OPUS und benutzerdefinierte Container", ja: "UE4/UE5エンジンオーディオ、OPUSとカスタムコンテナ", ko: "UE4/UE5 엔진 오디오, OPUS 및 커스텀 컨테이너", "zh-TW": "UE4/UE5引擎音訊、OPUS與定製封裝", ar: "صوت محرك UE4/UE5 وOPUS والحاويات المخصصة", ru: "Аудио движка UE4/UE5, OPUS и пользовательские контейнеры", pt: "Áudio do motor UE4/UE5, OPUS e contêineres personalizados", it: "Audio engine UE4/UE5, OPUS e contenitori personalizzati", nl: "UE4/UE5 engine audio, OPUS en aangepaste containers", pl: "Audio silnika UE4/UE5, OPUS i niestandardowe kontenery", sv: "UE4/UE5 motorljud, OPUS och anpassade containrar", tr: "UE4/UE5 motor sesi, OPUS ve özel konteynerler", vi: "Âm thanh engine UE4/UE5, OPUS và container tùy chỉnh", id: "Audio engine UE4/UE5, OPUS dan kontainer kustom", hi: "UE4/UE5 इंजन ऑडियो, OPUS और कस्टम कंटेनर", th: "เสียงเอนจิ้น UE4/UE5, OPUS และคอนเทนเนอร์กำหนดเอง" }
  },
  {
    "id": "g22",
    "ext": [/* ".v", */ ".v0", ".v1", ".va3", ".vab", ".vag", ".vai", ".vas", /* ".vb", */ ".vbk", ".vdm", ".vds", ".vgs", ".vgv", /* ".vh", */ ".vid", ".vig", ".vis", ".vms", ".voi", ".vp6", ".vpk", /* ".vs", */ ".vsf", ".vsv", ".vxn"],
    "desc": { zh: "PS1/PS2 VAG/VAB音频、老式游戏音视频", en: "PS1/PS2 VAG/VAB audio, legacy game audio/video", fr: "Audio PS1/PS2 VAG/VAB, audio/vidéo de jeux anciens", es: "Audio PS1/PS2 VAG/VAB, audio/vídeo de juegos antiguos", de: "PS1/PS2 VAG/VAB-Audio, ältere Spiel-Audio/Video", ja: "PS1/PS2 VAG/VABオーディオ、レガシーゲームの音声/映像", ko: "PS1/PS2 VAG/VAB 오디오, 레거시 게임 오디오/비디오", "zh-TW": "PS1/PS2 VAG/VAB音訊、老式遊戲影音", ar: "صوت PS1/PS2 VAG/VAB وصوت/فيديو الألعاب القديمة", ru: "PS1/PS2 VAG/VAB-аудио, аудио/видео устаревших игр", pt: "Áudio PS1/PS2 VAG/VAB, áudio/vídeo de jogos legados", it: "Audio PS1/PS2 VAG/VAB, audio/video di giochi legacy", nl: "PS1/PS2 VAG/VAB audio, legacy spel audio/video", pl: "PS1/PS2 VAG/VAB audio, starsze gry audio/wideo", sv: "PS1/PS2 VAG/VAB ljud, äldre spel ljud/video", tr: "PS1/PS2 VAG/VAB sesi, eski oyun ses/video", vi: "Âm thanh PS1/PS2 VAG/VAB, âm thanh/video game cũ", id: "Audio PS1/PS2 VAG/VAB, audio/video game lama", hi: "PS1/PS2 VAG/VAB ऑडियो, पुराने गेम ऑडियो/वीडियो", th: "เสียง PS1/PS2 VAG/VAB, เสียง/วิดีโอเกมเก่า" }
  },
  {
    "id": "g23",
    "ext": [/* ".w", */ ".waa", ".wac", ".wad", ".waf", ".wam", ".was", ".wav", ".wavc", ".wave", ".wavebatch", ".wavm", ".wax", ".way", /* ".wb", */ ".wb2", ".wbd", ".wbh", ".wbk", /* ".wd", */ ".wem", ".wh2", ".whd", ".wma", ".wp2", ".wpd", ".wsd", ".wsi", ".wua", ".wv2", ".wv6", ".wve", ".wvs", ".wvx", ".wxd", ".wxh", ".wxv"],
    "desc": { zh: "WAV/WMA通用音频、Wwise WEM、各引擎音频封装", en: "WAV/WMA general audio, Wwise WEM, various engine audio containers", fr: "Audio général WAV/WMA, Wwise WEM, conteneurs audio pour divers moteurs", es: "Audio general WAV/WMA, Wwise WEM, contenedores de audio para varios motores", de: "WAV/WMA allgemeines Audio, Wwise WEM, verschiedene Engine-Audiocontainer", ja: "WAV/WMA汎用オーディオ、Wwise WEM、各エンジンのオーディオコンテナ", ko: "WAV/WMA 일반 오디오, Wwise WEM, 다양한 엔진 오디오 컨테이너", "zh-TW": "WAV/WMA通用音訊、Wwise WEM、各引擎音訊封裝", ar: "صوت عام WAV/WMA وWwise WEM وحاويات صوتية لمختلف المحركات", ru: "WAV/WMA общий звук, Wwise WEM, контейнеры аудио различных движков", pt: "Áudio geral WAV/WMA, Wwise WEM, contêineres de áudio para vários motores", it: "Audio generale WAV/WMA, Wwise WEM, contenitori audio per vari engine", nl: "WAV/WMA algemene audio, Wwise WEM, diverse engine-audiocontainers", pl: "WAV/WMA ogólne audio, Wwise WEM, kontenery audio różnych silników", sv: "WAV/WMA allmänt ljud, Wwise WEM, diverse motorljudcontainrar", tr: "WAV/WMA genel ses, Wwise WEM, çeşitli motor ses konteynerleri", vi: "Âm thanh chung WAV/WMA, Wwise WEM, container âm thanh cho các engine", id: "Audio umum WAV/WMA, Wwise WEM, kontainer audio berbagai engine", hi: "WAV/WMA सामान्य ऑडियो, Wwise WEM, विभिन्न इंजन ऑडियो कंटेनर", th: "เสียงทั่วไป WAV/WMA, Wwise WEM, คอนเทนเนอร์เสียงสำหรับเอนจิ้นต่างๆ" }
  },
  {
    "id": "g24",
    "ext": [/* ".x", */ ".x360audio", /* ".xa", */ ".xa2", ".xa30", ".xai", ".xau", ".xav", ".xbd", ".xbw", ".xen", ".xhd", ".xma", ".xma2", ".xmd", ".xms", ".xmu", ".xmv", ".xna", ".xnb", ".xopus", ".xps", ".xsd", ".xse", ".xsew", ".xsf", ".xsh", ".xss", ".xst", ".xvag", ".xwav", ".xwb", ".xwc", ".xwh", ".xwm", ".xwma", ".xws", ".xwv"],
    "desc": { zh: "Xbox 360 XMA、XNA音频、跨平台专用格式", en: "Xbox 360 XMA, XNA audio, cross-platform proprietary formats", fr: "Audio Xbox 360 XMA, XNA, formats propriétaires multi-plateforme", es: "Audio Xbox 360 XMA, XNA, formatos propietarios multiplataforma", de: "Xbox 360 XMA, XNA-Audio, plattformübergreifende proprietäre Formate", ja: "Xbox 360 XMA、XNAオーディオ、クロスプラットフォーム専用フォーマット", ko: "Xbox 360 XMA, XNA 오디오, 크로스 플랫폼 전용 포맷", "zh-TW": "Xbox 360 XMA、XNA音訊、跨平台專用格式", ar: "صوت Xbox 360 XMA وXNA وتنسيقات خاصة متعددة المنصات", ru: "Xbox 360 XMA, XNA-аудио, кросс-платформенные проприетарные форматы", pt: "Áudio Xbox 360 XMA, XNA, formatos proprietários multiplataforma", it: "Audio Xbox 360 XMA, XNA, formati proprietari multipiattaforma", nl: "Xbox 360 XMA, XNA audio, cross-platform eigen formaten", pl: "Xbox 360 XMA, XNA audio, własne formaty na wiele platform", sv: "Xbox 360 XMA, XNA ljud, plattformsoberoende proprietära format", tr: "Xbox 360 XMA, XNA sesi, çapraz platform tescilli formatlar", vi: "Âm thanh Xbox 360 XMA, XNA, định dạng độc quyền đa nền tảng", id: "Audio Xbox 360 XMA, XNA, format proprietary lintas platform", hi: "Xbox 360 XMA, XNA ऑडियो, क्रॉस-प्लेटफ़ॉर्म प्रोपराइटरी प्रारूप", th: "เสียง Xbox 360 XMA, XNA, รูปแบบเฉพาะข้ามแพลตฟอร์ม" }
  },
  {
    "id": "g25",
    "ext": [".ydsp", ".ymf", ".zic", ".zsd", ".zsm", ".zss", ".zwv"],
    "desc": { zh: "Yamaha音频、DSP、压缩/加密收尾音频格式", en: "Yamaha audio, DSP, compressed/encrypted end audio formats", fr: "Audio Yamaha, DSP, formats audio compressés/chiffrés de fin", es: "Audio Yamaha, DSP, formatos de audio comprimidos/cifrados finales", de: "Yamaha-Audio, DSP, komprimierte/verschlüsselte End-Audioformate", ja: "Yamahaオーディオ、DSP、圧縮/暗号化されたエンドオーディオフォーマット", ko: "Yamaha 오디오, DSP, 압축/암호화된 최종 오디오 포맷", "zh-TW": "Yamaha音訊、DSP、壓縮/加密收尾音訊格式", ar: "صوت Yamaha وDSP وتنسيقات الصوت النهائية المضغوطة/المشفرة", ru: "Yamaha-аудио, DSP, сжатые/зашифрованные конечные аудиоформаты", pt: "Áudio Yamaha, DSP, formatos de áudio finais comprimidos/criptografados", it: "Audio Yamaha, DSP, formati audio finali compressi/cifrati", nl: "Yamaha audio, DSP, gecomprimeerde/versleutelde eindige audioformaten", pl: "Audio Yamaha, DSP, skompresowane/zaszyfrowane końcowe formaty audio", sv: "Yamaha ljud, DSP, komprimerade/krypterade slut ljudformat", tr: "Yamaha sesi, DSP, sıkıştırılmış/şifreli son ses formatları", vi: "Âm thanh Yamaha, DSP, định dạng âm thanh cuối được nén/mã hóa", id: "Audio Yamaha, DSP, format audio akhir terkompresi/terenkripsi", hi: "Yamaha ऑडियो, DSP, संपीड़ित/एन्क्रिप्टेड अंत ऑडियो प्रारूप", th: "เสียง Yamaha, DSP, รูปแบบเสียงสิ้นสุดที่บีบอัด/เข้ารหัส" }
  }
]

const ffmpegFormats: Record<string, AudioFormat> = {
  wav: {
    desc: { zh: 'WAV 是微软开发的无损音频格式，音质完美无损，但文件体积较大，适合专业录音与编辑', en: 'WAV is a lossless audio format developed by Microsoft with perfect audio quality, suitable for professional recording and editing', fr: 'WAV est un format audio sans perte développé par Microsoft, idéal pour l\'enregistrement et l\'édition professionnels', es: 'WAV es un formato de audio sin pérdida desarrollado por Microsoft, ideal para grabación y edición profesionales', de: 'WAV ist ein verlustfreies Audioformat von Microsoft, ideal für professionelle Aufnahmen und Bearbeitung', ja: 'WAVはMicrosoftが開発した可逆圧縮音声フォーマットで、完璧な音質を持ち専門的な録音・編集に適しています', ko: 'WAV는 Microsoft가 개발한 무손실 오디오 포맷으로 완벽한 음질을 제공하며 전문 녹음 및 편집에 적합합니다', 'zh-TW': 'WAV 是微軟開發的無損音訊格式，音質完美無損，適合專業錄音與編輯', ar: 'WAV هو تنسيق صوتي بدون فقدان طورته Microsoft، مثالي للتسجيل والتحرير الاحترافي', ru: 'WAV — несжатый аудиоформат от Microsoft с идеальным качеством звука, подходит для профессиональной записи и редактирования', pt: 'WAV é um formato de áudio sem perdas desenvolvido pela Microsoft, adequado para gravação e edição profissional', it: 'WAV è un formato audio lossless sviluppato da Microsoft, ideale per registrazione ed editing professionale', nl: 'WAV is een verliesvrij audioformaat ontwikkeld door Microsoft, geschikt voor professionele opname en bewerking', pl: 'WAV to bezstratny format audio opracowany przez Microsoft, odpowiedni do profesjonalnego nagrywania i edycji', sv: 'WAV är ett förlustfritt ljudformat utvecklat av Microsoft, lämpligt för professionell inspelning och redigering', tr: 'WAV, Microsoft tarafından geliştirilen kayıpsız bir ses formatıdır, profesyonel kayıt ve düzenleme için uygundur', vi: 'WAV là định dạng âm thanh không mất dữ liệu do Microsoft phát triển, phù hợp cho ghi âm và chỉnh sửa chuyên nghiệp', id: 'WAV adalah format audio lossless yang dikembangkan oleh Microsoft, cocok untuk perekaman dan pengeditan profesional', hi: 'WAV Microsoft द्वारा विकसित एक लॉसलेस ऑडियो फ़ॉर्मेट है, पेशेवर रिकॉर्डिंग और संपादन के लिए उपयुक्त', th: 'WAV คือรูปแบบเสียงไม่สูญเสียข้อมูลที่พัฒนาโดย Microsoft เหมาะสำหรับการบันทึกและแก้ไขระดับมืออาชีพ' },
    decoders: ['ffmpeg'],
    encoders: ['ffmpeg'],
  },
  mp3: {
    desc: { zh: 'MP3（MPEG-1 Audio Layer III）是最流行的有损压缩音频格式，兼容性极强，适合日常音乐播放', en: 'MP3 (MPEG-1 Audio Layer III) is the most popular lossy audio format, highly compatible and ideal for everyday music playback', fr: 'MP3 (MPEG-1 Audio Layer III) est le format audio compressé le plus populaire, très compatible et idéal pour la lecture musicale quotidienne', es: 'MP3 (MPEG-1 Audio Layer III) es el formato de audio con pérdida más popular, muy compatible e ideal para reproducción musical diaria', de: 'MP3 (MPEG-1 Audio Layer III) ist das beliebteste verlustbehaftete Audioformat, hochkompatibel und ideal für die tägliche Musikwiedergabe', ja: 'MP3（MPEG-1 Audio Layer III）は最も普及している有損圧縮フォーマットで互換性が高く、日常の音楽再生に最適です', ko: 'MP3(MPEG-1 Audio Layer III)는 가장 인기 있는 손실 압축 오디오 포맷으로 호환성이 뛰어나 일상 음악 재생에 적합합니다', 'zh-TW': 'MP3（MPEG-1 Audio Layer III）是最流行的有損壓縮音訊格式，兼容性極強，適合日常音樂播放', ar: 'MP3 (MPEG-1 Audio Layer III) هو تنسيق الصوت المضغوط الأكثر شيوعاً، متوافق للغاية ومثالي لتشغيل الموسيقى اليومية', ru: 'MP3 (MPEG-1 Audio Layer III) — самый популярный формат аудио с потерями, отлично совместимый и идеальный для повседневного воспроизведения музыки', pt: 'MP3 (MPEG-1 Audio Layer III) é o formato de áudio comprimido mais popular, altamente compatível e ideal para reprodução musical diária', it: 'MP3 (MPEG-1 Audio Layer III) è il formato audio con perdita più popolare, altamente compatibile e ideale per la riproduzione musicale quotidiana', nl: 'MP3 (MPEG-1 Audio Layer III) is het meest populaire verliesgevende audioformaat, zeer compatibel en ideaal voor dagelijkse muziekweergave', pl: 'MP3 (MPEG-1 Audio Layer III) to najpopularniejszy format audio stratny, wysoce kompatybilny i idealny do codziennego odtwarzania muzyki', sv: 'MP3 (MPEG-1 Audio Layer III) är det mest populära förlustbara ljudformatet, mycket kompatibelt och idealiskt för daglig musikuppspelning', tr: 'MP3 (MPEG-1 Audio Layer III), en popüler kayıplı ses formatıdır, yüksek uyumlu ve günlük müzik çalma için idealdir', vi: 'MP3 (MPEG-1 Audio Layer III) là định dạng âm thanh nén mất dữ liệu phổ biến nhất, tương thích cao và lý tưởng cho nghe nhạc hàng ngày', id: 'MP3 (MPEG-1 Audio Layer III) adalah format audio lossy paling populer, sangat kompatibel dan ideal untuk pemutaran musik sehari-hari', hi: 'MP3 (MPEG-1 Audio Layer III) सबसे लोकप्रिय लॉसी ऑडियो फ़ॉर्मेट है, अत्यधिक संगत और दैनिक संगीत प्लेबैक के लिए आदर्श', th: 'MP3 (MPEG-1 Audio Layer III) คือรูปแบบเสียงแบบสูญเสียข้อมูลที่ได้รับความนิยมสูงสุด ใช้งานร่วมกันได้ดีและเหมาะสำหรับการเล่นเพลงประจำวัน' },
    decoders: ['ffmpeg'],
    encoders: ['ffmpeg'],
  },
  ogg: {
    "desc": { zh: "OGG/OPUS开源音频，手游/跨平台游戏标配", en: "OGG/OPUS open-source audio, standard for mobile/cross-platform games", fr: "Audio open-source OGG/OPUS, standard pour les jeux mobiles/multi-plateforme", es: "Audio open-source OGG/OPUS, estándar para juegos móviles/multiplataforma", de: "OGG/OPUS Open-Source-Audio, Standard für Mobile/Cross-Platform-Spiele", ja: "OGG/OPUSオープンソースオーディオ、モバイル/クロスプラットフォームゲームの標準", ko: "OGG/OPUS 오픈소스 오디오, 모바일/크로스 플랫폼 게임의 표준", "zh-TW": "OGG/OPUS開源音訊，手遊/跨平台遊戲標配", ar: "صوت مفتوح المصدر OGG/OPUS، معيار الألعاب المحمولة/متعددة المنصات", ru: "OGG/OPUS аудио с открытым исходным кодом, стандарт для мобильных/кроссплатформенных игр", pt: "Áudio open-source OGG/OPUS, padrão para jogos mobile/multiplataforma", it: "Audio open-source OGG/OPUS, standard per giochi mobile/multipiattaforma", nl: "OGG/OPUS open-source audio, standaard voor mobiele/cross-platform games", pl: "OGG/OPUS open-source audio, standard dla gier mobilnych/wieloplatformowych", sv: "OGG/OPUS öppen källkod ljud, standard för mobila/plattformsoberoende spel", tr: "OGG/OPUS açık kaynak ses, mobil/çoklu platform oyunların standardı", vi: "Âm thanh mã nguồn mở OGG/OPUS, tiêu chuẩn cho game di động/đa nền tảng", id: "Audio open-source OGG/OPUS, standar untuk game mobile/lintas platform", hi: "OGG/OPUS ओपन-सोर्स ऑडियो, मोबाइल/क्रॉस-प्लेटफ़ॉर्म गेम का मानक", th: "เสียงโอเพ่นซอร์ส OGG/OPUS มาตรฐานสำหรับเกมมือถือ/ข้ามแพลตฟอร์ม" },
    decoders: ['ffmpeg'],
    encoders: ['ffmpeg'],
  },
}

export const audioFormats: Record<string, AudioFormat> = {}

for (const group of groupedAudioSourceFormats) {
  for (const ext of group.ext) {
    const format = ext.replace(/^\./, '').trim()
    if (!format || audioFormats[format]) {
      continue
    }

    audioFormats[format] = {
      desc: group.desc,
      decoders: ['vgmstream'],
    }
  }
}

Object.assign(audioFormats, ffmpegFormats)

export const vgmstreamExtGroups: readonly string[][] = groupedAudioSourceFormats.map(g => g.ext)

export interface RouteParams {
  source: string
  target: string
  sourceLabel: string
  targetLabel: string
  sourceDesc: string
  targetDesc: string
  title: string
  description: string
  keywords: string
  hidden?: boolean
}

export interface Pipeline {
  type: PipelineType
}

/**
 * 解析 source -> target 的转换管道
 */
export function resolvePipeline (
  source: string,
  target: string,
  formats: Record<string, AudioFormat> = audioFormats,
): Pipeline | null {
  if (source === target) return null

  const src = formats[source]
  const tgt = formats[target]

  if (!src || !tgt) return null

  // 1) ffmpeg 可直接解码 source 且可编码 target
  if (src.decoders?.includes('ffmpeg') && tgt.encoders?.includes('ffmpeg')) {
    return { type: 'direct-ffmpeg' }
  }

  // 2) source 只能由 vgmstream 解码，后续经 wav 用 ffmpeg 编码目标格式
  if (src.decoders?.includes('vgmstream') && tgt.encoders?.includes('ffmpeg')) {
    return { type: 'vgmstream+ffmpeg' }
  }

  return null
}

const routeTargets = Object.keys(ffmpegFormats)

/**
 * 各语言 SEO 元数据模板，{source} 和 {target} 为占位符
 */
export const metaTemplates: Record<LangCode, { title: string; description: string; keywords: string }> = {
  zh: {
    title: '免费在线批量 {source} 转 {target} - 极速转换，无需安装软件',
    description: '在线将 {source} 转为 {target}，免费，无需下载软件，无需上传服务器，支持批量转换，极速处理，高质量音频直接下载，安全又私密。',
    keywords: '{source}转{target},{source} to {target},在线{source}转{target},免费音频转换器,批量{source}转{target},无需上传,高速转换,在线批量音频转换,安全私密音频转换',
  },
  en: {
    title: 'Free Online {source} to {target} Converter - Fast, No Software Required',
    description: 'Convert {source} to {target} online for free. No software download needed, no server upload required. Supports batch conversion with high-quality audio output, fast and secure.',
    keywords: '{source} to {target},convert {source} to {target},online {source} to {target} converter,free audio converter,batch {source} to {target},no upload required,fast conversion,online audio conversion',
  },
  fr: {
    title: 'Convertisseur {source} vers {target} gratuit en ligne - Rapide, sans logiciel',
    description: 'Convertissez {source} en {target} en ligne gratuitement. Aucun téléchargement requis, pas d\'envoi vers un serveur. Conversion par lots, traitement rapide, téléchargement audio haute qualité.',
    keywords: '{source} vers {target},convertir {source} en {target},convertisseur {source} {target} en ligne,convertisseur audio gratuit,conversion par lots {source} {target}',
  },
  es: {
    title: 'Convertidor gratuito en línea de {source} a {target} - Rápido, sin software',
    description: 'Convierte {source} a {target} en línea gratis. Sin descarga de software, sin subida a servidores. Soporta conversión por lotes, procesamiento rápido, descarga de audio de alta calidad.',
    keywords: '{source} a {target},convertir {source} a {target},convertidor {source} {target} en línea,convertidor de audio gratis,conversión por lotes {source} {target}',
  },
  de: {
    title: 'Kostenloser Online {source} zu {target} Konverter - Schnell, keine Software nötig',
    description: '{source} online kostenlos in {target} umwandeln. Keine Software nötig, kein Server-Upload. Unterstützt Stapelkonvertierung, Schnellverarbeitung, hochqualitatives Audio.',
    keywords: '{source} zu {target},{source} in {target} umwandeln,online {source} {target} konverter,kostenloser Audiokonverter,Stapel {source} {target}',
  },
  ja: {
    title: '無料オンライン {source} から {target} 変換 - 高速、ソフト不要',
    description: '{source} を {target} にオンラインで無料変換。ソフト不要、サーバーアップロード不要。バッチ変換対応、高速処理、高音質でダウンロード。',
    keywords: '{source}から{target}変換,{source} to {target},オンライン{source}{target}変換,無料音声変換,バッチ{source}{target}変換',
  },
  ko: {
    title: '무료 온라인 {source}를 {target}로 변환 - 빠르고 소프트웨어 불필요',
    description: '{source}를 {target}로 온라인에서 무료로 변환하세요. 소프트웨어 다운로드 불필요, 서버 업로드 불필요. 일괄 변환 지원, 빠른 처리, 고품질 오디오 다운로드.',
    keywords: '{source}를 {target}로,{source} to {target},온라인 {source} {target} 변환기,무료 오디오 변환기,일괄 {source} {target} 변환',
  },
  'zh-TW': {
    title: '免費線上批量 {source} 轉 {target} - 極速轉換，無需安裝軟體',
    description: '線上將 {source} 轉為 {target}，免費，無需下載軟體，無需上傳伺服器，支援批量轉換，極速處理，高品質音訊直接下載，安全又私密。',
    keywords: '{source}轉{target},{source} to {target},線上{source}轉{target},免費音訊轉換器,批量{source}轉{target},無需上傳,高速轉換,線上批量音訊轉換',
  },
  ar: {
    title: 'محوّل {source} إلى {target} مجاني عبر الإنترنت - سريع، بدون برنامج',
    description: 'حوّل {source} إلى {target} مجاناً عبر الإنترنت. لا حاجة لتنزيل برنامج أو رفع الملفات. يدعم التحويل الجماعي، سريع ومأمون.',
    keywords: '{source} إلى {target},تحويل {source} إلى {target},محوّل {source} {target} أونلاين,محوّل صوتي مجاني,تحويل جماعي {source} {target}',
  },
  ru: {
    title: 'Бесплатный онлайн-конвертер {source} в {target} - Быстро, без программ',
    description: 'Конвертируйте {source} в {target} онлайн бесплатно. Не нужно скачивать ПО и загружать на сервер. Пакетная конвертация, быстрая обработка, высококачественный звук.',
    keywords: '{source} в {target},конвертировать {source} в {target},онлайн конвертер {source} {target},бесплатный конвертер аудио,пакетный {source} {target}',
  },
  pt: {
    title: 'Conversor gratuito online de {source} para {target} - Rápido, sem software',
    description: 'Converta {source} para {target} online gratuitamente. Sem download de software, sem upload para servidor. Suporta conversão em lote, processamento rápido, áudio de alta qualidade.',
    keywords: '{source} para {target},converter {source} para {target},conversor {source} {target} online,conversor de áudio grátis,conversão em lote {source} {target}',
  },
  it: {
    title: 'Convertitore gratuito online da {source} a {target} - Veloce, senza software',
    description: 'Converti {source} in {target} online gratuitamente. Nessun software da scaricare, nessun caricamento su server. Supporta conversione in batch, veloce, alta qualità.',
    keywords: '{source} in {target},convertire {source} in {target},convertitore {source} {target} online,convertitore audio gratuito,batch {source} {target}',
  },
  nl: {
    title: 'Gratis online {source} naar {target} converter - Snel, geen software nodig',
    description: 'Converteer {source} naar {target} online gratis. Geen software nodig, geen server-upload. Ondersteunt batch-conversie, snel en veilig, hoge audiokwaliteit.',
    keywords: '{source} naar {target},{source} naar {target} converteren,online {source} {target} converter,gratis audioconverter,batch {source} {target}',
  },
  pl: {
    title: 'Bezpłatny konwerter online {source} na {target} - Szybko, bez oprogramowania',
    description: 'Konwertuj {source} na {target} online za darmo. Bez pobierania oprogramowania, bez przesyłania na serwer. Obsługuje konwersję wsadową, szybko i bezpiecznie.',
    keywords: '{source} na {target},konwertuj {source} na {target},konwerter {source} {target} online,darmowy konwerter audio,wsadowy {source} {target}',
  },
  sv: {
    title: 'Gratis online {source} till {target} konverterare - Snabb, ingen programvara krävs',
    description: 'Konvertera {source} till {target} online gratis. Ingen nedladdning behövs, ingen serveruppladdning. Stöder batchkonvertering, snabb och säker.',
    keywords: '{source} till {target},konvertera {source} till {target},online {source} {target} konverterare,gratis ljudkonverterare,batch {source} {target}',
  },
  tr: {
    title: 'Ücretsiz çevrimiçi {source}\'den {target}\'a dönüştürücü - Hızlı, yazılım gerektirmez',
    description: '{source}\'yi {target}\'a çevrimiçi ücretsiz dönüştürün. Yazılım indirmeye gerek yok, sunucu yüklemesi gerekmez. Toplu dönüşümü destekler, hızlı ve güvenli.',
    keywords: '{source} {target} dönüştürücü,{source}\'den {target}\'a,çevrimiçi {source} {target} dönüştürücü,ücretsiz ses dönüştürücü,toplu {source} {target}',
  },
  vi: {
    title: 'Chuyển đổi {source} sang {target} miễn phí trực tuyến - Nhanh, không cần phần mềm',
    description: 'Chuyển đổi {source} sang {target} trực tuyến miễn phí. Không cần tải phần mềm, không cần tải lên server. Hỗ trợ chuyển đổi hàng loạt, xử lý nhanh, chất lượng âm thanh cao.',
    keywords: '{source} sang {target},chuyển đổi {source} sang {target},công cụ chuyển {source} {target} online,chuyển đổi âm thanh miễn phí,hàng loạt {source} {target}',
  },
  id: {
    title: 'Konverter {source} ke {target} gratis online - Cepat, tanpa software',
    description: 'Konversi {source} ke {target} secara online gratis. Tidak perlu unduh software, tidak perlu upload ke server. Mendukung konversi massal, cepat dan aman.',
    keywords: '{source} ke {target},konversi {source} ke {target},konverter {source} {target} online,konverter audio gratis,batch {source} {target}',
  },
  hi: {
    title: 'मुफ्त ऑनलाइन {source} से {target} कनवर्टर - तेज़, कोई सॉफ्टवेयर नहीं',
    description: '{source} को {target} में ऑनलाइन मुफ्त में कनवर्ट करें। कोई सॉफ्टवेयर डाउनलोड नहीं, कोई सर्वर अपलोड नहीं। बल्क कनवर्जन, तेज़ प्रोसेसिंग, उच्च गुणवत्ता।',
    keywords: '{source} से {target},{source} to {target},ऑनलाइन {source} {target} कनवर्टर,मुफ्त ऑडियो कनवर्टर,बल्क {source} {target}',
  },
  th: {
    title: 'แปลง {source} เป็น {target} ฟรีออนไลน์ - เร็ว ไม่ต้องติดตั้งซอฟต์แวร์',
    description: 'แปลง {source} เป็น {target} ออนไลน์ฟรี ไม่ต้องดาวน์โหลดซอฟต์แวร์ ไม่ต้องอัพโหลดเซิร์ฟเวอร์ รองรับการแปลงเป็นชุด เร็วและปลอดภัย',
    keywords: '{source} เป็น {target},แปลง {source} เป็น {target},ตัวแปลง {source} {target} ออนไลน์,ตัวแปลงเสียงฟรี,แปลงเป็นชุด {source} {target}',
  },
}

function applyMetaTemplate (
  tpl: { title: string; description: string; keywords: string },
  source: string,
  target: string,
) {
  const replace = (s: string) => s.replace(/\{source\}/g, source).replace(/\{target\}/g, target)
  return { title: replace(tpl.title), description: replace(tpl.description), keywords: replace(tpl.keywords) }
}

export function generateAudioRoutes (lang: LangCode) {
  const tpl = metaTemplates[lang]

  return () => {
    const groupedRoutes =
      groupedAudioSourceFormats.flatMap(group => {
        const sourceFormats = [...new Set(group.ext.map(ext => ext.replace(/^\./, '').trim()).filter(Boolean))]

        return routeTargets.flatMap(target => {
          const validSources = sourceFormats.filter(source => resolvePipeline(source, target, audioFormats))
          if (!validSources.length) return []

          const tgt = audioFormats[target]
          const source = group.id
          const sourceLabel = validSources.join(', ')
          const params: RouteParams = {
            source,
            target,
            sourceLabel,
            targetLabel: target,
            sourceDesc: group.desc[lang],
            targetDesc: tgt.desc[lang],
            ...applyMetaTemplate(tpl, sourceLabel, target),
          }

          return [{ params }]
        })
      })

    const ffmpegRoutes = Object.keys(ffmpegFormats).flatMap(source =>
      Object.keys(ffmpegFormats).flatMap(target => {
        if (!resolvePipeline(source, target, audioFormats)) return []

        const src = audioFormats[source]
        const tgt = audioFormats[target]
        const params: RouteParams = {
          source,
          target,
          sourceLabel: source,
          targetLabel: target,
          sourceDesc: src.desc[lang],
          targetDesc: tgt.desc[lang],
          ...applyMetaTemplate(tpl, source, target),
        }
        return [{ params }]
      })
    )

    return [...ffmpegRoutes, ...groupedRoutes, ]
  }
}

export default {
  paths: generateAudioRoutes('zh'),
}