'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import { 
  HomeIcon, 
  ClockIcon, 
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">
            {t('toolbox')}
          </span>
        </Link>
        
        <div className="flex md:order-2 items-center space-x-3">
          <ThemeToggle />
          
          <button 
            onClick={toggleLanguage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center"
          >
            <LanguageIcon className="w-4 h-4 mr-1" />
            {language === 'zh' ? 'English' : '中文'}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
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