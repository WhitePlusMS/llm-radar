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
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {models.map((model) => (
          <div key={model.id} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: model.brand_color }}
            />
            <span>{model.name}</span>
          </div>
        ))}
        {averageEnabled && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
            <span>平均</span>
          </div>
        )}
      </div>
      <ReactECharts option={option} style={{ height: '26rem', width: '100%' }} />
    </div>
  );
}
