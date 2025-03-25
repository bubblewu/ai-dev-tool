'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from "next-themes";
import { 
  HomeIcon, 
  ClockIcon, 
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<typeof categories>([]);
  const [hiddenCategories, setHiddenCategories] = useState<typeof categories>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const moreCategoriesRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

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
      // 关闭搜索框
      setIsSearchOpen(false);
      // 导航到首页并带上搜索参数
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (moreCategoriesRef.current && !moreCategoriesRef.current.contains(event.target as Node)) {
        setIsMoreCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 关闭菜单当路由变化时
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // 修改主题切换函数
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 根据导航栏宽度调整可见类别
  useEffect(() => {
    const calculateVisibleCategories = () => {
      if (!navRef.current || !navContainerRef.current) return;
      
      const navWidth = navRef.current.offsetWidth;
      const containerWidth = navContainerRef.current.offsetWidth;
      const mainNavItems = navRef.current.querySelectorAll('.main-nav-item');
      const mainNavItemsWidth = Array.from(mainNavItems).reduce((total, item) => total + item.clientWidth, 0);
      
      // 计算可用于类别的宽度
      const availableWidth = navWidth - mainNavItemsWidth - 50; // 50px 作为缓冲
      
      // 每个类别项的估计宽度
      const categoryItemWidth = 100; // 根据实际情况调整
      
      // 计算可以显示的类别数量
      const visibleCount = Math.max(1, Math.floor(availableWidth / categoryItemWidth));
      
      // 更新可见和隐藏的类别
      setVisibleCategories(categories.slice(0, visibleCount));
      setHiddenCategories(categories.slice(visibleCount));
    };
    
    // 初始计算
    calculateVisibleCategories();
    
    // 监听窗口大小变化
    window.addEventListener('resize', calculateVisibleCategories);
    
    return () => {
      window.removeEventListener('resize', calculateVisibleCategories);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-30">
      <div ref={navContainerRef} className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex flex-col">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
            {t('toolbox')}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
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
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg dark:bg-gray-700 p-2 z-50">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                </form>
              </div>
            )}
          </div>
          
          {/* 历史记录和关于链接 - 仅在桌面显示 */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/history" 
              className={`p-2 rounded-md flex items-center ${
                pathname === '/history' 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <ClockIcon className="w-5 h-5 mr-1" />
              <span className="text-sm">{t('history')}</span>
            </Link>
            
            <Link 
              href="/about" 
              className={`p-2 rounded-md flex items-center ${
                pathname === '/about' 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <InformationCircleIcon className="w-5 h-5 mr-1" />
              <span className="text-sm">{t('about')}</span>
            </Link>
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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
          
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
        
        <div 
          ref={navRef}
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-1 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            {/* 主导航项 - 仅保留首页 */}
            <li className="main-nav-item">
              <Link 
                href="/" 
                className={`block py-2 pl-3 pr-4 rounded md:p-2 flex items-center ${
                  pathname === '/' 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="w-5 h-5 mr-1" />
                <span className="text-sm">{t('home')}</span>
              </Link>
            </li>
            
            {/* 移动端显示历史记录和关于链接 */}
            <li className="md:hidden">
              <Link 
                href="/history" 
                className={`block py-2 pl-3 pr-4 rounded flex items-center ${
                  pathname === '/history' 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ClockIcon className="w-5 h-5 mr-1" />
                {t('history')}
              </Link>
            </li>
            <li className="md:hidden">
              <Link 
                href="/about" 
                className={`block py-2 pl-3 pr-4 rounded flex items-center ${
                  pathname === '/about' 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <InformationCircleIcon className="w-5 h-5 mr-1" />
                {t('about')}
              </Link>
            </li>
            
            {/* 分隔线 */}
            <li className="hidden md:block border-r border-gray-300 dark:border-gray-700 h-6 self-center mx-1"></li>
            
            {/* 可见类别 */}
            {visibleCategories.map(category => (
              <li key={category.id}>
                <Link 
                  href={`/?category=${category.id}`}
                  className="block py-2 pl-3 pr-4 rounded md:p-1.5 flex items-center text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-1">{category.icon}</span>
                  <span className="text-xs md:text-xs">{t(category.id)}</span>
                </Link>
              </li>
            ))}
            
            {/* 更多类别按钮 */}
            {hiddenCategories.length > 0 && (
              <li className="relative" ref={moreCategoriesRef}>
                <button
                  onClick={() => setIsMoreCategoriesOpen(!isMoreCategoriesOpen)}
                  className="block py-2 pl-3 pr-4 rounded md:p-1.5 flex items-center text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                  <span className="text-xs md:text-xs ml-1">更多</span>
                </button>
                
                {/* 更多类别下拉菜单 */}
                {isMoreCategoriesOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg dark:bg-gray-700 p-2 z-50">
                    {hiddenCategories.map(category => (
                      <Link 
                        key={category.id}
                        href={`/?category=${category.id}`}
                        className="block p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => {
                          setIsMoreCategoriesOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span className="text-sm">{t(category.id)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}
            
            {/* 移动端类别列表 */}
            <li className="md:hidden mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="block pl-3 pr-4 text-gray-500 dark:text-gray-400 font-medium mb-2">
                {t('categories')}
              </span>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      href={`/?category=${category.id}`}
                      className="block py-2 pl-6 pr-4 rounded flex items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {t(category.id)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 