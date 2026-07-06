import ReactECharts from 'echarts-for-react';
import type { Metric, ModelCard } from '@/types';
import { buildRadarOption } from '@/lib/radar-option';

interface RadarChartProps {
  models: ModelCard[];
  metrics: Metric[];
  selectedMetricIds: string[];
  averageEnabled: boolean;
}

export function RadarChart({ models, metrics, selectedMetricIds, averageEnabled }: RadarChartProps) {
  const option = buildRadarOption(models, metrics, selectedMetricIds, averageEnabled);

  if (selectedMetricIds.length === 0) {
    return (
      <div className="flex h-[28rem] items-center justify-center text-slate-400">
        请至少选择一个 benchmark
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-slate-50 px-3 py-2">
        {models.map((model) => (
          <div key={model.id} className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <span
              className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: model.brand_color }}
            />
            <span className="max-w-[10rem] truncate sm:max-w-[12rem]">{model.name}</span>
          </div>
        ))}
        {averageEnabled && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <span className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full border border-slate-400 bg-transparent" />
            <span>平均</span>
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1">
        <ReactECharts option={option} style={{ height: '100%', minHeight: '26rem', width: '100%' }} />
      </div>
    </div>
  );
}
