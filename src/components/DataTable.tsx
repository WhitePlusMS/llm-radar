import { useMemo } from 'react';
import type { Metric, ModelCard, ScoreEntry } from '@/types';
import { normalize } from '@/lib/radar-option';

interface DataTableProps {
  models: ModelCard[];
  averageModels?: ModelCard[];
  metrics: Metric[];
  selectedMetricIds: string[];
}

function formatRaw(value: number, metric: Metric): string {
  if (metric.scale === 'zero_to_one') return value.toFixed(3);
  if (metric.scale === 'raw') return `${value}${metric.max_value ? ` / ${metric.max_value}` : ''}`;
  return value.toFixed(1);
}

function formatScore(entry: ScoreEntry | undefined, metric: Metric): {
  text: string;
  normalized: string;
  missing: boolean;
  sourceKey?: string;
} {
  if (entry === undefined || entry.value === null || entry.value === undefined) {
    return { text: 'N/A', normalized: 'N/A', missing: true };
  }
  return {
    text: formatRaw(entry.value, metric),
    normalized: normalize(entry.value, metric).toFixed(1),
    missing: false,
    sourceKey: entry.source,
  };
}

export function DataTable({ models, averageModels, metrics, selectedMetricIds }: DataTableProps) {
  const selectedMetrics = useMemo(
    () => selectedMetricIds.map((id) => metrics.find((m) => m.id === id)).filter((m): m is Metric => !!m),
    [selectedMetricIds, metrics]
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
            {selectedMetrics.map((metric) => (
              <tr key={metric.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="sticky left-0 z-10 bg-white px-3 py-2">
                  <div className="font-medium text-slate-700">{metric.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {metric.scale === 'raw' && metric.max_value ? `max ${metric.max_value}` : metric.scale}
                  </div>
                </td>
                {models.map((model) => {
                  const score = formatScore(model.scores[metric.id], metric);
                  const source = score.sourceKey
                    ? model.sources.find((s) => s.key === score.sourceKey)
                    : model.sources[0];
                  return (
                    <td key={model.id} className="px-3 py-2">
                      <div
                        className={`font-medium ${
                          score.missing ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {score.text}
                      </div>
                      {!score.missing && (
                        <div className="text-xs text-slate-400">归一: {score.normalized}</div>
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
                      const values = averageModels
                        .map((m) => m.scores[metric.id]?.value)
                        .filter((v): v is number => v !== null && v !== undefined);
                      if (values.length === 0) {
                        return <span className="text-slate-300">N/A</span>;
                      }
                      const avg = values.reduce((a, b) => a + b, 0) / values.length;
                      return (
                        <>
                          <div className="font-medium text-slate-600">{formatRaw(avg, metric)}</div>
                          <div className="text-xs text-slate-400">归一: {normalize(avg, metric).toFixed(1)}</div>
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
