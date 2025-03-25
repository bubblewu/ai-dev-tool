'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">
            {t('toolbox')}
          </span>
        </Link>
        
        <div className="flex md:order-2">
          <button 
            onClick={toggleLanguage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {language === 'zh' ? 'English' : '中文'}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
          >
            <span className="sr-only">打开主菜单</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-800 dark:border-gray-700">
            <li>
              <Link href="/" className={`block py-2 pl-3 pr-4 rounded md:p-0 ${pathname === '/' ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>
                {t('home')}
              </Link>
            </li>
            <li>
              <Link href="/about" className={`block py-2 pl-3 pr-4 rounded md:p-0 ${pathname === '/about' ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>
                {t('about')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 