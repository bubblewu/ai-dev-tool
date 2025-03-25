'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CodeBracketIcon, 
  DocumentTextIcon, 
  LockClosedIcon, 
  ArrowPathIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
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
      ]
    },
  ];

  // 搜索功能
  const filteredCategories = toolCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  return (
    <div className="w-full container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
          {t('toolbox')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('toolbox.description')}
        </p>
        
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
      </header>

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
}
