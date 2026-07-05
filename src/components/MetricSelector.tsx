import type { Metric } from '@/types';

interface MetricSelectorProps {
  metrics: Metric[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function MetricSelector({ metrics, selectedIds, onToggle }: MetricSelectorProps) {
  // 按 capability_tags 分组
  const groups = new Map<string, Metric[]>();
  metrics.forEach((metric) => {
    const tag = metric.capability_tags[0] ?? '其他';
    if (!groups.has(tag)) groups.set(tag, []);
    groups.get(tag)!.push(metric);
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">选择 Benchmark</h3>
      <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
        {Array.from(groups.entries()).map(([tag, items]) => (
          <div key={tag}>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
              {tag}
            </div>
            <div className="space-y-1">
              {items.map((metric) => (
                <label
                  key={metric.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(metric.id)}
                    onChange={() => onToggle(metric.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{metric.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
