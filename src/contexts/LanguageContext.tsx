'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import zhTranslations from '@/locales/zh';
import enTranslations from '@/locales/en';

// 定义语言类型
type Language = 'zh' | 'en';

// 定义翻译内容
type Translations = {
  [key: string]: string;
};

// 翻译内容
const translations: { [key: string]: Translations } = {
  zh: zhTranslations,
  en: enTranslations,
};

// 创建上下文
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 创建Provider组件
export function LanguageProvider({ children }: { children: ReactNode }) {
  // 从localStorage获取语言设置，默认为中文
  const [language, setLanguage] = useState<string>('zh');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // 更新语言并保存到localStorage
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // 翻译函数
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 创建Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 