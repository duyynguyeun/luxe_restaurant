import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setLang('vi')}
        aria-label="Tiếng Việt"
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all focus:ring-2 focus:ring-amber-300 ${lang === 'vi' ? 'bg-amber-400 text-[#174C34]' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        <span className="text-sm">🇻🇳</span>
        <span className="hidden sm:inline">VI</span>
      </button>

      <button
        onClick={() => setLang('en')}
        aria-label="English"
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all focus:ring-2 focus:ring-amber-300 ${lang === 'en' ? 'bg-amber-400 text-[#174C34]' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        <span className="text-sm">🇺🇸</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
