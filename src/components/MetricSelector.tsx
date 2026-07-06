import type { Metric } from '@/types';

interface MetricSelectorProps {
  metrics: Metric[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onChangeSelected?: (ids: string[]) => void;
}

/**
 * Benchmark 选择面板：对应 mockup 的 .panel（idx 03）。
 * 按 capability 分组的 metric-group + metric-row + 琥珀星标 featured。
 */
export function MetricSelector({ metrics, selectedIds, onToggle, onChangeSelected }: MetricSelectorProps) {
  const groups = new Map<string, Metric[]>();
  metrics.forEach((metric) => {
    const tag = metric.capability_tags[0] ?? '其他';
    if (!groups.has(tag)) groups.set(tag, []);
    groups.get(tag)!.push(metric);
  });

  const featuredIds = metrics.filter((m) => m.featured).map((m) => m.id);
  const allIds = metrics.map((m) => m.id);
  const isAllFeatured = featuredIds.length > 0 && featuredIds.every((id) => selectedIds.includes(id));

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="title"><span className="idx">03</span>Benchmarks</span>
        <div className="actions">
          {onChangeSelected && (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => onChangeSelected(featuredIds)}
                title="恢复默认精选 benchmark"
              >
                默认
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onChangeSelected(allIds)}
                title="展开全部 benchmark"
              >
                全部
              </button>
            </>
          )}
        </div>
      </div>
      <div className="panel-body">
        {Array.from(groups.entries()).map(([tag, items]) => (
          <div className="metric-group" key={tag}>
            <div className="glabel">{tag}</div>
            {items.map((metric) => {
              const isSelected = selectedIds.includes(metric.id);
              return (
                <label
                  key={metric.id}
                  className={`metric-row${isSelected ? ' sel' : ''}`}
                  title={metric.description}
                >
                  <input
                    type="checkbox"
                    className="cb"
                    checked={isSelected}
                    onChange={() => onToggle(metric.id)}
                  />
                  <span className="mname">{metric.name}</span>
                  {metric.featured && <span className="star" title="精选 benchmark">★</span>}
                </label>
              );
            })}
          </div>
        ))}
        <div className="sel-summary">
          <span>已选 <b>{selectedIds.length}</b> / {metrics.length}</span>
          {isAllFeatured && <span>默认精选集</span>}
        </div>
      </div>
    </div>
  );
}
