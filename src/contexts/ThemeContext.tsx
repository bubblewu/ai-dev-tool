'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 定义主题类型
type Theme = 'light' | 'dark';

// 定义上下文类型
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 提供者组件
export function ThemeProvider({ children }: { children: ReactNode }) {
  // 初始化主题状态，默认为系统主题
  const [theme, setTheme] = useState<Theme>('light');
  
  // 从本地存储加载主题设置
  useEffect(() => {
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      // 如果有保存的主题设置，使用它
      setTheme(savedTheme);
    } else {
      // 否则，检查系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // 当主题变化时，更新文档类和本地存储
  useEffect(() => {
    // 更新文档类
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 保存到本地存储
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // 切换主题
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 创建Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 