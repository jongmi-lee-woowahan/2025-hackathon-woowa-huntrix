import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ko from './locales/ko'

// Type-define 'en' as the master schema for the resource
type MessageSchema = typeof en

const messages = {
  en,
  ko
}

const i18n = createI18n<[MessageSchema], 'en' | 'ko'>({
  legacy: false,
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages,
  globalInjection: true // Enable global $t
})

export default i18n
