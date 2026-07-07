import type { EChartsOption } from 'echarts';
import type { Metric, ModelCard, ScoreEntry, Source } from '@/types';

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
  /** 原始分数口径说明（仅非缺失时有效） */
  note?: string;
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
    note: entry.note,
  };
}

/**
 * 把原始分数格式化为展示文本——tooltip 与 DataTable 同源消费此函数，
 * 以消除过去 raw 分支在两处分别 toFixed(1) / 不 toFixed 的静默分叉 bug。
 *
 * 规则（与领域约定一致）：
 * - percentage: toFixed(1)
 * - zero_to_one: toFixed(3)
 * - raw: 原值直出不 toFixed（保留 ELO 这类整数分数的可读性），
 *        若 metric 提供 max_value 则追加 " / {max_value}"
 */
export function formatRawValue(value: number, metric: Metric): string {
  switch (metric.scale) {
    case 'percentage':
      return value.toFixed(1);
    case 'zero_to_one':
      return value.toFixed(3);
    case 'raw':
      return metric.max_value !== undefined && metric.max_value !== 0
        ? `${value} / ${metric.max_value}`
        : `${value}`;
    default:
      return `${value}`;
  }
}

/**
 * 解析分数来源：entry.source 指定则按 key 在 model.sources 中查找，
 * 否则 fallback 到 model.sources[0]（与领域约定一致）。
 *
 * tooltip 与 DataTable 同源消费此函数，避免两处各写一份 find/fallback。
 */
export function resolveSource(model: ModelCard, sourceKey?: string): Source | undefined {
  if (sourceKey) {
    return model.sources.find((s) => s.key === sourceKey);
  }
  return model.sources[0];
}

/**
 * 根据当前选中的 metric ids 计算需要绘制的 metric 列表。
 *
 * 实现使用并集：只要被选中就纳入，缺失分数由 RadarPoint.missing 标记，
 * 雷达形状落至中心 0、tooltip 显示 N/A。
 *
 * 注：旧签名带 `_models` 参数但全程未读，已删除（不做向后兼容）。
 */
export function selectMetrics(
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
  const selectedMetrics = selectMetrics(metrics, selectedMetricIds);
  const indicator = selectedMetrics.map((metric) => ({
    name: metric.name,
    min: 0,
    max: 100,
  }));

  // 系列名 → 各 metric 的投影点，供 tooltip 闭包查询缺失标记
  const pointsByName = new Map<string, RadarPoint[]>();
  // 系列名 → 模型对象，供 tooltip 查询来源标题
  const modelByName = new Map<string, ModelCard>();

  // 每个模型独立一个 radar series：ECharts 对同一 series 内多个 data item 的鼠标命中策略
  // 在雷达图上不可靠（总是命中 data[0]），拆成独立 series 后用 z 层级控制，hover 才能正确响应模型。
  const modelSeries = models.map((model) => {
    const points = selectedMetrics.map((metric) =>
      projectScore(model.scores[metric.id], metric)
    );
    pointsByName.set(model.name, points);
    modelByName.set(model.name, model);

    return {
      type: 'radar' as const,
      name: model.name,
      z: 2,
      data: [
        {
          value: points.map((p) => p.value),
          name: model.name,
          itemStyle: { color: model.brand_color },
          lineStyle: { width: 1.8, color: model.brand_color },
          areaStyle: { color: model.brand_color, opacity: 0.10 },
          symbol: 'circle',
          symbolSize: 5,
        },
      ],
      emphasis: {
        lineStyle: { width: 2.4 },
        areaStyle: { color: model.brand_color, opacity: 0.20 },
      },
    };
  });

  const averageModels = Array.isArray(average) ? average : average && models.length > 0 ? models : [];
  const avgSeries =
    averageModels.length > 0
      ? (() => {
          const avgPoints = buildAveragePoints(averageModels, selectedMetrics);
          pointsByName.set('平均', avgPoints);
          return {
            type: 'radar' as const,
            name: '平均',
            z: 1,
            silent: true,
            data: [
              {
                value: avgPoints.map((p) => p.value),
                name: '平均',
                itemStyle: { color: '#475569' },
                lineStyle: { type: 'dashed' as const, width: 1.3, color: '#475569' },
                areaStyle: { opacity: 0 },
                symbol: 'circle',
                symbolSize: 4,
              },
            ],
          };
        })()
      : null;

  // 生成单个系列（模型/平均）的 tooltip 内容块；hover 卡片只展示分数，来源放到 DataTable / SourceList。
  const buildSeriesTip = (seriesName: string): string => {
    const points = pointsByName.get(seriesName) ?? [];
    const lines: string[] = [];
    selectedMetrics.forEach((metric, idx) => {
      const point = points[idx];
      const metricLine = `<span style="color:#475569;">${metric.name}</span>`;
      if (!point || point.missing) {
        lines.push(
          `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;">${metricLine}<span style="font-weight:500;color:#94a3b8;">N/A</span></div>`
        );
        return;
      }
      const rawText =
        point.rawValue !== undefined ? formatRawValue(point.rawValue, metric) : '';
      lines.push(
        `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;">` +
          `${metricLine}` +
          `<span style="font-weight:600;color:#0f172a;font-variant-numeric:tabular-nums;">${point.value.toFixed(1)} <span style="color:#94a3b8;font-size:11px;font-weight:400;">(原始 ${rawText})</span></span>` +
        `</div>`
      );
    });
    return `<div style="line-height:1.5;">${lines.join('')}</div>`;
  };

  return {
    color: models.map((m) => m.brand_color),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: '#1e293b',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 12,
      },
      formatter: (params: unknown) => {
        const p = params as { seriesName?: string };
        const seriesName = p.seriesName ?? '';
        const color = seriesName === '平均' ? '#475569' : modelByName.get(seriesName)?.brand_color ?? '#0f172a';
        return (
          `<div style="line-height:1.5;">` +
            `<div style="font-weight:700;color:${color};margin-bottom:6px;letter-spacing:0.02em;display:flex;align-items:center;gap:6px;">` +
              `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};"></span>` +
              seriesName +
            `</div>` +
            buildSeriesTip(seriesName) +
          `</div>`
        );
      },
    },
    radar: {
      indicator,
      radius: '76%',
      center: ['50%', '50%'],
      splitNumber: 4,
      scale: false,
      axisName: {
        color: '#1e293b',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      },
      // 发丝线风格：移除 splitArea 填充，环/轴用 slate-200 发丝线
      splitArea: { show: false },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
          width: 1,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
          width: 1,
        },
      },
    },
    series: avgSeries ? [avgSeries, ...modelSeries] : modelSeries,
  };
}
