import { useEffect, useMemo, useRef, useState } from 'react';
import { Radar, BarChart3 } from 'lucide-react';
import { loadModelIndex } from '@/data/model-index-loader';
import { useComparison } from '@/hooks/use-comparison';
import { ModelSelector } from '@/components/ModelSelector';
import { MetricSelector } from '@/components/MetricSelector';
import { RadarChart } from '@/components/RadarChart';
import { SourceList } from '@/components/SourceList';
import { ModelInfoPanel } from '@/components/ModelInfoPanel';
import { DataTable } from '@/components/DataTable';
import { Footer } from '@/components/Footer';
import type { ModelIndex } from '@/types';

function App() {
  const [index, setIndex] = useState<ModelIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultsAppliedRef = useRef(false);

  useEffect(() => {
    loadModelIndex()
      .then(setIndex)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  // 默认选中最新 4 个模型；默认所有模型都计入平均；默认 metrics 为 featured 精选集。
  const defaultModelIds = useMemo(
    () => (index ? index.models.slice(0, 4).map((m) => m.id) : []),
    [index]
  );
  const defaultMetricIds = useMemo(
    () => (index ? index.metrics.filter((m) => m.featured).map((m) => m.id) : []),
    [index]
  );
  const defaultAverageModelIds = useMemo(
    () => (index ? index.models.map((m) => m.id) : []),
    [index]
  );

  const {
    selectedModelIds,
    selectedMetricIds,
    averageModelIds,
    toggleModel,
    toggleMetric,
    toggleAverage,
    setModelIds,
    setMetricIds,
    setAverageModelIds,
  } = useComparison(defaultModelIds, defaultMetricIds, defaultAverageModelIds);

  // 首次加载且 URL 未指定选择时，自动应用默认值；仅执行一次，避免清空后自动恢复
  useEffect(() => {
    if (!index || defaultsAppliedRef.current) return;
    defaultsAppliedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    if (!params.has('models') && defaultModelIds.length > 0) {
      setModelIds(defaultModelIds);
    }
    if (!params.has('metrics') && defaultMetricIds.length > 0) {
      setMetricIds(defaultMetricIds);
    }
    if (!params.has('avg') && defaultAverageModelIds.length > 0) {
      setAverageModelIds(defaultAverageModelIds);
    }
  }, [index, defaultModelIds, defaultMetricIds, defaultAverageModelIds, setModelIds, setMetricIds, setAverageModelIds]);

  const selectedModels = useMemo(
    () =>
      selectedModelIds
        .map((id) => index?.models.find((m) => m.id === id))
        .filter((m): m is NonNullable<typeof m> => m !== undefined),
    [selectedModelIds, index]
  );

  const averageModels = useMemo(
    () =>
      averageModelIds
        .map((id) => index?.models.find((m) => m.id === id))
        .filter((m): m is NonNullable<typeof m> => m !== undefined),
    [averageModelIds, index]
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                LLM Radar
              </h1>
              <p className="text-xs text-slate-500 md:text-sm">
                大模型能力雷达图 · {index.meta.model_count} 个模型 · {index.meta.metric_count} 个
                benchmark · 仅采用发布方原始来源
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-3 md:p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 移动端：图表优先展示；桌面端：右侧主内容 */}
          <section className="order-1 lg:order-2 lg:col-span-9">
            <div className="flex h-[28rem] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:h-[36rem] md:p-5 lg:h-[42rem]">
              {selectedModels.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
                  <BarChart3 className="h-12 w-12 text-slate-300" />
                  <p className="text-sm md:text-base">请至少选择一个模型以查看雷达图</p>
                </div>
              ) : (
                <RadarChart
                  models={selectedModels}
                  metrics={index.metrics}
                  selectedMetricIds={selectedMetricIds}
                  averageModels={averageModels}
                />
              )}
            </div>

            {/* 数据表格与来源放在图表下方，桌面端全宽展示 */}
            <div className="mt-4">
              <DataTable
                models={selectedModels}
                averageModels={averageModels}
                metrics={index.metrics}
                selectedMetricIds={selectedMetricIds}
              />
            </div>
            <div className="mt-4">
              <SourceList models={selectedModels} />
            </div>
          </section>

          {/* 移动端：控制面板在图表下方；桌面端：左侧边栏 */}
          <aside className="order-2 space-y-4 lg:order-1 lg:col-span-3 lg:self-start">
            <ModelSelector
              models={index.models}
              companies={index.companies}
              selectedIds={selectedModelIds}
              averageIds={averageModelIds}
              onToggle={toggleModel}
              onToggleAverage={toggleAverage}
              onSelectAll={setModelIds}
              onClear={() => {
                setModelIds([]);
                setAverageModelIds([]);
              }}
            />

            {/* 选中模型信息卡片 */}
            {selectedModels.length > 0 && (
              <div className="space-y-3">
                <h3 className="px-1 text-sm font-semibold text-slate-800">模型信息</h3>
                {selectedModels.map((model) => (
                  <ModelInfoPanel
                    key={model.id}
                    model={model}
                    company={index.companies.find((c) => c.key === model.company)}
                  />
                ))}
              </div>
            )}

            <MetricSelector
              metrics={index.metrics}
              selectedIds={selectedMetricIds}
              onToggle={toggleMetric}
              onChangeSelected={setMetricIds}
            />
          </aside>
        </div>
      </main>

      <Footer
        generatedAt={index.meta.generated_at}
        modelCount={index.meta.model_count}
        metricCount={index.meta.metric_count}
        companyCount={index.meta.company_count}
      />
    </div>
  );
}

export default App;
