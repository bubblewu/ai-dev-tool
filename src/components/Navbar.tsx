'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory } from '@/contexts/HistoryContext';
import ThemeToggle from './ThemeToggle';
import { 
  HomeIcon, 
  ClockIcon, 
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { history } = useHistory();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const recentDropdownRef = useRef<HTMLDivElement>(null);

  // 获取最近使用的5个工具
  const recentTools = history.slice(0, 5).map(item => ({
    id: item.tool,
    category: item.category,
    name: t(item.tool),
    timestamp: item.timestamp
  }));

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

  // 切换最近使用下拉菜单
  const toggleRecent = () => {
    setIsRecentOpen(!isRecentOpen);
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

  // 点击外部关闭搜索框和最近使用下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (recentDropdownRef.current && !recentDropdownRef.current.contains(event.target as Node)) {
        setIsRecentOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 格式化日期
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        
        <div className="flex items-center md:order-2 space-x-3">
          {/* 搜索按钮 */}
          <div className="relative" ref={searchDropdownRef}>
            <button
              type="button"
              onClick={toggleSearch}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span className="sr-only">搜索</span>
            </button>
            
            {/* 搜索下拉框 */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg dark:bg-gray-700 p-3">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="search"
                      ref={searchInputRef}
                      className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder={t('search.placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* 最近使用按钮 */}
          <div className="relative" ref={recentDropdownRef}>
            <button
              type="button"
              onClick={toggleRecent}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none flex items-center"
            >
              <ClockIcon className="w-5 h-5 mr-1" />
              <span className="hidden md:inline-block text-sm">最近使用</span>
              <ChevronDownIcon className="w-4 h-4 ml-1" />
            </button>
            
            {/* 最近使用下拉菜单 */}
            {isRecentOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg dark:bg-gray-700 p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">最近使用的工具</h3>
                {recentTools.length > 0 ? (
                  <ul className="space-y-2">
                    {recentTools.map((tool, index) => (
                      <li key={index} className="text-sm">
                        <Link 
                          href={`/tools/${tool.category}/${tool.id}`}
                          className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                          onClick={() => setIsRecentOpen(false)}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{tool.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tool.timestamp)}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">暂无使用记录</p>
                )}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <Link 
                    href="/history"
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex justify-center items-center"
                    onClick={() => setIsRecentOpen(false)}
                  >
                    查看全部历史记录
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* 语言切换按钮 */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
          >
            <LanguageIcon className="w-5 h-5" />
            <span className="sr-only">切换语言</span>
          </button>
          
          {/* 主题切换按钮 */}
          <ThemeToggle />
          
          {/* 移动端菜单按钮 */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
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