import { Metadata } from 'next';
import ToolPageClient from '@/components/ToolPageClient';
import PopularToolsSidebar from '@/components/PopularToolsSidebar';
import { getTranslation } from '@/utils/i18n';

interface ToolPageProps {
  params: {
    category: string;
    tool: string;
  };
}

// 动态生成页面元数据
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool } = params;
  const t = getTranslation('zh'); // 默认使用中文
  
  return {
    title: `${t(tool)} | ${t('toolbox')}`,
    description: t(`${tool}.description`) || t('toolbox.description'),
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const { category, tool } = params;
  
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <ToolPageClient category={category} tool={tool} />
      <PopularToolsSidebar />
    </div>
  );
} 