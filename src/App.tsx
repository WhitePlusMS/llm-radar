import { useEffect, useMemo, useState } from 'react';
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

/** 雷达字标图标：3 同心圆 + 扫掠线 + 中心点，全薄荷。hero 与 favicon 同源。 */
function RadarLogo({ size = 52 }: { size?: number }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="26" cy="26" r="24" stroke="#bbf3dd" strokeWidth="1.2" opacity="0.5" />
      <circle cx="26" cy="26" r="16" stroke="#bbf3dd" strokeWidth="1.2" opacity="0.7" />
      <circle cx="26" cy="26" r="8" stroke="#bbf3dd" strokeWidth="1.2" />
      <line x1="26" y1="26" x2="48" y2="14" stroke="#bbf3dd" strokeWidth="1.6" />
      <circle cx="26" cy="26" r="2.5" fill="#bbf3dd" />
    </svg>
  );
}

function App() {
  const [index, setIndex] = useState<ModelIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  } = useComparison(
    () => defaultModelIds,
    () => defaultMetricIds,
    () => defaultAverageModelIds
  );

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

  // hero / topbar 统计数字与更新日期
  const stats = useMemo(() => {
    const m = index?.meta;
    if (!m) return null;
    const d = new Date(m.generated_at);
    const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    const timeStr = `${dateStr} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
    return {
      modelCount: m.model_count,
      metricCount: m.metric_count,
      companyCount: m.company_count,
      dateStr,
      timeStr,
    };
  }, [index]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ color: 'var(--accent)' }}>
        加载失败：{error}
      </div>
    );
  }

  if (!index) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ color: 'var(--muted)' }}>
        加载模型索引中...
      </div>
    );
  }

  const featuredCount = index.metrics.filter((m) => m.featured).length;

  return (
    <>
      {/* 顶部状态条 */}
      <div className="topbar">
        <div className="inner">
          <span className="brand">LLM<span className="sep">·</span>RADAR</span>
          <div className="topbar-right">
            {stats && <span className="live">UPDATED {stats.dateStr}</span>}
            <a
              className="gh"
              href="https://github.com/WhitePlusMS/llm-radar"
              target="_blank"
              rel="noreferrer"
              title="GitHub 仓库"
            >
              <svg
                className="gh-mark"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.54-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* hero */}
      <header className="masthead">
        <div className="inner">
          <div>
            <div className="kicker">A Benchmark Index · Primary Sources Only</div>
            <div className="wordmark">
              <RadarLogo />
              <h1>
                LLM<span className="dot">·</span>RADAR<span className="cursor" aria-hidden="true" />
              </h1>
            </div>
            <p className="deck">
              前沿大模型能力雷达。只采用发布方原始来源，不做二次拟合——让分数自己说话。点选模型与 benchmark，看它们在哪些维度真正拉开差距。
            </p>
          </div>
          {stats && (
            <div className="stats" aria-label="索引统计">
              <div className="s"><div className="sv">{stats.modelCount}</div><div className="sl">Models</div></div>
              <div className="s"><div className="sv">{stats.metricCount}</div><div className="sl">Benchmarks</div></div>
              <div className="s"><div className="sv">{stats.companyCount}</div><div className="sl">Labs</div></div>
              <div className="s"><div className="sv">100%</div><div className="sl">Primary Src</div></div>
            </div>
          )}
        </div>
      </header>

      {/* 主体 */}
      <div className="layout">
        <main>
          <RadarChart
            models={selectedModels}
            metrics={index.metrics}
            selectedMetricIds={selectedMetricIds}
            averageModels={averageModels}
            featuredCount={featuredCount}
          />

          <DataTable
            models={selectedModels}
            averageModels={averageModels}
            metrics={index.metrics}
            selectedMetricIds={selectedMetricIds}
          />

          <SourceList models={selectedModels} />
        </main>

        <aside>
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

          {/* 模型信息面板：包裹多个 info-card 的 panel shell */}
          {selectedModels.length > 0 && (
            <div className="panel">
              <div className="panel-head">
                <span className="title"><span className="idx">02</span>Model Info</span>
              </div>
              <div className="panel-body">
                {selectedModels.map((model) => (
                  <ModelInfoPanel
                    key={model.id}
                    model={model}
                    company={index.companies.find((c) => c.key === model.company)}
                  />
                ))}
              </div>
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

      <Footer
        generatedAt={index.meta.generated_at}
        modelCount={index.meta.model_count}
        metricCount={index.meta.metric_count}
        companyCount={index.meta.company_count}
      />
    </>
  );
}

export default App;
