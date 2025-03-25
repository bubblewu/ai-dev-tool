import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI开发工具箱 | 实用在线工具集合",
  description: "提供各种实用的在线开发工具，包括编码转换、加密解密、格式化工具等",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
