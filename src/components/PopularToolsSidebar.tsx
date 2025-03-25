'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStats } from '@/contexts/StatsContext';
import { ChevronLeftIcon, ChevronRightIcon, FireIcon } from '@heroicons/react/24/outline';

// 定义工具类型
interface PopularTool {
  id: string;
  category: string;
  name: string;
  count: number;
}

export default function PopularToolsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { getPopularTools } = useStats();
  const popularTools = getPopularTools(10); // 获取前10个热门工具
  
  // 在小屏幕上默认关闭侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className={`fixed top-20 right-0 h-auto z-20 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* 切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-4 -translate-x-full bg-white dark:bg-gray-800 p-2 rounded-l-lg shadow-md border border-r-0 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 group"
        aria-label={isOpen ? '关闭热门工具' : '打开热门工具'}
      >
        {isOpen ? (
          <ChevronRightIcon className="w-5 h-5" />
        ) : (
          <>
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="absolute left-0 top-full -translate-x-1/2 mt-1 text-xs whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {t('popular.tools')}
            </span>
          </>
        )}
      </button>
      
      {/* 侧边栏内容 */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-l border-t border-b border-gray-200 dark:border-gray-700 rounded-l-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <FireIcon className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="font-medium text-gray-900 dark:text-white">{t('popular.tools')}</h3>
        </div>
        
        <ul className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {popularTools.map((tool: PopularTool) => (
            <li key={tool.id} className="mb-1">
              <Link
                href={`/tools/${tool.category}/${tool.id}`}
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs mr-2">
                  {tool.count}
                </span>
                <span className="text-sm">{t(tool.id)}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 text-center">
          <Link
            href="/"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => setIsOpen(false)}
          >
            {t('view.all')}
          </Link>
        </div>
      </div>
    </div>
  );
} 