'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import ToolCard from '@/components/ToolCard';
import PopularToolsSidebar from '@/components/layout/PopularToolsSidebar';

// 工具分类
const categories = [
  { 
    id: 'encode-decode', 
    icon: '🔄', 
    color: 'bg-blue-100 dark:bg-blue-900',
    tools: [
      { id: 'base64', name: 'Base64 编码/解码', description: 'Base64 编码和解码工具' },
      { id: 'url-encode', name: 'URL 编码/解码', description: 'URL 编码和解码工具' },
      { id: 'html-encode', name: 'HTML 编码/解码', description: 'HTML 编码和解码工具' },
      { id: 'jwt-decode', name: 'JWT 解码', description: 'JWT 令牌解码工具' }
    ]
  },
  { 
    id: 'format', 
    icon: '📝', 
    color: 'bg-green-100 dark:bg-green-900',
    tools: [
      { id: 'json-format', name: 'JSON 格式化', description: 'JSON 数据格式化工具' },
      { id: 'html-format', name: 'HTML 格式化', description: 'HTML 代码格式化工具' },
      { id: 'xml-format', name: 'XML 格式化', description: 'XML 数据格式化工具' },
      { id: 'css-format', name: 'CSS 格式化', description: 'CSS 代码格式化工具' },
      { id: 'sql-format', name: 'SQL 格式化', description: 'SQL 查询格式化工具' }
    ]
  },
  { 
    id: 'encrypt', 
    icon: '🔒', 
    color: 'bg-purple-100 dark:bg-purple-900',
    tools: [
      { id: 'md5', name: 'MD5 加密', description: 'MD5 哈希加密工具' },
      { id: 'sha1', name: 'SHA1 加密', description: 'SHA1 哈希加密工具' },
      { id: 'sha256', name: 'SHA256 加密', description: 'SHA256 哈希加密工具' },
      { id: 'aes', name: 'AES 加密', description: 'AES 加密/解密工具' },
      { id: 'bcrypt', name: 'BCrypt 加密', description: 'BCrypt 密码哈希工具' }
    ]
  },
  { 
    id: 'converters', 
    icon: '🔄', 
    color: 'bg-yellow-100 dark:bg-yellow-900',
    tools: [
      { id: 'json-to-xml', name: 'JSON 转 XML', description: 'JSON 数据转换为 XML' },
      { id: 'xml-to-json', name: 'XML 转 JSON', description: 'XML 数据转换为 JSON' },
      { id: 'json-to-yaml', name: 'JSON 转 YAML', description: 'JSON 数据转换为 YAML' },
      { id: 'yaml-to-json', name: 'YAML 转 JSON', description: 'YAML 数据转换为 JSON' },
      { id: 'csv-to-json', name: 'CSV 转 JSON', description: 'CSV 数据转换为 JSON' },
      { id: 'json-to-csv', name: 'JSON 转 CSV', description: 'JSON 数据转换为 CSV' }
    ]
  },
  { 
    id: 'generators', 
    icon: '⚙️', 
    color: 'bg-red-100 dark:bg-red-900',
    tools: [
      { id: 'uuid', name: 'UUID 生成器', description: '生成唯一标识符' },
      { id: 'password', name: '密码生成器', description: '生成安全密码' },
      { id: 'lorem-ipsum', name: 'Lorem Ipsum', description: '生成示例文本' },
      { id: 'jwt-generator', name: 'JWT 生成器', description: '生成 JWT 令牌' }
    ]
  },
  { 
    id: 'text-tools', 
    icon: '📄', 
    color: 'bg-indigo-100 dark:bg-indigo-900',
    tools: [
      { id: 'text-diff', name: '文本对比', description: '比较两段文本的差异' },
      { id: 'text-case-converter', name: '文本大小写转换', description: '转换文本大小写' },
      { id: 'markdown-preview', name: 'Markdown 预览', description: '预览 Markdown 渲染效果' },
      { id: 'regex-tester', name: '正则表达式测试', description: '测试正则表达式' }
    ]
  },
  { 
    id: 'calculators', 
    icon: '🧮', 
    color: 'bg-pink-100 dark:bg-pink-900',
    tools: [
      { id: 'color-converter', name: '颜色转换器', description: '转换颜色格式' },
      { id: 'unit-converter', name: '单位转换器', description: '转换不同单位' },
      { id: 'date-calculator', name: '日期计算器', description: '计算日期和时间' },
      { id: 'number-base-converter', name: '进制转换器', description: '转换不同进制' }
    ]
  }
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* 工具列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <ToolCard
                key={cat.id}
                id={cat.id}
                category={cat.id}
                name={t(cat.id)}
                description={t(`${cat.id}.description`)}
                tools={cat.tools.map((tool) => ({
                  id: tool.id,
                  name: t(tool.id),
                  description: t(`${tool.id}.description`)
                }))}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <PopularToolsSidebar />
        </div>
      </div>
    </div>
  );
}
