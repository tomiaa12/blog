export type LangCode =
  | 'zh' | 'en' | 'ar' | 'de' | 'es' | 'fr' | 'hi' | 'id'
  | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sv'
  | 'th' | 'tr' | 'vi' | 'zh-TW'

export type I18nString = Record<LangCode, string>
