import { Metadata } from 'next';
import ToolPageClient from '@/components/ToolPageClient';
import PopularToolsSidebar from '@/components/layout/PopularToolsSidebar';
import { getTranslation } from '@/utils/helpers/i18n';

interface ToolPageProps {
  params: Promise<{
    category: string;
    tool: string;
  }>;
}

// 动态生成页面元数据
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { tool } = resolvedParams;
  const t = getTranslation('zh'); // 默认使用中文
  
  return {
    title: `${t(tool)} | ${t('toolbox')}`,
    description: t(`${tool}.description`) || t('toolbox.description'),
  };
}

// 将组件标记为异步组件
export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const { category, tool } = resolvedParams;
  
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <ToolPageClient category={category} tool={tool} />
      <PopularToolsSidebar />
    </div>
  );
} 