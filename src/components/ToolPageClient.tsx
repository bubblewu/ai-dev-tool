'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory } from '@/contexts/HistoryContext';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { 
  ArrowPathIcon, 
  ClipboardDocumentIcon, 
  TrashIcon,
  KeyIcon,
  DocumentTextIcon,
  ShareIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon
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
  const [output, setOutput] = useState('');
  const [key, setKey] = useState(''); // 用于AES加密的密钥
  const { t } = useLanguage();
  const { addToHistory } = useHistory();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { incrementToolUsage } = useStats();
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [indentSize, setIndentSize] = useState(2); // 例如：JSON格式化的缩进大小

  // 获取当前工具名称
  const toolName = t(tool);

  // 复制到剪贴板
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      toast.success(t('copied'));
    }).catch(err => {
      console.error('复制失败:', err);
    });
  }, [output, t]);

  // 清空输入和输出
  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    if (tool === 'aes') {
      setKey('');
    }
  }, [tool]);

  // 处理工具操作
  const handleProcess = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // 增加工具使用次数
      incrementToolUsage(tool);
      
      let result = '';
      
      if (category === 'encode-decode') {
        if (tool === 'base64') {
          result = processBase64(input);
        } else if (tool === 'url-encode') {
          result = processUrlEncode(input);
        } else if (tool === 'html-encode') {
          result = processHtmlEncode(input);
        }
      } else if (category === 'format') {
        if (tool === 'json-format') {
          result = processJsonFormat(input, indentSize);
        } else if (tool === 'html-format') {
          result = processHtmlFormat(input);
        } else if (tool === 'xml-format') {
          result = processXmlFormat(input);
        } else if (tool === 'css-format') {
          result = processCssFormat(input);
        }
      } else if (category === 'encrypt') {
        if (tool === 'md5') {
          // 使用 crypto-js 实现 MD5 加密
          result = CryptoJS.MD5(input).toString();
        } else if (tool === 'sha1') {
          // 使用 crypto-js 实现 SHA1 加密
          result = CryptoJS.SHA1(input).toString();
        } else if (tool === 'sha256') {
          // 使用 crypto-js 实现 SHA256 加密
          result = CryptoJS.SHA256(input).toString();
        } else if (tool === 'aes') {
          // 使用 crypto-js 实现 AES 加密/解密
          if (!key) {
            throw new Error('请输入密钥');
          }
          
          // 检测是加密还是解密
          try {
            // 尝试解析为JSON，如果成功，可能是加密后的数据
            const parsed = JSON.parse(input);
            if (parsed.ct && parsed.iv && parsed.s) {
              // 看起来是加密后的数据，尝试解密
              const decrypted = CryptoJS.AES.decrypt(
                CryptoJS.lib.CipherParams.create({
                  ciphertext: CryptoJS.enc.Base64.parse(parsed.ct),
                  iv: CryptoJS.enc.Base64.parse(parsed.iv),
                  salt: CryptoJS.enc.Base64.parse(parsed.s)
                }),
                key
              ).toString(CryptoJS.enc.Utf8);
              
              if (!decrypted) {
                throw new Error('解密失败，请检查密钥是否正确');
              }
              
              result = decrypted;
            } else {
              // 不是标准格式，尝试加密
              const encrypted = CryptoJS.AES.encrypt(input, key);
              result = JSON.stringify({
                ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
                iv: encrypted.iv.toString(CryptoJS.enc.Base64),
                s: encrypted.salt.toString(CryptoJS.enc.Base64)
              });
            }
          } catch (e) {
            // 解析JSON失败，执行加密
            const encrypted = CryptoJS.AES.encrypt(input, key);
            result = JSON.stringify({
              ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
              iv: encrypted.iv.toString(CryptoJS.enc.Base64),
              s: encrypted.salt.toString(CryptoJS.enc.Base64)
            });
          }
        }
      } else if (category === 'converters') {
        if (tool === 'json-to-xml') {
          try {
            const obj = JSON.parse(input);
            
            // 简单的JSON到XML转换函数
            const jsonToXml = (obj: Record<string, unknown>, rootName = 'root'): string => {
              let xml = `<${rootName}>`;
              
              for (const prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                  const value = obj[prop];
                  if (Array.isArray(value)) {
                    for (const item of value) {
                      if (typeof item === 'object' && item !== null) {
                        xml += jsonToXml(item as Record<string, unknown>, prop);
                      } else {
                        xml += `<${prop}>${item}</${prop}>`;
                      }
                    }
                  } else if (typeof value === 'object' && value !== null) {
                    xml += jsonToXml(value as Record<string, unknown>, prop);
                  } else {
                    xml += `<${prop}>${value}</${prop}>`;
                  }
                }
              }
              
              xml += `</${rootName}>`;
              return xml;
            };
            
            result = jsonToXml(obj);
            
            // 格式化XML
            result = processXmlFormat(result);
          } catch (e) {
            throw new Error('JSON解析失败，请检查输入');
          }
        } else if (tool === 'xml-to-json') {
          try {
            // 创建DOM解析器
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(input, 'text/xml');
            
            // 检查解析错误
            const parserError = xmlDoc.getElementsByTagName('parsererror');
            if (parserError.length > 0) {
              throw new Error('XML解析失败，请检查输入');
            }
            
            // XML到JSON转换函数
            const xmlToJson = (xml: Node): Record<string, unknown> => {
              // 创建空对象
              let obj: Record<string, unknown> = {};
              
              // 如果是元素节点
              if (xml.nodeType === 1) {
                // 处理属性
                if ((xml as Element).attributes && (xml as Element).attributes.length > 0) {
                  obj["@attributes"] = {};
                  for (let i = 0; i < (xml as Element).attributes.length; i++) {
                    const attribute = (xml as Element).attributes[i];
                    (obj["@attributes"] as Record<string, unknown>)[attribute.nodeName] = attribute.nodeValue;
                  }
                }
              } else if (xml.nodeType === 3) { // 文本节点
                obj = xml.nodeValue?.trim() || "";
                return obj;
              }
              
              // 处理子节点
              if (xml.hasChildNodes()) {
                for (let i = 0; i < xml.childNodes.length; i++) {
                  const item = xml.childNodes[i];
                  const nodeName = item.nodeName;
                  
                  if (nodeName !== '#text' || (item.nodeValue && item.nodeValue.trim() !== '')) {
                    if (nodeName === '#text') {
                      obj = item.nodeValue?.trim() || "";
                    } else {
                      const itemObj = xmlToJson(item);
                      
                      if (Object.keys(itemObj).length > 0) {
                        if (obj[nodeName] === undefined) {
                          obj[nodeName] = itemObj;
                        } else {
                          if (!Array.isArray(obj[nodeName])) {
                            obj[nodeName] = [obj[nodeName]];
                          }
                          (obj[nodeName] as unknown[]).push(itemObj);
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
          try {
            const obj = JSON.parse(input);
            
            // JSON到YAML转换函数
            const jsonToYaml = (obj: Record<string, unknown>, indent = 0): string => {
              const spaces = ' '.repeat(indent);
              let yaml = '';
              
              for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  const value = obj[key];
                  
                  if (Array.isArray(value)) {
                    yaml += `${spaces}${key}:\n`;
                    for (const item of value) {
                      if (typeof item === 'object' && item !== null) {
                        yaml += `${spaces}- \n${jsonToYaml(item as Record<string, unknown>, indent + 2)}`;
                      } else {
                        yaml += `${spaces}- ${item}\n`;
                      }
                    }
                  } else if (typeof value === 'object' && value !== null) {
                    yaml += `${spaces}${key}:\n${jsonToYaml(value as Record<string, unknown>, indent + 2)}`;
                  } else {
                    yaml += `${spaces}${key}: ${value}\n`;
                  }
                }
              }
              
              return yaml;
            };
            
            result = jsonToYaml(obj);
          } catch (e) {
            throw new Error('JSON解析失败，请检查输入');
          }
        }
      } else if (category === 'generators') {
        if (tool === 'uuid') {
          // 生成UUID
          result = uuidv4();
        } else if (tool === 'password') {
          // 生成随机密码
          const length = 16;
          const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
          let password = '';
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
          }
          result = password;
        } else if (tool === 'lorem-ipsum') {
          // 生成Lorem Ipsum文本
          const paragraphs = 3;
          const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          
          result = '';
          for (let i = 0; i < paragraphs; i++) {
            result += loremIpsum + "\n\n";
          }
          result = result.trim();
        }
      }
      
      setOutput(result);
      
      // 添加到历史记录
      addToHistory({
        timestamp: Date.now(),
        category,
        tool,
        input,
        output: result
      });
    } catch (error) {
      console.error('处理错误:', error);
      setError(typeof error === 'string' ? error : (error instanceof Error ? error.message : '处理过程中发生错误，请检查输入'));
    } finally {
      setIsProcessing(false);
    }
  }, [addToHistory, category, input, key, tool, incrementToolUsage, indentSize]);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter 或 Cmd+Enter 处理
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (input.trim() && !isProcessing) {
          handleProcess();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input, isProcessing, handleProcess]);

  // 自动生成器工具
  useEffect(() => {
    if (category === 'generators' && (tool === 'uuid' || tool === 'password' || tool === 'lorem-ipsum')) {
      handleProcess();
    }
  }, [category, tool, handleProcess]);

  // 分享结果
  const shareResult = useCallback(async () => {
    if (!output) return;
    
    // 创建分享内容
    const shareText = `${toolName} 结果:\n\n${output.substring(0, 500)}${output.length > 500 ? '...' : ''}`;
    
    // 检查是否支持网页分享API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${toolName} - AI开发工具箱`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.error('分享失败:', error);
        // 回退到复制到剪贴板
        copyToClipboard();
      }
    } else {
      // 不支持分享API，直接复制到剪贴板
      copyToClipboard();
      toast.success('已复制到剪贴板，可以粘贴分享');
    }
  }, [output, toolName, copyToClipboard]);

  return (
    <div className="w-full container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {toolName}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="工具设置"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="帮助信息"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {t(`${tool}.description`)}
        </p>
        
        {/* 帮助信息 */}
        {showHelp && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg dark:bg-blue-900/20 dark:text-blue-300">
            <h3 className="font-medium mb-2">使用说明</h3>
            <p className="text-sm mb-2">{t(`${tool}.help`)}</p>
            <h4 className="font-medium text-sm mt-3 mb-1">示例:</h4>
            <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto">
              {t(`${tool}.example`)}
            </pre>
          </div>
        )}
      </div>
      
      {/* 工具设置 */}
      {showSettings && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
          <h3 className="font-medium mb-3">工具设置</h3>
          {(tool === 'json-format' || tool === 'xml-format' || tool === 'css-format') && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                缩进大小
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              >
                <option value="2">2 空格</option>
                <option value="4">4 空格</option>
                <option value="8">8 空格</option>
              </select>
            </div>
          )}
          {/* 其他工具特定设置 */}
        </div>
      )}
      
      <div className="space-y-6">
        {/* AES加密特殊处理 - 显示密钥输入框 */}
        {tool === 'aes' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <KeyIcon className="w-5 h-5 mr-1" />
                密钥
              </label>
            </div>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="请输入加密/解密密钥"
            />
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-1" />
              {t('input')}
            </label>
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              {t('clear')}
            </button>
          </div>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('input.placeholder')}
            disabled={category === 'generators' && (tool === 'uuid' || tool === 'password')}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-1" />
              {t('output')}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={shareResult}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                disabled={!output}
              >
                <ShareIcon className="w-4 h-4 mr-1" />
                {t('share')}
              </button>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                disabled={!output}
              >
                <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                {t('copy')}
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={output}
            readOnly
            placeholder="处理结果将显示在这里..."
          />
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !input.trim()}
          className="px-8 py-3 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </>
          ) : (
            <>
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              {t('process')}
            </>
          )}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          快捷键: {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
        </span>
      </div>
    </div>
  );
} 