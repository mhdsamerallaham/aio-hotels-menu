import { create } from 'zustand';

const STORAGE_KEY = 'aio_coffee_language';

const getSavedLanguage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
};

const useLanguageStore = create((set) => {
  const savedLang = getSavedLanguage();

  return {
    language: savedLang || 'tr', // Default to 'tr' if not set, but modal will prompt if savedLang is null
    isLanguageSelected: Boolean(savedLang),
    isLanguageModalOpen: !savedLang, // Show modal if no language is saved in storage

    setLanguage: (lang) => {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.error(e);
      }
      set({
        language: lang,
        isLanguageSelected: true,
        isLanguageModalOpen: false,
      });
    },

    openLanguageModal: () => set({ isLanguageModalOpen: true }),
    closeLanguageModal: () => set({ isLanguageModalOpen: false }),
  };
});

export default useLanguageStore;
