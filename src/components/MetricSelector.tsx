import type { Metric } from '@/types';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Tooltip } from '@/components/ui/Tooltip';

interface MetricSelectorProps {
  metrics: Metric[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onChangeSelected?: (ids: string[]) => void;
}

/**
 * Benchmark 选择面板：按 capability 分组。
 * 精选集是产品默认路径；完整列表仍保留给技术用户深挖。
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
              <Button
                variant="secondary"
                onClick={() => onChangeSelected(featuredIds)}
                title="恢复默认精选 benchmark"
              >
                默认
              </Button>
              <Button
                variant="secondary"
                onClick={() => onChangeSelected(allIds)}
                title="展开全部 benchmark"
              >
                全部
              </Button>
              <Button variant="ghost" onClick={() => onChangeSelected([])}>
                清空
              </Button>
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
                <div
                  key={metric.id}
                  className={`metric-row${isSelected ? ' sel' : ''}`}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => onToggle(metric.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      onToggle(metric.id);
                    }
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(metric.id)}
                    ariaLabel={`${metric.name} benchmark`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Tooltip content={metric.description}>
                    <span className="mname">{metric.name}</span>
                  </Tooltip>
                  {metric.featured && (
                    <Badge tone="warning" className="metric-featured">
                      <Star size={10} />
                      精选
                    </Badge>
                  )}
                </div>
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
