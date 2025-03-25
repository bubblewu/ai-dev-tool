'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface ToolCardProps {
  id: string;
  category: string;
}

export default function ToolCard({ id, category }: ToolCardProps) {
  const { t } = useLanguage();
  
  // 获取工具图标
  const getToolIcon = () => {
    const categoryIcons: Record<string, string> = {
      'encode-decode': '🔄',
      'format': '📝',
      'encrypt': '🔒',
      'converters': '🔄',
      'generators': '⚙️',
      'text-tools': '📄',
      'calculators': '🧮',
      'time-tools': '⏱️',
    };
    
    return categoryIcons[category] || '🔧';
  };
  
  return (
    <Link 
      href={`/tools/${category}/${id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{getToolIcon()}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {t(id)}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {t(`${id}.description`)}
        </p>
      </div>
      <div className="px-5 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
        {t(category)}
      </div>
    </Link>
  );
} 