import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ru from "./locales/ru";

export const lng = getLocales()[0].languageCode ?? "en";

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en,
    ru,
  },
  lng,
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
  interpolation: {
    escapeValue: false,
  },
});
