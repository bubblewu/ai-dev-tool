'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ToolStats = {
  [key: string]: number;
};

type StatsContextType = {
  incrementToolUsage: (toolId: string) => void;
  getPopularTools: (limit?: number) => Array<{id: string, count: number}>;
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [toolStats, setToolStats] = useState<ToolStats>({});
  
  // 从localStorage加载统计数据
  useEffect(() => {
    const savedStats = localStorage.getItem('ai-toolbox-stats');
    if (savedStats) {
      try {
        setToolStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Failed to parse stats:', error);
      }
    }
  }, []);
  
  // 增加工具使用次数
  const incrementToolUsage = (toolId: string) => {
    setToolStats(prev => {
      const newStats = { 
        ...prev, 
        [toolId]: (prev[toolId] || 0) + 1 
      };
      
      // 保存到localStorage
      localStorage.setItem('ai-toolbox-stats', JSON.stringify(newStats));
      return newStats;
    });
  };
  
  // 获取最常用的工具
  const getPopularTools = (limit = 5) => {
    return Object.entries(toolStats)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };
  
  return (
    <StatsContext.Provider value={{ incrementToolUsage, getPopularTools }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
} 