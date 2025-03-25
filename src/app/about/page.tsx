'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('about')}</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          AI开发工具箱是一个为开发者提供各种实用在线工具的平台。我们的目标是简化开发过程中的常见任务，提高开发效率。
        </p>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          我们提供的工具包括但不限于：
        </p>
        
        <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
          <li>{t('encode-decode')}（Base64、URL编码等）</li>
          <li>{t('format')}（JSON、HTML等）</li>
          <li>{t('encrypt')}（MD5、SHA1等）</li>
          <li>更多工具正在开发中...</li>
        </ul>
        
        <p className="text-gray-700 dark:text-gray-300">
          如果您有任何建议或反馈，请随时联系我们。
        </p>
      </div>
    </div>
  );
} 