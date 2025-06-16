import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} AI开发工具箱. 保留所有权利.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
              关于我们
            </Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
              使用条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 