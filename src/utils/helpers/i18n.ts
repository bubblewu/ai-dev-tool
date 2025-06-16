import zhTranslations from '@/locales/zh';
import enTranslations from '@/locales/en';

type Language = 'zh' | 'en';

// 获取指定语言的翻译函数
export function getTranslation(language: Language = 'zh') {
  const translations = language === 'zh' ? zhTranslations : enTranslations;
  
  return function translate(key: string): string {
    return translations[key] || key;
  };
}

// 获取所有支持的语言
export function getSupportedLanguages(): Language[] {
  return ['zh', 'en'];
}

// 检查是否为支持的语言
export function isSupportedLanguage(lang: string): lang is Language {
  return ['zh', 'en'].includes(lang);
}

// 添加语言检测功能
export function detectLanguage(): Language {
  // 检查浏览器语言
  const browserLang = navigator.language.toLowerCase().split('-')[0];
  
  // 检查是否为支持的语言
  if (isSupportedLanguage(browserLang)) {
    return browserLang;
  }
  
  // 默认返回中文
  return 'zh';
}

// 添加翻译缺失检查
export function checkMissingTranslations(): string[] {
  const missing: string[] = [];
  const zhKeys = Object.keys(zhTranslations);
  const enKeys = Object.keys(enTranslations);
  
  // 检查中文翻译中缺失的英文键
  for (const key of enKeys) {
    if (!zhKeys.includes(key)) {
      missing.push(`zh: ${key}`);
    }
  }
  
  // 检查英文翻译中缺失的中文键
  for (const key of zhKeys) {
    if (!enKeys.includes(key)) {
      missing.push(`en: ${key}`);
    }
  }
  
  return missing;
} 