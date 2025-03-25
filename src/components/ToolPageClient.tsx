'use client';

import { useState } from 'react';
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
  DocumentTextIcon
} from '@heroicons/react/24/outline';

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

  // 获取当前工具名称
  const toolName = t(tool);

  // 复制到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      toast.success(t('copied'));
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  // 清空输入和输出
  const clearAll = () => {
    setInput('');
    setOutput('');
    if (tool === 'aes') {
      setKey('');
    }
  };

  // 处理工具操作
  const handleProcess = () => {
    let result = '';
    
    if (category === 'encode-decode') {
      if (tool === 'base64') {
        try {
          // 检测是编码还是解码
          if (/^[A-Za-z0-9+/=]+$/.test(input.trim())) {
            // 看起来是Base64，尝试解码
            try {
              // 先尝试标准的 atob
              result = atob(input);
            } catch (e) {
              // 如果失败，尝试解码 UTF-8 字符
              result = decodeURIComponent(escape(atob(input)));
            }
          } else {
            // 编码 - 使用 UTF-8 安全的方法
            result = btoa(unescape(encodeURIComponent(input)));
          }
        } catch (error) {
          // 使用错误信息
          console.error('Base64处理错误:', error);
          result = '处理出错，请检查输入';
        }
      } else if (tool === 'url-encode') {
        try {
          // 检测是编码还是解码
          if (input.includes('%')) {
            // 看起来是URL编码，尝试解码
            result = decodeURIComponent(input);
          } else {
            // 编码
            result = encodeURIComponent(input);
          }
        } catch (error) {
          // 使用错误信息
          console.error('URL编码处理错误:', error);
          result = '处理出错，请检查输入';
        }
      } else if (tool === 'html-encode') {
        try {
          // 检测是编码还是解码
          if (input.includes('&lt;') || input.includes('&gt;')) {
            // 看起来是HTML编码，尝试解码
            const textarea = document.createElement('textarea');
            textarea.innerHTML = input;
            result = textarea.value;
          } else {
            // 编码
            const div = document.createElement('div');
            div.textContent = input;
            result = div.innerHTML;
          }
        } catch (error) {
          console.error('HTML编码处理错误:', error);
          result = '处理出错，请检查输入';
        }
      }
    } else if (category === 'format') {
      if (tool === 'json-format') {
        try {
          const parsed = JSON.parse(input);
          result = JSON.stringify(parsed, null, 2);
        } catch (error) {
          // 使用错误信息
          console.error('JSON格式化错误:', error);
          result = 'JSON解析错误，请检查输入';
        }
      } else if (tool === 'html-format') {
        // 简单的HTML格式化，实际项目中可能需要更复杂的处理
        result = input.replace(/></g, '>\n<').replace(/^\s*</gm, '  <');
      } else if (tool === 'xml-format') {
        try {
          // 简单的XML格式化
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(input, "text/xml");
          const serializer = new XMLSerializer();
          const formatted = serializer.serializeToString(xmlDoc)
            .replace(/></g, '>\n<')
            .replace(/^\s*</gm, '  <');
          result = formatted;
        } catch (error) {
          console.error('XML格式化错误:', error);
          result = 'XML解析错误，请检查输入';
        }
      } else if (tool === 'css-format') {
        // 简单的CSS格式化
        try {
          const formatted = input
            .replace(/\s*{\s*/g, ' {\n  ')
            .replace(/\s*;\s*/g, ';\n  ')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\n\s*\n/g, '\n');
          result = formatted;
        } catch (error) {
          console.error('CSS格式化错误:', error);
          result = 'CSS解析错误，请检查输入';
        }
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
        try {
          // 检测是加密还是解密
          if (input.includes('U2FsdGVkX1')) {
            // 看起来是加密文本，尝试解密
            const bytes = CryptoJS.AES.decrypt(input, key);
            result = bytes.toString(CryptoJS.enc.Utf8);
          } else {
            // 加密
            result = CryptoJS.AES.encrypt(input, key).toString();
          }
        } catch (error) {
          console.error('AES处理错误:', error);
          result = '处理出错，请检查输入和密钥';
        }
      }
    } else if (category === 'converters') {
      if (tool === 'json-to-xml') {
        try {
          const obj = JSON.parse(input);
          
          // 简单的JSON到XML转换函数
          const jsonToXml = (obj: any, rootName = 'root'): string => {
            let xml = `<${rootName}>`;
            
            for (const prop in obj) {
              if (obj.hasOwnProperty(prop)) {
                const value = obj[prop];
                
                if (Array.isArray(value)) {
                  for (const item of value) {
                    if (typeof item === 'object' && item !== null) {
                      xml += jsonToXml(item, prop);
                    } else {
                      xml += `<${prop}>${item}</${prop}>`;
                    }
                  }
                } else if (typeof value === 'object' && value !== null) {
                  xml += jsonToXml(value, prop);
                } else {
                  xml += `<${prop}>${value}</${prop}>`;
                }
              }
            }
            
            xml += `</${rootName}>`;
            return xml;
          };
          
          const xml = jsonToXml(obj);
          
          // 格式化XML
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xml, "text/xml");
          const serializer = new XMLSerializer();
          const formatted = serializer.serializeToString(xmlDoc)
            .replace(/></g, '>\n<')
            .replace(/^\s*</gm, '  <');
          
          result = formatted;
        } catch (error) {
          console.error('JSON到XML转换错误:', error);
          result = '转换错误，请检查JSON格式';
        }
      } else if (tool === 'xml-to-json') {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(input, "text/xml");
          
          // 简单的XML到JSON转换函数
          const xmlToJson = (xml: Node): any => {
            // 创建空对象
            let obj: any = {};
            
            // 如果是元素节点
            if (xml.nodeType === 1) {
              // 处理属性
              if (xml.attributes && xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let i = 0; i < xml.attributes.length; i++) {
                  const attribute = xml.attributes[i];
                  obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
              }
            } else if (xml.nodeType === 3) { // 文本节点
              obj = xml.nodeValue?.trim();
              return obj;
            }
            
            // 处理子节点
            if (xml.hasChildNodes()) {
              for (let i = 0; i < xml.childNodes.length; i++) {
                const item = xml.childNodes[i];
                const nodeName = item.nodeName;
                
                if (nodeName === "#text") {
                  if (item.nodeValue?.trim()) {
                    obj["#text"] = item.nodeValue.trim();
                  }
                  continue;
                }
                
                const itemObj = xmlToJson(item);
                
                if (obj[nodeName] === undefined) {
                  obj[nodeName] = itemObj;
                } else {
                  if (!Array.isArray(obj[nodeName])) {
                    obj[nodeName] = [obj[nodeName]];
                  }
                  obj[nodeName].push(itemObj);
                }
              }
            }
            
            return obj;
          };
          
          const json = xmlToJson(xmlDoc);
          result = JSON.stringify(json, null, 2);
        } catch (error) {
          console.error('XML到JSON转换错误:', error);
          result = '转换错误，请检查XML格式';
        }
      } else if (tool === 'json-to-yaml') {
        try {
          const obj = JSON.parse(input);
          
          // 简单的JSON到YAML转换函数
          const jsonToYaml = (obj: any, indent = 0): string => {
            const spaces = ' '.repeat(indent);
            let yaml = '';
            
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                
                if (Array.isArray(value)) {
                  yaml += `${spaces}${key}:\n`;
                  for (const item of value) {
                    if (typeof item === 'object' && item !== null) {
                      yaml += `${spaces}- \n${jsonToYaml(item, indent + 2)}`;
                    } else {
                      yaml += `${spaces}- ${item}\n`;
                    }
                  }
                } else if (typeof value === 'object' && value !== null) {
                  yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 2)}`;
                } else {
                  yaml += `${spaces}${key}: ${value}\n`;
                }
              }
            }
            
            return yaml;
          };
          
          result = jsonToYaml(obj);
        } catch (error) {
          console.error('JSON到YAML转换错误:', error);
          result = '转换错误，请检查JSON格式';
        }
      }
    } else if (category === 'generators') {
      if (tool === 'uuid') {
        // 生成UUID
        result = uuidv4();
      } else if (tool === 'password') {
        // 生成随机密码
        const length = 16;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        result = password;
      } else if (tool === 'lorem-ipsum') {
        // 生成随机文本
        const paragraphs = parseInt(input) || 3;
        const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        let result = "";
        for (let i = 0; i < paragraphs; i++) {
          result += loremIpsum + "\n\n";
        }
        result = result.trim();
      }
    }
    
    // 设置输出结果
    setOutput(result);
    
    // 添加到历史记录
    if (result) {
      addToHistory({
        category,
        tool,
        input,
        output: result
      });
    }
  };

  // 渲染AES加密的额外输入字段
  const renderExtraInputs = () => {
    if (category === 'encrypt' && tool === 'aes') {
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <KeyIcon className="w-5 h-5 mr-1" />
            密钥
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="请输入加密/解密密钥"
          />
        </div>
      );
    }
    
    if (category === 'generators' && tool === 'lorem-ipsum') {
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-1" />
            段落数量
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入段落数量"
            min="1"
            max="10"
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
        <span className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </span>
        {toolName}
      </h1>
      
      {renderExtraInputs()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
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
            placeholder="请输入要处理的内容..."
            disabled={category === 'generators' && (tool === 'uuid' || tool === 'password')}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {t('output')}
            </label>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              disabled={!output}
            >
              <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
              {t('copy')}
            </button>
          </div>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={output}
            readOnly
            placeholder="处理结果将显示在这里..."
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleProcess}
          className="px-8 py-3 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          {t('process')}
        </button>
      </div>
    </div>
  );
} 