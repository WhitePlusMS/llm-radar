import { useMemo } from 'react';
import type { Metric, ModelCard } from '@/types';
import { ExternalLink } from 'lucide-react';
import { formatRawValue, projectScore, resolveSource, selectMetrics } from '@/lib/radar-option';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';

interface DataTableProps {
  models: ModelCard[];
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
export function DataTable({ models, metrics, selectedMetricIds }: DataTableProps) {
  const selectedMetrics = useMemo(
    () => selectMetrics(metrics, selectedMetricIds),
    [metrics, selectedMetricIds]
  );

  if (selectedMetrics.length === 0 || models.length === 0) {
    return null;
  }

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
                <th className="model-h">Model</th>
                {selectedMetrics.map((metric) => (
                  <th key={metric.id}>
                    <Tooltip content={metric.description}>
                      <span className="metric-head">
                        <span>{metric.name}</span>
                        {metric.featured && <Badge tone="warning">精选</Badge>}
                      </span>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td className="model">
                    <span className="swatch-inline" style={{ background: model.brand_color }} />
                    {model.name}
                  </td>
                  {selectedMetrics.map((metric) => {
                    const score = model.scores[metric.id] as
                      | (typeof model.scores[string] & { note?: string })
                      | undefined;
                    const point = projectScore(score, metric);
                    const source = resolveSource(model, point.source);
                    if (point.missing) {
                      return (
                        <td key={metric.id} className="na">
                          <span>N/A</span>
                          <small>未报告</small>
                        </td>
                      );
                    }
                    return (
                      <td key={metric.id} className="val">
                        <span className="raw">{formatRawValue(point.rawValue!, metric)}</span>
                        <span className="norm">归一 {point.value.toFixed(1)}</span>
                        {score?.note && (
                          <span className="note" title={score.note}>
                            {score.note}
                          </span>
                        )}
                        {source && (
                          <a
                            className="src"
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            title={source.title}
                          >
                            来源
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
