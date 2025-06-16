'use client';

import Link from 'next/link';

interface ToolCardProps {
  id: string;
  category: string;
  name: string;
  description: string;
  tools: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export default function ToolCard({ category, name, description, tools }: ToolCardProps) {
  // 获取工具图标
  const getToolIcon = () => {
    const categoryIcons: Record<string, string> = {
      'encode-decode': '🔄',
      'format': '📝',
      'encrypt': '🔒',
      'converters': '🔄',
      'generators': '⚙️',
      'text-tools': '📄',
      'calculators': '🧮',
      'time-tools': '⏱️',
    };
    
    return categoryIcons[category] || '🔧';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{getToolIcon()}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
      <div className="px-5 py-2 bg-gray-50 dark:bg-gray-700/50">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {tools.length} 个工具
        </div>
        <div className="grid grid-cols-1 gap-1">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${category}/${tool.id}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 