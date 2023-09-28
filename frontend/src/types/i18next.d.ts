import "i18next"
import enTranslations from "../i18n/en_GB/translations.json"

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false
    defaultNS: "translations"
    resources: {
      translation: typeof enTranslations
    }
  }
}
