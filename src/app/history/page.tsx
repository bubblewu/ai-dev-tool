'use client';

import { useState, useMemo, useCallback } from 'react';
import { useHistory } from '@/contexts/HistoryContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  ClockIcon, 
  TrashIcon, 
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function HistoryPage() {
  const { history, clearHistory, removeHistoryItem } = useHistory();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 使用 useMemo 缓存过滤结果
  const filteredHistory = useMemo(() => {
    return history.filter(item => 
      t(item.tool).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.output.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm, t]);
  
  // 使用 useCallback 缓存函数引用
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(t('copied'));
    }).catch(err => {
      console.error('复制失败:', err);
    });
  }, [t]);
  
  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <div className="w-full container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <div className="flex items-center mb-8">
        <ClockIcon className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">历史记录</h1>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input 
            type="search" 
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="搜索历史记录..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center"
        >
          <TrashIcon className="w-5 h-5 mr-2" />
          清空历史
        </button>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl text-gray-600 dark:text-gray-400">暂无历史记录</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Link href={`/tools/${item.category}/${item.tool}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {t(item.tool)}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(item.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => removeHistoryItem(item.id)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">输入</span>
                      <button
                        onClick={() => copyToClipboard(item.input)}
                        className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 flex items-center"
                      >
                        <ClipboardDocumentIcon className="w-3 h-3 mr-1" />
                        复制
                      </button>
                    </div>
                    <div className="max-h-24 overflow-y-auto">
                      <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{item.input}</pre>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">输出</span>
                      <button
                        onClick={() => copyToClipboard(item.output)}
                        className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 flex items-center"
                      >
                        <ClipboardDocumentIcon className="w-3 h-3 mr-1" />
                        复制
                      </button>
                    </div>
                    <div className="max-h-24 overflow-y-auto">
                      <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{item.output}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 