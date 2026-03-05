import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../locales/fr/translation.json';
import en from '../locales/en/translation.json';
import ro from '../locales/ro/translation.json';

const savedLang = localStorage.getItem('portfolio-lang') || 'fr';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ro: { translation: ro },
  },
  lng: savedLang,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('portfolio-lang', lng);
  document.documentElement.lang = lng;
});

export default i18n;
