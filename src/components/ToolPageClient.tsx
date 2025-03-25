'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ToolPageClientProps {
  category: string;
  tool: string;
}

export default function ToolPageClient({ category, tool }: ToolPageClientProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useLanguage();

  // 获取当前工具名称
  const toolName = t(tool);

  // 处理工具操作
  const handleProcess = () => {
    if (category === 'encode-decode') {
      if (tool === 'base64') {
        try {
          // 检测是编码还是解码
          if (/^[A-Za-z0-9+/=]+$/.test(input.trim())) {
            // 看起来是Base64，尝试解码
            setOutput(atob(input));
          } else {
            // 编码
            setOutput(btoa(input));
          }
        } catch (error) {
          // 使用错误信息
          console.error('Base64处理错误:', error);
          setOutput('处理出错，请检查输入');
        }
      } else if (tool === 'url-encode') {
        try {
          // 检测是编码还是解码
          if (input.includes('%')) {
            // 看起来是URL编码，尝试解码
            setOutput(decodeURIComponent(input));
          } else {
            // 编码
            setOutput(encodeURIComponent(input));
          }
        } catch (error) {
          // 使用错误信息
          console.error('URL编码处理错误:', error);
          setOutput('处理出错，请检查输入');
        }
      }
    } else if (category === 'format') {
      if (tool === 'json-format') {
        try {
          const parsed = JSON.parse(input);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch (error) {
          // 使用错误信息
          console.error('JSON格式化错误:', error);
          setOutput('JSON解析错误，请检查输入');
        }
      } else if (tool === 'html-format') {
        // 简单的HTML格式化，实际项目中可能需要更复杂的处理
        setOutput(input.replace(/></g, '>\n<').replace(/^\s*</gm, '  <'));
      }
    } else if (category === 'encrypt') {
      if (tool === 'md5') {
        // 在实际项目中，您需要使用适当的MD5库
        setOutput('需要使用MD5库实现，如crypto-js');
      } else if (tool === 'sha1') {
        // 在实际项目中，您需要使用适当的SHA1库
        setOutput('需要使用SHA1库实现，如crypto-js');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{toolName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入要处理的内容..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={output}
            readOnly
            placeholder="处理结果将显示在这里..."
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleProcess}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {t('process')}
        </button>
      </div>
    </div>
  );
} 