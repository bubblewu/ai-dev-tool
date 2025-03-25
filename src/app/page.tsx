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
  { id: 'encode-decode', icon: '🔄' },
  { id: 'format', icon: '📝' },
  { id: 'encrypt', icon: '🔒' },
  { id: 'converters', icon: '🔄' },
  { id: 'generators', icon: '⚙️' },
  { id: 'text-tools', icon: '📄' },
  { id: 'calculators', icon: '🧮' },
  { id: 'time-tools', icon: '⏱️' },
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
    <div className="container mx-auto px-4 py-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* 搜索结果 */}
        {searchQuery && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
        
        {/* 工具分类 */}
        {!searchQuery && (
          <div>
            {categories.map(category => {
              const categoryTools = tools.filter(tool => tool.category === category.id);
              const isActive = categoryParam === category.id;
              
              return (
                <div 
                  key={category.id} 
                  className={`mb-10 ${isActive ? 'scroll-mt-20' : ''}`}
                  ref={el => categoryRefs.current[category.id] = el}
                >
                  <h2 className={`text-xl font-bold mb-4 flex items-center ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    <span className="mr-2">{category.icon}</span>
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
      
      {/* 热门工具侧边栏 */}
      <PopularToolsSidebar />
    </div>
  );
}
