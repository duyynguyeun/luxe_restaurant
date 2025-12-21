import React, { createContext, useContext, useEffect, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem('app_lang');
      return stored || 'vi';
    } catch (e) {
      return 'vi';
    }
  });

  useEffect(() => {
    try { localStorage.setItem('app_lang', lang); } catch (e) {}
  }, [lang]);

  const t = (key) => {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
