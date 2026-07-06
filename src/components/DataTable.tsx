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
 * 数据表格：与雷达 tooltip 同源消费 radar-option 的投影/格式化函数。
 *
 * 设计原则：表格不再自判"分数是否缺失"或"raw 如何格式化"，
 * 一律走 projectScore → RadarPoint，再由 formatRawValue/resolveSource 投影成展示文本，
 * 与 tooltip 共享同一份实现，消除过去 toFixed 分叉与重复 reduce。
 */
export function DataTable({ models, averageModels, metrics, selectedMetricIds }: DataTableProps) {
  // 复用 selectMetrics，避免在表格内再写一份 find/filter
  const selectedMetrics = useMemo(
    () => selectMetrics(metrics, selectedMetricIds),
    [metrics, selectedMetricIds]
  );

  // 平均列复用 buildAveragePoints，避免表格内再写一份 reduce；按 metric 顺序索引
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="h-2 w-2 rounded-full bg-indigo-500" />
        数据表格
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-500">
                Benchmark
              </th>
              {models.map((model) => (
                <th
                  key={model.id}
                  className="px-3 py-2 text-left text-xs font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: model.brand_color }}
                    />
                    <span className="max-w-[8rem] truncate">{model.name}</span>
                  </div>
                </th>
              ))}
              {averageModels && averageModels.length > 0 && (
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
                    平均
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {selectedMetrics.map((metric, metricIdx) => (
              <tr key={metric.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="sticky left-0 z-10 bg-white px-3 py-2">
                  <div className="font-medium text-slate-700">{metric.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {metric.scale === 'raw' && metric.max_value ? `max ${metric.max_value}` : metric.scale}
                  </div>
                </td>
                {models.map((model) => {
                  // 走 projectScore 取 RadarPoint：缺失语义在此单点决定
                  const point = projectScore(model.scores[metric.id], metric);
                  // 来源解析与 tooltip 同源
                  const source = resolveSource(model, point.source);
                  return (
                    <td key={model.id} className="px-3 py-2">
                      <div
                        className={`font-medium ${
                          point.missing ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {/* rawValue 在 !missing 时由 projectScore 保证存在 */}
                        {point.missing ? 'N/A' : formatRawValue(point.rawValue!, metric)}
                      </div>
                      {!point.missing && (
                        <div className="text-xs text-slate-400">归一: {point.value.toFixed(1)}</div>
                      )}
                      {source && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block max-w-[10rem] truncate text-[10px] text-indigo-600 hover:underline"
                          title={source.title}
                        >
                          {source.title}
                        </a>
                      )}
                    </td>
                  );
                })}
                {averageModels && averageModels.length > 0 && (
                  <td className="px-3 py-2">
                    {(() => {
                      const point = avgPoints[metricIdx];
                      if (point.missing) {
                        return <span className="text-slate-300">N/A</span>;
                      }
                      return (
                        <>
                          <div className="font-medium text-slate-600">
                            {formatRawValue(point.rawValue!, metric)}
                          </div>
                          <div className="text-xs text-slate-400">归一: {point.value.toFixed(1)}</div>
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
  );
}
