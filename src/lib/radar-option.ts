import type { EChartsOption, SeriesOption } from 'echarts';
import type { Metric, ModelCard, ScoreEntry } from '@/types';

type RadarSeriesDataItem = NonNullable<Extract<SeriesOption, { type?: 'radar' }>['data']>[number];

/**
 * 雷达图上的一个投影点。
 *
 * 设计原则：投影必须保留"该分数是否缺失"这一领域事实，而非就地抹掉成裸数字。
 * 原因：雷达形状、tooltip、平均线三个消费方都需要"缺失"语义——
 * 若在投影点丢失，下游只能用 `value === 0` 反推，会把真实 0 分误判为 N/A。
 */
export interface RadarPoint {
  /** 归一化到 0–100 区间的值，缺失时为 0（仅供绘图） */
  value: number;
  /** 原始分数缺失（entry 不存在或 value 为 null/undefined） */
  missing: boolean;
  /** 原始分数值（仅非缺失时有效） */
  rawValue?: number;
  /** 原始分数来源 key（仅非缺失时有效） */
  source?: string;
}

/**
 * 将原始分数归一化到 0–100 区间，供雷达图对比不同尺度的 benchmark。
 *
 * 规则：
 * - percentage: 直接使用原值
 * - zero_to_one: 乘以 100
 * - raw: 按 max_value 线性缩放
 * - 缺失值（null/undefined）返回 0，由调用方通过 RadarPoint.missing 区分
 */
export function normalize(value: number, metric: Metric): number {
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
 * 把一条 ScoreEntry 投影为 RadarPoint，保留缺失标记。
 *
 * 这是"分数 → 雷达点"的唯一入口：是否缺失在此单点决定，
 * 下游（形状/tooltip/平均）一律读 RadarPoint.missing，不再各自猜测。
 */
export function projectScore(entry: ScoreEntry | undefined, metric: Metric): RadarPoint {
  if (entry === undefined || entry.value === null || entry.value === undefined) {
    return { value: 0, missing: true };
  }
  return {
    value: normalize(entry.value, metric),
    missing: false,
    rawValue: entry.value,
    source: entry.source,
  };
}

/**
 * 根据当前选中的 metric ids 计算需要绘制的 metric 列表。
 *
 * 实现使用并集：只要被选中就纳入，缺失分数由 RadarPoint.missing 标记，
 * 雷达形状落至中心 0、tooltip 显示 N/A。
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

/**
 * 计算所有模型在指定 metric 上的平均分投影点。
 *
 * 缺失分数（value 为 null/undefined）不计入均值，避免拉低平均；
 * 若某 metric 上所有模型都缺失，则该点 missing=true、value=0（tooltip 显示 N/A）。
 */
export function buildAveragePoints(
  models: ModelCard[],
  selectedMetrics: Metric[]
): RadarPoint[] {
  return selectedMetrics.map((metric) => {
    const values = models
      .map((m) => m.scores[metric.id]?.value)
      .filter((v): v is number => v !== null && v !== undefined);
    if (values.length === 0) return { value: 0, missing: true };
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { value: normalize(avg, metric), missing: false, rawValue: avg };
  });
}

/**
 * 构建 ECharts radar option。
 *
 * tooltip 通过闭包捕获 `pointsByName`（每条系列名 → 各 metric 的 RadarPoint），
 * 用 missing 标记决定显示 N/A 还是不再依赖 `value === 0` 反推，
 * 从而修正"真实 0 分被误显示为 N/A"的旧 bug。
 */
export function buildRadarOption(
  models: ModelCard[],
  metrics: Metric[],
  selectedMetricIds: string[],
  average: boolean | ModelCard[]
): EChartsOption {
  const selectedMetrics = selectMetrics(models, metrics, selectedMetricIds);
  const indicator = selectedMetrics.map((metric) => ({
    name: metric.name,
    max: 100,
  }));

  // 系列名 → 各 metric 的投影点，供 tooltip 闭包查询缺失标记
  const pointsByName = new Map<string, RadarPoint[]>();
  // 系列名 → 模型对象，供 tooltip 查询来源标题
  const modelByName = new Map<string, ModelCard>();

  const seriesData: RadarSeriesDataItem[] = models.map((model) => {
    const points = selectedMetrics.map((metric) =>
      projectScore(model.scores[metric.id], metric)
    );
    pointsByName.set(model.name, points);
    modelByName.set(model.name, model);

    return {
      value: points.map((p) =>
        p.missing
          ? {
              value: p.value,
              itemStyle: {
                color: 'transparent',
                borderColor: model.brand_color,
                borderWidth: 2,
              },
              symbol: 'circle',
              symbolSize: 5,
            }
          : { value: p.value }
      ) as unknown as number[],
      name: model.name,
      itemStyle: {
        color: model.brand_color,
      },
      lineStyle: {
        width: 3,
      },
      emphasis: {
        lineStyle: {
          width: 4,
        },
        areaStyle: {
          color: model.brand_color,
          opacity: 0.15,
        },
      },
    };
  });

  const averageModels = Array.isArray(average) ? average : average && models.length > 0 ? models : [];
  if (averageModels.length > 0) {
    const avgPoints = buildAveragePoints(averageModels, selectedMetrics);
    pointsByName.set('平均', avgPoints);
    seriesData.push({
      value: avgPoints.map((p) => p.value),
      name: '平均',
      itemStyle: { color: '#64748b' },
      lineStyle: {
        type: 'dashed',
        width: 3,
        color: '#64748b',
      },
      areaStyle: { opacity: 0 },
      symbol: 'circle',
      symbolSize: 4,
    });
  }

  return {
    color: models.map((m) => m.brand_color),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
      formatter: (params: unknown) => {
        const p = params as { seriesName?: string };
        const seriesName = p.seriesName ?? '';
        const points = pointsByName.get(seriesName) ?? [];
        const model = modelByName.get(seriesName);
        const lines = [
          `<div style="font-weight:600;margin-bottom:6px;">${seriesName}</div>`,
        ];
        selectedMetrics.forEach((metric, idx) => {
          const point = points[idx];
          const metricLine = `<span style="color:#64748b;">${metric.name}</span>`;
          if (!point || point.missing) {
            lines.push(
              `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;">${metricLine}<span style="font-weight:500;color:#94a3b8;">N/A</span></div>`
            );
            return;
          }
          const rawText =
            metric.scale === 'raw' && metric.max_value !== undefined
              ? `${point.rawValue?.toFixed(1) ?? ''} / ${metric.max_value}`
              : point.rawValue?.toFixed(metric.scale === 'zero_to_one' ? 3 : 1) ?? '';
          const sourceKey = point.source;
          const source = sourceKey
            ? model?.sources.find((s) => s.key === sourceKey)
            : model?.sources[0];
          const sourceLink = source
            ? `<a href="${source.url}" target="_blank" style="color:#4f46e5;text-decoration:none;" title="${source.title}">来源</a>`
            : '';
          lines.push(
            `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;">` +
              `${metricLine}` +
              `<span style="font-weight:500;">${point.value.toFixed(1)} <span style="color:#94a3b8;font-size:11px;">(原始 ${rawText})</span></span>` +
            `</div>`
          );
          if (sourceLink) {
            lines.push(
              `<div style="text-align:right;font-size:11px;margin-bottom:4px;">${sourceLink}</div>`
            );
          }
        });
        return `<div style="font-size:13px;line-height:1.4;">${lines.join('')}</div>`;
      },
    },
    radar: {
      indicator,
      radius: '68%',
      center: ['50%', '50%'],
      splitNumber: 4,
      axisName: {
        color: '#475569',
        fontSize: 12,
        fontWeight: 500,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(241,245,249,0.5)', 'rgba(241,245,249,0.3)', 'rgba(241,245,249,0.2)', 'rgba(241,245,249,0.1)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: '#cbd5e1',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#cbd5e1',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: seriesData,
        symbolSize: 6,
        lineStyle: {
          width: 2.5,
        },
        emphasis: {
          lineStyle: {
            width: 3.5,
          },
        },
      },
    ],
  };
}
