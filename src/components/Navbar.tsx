'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';

// 工具分类
const categories = [
  { id: 'encode-decode', icon: '🔄' },
  { id: 'format', icon: '📝' },
  { id: 'encrypt', icon: '🔒' },
  { id: 'converters', icon: '🔄' },
  { id: 'generators', icon: '⚙️' },
  { id: 'text-tools', icon: '📄' },
  { id: 'calculators', icon: '🧮' },
  { id: 'time-tools', icon: '⏱️' },
];

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category') || '';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 监听滚动事件，添加导航栏阴影
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-800 transition-shadow ${
      scrolled ? 'shadow-md' : 'border-b border-gray-200 dark:border-gray-700'
    }`}>
      {/* 顶部导航栏 */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl mr-2">🛠️</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
                {t('toolbox')}
              </span>
            </Link>
          </div>

          {/* 右侧导航和工具 */}
          <div className="flex items-center space-x-3">
            {/* 搜索栏 */}
            <div className="hidden md:block w-64">
              <form className="relative">
                <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="w-full py-1.5 px-3 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none rounded-lg"
                  />
                  <button
                    type="submit"
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            
            {/* 历史记录和关于链接 */}
            <div className="hidden md:flex items-center">
              <Link 
                href="/history" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/history' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {t('history')}
              </Link>
              
              <Link 
                href="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/about' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {t('about')}
              </Link>
            </div>
            
            {/* 主题切换 */}
            <ThemeToggle />
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="菜单"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 类别导航栏 - 平铺展示 */}
      <div className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex overflow-x-auto py-2 space-x-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?category=${category.id}`}
                className={`flex items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                <span>{t(category.id)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-4 pt-2 pb-3 space-y-3">
          <div className="px-2 py-2">
            <form className="relative">
              <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none rounded-lg"
                />
                <button
                  type="submit"
                  className="p-2 text-gray-500 dark:text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          {/* 移动端类别列表 - 平铺展示 */}
          <div className="px-2 py-2">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 px-2">
              {t('categories')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    activeCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span>{t(category.id)}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <Link 
              href="/history" 
              className={`block px-4 py-2 rounded-md ${
                pathname === '/history' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('history')}
            </Link>
            
            <Link 
              href="/about" 
              className={`block px-4 py-2 rounded-md ${
                pathname === '/about' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 