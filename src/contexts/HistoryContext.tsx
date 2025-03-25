'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useSettings } from './SettingsContext';

// 定义历史记录项类型
type HistoryItem = {
  id: string;
  category: string;
  tool: string;
  input: string;
  output: string;
  timestamp: number;
};

// 创建上下文
type HistoryContextType = {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// 创建Provider组件
export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { settings } = useSettings();
  
  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-toolbox-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);
  
  // 添加到历史记录
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!settings.historyEnabled) return;
    
    setHistory(prev => {
      // 创建新的历史记录项
      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      
      // 添加到历史记录并限制数量
      const updated = [newItem, ...prev].slice(0, settings.maxHistoryItems);
      
      // 保存到localStorage
      localStorage.setItem('ai-toolbox-history', JSON.stringify(updated));
      
      return updated;
    });
  };
  
  // 清空历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai-toolbox-history');
  };
  
  // 删除单个历史记录项
  const removeHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('ai-toolbox-history', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  );
}

// 创建Hook
export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
} 