import { useMemo } from 'react';
import type { Metric, ModelCard } from '@/types';
import {
  buildAveragePoints,
  formatRawValue,
  projectScore,
  resolveSource,
  selectMetrics,
} from '@/lib/radar-option';

interface DataTableProps {
  models: ModelCard[];
  averageModels?: ModelCard[];
  metrics: Metric[];
  selectedMetricIds: string[];
}

/**
 * 数据表格：套用 mockup 的 table.data 语义——
 * 右对齐 tabular-nums、双线表头、平均列 surface-2 浅底、N/A 退后色。
 *
 * 设计原则不变：表格不自判"分数是否缺失"或"raw 如何格式化"，
 * 一律走 projectScore → RadarPoint，再由 formatRawValue/resolveSource 投影成展示文本，
 * 与 tooltip 共享同一份实现。
 */
export function DataTable({ models, averageModels, metrics, selectedMetricIds }: DataTableProps) {
  const selectedMetrics = useMemo(
    () => selectMetrics(metrics, selectedMetricIds),
    [metrics, selectedMetricIds]
  );

  const avgPoints = useMemo(
    () =>
      averageModels && averageModels.length > 0
        ? buildAveragePoints(averageModels, selectedMetrics)
        : [],
    [averageModels, selectedMetrics]
  );

  if (selectedMetrics.length === 0 || models.length === 0) {
    return null;
  }

  const hasAvg = averageModels && averageModels.length > 0;

  return (
    <section className="table-block">
      <div className="section-label">
        <span><span className="num">02</span>Data Table</span>
        <span className="right">raw · normalized · source</span>
      </div>
      <div className="table-card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th className="bench-h">Benchmark</th>
                {models.map((model) => (
                  <th key={model.id}>
                    <span className="swatch-inline" style={{ background: model.brand_color }} />
                    {model.name}
                  </th>
                ))}
                {hasAvg && <th>Avg</th>}
              </tr>
            </thead>
            <tbody>
              {selectedMetrics.map((metric, metricIdx) => (
                <tr key={metric.id}>
                  <td className="bench">
                    {metric.name}
                    <span className="scale">
                      {metric.scale === 'raw' && metric.max_value
                        ? `raw · max ${metric.max_value}`
                        : metric.scale}
                    </span>
                  </td>
                  {models.map((model) => {
                    const point = projectScore(model.scores[metric.id], metric);
                    const source = resolveSource(model, point.source);
                    if (point.missing) {
                      return <td key={model.id} className="na">N/A</td>;
                    }
                    return (
                      <td key={model.id} className="val">
                        {formatRawValue(point.rawValue!, metric)}
                        <span className="norm">归一 {point.value.toFixed(1)}</span>
                        {source && (
                          <a
                            className="src"
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            title={source.title}
                          >
                            {source.title} ↗
                          </a>
                        )}
                      </td>
                    );
                  })}
                  {hasAvg && (
                    <td className="avg-cell">
                      {(() => {
                        const point = avgPoints[metricIdx];
                        if (point.missing) return <span>N/A</span>;
                        return (
                          <>
                            {formatRawValue(point.rawValue!, metric)}
                            <span className="norm">归一 {point.value.toFixed(1)}</span>
                          </>
                        );
                      })()}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
