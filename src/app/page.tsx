'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStats } from '@/contexts/StatsContext';
import { useHistory } from '@/contexts/HistoryContext';
import ToolCard from '@/components/ToolCard';
import PopularToolsSidebar from '@/components/PopularToolsSidebar';

// 工具分类
const categories = [
  { id: 'encode-decode', icon: '🔄', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'format', icon: '📝', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'encrypt', icon: '🔒', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 'converters', icon: '🔄', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'generators', icon: '⚙️', color: 'bg-red-100 dark:bg-red-900' },
  { id: 'text-tools', icon: '📄', color: 'bg-indigo-100 dark:bg-indigo-900' },
  { id: 'calculators', icon: '🧮', color: 'bg-pink-100 dark:bg-pink-900' },
  { id: 'time-tools', icon: '⏱️', color: 'bg-orange-100 dark:bg-orange-900' },
];

// 工具列表
const tools = [
  { id: 'base64', category: 'encode-decode' },
  { id: 'url-encode', category: 'encode-decode' },
  { id: 'html-encode', category: 'encode-decode' },
  { id: 'jwt-decode', category: 'encode-decode' },
  { id: 'json-format', category: 'format' },
  { id: 'html-format', category: 'format' },
  { id: 'xml-format', category: 'format' },
  { id: 'css-format', category: 'format' },
  { id: 'sql-format', category: 'format' },
  { id: 'md5', category: 'encrypt' },
  { id: 'sha1', category: 'encrypt' },
  { id: 'sha256', category: 'encrypt' },
  { id: 'aes', category: 'encrypt' },
  { id: 'bcrypt', category: 'encrypt' },
  { id: 'json-to-xml', category: 'converters' },
  { id: 'xml-to-json', category: 'converters' },
  { id: 'json-to-yaml', category: 'converters' },
  { id: 'yaml-to-json', category: 'converters' },
  { id: 'csv-to-json', category: 'converters' },
  { id: 'json-to-csv', category: 'converters' },
  { id: 'uuid', category: 'generators' },
  { id: 'password', category: 'generators' },
  { id: 'lorem-ipsum', category: 'generators' },
  { id: 'jwt-generator', category: 'generators' },
  { id: 'text-diff', category: 'text-tools' },
  { id: 'text-case-converter', category: 'text-tools' },
  { id: 'markdown-preview', category: 'text-tools' },
  { id: 'regex-tester', category: 'text-tools' },
  { id: 'color-converter', category: 'calculators' },
  { id: 'unit-converter', category: 'calculators' },
  { id: 'date-calculator', category: 'calculators' },
  { id: 'number-base-converter', category: 'calculators' },
  { id: 'timestamp-converter', category: 'time-tools' },
  { id: 'timezone-converter', category: 'time-tools' },
  { id: 'cron-parser', category: 'time-tools' },
];

export default function Home() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const categoryParam = searchParams?.get('category') || '';
  const [filteredTools, setFilteredTools] = useState(tools);
  const categoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  // 根据搜索参数和类别参数过滤工具
  useEffect(() => {
    if (searchQuery) {
      const filtered = tools.filter(tool => 
        t(tool.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(`${tool.id}.description`).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(tool.category).toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTools(filtered);
    } else {
      setFilteredTools(tools);
    }
  }, [searchQuery, t]);
  
  // 当类别参数变化时，滚动到相应的类别
  useEffect(() => {
    if (categoryParam && categoryRefs.current[categoryParam]) {
      // 添加一点延迟，确保DOM已经渲染
      setTimeout(() => {
        categoryRefs.current[categoryParam]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
    }
  }, [categoryParam]);
  
  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* 搜索结果 */}
      {searchQuery && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            搜索结果: &quot;{searchQuery}&quot;
          </h2>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTools.map(tool => (
                <ToolCard 
                  key={`${tool.category}-${tool.id}`}
                  id={tool.id}
                  category={tool.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              未找到匹配的工具
            </div>
          )}
        </div>
      )}
      
      {/* 新的分类导航卡片布局 */}
      {!searchQuery && (
        <div>
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            AI开发工具箱
          </h1>
          
          {/* 分类卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map(category => (
              <a 
                key={category.id}
                href={`?category=${category.id}`}
                className={`${category.color} rounded-lg p-6 transition-transform hover:scale-105 shadow-md`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t(category.id)}
                  </h2>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {tools.filter(tool => tool.category === category.id).length} 个工具
                </p>
              </a>
            ))}
          </div>
          
          {/* 热门工具部分 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              热门工具
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.slice(0, 8).map(tool => (
                <ToolCard 
                  key={`${tool.category}-${tool.id}`}
                  id={tool.id}
                  category={tool.category}
                />
              ))}
            </div>
          </div>
          
          {/* 分类工具列表 */}
          {categoryParam && (
            <div>
              {categories
                .filter(category => category.id === categoryParam)
                .map(category => {
                  const categoryTools = tools.filter(tool => tool.category === category.id);
                  
                  return (
                    <div 
                      key={category.id} 
                      className="scroll-mt-20"
                      ref={el => categoryRefs.current[category.id] = el}
                    >
                      <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-600 dark:text-blue-400">
                        <span className="mr-3">{category.icon}</span>
                        {t(category.id)}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoryTools.map(tool => (
                          <ToolCard 
                            key={`${tool.category}-${tool.id}`}
                            id={tool.id}
                            category={tool.category}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      
      {/* 热门工具侧边栏 */}
      <PopularToolsSidebar />
    </div>
  );
}
