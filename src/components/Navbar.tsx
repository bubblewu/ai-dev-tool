'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import { 
  HomeIcon, 
  ClockIcon, 
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  LanguageIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // 切换语言
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };

  // 切换搜索框
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // 当打开搜索框时，等待DOM更新后聚焦输入框
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // 关闭搜索框时清空搜索内容
      setSearchTerm('');
    }
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 执行搜索逻辑 - 跳转到首页并带上搜索参数
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
    }
  };

  // 点击外部关闭搜索框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex flex-col">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
            {t('toolbox')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('toolbox.description')}
          </span>
        </Link>
        
        <div className="flex items-center md:order-2 space-x-2">
          {/* 搜索按钮 */}
          <button
            onClick={toggleSearch}
            className="p-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="搜索"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
          
          {/* 搜索下拉框 */}
          <div className="relative" ref={searchDropdownRef}>
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-3">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="search"
                      className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder={t('search.placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          <ThemeToggle />
          
          <button 
            onClick={toggleLanguage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center"
            aria-label="切换语言"
          >
            <LanguageIcon className="w-4 h-4 mr-1" />
            {language === 'zh' ? 'English' : '中文'}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
            aria-label="菜单"
          >
            <span className="sr-only">打开主菜单</span>
            {isMenuOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link 
                href="/" 
                className={`block py-2 pl-3 pr-4 rounded md:p-0 flex items-center ${
                  pathname === '/' 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="w-5 h-5 mr-1 md:mr-2" />
                {t('home')}
              </Link>
            </li>
            <li>
              <Link 
                href="/history" 
                className={`block py-2 pl-3 pr-4 rounded md:p-0 flex items-center ${
                  pathname === '/history' 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ClockIcon className="w-5 h-5 mr-1 md:mr-2" />
                {t('history')}
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className={`block py-2 pl-3 pr-4 rounded md:p-0 flex items-center ${
                  pathname === '/about' 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <InformationCircleIcon className="w-5 h-5 mr-1 md:mr-2" />
                {t('about')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 