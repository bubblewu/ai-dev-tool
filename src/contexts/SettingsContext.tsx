'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// 定义设置类型
type Settings = {
  historyEnabled: boolean;
  maxHistoryItems: number;
  defaultTheme: 'light' | 'dark' | 'system';
};

// 默认设置
const defaultSettings: Settings = {
  historyEnabled: true,
  maxHistoryItems: 10,
  defaultTheme: 'system',
};

// 创建上下文
type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 创建Provider组件
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  
  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('ai-toolbox-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);
  
  // 更新设置
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // 保存到localStorage
      localStorage.setItem('ai-toolbox-settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// 创建Hook
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 