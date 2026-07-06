import ReactECharts from 'echarts-for-react';
import type { Metric, ModelCard } from '@/types';
import { buildRadarOption } from '@/lib/radar-option';

interface RadarChartProps {
  models: ModelCard[];
  metrics: Metric[];
  selectedMetricIds: string[];
  averageModels?: ModelCard[];
  /** 已选 featured benchmark 数量，用于 section-label 右侧副标 */
  featuredCount?: number;
}

/**
 * 雷达图区块：套用 mockup 的 chart-card 结构（toolbar + legend + chart-wrap + note）。
 * 继续用 ECharts（不换成 SVG），只把视觉主题映射到发丝线风格。
 */
export function RadarChart({
  models,
  metrics,
  selectedMetricIds,
  averageModels,
  featuredCount,
}: RadarChartProps) {
  const option = buildRadarOption(models, metrics, selectedMetricIds, averageModels ?? []);

  if (selectedMetricIds.length === 0) {
    return (
      <section className="chart-block">
        <div className="section-label">
          <span><span className="num">01</span>Radar / Normalized 0–100</span>
          <span className="right">未选 benchmark</span>
        </div>
        <div className="chart-card">
          <div className="chart-empty">请至少选择一个 benchmark</div>
        </div>
      </section>
    );
  }

  const rightLabel = `${selectedMetricIds.length} benchmarks${featuredCount ? ` · ${featuredCount} featured` : ''}`;

  return (
    <section className="chart-block">
      <div className="section-label">
        <span><span className="num">01</span>Radar / Normalized 0–100</span>
        <span className="right">{rightLabel}</span>
      </div>
      <div className="chart-card">
        <div className="chart-toolbar">
          <span className="ctitle">
            Capability Radar<span className="sub">· normalized</span>
          </span>
          <div className="legend">
            {models.map((model) => (
              <span key={model.id} className="legend-item">
                <span
                  className="legend-swatch"
                  style={{ background: model.brand_color }}
                />
                {model.name}
              </span>
            ))}
            {averageModels && averageModels.length > 0 && (
              <span className="legend-item avg">
                <span className="legend-swatch" />
                Avg ({averageModels.length})
              </span>
            )}
          </div>
        </div>
        <div className="chart-wrap">
          <ReactECharts
            option={option}
            className="echart"
            style={{ height: '100%', minHeight: '26rem', width: '100%' }}
          />
        </div>
        <div className="chart-note">
          <span>空心环点 = 该 benchmark 缺失 (N/A)，不计入形状面积</span>
          <span>灰虚线 = 计入平均的模型均值</span>
        </div>
      </div>
    </section>
  );
}
