'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useStats } from '@/contexts/StatsContext';
import { toast } from 'react-hot-toast';
import { 
  ArrowPathIcon, 
  ClipboardDocumentIcon, 
  TrashIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';
import Base64Tool from './tools/Base64Tool';
import type { HistoryItem } from '@/types';

interface ToolPageClientProps {
  category: string;
  tool: string;
}

export default function ToolPageClient({ category, tool }: ToolPageClientProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();
  const { addToHistory } = useHistory();
  const { incrementToolUsage } = useStats();

  // 处理工具操作
  const handleProcess = useCallback(async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    let result = '';
    
    try {
      // 根据工具类型处理输入
      if (tool === 'url-encode') {
        // URL编码/解码
        try {
          // 尝试解码（如果输入是已编码的）
          result = decodeURIComponent(input);
          // 如果解码后与输入相同，则可能是未编码的，进行编码
          if (result === input) {
            result = encodeURIComponent(input);
          }
        } catch {
          // 如果解码失败，执行编码
          result = encodeURIComponent(input);
        }
      } else if (tool === 'html-encode') {
        // HTML编码/解码
        const textarea = document.createElement('textarea');
        textarea.innerHTML = input;
        const decoded = textarea.value;
        
        // 如果解码后与输入相同，则可能是未编码的，进行编码
        if (decoded === input) {
          const div = document.createElement('div');
          div.textContent = input;
          result = div.innerHTML;
        } else {
          result = decoded;
        }
      } else if (tool === 'json-format') {
        // JSON格式化
        try {
          const parsed = JSON.parse(input);
          result = JSON.stringify(parsed, null, 2);
        } catch {
          throw new Error('JSON解析失败，请检查输入');
        }
      } else if (tool === 'html-format') {
        // HTML格式化
        const div = document.createElement('div');
        div.innerHTML = input;
        result = div.innerHTML;
      } else if (tool === 'xml-format') {
        // XML格式化
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, 'text/xml');
        const serializer = new XMLSerializer();
        result = serializer.serializeToString(xmlDoc);
      } else if (tool === 'css-format') {
        // CSS格式化
        result = input.replace(/\s*{\s*/g, ' {\n  ')
          .replace(/;\s*/g, ';\n  ')
          .replace(/}\s*/g, '\n}\n');
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
      
      toast.success('处理成功');
    } catch (error) {
      console.error('处理错误:', error);
      toast.error(error instanceof Error ? error.message : '处理失败');
    } finally {
      setIsProcessing(false);
    }
  }, [input, tool, t, addToHistory, incrementToolUsage, category]);

  // 复制结果
  const handleCopy = useCallback(() => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => toast.success('已复制到剪贴板'))
      .catch(() => toast.error('复制失败'));
  }, [result]);

  // 清空输入和结果
  const handleClear = () => {
    setInput('');
    setResult('');
  };

  // 如果是 Base64 工具，使用专门的组件
  if (tool === 'base64') {
    return <Base64Tool category={category} tool={tool} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 标题区域 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t(tool)}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t(`${tool}.description`)}</p>
      </div>

      {/* 功能区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t(tool)}</h2>
          <button
            onClick={handleClear}
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
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder={`${t('input')}...`}
            ></textarea>
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
                {t('process')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 