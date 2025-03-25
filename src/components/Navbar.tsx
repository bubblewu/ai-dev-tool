'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
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
    <nav className={`sticky top-0 z-50 bg-white dark:bg-gray-800 transition-shadow ${
      scrolled ? 'shadow-md' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl mr-2">🛠️</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden md:block">
                {t('toolbox')}
              </span>
            </Link>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-1">
            {/* 分类下拉菜单 */}
            <div className="relative group">
              <button 
                className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                <span>{t('categories')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 分类下拉内容 */}
              <div className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transition-opacity duration-150 ${
                isCategoryMenuOpen ? 'opacity-100' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
                <div className="py-1 grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/?category=${category.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span>{t(category.id)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 其他导航链接 */}
            <Link 
              href="/history" 
              className={`px-3 py-2 rounded-md ${
                pathname === '/history' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('history')}
            </Link>
            
            <Link 
              href="/about" 
              className={`px-3 py-2 rounded-md ${
                pathname === '/about' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('about')}
            </Link>
          </div>

          {/* 搜索栏和主题切换 */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block w-64">
              <form className="relative">
                <div className="flex items-center rounded-md bg-gray-100 dark:bg-gray-700">
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
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
            <ThemeToggle />
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-4 py-2">
              <form className="relative">
                <div className="flex items-center rounded-md bg-gray-100 dark:bg-gray-700">
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="w-full py-2 px-3 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
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
            
            {/* 分类折叠菜单 */}
            <div>
              <button
                className="w-full flex justify-between items-center px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                <span>{t('categories')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isCategoryMenuOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`transition-all duration-300 ${
                isCategoryMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <div className="grid grid-cols-2 gap-1 px-4 py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/?category=${category.id}`}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setIsCategoryMenuOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span>{t(category.id)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link 
              href="/history" 
              className={`block px-4 py-2 ${
                pathname === '/history' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('history')}
            </Link>
            
            <Link 
              href="/about" 
              className={`block px-4 py-2 ${
                pathname === '/about' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 