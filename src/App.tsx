import { useEffect, useMemo, useState } from 'react';
import { loadModelIndex } from '@/data/model-index-loader';
import { useComparison } from '@/hooks/use-comparison';
import { ModelSelector } from '@/components/ModelSelector';
import { MetricSelector } from '@/components/MetricSelector';
import { RadarChart } from '@/components/RadarChart';
import { SourceList } from '@/components/SourceList';
import type { ModelIndex } from '@/types';

function App() {
  const [index, setIndex] = useState<ModelIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [averageEnabled, setAverageEnabled] = useState(true);

  useEffect(() => {
    loadModelIndex()
      .then(setIndex)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  // 默认选中最新 4 个模型，默认选中所有 metric
  const defaultModelIds = useMemo(
    () => (index ? index.models.slice(0, 4).map((m) => m.id) : []),
    [index]
  );
  const defaultMetricIds = useMemo(
    () => (index ? index.metrics.map((m) => m.id) : []),
    [index]
  );

  const {
    selectedModelIds,
    selectedMetricIds,
    toggleModel,
    toggleMetric,
    setModelIds,
    setMetricIds,
  } = useComparison(defaultModelIds, defaultMetricIds);

  // 首次加载且 URL 未指定模型时，自动选中默认模型
  useEffect(() => {
    if (index && selectedModelIds.length === 0 && defaultModelIds.length > 0) {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('models')) {
        setModelIds(defaultModelIds);
      }
    }
  }, [index, selectedModelIds.length, defaultModelIds, setModelIds]);

  // 首次加载且 URL 未指定 benchmark 时，自动选中所有 benchmark
  useEffect(() => {
    if (index && selectedMetricIds.length === 0 && defaultMetricIds.length > 0) {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('metrics')) {
        setMetricIds(defaultMetricIds);
      }
    }
  }, [index, selectedMetricIds.length, defaultMetricIds, setMetricIds]);

  const selectedModels = useMemo(
    () =>
      selectedModelIds
        .map((id) => index?.models.find((m) => m.id === id))
        .filter((m): m is NonNullable<typeof m> => m !== undefined),
    [selectedModelIds, index]
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-red-600">
        加载失败：{error}
      </div>
    );
  }

  if (!index) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-gray-500">
        加载模型索引中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            LLM Radar
          </h1>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            大模型能力雷达图 · {index.meta.model_count} 个模型 · {index.meta.metric_count} 个
            benchmark · 仅采用发布方原始来源
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-3 md:p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <aside className="space-y-4 lg:col-span-3">
            <ModelSelector
              models={index.models}
              selectedIds={selectedModelIds}
              onToggle={toggleModel}
              onSelectAll={setModelIds}
              onClear={() => setModelIds([])}
            />
            <MetricSelector
              metrics={index.metrics}
              selectedIds={selectedMetricIds}
              onToggle={toggleMetric}
            />
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={averageEnabled}
                  onChange={(e) => setAverageEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                显示平均线
              </label>
            </div>
            <SourceList models={selectedModels} />
          </aside>

          <section className="lg:col-span-9">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              {selectedModels.length === 0 ? (
                <div className="flex h-[28rem] items-center justify-center text-slate-400">
                  请至少选择一个模型
                </div>
              ) : (
                <RadarChart
                  models={selectedModels}
                  metrics={index.metrics}
                  selectedMetricIds={selectedMetricIds}
                  averageEnabled={averageEnabled}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
