import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enGBTranslations from "./en_GB/translations.json"
import nlBETranslations from "./nl_BE/translations.json"

export enum Locales {
  EN_GB = "en_GB",
  NL_BE = "nl_BE",
}

await i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  returnNull: false,
  fallbackLng: Locales.EN_GB,
  resources: {
    [Locales.EN_GB]: { translation: enGBTranslations },
    [Locales.NL_BE]: { translation: nlBETranslations },
  },
})

await i18n.changeLanguage(Locales.EN_GB)

export default i18n
