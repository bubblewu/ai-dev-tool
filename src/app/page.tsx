'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStats } from '@/contexts/StatsContext';
import { 
  CodeBracketIcon, 
  DocumentTextIcon, 
  LockClosedIcon, 
  ArrowPathIcon, 
  SparklesIcon,
  XMarkIcon,
  FireIcon,
  CalculatorIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { t } = useLanguage();
  const { getPopularTools } = useStats();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  // 获取热门工具
  const popularTools = useMemo(() => {
    return getPopularTools(5).map(tool => ({
      id: tool.id,
      name: t(tool.id),
      count: tool.count
    }));
  }, [getPopularTools, t]);
  
  // 当URL参数变化时更新搜索词
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);
  
  // 工具分类和图标映射
  const toolCategories = [
    {
      id: 'encode-decode',
      name: t('encode-decode'),
      icon: <CodeBracketIcon className="w-6 h-6 text-blue-500" />,
      tools: [
        { id: 'base64', name: t('base64') },
        { id: 'url-encode', name: t('url-encode') },
        { id: 'html-encode', name: t('html-encode') },
        { id: 'jwt-decode', name: t('jwt-decode') },
      ]
    },
    {
      id: 'format',
      name: t('format'),
      icon: <DocumentTextIcon className="w-6 h-6 text-green-500" />,
      tools: [
        { id: 'json-format', name: t('json-format') },
        { id: 'html-format', name: t('html-format') },
        { id: 'xml-format', name: t('xml-format') },
        { id: 'css-format', name: t('css-format') },
        { id: 'sql-format', name: t('sql-format') },
      ]
    },
    {
      id: 'encrypt',
      name: t('encrypt'),
      icon: <LockClosedIcon className="w-6 h-6 text-purple-500" />,
      tools: [
        { id: 'md5', name: t('md5') },
        { id: 'sha1', name: t('sha1') },
        { id: 'sha256', name: t('sha256') },
        { id: 'aes', name: t('aes') },
        { id: 'bcrypt', name: t('bcrypt') },
      ]
    },
    {
      id: 'converters',
      name: t('converters'),
      icon: <ArrowPathIcon className="w-6 h-6 text-orange-500" />,
      tools: [
        { id: 'json-to-xml', name: t('json-to-xml') },
        { id: 'xml-to-json', name: t('xml-to-json') },
        { id: 'json-to-yaml', name: t('json-to-yaml') },
        { id: 'yaml-to-json', name: t('yaml-to-json') },
        { id: 'csv-to-json', name: t('csv-to-json') },
        { id: 'json-to-csv', name: t('json-to-csv') },
      ]
    },
    {
      id: 'generators',
      name: t('generators'),
      icon: <SparklesIcon className="w-6 h-6 text-pink-500" />,
      tools: [
        { id: 'uuid', name: t('uuid') },
        { id: 'password', name: t('password') },
        { id: 'lorem-ipsum', name: t('lorem-ipsum') },
        { id: 'jwt-generator', name: t('jwt-generator') },
      ]
    },
    {
      id: 'text-tools',
      name: t('text-tools'),
      icon: <DocumentDuplicateIcon className="w-6 h-6 text-indigo-500" />,
      tools: [
        { id: 'text-diff', name: t('text-diff') },
        { id: 'text-case-converter', name: t('text-case-converter') },
        { id: 'markdown-preview', name: t('markdown-preview') },
        { id: 'regex-tester', name: t('regex-tester') },
      ]
    },
    {
      id: 'calculators',
      name: t('calculators'),
      icon: <CalculatorIcon className="w-6 h-6 text-red-500" />,
      tools: [
        { id: 'color-converter', name: t('color-converter') },
        { id: 'unit-converter', name: t('unit-converter') },
        { id: 'date-calculator', name: t('date-calculator') },
        { id: 'number-base-converter', name: t('number-base-converter') },
      ]
    },
    {
      id: 'time-tools',
      name: t('time-tools'),
      icon: <ClockIcon className="w-6 h-6 text-yellow-500" />,
      tools: [
        { id: 'timestamp-converter', name: t('timestamp-converter') },
        { id: 'timezone-converter', name: t('timezone-converter') },
        { id: 'cron-parser', name: t('cron-parser') },
      ]
    },
  ];
  
  // 根据搜索词过滤工具分类
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return toolCategories;
    
    return toolCategories.map(category => {
      const filteredTools = category.tools.filter(tool => 
        t(tool.id).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        ...category,
        tools: filteredTools
      };
    }).filter(category => category.tools.length > 0);
  }, [toolCategories, searchTerm, t]);

  return (
    <div className="w-full container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      {/* 只有当没有通过导航栏搜索时才显示搜索框 */}
      {!initialSearch && (
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 显示搜索结果 */}
      {searchTerm && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            搜索结果: &quot;{searchTerm}&quot;
          </h2>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            清除搜索
          </button>
        </div>
      )}

      {/* 快速访问区域 - 仅在未搜索时显示 */}
      {!searchTerm && popularTools.length > 0 && (
        <div className="mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <FireIcon className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">热门工具</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {popularTools.map(tool => (
                <li key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150">
                  <Link href={`/tools/${findCategoryForTool(tool.id)}/${tool.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-between p-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      {tool.name}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">使用 {tool.count} 次</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 工具分类 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {category.icon}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">{category.name}</h2>
              </div>
              <ul className="space-y-3">
                {category.tools.map((tool) => (
                  <li key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150">
                    <Link href={`/tools/${category.id}/${tool.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center p-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // 辅助函数：根据工具ID查找分类
  function findCategoryForTool(toolId: string): string {
    for (const category of toolCategories) {
      if (category.tools.some(t => t.id === toolId)) {
        return category.id;
      }
    }
    return 'encode-decode'; // 默认分类
  }
}
