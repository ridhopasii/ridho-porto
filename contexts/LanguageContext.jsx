'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    nav: {
      beranda: 'Beranda',
      proyek: 'Proyek',
      blog: 'Blog',
      gallery: 'Galeri',
      pencapaian: 'Pencapaian',
      kontak: 'Kontak',
      produktif: 'Produktivitas'
    },
    hero: {
      viewPortfolio: 'Lihat Portofolio',
      downloadCV: 'Unduh CV'
    }
  },
  en: {
    nav: {
      beranda: 'Home',
      proyek: 'Projects',
      blog: 'Blog',
      gallery: 'Gallery',
      pencapaian: 'Achievements',
      kontak: 'Contact',
      produktif: 'Productivity'
    },
    hero: {
      viewPortfolio: 'View Portfolio',
      downloadCV: 'Download CV'
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'id') {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'id' ? 'en' : 'id';
    setLang(next);
    localStorage.setItem('language', next);
  };

  const t = (key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      if (val[k] === undefined) return key;
      val = val[k];
    }
    return val;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
