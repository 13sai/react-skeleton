export type I18nKey = 'zh-CN' | 'en-US'

export type I18nVal = Record<string, string>

export type I18n = {
  [key in I18nKey]?: I18nVal;
}
