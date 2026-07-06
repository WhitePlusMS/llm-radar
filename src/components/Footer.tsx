import { Clock, Database } from 'lucide-react';

interface FooterProps {
  generatedAt?: string;
  modelCount?: number;
  metricCount?: number;
  companyCount?: number;
}

export function Footer({ generatedAt, modelCount, metricCount, companyCount }: FooterProps) {
  const timeText = generatedAt
    ? new Date(generatedAt).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '未知';

  return (
    <footer className="mt-8 border-t border-slate-200 bg-white py-5">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 md:flex-row">
          <div className="flex items-center gap-4">
            {modelCount !== undefined && metricCount !== undefined && companyCount !== undefined && (
              <span className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                {modelCount} 模型 · {metricCount} benchmark · {companyCount} 公司
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              数据更新时间：{timeText}
            </span>
          </div>
          <div className="text-center md:text-right">
            LLM Radar · 仅采用模型发布方原始论文、技术报告或官方 leaderboard 来源
          </div>
        </div>
      </div>
    </footer>
  );
}
