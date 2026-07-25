import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ru from "./locales/ru";

export { useTranslation } from "react-i18next";

const supportedLngs = ["en", "ru"];
const lngCode = getLocales()[0].languageCode ?? "en";

export const lng = supportedLngs.includes(lngCode) ? lngCode : "en";

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
  },
  lng,
  fallbackLng: "en",
  supportedLngs,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
