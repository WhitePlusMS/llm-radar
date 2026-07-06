import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
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
 *
 * 直接驱动 echarts（不使用 echarts-for-react）：
 * echarts-for-react v3.0.2 的 initEchartsInstance 监听空实例的 `finished` 事件，
 * 而 echarts 5.5 空初始化不再触发 `finished`，导致 Promise 永不 resolve、
 * setOption 永不调用、首屏 canvas 不渲染（HMR 走 componentDidUpdate 路径才能命中 setOption，
 * 故热重载后看似正常）。直接用 effect 在挂载后 init + setOption，绕过该 wrapper bug。
 *
 * 节点获取用 callback ref + state：容器 div 经 ref 回调写入 state，
 * init effect 依赖该 state——节点 attach 时才触发 init，规避 React 18 StrictMode
 * dev 下 `[]` effect 与 ref 挂载时机的竞态（ref 在 effect 首跑时可能仍为 null）。
 */
export function RadarChart({
  models,
  metrics,
  selectedMetricIds,
  averageModels,
  featuredCount,
}: RadarChartProps) {
  // 容器节点：div attach 时 ref 回调写入；detach 时清空。
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const instRef = useRef<echarts.ECharts | null>(null);

  // 容器 attach → init + ResizeObserver；detach → dispose。
  useEffect(() => {
    if (!container) return;
    const inst = echarts.init(container);
    instRef.current = inst;
    const ro = new ResizeObserver(() => inst.resize());
    ro.observe(container);
    return () => {
      ro.disconnect();
      inst.dispose();
      instRef.current = null;
    };
  }, [container]);

  // option 变化即 setOption（notMerge 避免旧系列残留）。
  const option = buildRadarOption(models, metrics, selectedMetricIds, averageModels ?? []);
  useEffect(() => {
    instRef.current?.setOption(option, { notMerge: true });
  }, [option]);

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
          <div ref={setContainer} className="echart" />
        </div>
        <div className="chart-note">
          <span>缺失的 benchmark 在图上落至中心 0 分，tooltip 中显示为 N/A，不计入形状面积</span>
          <span>灰虚线 = 计入平均的模型均值</span>
        </div>
      </div>
    </section>
  );
}
