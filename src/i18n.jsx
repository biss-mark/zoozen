import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';

i18n
  .use(LanguageDetector) // Détecte la langue du navigateur automatiquement
  .use(initReactI18next) // Lie i18next à React
  .init({
    resources: {
      fr: { translation: translationFR },
      en: { translation: translationEN }
    },
    fallbackLng: "fr", // Langue par défaut si la détection échoue
    interpolation: { escapeValue: false }
  });

export default i18n;