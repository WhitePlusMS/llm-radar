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
      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500">
        请至少选择一个 benchmark
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />
    </div>
  );
}
