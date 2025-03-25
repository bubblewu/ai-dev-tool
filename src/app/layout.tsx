import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { Toaster } from "react-hot-toast";

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
    <html lang="zh" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <LanguageProvider>
              <HistoryProvider>
                <StatsProvider>
                  <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900">
                    <Navbar />
                    <main className="flex-grow w-full bg-gray-50 dark:bg-gray-900">
                      {children}
                    </main>
                    <Footer />
                  </div>
                  <Toaster position="top-right" />
                </StatsProvider>
              </HistoryProvider>
            </LanguageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
