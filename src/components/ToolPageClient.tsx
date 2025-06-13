'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory, HistoryItem } from '@/contexts/HistoryContext';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { 
  ArrowPathIcon, 
  ClipboardDocumentIcon, 
  TrashIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';
import { useStats } from '@/contexts/StatsContext';

interface ToolPageClientProps {
  category: string;
  tool: string;
}

export default function ToolPageClient({ category, tool }: ToolPageClientProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [key, setKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
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
      if (tool === 'base64') {
        if (mode === 'encode') {
          result = btoa(unescape(encodeURIComponent(input)));
        } else {
          try {
            result = decodeURIComponent(escape(atob(input)));
          } catch {
            result = atob(input);
          }
        }
      } else if (tool === 'url-encode') {
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
      } else if (tool === 'md5') {
        // MD5加密
        result = CryptoJS.MD5(input).toString();
      } else if (tool === 'sha1') {
        // SHA1加密
        result = CryptoJS.SHA1(input).toString();
      } else if (tool === 'sha256') {
        // SHA256加密
        result = CryptoJS.SHA256(input).toString();
      } else if (tool === 'aes') {
        // AES加密/解密
        if (!key) {
          throw new Error('请输入密钥');
        }
        
        try {
          // 尝试解密（如果输入是已加密的）
          const bytes = CryptoJS.AES.decrypt(input, key);
          result = bytes.toString(CryptoJS.enc.Utf8);
          
          // 如果解密结果为空，可能是未加密的或密钥错误，尝试解析为JSON
          if (!result) {
            try {
              // 尝试解析为JSON，如果成功则可能是未加密的
              JSON.parse(input);
              // 执行加密
              const encrypted = CryptoJS.AES.encrypt(input, key);
              result = encrypted.toString();
            } catch {
              // 解析JSON失败，执行加密
              const encrypted = CryptoJS.AES.encrypt(input, key);
              result = JSON.stringify({
                ciphertext: encrypted.toString(),
                salt: encrypted.salt.toString(),
                iv: encrypted.iv.toString()
              });
            }
          }
        } catch {
          // 如果解密失败，执行加密
          const encrypted = CryptoJS.AES.encrypt(input, key);
          result = encrypted.toString();
        }
      } else if (tool === 'uuid') {
        // 生成UUID
        result = uuidv4();
      } else if (tool === 'password') {
        // 生成随机密码
        const length = parseInt(input) || 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        result = password;
      } else if (tool === 'lorem-ipsum') {
        // 生成随机文本
        const paragraphs = parseInt(input) || 3;
        const sentences = [
          '这是一个示例句子，用于生成随机文本。',
          '人工智能正在改变我们的生活方式和工作方式。',
          '云计算为企业提供了灵活的IT资源。',
          '大数据分析可以帮助企业做出更明智的决策。',
          '区块链技术有潜力革新多个行业。',
          '物联网将各种设备连接起来，创造智能环境。',
          '5G网络将带来更快的数据传输速度和更低的延迟。',
          '网络安全对于保护数字资产至关重要。',
          '量子计算可能会解决传统计算机无法解决的问题。',
          '增强现实和虚拟现实正在改变我们体验数字内容的方式。'
        ];
        
        let text = '';
        for (let i = 0; i < paragraphs; i++) {
          let paragraph = '';
          const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7句
          
          for (let j = 0; j < sentenceCount; j++) {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            paragraph += sentences[randomIndex] + ' ';
          }
          
          text += paragraph.trim() + '\n\n';
        }
        
        result = text.trim();
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
  }, [input, tool, mode, key, t, addToHistory, incrementToolUsage, category]);
  
  // 使用 useMemo 优化计算密集型操作
  const processedResult = useMemo(() => {
    if (!result) return '';
    
    // 对于大型结果，可以在这里进行格式化或其他处理
    if (result.length > 10000) {
      return result.substring(0, 10000) + '... (结果过长，已截断)';
    }
    
    return result;
  }, [result]);
  
  // 使用 useCallback 优化事件处理函数
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
    setKey('');
  };
  
  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter 或 Cmd+Enter 处理
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleProcess();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleProcess]);

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 标题区域 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t(tool)}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t(`${tool}.description`)}</p>
      </div>

      {/* 功能区 - 放在最上方 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Base64 {mode === 'encode' ? '编码' : '解码'}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                编码
              </button>
              <button
                onClick={() => setMode('decode')}
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
              placeholder={`请输入要${mode === 'encode' ? '编码' : '解码'}的文本...`}
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
              <pre className="whitespace-pre-wrap break-words">{processedResult}</pre>
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

      {/* 详细信息区域 - 可折叠 */}
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

            {/* 代码实现示例 - Tab 形式 */}
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