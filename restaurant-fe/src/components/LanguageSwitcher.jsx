import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageProvider';

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Chuyển đổi ngôn ngữ"
      title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-400/50 text-white transition-all duration-300 cursor-pointer group shadow-xs ${className}`}
    >
      <FaGlobe className="text-base text-amber-300 group-hover:rotate-45 transition-transform duration-500" />
      <span className="font-bold text-xs tracking-wider uppercase">
        {lang === 'vi' ? 'VI' : 'EN'}
      </span>
      <span className="text-xs opacity-80">
        {lang === 'vi' ? '🇻🇳' : '🇺🇸'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
