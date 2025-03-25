import Link from 'next/link';

export default function Home() {
  // 工具分类
  const toolCategories = [
    {
      id: 'encode-decode',
      name: '编码转换',
      tools: [
        { id: 'base64', name: 'Base64编码解码' },
        { id: 'url-encode', name: 'URL编码解码' },
      ]
    },
    {
      id: 'format',
      name: '格式化工具',
      tools: [
        { id: 'json-format', name: 'JSON格式化' },
        { id: 'html-format', name: 'HTML格式化' },
      ]
    },
    {
      id: 'encrypt',
      name: '加密解密',
      tools: [
        { id: 'md5', name: 'MD5加密' },
        { id: 'sha1', name: 'SHA1加密' },
      ]
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">AI开发工具箱</h1>
        <p className="text-gray-600 dark:text-gray-300">一站式开发工具集合，提高您的开发效率</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolCategories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{category.name}</h2>
            <ul className="space-y-2">
              {category.tools.map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${category.id}/${tool.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
