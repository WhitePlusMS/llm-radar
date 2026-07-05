import type { EChartsOption } from 'echarts';
import type { Metric, ModelCard } from '@/types';

/**
 * 将原始分数归一化到 0-100 区间，便于在雷达图上对比不同尺度的 benchmark。
 *
 * 规则：
 * - percentage: 直接使用原值
 * - zero_to_one: 乘以 100
 * - raw: 按 max_value 线性缩放
 * - 缺失值（null）返回 0，并在上层标记为 N/A
 */
export function normalizeScore(value: number | null, metric: Metric): number {
  if (value === null || value === undefined) return 0;

  switch (metric.scale) {
    case 'percentage':
      return value;
    case 'zero_to_one':
      return value * 100;
    case 'raw':
      if (metric.max_value === undefined || metric.max_value === 0) return 0;
      return (value / metric.max_value) * 100;
    default:
      return 0;
  }
}

/**
 * 根据当前选中的 metric ids 计算每个模型的 radar 数据。
 * 只使用所有选中模型都填报了分数的 metric（交集），
 * 还是使用至少一个模型填报了的 metric（并集）。
 *
 * 当前实现使用并集，缺失值落至中心 0 并标记为 N/A。
 */
export function selectMetrics(
  _models: ModelCard[],
  metrics: Metric[],
  selectedMetricIds: string[]
): Metric[] {
  const metricMap = new Map(metrics.map((m) => [m.id, m]));
  return selectedMetricIds
    .map((id) => metricMap.get(id))
    .filter((m): m is Metric => m !== undefined);
}

/** 计算所有模型在指定 metric 上的平均分 */
export function buildAverageSeries(
  models: ModelCard[],
  selectedMetrics: Metric[]
): { value: number[]; name: string } {
  const values = selectedMetrics.map((metric) => {
    const entries = models
      .map((m) => m.scores[metric.id]?.value)
      .filter((v): v is number => v !== null && v !== undefined);
    if (entries.length === 0) return 0;
    const sum = entries.reduce((a, b) => a + b, 0);
    return normalizeScore(sum / entries.length, metric);
  });
  return { value: values, name: '平均' };
}

/** 构建 ECharts radar option */
export function buildRadarOption(
  models: ModelCard[],
  metrics: Metric[],
  selectedMetricIds: string[],
  averageEnabled: boolean
): EChartsOption {
  const selectedMetrics = selectMetrics(models, metrics, selectedMetricIds);
  const indicator = selectedMetrics.map((metric) => ({
    name: metric.name,
    max: 100,
  }));

  const seriesData = models.map((model) => ({
    value: selectedMetrics.map((metric) => {
      const score = model.scores[metric.id];
      return normalizeScore(score?.value ?? null, metric);
    }),
    name: model.name,
    // 缺失值标记：lineStyle.type = 'dashed' 在 series 级别不好按点控制，
    // 这里用 itemStyle 统一处理；更细粒度在组件层处理。
  }));

  if (averageEnabled && models.length > 0) {
    seriesData.push(buildAverageSeries(models, selectedMetrics));
  }

  return {
    color: models.map((m) => m.brand_color),
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { seriesName?: string; value?: number[] };
        const seriesName = p.seriesName ?? '';
        const lines = [`<b>${seriesName}</b>`];
        selectedMetrics.forEach((metric, idx) => {
          const val = p.value?.[idx];
          const display = val === undefined || val === 0 ? 'N/A' : `${val.toFixed(1)}`;
          lines.push(`${metric.name}: ${display}`);
        });
        return lines.join('<br/>');
      },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      data: seriesData.map((s) => s.name),
    },
    radar: {
      indicator,
      radius: '65%',
      splitNumber: 4,
      axisName: {
        color: '#666',
      },
    },
    series: [
      {
        type: 'radar',
        data: seriesData,
        symbolSize: 6,
        lineStyle: {
          width: 2,
        },
      },
    ],
  };
}
