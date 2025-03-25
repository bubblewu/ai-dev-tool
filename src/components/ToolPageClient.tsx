'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory } from '@/contexts/HistoryContext';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { 
  ArrowPathIcon, 
  ClipboardDocumentIcon, 
  TrashIcon,
  ArrowPathRoundedSquareIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { processBase64, processUrlEncode, processHtmlEncode } from '@/utils/tools/encoding';
import { processJsonFormat, processHtmlFormat, processXmlFormat, processCssFormat } from '@/utils/tools/formatting';
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
        result = processBase64(input);
      } else if (tool === 'url-encode') {
        // URL编码/解码
        try {
          // 尝试解码（如果输入是已编码的）
          result = decodeURIComponent(input);
          // 如果解码后与输入相同，则可能是未编码的，进行编码
          if (result === input) {
            result = encodeURIComponent(input);
          }
        } catch (error) {
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
        } catch (error) {
          throw new Error('JSON解析失败，请检查输入');
        }
      } else if (tool === 'html-format') {
        // HTML格式化
        result = processHtmlFormat(input);
      } else if (tool === 'xml-format') {
        // XML格式化
        result = processXmlFormat(input);
      } else if (tool === 'css-format') {
        // CSS格式化
        result = processCssFormat(input);
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
            } catch (e) {
              // 解析JSON失败，执行加密
              const encrypted = CryptoJS.AES.encrypt(input, key);
              result = JSON.stringify({
                ciphertext: encrypted.toString(),
                salt: encrypted.salt.toString(),
                iv: encrypted.iv.toString()
              });
            }
          }
        } catch (error) {
          // 如果解密失败，执行加密
          const encrypted = CryptoJS.AES.encrypt(input, key);
          result = encrypted.toString();
        }
      } else if (tool === 'json-to-xml') {
        // JSON转XML
        try {
          const obj = JSON.parse(input);
          
          // 简单的JSON到XML转换函数
          const jsonToXml = (obj: Record<string, any> | any[], rootName: string = 'root'): string => {
            let xml = '';
            
            // 处理数组
            if (Array.isArray(obj)) {
              return obj.map(item => jsonToXml(item, 'item')).join('');
            }
            
            // 处理对象
            if (typeof obj === 'object' && obj !== null) {
              xml += `<${rootName}>`;
              for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  xml += jsonToXml(obj[key], key);
                }
              }
              xml += `</${rootName}>`;
            } else {
              // 处理基本类型
              xml += `<${rootName}>${obj}</${rootName}>`;
            }
            
            return xml;
          };
          
          result = jsonToXml(obj);
          // 格式化XML
          result = processXmlFormat(result);
        } catch (e) {
          throw new Error('JSON解析失败，请检查输入');
        }
      } else if (tool === 'xml-to-json') {
        // XML转JSON
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(input, 'text/xml');
          
          // 检查解析错误
          const parseError = xmlDoc.getElementsByTagName('parsererror');
          if (parseError.length > 0) {
            throw new Error('XML解析失败，请检查输入');
          }
          
          // 简单的XML到JSON转换函数
          const xmlToJson = (xml: Element): Record<string, unknown> => {
            const obj: Record<string, unknown> = {};
            
            if (xml.nodeType === 1) { // 元素节点
              // 处理属性
              if (xml.attributes && xml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let i = 0; i < xml.attributes.length; i++) {
                  const attribute = xml.attributes[i];
                  (obj['@attributes'] as Record<string, string>)[attribute.nodeName] = attribute.nodeValue || '';
                }
              }
            } else if (xml.nodeType === 3) { // 文本节点
              return { '#text': xml.nodeValue?.trim() || "" };
            }
            
            // 处理子节点
            if (xml.hasChildNodes()) {
              const childNodes = xml.childNodes;
              
              if (childNodes.length === 1 && childNodes[0].nodeType === 3) {
                // 只有一个文本子节点
                return { '#text': childNodes[0].nodeValue?.trim() || "" };
              } else {
                // 多个子节点或非文本节点
                for (let i = 0; i < childNodes.length; i++) {
                  const item = childNodes[i];
                  const nodeName = item.nodeName;
                  
                  if (nodeName !== '#text' || (item.nodeValue && item.nodeValue.trim() !== '')) {
                    if (nodeName === '#text') {
                      obj['#text'] = item.nodeValue?.trim() || "";
                    } else {
                      const itemObj = xmlToJson(item as Element);
                      
                      if (obj[nodeName]) {
                        // 如果已经存在同名节点，转换为数组
                        if (!Array.isArray(obj[nodeName])) {
                          obj[nodeName] = [obj[nodeName]];
                        }
                        (obj[nodeName] as unknown[]).push(itemObj);
                      } else {
                        obj[nodeName] = itemObj;
                      }
                    }
                  }
                }
              }
            }
            
            return obj;
          };
          
          const jsonObj = xmlToJson(xmlDoc.documentElement);
          result = JSON.stringify(jsonObj, null, 2);
        } catch (e) {
          throw new Error('XML解析失败，请检查输入');
        }
      } else if (tool === 'json-to-yaml') {
        // JSON转YAML
        try {
          const obj = JSON.parse(input);
          
          // 简单的JSON到YAML转换函数
          const jsonToYaml = (obj: any, indent: number = 0): string => {
            const spaces = ' '.repeat(indent);
            let yaml = '';
            
            if (Array.isArray(obj)) {
              if (obj.length === 0) return spaces + '[]';
              
              for (const item of obj) {
                if (typeof item === 'object' && item !== null) {
                  yaml += spaces + '-\n' + jsonToYaml(item, indent + 2).trimStart();
                } else {
                  yaml += spaces + '- ' + item + '\n';
                }
              }
            } else if (typeof obj === 'object' && obj !== null) {
              if (Object.keys(obj).length === 0) return spaces + '{}';
              
              for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  const value = obj[key];
                  
                  if (typeof value === 'object' && value !== null) {
                    yaml += spaces + key + ':\n' + jsonToYaml(value, indent + 2);
                  } else {
                    yaml += spaces + key + ': ' + value + '\n';
                  }
                }
              }
            } else {
              yaml += spaces + obj + '\n';
            }
            
            return yaml;
          };
          
          result = jsonToYaml(obj);
        } catch (e) {
          throw new Error('JSON解析失败，请检查输入');
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
      addToHistory({
        category,
        tool,
        input,
        output: result,
      });
      
      // 增加工具使用次数
      incrementToolUsage(tool);
      
      toast.success('处理成功');
    } catch (error) {
      console.error('处理错误:', error);
      let errorMessage = '处理失败，请检查输入';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [input, key, category, tool, addToHistory, incrementToolUsage]);
  
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
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t(tool)}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t(`${tool}.description`)}</p>
        
        {/* 添加帮助信息 */}
        {t(`${tool}.help`) && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm">
            <p>{t(`${tool}.help`)}</p>
            
            {/* 添加示例按钮 */}
            {t(`${tool}.example`) && (
              <button
                onClick={() => setInput(t(`${tool}.example`))}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
              >
                加载示例
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 输入区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('input')}</h2>
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
              title={t('clear')}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder={`${t('input')}...`}
          ></textarea>
          
          {/* 密钥输入框（仅对特定工具显示） */}
          {tool === 'aes' && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <KeyIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">密钥</label>
              </div>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入加密/解密密钥..."
              />
            </div>
          )}
        </div>
        
        {/* 输出区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('output')}</h2>
            <button
              onClick={handleCopy}
              disabled={!result}
              className={`text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 ${!result ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={t('copy')}
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white overflow-auto">
            <pre className="whitespace-pre-wrap break-words">{processedResult}</pre>
          </div>
        </div>
      </div>
      
      {/* 处理按钮 */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !input}
          className={`w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 ${(isProcessing || !input) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 sm:ml-4">
          快捷键: {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
        </span>
      </div>
    </div>
  );
} 