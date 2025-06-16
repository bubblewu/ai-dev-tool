// 工具类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
}

// 历史记录项类型定义
export interface HistoryItem {
  id?: string;
  category: string;
  tool: string;
  input: string;
  result: string;
  timestamp: number;
}

// 语言类型定义
export type Language = 'en' | 'zh';

// 主题类型定义
export type Theme = 'light' | 'dark' | 'system';

// 设置类型定义
export interface Settings {
  theme: Theme;
  language: Language;
  fontSize: number;
  autoSave: boolean;
}

// 统计数据类型定义
export interface Stats {
  toolUsage: Record<string, number>;
  totalUsage: number;
  lastUsed: Record<string, number>;
} 