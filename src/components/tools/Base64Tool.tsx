'use client';

import { useState } from 'react';
import { ArrowPathIcon, ClipboardDocumentIcon, TrashIcon, ArrowPathRoundedSquareIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useHistory } from '@/contexts/HistoryContext';
import { useStats } from '@/contexts/StatsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HistoryItem } from '@/types';

interface Base64ToolProps {
  category: string;
  tool: string;
}

export default function Base64Tool({ category, tool }: Base64ToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const { addToHistory } = useHistory();
  const { incrementToolUsage } = useStats();

  // 代码示例数据
  const codeExamples = {
    javascript: {
      title: 'JavaScript',
      code: `// 编码
const encoded = btoa(unescape(encodeURIComponent(text)));

// 解码
const decoded = decodeURIComponent(escape(atob(encoded)));`
    },
    python: {
      title: 'Python',
      code: `import base64

# 编码
encoded = base64.b64encode(text.encode()).decode()

# 解码
decoded = base64.b64decode(encoded).decode()`
    },
    java: {
      title: 'Java',
      code: `import java.util.Base64;

// 编码
String encoded = Base64.getEncoder().encodeToString(text.getBytes());

// 解码
String decoded = new String(Base64.getDecoder().decode(encoded));`
    }
  };

  // 处理工具操作
  const handleProcess = async () => {
    if (!input.trim()) {
      toast.error('请输入要处理的文本', {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    let result = '';
    
    try {
      if (mode === 'encode') {
        // 编码模式
        try {
          result = btoa(unescape(encodeURIComponent(input)));
        } catch {
          throw new Error('编码失败：输入包含无效字符');
        }
      } else {
        // 解码模式
        try {
          // 首先尝试 UTF-8 解码
          result = decodeURIComponent(escape(atob(input)));
        } catch {
          try {
            // 如果 UTF-8 解码失败，尝试直接解码
            result = atob(input);
          } catch {
            throw new Error('解码失败：输入不是有效的 Base64 字符串');
          }
        }
      }
      
      // 更新结果
      setResult(result);
      
      // 添加到历史记录
      const historyItem: HistoryItem = {
        category,
        tool,
        input,
        result,
        timestamp: Date.now()
      };
      addToHistory(historyItem);
      
      // 更新使用统计
      incrementToolUsage(tool);
      
      toast.success('处理成功', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('处理错误:', error);
      const errorMessage = error instanceof Error ? error.message : '处理失败';
      setError(errorMessage);
      setResult('');
      
      toast.error(errorMessage, {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 4000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 复制结果
  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => toast.success('已复制到剪贴板'))
      .catch(() => toast.error('复制失败'));
  };

  // 清空输入和结果
  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 标题区域 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t(tool)}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t(`${tool}.description`)}</p>
      </div>

      {/* 功能区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Base64 {mode === 'encode' ? '编码' : '解码'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setMode('encode');
                  setError(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                编码
              </button>
              <button
                onClick={() => {
                  setMode('decode');
                  setError(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                解码
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              handleClear();
              setError(null);
            }}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
            title={t('clear')}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输入文本</label>
            </div>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                className={`w-full h-48 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={`请输入要${mode === 'encode' ? '编码' : '解码'}的文本...`}
              />
              {error && (
                <div className="absolute top-2 right-2 text-red-500">
                  <ExclamationCircleIcon className="w-5 h-5" />
                </div>
              )}
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* 输出区域 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输出结果</label>
              <button
                onClick={handleCopy}
                disabled={!result}
                className={`text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 ${!result ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={t('copy')}
              >
                <ClipboardDocumentIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white overflow-auto">
              <pre className="whitespace-pre-wrap break-words">{result}</pre>
            </div>
          </div>
        </div>

        {/* 处理按钮 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleProcess}
            disabled={isProcessing || !input}
            className={`flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 ${(isProcessing || !input) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <ArrowPathRoundedSquareIcon className="w-5 h-5 mr-2" />
                {mode === 'encode' ? '编码' : '解码'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* 详细信息区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">详细信息</h2>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="px-6 py-4 space-y-6 border-t border-gray-200 dark:border-gray-700">
            {/* Base64 原理说明 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Base64 编码原理</h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400">
                  Base64 是一种基于 64 个可打印字符来表示二进制数据的表示方法。它将每 3 个字节的数据编码为 4 个可打印字符。
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>将输入数据按 3 字节分组</li>
                  <li>将每组 3 字节（24 位）分成 4 个 6 位的块</li>
                  <li>每个 6 位的块映射到 Base64 字符表中的对应字符</li>
                  <li>如果最后一组不足 3 字节，用 = 填充</li>
                </ul>
              </div>
            </div>

            {/* 代码实现示例 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">主流语言实现</h3>
              
              {/* Tab 导航 */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {Object.entries(codeExamples).map(([key, { title }]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedLanguage(key as 'javascript' | 'python' | 'java')}
                      className={`
                        py-4 px-1 border-b-2 font-medium text-sm
                        ${selectedLanguage === key
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }
                      `}
                    >
                      {title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab 内容 */}
              <div className="mt-4">
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    {codeExamples[selectedLanguage].code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 