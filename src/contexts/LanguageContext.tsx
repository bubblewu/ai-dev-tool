'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 定义语言类型
type Language = 'zh' | 'en';

// 定义翻译内容
type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// 翻译内容
const translations: Translations = {
  'home': {
    'zh': '首页',
    'en': 'Home',
  },
  'about': {
    'zh': '关于',
    'en': 'About',
  },
  'toolbox': {
    'zh': 'AI开发工具箱',
    'en': 'AI Dev Toolbox',
  },
  'toolbox.description': {
    'zh': '一站式开发工具集合，提高您的开发效率',
    'en': 'One-stop development tool collection to improve your efficiency',
  },
  'input': {
    'zh': '输入',
    'en': 'Input',
  },
  'output': {
    'zh': '输出',
    'en': 'Output',
  },
  'process': {
    'zh': '处理',
    'en': 'Process',
  },
  'search.placeholder': {
    'zh': '搜索工具...',
    'en': 'Search tools...',
  },
  'encode-decode': {
    'zh': '编码转换',
    'en': 'Encoding & Decoding',
  },
  'format': {
    'zh': '格式化工具',
    'en': 'Formatting Tools',
  },
  'encrypt': {
    'zh': '加密解密',
    'en': 'Encryption & Decryption',
  },
  'converters': {
    'zh': '格式转换',
    'en': 'Format Converters',
  },
  'generators': {
    'zh': '生成工具',
    'en': 'Generators',
  },
  'base64': {
    'zh': 'Base64编码解码',
    'en': 'Base64 Encode/Decode',
  },
  'url-encode': {
    'zh': 'URL编码解码',
    'en': 'URL Encode/Decode',
  },
  'html-encode': {
    'zh': 'HTML编码解码',
    'en': 'HTML Encode/Decode',
  },
  'json-format': {
    'zh': 'JSON格式化',
    'en': 'JSON Formatter',
  },
  'html-format': {
    'zh': 'HTML格式化',
    'en': 'HTML Formatter',
  },
  'xml-format': {
    'zh': 'XML格式化',
    'en': 'XML Formatter',
  },
  'css-format': {
    'zh': 'CSS格式化',
    'en': 'CSS Formatter',
  },
  'md5': {
    'zh': 'MD5加密',
    'en': 'MD5 Encryption',
  },
  'sha1': {
    'zh': 'SHA1加密',
    'en': 'SHA1 Encryption',
  },
  'sha256': {
    'zh': 'SHA256加密',
    'en': 'SHA256 Encryption',
  },
  'aes': {
    'zh': 'AES加密解密',
    'en': 'AES Encryption/Decryption',
  },
  'json-to-xml': {
    'zh': 'JSON转XML',
    'en': 'JSON to XML',
  },
  'xml-to-json': {
    'zh': 'XML转JSON',
    'en': 'XML to JSON',
  },
  'json-to-yaml': {
    'zh': 'JSON转YAML',
    'en': 'JSON to YAML',
  },
  'uuid': {
    'zh': 'UUID生成器',
    'en': 'UUID Generator',
  },
  'password': {
    'zh': '密码生成器',
    'en': 'Password Generator',
  },
  'lorem-ipsum': {
    'zh': '随机文本生成器',
    'en': 'Lorem Ipsum Generator',
  },
  'copy': {
    'zh': '复制',
    'en': 'Copy',
  },
  'copied': {
    'zh': '已复制',
    'en': 'Copied',
  },
  'clear': {
    'zh': '清空',
    'en': 'Clear',
  },
  'settings': {
    'zh': '设置',
    'en': 'Settings',
  },
  'history': {
    'zh': '历史记录',
    'en': 'History',
  },
  'clear.history': {
    'zh': '清空历史',
    'en': 'Clear History',
  },
  'no.history': {
    'zh': '暂无历史记录',
    'en': 'No history records',
  },
  'search.history': {
    'zh': '搜索历史记录...',
    'en': 'Search history...',
  },
};

// 创建上下文
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 创建Provider组件
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  // 翻译函数
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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