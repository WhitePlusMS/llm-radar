import type { Metric } from '@/types';

interface MetricSelectorProps {
  metrics: Metric[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function MetricSelector({ metrics, selectedIds, onToggle }: MetricSelectorProps) {
  const groups = new Map<string, Metric[]>();
  metrics.forEach((metric) => {
    const tag = metric.capability_tags[0] ?? '其他';
    if (!groups.has(tag)) groups.set(tag, []);
    groups.get(tag)!.push(metric);
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">选择 Benchmark</h3>
        <span className="text-xs text-slate-400">已选 {selectedIds.length}</span>
      </div>
      <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
        {Array.from(groups.entries()).map(([tag, items]) => (
          <div key={tag}>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              {tag}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {items.map((metric) => {
                const isSelected = selectedIds.includes(metric.id);
                return (
                  <label
                    key={metric.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
                      isSelected ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50'
                    }`}
                    title={metric.description}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(metric.id)}
                      className="h-4 w-4 flex-shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{metric.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
