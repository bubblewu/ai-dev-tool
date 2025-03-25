import ToolPageClient from '@/components/ToolPageClient';

// 服务器组件
export default function ToolPage({ params }: { params: { category: string; tool: string } }) {
  return <ToolPageClient category={params.category} tool={params.tool} />;
} 