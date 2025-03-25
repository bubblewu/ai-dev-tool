'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useSettings } from './SettingsContext';

// 定义历史记录项类型
export interface HistoryItem {
  tool: string;
  category: string;
  input: string;
  result: string;
  timestamp: number;
}

// 定义上下文类型
interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  getRecentTools: (limit: number) => { tool: string; category: string }[];
}

// 创建上下文
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// 提供者组件
export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { settings } = useSettings();
  
  // 从本地存储加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('toolHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history from localStorage', e);
      }
    }
  }, []);
  
  // 添加到历史记录
  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history.filter(h => 
      !(h.tool === item.tool && h.category === item.category)
    )].slice(0, 100); // 限制历史记录数量
    
    setHistory(newHistory);
    localStorage.setItem('toolHistory', JSON.stringify(newHistory));
  };
  
  // 清空历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolHistory');
  };
  
  // 获取最近使用的工具
  const getRecentTools = (limit: number) => {
    const uniqueTools = new Map<string, { tool: string; category: string }>();
    
    history.forEach(item => {
      const key = `${item.category}-${item.tool}`;
      if (!uniqueTools.has(key)) {
        uniqueTools.set(key, { tool: item.tool, category: item.category });
      }
    });
    
    return Array.from(uniqueTools.values()).slice(0, limit);
  };
  
  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, getRecentTools }}>
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