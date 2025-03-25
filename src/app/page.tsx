'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  // 工具分类
  const toolCategories = [
    {
      id: 'encode-decode',
      name: t('encode-decode'),
      tools: [
        { id: 'base64', name: t('base64') },
        { id: 'url-encode', name: t('url-encode') },
      ]
    },
    {
      id: 'format',
      name: t('format'),
      tools: [
        { id: 'json-format', name: t('json-format') },
        { id: 'html-format', name: t('html-format') },
      ]
    },
    {
      id: 'encrypt',
      name: t('encrypt'),
      tools: [
        { id: 'md5', name: t('md5') },
        { id: 'sha1', name: t('sha1') },
      ]
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('toolbox')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t('toolbox.description')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolCategories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{category.name}</h2>
            <ul className="space-y-2">
              {category.tools.map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${category.id}/${tool.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
